import express from "express";
import {
  createIncomeExpense,
  getIncomeExpenseList,
  deleteIncomeExpense
} from "../controller/IncomeExpenseController.js";

const router = express.Router();

router.post("/", createIncomeExpense);
router.get("/", getIncomeExpenseList);
router.delete("/:id", deleteIncomeExpense);

export default router;
