import express from "express"
import 'dotenv/config';
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/DB.js";
import authRoutes from "./server/routes/authRoutes.js";
import blogRouter from "./server/routes/blogRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";


import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const app = express();
connectDB();

// middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/user", authRoutes); // 👈 mount user routes
app.use("/api/upload", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is Running on PORT ${PORT}`);
});

export default app;