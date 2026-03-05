import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    assetId: { type: String, required: true, unique: true, index: true },
    date: { type: String, required: true, index: true },
    assets: { type: String, required: true, index: true },
    location: { type: String },
    description: { type: String },
    condition: { type: String },
    qty: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    createdBy: { type: String }
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);
