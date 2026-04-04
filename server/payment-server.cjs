const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
} = require("@phonepe-pg/pg-sdk-node");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PhonePe Credentials from Environment Variables
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "YOUR_MERCHANT_ID";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "YOUR_SALT_KEY";
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || 1;
const ENV =
  process.env.PHONEPE_ENV === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;

// Initialize PhonePe SDK Client (V2 flow)
const client = StandardCheckoutClient.getInstance(
  MERCHANT_ID,
  SALT_KEY,
  SALT_INDEX,
  ENV,
);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

app.post("/api/pay", async (req, res) => {
  const { amount, merchantUserId, orderData } = req.body;
  const merchantTransactionId = `TXN-${uuidv4().slice(0, 8).toUpperCase()}`;

  try {
    // Build the V2 Checkout Request
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantTransactionId)
      .amount(Math.round(parseFloat(amount) * 100)) // Amount in paise
      .redirectUrl(`${FRONTEND_URL}/status?txnId=${merchantTransactionId}`)
      // In V2 flow, we can pass additional metadata if needed
      .build();

    const response = await client.pay(request);

    // Send back the redirect URL to the frontend
    res.json({
      success: true,
      redirectUrl: response.redirectUrl,
      merchantTransactionId: merchantTransactionId,
    });
  } catch (error) {
    console.error("PhonePe V2 Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Callback/Webhook endpoint for real payment verification
app.post("/api/callback", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const callbackBody = JSON.stringify(req.body);

  try {
    // Validate the callback using SDK (V2)
    // Note: You need your configured webhook username/password from PhonePe dashboard
    const isValid = client.validateCallback(
      process.env.WEBHOOK_USER || "admin",
      process.env.WEBHOOK_PASS || "password",
      authHeader,
      callbackBody,
    );

    if (isValid) {
      const { state, merchantOrderId } = req.body.payload;
      if (state === "COMPLETED") {
        // Update Firestore order status here if needed
        console.log(`Payment success for ${merchantOrderId}`);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Callback verification failed:", error);
    res.sendStatus(401);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 PhonePe V2 Payment Server running on port ${PORT}`),
);
