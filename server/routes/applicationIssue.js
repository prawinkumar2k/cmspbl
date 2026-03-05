// server/routes/applicationIssue.js
import express from "express";

import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getCommunity,
  getStudentsByCourse
} from "../controller/applicationIssueController.js";


const router = express.Router();

router.post("/create", createStudent);
router.get("/", getStudents);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);
router.get("/communityMaster", getCommunity);
router.get("/studentsByCourse", getStudentsByCourse);

export default router;
