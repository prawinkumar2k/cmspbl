// routes/timetable.routes.js
import { Router } from "express";
import {
  getTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getMasterRegulations,
  getMasterSemesters,
  getMasterDepartments,
  getMasterSubjects,
  getMasterSubjectsWithCounts,
} from "../controller/timetableController.js";

const router = Router();

router.get("/", getTimetables);
router.get("/:id", getTimetableById);
router.post("/", createTimetable);
router.put("/:id", updateTimetable);
router.delete("/:id", deleteTimetable);

// Master data endpoints for timetable form
router.get("/master/regulations", getMasterRegulations);
router.get("/master/semesters", getMasterSemesters);
router.get("/master/departments", getMasterDepartments);
router.get("/master/subjects", getMasterSubjects);
router.get("/master/subjects-with-counts", getMasterSubjectsWithCounts);

export default router;
