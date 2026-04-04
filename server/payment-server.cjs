const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PhonePe Credentials from Environment Variables
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "YOUR_MERCHANT_ID";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "YOUR_SALT_KEY";
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || 1;
const PHONEPE_API_URL =
  process.env.PHONEPE_API_URL ||
  "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

const REDIRECT_URL = process.env.FRONTEND_URL
  ? `${process.env.FRONTEND_URL}/status`
  : "http://localhost:3000/status";
const CALLBACK_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api/callback`
  : "https://your-domain.com/api/callback";

app.post("/api/pay", async (req, res) => {
  const { amount, transactionId, merchantUserId } = req.body;

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: merchantUserId,
    amount: amount * 100, // Amount in paise
    redirectUrl: REDIRECT_URL,
    redirectMode: "REDIRECT",
    callbackUrl: CALLBACK_URL,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString("base64");
  const stringToSign = base64Payload + "/pg/v1/pay" + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToSign).digest("hex");
  const xVerify = sha256 + "###" + SALT_INDEX;

  try {
    const response = await axios.post(
      PHONEPE_API_URL,
      {
        request: base64Payload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          accept: "application/json",
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Callback/Webhook endpoint for real payment verification
app.post("/api/callback", (req, res) => {
  // Verify checksum and update Firestore order status here
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Payment Server running on port ${PORT}`),
);
