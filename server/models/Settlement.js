import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
    date: { type: Date, required: true, index: true },
    expenseType: { type: String, required: true },
    detail: { type: String, required: true },
    person: { type: String, required: true },
    amount: { type: Number, required: true },
}, { timestamps: true });

settlementSchema.index({ date: -1 });

const feesDetailSchema = new mongoose.Schema({
    academicYear: { type: String },
    modeOfJoin: { type: String },
    courseName: { type: String },
    deptName: { type: String },
    deptCode: { type: String },
    semester: { type: String },
    year: { type: String },
    type: { type: String },
    feesType: { type: String },
    amount: { type: Number },
}, { timestamps: true });

export const Settlement = mongoose.model('Settlement', settlementSchema);
export const FeesDetail = mongoose.model('FeesDetail', feesDetailSchema);
