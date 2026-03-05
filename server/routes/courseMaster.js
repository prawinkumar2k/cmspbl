import express from 'express';
import {
  getAllCourses,
  addCourse,
  editCourse,
  deleteCourse
} from '../controller/courseMasterController.js';

const router = express.Router();

router.get('/', getAllCourses);
router.post('/', addCourse);
router.put('/:id', editCourse);
router.delete('/:id', deleteCourse);

export default router;
