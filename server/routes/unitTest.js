import express from 'express';
import {
  getCourses,
  getDepartments,
  getSemesters,
  getRegulations,
  getSections,
  getSubjects,
  getUnitTests,
  getStaff,
  getStudents,
  checkMarksEntered,
  saveUnitTestMarks,
  getUnitTestMarks,
  updateUnitTestMark,
  deleteUnitTestMark,
  getReportCourses,
  getReportDepartments,
  getReportSemesters,
  getReportRegulations,
  getReportSections,
  getReportSubjects,
  getReportUnitTests
} from '../controller/unitTestController.js';

const router = express.Router();

// Filter dropdown routes
router.get('/courses', getCourses);
router.get('/departments', getDepartments);
router.get('/semesters', getSemesters);
router.get('/regulations', getRegulations);
router.get('/sections', getSections);
router.get('/subjects', getSubjects);
router.get('/unittests', getUnitTests);
router.get('/staff', getStaff);

// Student and marks routes
router.get('/students', getStudents);
router.get('/check-marks', checkMarksEntered);
router.post('/marks', saveUnitTestMarks);

// Report routes
router.get('/report/marks', getUnitTestMarks);
router.get('/report/courses', getReportCourses);
router.get('/report/departments', getReportDepartments);
router.get('/report/semesters', getReportSemesters);
router.get('/report/regulations', getReportRegulations);
router.get('/report/sections', getReportSections);
router.get('/report/subjects', getReportSubjects);
router.get('/report/unittests', getReportUnitTests);

router.put('/marks/:id', updateUnitTestMark);
router.delete('/marks/:id', deleteUnitTestMark);

export default router;
