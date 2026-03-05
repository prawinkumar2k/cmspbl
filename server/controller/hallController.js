import { HallMaster } from '../models/Exam.js';

/**
 * GET ALL HALLS
 */
export const getAllHalls = async (req, res) => {
  try {
    const rows = await HallMaster.find().sort({ hallName: 1 });

    // Map back to snake_case for frontend
    const mapped = rows.map(r => ({
      id: r._id,
      Hall_Code: r.hallCode,
      Hall_Name: r.hallName,
      Total_Rows: r.totalRows,
      Total_Columns: r.totalColumns,
      Seating_Capacity: r.seatingCapacity,
      Hall_Type: r.hallType,
      Floor_Number: r.floorNumber,
      Block_Name: r.blockName,
      // Fallbacks/Extras might be needed if frontend expects them
      Status: r.status,
      CreatedAt: r.createdAt,
      UpdatedAt: r.updatedAt
    }));

    res.json(mapped);
  } catch (err) {
    console.error("getAllHalls error:", err);
    res.status(500).json({ error: "Failed to fetch halls", details: err.message });
  }
};

/**
 * CREATE HALL
 */
export const createHall = async (req, res) => {
  try {
    const b = req.body;
    if (!b.Hall_Name) return res.status(400).json({ error: "Hall_Name is required" });
    if (!b.Total_Rows || !b.Total_Columns) return res.status(400).json({ error: "Total_Rows and Total_Columns are required" });

    // Duplicate check
    const exists = await HallMaster.findOne({ hallName: { $regex: new RegExp(`^${b.Hall_Name}$`, 'i') } });
    if (exists) return res.status(400).json({ error: "Hall name already exists" });

    const capacity = b.Seating_Capacity || (parseInt(b.Total_Rows) * parseInt(b.Total_Columns)) || 0;

    const entry = await HallMaster.create({
      hallCode: b.Hall_Code || `H${Date.now()}`,
      hallName: b.Hall_Name,
      totalRows: parseInt(b.Total_Rows) || 0,
      totalColumns: parseInt(b.Total_Columns) || 0,
      seatingCapacity: capacity,
      hallType: b.Hall_Type || null,
      floorNumber: b.Floor_Number || null,
      blockName: b.Block_Name || null,
      status: b.Status || "Active"
    });

    res.json({ success: true, message: "Hall created successfully", id: entry._id });
  } catch (err) {
    console.error("createHall error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE HALL
 */
export const updateHall = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;
    if (!b.Hall_Name) return res.status(400).json({ error: "Hall_Name is required" });

    const capacity = b.Seating_Capacity || (parseInt(b.Total_Rows) * parseInt(b.Total_Columns)) || 0;

    const updated = await HallMaster.findByIdAndUpdate(id, {
      hallCode: b.Hall_Code,
      hallName: b.Hall_Name,
      totalRows: parseInt(b.Total_Rows) || 0,
      totalColumns: parseInt(b.Total_Columns) || 0,
      seatingCapacity: capacity,
      hallType: b.Hall_Type,
      floorNumber: b.Floor_Number,
      blockName: b.Block_Name,
      status: b.Status
    }, { new: true });

    if (!updated) return res.status(404).json({ error: "Hall not found" });

    res.json({ message: "Hall updated successfully" });
  } catch (err) {
    console.error("updateHall error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE HALL
 */
export const deleteHall = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await HallMaster.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: "Hall not found" });

    res.json({ message: "Hall deleted successfully" });
  } catch (err) {
    console.error("deleteHall error:", err);
    res.status(500).json({ message: "Failed to delete hall", error: err.message });
  }
};
