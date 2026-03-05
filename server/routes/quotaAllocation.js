
import express from "express";
import {
  createQuotaAllocation,
  getAllQuotaAllocations,
  deleteQuotaAllocation,
  getQuotaByDept
} from "../controller/quotaAllocationController.js";
import db from "../db.js";

const router = express.Router();

// API to get course list from course_master for course dropdown
router.get("/course-list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT Course_Name FROM course_master ORDER BY Course_Name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course list" });
  }
});

// API to get course details for dropdowns.
// Return the full set of columns needed by the UI so the client can
// pre-fill quota fields (OC, BC, BCO, BCM, MBC_DNC, SC, SCA, ST, Other,
// GoiQuota, MgtQuota, Intake, etc.).
router.get("/course-details", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT Dept_Code, Dept_Name, Course_Name, Intake, OC, BC, BCO, BCM, MBC_DNC, SC, SCA, ST, Other, GoiQuota, MgtQuota
       FROM course_details
       ORDER BY Course_Name, Dept_Name`
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch course details', err);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

router.post("/create", createQuotaAllocation);
router.get("/", getAllQuotaAllocations);
router.get("/quota-by-dept", getQuotaByDept);
router.delete("/:id", deleteQuotaAllocation);

export default router;
