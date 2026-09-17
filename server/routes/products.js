const express = require("express");
const { db, rowToProduct } = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM products").all();
  res.json(rows.map(rowToProduct));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json(rowToProduct(row));
});

module.exports = router;
