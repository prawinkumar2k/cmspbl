import { FeeReceipt } from '../models/FeeReceipt.js';

/**
 * Sum payNow for a given rollNo + feeType
 * (used to compute cumulative paid and pending amounts)
 */
async function sumPayments(rollNo, feeType, excludeId = null) {
  if (!rollNo || !feeType) return 0;

  const filter = { rollNo, feeType };
  if (excludeId) filter._id = { $ne: excludeId };

  const result = await FeeReceipt.aggregate([
    { $match: filter },
    { $group: { _id: null, total: { $sum: "$payNow" } } }
  ]);

  const s = result.length > 0 ? result[0].total : 0;
  return Math.round(s * 100) / 100;
}

/**
 * Create new payment row.
 */
export const create = async (req, res) => {
  try {
    const {
      date,
      department,
      sem,
      fee_type,
      roll_no,
      student_name,
      total_amount = 0,
      pay_now = 0,
      security_code = "",
      academic = "",
      remarks = "",
      payment_mode = "",
      reference_no = "",
      application_no = null,
    } = req.body;

    if (!roll_no || !fee_type) {
      return res.status(400).json({ success: false, message: "roll_no and fee_type required" });
    }

    const totalNum = Number(total_amount) || 0;
    const payNowNum = Number(pay_now) || 0;

    const prevSum = await sumPayments(roll_no, fee_type, null);

    const paidTotal = Math.round((prevSum + payNowNum) * 100) / 100;
    const pending = Math.max(0, Math.round((totalNum - paidTotal) * 100) / 100);
    const status = paidTotal === 0 ? "Unpaid" : pending === 0 ? "Paid" : "Partially Paid";

    const entry = await FeeReceipt.create({
      date: date ? new Date(date) : new Date(),
      department,
      semester: sem,
      feeType: fee_type,
      rollNo: roll_no,
      applicationNo: application_no,
      studentName: student_name,
      totalAmount: totalNum,
      payNow: payNowNum,
      paidAmount: paidTotal,
      pendingAmount: pending,
      status,
      securityCode: security_code,
      remarks,
      academic,
      paymentMode: payment_mode,
      referenceNo: reference_no,
    });

    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("create error:", err);
    return res.status(500).json({ success: false, message: "Failed to create payment" });
  }
};

/**
 * List rows with filters
 */
