import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  department: String,
  qualification: String,
  address: String,
  joinDate: String,
  password: String,
  empCode: String,
  role: { type: String, default: "teacher" } // role field added for role-based login
});

export default mongoose.model("Teacher", teacherSchema);