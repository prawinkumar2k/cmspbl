import { ExamTimetable, Regulation, Semester, Course, Subject, Student } from '../models/index.js';

// Get all timetables
export const getTimetables = async (req, res) => {
  try {
    const rows = await ExamTimetable.find().sort({ examDate: -1 });
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Get by ID
export const getTimetableById = async (req, res) => {
  try {
    const row = await ExamTimetable.findById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Create
export const createTimetable = async (req, res) => {
  try {
    const b = req.body;
    const row = await ExamTimetable.create({
      deptCode: b.Dept_Code,
      deptName: b.Dept_Name,
      subCode: b.Sub_Code,
      subName: b.Sub_Name,
      examDate: b.Exam_Date,
      dayOrder: b.Day_Order,
      session: b.Session,
      regulation: b.Regulation,
      semester: b.Semester,
      year: b.Year,
      qpc: b.QPC,
      elective: b.Elective,
      electiveNo: b.Elective_No,
      regularCount: b.Regular_Count || 0,
      arrearCount: b.Arrear_Count || 0
    });
    res.status(201).json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Update
export const updateTimetable = async (req, res) => {
  try {
    const b = req.body;
    const update = {
      deptCode: b.Dept_Code,
      deptName: b.Dept_Name,
      subCode: b.Sub_Code,
      subName: b.Sub_Name,
      examDate: b.Exam_Date,
      dayOrder: b.Day_Order,
      session: b.Session,
      regulation: b.Regulation,
      semester: b.Semester,
      year: b.Year,
      qpc: b.QPC,
      elective: b.Elective,
      electiveNo: b.Elective_No,
      regularCount: b.Regular_Count,
      arrearCount: b.Arrear_Count
    };

    // Remove undefined
    Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);

    const row = await ExamTimetable.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Delete
export const deleteTimetable = async (req, res) => {
  try {
    await ExamTimetable.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};

// Master Lookups
export const getMasterRegulations = async (req, res) => {
  try {
    const rows = await Regulation.find().sort({ regulationName: -1 });
    res.json({ success: true, data: rows.map(r => ({ Regulation: r.regulationName })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getMasterSemesters = async (req, res) => {
  try {
    const rows = await Semester.find().sort({ semesterNumber: 1 });
    res.json({ success: true, data: rows.map(s => ({ Semester: s.semesterName })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getMasterDepartments = async (req, res) => {
  try {
    const rows = await Course.find().sort({ deptName: 1 });
    res.json({ success: true, data: rows.map(r => ({ Dept_Name: r.deptName, Dept_Code: r.deptCode })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getMasterSubjects = async (req, res) => {
  try {
    const q = req.query;
    const filter = { subType: 'T' };
    if (q.deptCode) filter.deptCode = q.deptCode;
    if (q.semester) filter.semester = q.semester;
    if (q.regulation) filter.regulation = q.regulation;
    if (q.qpc) filter.qpc = q.qpc;

    const rows = await Subject.find(filter).sort({ subName: 1 });
    res.json({
      success: true, data: rows.map(r => ({
        Sub_Code: r.subCode, Sub_Name: r.subName, Regulation: r.regulation, Semester: r.semester, QPC: r.qpc
      }))
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// Subjects with Counts
export const getMasterSubjectsWithCounts = async (req, res) => {
  try {
    const { qpc, deptCode, semester } = req.query;
    const sem = parseInt(semester);
    if (!sem || sem < 1) return res.status(400).json({ success: false, message: "Invalid semester" });

    const filter = {};
    if (qpc) filter.qpc = qpc;
    if (deptCode) filter.deptCode = deptCode;

    const subjects = await Subject.find(filter).sort({ subName: 1 });

    const results = await Promise.all(subjects.map(async (sub) => {
      // Regular Count: matched by current semester and department
      // And having this subject in their current semester registration?
      // SQL used currentSemesterColumn which was S1, S2, etc.
      // In MongoDB, we use arrearSemX for registrations.

      const subCode = sub.subCode;
      const regExp = new RegExp(`(^|,)${subCode}(,|$)`);

      // Regular: In current semester AND subject in S<sem>
      const regularCount = await Student.countDocuments({
        deptCode,
        semester: String(sem),
        admissionStatus: 'Admitted',
        [`arrearSem${sem}`]: regExp
      });

      // Arrear: Not in current semester but having subject in ANY previous semester S1...S<sem-1>
      let arrearCount = 0;
      if (sem > 1) {
        const arrearFilters = [];
        for (let i = 1; i < sem; i++) {
          arrearFilters.push({ [`arrearSem${i}`]: regExp });
        }
        arrearCount = await Student.countDocuments({
          deptCode,
          admissionStatus: 'Admitted',
          $or: arrearFilters
        });
      }

      return {
        ...sub.toObject(),
        Sub_Code: sub.subCode,
        Sub_Name: sub.subName,
        Regular_Count: regularCount,
        Arrear_Count: arrearCount
      };
    }));

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
