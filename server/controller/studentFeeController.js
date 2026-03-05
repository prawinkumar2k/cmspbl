import { StudentFee } from '../models/StudentFee.js';

export const getStudentFees = async (req, res) => {
  try {
    const { department, sem, feeType, rollNoRegNo, academicYear } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (sem) filter.semester = sem;
    if (feeType) filter.feeType = feeType;
    if (rollNoRegNo) {
      filter.$or = [
        { rollNo: rollNoRegNo },
        { regNo: rollNoRegNo }
      ];
    }
    if (academicYear) filter.academicYear = academicYear;

    const rows = await StudentFee.find(filter).sort({ academicYear: -1, department: 1, rollNo: 1 });

    // Map to camelCase for frontend
    const mapped = rows.map(r => ({
      id: r._id,
      rollNo: r.rollNo,
      regNo: r.regNo,
      name: r.studentName,
      department: r.department,
      sem: r.semester,
      feeType: r.feeType,
      amount: r.amount,
      status: r.status,
      academicYear: r.academicYear,
      securityCode: r.securityCode,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    }));

    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("getStudentFees error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch student fees" });
  }
};

export const getStudentFeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await StudentFee.findById(id);

    if (!r) {
      return res.status(404).json({ success: false, message: "Student fee record not found" });
    }

    const data = {
      id: r._id,
      rollNo: r.rollNo,
      regNo: r.regNo,
      name: r.studentName,
      department: r.department,
      sem: r.semester,
      feeType: r.feeType,
      amount: r.amount,
      status: r.status,
      academicYear: r.academicYear,
      securityCode: r.securityCode,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    };

    return res.json({ success: true, data });
  } catch (err) {
    console.error("getStudentFeeById error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch student fee record" });
  }
};

export const createStudentFee = async (req, res) => {
  try {
    const body = req.body;
    const entry = await StudentFee.create({
      rollNo: body.rollNo || null,
      regNo: body.regNo || null,
      studentName: body.name || body.studentName || null,
      department: body.department || null,
      semester: body.sem || null,
      feeType: body.feeType || null,
      amount: body.amount || null,
      status: body.status || null,
      academicYear: body.academicYear || null,
      securityCode: body.securityCode || null,
      createdBy: body.createdBy || null
    });

    const data = {
      id: entry._id,
      rollNo: entry.rollNo,
      regNo: entry.regNo,
      name: entry.studentName,
      department: entry.department,
      sem: entry.semester,
      feeType: entry.feeType,
      amount: entry.amount,
      status: entry.status,
      academicYear: entry.academicYear,
      securityCode: entry.securityCode,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt
    };

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("createStudentFee error:", err);
    return res.status(500).json({ success: false, message: "Failed to create student fee record" });
  }
};

export const updateStudentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updateData = {};
    if (body.rollNo !== undefined) updateData.rollNo = body.rollNo;
    if (body.regNo !== undefined) updateData.regNo = body.regNo;
    if (body.name !== undefined || body.studentName !== undefined) updateData.studentName = body.name || body.studentName;
    if (body.department !== undefined) updateData.department = body.department;
    if (body.sem !== undefined) updateData.semester = body.sem;
    if (body.feeType !== undefined) updateData.feeType = body.feeType;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.academicYear !== undefined) updateData.academicYear = body.academicYear;
    if (body.securityCode !== undefined) updateData.securityCode = body.securityCode;
    if (body.createdBy !== undefined) updateData.createdBy = body.createdBy;

    const updated = await StudentFee.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Student fee record not found" });
    }

    const data = {
      id: updated._id,
      rollNo: updated.rollNo,
      regNo: updated.regNo,
      name: updated.studentName,
      department: updated.department,
      sem: updated.semester,
      feeType: updated.feeType,
      amount: updated.amount,
      status: updated.status,
      academicYear: updated.academicYear,
      securityCode: updated.securityCode,
      created_at: updated.createdAt,
      updated_at: updated.updatedAt
    };

    return res.json({ success: true, data });
  } catch (err) {
    console.error("updateStudentFee error:", err);
    return res.status(500).json({ success: false, message: "Failed to update student fee record" });
  }
};

export const deleteStudentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await StudentFee.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Student fee record not found" });
    }

    return res.json({ success: true, message: "Student fee record deleted" });
  } catch (err) {
    console.error("deleteStudentFee error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete student fee record" });
  }
};
