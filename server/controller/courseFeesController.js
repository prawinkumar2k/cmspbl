import { FeesDetail } from '../models/Settlement.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import AcademicYear from '../models/AcademicYear.js';

export const getAllFeeDetails = async (req, res) => {
  try {
    const rows = await FeesDetail.find().sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addFeeDetail = async (req, res) => {
  try {
    const { academicYear, modeOfJoin, type, course, department, departmentCode, feeSem, year, feeType, amount } = req.body;
    await FeesDetail.create({
      academicYear, modeOfJoin, courseName: course, deptName: department,
      deptCode: departmentCode, semester: feeSem, year, type, feesType: feeType, amount
    });
    res.json({ message: 'Fee detail added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateFeeDetail = async (req, res) => {
  try {
    const { academicYear, modeOfJoin, type, course, department, departmentCode, feeSem, year, feeType, amount } = req.body;
    await FeesDetail.findByIdAndUpdate(req.params.id, {
      academicYear, modeOfJoin, courseName: course, deptName: department,
      deptCode: departmentCode, semester: feeSem, year, type, feesType: feeType, amount
    });
    res.json({ message: 'Fee detail updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteFeeDetail = async (req, res) => {
  try {
    await FeesDetail.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee detail deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getFeeDetailById = async (req, res) => {
  try {
    const doc = await FeesDetail.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Fee detail not found' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getDepartments = async (req, res) => {
  try {
    const courses = await Course.find().select('courseName deptName deptCode').sort({ courseName: 1, deptName: 1 });
    res.json(courses.map(c => ({ Course_Name: c.courseName, Dept_Name: c.deptName, Dept_Code: c.deptCode })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getDepartmentNameByCode = async (req, res) => {
  try {
    const dept = await Course.findOne({ deptCode: req.params.deptCode }).select('deptName deptCode');
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    res.json({ Dept_Name: dept.deptName, Dept_Code: dept.deptCode });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getSemestersWithYear = async (req, res) => {
  try {
    const sems = await Semester.find().sort({ semesterNumber: 1 });
    res.json(sems.map(s => ({ Semester: s.semesterName, Year: s.year })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().select('academicYear').sort({ academicYear: -1 });
    res.json(years.map(y => ({ Academic_Year: y.academicYear })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};