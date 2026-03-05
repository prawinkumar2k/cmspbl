import mongoose from 'mongoose';

const classMasterSchema = new mongoose.Schema({
    className: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('ClassMaster', classMasterSchema);
