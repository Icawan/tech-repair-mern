import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import xss from "xss-clean"; // ⚠️ Disabled for now

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(helmet());

// ✅ CORS setup for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // <-- Replace with your frontend URL
    credentials: true,
  })
);

app.use(express.json());
// app.use(xss()); // ⚠️ Disabled for now
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
import authRoutes from "./routes/authRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => res.send("API running..."));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
