const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

dotenv.config();

// ─── Import Routes ─────────────────────────────────────────────────────────────
const authRoutes     = require("./routes/auth.routes");
const productRoutes  = require("./routes/product.routes");
const cartRoutes     = require("./routes/cart.routes");
const orderRoutes    = require("./routes/order.routes");
const userRoutes     = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

// ─── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
}));
app.use("/api/auth/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many login attempts, please try again later." },
}));

// ─── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Logger ────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/products",   productRoutes);
app.use("/api/cart",       cartRoutes);
app.use("/api/orders",     orderRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }
  if (err.name === "JsonWebTokenError") return res.status(401).json({ success: false, message: "Invalid token" });
  if (err.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired" });
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

// ─── DB Connect then Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS:          60000,
    maxPoolSize:              10,
    heartbeatFrequencyMS:     10000, // ping Atlas every 10s — prevents idle disconnect
  });
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
};

const startServer = async () => {
  try {
    // Wait for DB before accepting any request
    await connectDB();

    // Reconnect handlers
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected — retrying in 5s...");
      setTimeout(() => connectDB().catch((e) => console.error("Reconnect failed:", e.message)), 5000);
    });
    mongoose.connection.on("reconnected", () => console.log("✅ MongoDB reconnected"));
    mongoose.connection.on("error", (e) => console.error("❌ MongoDB error:", e.message));

    // Start listening only after DB is ready
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
