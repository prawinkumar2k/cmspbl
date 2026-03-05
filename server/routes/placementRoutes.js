import express from 'express';
import {
    getRegisterNumbers,
    getStudentByRegister,
    createPlacement,
    getAllPlacements,
    getPlacementById,
    updatePlacement,
    deletePlacement,
    getPlacementStats
} from '../controller/placementController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(verifyToken);

// Get all register numbers for autocomplete
router.get('/register-numbers', getRegisterNumbers);

// Get student details by register number
router.get('/student/:registerNumber', getStudentByRegister);

// Create new placement record
router.post('/', createPlacement);

// Get all placement records
router.get('/', getAllPlacements);

// Get placement statistics
router.get('/stats', getPlacementStats);

// Get placement by ID
router.get('/:id', getPlacementById);

// Update placement record
router.put('/:id', updatePlacement);

// Delete placement record
router.delete('/:id', deletePlacement);

export default router;
