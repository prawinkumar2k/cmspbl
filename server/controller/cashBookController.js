import { CashBook } from '../models/CashBook.js';

// GET /api/cashbook - fetch all fee transactions
export const getCashBookEntries = async (req, res) => {
  try {
    const rows = await CashBook.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(200);

    // Map to expected format
    const mapped = rows.map(r => ({
      date: r.date,
      voucher: r.voucher,
      type: r.type,
      detail: r.detail,
      category: r.category,
      amount: r.amount,
      mode: r.mode
    }));

    res.json(mapped);
  } catch (err) {
    console.error('getCashBookEntries error:', err);
    res.status(500).json({ message: 'Failed to fetch cash book entries' });
  }
};
