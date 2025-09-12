import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// DB & routes
import connectDB from "./configs/DB.js";
import authRoutes from "./routes/authRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ImageKit import
import imagekit from "./configs/imageKit.js"; // ✅ after dotenv

// __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  "https://chronical-gjy2.vercel.app", // ✅ your actual Vercel frontend
  "http://localhost:5173", // optional for local dev
  "http://localhost:5174" // optional for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow tools like Postman
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy does not allow access from ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);

// Test ImageKit signature route
app.get("/api/upload-signature", (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json({ success: true, ...authParams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
