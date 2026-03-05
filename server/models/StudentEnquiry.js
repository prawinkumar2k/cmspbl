import mongoose from 'mongoose';

const studentEnquirySchema = new mongoose.Schema({
    studentEqid: { type: String, unique: true, index: true },
    studentName: { type: String, required: true },
    mobileNo: { type: String, required: true },
    parentName: { type: String, required: true },
    parentMobile: { type: String },
    address: { type: String },
    district: { type: String, required: true },
    community: { type: String, required: true },
    standard: { type: String, required: true },
    department: { type: String },
    schoolType: { type: String },
    studentRegNo: { type: String },
    schoolName: { type: String },
    schoolAddress: { type: String },
    hostel: { type: String },
    transport: { type: String },
    source: { type: String },
    status: { type: String, default: null },
}, { timestamps: true });

studentEnquirySchema.index({ createdAt: -1 });

export default mongoose.model('StudentEnquiry', studentEnquirySchema);
