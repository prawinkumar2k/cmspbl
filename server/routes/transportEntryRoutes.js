// routes/transportEntry.routes.js
import { Router } from "express";
import {
  getTransportEntries,
  getTransportEntryById,
  createTransportEntry,
  updateTransportEntry,
  deleteTransportEntry,
} from "../controller/transportEntryController.js";

const router = Router();

router.get("/", getTransportEntries);
router.get("/:id", getTransportEntryById);
router.post("/", createTransportEntry);
router.put("/:id", updateTransportEntry);
router.delete("/:id", deleteTransportEntry);

export default router;
