import mongoose from 'mongoose';

/**
 * Staff model — replaces staff_master table
 * hr_staff_salary is embedded (always needed together)
 */

const salarySchema = new mongoose.Schema({
    basicSalary: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    ta: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    pfDeduction: { type: Number, default: 0 },
    esiDeduction: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
}, { _id: false });

const staffSchema = new mongoose.Schema({
    staffId: { type: String, required: true, unique: true, index: true },
    staffName: { type: String, required: true },
    gender: { type: String },
    dob: { type: String },
    email: { type: String },
    mobile: { type: String },
    deptName: { type: String, index: true },
    deptCode: { type: String },
    designation: { type: String },
    qualification: { type: String },
    joiningDate: { type: String },
    relievingDate: { type: String, default: null },
    photo: { type: String, default: '' },
    aadhaarNo: { type: String },
    panNo: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    address: { type: String },
    bloodGroup: { type: String },
    isActive: { type: Boolean, default: true },

    // Embedded salary structure (replaces hr_staff_salary JOIN)
    salary: { type: salarySchema, default: () => ({}) },

    // Legacy field name support
    Staff_ID: { type: String, trim: true },
    Staff_Name: { type: String, trim: true },
    Dept_Name: { type: String, trim: true },
    Dept_Code: { type: String, trim: true },
    Designation: { type: String, trim: true },

}, { timestamps: true, strict: false });

export default mongoose.model('Staff', staffSchema);
