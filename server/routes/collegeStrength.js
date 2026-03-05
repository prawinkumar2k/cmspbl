import express from "express";
import {
  getCollegeStrength,
  addCollegeStrength,
  updateCollegeStrength,
  deleteCollegeStrength,
  bulkCollegeStrength
} from "../controller/collegeStrengthController.js";

const router = express.Router();

router.get("/", getCollegeStrength);
router.post("/", addCollegeStrength);
router.put("/:id", updateCollegeStrength);
router.delete("/:id", deleteCollegeStrength);
router.post("/bulk", bulkCollegeStrength);

export default router;
