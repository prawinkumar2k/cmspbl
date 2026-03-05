import { IncomeExpense } from '../models/IncomeExpense.js';

/* ==========================================
   CREATE INCOME / EXPENSE ENTRY
========================================== */
export const createIncomeExpense = async (req, res) => {
  try {
    const {
      date,
      group,
      category,
      person,
      authorization,
      paymentMode,
      detail,
      sno,
      income,
      expense,
      suspense
    } = req.body;

    if (!date || !group) {
      return res.status(400).json({
        success: false,
        message: "Date and Group are required"
      });
    }

    const entry = await IncomeExpense.create({
      date: new Date(date),
      grp: group,
      category: category || null,
      person: person || null,
      authMode: authorization || null,
      paymentMode: paymentMode || null,
      detail: detail || null,
      sNo: sno || null,
      incomeAmount: income || 0,
      expenseAmount: expense || 0,
      suspense: suspense ? true : false,
      suspenseAmount: suspense ? (income || expense || 0) : 0 // logical guess based on suspense usage
    });

    res.status(201).json({
      success: true,
      message: "Income/Expense entry saved",
      id: entry._id
    });

  } catch (err) {
    console.error("Create Entry Error:", err);
    res.status(500).json({ success: false });
  }
};

/* ==========================================
   GET ALL ENTRIES
========================================== */
export const getIncomeExpenseList = async (req, res) => {
  try {
    const rows = await IncomeExpense.find().sort({ date: -1, createdAt: -1 });

    // Map back to format expected by frontend
    const mapped = rows.map(row => ({
      id: row._id,
      date: row.date,
      group: row.grp,
      category: row.category,
      person: row.person,
      authorization: row.authMode,
      paymentMode: row.paymentMode,
      detail: row.detail,
      sno: row.sNo,
      income: row.incomeAmount,
      expense: row.expenseAmount,
      suspense: row.suspense ? 1 : 0
    }));

    res.json(mapped);

  } catch (err) {
    console.error("Fetch Entries Error:", err);
    res.status(500).json([]);
  }
};

/* ==========================================
   DELETE ENTRY
========================================== */
export const deleteIncomeExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await IncomeExpense.findByIdAndDelete(id);
    res.json({ success: true });

  } catch (err) {
    console.error("Delete Entry Error:", err);
    res.status(500).json({ success: false });
  }
};
