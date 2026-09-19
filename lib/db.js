const { createClient } = require("@libsql/client");

let client;

function getClient() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set.");
    }
    client = createClient({ url, authToken });
  }
  return client;
}

async function ensureSchema() {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      allergens TEXT NOT NULL,
      nutrition TEXT NOT NULL,
      category TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0
    )
  `);
}

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    image: row.image,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    ingredients: JSON.parse(row.ingredients),
    allergens: JSON.parse(row.allergens),
    nutrition: JSON.parse(row.nutrition),
    category: row.category,
    featured: !!row.featured
  };
}

module.exports = { getClient, ensureSchema, rowToProduct };
