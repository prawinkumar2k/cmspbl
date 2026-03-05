import { SendLetter } from '../models/index.js';

// Get All Letters
export const getAllLetters = async (req, res) => {
  try {
    const rows = await SendLetter.find().sort({ createdAt: -1 });
    // Map to old field names if needed
    res.json(rows.map(r => ({
      ...r.toObject(),
      to: r.recipient,
      typeOfPost: r.typeOfPost
    })));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add New Letter
export const addLetter = async (req, res) => {
  try {
    const b = req.body;
    if (!b.date || !b.to || !b.message || !b.address || !b.typeOfPost || !b.cost) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const row = await SendLetter.create({
      date: b.date,
      recipient: b.to,
      message: b.message,
      address: b.address,
      typeOfPost: b.typeOfPost,
      cost: b.cost,
      trackingNumber: b.trackingNumber,
      status: b.status || "Sent"
    });

    res.json({ success: true, id: row._id, message: "Letter saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
