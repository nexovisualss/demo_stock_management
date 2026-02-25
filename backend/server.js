// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/uploads", express.static("uploads"));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// server start
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));