import express from 'express';
import {
  getAllDesignations,
  addDesignation,
  editDesignation,
  deleteDesignation
} from '../controller/designationMasterController.js';

const router = express.Router();

router.get('/', getAllDesignations);
router.post('/', addDesignation);
router.put('/:id', editDesignation);
router.delete('/:id', deleteDesignation);

export default router;
