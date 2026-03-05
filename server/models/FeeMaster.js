import mongoose from 'mongoose';

const feeMasterSchema = new mongoose.Schema({
    feeType: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('FeeMaster', feeMasterSchema);
