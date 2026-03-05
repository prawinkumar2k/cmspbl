// routes/practicalExam.routes.js
import express from "express";
import { getPracticalExamStudents } from "../controller/practicalExamController.js";

const router = express.Router();

/**
 * GET Practical Exam Students
 * Example:
 * /api/practical-exams?Exam_Date=2026-02-10&Session=FN&Dept_Code=CSE
 */
router.get("/practical-exams", getPracticalExamStudents);

export default router;