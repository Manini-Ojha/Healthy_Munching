const express = require("express");
const { all, get, run, rowToProduct } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const rows = await all("SELECT * FROM products");
  res.json(rows.map(rowToProduct));
});

router.get("/:id", async (req, res) => {
  const row = await get("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json(rowToProduct(row));
});

// "You might also like" — other products in the same category, falling back
// to other featured products if the category doesn't have enough.
router.get("/:id/suggestions", async (req, res) => {
  const current = await get("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!current) return res.status(404).json({ error: "Product not found" });

  // Only suggest products with a real photo (.png/.jpg/...), not the SVG
  // placeholder icons.
  const sameCategory = await all(
    "SELECT * FROM products WHERE category = ? AND id != ? AND image NOT LIKE '%.svg' ORDER BY RANDOM() LIMIT 4",
    [current.category, current.id]
  );

  let suggestions = sameCategory;
  if (suggestions.length < 4) {
    const usedIds = [current.id, ...suggestions.map((p) => p.id)];
    const placeholders = usedIds.map(() => "?").join(",");
    const filler = await all(
      `SELECT * FROM products WHERE id NOT IN (${placeholders}) AND image NOT LIKE '%.svg' ORDER BY RANDOM() LIMIT ?`,
      [...usedIds, 4 - suggestions.length]
    );
    suggestions = suggestions.concat(filler);
  }

  res.json(suggestions.map(rowToProduct));
});

router.get("/:id/reviews", async (req, res) => {
  const product = await get("SELECT id FROM products WHERE id = ?", [req.params.id]);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const rows = await all("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC", [req.params.id]);
  const summary = await get(
    "SELECT COUNT(*) as count, AVG(rating) as average FROM reviews WHERE product_id = ?",
    [req.params.id]
  );

  res.json({
    reviews: rows.map((r) => ({
      id: r.id,
      authorName: r.author_name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at
    })),
    count: summary.count,
    average: summary.average ? Math.round(summary.average * 10) / 10 : 0
  });
});

router.post("/:id/reviews", async (req, res) => {
  const product = await get("SELECT id FROM products WHERE id = ?", [req.params.id]);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const { rating, comment } = req.body || {};
  let { authorName } = req.body || {};
  const ratingNum = Math.round(Number(rating));

  if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: "Please choose a rating between 1 and 5 stars.", field: "rating" });
  }
  if (!comment || !String(comment).trim()) {
    return res.status(400).json({ error: "Please write a comment for your review.", field: "comment" });
  }

  let userId = null;
  if (req.session.userId) {
    const user = await get("SELECT * FROM users WHERE id = ?", [req.session.userId]);
    if (user) {
      userId = user.id;
      authorName = user.name;
    }
  }
  if (!authorName || !String(authorName).trim()) {
    return res.status(400).json({ error: "Please enter your name.", field: "authorName" });
  }

  await run(
    "INSERT INTO reviews (product_id, user_id, author_name, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [req.params.id, userId, String(authorName).trim(), ratingNum, String(comment).trim()]
  );

  res.status(201).json({ ok: true });
});

module.exports = router;
