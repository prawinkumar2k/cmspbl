import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    subCode: { type: String, index: true },
    subName: { type: String },
    deptCode: { type: String, index: true },
    deptName: { type: String },
    semester: { type: String },
    year: { type: String },
    regulation: { type: String },
    subType: { type: String },         // Theory / Practical
    credits: { type: Number },
    maxMark: { type: Number },
    minMark: { type: Number },
    staffId: { type: String },
    staffName: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

subjectSchema.index({ deptCode: 1, semester: 1 });

export default mongoose.model('Subject', subjectSchema);
