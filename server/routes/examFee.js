import { Router } from 'express';
import { getExamFees, addExamFee, editExamFee, deleteExamFee } from '../controller/examFeeController.js';

const router = Router();

router.get('/', getExamFees);
router.post('/', addExamFee);
router.put('/:id', editExamFee);
router.delete('/:id', deleteExamFee);

export default router;
