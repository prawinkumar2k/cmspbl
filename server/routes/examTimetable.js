import express from "express";
import { getExamTimetableStudentList } from "../controller/examTimetableController.js";

const router = express.Router();

router.get("/exam-timetable-students", getExamTimetableStudentList);

export default router;