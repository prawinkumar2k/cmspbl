import Semester from '../models/Semester.js';

// Auto-derive year from semester number
const semToYear = (semNum) => {
  const n = parseInt(semNum);
  if (n >= 1 && n <= 2) return '1';
  if (n >= 3 && n <= 4) return '2';
  if (n >= 5 && n <= 6) return '3';
  if (n >= 7 && n <= 8) return '4';
  return '';
};

export const getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find().sort({ semesterNumber: 1 });
    res.json(semesters);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addSemester = async (req, res) => {
  try {
    const { Semester: sem } = req.body;
    const doc = await Semester.create({ semesterName: sem, semesterNumber: parseInt(sem), year: semToYear(sem) });
    res.json({ message: 'Semester added successfully', id: doc._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { Semester: sem } = req.body;
    await Semester.findByIdAndUpdate(id, { semesterName: sem, semesterNumber: parseInt(sem), year: semToYear(sem) });
    res.json({ message: 'Semester updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteSemester = async (req, res) => {
  try {
    await Semester.findByIdAndDelete(req.params.id);
    res.json({ message: 'Semester deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
