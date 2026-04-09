import mongoose from 'mongoose';

/**
 * Payroll model — replaces hr_payroll table
 * Compound unique index for payroll uniqueness
 */
const payrollSchema = new mongoose.Schema({
    // References
    staffId: { type: String, required: true, index: true },
    staffRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },

    // Period
    month: { type: Number, required: true },  // 1–12
    year: { type: Number, required: true },

    // Earnings
    basicSalary: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    ta: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },

    // Deductions
    pfDeduction: { type: Number, default: 0 },
    esiDeduction: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },

    status: { type: String, enum: ['generated', 'paid'], default: 'generated', index: true },
    paidDate: { type: Date, default: null },
}, { timestamps: true });

// Compound unique index for upsert-style payroll writes
payrollSchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ month: 1, year: 1 });

export default mongoose.model('Payroll', payrollSchema);
