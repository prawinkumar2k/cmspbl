// server/routes/receiveLetter.routes.js
import express from 'express';
import { getAll, createOne, updateOne, deleteOne } from '../controller/receiveLetterController.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', createOne);
router.put('/:id', updateOne);
router.delete('/:id', deleteOne);

export default router;