export const list = async (req, res) => {
  try {
    const {
      rollNo,
      applicationNo,
      feeType,
      status,
      fromDate,
      toDate,
      page = 1,
      limit = 100,
      sortBy = "createdAt",
      sortDir = "DESC",
      search,
    } = req.query;

    const filter = {};
    if (rollNo) filter.rollNo = rollNo;
    if (applicationNo) filter.applicationNo = applicationNo;
    if (feeType) filter.feeType = feeType;
    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { applicationNo: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await FeeReceipt.countDocuments(filter);
    const offset = (Number(page) - 1) * Number(limit);
    const sortField = sortBy === "id" ? "_id" : sortBy;
    const dir = sortDir && sortDir.toUpperCase() === "ASC" ? 1 : -1;

    const rows = await FeeReceipt.find(filter)
      .sort({ [sortField]: dir })
      .skip(offset)
      .limit(Number(limit));

    // Map back to snake_case for frontend compatibility if needed
    // However, the original code used SELECT * and then returned it.
    // I should probably map the fields.
    const mapped = rows.map(r => ({
      id: r._id,
      date: r.date,
      department: r.department,
      sem: r.semester,
      fee_type: r.feeType,
      roll_no: r.rollNo,
      application_no: r.applicationNo,
      student_name: r.studentName,
      total_amount: r.totalAmount,
      pay_now: r.payNow,
      paid_amount: r.paidAmount,
      pending_amount: r.pendingAmount,
      status: r.status,
      security_code: r.securityCode,
      remarks: r.remarks,
      academic: r.academic,
      payment_mode: r.paymentMode,
      reference_no: r.referenceNo,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    }));

    return res.json({
      success: true,
      data: mapped,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    console.error("list error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch receipts" });
  }
};

/**
 * Get single row by id
 */
export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await FeeReceipt.findById(id);

    if (!r) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const data = {
      id: r._id,
      date: r.date,
      department: r.department,
      sem: r.semester,
      fee_type: r.feeType,
      roll_no: r.rollNo,
      application_no: r.applicationNo,
      student_name: r.studentName,
      total_amount: r.totalAmount,
      pay_now: r.payNow,
      paid_amount: r.paidAmount,
      pending_amount: r.pendingAmount,
      status: r.status,
      security_code: r.securityCode,
      remarks: r.remarks,
      academic: r.academic,
      payment_mode: r.paymentMode,
      reference_no: r.referenceNo,
    };

    return res.json({ success: true, data });
  } catch (err) {
    console.error("getOne error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

/**
 * Update row and recompute cumulative sums
 */
export const updateOne = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updateData = {};
    if (body.date !== undefined) updateData.date = body.date ? new Date(body.date) : null;
    if (body.department !== undefined) updateData.department = body.department || null;
    if (body.sem !== undefined) updateData.semester = body.sem || null;
    if (body.fee_type !== undefined) updateData.feeType = body.fee_type;
    if (body.roll_no !== undefined) updateData.rollNo = body.roll_no;
    if (body.application_no !== undefined) updateData.applicationNo = body.application_no || null;
    if (body.student_name !== undefined) updateData.studentName = body.student_name || null;
    if (body.total_amount !== undefined) updateData.totalAmount = Number(body.total_amount) || 0;
    if (body.pay_now !== undefined) updateData.payNow = Number(body.pay_now) || 0;
    if (body.security_code !== undefined) updateData.securityCode = body.security_code || null;
    if (body.academic !== undefined) updateData.academic = body.academic || null;
    if (body.remarks !== undefined) updateData.remarks = body.remarks || null;
    if (body.payment_mode !== undefined) updateData.paymentMode = body.payment_mode || null;
    if (body.reference_no !== undefined) updateData.referenceNo = body.reference_no || null;

    const updated = await FeeReceipt.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // Recompute cumulative paidAmount & pendingAmount for this rollNo + feeType
    const roll = updated.rollNo;
    const fee = updated.feeType;
    const totalAmount = Number(updated.totalAmount || 0);

    const allRows = await FeeReceipt.find({ rollNo: roll, feeType: fee }).sort({ createdAt: 1 });

    let running = 0;
    for (const r of allRows) {
      running = Math.round((running + Number(r.payNow || 0)) * 100) / 100;
      const pending = Math.max(0, Math.round((totalAmount - running) * 100) / 100);
      const status = running === 0 ? "Unpaid" : pending === 0 ? "Paid" : "Partially Paid";

      r.paidAmount = running;
      r.pendingAmount = pending;
      r.status = status;
      await r.save();
    }

    const final = await FeeReceipt.findById(id);
    const data = {
      id: final._id,
      date: final.date,
      department: final.department,
      sem: final.semester,
      fee_type: final.feeType,
      roll_no: final.rollNo,
      application_no: final.applicationNo,
      student_name: final.studentName,
      total_amount: final.totalAmount,
      pay_now: final.payNow,
      paid_amount: final.paidAmount,
      pending_amount: final.pendingAmount,
      status: final.status,
      security_code: final.securityCode,
      remarks: final.remarks,
      academic: final.academic,
      payment_mode: final.paymentMode,
      reference_no: final.referenceNo,
    };

    return res.json({ success: true, data });
  } catch (err) {
    console.error("updateOne error:", err);
    return res.status(500).json({ success: false, message: "Failed to update" });
  }
};

/**
 * Mark paid
 */
export const markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const row = await FeeReceipt.findById(id);
    if (!row) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const roll = row.rollNo;
    const fee = row.feeType;
    const totalAmount = Number(row.totalAmount || 0);
    const prevSum = await sumPayments(roll, fee, null);

    let add = 0;
    if (amount != null && Number(amount) > 0) {
      add = Number(amount);
    } else {
      add = Math.max(0, totalAmount - prevSum);
      if (add <= 0) return res.json({ success: true, message: "Already paid" });
    }

    const newPaid = Math.round((prevSum + add) * 100) / 100;
    const pending = Math.max(0, Math.round((totalAmount - newPaid) * 100) / 100);
    const status = pending === 0 ? "Paid" : "Partially Paid";

    const entry = await FeeReceipt.create({
      date: new Date(),
      department: row.department,
      semester: row.semester,
      feeType: fee,
      rollNo: roll,
      applicationNo: row.applicationNo,
      studentName: row.studentName,
      totalAmount,
      payNow: add,
      paidAmount: newPaid,
      pendingAmount: pending,
      status,
      securityCode: row.securityCode,
      remarks: row.remarks,
      academic: row.academic,
      paymentMode: row.paymentMode,
      referenceNo: row.referenceNo,
    });

    const data = {
      id: entry._id,
      date: entry.date,
      roll_no: entry.rollNo,
      fee_type: entry.feeType,
      paid_amount: entry.paidAmount,
      pending_amount: entry.pendingAmount,
      status: entry.status,
      pay_now: entry.payNow
    };

    return res.json({ success: true, data });
  } catch (err) {
    console.error("markPaid error:", err);
    return res.status(500).json({ success: false, message: "Failed to mark paid" });
  }
};

/**
 * Delete a row
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FeeReceipt.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("remove error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete" });
  }
};
