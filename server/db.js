const path = require("path");
const { createClient } = require("@libsql/client");
const PRODUCTS = require("../js/data/products.js");

// TURSO_DATABASE_URL/TURSO_AUTH_TOKEN point at a hosted Turso DB in production
// (Vercel's filesystem is ephemeral). Falls back to a local SQLite file for dev.
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${path.join(__dirname, "data.sqlite")}`,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function all(sql, args = []) {
  const rs = await db.execute({ sql, args });
  return rs.rows;
}

async function get(sql, args = []) {
  const rows = await all(sql, args);
  return rows[0];
}

async function run(sql, args = []) {
  const rs = await db.execute({ sql, args });
  return {
    lastInsertRowid: rs.lastInsertRowid !== undefined ? Number(rs.lastInsertRowid) : undefined,
    changes: rs.rowsAffected
  };
}

async function initSchema() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

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
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id TEXT NOT NULL,
      product_id TEXT NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      UNIQUE(owner_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_number TEXT NOT NULL UNIQUE,
      user_id INTEGER REFERENCES users(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id),
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      line_total INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL REFERENCES products(id),
      user_id INTEGER REFERENCES users(id),
      author_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Reseed the product catalog from the shared products.js on every boot so it
  // always mirrors the source-of-truth file (this project has no admin UI yet).
  const tx = await db.transaction("write");
  try {
    for (const p of PRODUCTS) {
      await tx.execute({
        sql: `
          INSERT INTO products (id, name, price, image, short_description, full_description, ingredients, allergens, nutrition, category, featured)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name, price=excluded.price, image=excluded.image,
            short_description=excluded.short_description, full_description=excluded.full_description,
            ingredients=excluded.ingredients, allergens=excluded.allergens, nutrition=excluded.nutrition,
            category=excluded.category, featured=excluded.featured
        `,
        args: [
          p.id, p.name, p.price, p.image, p.shortDescription, p.fullDescription,
          JSON.stringify(p.ingredients), JSON.stringify(p.allergens), JSON.stringify(p.nutrition),
          p.category, p.featured ? 1 : 0
        ]
      });
    }
    if (PRODUCTS.length > 0) {
      const ids = PRODUCTS.map((p) => p.id);
      const placeholders = ids.map(() => "?").join(",");
      await tx.execute({ sql: `DELETE FROM products WHERE id NOT IN (${placeholders})`, args: ids });
    }
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

// Ensures the schema/seed only run once, and lets every route await readiness
// before querying (needed since serverless invocations can race a cold start).
let readyPromise = null;
function ready() {
  if (!readyPromise) readyPromise = initSchema();
  return readyPromise;
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

module.exports = { db, all, get, run, ready, rowToProduct };
