import express from 'express';
import {
  getCourses,
  getDepartments,
  getSemesters,
  getRegulations,
  getSections,
  getSubjects,
  getAssignments,
  getStaff,
  getStudents,
  checkMarksEntered,
  saveAssignmentMarks,
  getAssignmentMarks,
  updateAssignmentMark,
  deleteAssignmentMark,
  getReportCourses,
  getReportDepartments,
  getReportSemesters,
  getReportRegulations,
  getReportSections,
  getReportSubjects,
  getReportAssignments
} from '../controller/assignmentMarkController.js';

const router = express.Router();

// Filter dropdown routes
router.get('/courses', getCourses);
router.get('/departments', getDepartments);
router.get('/semesters', getSemesters);
router.get('/regulations', getRegulations);
router.get('/sections', getSections);
router.get('/subjects', getSubjects);
router.get('/assignments', getAssignments);
router.get('/staff', getStaff);

// Student and marks routes
router.get('/students', getStudents);
router.get('/check-marks', checkMarksEntered);
router.post('/marks', saveAssignmentMarks);

// Report routes
router.get('/report/marks', getAssignmentMarks);
router.get('/report/courses', getReportCourses);
router.get('/report/departments', getReportDepartments);
router.get('/report/semesters', getReportSemesters);
router.get('/report/regulations', getReportRegulations);
router.get('/report/sections', getReportSections);
router.get('/report/subjects', getReportSubjects);
router.get('/report/assignments', getReportAssignments);

router.put('/marks/:id', updateAssignmentMark);
router.delete('/marks/:id', deleteAssignmentMark);

export default router;
