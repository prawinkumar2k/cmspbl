import Enquiry from '../models/Enquiry.js';

export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

export const getTodaysEnquiries = async (req, res) => {
  try {
    // ✅ MongoDB date-range filtering for today
    const now = new Date();
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    const end = new Date(now); end.setHours(23, 59, 59, 999);

    const enquiries = await Enquiry.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error("Error fetching today's enquiries:", error);
    res.status(500).json({ error: "Failed to fetch today's enquiries" });
  }
};

export const createEnquiry = async (req, res) => {
  try {
    const doc = await Enquiry.create(req.body);
    res.status(201).json({ message: 'Enquiry created successfully', id: doc._id });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    const result = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ message: 'Enquiry updated successfully' });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
};

