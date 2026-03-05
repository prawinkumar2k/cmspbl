import { AssessmentConfig, AssessmentStudent, UnitTestMark, AssessmentMarkStatus, Staff, Course } from '../models/index.js';

// Get distinct courses for Unit Test
export const getCourses = async (req, res) => {
  try {
    const list = await AssessmentConfig.find({ assessmentType: 'Unit Test' }).distinct('courseName');
    res.json(list.map(c => ({ courseName: c })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get distinct departments
export const getDepartments = async (req, res) => {
  try {
    const { courseName } = req.query;
    if (!courseName) return res.status(400).json({ error: 'Required' });
    const list = await AssessmentConfig.find({ assessmentType: 'Unit Test', courseName }).distinct('deptName');

    // Also get codes
    const details = await AssessmentConfig.find({ assessmentType: 'Unit Test', courseName }, { deptName: 1, deptCode: 1, _id: 0 });
    const unique = [];
    const seen = new Set();
    details.forEach(d => {
      if (!seen.has(d.deptName)) {
        seen.add(d.deptName);
        unique.push({ deptName: d.deptName, deptCode: d.deptCode });
      }
    });

    res.json(unique);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get semesters
export const getSemesters = async (req, res) => {
  try {
    const { courseName, deptName } = req.query;
    const list = await AssessmentConfig.find({ assessmentType: 'Unit Test', courseName, deptName }).distinct('semester');
    res.json(list.map(s => ({ semester: s })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get regulations
export const getRegulations = async (req, res) => {
  try {
    const { courseName, deptName, semester } = req.query;
    const list = await AssessmentConfig.find({ assessmentType: 'Unit Test', courseName, deptName, semester }).distinct('regulation');
    res.json(list.map(r => ({ regulation: r })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get sections
export const getSections = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation } = req.query;
    const list = await AssessmentConfig.find({ assessmentType: 'Unit Test', courseName, deptName, semester, regulation }).distinct('classSection');
    res.json(list.map(s => ({ section: s })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get subjects
export const getSubjects = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section } = req.query;
    const list = await AssessmentConfig.find({ assessmentType: 'Unit Test', courseName, deptName, semester, regulation, classSection: section }, { subName: 1, subCode: 1, _id: 0 });
    const unique = [];
    const seen = new Set();
    list.forEach(s => {
      if (!seen.has(s.subCode)) {
        seen.add(s.subCode);
        unique.push({ subjectName: s.subName, subjectCode: s.subCode });
      }
    });
    res.json(unique);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get unit tests
export const getUnitTests = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section, subjectName } = req.query;
    const list = await AssessmentConfig.find({
      assessmentType: 'Unit Test', courseName, deptName, semester, regulation, classSection: section, subName: subjectName
    }, { testNo: 1, assessmentDate: 1, maxMarks: 1, _id: 0 }).sort({ testNo: 1 });
    res.json(list.map(u => ({ testNo: u.testNo, assessmentDate: u.assessmentDate, maxMarks: u.maxMarks })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get staff
export const getStaff = async (req, res) => {
  try {
    const { courseName, deptName } = req.query;
    const dept = await AssessmentConfig.findOne({ deptName });
    if (!dept) return res.json([]);
    const list = await Staff.find({ courseName, deptCode: dept.deptCode }).sort({ staffName: 1 });
    res.json(list.map(s => ({ staffName: s.staffName, staffId: s.staffId })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Check if marks entered
export const checkMarksEntered = async (req, res) => {
  try {
    const q = req.query;
    const exists = await AssessmentMarkStatus.findOne({
      courseName: q.courseName,
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      classSection: q.section,
      subCode: q.subjectCode,
      testNo: q.unitTestNo,
      assessmentDate: q.unitTestDate,
      assessmentType: 'Unit Test'
    });
    res.json({ alreadyEntered: !!exists });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get students for mark entry
export const getStudents = async (req, res) => {
  try {
    const q = req.query;
    // Find assigned students
    const students = await AssessmentStudent.find({
      courseName: q.courseName,
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      classSection: q.section,
      assessmentType: 'Unit Test',
      testNo: q.unitTestNo,
      assessmentDate: q.unitTestDate
    }).sort({ registerNumber: 1 });

    // Fetch existing marks
    const marks = await UnitTestMark.find({
      courseName: q.courseName,
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      classSection: q.section,
      subCode: q.subjectCode,
      testNo: q.unitTestNo,
      assessmentDate: q.unitTestDate
    });

    const marksMap = new Map();
    marks.forEach(m => marksMap.set(m.registerNumber, m.obtainedMark));

    const result = students.map(s => ({
      registerNo: s.registerNumber,
      studentName: s.studentName,
      unitTestMarks: marksMap.has(s.registerNumber) ? marksMap.get(s.registerNumber) : ''
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Save marks
export const saveUnitTestMarks = async (req, res) => {
  try {
    const b = req.body;
    for (const mark of b.marks) {
      let val = mark.obtainedMarks;
      if (val === '' || val === null || val === undefined) val = '0';
      if (val !== 'A' && val !== 'a') {
        const num = parseInt(val);
        if (isNaN(num) || num < 0 || num > b.maxMarks) val = '0';
        else val = num.toString();
      } else val = 'A';

      await UnitTestMark.findOneAndUpdate(
        {
          registerNumber: mark.registerNo,
          subCode: b.subjectCode,
          testNo: b.testNo,
          assessmentDate: b.testDate
        },
        {
          studentName: mark.studentName,
          courseName: b.courseName,
          deptCode: b.deptCode,
          deptName: b.deptName,
          semester: b.semester,
          regulation: b.regulation,
          classSection: b.section,
          subName: b.subjectName,
          assessmentType: b.assessmentType || 'Unit Test',
          maxMarks: b.maxMarks,
          obtainedMark: val,
          enteredBy: b.enteredBy
        },
        { upsert: true }
      );
    }

    // Update status
    await AssessmentMarkStatus.findOneAndUpdate(
      {
        subCode: b.subjectCode,
        testNo: b.testNo,
        assessmentDate: b.testDate,
        assessmentType: 'Unit Test'
      },
      {
        courseName: b.courseName,
        deptCode: b.deptCode,
        deptName: b.deptName,
        semester: b.semester,
        regulation: b.regulation,
        classSection: b.section,
        isEntered: true
      },
      { upsert: true }
    );

    res.json({ success: true, message: 'Saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get marks for report
export const getUnitTestMarks = async (req, res) => {
  try {
    const q = req.query;
    const filter = {
      courseName: q.courseName,
      deptName: q.deptName,
      semester: q.semester,
      regulation: q.regulation,
      classSection: q.section
    };
    if (q.subjectName) filter.subName = q.subjectName;
    if (q.testNo) filter.testNo = q.testNo;

    const list = await UnitTestMark.find(filter).sort({ registerNumber: 1, testNo: 1 });
    res.json(list.map(m => ({
      id: m._id,
      registerNo: m.registerNumber,
      studentName: m.studentName,
      subjectCode: m.subCode,
      subjectName: m.subName,
      testNo: m.testNo,
      assessmentDate: m.assessmentDate,
      maxMarks: m.maxMarks,
      obtainedMark: m.obtainedMark,
      enteredBy: m.enteredBy,
      updatedAt: m.updatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Update mark
export const updateUnitTestMark = async (req, res) => {
  try {
    const { id } = req.params;
    const { obtainedMark, maxMarks } = req.body;
    if (obtainedMark === undefined) return res.status(400).json({ error: 'Required' });

    await UnitTestMark.findByIdAndUpdate(id, { obtainedMark: String(obtainedMark) });
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Delete mark
export const deleteUnitTestMark = async (req, res) => {
  try {
    await UnitTestMark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Report dropdowns (using marks table)
export const getReportCourses = async (req, res) => {
  try {
    const list = await UnitTestMark.distinct('courseName');
    res.json(list.map(c => ({ courseName: c })));
  } catch (error) { res.json([]); }
};

export const getReportDepartments = async (req, res) => {
  try {
    const list = await UnitTestMark.find({ courseName: req.query.courseName }, { deptName: 1, deptCode: 1, _id: 0 });
    const unique = [];
    const seen = new Set();
    list.forEach(d => {
      if (!seen.has(d.deptName)) {
        seen.add(d.deptName);
        unique.push({ deptName: d.deptName, deptCode: d.deptCode });
      }
    });
    res.json(unique);
  } catch (error) { res.json([]); }
};

export const getReportSemesters = async (req, res) => {
  try {
    const list = await UnitTestMark.find({ courseName: req.query.courseName, deptName: req.query.deptName }).distinct('semester');
    res.json(list.map(s => ({ semester: s })));
  } catch (error) { res.json([]); }
};

export const getReportRegulations = async (req, res) => {
  try {
    const list = await UnitTestMark.find({ courseName: req.query.courseName, deptName: req.query.deptName, semester: req.query.semester }).distinct('regulation');
    res.json(list.map(r => ({ regulation: r })));
  } catch (error) { res.json([]); }
};

export const getReportSections = async (req, res) => {
  try {
    const list = await UnitTestMark.find({ courseName: req.query.courseName, deptName: req.query.deptName, semester: req.query.semester, regulation: req.query.regulation }).distinct('classSection');
    res.json(list.map(s => ({ section: s })));
  } catch (error) { res.json([]); }
};

export const getReportSubjects = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section } = req.query;
    const list = await UnitTestMark.find({ courseName, deptName, semester, regulation, classSection: section }, { subName: 1, subCode: 1, _id: 0 });
    const unique = [];
    const seen = new Set();
    list.forEach(s => {
      if (!seen.has(s.subCode)) {
        seen.add(s.subCode);
        unique.push({ subjectName: s.subName, subjectCode: s.subCode });
      }
    });
    res.json(unique);
  } catch (error) { res.json([]); }
};

export const getReportUnitTests = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section, subjectName } = req.query;
    const list = await UnitTestMark.find({ courseName, deptName, semester, regulation, classSection: section, subName: subjectName }, { testNo: 1, assessmentDate: 1, maxMarks: 1, _id: 0 }).sort({ testNo: 1 });
    res.json(list.map(u => ({ testNo: u.testNo, assessmentDate: u.assessmentDate, maxMarks: u.maxMarks })));
  } catch (error) { res.json([]); }
};
