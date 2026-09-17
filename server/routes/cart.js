const express = require("express");
const { db, rowToProduct } = require("../db");
const { ownerId } = require("../ownerId");

const router = express.Router();

function getCartPayload(owner) {
  const rows = db
    .prepare(
      `SELECT ci.product_id, ci.quantity, p.*
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.owner_id = ?`
    )
    .all(owner);

  const items = rows.map((row) => {
    const product = rowToProduct(row);
    const lineTotal = product.price * row.quantity;
    return { product, quantity: row.quantity, lineTotal };
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, subtotal, itemCount };
}

router.get("/", (req, res) => {
  res.json(getCartPayload(ownerId(req)));
});

router.post("/", (req, res) => {
  const { productId, quantity } = req.body || {};
  const product = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const owner = ownerId(req);
  const existing = db.prepare("SELECT * FROM cart_items WHERE owner_id = ? AND product_id = ?").get(owner, productId);
  if (existing) {
    db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(existing.quantity + qty, existing.id);
  } else {
    db.prepare("INSERT INTO cart_items (owner_id, product_id, quantity) VALUES (?, ?, ?)").run(owner, productId, qty);
  }
  res.status(201).json(getCartPayload(owner));
});

router.put("/:productId", (req, res) => {
  const qty = Math.floor(Number(req.body && req.body.quantity));
  const owner = ownerId(req);
  if (!qty || qty < 1) {
    db.prepare("DELETE FROM cart_items WHERE owner_id = ? AND product_id = ?").run(owner, req.params.productId);
  } else {
    db.prepare("UPDATE cart_items SET quantity = ? WHERE owner_id = ? AND product_id = ?").run(qty, owner, req.params.productId);
  }
  res.json(getCartPayload(owner));
});

router.delete("/:productId", (req, res) => {
  const owner = ownerId(req);
  db.prepare("DELETE FROM cart_items WHERE owner_id = ? AND product_id = ?").run(owner, req.params.productId);
  res.json(getCartPayload(owner));
});

router.delete("/", (req, res) => {
  const owner = ownerId(req);
  db.prepare("DELETE FROM cart_items WHERE owner_id = ?").run(owner);
  res.json(getCartPayload(owner));
});

module.exports = router;
