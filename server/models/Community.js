import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    community: { type: String, required: true, unique: true }
}, { timestamps: true });

export const Community = mongoose.model('Community', communitySchema);
