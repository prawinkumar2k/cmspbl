import mongoose from 'mongoose';

const courseMasterSchema = new mongoose.Schema({
    courseName: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('CourseMaster', courseMasterSchema);
