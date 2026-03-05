import express from "express";
import db from "../db.js";
import {
  getAllHalls,
  createHall,
  updateHall,
  deleteHall
} from "../controller/hallController.js";

const router = express.Router();

// DIAGNOSTIC: Check database schema
router.get("/diagnostic/schema", async (req, res) => {
  try {
    const [columns] = await db.query(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'hall_master' AND TABLE_SCHEMA = DATABASE()
      ORDER BY ORDINAL_POSITION
    `);
    
    res.json({
      status: "Database schema check",
      database: process.env.DB_NAME,
      table: "hall_master",
      columns: columns,
      totalColumns: columns.length,
      hasHallCode: columns.some(c => c.COLUMN_NAME === 'Hall_Code'),
      hasLocationNote: columns.some(c => c.COLUMN_NAME === 'Location_Note'),
      hasFacilities: columns.some(c => c.COLUMN_NAME === 'Facilities'),
      hasPreference: columns.some(c => c.COLUMN_NAME === 'Preference')
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
