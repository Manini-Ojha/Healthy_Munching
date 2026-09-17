const fs = require("fs");
const https = require("https");
const path = require("path");
const express = require("express");
const session = require("express-session");

const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");

const app = express();
const HTTPS_PORT = process.env.PORT || 8443;

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  session({
    name: "wn.sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true, // this app is only ever served over HTTPS (see below)
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  })
);

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);

// Serve the static site (html/css/js/assets) from the project root.
app.use(express.static(path.join(__dirname, "..")));

const certDir = path.join(__dirname, "certs");
const httpsOptions = {
  key: fs.readFileSync(path.join(certDir, "key.pem")),
  cert: fs.readFileSync(path.join(certDir, "cert.pem"))
};

https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(`Healthy Munching server running at https://localhost:${HTTPS_PORT}`);
});
