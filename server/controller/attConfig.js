/**
 * Attendance Config Controller — MongoDB version
 */
import AttendanceConfig from '../models/AttendanceConfig.js';
import CourseMaster from '../models/CourseMaster.js';
import Subject from '../models/Subject.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import Regulation from '../models/Regulation.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await CourseMaster.find().distinct('courseName');
    res.json(courses.map(name => ({ Course_Name: name })));
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getSubjectsFiltered = async (req, res) => {
  const { deptCode, semester, regulation } = req.query;
  try {
    const filter = {};
    if (deptCode) filter.deptCode = deptCode;
    if (semester) filter.semester = semester;
    if (regulation) filter.regulation = regulation;

    const subjects = await Subject.find(filter).select('subName subCode subType');
    res.json(subjects.map(s => ({ Sub_Name: s.subName, Sub_Code: s.subCode, Sub_Type: s.subType })) || []);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

export const checkSubjectCode = async (req, res) => {
  try {
    const { subCode, deptCode, excludeId } = req.query;
    if (!subCode || !deptCode) return res.status(400).json({ exists: false });

    const filter = { subCode, deptCode };
    if (excludeId) filter._id = { $ne: excludeId };

    const existing = await AttendanceConfig.findOne(filter).select('_id');
    res.json({ exists: !!existing });
  } catch (err) {
    console.error('Error checking subject code:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getDepartmentsByCourse = async (req, res) => {
  try {
    // ✅ MongoDB: filter Course collection instead of JOIN
    const courses = await Course.find({ courseName: req.query.courseName }).select('deptName deptCode');
    res.json(courses.map(c => ({ Dept_Name: c.deptName, Dept_Code: c.deptCode })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

export const getYearAndRegulation = async (req, res) => {
  try {
    const sem = await Semester.findOne({ semesterName: req.query.semester }).select('year');
    if (!sem) return res.json({});
    res.json({ Year: sem.year || '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch year' });
  }
};

export const getRegulations = async (req, res) => {
  try {
    const regs = await Regulation.find().select('regulationName');
    res.json(regs.map(r => r.regulationName));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch regulations' });
  }
};

export const getSemesters = async (req, res) => {
  try {
    const sems = await Semester.find().sort({ semesterNumber: 1 });
    res.json(sems.map(s => ({ Semester: s.semesterName, Year: s.year })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch semesters' });
  }
};

export const saveAttendanceConfig = async (req, res) => {
  const { courseName, deptName, deptCode, semester, regulation, subCode, subName, subType, totalHours } = req.body;
  try {
    await AttendanceConfig.create({ courseName, deptName, deptCode, semester, regulation, subCode, subName, subType, totalHours });
    res.json({ success: true, message: 'Attendance configuration saved.' });
  } catch (err) {
    console.error('Error saving attendance configuration:', err);
    res.status(500).json({ error: 'Failed to save attendance configuration' });
  }
};

export const listAttendanceConfigs = async (req, res) => {
  try {
    const configs = await AttendanceConfig.find().sort({ deptName: 1, semester: 1 });
    res.json(configs);
  } catch (err) {
    console.error('Error fetching configurations:', err);
    res.status(500).json({ error: 'Failed to fetch attendance configurations' });
  }
};

export const updateAttendanceConfig = async (req, res) => {
  const { id } = req.params;
  const { courseName, deptName, deptCode, semester, regulation, subCode, subName, subType, totalHours } = req.body;
  try {
    await AttendanceConfig.findByIdAndUpdate(id, { courseName, deptName, deptCode, semester, regulation, subCode, subName, subType, totalHours });
    res.json({ success: true, message: 'Attendance configuration updated.' });
  } catch (err) {
    console.error('Error updating configuration:', err);
    res.status(500).json({ error: 'Failed to update attendance configuration' });
  }
};

export const deleteAttendanceConfig = async (req, res) => {
  try {
    await AttendanceConfig.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Attendance configuration deleted.' });
  } catch (err) {
    console.error('Error deleting configuration:', err);
    res.status(500).json({ error: 'Failed to delete attendance configuration' });
  }
};
