import mongoose from 'mongoose';

const feeCollectionSchema = new mongoose.Schema({
    regNo: { type: String }, // reg_no
    applicationNo: { type: String, index: true }, // application_no
    rollNo: { type: String }, // roll_no
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
    branchSec: { type: String },              // branch_sec
    seatNo: { type: String },              // seat_no
    allocatedQuota: { type: String },              // allocated_quota
}, { timestamps: true });

feeCollectionSchema.index({ regNo: 1 });
feeCollectionSchema.index({ rollNo: 1 });

export default mongoose.model('FeeCollection', feeCollectionSchema);
