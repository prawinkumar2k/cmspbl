import { CollegeStrength } from '../models/MasterData.js';

export const getCollegeStrength = async (req, res) => {
  try {
    const rows = await CollegeStrength.find().sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) {
    console.error('GET ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch college strength' });
  }
};

export const addCollegeStrength = async (req, res) => {
  try {
    const { CourseCode, Branch, Year_1, Year_2, Year_3, Year_4, Others, Total } = req.body;
    const doc = await CollegeStrength.create({
      courseCode: CourseCode, branch: Branch,
      year1: Year_1, year2: Year_2, year3: Year_3, year4: Year_4,
      others: Others, total: Total
    });
    res.json({ id: doc._id, CourseCode, Branch, Year_1, Year_2, Year_3, Year_4, Others, Total });
  } catch (err) {
    console.error('ADD ERROR:', err);
    res.status(500).json({ error: 'Failed to add college strength row' });
  }
};

export const updateCollegeStrength = async (req, res) => {
  try {
    const { id } = req.params;
    const { CourseCode, Branch, Year_1, Year_2, Year_3, Year_4, Others, Total } = req.body;
    await CollegeStrength.findByIdAndUpdate(id, {
      courseCode: CourseCode, branch: Branch,
      year1: Year_1, year2: Year_2, year3: Year_3, year4: Year_4,
      others: Others, total: Total
    });
    res.json({ id, CourseCode, Branch, Year_1, Year_2, Year_3, Year_4, Others, Total });
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ error: 'Failed to update college strength row' });
  }
};

export const deleteCollegeStrength = async (req, res) => {
  try {
    await CollegeStrength.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ error: 'Failed to delete college strength row' });
  }
};

export const bulkCollegeStrength = async (req, res) => {
  try {
    const rows = req.body;
    if (!Array.isArray(rows) || rows.length === 0) return res.status(400).json({ error: 'No rows provided' });

    const docs = rows.map(r => ({
      courseCode: r.CourseCode, branch: r.Branch,
      year1: r.Year_1, year2: r.Year_2, year3: r.Year_3, year4: r.Year_4,
      others: r.Others, total: r.Total
    }));

    await CollegeStrength.insertMany(docs);
    res.json({ success: true, inserted: docs.length });
  } catch (err) {
    console.error('BULK INSERT ERROR:', err);
    res.status(500).json({ error: 'Bulk insert failed' });
  }
};
