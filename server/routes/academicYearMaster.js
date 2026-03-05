import express from 'express';
import {
  getAllAcademicYears,
  addAcademicYear,
  editAcademicYear,
  deleteAcademicYear
} from '../controller/academicYearMasterController.js';

const router = express.Router();

router.get('/', getAllAcademicYears);
router.post('/', addAcademicYear);
router.put('/:id', editAcademicYear);
router.delete('/:id', deleteAcademicYear);

export default router;
