// routes/settlementRoutes.js

import express from "express";
import {
  getAllSettlements,
  getSettlementById,
  createSettlement,
  updateSettlement,
  deleteSettlement,
} from "../controller/settlementController.js";

const router = express.Router();

// List with optional filters
router.get("/", getAllSettlements);

// Get single entry
router.get("/:id", getSettlementById);

// Create new settlement
router.post("/", createSettlement);

// Update existing settlement
router.put("/:id", updateSettlement);

// Delete settlement
router.delete("/:id", deleteSettlement);

export default router;
