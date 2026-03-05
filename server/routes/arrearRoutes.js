import express from 'express';
import { getArrearStudents, updateArrearMarks } from '../controller/arrearController.js';

const router = express.Router();

router.get('/students', getArrearStudents);
router.put('/update', updateArrearMarks);

export default router;
