import { ReceiveLetter } from '../models/index.js';

function docToCamel(r) {
  if (!r) return null;
  const d = r.toObject ? r.toObject() : r;
  return {
    id: d._id,
    letterId: d.letterId,
    date: d.date,
    from: d.sender,
    message: d.message,
    status: d.status,
    replay: d.replay,
    receivedDate: d.receivedDate,
    receivedBy: d.receivedBy,
    priority: d.priority,
    department: d.department,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  };
}

export const getAll = async (req, res) => {
  try {
    const rows = await ReceiveLetter.find().sort({ createdAt: -1 }).limit(1000);
    res.json(rows.map(docToCamel));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch received letters' });
  }
};

export const createOne = async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.date || !b.from || !b.message || !b.status || !b.replay) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const row = await ReceiveLetter.create({
      letterId: b.letterId || null,
      date: String(b.date),
      sender: String(b.from),
      message: String(b.message),
      status: String(b.status),
      replay: String(b.replay),
      receivedDate: b.receivedDate || null,
      receivedBy: b.receivedBy || null,
      priority: b.priority || 'Normal',
      department: b.department || null
    });

    res.status(201).json(docToCamel(row));
  } catch (err) {
    res.status(500).json({ message: 'Failed to create received letter' });
  }
};

export const updateOne = async (req, res) => {
  try {
    const b = req.body || {};
    const updates = {};
    if (b.letterId !== undefined) updates.letterId = b.letterId;
    if (b.date !== undefined) updates.date = b.date;
    if (b.from !== undefined) updates.sender = b.from;
    if (b.message !== undefined) updates.message = b.message;
    if (b.status !== undefined) updates.status = b.status;
    if (b.replay !== undefined) updates.replay = b.replay;
    if (b.receivedDate !== undefined) updates.receivedDate = b.receivedDate;
    if (b.receivedBy !== undefined) updates.receivedBy = b.receivedBy;
    if (b.priority !== undefined) updates.priority = b.priority;
    if (b.department !== undefined) updates.department = b.department;

    const row = await ReceiveLetter.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!row) return res.status(404).json({ message: 'Letter not found' });
    res.json(docToCamel(row));
  } catch (err) {
    res.status(500).json({ message: 'Failed to update received letter' });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const row = await ReceiveLetter.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ message: 'Letter not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete received letter' });
  }
};
