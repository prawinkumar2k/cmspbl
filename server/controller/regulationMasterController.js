import Regulation from '../models/Regulation.js';

export const getAllRegulations = async (req, res) => {
  try {
    const regs = await Regulation.find().sort({ regulationName: 1 });
    res.json(regs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addRegulation = async (req, res) => {
  try {
    const { Regulation: name } = req.body;
    const doc = await Regulation.create({ regulationName: name });
    res.json({ message: 'Regulation added successfully', id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editRegulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { Regulation: name } = req.body;
    await Regulation.findByIdAndUpdate(id, { regulationName: name });
    res.json({ message: 'Regulation updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteRegulation = async (req, res) => {
  try {
    await Regulation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Regulation deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
