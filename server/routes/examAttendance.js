import express from "express";
import {
  createExamAttendance,
  getExamAttendanceList,
  getExamAttendanceById,
  updateExamAttendance,
  deleteExamAttendance
} from "../controller/examAttendanceController.js";

const router = express.Router();

/* BASE API
   /api/examAttendance/attendance
*/

// Allow GET on the base mount so clients can call /api/examAttendance
router.get('/', getExamAttendanceList);

router.post("/attendance", createExamAttendance);
router.get("/attendance", getExamAttendanceList);
router.get("/attendance/:id", getExamAttendanceById);
router.put("/attendance/:id", updateExamAttendance);
router.delete("/attendance/:id", deleteExamAttendance);

export default router;
