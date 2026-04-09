import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    role: { type: String, required: true },
    staffName: { type: String, required: true },
    staffId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    // Array of allowed sidebar module keys
    moduleAccess: { type: [String], default: [] },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export default mongoose.model('User', userSchema);
