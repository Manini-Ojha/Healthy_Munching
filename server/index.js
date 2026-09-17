require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const SqliteStore = require("better-sqlite3-session-store")(session);

const { db } = require("./db");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const paymentRouter = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  session({
    store: new SqliteStore({ client: db, expired: { clear: true, intervalMs: 15 * 60 * 1000 } }),
    name: "wn.sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: "auto", // secure over HTTPS in production (behind the host's proxy), plain HTTP in local dev
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  })
);

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payment", paymentRouter);

// Serve the static site (html/css/js/assets) from the project root.
app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, () => {
  console.log(`Healthy Munching server running on port ${PORT}`);
});
