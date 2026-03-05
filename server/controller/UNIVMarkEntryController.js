import { Course, Semester, Regulation, Subject, AcademicYear, Student, UnivMark } from '../models/index.js';

// Get distinct departments
export const getDepartments = async (req, res) => {
  try {
    const rows = await Course.find({}, { deptName: 1, deptCode: 1, _id: 0 }).sort({ deptName: 1 });
    res.json(rows.map(r => ({ deptName: r.deptName, deptCode: r.deptCode })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get semesters
export const getSemesters = async (req, res) => {
  try {
    const rows = await Semester.find().sort({ semesterNumber: 1 });
    res.json(rows.map(s => ({ semester: s.semesterName, year: s.year })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get regulations
export const getRegulations = async (req, res) => {
  try {
    const rows = await Regulation.find().sort({ regulationName: -1 });
    res.json(rows.map(r => ({ regulation: r.regulationName })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get subjects
export const getSubjects = async (req, res) => {
  try {
    const { deptCode, semester, regulation } = req.query;
    const rows = await Subject.find({ deptCode, semester, regulation }).sort({ subName: 1 });
    res.json(rows.map(r => ({
      subjectName: r.subName,
      subjectCode: r.subCode,
      internalMinMark: r.internalMinMark || 25,
      externalMinMark: r.externalMinMark || 25,
      internalMaxMark: r.internalMaxMark || 50,
      externalMaxMark: r.externalMaxMark || 50
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get academic years
export const getAcademicYears = async (req, res) => {
  try {
    const rows = await AcademicYear.find().sort({ academicYear: -1 });
    res.json(rows.map(r => ({ academicYear: r.academicYear })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get students for mark entry
export const getStudents = async (req, res) => {
  try {
    const q = req.query;
    const students = await Student.find({
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      academicYear: q.academicYear,
      admissionStatus: 'Admitted'
    }).sort({ registerNumber: 1 });

    const marks = await UnivMark.find({
      deptCode: q.deptCode,
      semester: q.semester,
      subCode: q.subjectCode,
      academicYear: q.academicYear
    });

    const marksMap = new Map();
    marks.forEach(m => marksMap.set(m.registerNumber, m));

    const result = students.map(s => {
      const m = marksMap.get(s.registerNumber) || {};
      return {
        registerNo: s.registerNumber,
        studentName: s.studentName,
        deptCode: s.deptCode,
        semester: s.semester,
        regulation: s.regulation,
        academicYear: s.academicYear,
        internalMark: m.internalMark || null,
        externalMark: m.externalMark || null,
        attemptLevel: m.attemptLevel || null
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get subject details
export const getSubjectDetails = async (req, res) => {
  try {
    const q = req.query;
    const sub = await Subject.findOne({
      subCode: q.subjectCode,
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation
    });
    if (!sub) return res.status(404).json({ error: 'Not found' });
    res.json({
      internalMinMark: sub.internalMinMark || 25,
      externalMinMark: sub.externalMinMark || 25
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Save UNIV marks
export const saveUNIVMarks = async (req, res) => {
  try {
    const b = req.body;
    const sub = await Subject.findOne({ subCode: b.subjectCode });
    const iMin = sub?.internalMinMark || 25;
    const eMin = sub?.externalMinMark || 25;

    for (const m of b.marks) {
      let iMark = m.internalMark;
      let eMark = m.externalMark;

      if (iMark === '' || iMark === null) iMark = '0';
      if (eMark === '' || eMark === null) eMark = '0';

      let total = '0';
      let status = 'F';

      if (iMark === 'A' || eMark === 'A') {
        total = 'A';
        status = 'F';
      } else {
        const intM = parseInt(iMark) || 0;
        const extM = parseInt(eMark) || 0;
        total = String(intM + extM);
        status = (intM >= iMin && extM >= eMin) ? 'P' : 'F';
      }

      await UnivMark.findOneAndUpdate(
        {
          registerNumber: m.registerNo,
          subCode: b.subjectCode,
          semester: b.semester,
          academicYear: b.academicYear,
          deptCode: b.deptCode
        },
        {
          studentName: m.studentName,
          regulation: b.regulation,
          subName: b.subjectName,
          internalMark: iMark,
          externalMark: eMark,
          totalMark: total,
          status: status,
          attemptLevel: m.attemptLevel || '',
          enteredBy: b.enteredBy
        },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'Saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
