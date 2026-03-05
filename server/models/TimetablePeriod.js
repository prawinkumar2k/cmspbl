import mongoose from 'mongoose';

const timetablePeriodSchema = new mongoose.Schema({
    calendarDate: { type: String, required: true, index: true }, // YYYY-MM-DD
    dayOrder: { type: String, required: true },
    deptCode: { type: String, required: true, index: true },
    semester: { type: String, required: true },
    regulation: { type: String, required: true },
    classSection: { type: String, required: true },
    subCode: { type: String, required: true, index: true },
    subName: { type: String },
    periodNo: { type: Number, required: true },
    staffId: { type: String },
}, { timestamps: true });

// Compound index for retrieval
timetablePeriodSchema.index({ calendarDate: 1, dayOrder: 1, deptCode: 1, semester: 1, classSection: 1 });

export default mongoose.model('TimetablePeriod', timetablePeriodSchema);
