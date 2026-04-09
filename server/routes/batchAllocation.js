import express from 'express';
import { getStudentsForBatch, updateStudentBatches } from '../controller/batchController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/batch_allocation/students', verifyToken, authorizeRoles('Admin', 'Staff'), getStudentsForBatch);
router.post('/batch_allocation/update', verifyToken, authorizeRoles('Admin', 'Staff'), updateStudentBatches);

export default router;
