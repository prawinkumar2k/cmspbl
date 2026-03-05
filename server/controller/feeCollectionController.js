import FeeCollection from '../models/FeeCollection.js';

/**
 * Create a new fee record
 */
export const create = async (req, res) => {
  try {
    const b = req.body;
    const entry = await FeeCollection.create({
      regNo: b.reg_no,
      applicationNo: b.application_no,
      rollNo: b.roll_no,
      studentName: b.name,
      department: b.department,
      className: b.class,
      section: b.section,
      feeTypes: b.fee_types,
      totalAmount: b.total_amount,
      paidAmount: b.paid_amount,
      pendingAmount: b.pending_amount,
      lastPaymentDate: b.last_payment_date ? new Date(b.last_payment_date) : null,
      status: b.status,
      paymentMode: b.payment_mode,
      branchSec: b.branch_sec,
      seatNo: b.seat_no,
      allocatedQuota: b.allocated_quota
    });

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("create error:", err);
    res.status(500).json({ success: false, error: "Failed to create fee record" });
  }
};

/**
 * Get list with optional filters
 */
export const list = async (req, res) => {
  try {
    const {
      search, status, department, class: classVal, section,
      fromDate, toDate, page = 1, limit = 50, sortBy = "createdAt", sortDir = "DESC"
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { regNo: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (classVal) filter.className = classVal;
    if (section) filter.section = section;
    if (fromDate || toDate) {
      filter.lastPaymentDate = {};
      if (fromDate) filter.lastPaymentDate.$gte = new Date(fromDate);
      if (toDate) filter.lastPaymentDate.$lte = new Date(toDate);
    }

    const total = await FeeCollection.countDocuments(filter);
    const offset = (Number(page) - 1) * Number(limit);
    const dir = sortDir && sortDir.toUpperCase() === "ASC" ? 1 : -1;
    const sortField = sortBy === "id" ? "_id" :
      sortBy === "name" ? "studentName" :
        sortBy === "reg_no" ? "regNo" :
          sortBy === "class" ? "className" :
            sortBy === "last_payment_date" ? "lastPaymentDate" : sortBy;

    const rows = await FeeCollection.find(filter)
      .sort({ [sortField]: dir })
      .skip(offset)
      .limit(Number(limit));

    // Map back to snake_case for frontend
    const mapped = rows.map(r => ({
      id: r._id,
      reg_no: r.regNo,
      application_no: r.applicationNo,
      roll_no: r.rollNo,
      name: r.studentName,
      department: r.department,
      class: r.className,
      section: r.section,
      fee_types: r.feeTypes,
      total_amount: r.totalAmount,
      paid_amount: r.paidAmount,
      pending_amount: r.pendingAmount,
      last_payment_date: r.lastPaymentDate,
      status: r.status,
      payment_mode: r.paymentMode,
      branch_sec: r.branchSec,
      seat_no: r.seatNo,
      allocated_quota: r.allocatedQuota
    }));

    res.json({
      success: true,
      data: mapped,
      meta: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (err) {
    console.error("list error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch fee records" });
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await FeeCollection.findById(id);
    if (!r) return res.status(404).json({ success: false, error: "Record not found" });

    const data = {
      id: r._id,
      reg_no: r.regNo,
      application_no: r.applicationNo,
      roll_no: r.rollNo,
      name: r.studentName,
      department: r.department,
      class: r.className,
      section: r.section,
      fee_types: r.feeTypes,
      total_amount: r.totalAmount,
      paid_amount: r.paidAmount,
      pending_amount: r.pendingAmount,
      last_payment_date: r.lastPaymentDate,
      status: r.status,
      payment_mode: r.paymentMode,
      branch_sec: r.branchSec,
      seat_no: r.seatNo,
      allocated_quota: r.allocatedQuota
    };

    res.json({ success: true, data });
  } catch (err) {
    console.error("getOne error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch record" });
  }
};

export const updateOne = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {
      regNo: b.reg_no,
      applicationNo: b.application_no,
      rollNo: b.roll_no,
      studentName: b.name,
      department: b.department,
      className: b.class,
      section: b.section,
      feeTypes: b.fee_types,
      totalAmount: b.total_amount,
      paidAmount: b.paid_amount,
      pendingAmount: b.pending_amount,
      lastPaymentDate: b.last_payment_date ? new Date(b.last_payment_date) : undefined,
      status: b.status,
      paymentMode: b.payment_mode,
      branchSec: b.branch_sec,
      seatNo: b.seat_no,
      allocatedQuota: b.allocated_quota
    };

    const updated = await FeeCollection.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: "Record not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateOne error:", err);
    res.status(500).json({ success: false, error: "Failed to update record" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FeeCollection.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, error: "Record not found" });
    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    console.error("remove error:", err);
    res.status(500).json({ success: false, error: "Failed to delete record" });
  }
};
