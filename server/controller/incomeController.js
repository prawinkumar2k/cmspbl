// server/controllers/income.controller.js
import { validationResult } from 'express-validator';
import { IncomeExpense } from '../models/IncomeExpense.js';

const devError = (err) => {
  return process.env.NODE_ENV === 'production'
    ? { message: err.message }
    : { message: err.message, stack: err.stack, code: err.code || null };
};

/**
 * Parse number safely to decimal (returns 0 for invalid)
 */
const toDecimal = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * getNextSNo — MongoDB version
 */
export async function getNextSNo(prefix = '') {
  const latest = await IncomeExpense.findOne().sort({ sNo: -1 });
  const max = latest && latest.sNo ? Number(latest.sNo) : 0;
  const next = max + 1;
  return prefix ? `${prefix}${next}` : String(next);
}

/* create */
export const createIncome = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const payload = req.body || {};
    if (!payload.date || !payload.grp || !payload.category || !payload.person) {
      return res.status(400).json({ success: false, error: 'date, grp (group), category and person are required' });
    }
    if (!(payload.income_amount || payload.expense_amount || payload.suspense_amount)) {
      return res.status(400).json({ success: false, error: 'One of income_amount / expense_amount / suspense_amount is required' });
    }

    if (!payload.sNo) {
      payload.sNo = await getNextSNo();
    }

    const entry = await IncomeExpense.create({
      sNo: payload.sNo,
      date: new Date(payload.date),
      grp: payload.grp,
      category: payload.category,
      person: payload.person,
      authMode: payload.auth_mode || null,
      paymentMode: payload.cheque_details || null,
      detail: payload.detail || null,
      billNo: payload.bill_no || null,
      incomeAmount: toDecimal(payload.income_amount),
      expenseAmount: toDecimal(payload.expense_amount),
      suspenseAmount: toDecimal(payload.suspense_amount),
      createdBy: payload.created_by || null,
      status: payload.status || 'Active'
    });

    if (global && global.io && typeof global.io.emit === 'function') {
      global.io.emit('income:new', { id: entry._id, ...payload });
    }

    return res.status(201).json({ success: true, id: entry._id });
  } catch (err) {
    console.error('createIncome controller error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

/* list */
export const listIncomes = async (req, res) => {
  try {
    const q = req.query || {};
    const from = q.from;
    const to = q.to;
    const grp = q.grp || q.group;
    const category = q.category;
    const person = q.person;
    const search = q.search;
    const limit = q.limit ? parseInt(q.limit) : 200;
    const offset = q.offset ? parseInt(q.offset) : 0;

    const filter = {};
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (grp) filter.grp = grp;
    if (category) filter.category = category;
    if (person) filter.person = person;
    if (search) {
      filter.$or = [
        { detail: { $regex: search, $options: 'i' } },
        { billNo: { $regex: search, $options: 'i' } },
        { sNo: { $regex: search, $options: 'i' } }
      ];
    }

    const rows = await IncomeExpense.find(filter)
      .sort({ date: -1, _id: -1 })
      .skip(offset)
      .limit(limit);

    // Map back to format expected by frontend
    const mapped = rows.map(r => ({
      id: r._id,
      sNo: r.sNo,
      date: r.date,
      grp: r.grp,
      category: r.category,
      person: r.person,
      auth_mode: r.authMode,
      cheque_details: r.paymentMode,
      detail: r.detail,
      bill_no: r.billNo,
      income_amount: r.incomeAmount,
      expense_amount: r.expenseAmount,
      suspense_amount: r.suspenseAmount,
      created_by: r.createdBy,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error('listIncomes controller error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

/* get one */
export const getIncome = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await IncomeExpense.findById(id);
    if (!r) return res.status(404).json({ success: false, error: 'Not found' });

    const mapped = {
      id: r._id,
      sNo: r.sNo,
      date: r.date,
      grp: r.grp,
      category: r.category,
      person: r.person,
      auth_mode: r.authMode,
      cheque_details: r.paymentMode,
      detail: r.detail,
      bill_no: r.billNo,
      income_amount: r.incomeAmount,
      expense_amount: r.expenseAmount,
      suspense_amount: r.suspenseAmount,
      created_by: r.createdBy,
      status: r.status
    };

    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error('getIncome controller error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

/* update */
export const updateIncome = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};

    const updated = await IncomeExpense.findByIdAndUpdate(id, {
      sNo: payload.sNo,
      date: payload.date ? new Date(payload.date) : undefined,
      grp: payload.grp,
      category: payload.category,
      person: payload.person,
      authMode: payload.auth_mode,
      paymentMode: payload.cheque_details,
      detail: payload.detail,
      billNo: payload.bill_no,
      incomeAmount: payload.income_amount !== undefined ? toDecimal(payload.income_amount) : undefined,
      expenseAmount: payload.expense_amount !== undefined ? toDecimal(payload.expense_amount) : undefined,
      suspenseAmount: payload.suspense_amount !== undefined ? toDecimal(payload.suspense_amount) : undefined,
      createdBy: payload.created_by,
      status: payload.status
    }, { new: true });

    if (!updated) return res.status(404).json({ success: false, error: 'Not found' });

    if (global && global.io && typeof global.io.emit === 'function') {
      global.io.emit('income:updated', { id, ...payload });
    }

    return res.json({ success: true, affectedRows: 1 });
  } catch (err) {
    console.error('updateIncome controller error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};

/* delete */
export const deleteIncome = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await IncomeExpense.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, error: 'Not found' });

    if (global && global.io && typeof global.io.emit === 'function') {
      global.io.emit('income:deleted', { id });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('deleteIncome controller error:', err);
    return res.status(500).json({ success: false, ...devError(err) });
  }
};
