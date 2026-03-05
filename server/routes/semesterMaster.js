import express from 'express';
import {
  getAllSemesters,
  addSemester,
  editSemester,
  deleteSemester
} from '../controller/semesterMasterController.js';

const router = express.Router();

router.get('/', getAllSemesters);
router.post('/', addSemester);
router.put('/:id', editSemester);
router.delete('/:id', deleteSemester);

export default router;
