import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import claimsRoutes from "./routes/claims.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://neuralcarbon.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/claims", claimsRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Carbon AI Backend", port: ENV.PORT });
});

// ── MongoDB + Server start ────────────────────────────────────────────────────
(async () => {
  const { default: ora } = await import("ora");
  const mongoSpinner = ora("Connecting to MongoDB...").start();

  try {
    await mongoose.connect(ENV.MONGODB_URI);
    mongoSpinner.succeed("✅ MongoDB connected");
    app.listen(ENV.PORT, () =>
      console.log(`🚀 Backend running on http://localhost:${ENV.PORT}`),
    );
  } catch (err) {
    mongoSpinner.fail(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
})();
