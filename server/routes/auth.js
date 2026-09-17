const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("../db");

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email };
}

router.post("/register", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || !EMAIL_PATTERN.test(email) || password.length < 6) {
    return res.status(400).json({ error: "Name, valid email and a password of 6+ characters are required." });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name.trim(), email.toLowerCase().trim(), passwordHash);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);

  // Merge any guest cart (identified by the pre-login session cookie) into the new account.
  if (req.sessionID) {
    db.prepare("UPDATE OR IGNORE cart_items SET owner_id = ? WHERE owner_id = ?").run(String(user.id), req.sessionID);
    db.prepare("DELETE FROM cart_items WHERE owner_id = ?").run(req.sessionID);
  }

  req.session.userId = user.id;
  res.status(201).json({ user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(email).toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: "User not registered!", field: "email" });
  }
  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Incorrect password.", field: "password" });
  }

  if (req.sessionID) {
    db.prepare("UPDATE OR IGNORE cart_items SET owner_id = ? WHERE owner_id = ?").run(String(user.id), req.sessionID);
    db.prepare("DELETE FROM cart_items WHERE owner_id = ?").run(req.sessionID);
  }

  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.userId);
  if (!user) return res.json({ user: null });
  res.json({ user: publicUser(user) });
});

module.exports = router;
