const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ptp = require('pdf-to-printer');

// Replace with path to your service account key file
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Update with your DB URL if using RTDB
});

const db = admin.firestore();

console.log("🖨️ Print Agent started. Listening for orders...");

// Listen for new paid orders that haven't been printed yet
db.collection('orders')
  .where('paymentStatus', '==', 'paid')
  .where('status', '==', 'queued')
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added' || change.type === 'modified') {
        const order = change.doc.data();
        const orderId = change.doc.id;

        console.log(`📦 New Order Detected: ${order.orderId}`);
        await processOrder(orderId, order);
      }
    });
  });

async function processOrder(docId, order) {
  const tempFilePath = path.join(__dirname, `temp_${order.orderId}_${order.fileName}`);

  try {
    // 1. Update status to 'printing'
    await db.collection('orders').doc(docId).update({ status: 'printing' });
    console.log(`🔄 Status updated to 'printing' for ${order.orderId}`);

    // 2. Download the file
    console.log(`📥 Downloading ${order.fileName}...`);
    const response = await axios({
      url: order.fileUrl,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    console.log(`✅ Download complete.`);

    // 3. Trigger Print
    console.log(`🖨️ Sending to local printer...`);
    
    // For Windows, pdf-to-printer works well with PDFs
    // If it's an image or docx, you might need other tools or convert them
    await ptp.print(tempFilePath, {
      copies: order.copies,
      // You can add more options based on order.paper and order.colorMode
      // orientation: order.paper === 'a3' ? 'landscape' : 'portrait'
    });
    
    console.log(`🎉 Printed ${order.copies} copies of ${order.fileName}`);

    // 4. Update status to 'printed'
    await db.collection('orders').doc(docId).update({ status: 'printed' });
    console.log(`✅ Order ${order.orderId} marked as 'printed'`);

    // 5. Clean up temp file
    fs.unlinkSync(tempFilePath);

  } catch (error) {
    console.error(`❌ Error processing order ${order.orderId}:`, error);
    await db.collection('orders').doc(docId).update({ status: 'failed', error: error.message });
  }
}
