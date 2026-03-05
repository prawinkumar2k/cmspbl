// routes/practicalPanel.js
import express from "express";
import { getPracticalPanel } from "../controller/practicalPanelController.js";

const router = express.Router();

/**
 * PRACTICAL PANEL REPORT
 * GET /api/practical-panel
 */
router.get("/", getPracticalPanel);

export default router;
