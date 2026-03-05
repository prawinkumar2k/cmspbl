import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    stockId: { type: String, required: true, unique: true, index: true },
    date: { type: String, required: true, index: true },
    code: { type: String, index: true },
    productName: { type: String, required: true, index: true },
    brandName: { type: String },
    rate: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    scale: { type: String, default: 'Bundle' },
    totalValue: { type: Number, default: 0 },
    scanImage: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
    status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Stock', stockSchema);
