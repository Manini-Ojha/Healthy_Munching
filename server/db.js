const path = require("path");
const Database = require("better-sqlite3");
const PRODUCTS = require("../js/data/products.js");

// DB_PATH lets production point this at a mounted persistent volume (e.g. Fly.io volumes);
// defaults to a file alongside this module for local dev.
const dbPath = process.env.DB_PATH || path.join(__dirname, "data.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
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

// Lightweight migration for columns added after the table already existed on disk.
const orderColumns = db.prepare("PRAGMA table_info(orders)").all().map((c) => c.name);
if (!orderColumns.includes("payment_status")) {
  db.exec("ALTER TABLE orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending'");
}
if (!orderColumns.includes("razorpay_order_id")) {
  db.exec("ALTER TABLE orders ADD COLUMN razorpay_order_id TEXT");
}
if (!orderColumns.includes("razorpay_payment_id")) {
  db.exec("ALTER TABLE orders ADD COLUMN razorpay_payment_id TEXT");
}

// Reseed the product catalog from the shared products.js on every boot so it
// always mirrors the source-of-truth file (this project has no admin UI yet).
const upsertProduct = db.prepare(`
  INSERT INTO products (id, name, price, image, short_description, full_description, ingredients, allergens, nutrition, category, featured)
  VALUES (@id, @name, @price, @image, @shortDescription, @fullDescription, @ingredients, @allergens, @nutrition, @category, @featured)
  ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, price=excluded.price, image=excluded.image,
    short_description=excluded.short_description, full_description=excluded.full_description,
    ingredients=excluded.ingredients, allergens=excluded.allergens, nutrition=excluded.nutrition,
    category=excluded.category, featured=excluded.featured
`);
const seedProducts = db.transaction((products) => {
  const ids = products.map((p) => p.id);
  for (const p of products) {
    upsertProduct.run({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      ingredients: JSON.stringify(p.ingredients),
      allergens: JSON.stringify(p.allergens),
      nutrition: JSON.stringify(p.nutrition),
      category: p.category,
      featured: p.featured ? 1 : 0
    });
  }
  if (ids.length > 0) {
    const placeholders = ids.map(() => "?").join(",");
    db.prepare(`DELETE FROM products WHERE id NOT IN (${placeholders})`).run(...ids);
  }
});
seedProducts(PRODUCTS);

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

module.exports = { db, rowToProduct };
