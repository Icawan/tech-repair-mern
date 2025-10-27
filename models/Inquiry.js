import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceType: { type: String, required: true },
  issue: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending | Cancelled | Completed
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Inquiry", inquirySchema);
