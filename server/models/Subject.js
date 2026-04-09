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
    minMark: { type: Number }, // This is usually the Pass Mark
    staffId: { type: String },
    staffName: { type: String },
    isActive: { type: Boolean, default: true },

    // Added missing fields from Subject.jsx
    colNo: { type: String },
    elective: { type: String },
    electiveNo: { type: String },
    qpc: { type: String },
    totalHours: { type: String },
    internalMaxMark: { type: Number },
    internalMinMark: { type: Number },
    externalMaxMark: { type: Number },
    externalMinMark: { type: Number }
}, { timestamps: true });

subjectSchema.index({ deptCode: 1, semester: 1 });

export default mongoose.model('Subject', subjectSchema);
