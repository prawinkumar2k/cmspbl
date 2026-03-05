/**
 * Checklist Controller — MongoDB version
 * GROUP_CONCAT(CASE WHEN ...) with JOIN → $group $push with conditional filter
 */
import { ExamSeatPlan, ExamTimetable, ExamStudentList } from '../models/Exam.js';

export const getDepartments = async (req, res) => {
  try {
    // ✅ MongoDB distinct replaces SELECT DISTINCT FROM exam_timetable
    const depts = await ExamTimetable.aggregate([
      { $group: { _id: { deptCode: '$deptCode', deptName: '$deptName' } } },
      { $sort: { '_id.deptName': 1 } }
    ]);
    res.json(depts.map(d => ({ Dept_Code: d._id.deptCode, Dept_Name: d._id.deptName })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

export const getChecklistReport = async (req, res) => {
  try {
    const { department, type } = req.query;

    // ✅ MongoDB aggregation replaces complex JOIN + GROUP_CONCAT(CASE WHEN ...)
    // Step 1: Get exam student list for the department
    const studentFilter = { deptCode: department };
    if (type === 'regular') studentFilter.examType = 'R';
    else if (type === 'arrear') studentFilter.examType = 'A';

    // Get all student entries
    const studentEntries = await ExamStudentList.find({ deptCode: department });

    // Get all exam timetable entries for this department
    const timetableEntries = await ExamTimetable.find({ deptCode: department })
      .select('subCode subName deptCode deptName');

    // Build result structure: for each subject, group registers by type
    const subjectMap = {};

    timetableEntries.forEach(t => {
      if (!subjectMap[t.subCode]) {
        subjectMap[t.subCode] = {
          Dept_Code: t.deptCode, Dept_Name: t.deptName,
          Sub_Code: t.subCode, Sub_Name: t.subName,
          regular_registers: [], arrear_registers: []
        };
      }
    });

    studentEntries.forEach(s => {
      if (!subjectMap[s.subCode]) return;
      if (s.examType === 'R') subjectMap[s.subCode].regular_registers.push(s.registerNumber);
      else if (s.examType === 'A') subjectMap[s.subCode].arrear_registers.push(s.registerNumber);
    });

    let rows = Object.values(subjectMap).map(r => ({
      ...r,
      Regular_Registers: r.regular_registers.sort().join(', '),
      Regular_Count: r.regular_registers.length,
      Arrear_Registers: r.arrear_registers.sort().join(', '),
      Arrear_Count: r.arrear_registers.length,
    }));

    // Apply type filter if specified
    if (type === 'regular') rows = rows.filter(r => r.Regular_Count > 0);
    else if (type === 'arrear') rows = rows.filter(r => r.Arrear_Count > 0);

    rows.sort((a, b) => a.Sub_Code.localeCompare(b.Sub_Code));
    res.json(rows);
  } catch (err) {
    console.error('Checklist Error:', err);
    res.json([]);  // Never crash frontend — same as original
  }
};
