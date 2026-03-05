// server/routes/income.routes.js
import express from 'express';
import {
  createIncome,
  listIncomes,
  getIncome,
  updateIncome,
  deleteIncome
} from '../controller/incomeController.js';

const router = express.Router();

// POST /api/incomes       -> create new entry
router.post('/', createIncome);

// GET /api/incomes        -> list with optional query filters
router.get('/', listIncomes);

// GET /api/incomes/:id    -> get single entry
router.get('/:id', getIncome);

// PUT /api/incomes/:id    -> update
router.put('/:id', updateIncome);

// DELETE /api/incomes/:id -> delete
router.delete('/:id', deleteIncome);

export default router;
