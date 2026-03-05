import express from 'express';
import {
  getStudentsByAllocation,
  getStaffByDepartment,
  updateStudentsClassInfo,
  getDistinctClasses,
  createClass
} from '../controller/classController.js';

const router = express.Router();

router.get('/students', getStudentsByAllocation);
router.get('/staff', getStaffByDepartment);
router.get('/classes', getDistinctClasses);
router.post('/classes', createClass);
router.put('/updateStudents', updateStudentsClassInfo);

export default router;
