import mongoose from 'mongoose';

const feeTypeRecordSchema = new mongoose.Schema({
    regNo: { type: String }, // reg_no
    studentName: { type: String },              // name
    department: { type: String, index: true },
    className: { type: String },              // class
    section: { type: String },
    feeTypes: { type: String },              // fee_types
    totalAmount: { type: Number, default: 0 },  // total_amount
    paidAmount: { type: Number, default: 0 },  // paid_amount
    pendingAmount: { type: Number, default: 0 },  // pending_amount
    lastPaymentDate: { type: Date },                // last_payment_date
    status: { type: String },
    paymentMode: { type: String },              // payment_mode
    notes: { type: String },
}, { timestamps: true });

feeTypeRecordSchema.index({ regNo: 1 });
feeTypeRecordSchema.index({ lastPaymentDate: -1 });

export const FeeTypeRecord = mongoose.model('FeeTypeRecord', feeTypeRecordSchema);
