import mongoose from 'mongoose';

// Record of a specific fee obligation (e.g. Tuition fee for Sem 3)
const studentFeeSchema = new mongoose.Schema({
    rollNo: { type: String, index: true },
    regNo: { type: String, index: true },
    studentName: { type: String },
    department: { type: String, index: true },
    semester: { type: String, index: true }, // sem
    feeType: { type: String, index: true }, // fee_type
    amount: { type: Number, default: 0 },
    status: { type: String },              // Paid / Pending
    academicYear: { type: String, index: true },
    securityCode: { type: String },
    createdBy: { type: String },
}, { timestamps: true });

// Master configuration for what fees apply to which students
const studentFeeMasterSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    semester: { type: String, required: true, index: true },
    academicYear: { type: String, required: true, index: true },
    feesType: { type: String },
    amount: { type: Number, default: 0 },
    deptCode: { type: String },
    courseName: { type: String },
}, { timestamps: true });

export const StudentFee = mongoose.model('StudentFee', studentFeeSchema);
export const StudentFeeMaster = mongoose.model('StudentFeeMaster', studentFeeMasterSchema);
