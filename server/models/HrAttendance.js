import mongoose from 'mongoose';

const hrAttendanceSchema = new mongoose.Schema({
    staffId: { type: String, required: true, index: true },
    staffName: { type: String },
    deptName: { type: String },
    attDate: { type: Date, required: true, index: true },
    inTime: { type: String },
    outTime: { type: String },
    status: { type: String, enum: ['Present', 'Absent', 'Half-Day', 'On-Duty', 'Leave'], default: 'Present' },
    workHours: { type: Number }
}, { timestamps: true });

hrAttendanceSchema.index({ staffId: 1, attDate: -1 });

export default mongoose.model('HrAttendance', hrAttendanceSchema);
