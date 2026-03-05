import mongoose from 'mongoose';

const consolidatedReportSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, index: true },
    studentName: { type: String },
    deptCode: { type: String, index: true },
    deptName: { type: String },
    semester: { type: String },
    year: { type: String },
    regulation: { type: String },
    subCode: { type: String, index: true },
    subName: { type: String },
    unitTest1: { type: String, default: '0' },
    unitTest2: { type: String, default: '0' },
    unitTest3: { type: String, default: '0' },
    assignment1: { type: String, default: '0' },
    assignment2: { type: String, default: '0' },
    practicalMark: { type: String, default: '0' },
    internalTotal: { type: String, default: '0' },
    attendancePercentage: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('ConsolidatedReport', consolidatedReportSchema);
