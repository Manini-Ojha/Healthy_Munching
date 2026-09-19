const { getClient, rowToProduct } = require("../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const db = getClient();
    const result = await db.execute("SELECT * FROM products ORDER BY rowid ASC");
    const products = result.rows.map(rowToProduct);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(products);
  } catch (err) {
    console.error("GET /api/products failed:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};
