import express from "express";
import {
    getTeachers,
    loginTeacher,
    registerTeacher
} from "../controllers/teacherController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Public
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);

// 🔒 Protected
router.get("/", authMiddleware, getTeachers);

export default router;