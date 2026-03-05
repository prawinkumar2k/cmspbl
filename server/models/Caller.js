import mongoose from 'mongoose';

/* Caller / tenant-related models — replaces tenant_data, tenant_details */
const callerSchema = new mongoose.Schema({
    staffId: { type: String, unique: true, index: true },
    staffName: { type: String },
    role: { type: String },
    mobile: { type: String },
    deptName: { type: String },
}, { timestamps: true });

const assignedCallSchema = new mongoose.Schema({
    tenantId: { type: String, index: true },   // caller/role identifier
    role: { type: String },
    staffId: { type: String },
    staffName: { type: String },
    staffMobile: { type: String },
    staffDept: { type: String },
    studentRegNo: { type: String },
    studentEqid: { type: String, index: true },
    studentName: { type: String },
    studentMobile: { type: String },
    parentName: { type: String },
    parentMobile: { type: String },
    address: { type: String },
    community: { type: String },
    department: { type: String },
    district: { type: String },
    standard: { type: String },
    schoolName: { type: String },
    schoolType: { type: String },
    schoolAddress: { type: String },
    source: { type: String },
    transport: { type: String },
    hostel: { type: String },
    status: { type: String },
    remarks: { type: String },
}, { timestamps: true });

const qpSchema = new mongoose.Schema({
    qpc: { type: String },
    deptCode: { type: String },
    elective: { type: String },
    semester: { type: String },
    regulation: { type: String },
    subCode: { type: String },
    subName: { type: String },
    regularCount: { type: Number, default: 0 },
    arrearCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Caller = mongoose.model('Caller', callerSchema);
export const AssignedCall = mongoose.model('AssignedCall', assignedCallSchema);
export const QP = mongoose.model('QP', qpSchema);
