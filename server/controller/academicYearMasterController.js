import AcademicYear from '../models/AcademicYear.js';

export const getAllAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ academicYear: -1 });
    res.json(years);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addAcademicYear = async (req, res) => {
  try {
    const { Academic_Year } = req.body;
    const doc = await AcademicYear.create({ academicYear: Academic_Year });
    res.json({ message: 'Academic year added successfully', id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { Academic_Year } = req.body;
    await AcademicYear.findByIdAndUpdate(id, { academicYear: Academic_Year });
    res.json({ message: 'Academic year updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    await AcademicYear.findByIdAndDelete(id);
    res.json({ message: 'Academic year deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
