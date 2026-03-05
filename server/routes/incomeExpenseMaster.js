import express from "express";
import {
  createIncomeExpenseMaster,
  getGroups,
  getCategoriesByGroup,
  getPersonsByCategory
} from "../controller/incomeExpenseMasterController.js";

const router = express.Router();

router.post("/", createIncomeExpenseMaster);
router.get("/groups", getGroups);
router.get("/categories/:group", getCategoriesByGroup);
router.get("/persons/:group/:category", getPersonsByCategory);

export default router;
