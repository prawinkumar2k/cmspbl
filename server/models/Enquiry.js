import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    name: { type: String },
    mobile: { type: String, index: true },
    email: { type: String },
    course: { type: String },
    department: { type: String },
    message: { type: String },
    source: { type: String },
    status: { type: String, enum: ['New', 'Called', 'Interested', 'Admitted', 'Not Interested'], default: 'New' },
    callNotes: { type: String },
    followUpDate: { type: Date },
    assignedTo: { type: String },
}, { timestamps: true });

enquirySchema.index({ createdAt: -1 });

export default mongoose.model('Enquiry', enquirySchema);
