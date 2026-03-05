import express from "express";
import { getStrengthListReport } from "../controller/strengthListController.js";

const router = express.Router();

router.get("/report", getStrengthListReport);

export default router;
