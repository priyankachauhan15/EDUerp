import Attendance from "../models/Attendance.js";

// ✅ Mark Attendance (Teacher)
export const markAttendance = async (req, res) => {
  try {

    const records = req.body; // array

    await Attendance.insertMany(records);

    res.json("Attendance Saved");

  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Get Student Attendance
export const getStudentAttendance = async (req, res) => {
  try {

    const { studentId } = req.params;

    const data = await Attendance.find({ studentId });

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
};