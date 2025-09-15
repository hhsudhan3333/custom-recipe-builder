import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import {connectDB} from "./config/db";
const path = require("path");
import profileRoutes from "./routes/profileRoutes"
import recipeRoutes from "./routes/recipeRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userActionRoutes from "./routes/userActionRoutes";

dotenv.config();
connectDB();
// dotenv.config({ path: path.join(__dirname,".env") });
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ allow cookies / tokens
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api",profileRoutes);
app.use("/api/recipes",recipeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/user-actions", userActionRoutes);
app.use("/api/recipes", userActionRoutes);
// DB connect
// mongoose
//   .connect(process.env.MONGO_URI!)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error("DB error", err);
//     process.exit(1);
//   });

// Run server on port 5004
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
