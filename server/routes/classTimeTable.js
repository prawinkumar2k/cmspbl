import express from 'express';
import {
  getAllCourses,
  getAllDepartments,
  getDepartmentsByCourse,
  getAllSemesters,
  getAllYears,
  getAllRegulations,
  getClasses,
  getSubjects,
  getTimetable,
  saveTimetable,
  deleteTimetable,
  updateTimetableCell
} from '../controller/classTimeTableController.js';

const router = express.Router();

// Get dropdown options
router.get('/courses', getAllCourses);
router.get('/departments', getAllDepartments);
router.get('/departments/:courseId', getDepartmentsByCourse);
router.get('/semesters', getAllSemesters);
router.get('/years', getAllYears);
router.get('/regulations', getAllRegulations);
router.get('/classes', getClasses);
router.get('/subjects', getSubjects);

// Timetable operations
router.get('/timetable', getTimetable);
router.post('/timetable', saveTimetable);
router.delete('/timetable', deleteTimetable);
router.put('/timetable/cell', updateTimetableCell);

export default router;
