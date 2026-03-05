import express from 'express';
import {
  getAllFees,
  addFee,
  editFee,
  deleteFee
} from '../controller/feeMasterController.js';

const router = express.Router();

router.get('/', getAllFees);
router.post('/', addFee);
router.put('/:id', editFee);
router.delete('/:id', deleteFee);

export default router;
