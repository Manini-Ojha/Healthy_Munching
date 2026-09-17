require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const Redis = require("ioredis");

const { ready } = require("./db");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const paymentRouter = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 3000;

// REDIS_URL points at a hosted Redis (e.g. Upstash) in production, since
// Vercel's filesystem is ephemeral and can't back a local session store.
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
redisClient.on("error", (err) => console.error("Redis connection error:", err));

app.set("trust proxy", 1);
app.use(express.json());

// Ensure the DB schema/seed has run before any route queries it (matters on
// serverless cold starts, where nothing has run yet for this instance).
app.use(async (req, res, next) => {
  try {
    await ready();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(
  session({
    store: new RedisStore({ client: redisClient, prefix: "wn:sess:" }),
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

// Serve the static site (html/css/js/assets) from the project root. On Vercel
// these are served directly as static files instead, so this only matters locally.
app.use(express.static(path.join(__dirname, "..")));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Healthy Munching server running on port ${PORT}`);
  });
}

module.exports = app;
