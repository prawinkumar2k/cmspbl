import mongoose from 'mongoose';

/* Library StudentDetails — separate from Student master */
const studentDetailsSchema = new mongoose.Schema({
    borrowerId: { type: String, unique: true, index: true },
    studentName: { type: String },
    registerNumber: { type: String, index: true },
    department: { type: String },
    year: { type: String },
    section: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    joiningDate: { type: Date },
    phoneNumber: { type: String },
    emailId: { type: String },
    address: { type: String },
    borrowLimit: { type: Number, default: 3 },
    status: { type: String, default: 'Active' },
    remarks: { type: String },
    photoPath: { type: String },
}, { timestamps: true });

const placementSchema = new mongoose.Schema({
    registerNumber: { type: String, index: true },
    studentName: { type: String },
    deptName: { type: String },
    deptCode: { type: String },
    semester: { type: String },
    year: { type: String },
    regulation: { type: String },
    academicYear: { type: String },
    companyName: { type: String, required: true },
    companyLocation: { type: String },
    packageLevel: { type: String },
}, { timestamps: true });

placementSchema.index({ academicYear: -1 });

export const StudentDetails = mongoose.model('StudentDetails', studentDetailsSchema);
export const Placement = mongoose.model('Placement', placementSchema);
