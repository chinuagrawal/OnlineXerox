const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PhonePe Credentials (Replace with your own)
const MERCHANT_ID = "YOUR_MERCHANT_ID";
const SALT_KEY = "YOUR_SALT_KEY";
const SALT_INDEX = 1;
const PHONEPE_API_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"; // Use production URL for live

app.post('/api/pay', async (req, res) => {
  const { amount, transactionId, merchantUserId } = req.body;

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: merchantUserId,
    amount: amount * 100, // Amount in paise
    redirectUrl: `http://localhost:3000/status`, // Redirect after payment
    redirectMode: "REDIRECT",
    callbackUrl: `https://your-domain.com/api/callback`, // Webhook
    paymentInstrument: {
      type: "PAY_PAGE"
    }
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString('base64');
  const stringToSign = base64Payload + "/pg/v1/pay" + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const xVerify = sha256 + "###" + SALT_INDEX;

  try {
    const response = await axios.post(PHONEPE_API_URL, {
      request: base64Payload
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'accept': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Callback/Webhook endpoint for real payment verification
app.post('/api/callback', (req, res) => {
  // Verify checksum and update Firestore order status here
  res.sendStatus(200);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Payment Server running on port ${PORT}`));
