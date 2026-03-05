import { AssessmentConfig, AssessmentStudent, AssignmentMark, AssessmentMarkStatus, Staff } from '../models/index.js';

// Get distinct courses where Assessment_Type = 'Assignment'
export const getCourses = async (req, res) => {
  try {
    const list = await AssessmentConfig.find({ assessmentType: 'Assignment' }).distinct('courseName');
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
    const list = await AssessmentConfig.find({ assessmentType: 'Assignment', courseName }).distinct('deptName');

    // Also get codes
    const details = await AssessmentConfig.find({ assessmentType: 'Assignment', courseName }, { deptName: 1, deptCode: 1, _id: 0 });
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
    const list = await AssessmentConfig.find({ assessmentType: 'Assignment', courseName, deptName }).distinct('semester');
    res.json(list.map(s => ({ semester: s })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get regulations
export const getRegulations = async (req, res) => {
  try {
    const { courseName, deptName, semester } = req.query;
    const list = await AssessmentConfig.find({ assessmentType: 'Assignment', courseName, deptName, semester }).distinct('regulation');
    res.json(list.map(r => ({ regulation: r })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get sections
export const getSections = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation } = req.query;
    const list = await AssessmentConfig.find({ assessmentType: 'Assignment', courseName, deptName, semester, regulation }).distinct('classSection');
    res.json(list.map(s => ({ section: s })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get subjects
export const getSubjects = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section } = req.query;
    const list = await AssessmentConfig.find({ assessmentType: 'Assignment', courseName, deptName, semester, regulation, classSection: section }, { subName: 1, subCode: 1, _id: 0 });
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

// Get assignments
export const getAssignments = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section, subjectName } = req.query;
    const list = await AssessmentConfig.find({
      assessmentType: 'Assignment', courseName, deptName, semester, regulation, classSection: section, subName: subjectName
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
      testNo: q.assignmentNo,
      assessmentDate: q.assignmentDate,
      assessmentType: 'Assignment'
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
      assessmentType: 'Assignment',
      testNo: q.assignmentNo,
      assessmentDate: q.assignmentDate
    }).sort({ registerNumber: 1 });

    // Fetch existing marks
    const marks = await AssignmentMark.find({
      courseName: q.courseName,
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      classSection: q.section,
      subCode: q.subjectCode,
      testNo: q.assignmentNo,
      assessmentDate: q.assignmentDate
    });

    const marksMap = new Map();
    marks.forEach(m => marksMap.set(m.registerNumber, m.obtainedMark));

    const result = students.map(s => ({
      registerNo: s.registerNumber,
      studentName: s.studentName,
      assignmentMarks: marksMap.has(s.registerNumber) ? marksMap.get(s.registerNumber) : ''
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Save marks
export const saveAssignmentMarks = async (req, res) => {
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

      await AssignmentMark.findOneAndUpdate(
        {
          registerNumber: mark.registerNo,
          subCode: b.subjectCode,
          testNo: b.assignmentNo,
          assessmentDate: b.assignmentDate
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
          assessmentType: b.assessmentType || 'Assignment',
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
        testNo: b.assignmentNo,
        assessmentDate: b.assignmentDate,
        assessmentType: 'Assignment'
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
export const getAssignmentMarks = async (req, res) => {
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
    if (q.assignmentNo) filter.testNo = q.assignmentNo;

    const list = await AssignmentMark.find(filter).sort({ registerNumber: 1, testNo: 1 });
    res.json(list.map(m => ({
      id: m._id,
      registerNo: m.registerNumber,
      studentName: m.studentName,
      subjectCode: m.subCode,
      subjectName: m.subName,
      assignmentNo: m.testNo,
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
export const updateAssignmentMark = async (req, res) => {
  try {
    const { id } = req.params;
    const { obtainedMark } = req.body;
    if (obtainedMark === undefined) return res.status(400).json({ error: 'Required' });

    await AssignmentMark.findByIdAndUpdate(id, { obtainedMark: String(obtainedMark) });
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Delete mark
export const deleteAssignmentMark = async (req, res) => {
  try {
    await AssignmentMark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Report dropdowns (using marks table)
export const getReportCourses = async (req, res) => {
  try {
    const list = await AssignmentMark.distinct('courseName');
    res.json(list.map(c => ({ courseName: c })));
  } catch (error) { res.json([]); }
};

export const getReportDepartments = async (req, res) => {
  try {
    const list = await AssignmentMark.find({ courseName: req.query.courseName }, { deptName: 1, deptCode: 1, _id: 0 });
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
    const list = await AssignmentMark.find({ courseName: req.query.courseName, deptName: req.query.deptName }).distinct('semester');
    res.json(list.map(s => ({ semester: s })));
  } catch (error) { res.json([]); }
};

export const getReportRegulations = async (req, res) => {
  try {
    const list = await AssignmentMark.find({ courseName: req.query.courseName, deptName: req.query.deptName, semester: req.query.semester }).distinct('regulation');
    res.json(list.map(r => ({ regulation: r })));
  } catch (error) { res.json([]); }
};

export const getReportSections = async (req, res) => {
  try {
    const list = await AssignmentMark.find({ courseName: req.query.courseName, deptName: req.query.deptName, semester: req.query.semester, regulation: req.query.regulation }).distinct('classSection');
    res.json(list.map(s => ({ section: s })));
  } catch (error) { res.json([]); }
};

export const getReportSubjects = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section } = req.query;
    const list = await AssignmentMark.find({ courseName, deptName, semester, regulation, classSection: section }, { subName: 1, subCode: 1, _id: 0 });
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

export const getReportAssignments = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section, subjectName } = req.query;
    const list = await AssignmentMark.find({ courseName, deptName, semester, regulation, classSection: section, subName: subjectName }, { testNo: 1, assessmentDate: 1, maxMarks: 1, _id: 0 }).sort({ testNo: 1 });
    res.json(list.map(u => ({ assignmentNo: u.testNo, assessmentDate: u.assessmentDate, maxMarks: u.maxMarks })));
  } catch (error) { res.json([]); }
};
