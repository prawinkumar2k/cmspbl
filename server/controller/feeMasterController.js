import FeeMaster from '../models/FeeMaster.js';

export const getAllFees = async (req, res) => {
  try {
    const fees = await FeeMaster.find().sort({ feeType: 1 });
    res.json(fees);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addFee = async (req, res) => {
  try {
    const { Fee_Type } = req.body;
    const doc = await FeeMaster.create({ feeType: Fee_Type });
    res.json({ message: 'Fee type added successfully', id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { Fee_Type } = req.body;
    await FeeMaster.findByIdAndUpdate(id, { feeType: Fee_Type });
    res.json({ message: 'Fee type updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteFee = async (req, res) => {
  try {
    await FeeMaster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee type deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
