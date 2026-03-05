import express from 'express';
import { 
  getAllFeeDetails, 
  addFeeDetail, 
  updateFeeDetail, 
  deleteFeeDetail,
  getFeeDetailById,
  getDepartments,
  getSemestersWithYear,
  getAcademicYears
} from '../controller/courseFeesController.js';

const router = express.Router();

// Get all departments (must be before /:id to avoid conflict)
router.get('/departments', getDepartments);

// Get all semesters with year
router.get('/semesters', getSemestersWithYear);

// Get all academic years
router.get('/academic-years', getAcademicYears);

// Get all fee details
router.get('/', getAllFeeDetails);

// Get fee detail by ID
router.get('/:id', getFeeDetailById);

// Add new fee detail
router.post('/', addFeeDetail);

// Update fee detail
router.put('/:id', updateFeeDetail);

// Delete fee detail
router.delete('/:id', deleteFeeDetail);

export default router;
