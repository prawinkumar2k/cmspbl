import { Router } from 'express';
import {
  getAllocations,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getStaffs,
  getAcademicYears,
  getCourses,
  getDepartments,
  getSemesters,
  getRegulations,
  getSubjectsFiltered
} from '../controller/subjectAllocation.js';

const router = Router();

router.get('/', getAllocations);
router.post('/', createAllocation);
router.put('/:id', updateAllocation);
router.delete('/:id', deleteAllocation);

router.get('/master/staffs', getStaffs);
router.get('/master/academic_year', getAcademicYears);
router.get('/master/courses', getCourses);
router.get('/master/departments', getDepartments);
router.get('/master/semester', getSemesters);
router.get('/master/regulation', getRegulations);
router.get('/master/subjects', getSubjectsFiltered);

export default router;
