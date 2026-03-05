import mongoose from 'mongoose';

// Static lookup tables that don't need separate Mongoose collections
// are handled as static arrays in masterDataController.js

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true }
}, { timestamps: true });

const collegeStrengthSchema = new mongoose.Schema({
    courseCode: { type: String },
    branch: { type: String },
    year1: { type: Number, default: 0 },
    year2: { type: Number, default: 0 },
    year3: { type: Number, default: 0 },
    year4: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
export const CollegeStrength = mongoose.model('CollegeStrength', collegeStrengthSchema);
