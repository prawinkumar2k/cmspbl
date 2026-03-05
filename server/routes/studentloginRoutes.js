import express from 'express';
import { getAdmittedStudents, updateStudentPassword } from '../controller/studentloginController.js';

const router = express.Router();

router.get('/', getAdmittedStudents);
router.put('/update-password/:id', updateStudentPassword);

export default router;
