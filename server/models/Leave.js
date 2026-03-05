import mongoose from 'mongoose';

const hrLeaveSchema = new mongoose.Schema({
    staffId: { type: String, required: true, index: true },
    staffName: { type: String },
    leaveType: { type: String },
    fromDate: { type: Date },
    toDate: { type: Date },
    totalDays: { type: Number },
    reason: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedBy: { type: String },
    remarks: { type: String }
}, { timestamps: true });

hrLeaveSchema.index({ staffId: 1, fromDate: -1 });

export default mongoose.model('Leave', hrLeaveSchema);
