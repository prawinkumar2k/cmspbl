import mongoose from 'mongoose';

const challanSchema = new mongoose.Schema({
    candidateType: { type: String, required: true },
    course: { type: String, required: true },
    sem: { type: String, required: true },
    regNo: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    challanNo: { type: String, required: true, unique: true, index: true },
    isPaid: { type: Boolean, default: false, index: true },
}, { timestamps: true });

challanSchema.index({ createdAt: -1 });

export const Challan = mongoose.model('Challan', challanSchema);
