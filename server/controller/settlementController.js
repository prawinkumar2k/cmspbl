import { Settlement } from '../models/Settlement.js';

const validateSettlement = (body) => {
  const { date, expenseType, detail, person, amount } = body;
  if (!date || !expenseType || !detail || !person || amount == null)
    return 'All fields (date, expenseType, detail, person, amount) are required.';
  if (isNaN(Number(amount)) || Number(amount) <= 0)
    return 'Amount must be a positive number.';
  return null;
};

export const getAllSettlements = async (req, res) => {
  try {
    const { fromDate, toDate, expenseType, person } = req.query;
    const filter = {};
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) { const d = new Date(fromDate); d.setHours(0, 0, 0, 0); filter.date.$gte = d; }
      if (toDate) { const d = new Date(toDate); d.setHours(23, 59, 59, 999); filter.date.$lte = d; }
    }
    if (expenseType) filter.expenseType = expenseType;
    if (person) filter.person = person;

    const rows = await Settlement.find(filter).sort({ date: -1, _id: -1 });
    res.json(rows);
  } catch (err) {
    console.error('Error fetching settlements:', err);
    res.status(500).json({ error: 'Failed to fetch settlements', details: err.message });
  }
};

export const getSettlementById = async (req, res) => {
  try {
    const doc = await Settlement.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Settlement not found' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch settlement', details: err.message }); }
};

export const createSettlement = async (req, res) => {
  try {
    const error = validateSettlement(req.body);
    if (error) return res.status(400).json({ error });
    const { date, expenseType, detail, person, amount } = req.body;
    const doc = await Settlement.create({ date: new Date(date), expenseType, detail, person, amount: Number(amount) });
    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ error: 'Failed to create settlement', details: err.message }); }
};

export const updateSettlement = async (req, res) => {
  try {
    const error = validateSettlement(req.body);
    if (error) return res.status(400).json({ error });
    const { date, expenseType, detail, person, amount } = req.body;
    const doc = await Settlement.findByIdAndUpdate(req.params.id,
      { date: new Date(date), expenseType, detail, person, amount: Number(amount) },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Settlement not found' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: 'Failed to update settlement', details: err.message }); }
};

export const deleteSettlement = async (req, res) => {
  try {
    const doc = await Settlement.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Settlement not found' });
    res.json({ message: 'Settlement deleted successfully' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete settlement', details: err.message }); }
};
