import mongoose from 'mongoose';

const regulationSchema = new mongoose.Schema({
    regulationName: { type: String, required: true },
    year: { type: String },
    description: { type: String }
}, { timestamps: true });

export default mongoose.model('Regulation', regulationSchema);
