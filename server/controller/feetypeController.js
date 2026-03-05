import { FeeTypeRecord } from '../models/FeeTypeRecord.js';

/**
 * GET /api/feetype
 */
export const list = async (req, res) => {
  try {
    const {
      feeType, department, classVal, section, status, paymentMode, search,
      fromDate, toDate, limit = 50, page = 1, sortBy = "createdAt", sortDir = "DESC"
    } = req.query;

    const l = Math.min(Number(limit) || 50, 1000);
    const p = Math.max(Number(page) || 1, 1);
    const offset = (p - 1) * l;

    const filter = {};
    if (feeType) filter.feeTypes = { $regex: feeType, $options: 'i' };
    if (department) filter.department = department;
    if (classVal) filter.className = classVal;
    if (section) filter.section = section;
    if (status) filter.status = status;
    if (paymentMode) filter.paymentMode = paymentMode;
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { regNo: { $regex: search, $options: 'i' } }
      ];
    }
    if (fromDate || toDate) {
      filter.lastPaymentDate = {};
      if (fromDate) filter.lastPaymentDate.$gte = new Date(fromDate);
      if (toDate) filter.lastPaymentDate.$lte = new Date(toDate);
    }

    const total = await FeeTypeRecord.countDocuments(filter);
    const dir = sortDir && sortDir.toUpperCase() === "ASC" ? 1 : -1;
    const sortField = sortBy === "id" ? "_id" :
      sortBy === "reg_no" ? "regNo" :
        sortBy === "name" ? "studentName" :
          sortBy === "class" ? "className" :
            sortBy === "last_payment_date" ? "lastPaymentDate" :
              sortBy === "total_amount" ? "totalAmount" :
                sortBy === "paid_amount" ? "paidAmount" :
                  sortBy === "pending_amount" ? "pendingAmount" : sortBy;

    const rows = await FeeTypeRecord.find(filter)
      .sort({ [sortField]: dir })
      .skip(offset)
      .limit(l);

    // Map back to snake_case for frontend
    const mapped = rows.map(r => ({
      id: r._id,
      reg_no: r.regNo,
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
      notes: r.notes,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    }));

    return res.json({
      success: true,
      total,
      page: p,
      perPage: l,
      data: mapped
    });
  } catch (err) {
    console.error('feetype.list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch fee records' });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await FeeTypeRecord.findById(id);
    if (!r) return res.status(404).json({ success: false, message: 'Not found' });

    const data = {
      id: r._id,
      reg_no: r.regNo,
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
      notes: r.notes
    };

    return res.json({ success: true, data });
  } catch (err) {
    console.error('feetype.getOne error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch record' });
  }
};

export const create = async (req, res) => {
  try {
    const p = req.body || {};
    if (!p.reg_no || !p.name) {
      return res.status(400).json({ success: false, message: 'reg_no and name are required' });
    }

    const entry = await FeeTypeRecord.create({
      regNo: p.reg_no,
      studentName: p.name,
      department: p.department,
      className: p.class,
      section: p.section,
      feeTypes: p.fee_types,
      totalAmount: p.total_amount,
      paidAmount: p.paid_amount,
      pendingAmount: p.pending_amount,
      lastPaymentDate: p.last_payment_date ? new Date(p.last_payment_date) : null,
      status: p.status,
      paymentMode: p.payment_mode,
      notes: p.notes
    });

    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error('feetype.create error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create record' });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body || {};

    const updateData = {
      regNo: p.reg_no,
      studentName: p.name,
      department: p.department,
      className: p.class,
      section: p.section,
      feeTypes: p.fee_types,
      totalAmount: p.total_amount,
      paidAmount: p.paid_amount,
      pendingAmount: p.pending_amount,
      lastPaymentDate: p.last_payment_date ? new Date(p.last_payment_date) : undefined,
      status: p.status,
      paymentMode: p.payment_mode,
      notes: p.notes
    };

    const updated = await FeeTypeRecord.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('feetype.update error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update record' });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await FeeTypeRecord.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: 'Not found or already deleted' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('feetype.remove error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete record' });
  }
};
