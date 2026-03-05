// server/routes/admittedStudent.js
import express from 'express';

import {
  getAllAdmittedStudents,
  getAdmittedStudentById,
  createAdmittedStudent,
  updateAdmittedStudent,
  deleteAdmittedStudent,
  checkAndGenerateUID
} from '../controller/admittedStudentController.js'; // <-- FIXED PATH

const router = express.Router();

// GET all admitted students
router.get('/', getAllAdmittedStudents);

// CHECK/GENERATE UID based on application number (MUST come before /:id)
router.get('/check-uid/:applicationNo', checkAndGenerateUID);

// GET a single admitted student by id
router.get('/:id', getAdmittedStudentById);

// POST create a new admitted student
router.post('/create', createAdmittedStudent);

// PUT update an admitted student
router.put('/update/:id', updateAdmittedStudent);

// DELETE an admitted student
router.delete('/delete/:id', deleteAdmittedStudent);

export default router;
