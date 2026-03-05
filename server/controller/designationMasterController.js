import Designation from '../models/Designation.js';

export const getAllDesignations = async (req, res) => {
  try {
    const list = await Designation.find().sort({ designationName: 1 });
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addDesignation = async (req, res) => {
  try {
    const { Designation: name } = req.body;
    // Case-insensitive duplicate check
    const existing = await Designation.findOne({ designationName: new RegExp(`^${name.trim()}$`, 'i') });
    if (existing) return res.status(400).json({ error: 'This designation already exists' });

    const doc = await Designation.create({ designationName: name.trim() });
    res.json({ message: 'Designation added successfully', id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { Designation: name } = req.body;
    // Duplicate check excluding current
    const existing = await Designation.findOne({ designationName: new RegExp(`^${name.trim()}$`, 'i'), _id: { $ne: id } });
    if (existing) return res.status(400).json({ error: 'This designation already exists' });
    await Designation.findByIdAndUpdate(id, { designationName: name.trim() });
    res.json({ message: 'Designation updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteDesignation = async (req, res) => {
  try {
    await Designation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Designation deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
