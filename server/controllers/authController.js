import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";
import User from "../models/user.js";

// ================= HELPERS =================

// Generate 11-digit enrollment number
const generateEnrollment = () => {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString();
};

// Generate GR number
const generateGR = () => {
  return "GR" + Math.floor(100000 + Math.random() * 900000);
};

// ================= STUDENT / GENERIC USER =================

// Register student
export const register = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      mobileNumber,
      email,
      fatherNumber,
      department,
      address,
      birthDate,
      city,
      state,
      country,
      password
    } = req.body;

    if (
      !name ||
      !fatherName ||
      !mobileNumber ||
      !email ||
      !fatherNumber ||
      !department ||
      !address ||
      !birthDate ||
      !city ||
      !state ||
      !country ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let enrollment;
    let enrollmentExists = true;

    while (enrollmentExists) {
      enrollment = generateEnrollment();
      const existingEnrollment = await User.findOne({ enrollment });
      if (!existingEnrollment) {
        enrollmentExists = false;
      }
    }

    let grNumber;
    let grExists = true;

    while (grExists) {
      grNumber = generateGR();
      const existingGR = await User.findOne({ grNumber });
      if (!existingGR) {
        grExists = false;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      fatherName,
      mobileNumber,
      email,
      fatherNumber,
      department,
      address,
      birthDate,
      city,
      state,
      country,
      password: hashedPassword,
      enrollment,
      grNumber,
      role: "student"
    });

    await newUser.save();

    return res.status(201).json({
      message: "User Register API working",
      enrollment: newUser.enrollment,
      grNumber: newUser.grNumber,
      user: {
        id: newUser._id,
        name: newUser.name,
        fatherName: newUser.fatherName,
        mobileNumber: newUser.mobileNumber,
        email: newUser.email,
        fatherNumber: newUser.fatherNumber,
        department: newUser.department,
        address: newUser.address,
        birthDate: newUser.birthDate,
        city: newUser.city,
        state: newUser.state,
        country: newUser.country,
        enrollment: newUser.enrollment,
        grNumber: newUser.grNumber,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Student Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login student
export const login = async (req, res) => {
  try {
    const { enrollment, password } = req.body;

    if (!enrollment || !password) {
      return res.status(400).json({
        message: "Enrollment and password are required"
      });
    }

    const user = await User.findOne({ enrollment });
    if (!user) {
      return res.status(400).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "User Login API working",
      token,
      user: {
        id: user._id,
        name: user.name,
        fatherName: user.fatherName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        fatherNumber: user.fatherNumber,
        department: user.department,
        address: user.address,
        birthDate: user.birthDate,
        city: user.city,
        state: user.state,
        country: user.country,
        enrollment: user.enrollment,
        grNumber: user.grNumber,
        role: user.role || "student"
      }
    });
  } catch (err) {
    console.error("Student Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= TEACHER =================

// Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      empCode,
      mobile,
      department,
      qualification,
      address,
      joinDate
    } = req.body;

    const existing = await Teacher.findOne({ empCode });
    if (existing) {
      return res.status(400).json({ msg: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      empCode,
      mobile,
      department,
      qualification,
      address,
      joinDate,
      role: "teacher"
    });

    await teacher.save();

    return res.status(201).json({
      message: "Teacher Registered Successfully",
      empCode: teacher.empCode
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Login Teacher
export const loginTeacher = async (req, res) => {
  try {
    const { empCode, password } = req.body;

    if (!empCode || !password) {
      return res.status(400).json({
        msg: "Employee code and password are required"
      });
    }

    const teacher = await Teacher.findOne({ empCode });
    if (!teacher) {
      return res.status(400).json({ msg: "Teacher not found" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      msg: "Login successful",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        empCode: teacher.empCode,
        email: teacher.email,
        department: teacher.department,
        role: teacher.role
      },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};