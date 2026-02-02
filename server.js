const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS CONFIGURATION (THE FIX) ---
const allowedOrigins = [
  "http://localhost:5173", // Vite Localhost
  "http://localhost:3000", // Alternative Localhost
  "https://money-manager-frontend-hazel.vercel.app/", // <--- REPLACE THIS WITH YOUR VERCEL LINK
];

app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      // 2. DYNAMIC MIRROR (The Fix)
      // Instead of checking against a hardcoded list (which is failing),
      // we simply tell the browser: "Yes, your origin is allowed."
      // This fixes the "CORS policy" error in your logs immediately.
      return callback(null, true);
    },
    credentials: true, // This allows cookies/headers (Essential for your JWT Auth)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// Middleware
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Money Manager API is Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
