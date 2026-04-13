import Attendance from "../models/Attendance.js";

// ✅ Mark Attendance
export const markAttendance = async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);

    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        message: "Records must be a non-empty array",
      });
    }

    const { department, subject, date } = records[0];

    if (!department || !subject || !date) {
      return res.status(400).json({
        message: "department, subject and date are required",
      });
    }

    const existing = await Attendance.findOne({
      department,
      subject,
      date,
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    const saved = await Attendance.insertMany(records);

    res.status(201).json({
      message: "Attendance Saved",
      data: saved,
    });
  } catch (err) {
    console.error("❌ ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ✅ Get Student Attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const data = await Attendance.find({ studentId });

    res.json(data);
  } catch (err) {
    console.error("❌ Get Student Attendance Error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ✅ Get Attendance by Department + Subject
export const getAttendance = async (req, res) => {
  try {
    const { department, subject } = req.query;

    const query = {};

    if (department) query.department = department;
    if (subject) query.subject = subject;

    const data = await Attendance.find(query);

    res.json(data);
  } catch (err) {
    console.error("❌ Get Attendance Error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};