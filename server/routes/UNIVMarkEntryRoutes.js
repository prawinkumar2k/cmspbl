import express from 'express';
import * as UNIVMarkEntryController from '../controller/UNIVMarkEntryController.js';

const router = express.Router();

// Get departments
router.get('/departments', UNIVMarkEntryController.getDepartments);

// Get semesters
router.get('/semesters', UNIVMarkEntryController.getSemesters);

// Get regulations
router.get('/regulations', UNIVMarkEntryController.getRegulations);

// Get subjects
router.get('/subjects', UNIVMarkEntryController.getSubjects);

// Get academic years
router.get('/academic-years', UNIVMarkEntryController.getAcademicYears);

// Get students
router.get('/students', UNIVMarkEntryController.getStudents);

// Get subject details (min marks)
router.get('/subject-details', UNIVMarkEntryController.getSubjectDetails);

// Save UNIV marks
router.post('/save', UNIVMarkEntryController.saveUNIVMarks);

export default router;
