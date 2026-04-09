
import express from "express";
import {
  createQuotaAllocation,
  getAllQuotaAllocations,
  deleteQuotaAllocation,
  getQuotaByDept
} from "../controller/quotaAllocationController.js";
import Course from "../models/Course.js";

const router = express.Router();

// API to get course list from course_master for course dropdown
router.get("/course-list", async (req, res) => {
  try {
    const courseNames = (await Course.distinct("courseName"))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(courseNames.map((courseName) => ({
      Course_Name: courseName,
    })));
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
    const rows = await Course.find()
      .sort({ courseName: 1, deptName: 1 })
      .lean();

    res.json(rows.map((row) => ({
      Dept_Code: row.deptCode,
      Dept_Name: row.deptName,
      Course_Name: row.courseName,
      Intake: row.intake ?? 0,
      OC: row.oc ?? 0,
      BC: row.bc ?? 0,
      BCO: row.bco ?? 0,
      BCM: row.bcm ?? 0,
      MBC_DNC: row.mbcDnc ?? 0,
      SC: row.sc ?? 0,
      SCA: row.sca ?? 0,
      ST: row.st ?? 0,
      Other: row.other ?? 0,
      GoiQuota: row.goiQuota ?? 0,
      MgtQuota: row.mgtQuota ?? 0,
    })));
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
