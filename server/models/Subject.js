import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ["BCA", "BBA", "MCA"]
  }
});

export default mongoose.model("Subject", subjectSchema);