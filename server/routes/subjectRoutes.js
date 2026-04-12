import express from "express";
import Subject from "../models/Subject.js";

const router = express.Router();

// ✅ GET SUBJECTS BY DEPARTMENT
router.get("/", async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ message: "Department required" });
    }

    const subjects = await Subject.find({ department });
    res.json(subjects);

  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ ADD SUBJECT
router.post("/add", async (req, res) => {
  try {
    let { name, department } = req.body;

    name = name?.trim();

    if (!name || !department) {
      return res.status(400).json({
        message: "Name and Department are required"
      });
    }

    
    const exists = await Subject.findOne({ name, department });
    if (exists) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const newSubject = new Subject({ name, department });
    await newSubject.save();

    res.json(newSubject);

  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ DELETE SUBJECT
router.delete("/:id", async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const { department } = req.query;

    const subjects = await Subject.find({ department });

    res.json(subjects);

  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;