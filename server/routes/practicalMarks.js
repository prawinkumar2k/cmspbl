import express from 'express';
import {
  getCourses,
  getDepartments,
  getSemesters,
  getRegulations,
  getSections,
  getSubjects,
  getPracticals,
  getStaff,
  getStudents,
  savePracticalMarks,
  getPracticalMarks,
  updatePracticalMark,
  deletePracticalMark,
  getReportCourses,
  getReportDepartments,
  getReportSemesters,
  getReportRegulations,
  getReportSections,
  getReportSubjects,
  getReportPracticals
} from '../controller/practicalMarkController.js';

const router = express.Router();

// Filter dropdown routes
router.get('/courses', getCourses);
router.get('/departments', getDepartments);
router.get('/semesters', getSemesters);
router.get('/regulations', getRegulations);
router.get('/sections', getSections);
router.get('/subjects', getSubjects);
router.get('/practicals', getPracticals);
router.get('/staff', getStaff);

// Student and marks routes
router.get('/students', getStudents);
router.post('/marks', savePracticalMarks);

// Report routes
router.get('/report/marks', getPracticalMarks);
router.get('/report/courses', getReportCourses);
router.get('/report/departments', getReportDepartments);
router.get('/report/semesters', getReportSemesters);
router.get('/report/regulations', getReportRegulations);
router.get('/report/sections', getReportSections);
router.get('/report/subjects', getReportSubjects);
router.get('/report/practicals', getReportPracticals);

router.put('/marks/:id', updatePracticalMark);
router.delete('/marks/:id', deletePracticalMark);

export default router;
