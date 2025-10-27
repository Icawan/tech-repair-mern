const Inquiry = require("../models/Inquiry");

// 🟢 Create a new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { deviceType, issueDescription } = req.body;

    if (!deviceType || !issueDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const inquiry = await Inquiry.create({
      user: req.user._id,
      deviceType,
      issueDescription,
    });

    res.status(201).json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get all inquiries for logged-in user
exports.getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Update inquiry (only if it's not cancelled/completed)
exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ _id: req.params.id, user: req.user._id });

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    if (inquiry.status === "cancelled") return res.status(400).json({ message: "Cannot edit a cancelled inquiry" });

    inquiry.deviceType = req.body.deviceType || inquiry.deviceType;
    inquiry.issueDescription = req.body.issueDescription || inquiry.issueDescription;

    const updatedInquiry = await inquiry.save();
    res.json(updatedInquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Cancel inquiry (soft delete)
exports.cancelInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ _id: req.params.id, user: req.user._id });

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    inquiry.status = "cancelled";
    await inquiry.save();

    res.json({ message: "Inquiry cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
