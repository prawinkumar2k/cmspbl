import { Router } from 'express';
import { getQPRequirements, deleteQPRequirement } from '../controller/qpRequirementController.js';

const router = Router();

router.get('/', getQPRequirements);
// router.post('/', addQPRequirement); // Disabled: view-only
// router.put('/:id', editQPRequirement); // Disabled: view-only
router.delete('/:id', deleteQPRequirement);

export default router;
