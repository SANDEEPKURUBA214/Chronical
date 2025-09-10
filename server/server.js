import express from "express";
import 'dotenv/config';
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/DB.js";
import authRoutes from "./routes/authRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:3000", 

  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploads folder (for images/files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/user", authRoutes);
app.use("/api/upload", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is working");
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

export default app;
