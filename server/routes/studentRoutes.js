import express from "express";
import Student from "../models/user.js";

const router = express.Router();

// ✅ ONLY KEEP THIS
router.get("/", async (req, res) => {
  try {
    const { department } = req.query;

    const students = await Student.find({ department });

    res.json(students); // ✅ array

  } catch (err) {
    res.status(500).json(err);
  }
});


export default router;