import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
    semesterName: { type: String, required: true },
    semesterNumber: { type: Number },
    deptCode: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Semester', semesterSchema);
