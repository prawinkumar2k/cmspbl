import { AssessmentConfig, PracticalMark, PracticalMarkStatus } from '../models/Assessment.js';
import Staff from '../models/Staff.js';
import Student from '../models/Student.js';

// Get distinct courses where Assessment_Type = 'Practical'
export const getCourses = async (req, res) => {
  try {
    const courses = await AssessmentConfig.find({ assessmentType: 'Practical' }).distinct('courseName');
    res.json(courses.map(name => ({ courseName: name })));
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get distinct departments for a selected course
export const getDepartments = async (req, res) => {
  try {
    const { courseName } = req.query;
    if (!courseName) return res.status(400).json({ error: 'Course name is required' });

    const departments = await AssessmentConfig.find({ assessmentType: 'Practical', courseName }).distinct('deptName');
    // Note: To get deptCode, we'd need a more complex query or multiple lookups
    const list = await AssessmentConfig.find({ assessmentType: 'Practical', courseName }, { deptName: 1, deptCode: 1, _id: 0 });

    // Unique by deptName
    const uniqueDepts = [];
    const seen = new Set();
    for (const d of list) {
      if (!seen.has(d.deptName)) {
        seen.add(d.deptName);
        uniqueDepts.push({ deptName: d.deptName, deptCode: d.deptCode });
      }
    }

    res.json(uniqueDepts);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get distinct semesters
export const getSemesters = async (req, res) => {
  try {
    const { courseName, deptName } = req.query;
    if (!courseName || !deptName) return res.status(400).json({ error: 'Course and department are required' });

    const semesters = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName }).distinct('semester');
    res.json(semesters.map(s => ({ semester: s })));
  } catch (error) {
    console.error('Error fetching semesters:', error);
    res.status(500).json({ error: 'Failed to fetch semesters' });
  }
};

// Get distinct regulations
export const getRegulations = async (req, res) => {
  try {
    const { courseName, deptName, semester } = req.query;
    if (!courseName || !deptName || !semester) return res.status(400).json({ error: 'Course, dept, and semester are required' });

    const regulations = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName, semester }).distinct('regulation');
    res.json(regulations.map(r => ({ regulation: r })));
  } catch (error) {
    console.error('Error fetching regulations:', error);
    res.status(500).json({ error: 'Failed to fetch regulations' });
  }
};

// Get distinct sections
export const getSections = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation } = req.query;
    if (!courseName || !deptName || !semester || !regulation) return res.status(400).json({ error: 'All filters are required' });

    const sections = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName, semester, regulation }).distinct('classSection');
    res.json(sections.map(s => ({ section: s })));
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
};

// Get distinct subjects
export const getSubjects = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section } = req.query;
    if (!courseName || !deptName || !semester || !regulation || !section) return res.status(400).json({ error: 'All filters are required' });

    const list = await AssessmentConfig.find({ assessmentType: 'Practical', courseName, deptName, semester, regulation, classSection: section }, { subName: 1, subCode: 1, _id: 0 });

    const unique = [];
    const seen = new Set();
    for (const s of list) {
      if (!seen.has(s.subCode)) {
        seen.add(s.subCode);
        unique.push({ subjectName: s.subName, subjectCode: s.subCode });
      }
    }
    res.json(unique);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

// Get distinct practical numbers (Test_No)
export const getPracticals = async (req, res) => {
  try {
    const { courseName, deptName, semester, regulation, section, subjectName } = req.query;
    if (!courseName || !deptName || !semester || !regulation || !section || !subjectName) return res.status(400).json({ error: 'All filters are required' });

    const list = await AssessmentConfig.find({
      assessmentType: 'Practical', courseName, deptName, semester, regulation, classSection: section, subName: subjectName
    }, { testNo: 1, assessmentDate: 1, maxMarks: 1, experimentCount: 1, _id: 0 }).sort({ testNo: 1 });

    res.json(list.map(p => ({
      testNo: p.testNo,
      assessmentDate: p.assessmentDate,
      maxMarks: p.maxMarks,
      experimentCount: p.experimentCount
    })));
  } catch (error) {
    console.error('Error fetching practicals:', error);
    res.status(500).json({ error: 'Failed to fetch practicals' });
  }
};

