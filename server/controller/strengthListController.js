import { ExamTimetable } from '../models/index.js';

/* ================================
   STRENGTH LIST REPORT
================================ */
export const getStrengthListReport = async (req, res) => {
  const { type = "normal" } = req.query;

  try {
    const rows = await ExamTimetable.find().sort({ examDate: 1, session: 1, semester: 1 });

    if (!rows.length) {
      return res.json({ groups: [] });
    }

    const grouped = {};

    rows.forEach(r => {
      const dateStr = r.examDate || ''; // MongoDB stored as String YYYY-MM-DD
      const sessionStr = r.session || '';
      const key = `${dateStr}_${sessionStr}`;

      if (!grouped[key]) {
        grouped[key] = {
          exam_date: dateStr,
          session: sessionStr,
          records: [],
          totals: { regular: 0, arrear: 0, total: 0 }
        };
      }

      const regular = type === "simple" ? 0 : (r.regularCount || 0);
      const arrear = type === "simple" ? 0 : (r.arrearCount || 0);
      const total = (r.regularCount || 0) + (r.arrearCount || 0);

      grouped[key].records.push({
        qpc: r.qpc,
        dept_code: r.deptCode,
        dept_name: r.deptName,
        regulation: r.regulation,
        sem: r.semester,
        sub_code: r.subCode,
        sub_name: r.subName,
        regular,
        arrear,
        total
      });

      grouped[key].totals.regular += regular;
      grouped[key].totals.arrear += arrear;
      grouped[key].totals.total += total;
    });

    res.json({
      dept_name: rows[0].deptName || '',
      dept_code: rows[0].deptCode || '',
      groups: Object.values(grouped)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load strength list" });
  }
};
