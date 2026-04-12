import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();



router.post("/mark", async (req, res) => {
  try {
    const records = req.body;

    const { department, subject, date } = records[0];

    // ✅ CHECK IF ALREADY EXISTS
    const existing = await Attendance.findOne({
      department,
      subject,
      date
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for today"
      });
    }

    // ✅ SAVE
    await Attendance.insertMany(records);

    res.json({ message: "Attendance Saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



router.get("/student/:id", async (req, res) => {
  try {
    const data = await Attendance.find({
      studentId: req.params.id
    });

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/", async (req, res) => {
  try {
    const { department, subject } = req.query;

    const data = await Attendance.find({ department, subject });

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;