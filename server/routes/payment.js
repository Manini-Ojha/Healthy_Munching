const express = require("express");
const { all, rowToProduct } = require("../db");
const { ownerId } = require("../ownerId");
const { razorpay, isConfigured, keyId } = require("../razorpay");

const router = express.Router();

router.get("/config", (req, res) => {
  res.json({ configured: isConfigured, keyId: isConfigured ? keyId : null });
});

router.post("/create-order", async (req, res) => {
  if (!isConfigured) {
    return res.status(503).json({ error: "Payment gateway not configured yet. Add Razorpay keys to .env to enable checkout." });
  }

  const owner = ownerId(req);
  const cartRows = await all(
    `SELECT ci.quantity, p.* FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.owner_id = ?`,
    [owner]
  );

  if (cartRows.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const subtotal = cartRows.reduce((sum, r) => sum + rowToProduct(r).price * r.quantity, 0);

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: subtotal * 100, // Razorpay expects the amount in paise.
      currency: "INR",
      receipt: `cart-${owner}-${Date.now()}`
    });
    res.json({ razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, keyId, subtotal });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(502).json({ error: "Could not start payment. Please try again." });
  }
});

module.exports = router;
