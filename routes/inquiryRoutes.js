import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

// Create inquiry
router.post("/", verifyToken, async (req, res) => {
  try {
    const inquiry = new Inquiry({
      user: req.user.id,
      deviceType: req.body.deviceType,
      issue: req.body.issue,
    });
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all user inquiries
router.get("/", verifyToken, async (req, res) => {
  const inquiries = await Inquiry.find({ user: req.user.id });
  res.json(inquiries);
});

// Update inquiry
router.put("/:id", verifyToken, async (req, res) => {
  const inquiry = await Inquiry.findOne({ _id: req.params.id, user: req.user.id });
  if (!inquiry) return res.status(404).json({ message: "Not found" });

  inquiry.deviceType = req.body.deviceType || inquiry.deviceType;
  inquiry.issue = req.body.issue || inquiry.issue;
  await inquiry.save();
  res.json(inquiry);
});

// Cancel inquiry
router.put("/:id/cancel", verifyToken, async (req, res) => {
  const inquiry = await Inquiry.findOne({ _id: req.params.id, user: req.user.id });
  if (!inquiry) return res.status(404).json({ message: "Not found" });

  inquiry.status = "Cancelled";
  await inquiry.save();
  res.json({ message: "Inquiry cancelled", inquiry });
});

export default router;
