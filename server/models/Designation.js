import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema({
    designationName: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('Designation', designationSchema);
