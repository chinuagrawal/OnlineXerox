const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ptp = require("pdf-to-printer");
const readline = require("readline");

const CONFIG_PATH = path.join(__dirname, "print-agent-config.json");
let config;
let db;

try {
  // Try to load service account key
  const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
  if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ ERROR: serviceAccountKey.json not found!");
    console.log(
      "Please download it from Firebase Console and put it in the project root.",
    );
    process.exit(1);
  }

  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();
  console.log("🔥 Firebase Admin initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error.message);
  process.exit(1);
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

async function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    console.log(`✅ Loaded config, using printer: ${config.printer}`);
    console.log(
      `   To change printer, delete ${CONFIG_PATH} and restart the agent, or edit the file directly.`,
    );
  } else {
    console.log("📋 No config found, let's set up your printer!");
    const printers = await ptp.getPrinters();

    if (printers.length === 0) {
      console.error("❌ No printers found! Please install a printer first.");
      process.exit(1);
    }

    console.log("\nAvailable printers:");
    printers.forEach((p, i) => console.log(`  [${i + 1}] ${p.name}`));

    const answer = await askQuestion(
      `\nSelect a printer (enter number 1-${printers.length}): `,
    );
    const index = parseInt(answer) - 1;

    if (isNaN(index) || index < 0 || index >= printers.length) {
      console.error("❌ Invalid selection! Using first printer as default.");
      config = { printer: printers[0].name };
    } else {
      config = { printer: printers[index].name };
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(`\n✅ Config saved! Using printer: ${config.printer}`);
  }
}

async function main() {
  await loadConfig();

  // Publish available printers to Firestore
  const printers = await ptp.getPrinters();
  const printerNames = printers.map((p) => p.name);
  await db.collection("system").doc("printers").set({
    available: printerNames,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`✅ Published ${printerNames.length} printers to Firestore`);

  console.log("🖨️ Print Agent started. Listening for orders...");

  // Listen for new paid orders that haven't been printed yet
  db.collection("orders")
    .where("paymentStatus", "==", "paid")
    .where("status", "==", "queued")
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added" || change.type === "modified") {
          const order = change.doc.data();
          const docId = change.doc.id;

          console.log(`📦 New Order Detected: ${order.orderId}`);
          await processOrder(docId, order);
        }
      });
    });
}

main();

async function processOrder(docId, order) {
  const tempFilePath = path.join(
    __dirname,
    `temp_${order.orderId}_${order.fileName}`,
  );

  try {
    // 1. Update status to 'printing'
    await db.collection("orders").doc(docId).update({ status: "printing" });
    console.log(`🔄 Status updated to 'printing' for ${order.orderId}`);

    // 2. Download the file
    console.log(`📥 Downloading ${order.fileName}...`);
    const response = await axios({
      url: order.fileUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    console.log(`✅ Download complete.`);

    // 3. Trigger Print
    const selectedPrinter = order.printer || config.printer;
    console.log(`🖨️ Sending to printer: ${selectedPrinter}`);

    // For Windows, pdf-to-printer works well with PDFs
    // If it's an image or docx, you might need other tools or convert them
    await ptp.print(tempFilePath, {
      printer: selectedPrinter,
      copies: order.copies,
      // You can add more options based on order.paper and order.colorMode
      // orientation: order.paper === 'a3' ? 'landscape' : 'portrait'
    });

    console.log(`🎉 Printed ${order.copies} copies of ${order.fileName}`);

    // 4. Update status to 'printed'
    await db.collection("orders").doc(docId).update({ status: "printed" });
    console.log(`✅ Order ${order.orderId} marked as 'printed'`);

    // 5. Clean up temp file
    try {
      fs.unlinkSync(tempFilePath);
    } catch (cleanupError) {
      console.warn(`⚠️ Could not delete temp file: ${cleanupError.message}`);
    }
  } catch (error) {
    console.error(`❌ Error processing order ${order.orderId}:`, error);
    try {
      await db
        .collection("orders")
        .doc(docId)
        .update({ status: "failed", error: error.message });
    } catch (updateError) {
      console.error(`❌ Could not update order status:`, updateError);
    }
  }
}
