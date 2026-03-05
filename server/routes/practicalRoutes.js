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
  checkMarksEntered,
  savePracticalMarks
} from '../controller/practicalController.js';

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
router.get('/check-marks', checkMarksEntered);
router.post('/marks', savePracticalMarks);

export default router;