// Get distinct staff names
export const getStaff = async (req, res) => {
  try {
    const { courseName, deptName } = req.query;
    if (!courseName || !deptName) return res.status(400).json({ error: 'Course and dept are required' });

    // In Staff model, we have deptName
    const staff = await Staff.find({ deptName }).sort({ staffName: 1 });
    res.json(staff.map(s => ({ staffName: s.staffName, staffId: s.staffId })));
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

// Check if marks are already entered
export const checkMarksEntered = async (req, res) => {
  try {
    const { courseName, deptCode, semester, regulation, section, subjectCode, practicalNo, practicalDate } = req.query;

    const exists = await PracticalMarkStatus.findOne({
      courseName, deptCode, semester, regulation, classSection: section, subCode: subjectCode, testNo: practicalNo, assessmentDate: practicalDate
    });

    res.json({ alreadyEntered: !!exists });
  } catch (error) {
    console.error('Error checking marks status:', error);
    res.status(500).json({ error: 'Failed to check marks status' });
  }
};

// Get students for mark entry
export const getStudents = async (req, res) => {
  try {
    const q = req.query;

    // Find students matching enrollment
    // We assume students are in Student model
    const students = await Student.find({
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      // class: section? 
      admissionStatus: 'Admitted'
    }).sort({ registerNumber: 1 });

    // Fetch existing marks
    const marks = await PracticalMark.find({
      deptCode: q.deptCode,
      semester: q.semester,
      regulation: q.regulation,
      classSection: q.section,
      subCode: q.subjectCode,
      testNo: q.testNo,
      assessmentDate: q.assessmentDate
    });

    const marksMap = new Map();
    marks.forEach(m => marksMap.set(m.registerNumber, m));

    const result = students.map(s => {
      const m = marksMap.get(s.registerNumber);
      const experiments = [];
      if (m && m.experimentMarks) {
        // Map experimentMarks back to array format for frontend
        for (let i = 1; i <= 15; i++) {
          const val = m.experimentMarks.get(String(i));
          if (val !== undefined) experiments.push({ marks: val });
        }
      }

      return {
        registerNo: s.registerNumber,
        studentName: s.studentName,
        existingExperiments: experiments.length > 0 ? experiments : null
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Save practical marks
export const savePracticalMarks = async (req, res) => {
  try {
    const b = req.body;
    const expCountNum = parseInt(b.experimentCount) || 1;

    for (const student of b.students) {
      const expMap = {};
      if (student.experiments) {
        student.experiments.forEach((exp, idx) => {
          expMap[String(idx + 1)] = (exp.marks === 'A' || exp.marks === 'a') ? 'A' : (exp.marks || '0');
        });
      }

      await PracticalMark.findOneAndUpdate(
        {
          registerNumber: student.registerNo,
          subCode: b.subjectCode,
          assessmentDate: b.assessmentDate,
          testNo: b.testNo
        },
        {
          studentName: student.studentName,
          courseName: b.courseName,
          deptName: b.deptName,
          deptCode: b.deptCode,
          semester: b.semester,
          regulation: b.regulation,
          classSection: b.section,
          subName: b.subjectName,
          maxMarks: 50,
          experimentCount: expCountNum,
          enteredBy: b.staffId,
          experimentMarks: expMap
        },
        { upsert: true }
      );
    }

    // Mark as entered
    await PracticalMarkStatus.findOneAndUpdate(
      {
        subCode: b.subjectCode,
        testNo: b.testNo,
        assessmentDate: b.assessmentDate
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

    res.json({ success: true, message: `Practical marks saved successfully for ${b.students.length} students` });
  } catch (error) {
    console.error('Error saving practical marks:', error);
    res.status(500).json({ error: 'Failed to save practical marks' });
  }
};
