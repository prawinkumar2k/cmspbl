import mongoose from 'mongoose';

const feeLedgerSchema = new mongoose.Schema({
    rollNo: { type: String, index: true }, // roll_no
    registerNumber: { type: String, index: true }, // reg_no / registerNumber
    studentName: { type: String },            // name / studentName
    department: { type: String, index: true },
    deptCode: { type: String },
    semester: { type: String, index: true },
    feeType: { type: String, index: true }, // fee_type
    amount: { type: Number, default: 0 },  // total amount due
    totalAmount: { type: Number, default: 0 },  // alias for amount
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    academicYear: { type: String, index: true }, // academic_year
    dueDate: { type: Date },
    createdBy: { type: String },
    updatedBy: { type: String },
}, { timestamps: true });

feeLedgerSchema.index({ rollNo: 1, academicYear: 1 });
feeLedgerSchema.index({ registerNumber: 1, academicYear: 1 });

export default mongoose.model('FeeLedger', feeLedgerSchema);
