import express from "express";
import upload from "../middleware/upload.js";
import EContent from "../models/EContent.js";

const router = express.Router();

// POST /api/econtent/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, department } = req.body;

    if (!title || !department) {
      return res.status(400).json({ message: "Title and Department required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    const newContent = new EContent({
      title,
      department,
      file: req.file.filename,
    });

    await newContent.save();

    res.status(201).json({
      message: "Uploaded successfully",
      data: newContent,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// GET /api/econtent?department=BCA
router.get("/", async (req, res) => {
  try {
    const { department } = req.query;

    let data;

    if (department) {
      data = await EContent.find({ department });
    } else {
      data = await EContent.find();
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch e-content" });
  }
});

// DELETE /api/econtent/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await EContent.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "E-content not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;