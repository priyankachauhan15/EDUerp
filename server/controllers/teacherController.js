import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";

// 🔢 Generate Employee Code
const generateEmpCode = () => {
  return "EMP" + Math.floor(1000 + Math.random() * 9000);
};

// ================= REGISTER =================
export const registerTeacher = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 Check existing teacher
    const existingTeacher = await Teacher.findOne({ email: data.email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // 🔐 Hash password
    const hash = await bcrypt.hash(data.password, 10);

    const empCode = generateEmpCode();

    const newTeacher = new Teacher({
      ...data,
      role: "teacher", // ✅ important for role-based auth
      password: hash,
      empCode
    });

    await newTeacher.save();

    res.json({
      message: "Teacher Registered Successfully",
      empCode
    });

  } catch (err) {
    console.log("REGISTER TEACHER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
export const loginTeacher = async (req, res) => {
  try {
    const { empCode, password } = req.body;

    const teacher = await Teacher.findOne({ empCode });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 🔐 JWT TOKEN
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role || "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔐 Remove password safely
    const teacherData = teacher.toObject();
    delete teacherData.password;

    // 🔥 IMPORTANT FIX (user instead of teacher)
    res.json({
      message: "Login successful",
      token,
      user: teacherData
    });

  } catch (err) {
    console.log("LOGIN TEACHER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL TEACHERS =================
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password"); // 🔐 hide password
    res.json(teachers);
  } catch (err) {
    console.log("GET TEACHERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};