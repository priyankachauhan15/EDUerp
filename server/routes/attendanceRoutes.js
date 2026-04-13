import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

router.post("/mark", async (req, res) => {
  try {
    console.log("========== ATTENDANCE REQUEST ==========");
    console.log("BODY:", JSON.stringify(req.body, null, 2));

    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        message: "Records must be a non-empty array",
      });
    }

    console.log("FIRST RECORD:", records[0]);

    for (const record of records) {
      if (
        !record.studentId ||
        !record.name ||
        !record.department ||
        !record.subject ||
        !record.date ||
        !record.status
      ) {
        console.log("INVALID RECORD:", record);
        return res.status(400).json({
          message: "Invalid attendance record",
          badRecord: record,
        });
      }
    }

    const { department, subject, date } = records[0];

    const existing = await Attendance.findOne({
      department,
      subject,
      date,
    });

    console.log("EXISTING:", existing);

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    const saved = await Attendance.insertMany(records);

    console.log("SAVED COUNT:", saved.length);

    return res.status(201).json({
      message: "Attendance Saved",
      data: saved,
    });
  } catch (err) {
    console.error("ATTENDANCE SAVE ERROR:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const data = await Attendance.find({ studentId: req.params.id });
    res.json(data);
  } catch (err) {
    console.error("GET STUDENT ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { department, subject } = req.query;
    const query = {};
    if (department) query.department = department;
    if (subject) query.subject = subject;

    const data = await Attendance.find(query);
    res.json(data);
  } catch (err) {
    console.error("GET ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;