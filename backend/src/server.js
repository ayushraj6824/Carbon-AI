require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const claimsRoutes = require("./routes/claims");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:3001",
      'https://neuralcarbon.vercel.app',
    ],
    credentials: true,
  }),
);
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/claims", claimsRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Carbon AI Backend", port: 5000 });
});

// ── MongoDB + Server start ────────────────────────────────────────────────────
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/carbon_ai";
const PORT = process.env.PORT || 5000;

(async () => {
  const { default: ora } = await import("ora");
  const mongoSpinner = ora("Connecting to MongoDB...").start();

  try {
    await mongoose.connect(MONGO_URI);
    mongoSpinner.succeed("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Backend running on http://localhost:${PORT}`),
    );
  } catch (err) {
    mongoSpinner.fail(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
})();
