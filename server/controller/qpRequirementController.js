import { ExamTimetable, QP } from '../models/index.js';

export const getQPRequirements = async (req, res) => {
  try {
    // ✅ Uses ExamTimetable model which has regularCount / arrearCount
    const rows = await ExamTimetable.find().select('_id qpc deptCode elective semester regulation subCode subName regularCount arrearCount');
    const mapped = rows.map(row => ({
      id: row._id,
      eqc: row.qpc,
      course: row.deptCode,
      subcode: row.subCode,
      subname: row.subName,
      elective: row.elective,
      sem: row.semester,
      regl: row.regulation,
      regular_count: row.regularCount || 0,
      arrear_count: row.arrearCount || 0,
      candidates: (row.regularCount || 0) + (row.arrearCount || 0),
    }));
    res.json(mapped);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteQPRequirement = async (req, res) => {
  try {
    await QP.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
