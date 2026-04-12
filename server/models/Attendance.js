import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,

  department: String,
  subject: String,

  date: String, // YYYY-MM-DD
  status: String // Present / Absent

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);