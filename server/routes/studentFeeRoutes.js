// routes/studentFee.routes.js
import { Router } from "express";
import {
  getStudentFees,
  getStudentFeeById,
  createStudentFee,
  updateStudentFee,
  deleteStudentFee,
} from "../controller/studentFeeController.js";

const router = Router();

router.get("/", getStudentFees);
router.get("/:id", getStudentFeeById);
router.post("/", createStudentFee);
router.put("/:id", updateStudentFee);
router.delete("/:id", deleteStudentFee);

export default router;
