import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    studentEqid: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true },
    studentMobile: { type: String },
    parentName: { type: String },
    parentMobile: { type: String },
    studentAddress: { type: String },
    studentDistrict: { type: String },
    studentCommunity: { type: String },
    schoolType: { type: String },
    standard: { type: String },
    studentRegNo: { type: String },
    schoolAddress: { type: String },
    department: { type: String },
    source: { type: String },
    transport: { type: String },
    hostel: { type: String },
    status: { type: String, default: 'Enquiry' },
    staffId: { type: String, index: true },
    staffName: { type: String },
    tenantId: { type: String }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
