import express from "express";
import {
    login,
    loginTeacher,
    register,
    registerTeacher
} from "../controllers/authController.js";

const router = express.Router();

// ================= AUTH ROUTES =================

// Generic user
router.post("/register", register);
router.post("/login", login);

// Teacher
router.post("/teacher-register", registerTeacher);
router.post("/teacher-login", loginTeacher);

export default router;