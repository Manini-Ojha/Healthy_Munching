const express = require("express");
const { all, get, run, rowToProduct } = require("../db");
const { ownerId } = require("../ownerId");

const router = express.Router();

async function getCartPayload(owner) {
  const rows = await all(
    `SELECT ci.product_id, ci.quantity, p.*
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.owner_id = ?`,
    [owner]
  );

  const items = rows.map((row) => {
    const product = rowToProduct(row);
    const lineTotal = product.price * row.quantity;
    return { product, quantity: row.quantity, lineTotal };
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, subtotal, itemCount };
}

router.get("/", async (req, res) => {
  res.json(await getCartPayload(ownerId(req)));
});

router.post("/", async (req, res) => {
  const { productId, quantity } = req.body || {};
  const product = await get("SELECT id FROM products WHERE id = ?", [productId]);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const owner = ownerId(req);
  const existing = await get("SELECT * FROM cart_items WHERE owner_id = ? AND product_id = ?", [owner, productId]);
  if (existing) {
    await run("UPDATE cart_items SET quantity = ? WHERE id = ?", [existing.quantity + qty, existing.id]);
  } else {
    await run("INSERT INTO cart_items (owner_id, product_id, quantity) VALUES (?, ?, ?)", [owner, productId, qty]);
  }
  res.status(201).json(await getCartPayload(owner));
});

router.put("/:productId", async (req, res) => {
  const qty = Math.floor(Number(req.body && req.body.quantity));
  const owner = ownerId(req);
  if (!qty || qty < 1) {
    await run("DELETE FROM cart_items WHERE owner_id = ? AND product_id = ?", [owner, req.params.productId]);
  } else {
    await run("UPDATE cart_items SET quantity = ? WHERE owner_id = ? AND product_id = ?", [qty, owner, req.params.productId]);
  }
  res.json(await getCartPayload(owner));
});

router.delete("/:productId", async (req, res) => {
  const owner = ownerId(req);
  await run("DELETE FROM cart_items WHERE owner_id = ? AND product_id = ?", [owner, req.params.productId]);
  res.json(await getCartPayload(owner));
});

router.delete("/", async (req, res) => {
  const owner = ownerId(req);
  await run("DELETE FROM cart_items WHERE owner_id = ?", [owner]);
  res.json(await getCartPayload(owner));
});

module.exports = router;
