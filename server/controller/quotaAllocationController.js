import { QuotaAllocation, Student } from '../models/index.js';

// Create
export const createQuotaAllocation = async (req, res) => {
  try {
    const {
      courseName,
      deptCode,
      type,
      oc,
      bc,
      bco,
      bcm,
      mbc,
      sc,
      sca,
      st,
      other,
      totSeat
    } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }

    const row = await QuotaAllocation.create({
      type,
      courseName,
      deptCode,
      oc: Number(oc) || 0,
      bc: Number(bc) || 0,
      bco: Number(bco) || 0,
      bcm: Number(bcm) || 0,
      mbc: Number(mbc) || 0,
      sc: Number(sc) || 0,
      sca: Number(sca) || 0,
      st: Number(st) || 0,
      other: Number(other) || 0,
      totSeat: Number(totSeat) || 0
    });

    res.status(201).json({ message: "Quota allocation created successfully", insertId: row._id });

  } catch (error) {
    console.error("Error creating quota allocation:", error);
    res.status(500).json({ error: "Failed to create quota allocation" });
  }
};

// Get All
export const getAllQuotaAllocations = async (req, res) => {
  try {
    const rows = await QuotaAllocation.find();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching quota allocations:", error);
    res.status(500).json({ error: "Failed to fetch quota allocations" });
  }
};

// Delete
export const deleteQuotaAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    await QuotaAllocation.findByIdAndDelete(id);
    res.json({ message: "Quota allocation deleted successfully" });
  } catch (error) {
    console.error("Error deleting quota allocation:", error);
    res.status(500).json({ error: "Failed to delete quota allocation" });
  }
};

// Get quota and available seats for department
// This logic derives data from QuotaAllocation and Student collections
export const getQuotaByDept = async (req, res) => {
  try {
    const { deptCode, quotaType } = req.query;

    if (!deptCode || !quotaType) {
      return res.status(400).json({ error: "deptCode and quotaType are required" });
    }

    // 1. Get allocated seats for this department and quota type (GQ/MQ)
    const allocations = await QuotaAllocation.find({ deptCode, type: quotaType });
    const totalSeats = allocations.reduce((sum, a) => sum + (a.totSeat || 0), 0);

    // 2. Count admitted students for this department and quota
    // Assuming Student model has 'allocatedQuota' and 'admissionStatus'
    const filledSeats = await Student.countDocuments({
      deptCode,
      allocatedQuota: quotaType,
      admissionStatus: 'Admitted'
    });

    const availableSeats = Math.max(0, totalSeats - filledSeats);

    res.json({
      total: totalSeats,
      available: availableSeats,
      filled: filledSeats,
      quotaType: quotaType,
      department: deptCode,
      message: "Derived from QuotaAllocation and Student collections"
    });

  } catch (error) {
    console.error("Error fetching quota data:", error);
    res.status(500).json({ error: "Failed to fetch quota data", details: error.message });
  }
};
