const crypto = require("crypto");
const express = require("express");
const { db } = require("../db");
const { ownerId } = require("../ownerId");
const { isConfigured } = require("../razorpay");

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s-]{7,15}$/;

function generateReferenceNumber() {
  return `WN-${Date.now().toString(36).toUpperCase()}`;
}

function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return expected === razorpaySignature;
}

router.post("/", (req, res) => {
  const { name, email, phone, address, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};
  if (
    !name || !String(name).trim() ||
    !EMAIL_PATTERN.test(email || "") ||
    !PHONE_PATTERN.test(phone || "") ||
    !address || !String(address).trim()
  ) {
    return res.status(400).json({ error: "Name, valid email, valid phone and address are required." });
  }

  // Payment is required once the gateway is configured; until Razorpay keys
  // are added to .env, orders go through unpaid so checkout stays testable.
  let paymentStatus = "not_required";
  if (isConfigured) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: "Payment was not completed." });
    }
    if (!verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
      return res.status(400).json({ error: "Payment verification failed." });
    }
    paymentStatus = "paid";
  }

  const owner = ownerId(req);
  const cartRows = db
    .prepare(
      `SELECT ci.quantity, p.id as product_id, p.name as product_name, p.price
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.owner_id = ?`
    )
    .all(owner);

  if (cartRows.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const subtotal = cartRows.reduce((sum, r) => sum + r.price * r.quantity, 0);
  const referenceNumber = generateReferenceNumber();

  const placeOrder = db.transaction(() => {
    const info = db
      .prepare(
        `INSERT INTO orders (reference_number, user_id, name, email, phone, address, subtotal, payment_status, razorpay_order_id, razorpay_payment_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        referenceNumber,
        req.session.userId || null,
        String(name).trim(),
        String(email).trim(),
        String(phone).trim(),
        String(address).trim(),
        subtotal,
        paymentStatus,
        razorpayOrderId || null,
        razorpayPaymentId || null
      );

    const orderId = info.lastInsertRowid;
    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, name, price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    for (const r of cartRows) {
      insertItem.run(orderId, r.product_id, r.product_name, r.price, r.quantity, r.price * r.quantity);
    }
    db.prepare("DELETE FROM cart_items WHERE owner_id = ?").run(owner);
    return orderId;
  });

  const orderId = placeOrder();
  res.status(201).json({ id: orderId, referenceNumber, subtotal, paymentStatus });
});

router.get("/", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Login required to view order history." });
  const orders = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.session.userId);
  const itemsStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  res.json(
    orders.map((o) => ({
      id: o.id,
      referenceNumber: o.reference_number,
      subtotal: o.subtotal,
      paymentStatus: o.payment_status,
      createdAt: o.created_at,
      items: itemsStmt.all(o.id)
    }))
  );
});

module.exports = router;
