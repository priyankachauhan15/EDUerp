import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";

// 🔒 Import middleware
import authMiddleware from "./middleware/authMiddleware.js";

// 📁 Routes
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import eContentRoutes from "./routes/eContentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

dotenv.config();

const app = express();

// ✅ Connect DB ONLY ONCE
connectDB();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",        // local frontend
      "https://eduerp.vercel.app"     // your deployed frontend
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

// 🔓 Public Routes
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);

// 🔒 Protected Routes
app.use("/api/students", authMiddleware, studentRoutes);
app.use("/api/attendance", authMiddleware, attendanceRoutes);
app.use("/api/subjects", authMiddleware, subjectRoutes);
app.use("/api/econtent", authMiddleware, eContentRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ DB Status Route
app.get("/check-db", (req, res) => {
  res.json({
    message: "DB Connected Successfully ✅",
  });
});

// ❗ Error Handling Middleware (IMPORTANT)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});