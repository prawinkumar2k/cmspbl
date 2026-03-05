import mongoose from 'mongoose';

// Master data for Income/Expense groups, categories, and persons
const incomeExpenseMasterSchema = new mongoose.Schema({
    groupName: { type: String, required: true, index: true },
    categoryName: { type: String, index: true },
    personName: { type: String, index: true }
}, { timestamps: true });

// Ensure unique combination in master
incomeExpenseMasterSchema.index({ groupName: 1, categoryName: 1, personName: 1 }, { unique: true });

// Income and Expense entries
const incomeExpenseSchema = new mongoose.Schema({
    sNo: { type: String, index: true },
    date: { type: Date, required: true, index: true },
    grp: { type: String, required: true, index: true }, // group_name
    category: { type: String, index: true },                 // category_name
    person: { type: String, index: true },                 // person_name
    authMode: { type: String },                              // authorization / auth_mode
    paymentMode: { type: String },                              // payment_mode / cheque_details
    detail: { type: String },
    billNo: { type: String, index: true },                 // bill_no
    incomeAmount: { type: Number, default: 0 },                  // income
    expenseAmount: { type: Number, default: 0 },                  // expense
    suspenseAmount: { type: Number, default: 0 },                  // suspense_amount
    suspense: { type: Boolean, default: false },             // suspense
    createdBy: { type: String },                              // created_by
    status: { type: String, default: 'Active' },
}, { timestamps: true });

export const IncomeExpenseMaster = mongoose.model('IncomeExpenseMaster', incomeExpenseMasterSchema);
export const IncomeExpense = mongoose.model('IncomeExpense', incomeExpenseSchema);
