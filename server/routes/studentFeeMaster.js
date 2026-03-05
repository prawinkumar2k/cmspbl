// routes/studentFeeMasterRoutes.js
import express from "express";
import { getStudentFeeMaster } from "../controller/studentFeeMasterController.js";

const router = express.Router();

// Used in Fee Receipt page
router.get("/student-fee-master", getStudentFeeMaster);

export default router;
