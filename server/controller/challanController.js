import { Challan } from '../models/Challan.js';

/**
 * GET /api/challan
 */
export const getChallans = async (req, res) => {
  try {
    const rows = await Challan.find()
      .sort({ createdAt: -1 })
      .limit(100);

    const mapped = rows.map(r => ({
      id: r._id,
      candidateType: r.candidateType,
      course: r.course,
      sem: r.sem,
      regNo: r.regNo,
      date: r.date,
      challanNo: r.challanNo,
      isPaid: r.isPaid,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

    res.json(mapped);
  } catch (err) {
    console.error('getChallans error:', err);
    res.status(500).json({ message: 'Failed to fetch challan entries' });
  }
};

/**
 * POST /api/challan
 */
export const createChallan = async (req, res) => {
  try {
    const {
      candidateType,
      course,
      sem,
      regNo,
      date,
      challanNo,
      isPaid = false
    } = req.body || {};

    // Basic validation
    if (!candidateType || !course || !sem || !regNo || !date || !challanNo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const entry = await Challan.create({
      candidateType,
      course,
      sem,
      regNo,
      date: new Date(date),
      challanNo,
      isPaid: Boolean(isPaid)
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error('createChallan error:', err);
    res.status(500).json({ message: 'Failed to create challan' });
  }
};

/**
 * PATCH /api/challan/:challanNo/paid
 * Marks all entries with challan_no as paid.
 */
export const markPaid = async (req, res) => {
  try {
    const { challanNo } = req.params;
    if (!challanNo) return res.status(400).json({ message: 'Missing challanNo parameter' });

    const result = await Challan.updateMany(
      { challanNo: String(challanNo) },
      { $set: { isPaid: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Challan not found' });
    }

    res.json({ message: 'Challan marked as paid', affectedRows: result.modifiedCount });
  } catch (err) {
    console.error('markPaid error:', err);
    res.status(500).json({ message: 'Failed to mark challan as paid' });
  }
};
