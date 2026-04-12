import mongoose from "mongoose";

const eContentSchema = new mongoose.Schema({
  title: String,
  department: String,
  file: String // file path
}, { timestamps: true });

export default mongoose.model("EContent", eContentSchema);