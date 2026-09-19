require("dotenv").config();
const PRODUCTS = require("../js/data/products.js");
const { getClient, ensureSchema } = require("../lib/db");

async function seed() {
  await ensureSchema();
  const db = getClient();

  const upsert = `
    INSERT INTO products (id, name, price, image, short_description, full_description, ingredients, allergens, nutrition, category, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name, price=excluded.price, image=excluded.image,
      short_description=excluded.short_description, full_description=excluded.full_description,
      ingredients=excluded.ingredients, allergens=excluded.allergens, nutrition=excluded.nutrition,
      category=excluded.category, featured=excluded.featured
  `;

  for (const p of PRODUCTS) {
    await db.execute({
      sql: upsert,
      args: [
        p.id,
        p.name,
        p.price,
        p.image,
        p.shortDescription,
        p.fullDescription,
        JSON.stringify(p.ingredients),
        JSON.stringify(p.allergens),
        JSON.stringify(p.nutrition),
        p.category,
        p.featured ? 1 : 0
      ]
    });
    console.log(`Seeded: ${p.id}`);
  }

  const ids = PRODUCTS.map((p) => p.id);
  const placeholders = ids.map(() => "?").join(",");
  await db.execute({
    sql: `DELETE FROM products WHERE id NOT IN (${placeholders})`,
    args: ids
  });

  console.log(`Done. ${PRODUCTS.length} products seeded.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
