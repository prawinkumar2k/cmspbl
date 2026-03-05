import express from 'express';
import {
  getAllRegulations,
  addRegulation,
  editRegulation,
  deleteRegulation
} from '../controller/regulationMasterController.js';

const router = express.Router();

router.get('/', getAllRegulations);
router.post('/', addRegulation);
router.put('/:id', editRegulation);
router.delete('/:id', deleteRegulation);

export default router;
