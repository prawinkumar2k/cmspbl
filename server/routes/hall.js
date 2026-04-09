import express from "express";
import {
  getAllHalls,
  createHall,
  updateHall,
  deleteHall
} from "../controller/hallController.js";
import { HallMaster } from "../models/Exam.js";

const router = express.Router();

// DIAGNOSTIC: Check database schema
router.get("/diagnostic/schema", async (req, res) => {
  try {
    const schemaDefinition = HallMaster.schema.paths;
    const columns = Object.entries(schemaDefinition)
      .filter(([name]) => !name.startsWith('_') && name !== '__v')
      .map(([name, schemaType]) => ({
        field: name,
        instance: schemaType.instance,
        required: schemaType.isRequired === true || Boolean(schemaType.options?.required),
        defaultValue: schemaType.defaultValue ?? null,
      }));

    res.json({
      status: "MongoDB schema check",
      database: "mongodb",
      collection: HallMaster.collection.name,
      columns: columns,
      totalColumns: columns.length,
      hasHallCode: columns.some(c => c.field === 'hallCode'),
      hasHallType: columns.some(c => c.field === 'hallType'),
      hasBlockName: columns.some(c => c.field === 'blockName'),
      hasFloorNumber: columns.some(c => c.field === 'floorNumber')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET list of halls
router.get("/", getAllHalls);

// POST create hall
router.post("/", createHall);

// PUT update hall
router.put("/:id", updateHall);

// DELETE hall
router.delete("/:id", deleteHall);

export default router;
