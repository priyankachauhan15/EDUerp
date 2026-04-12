import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  mobileNumber: String,
  email: String,
  fatherNumber: String,
  department: String,
  address: String,
  birthDate: String,
  city: String,
  state: String,
  country: String,
  password: String,

  enrollment: String, 
  grNumber: String,   

  role: {
    type: String,
    default: "student"
  }
});

export default mongoose.model("User", userSchema);