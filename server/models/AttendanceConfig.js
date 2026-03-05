import mongoose from 'mongoose';

const attendanceConfigSchema = new mongoose.Schema({
    courseName: { type: String },
    deptName: { type: String },
    deptCode: { type: String, index: true },
    semester: { type: String },
    regulation: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    subType: { type: String },
    totalHours: { type: Number }
}, { timestamps: true });

attendanceConfigSchema.index({ deptCode: 1, semester: 1 });

export default mongoose.model('AttendanceConfig', attendanceConfigSchema);
