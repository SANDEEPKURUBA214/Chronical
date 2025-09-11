// server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/DB.js";
import authRoutes from "./routes/authRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// --------------------- CORS ---------------------
// Allowed origins: local dev + multiple Vercel frontends
const allowedOrigins = [
  "https://chronical-gjy2.vercel.app", // ✅ your actual Vercel frontend
  "http://localhost:5173" // optional for local dev
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


// ------------------- Middleware -------------------
app.use(express.json());
app.use(cookieParser());

// -------------------- Routes --------------------
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/user", authRoutes); // optional
app.use("/api/upload", authRoutes); // optional
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
