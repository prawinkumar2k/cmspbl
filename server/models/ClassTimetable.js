import mongoose from 'mongoose';

const classtimetableSchema = new mongoose.Schema({
    courseName: { type: String, index: true },
    deptCode: { type: String, index: true },
    deptName: { type: String },
    semester: { type: String },
    year: { type: String },
    regulation: { type: String },
    classSection: { type: String },
    dayOrder: { type: String },
    period1: { type: String, default: null },
    period2: { type: String, default: null },
    period3: { type: String, default: null },
    period4: { type: String, default: null },
    period5: { type: String, default: null },
    period6: { type: String, default: null },
}, { timestamps: true });

classtimetableSchema.index({ courseName: 1, deptCode: 1, semester: 1, classSection: 1 });

export default mongoose.model('ClassTimetable', classtimetableSchema);
