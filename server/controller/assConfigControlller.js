import { CourseMaster, Course, Semester, Regulation, Subject, Student, AssessmentConfig } from '../models/index.js';

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await CourseMaster.find().sort({ courseName: 1 });
    res.json(courses.map(c => ({ id: c._id, name: c.courseName })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Course.find().sort({ deptName: 1 });
    res.json(departments.map(d => ({ id: d._id, name: d.deptName, code: d.deptCode })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get all semesters
export const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find().sort({ semesterNumber: 1 });
    res.json(semesters.map(s => ({ id: s._id, semester: s.semesterName, year: s.year })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get all regulations
export const getRegulations = async (req, res) => {
  try {
    const regulations = await Regulation.find().sort({ regulationName: -1 });
    res.json(regulations.map(r => ({ id: r._id, regulation: r.regulationName })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get subjects
export const getSubjects = async (req, res) => {
  try {
    const { deptCode, semester, regulation, assessmentType } = req.query;
    if (!deptCode || !semester || !regulation) return res.status(400).json({ error: 'Required filters missing' });

    let subType = null;
    if (assessmentType === 'Practical') subType = 'P';
    else if (assessmentType === 'Assignment' || assessmentType === 'Unit Test') subType = 'T';

    const filter = { deptCode, semester, regulation };
    if (subType) filter.subType = subType;

    const subjects = await Subject.find(filter).sort({ subName: 1 });
    res.json(subjects.map(s => ({ id: s._id, subjectName: s.subName, subjectCode: s.subCode, subType: s.subType })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get sections
export const getSections = async (req, res) => {
  try {
    const { deptId, semesterId, regulationId } = req.query;
    if (!deptId || !semesterId || !regulationId) return res.status(400).json({ error: 'Required IDs missing' });

    const dept = await Course.findById(deptId);
    const sem = await Semester.findById(semesterId);
    const reg = await Regulation.findById(regulationId);

    const sections = await Student.distinct('class', {
      deptCode: dept.deptCode,
      semester: sem.semesterName,
      regulation: reg.regulationName
    });

    res.json(sections.sort().map(s => ({ section: s })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get next test number
export const getNextTestNumber = async (req, res) => {
  try {
    const { deptCode, semester, regulation, section, subjectCode, assessmentType } = req.query;
    const result = await AssessmentConfig.findOne({
      deptCode, semester, regulation, classSection: section, subCode: subjectCode, assessmentType
    }).sort({ testNo: -1 });

    const nextTestNo = (result ? result.testNo : 0) + 1;
    res.json({ nextTestNo });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Get all configs
export const getAssessmentConfigs = async (req, res) => {
  try {
    const configs = await AssessmentConfig.find().sort({ createdAt: -1 });
    res.json(configs.map(c => ({
      id: c._id,
      courseName: c.courseName,
      branch: c.deptName,
      branchCode: c.deptCode,
      semester: c.semester,
      regulation: c.regulation,
      section: c.classSection,
      subjectCode: c.subCode,
      subjectName: c.subName,
      assessmentType: c.assessmentType,
      assessmentDate: c.assessmentDate,
      maxMarks: c.maxMarks,
      testNo: c.testNo,
      experimentCount: c.experimentCount
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Create config
export const createAssessmentConfig = async (req, res) => {
  try {
    const b = req.body;
    const course = await CourseMaster.findById(b.courseId);
    const dept = await Course.findById(b.deptId);
    const sem = await Semester.findById(b.semesterId);
    const reg = await Regulation.findById(b.regulationId);

    const config = await AssessmentConfig.create({
      courseName: course.courseName,
      deptName: dept.deptName,
      deptCode: dept.deptCode,
      semester: sem.semesterName,
      regulation: reg.regulationName,
      classSection: b.section,
      subCode: b.subjectCode,
      subName: b.subjectName,
      assessmentType: b.assessmentType,
      assessmentDate: b.assessmentDate,
      maxMarks: b.maxMarks,
      testNo: b.testNo,
      experimentCount: b.assessmentType === 'Practical' ? b.experimentCount : null
    });

    res.status(201).json({ message: 'Success', id: config._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Update config
export const updateAssessmentConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;
    const course = await CourseMaster.findById(b.courseId);
    const dept = await Course.findById(b.deptId);
    const sem = await Semester.findById(b.semesterId);
    const reg = await Regulation.findById(b.regulationId);

    await AssessmentConfig.findByIdAndUpdate(id, {
      courseName: course.courseName,
      deptName: dept.deptName,
      deptCode: dept.deptCode,
      semester: sem.semesterName,
      regulation: reg.regulationName,
      classSection: b.section,
      subCode: b.subjectCode,
      subName: b.subjectName,
      assessmentType: b.assessmentType,
      assessmentDate: b.assessmentDate,
      maxMarks: b.maxMarks,
      testNo: b.testNo,
      experimentCount: b.assessmentType === 'Practical' ? b.experimentCount : null
    });

    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

// Delete config
export const deleteAssessmentConfig = async (req, res) => {
  try {
    await AssessmentConfig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
