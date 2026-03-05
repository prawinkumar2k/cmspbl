import mongoose from 'mongoose';

const feeReceiptSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, index: true },
    department: { type: String, index: true },
    semester: { type: String },
    feeType: { type: String, index: true },
    rollNo: { type: String, index: true },
    applicationNo: { type: String, index: true },
    studentName: { type: String },
    totalAmount: { type: Number, default: 0 },
    payNow: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    status: { type: String }, // Paid, Partially Paid, Unpaid
    securityCode: { type: String },
    remarks: { type: String },
    academic: { type: String, index: true },
    paymentMode: { type: String },
    referenceNo: { type: String },
}, { timestamps: true });

feeReceiptSchema.index({ date: -1 });

export const FeeReceipt = mongoose.model('FeeReceipt', feeReceiptSchema);
