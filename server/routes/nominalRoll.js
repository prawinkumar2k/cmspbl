import express from 'express';
import { getNominalRollStudents, getNominalRollStudentsFiltered } from '../controller/nominalRollController.js';

const router = express.Router();

// Get all nominal roll students (admitted only)
router.get('/', getNominalRollStudents);

// Get filtered nominal roll students
router.get('/filtered', getNominalRollStudentsFiltered);

export default router;
