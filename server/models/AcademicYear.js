import mongoose from 'mongoose';

const academicYearSchema = new mongoose.Schema({
    academicYear: { type: String, required: true, unique: true },
    startDate: { type: String },
    endDate: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('AcademicYear', academicYearSchema);
