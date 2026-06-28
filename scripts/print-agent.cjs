const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ptp = require("pdf-to-printer");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

let db;

try {
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ ERROR: serviceAccountKey.json not found!");
    console.log(
      "Please download it from Firebase Console and put it in the project root.",
    );
    process.exit(1);
  }

  const serviceAccount = require(serviceAccountPath);

  initializeApp({
    credential: cert(serviceAccount),
  });

  db = getFirestore();
  console.log("🔥 Firebase Admin initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error);
  process.exit(1);
}

// Get printers using PowerShell directly (more reliable)
async function getPrinters() {
  try {
    const { stdout } = await execAsync(
      'powershell -Command "Get-CimInstance Win32_Printer | Select-Object -ExpandProperty Name"',
    );

    const printers = stdout
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return printers;
  } catch (error) {
    console.error("❌ Error getting printers:", error);
    return [];
  }
}

async function main() {
  try {
    // Publish available printers to Firestore
    const printers = await getPrinters();
    console.log(`✅ Found ${printers.length} printers:`, printers);

    await db.collection("system").doc("printers").set({
      available: printers,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log("✅ Published printers to Firestore");
    console.log("🖨️ Print Agent started. Listening for orders...");

    // Listen for new paid orders that haven't been printed yet
    db.collection("orders")
      .where("paymentStatus", "==", "paid")
      .where("status", "==", "queued")
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added" || change.type === "modified") {
              const order = change.doc.data();
              const docId = change.doc.id;

              console.log(`📦 New Order Detected: ${order.orderId}`);
              await processOrder(docId, order);
            }
          });
        },
        (error) => {
          console.error("❌ Firestore listener error:", error);
        },
      );
  } catch (error) {
    console.error("❌ Error in main():", error);
  }
}

async function processOrder(docId, order) {
  const safeFileName = (order.fileName || "document.pdf").replace(
    /[<>:"/\\|?*]+/g,
    "_",
  );

  const tempFilePath = path.join(
    __dirname,
    `temp_${order.orderId || docId}_${safeFileName}`,
  );

  try {
    // Validate required fields
    if (!order.fileUrl) {
      throw new Error("Missing fileUrl in order");
    }

    if (!order.fileName) {
      console.warn("⚠️ fileName missing in order, using default name");
    }

    // 1. Update status to 'printing'
    await db.collection("orders").doc(docId).update({
      status: "printing",
      startedAt: FieldValue.serverTimestamp(),
    });

    console.log(
      `🔄 Status updated to 'printing' for ${order.orderId || docId}`,
    );

    // 2. Download the file
    console.log(`📥 Downloading ${order.fileName || "document.pdf"}...`);

    const response = await axios({
      url: order.fileUrl,
      method: "GET",
      responseType: "stream",
      timeout: 60000,
    });

    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`✅ Download complete: ${tempFilePath}`);

    // 3. Trigger Print
    const selectedPrinter = order.printer;
    const copies = Number(order.copies) > 0 ? Number(order.copies) : 1;

    console.log(
      `🖨️ Sending to printer: ${selectedPrinter || "default"} | Copies: ${copies}`,
    );

    const printOptions = {
      copies,
    };

    if (selectedPrinter) {
      printOptions.printer = selectedPrinter;
    }

    await ptp.print(tempFilePath, printOptions);

    console.log(
      `🎉 Printed ${copies} copies of ${order.fileName || "document.pdf"}`,
    );

    // 4. Update status to 'printed'
    await db.collection("orders").doc(docId).update({
      status: "printed",
      printedAt: FieldValue.serverTimestamp(),
      error: null,
    });

    console.log(`✅ Order ${order.orderId || docId} marked as 'printed'`);
  } catch (error) {
    console.error(
      `❌ Error processing order ${order.orderId || docId}:`,
      error,
    );

    try {
      await db.collection("orders").doc(docId).update({
        status: "failed",
        error: error.message || String(error),
        failedAt: FieldValue.serverTimestamp(),
      });
    } catch (updateError) {
      console.error("❌ Could not update order status:", updateError);
    }
  } finally {
    // 5. Clean up temp file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log("🧹 Temp file deleted");
      }
    } catch (cleanupError) {
      console.warn(
        `⚠️ Could not delete temp file: ${cleanupError.message}`,
      );
    }
  }
}

main();