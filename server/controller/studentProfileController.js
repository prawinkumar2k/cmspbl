import Student from '../models/Student.js';

// Field mapping: legacy PascalCase -> MongoDB camelCase
const FIELD_MAP = {
    Student_Name: 'studentName', Dob: 'dob', Gender: 'gender', Blood_Group: 'bloodGroup',
    Nationality: 'nationality', Religion: 'religion', Community: 'community', Caste: 'caste',
    Aadhaar_No: 'aadhaarNo', Std_Email: 'stdEmail', Student_Mobile: 'studentMobile',
    Permanent_Address: 'permanentAddress', Current_Address: 'currentAddress',
    Father_Name: 'fatherName', Father_Mobile: 'fatherMobile',
    Mother_Name: 'motherName', Mother_Mobile: 'motherMobile',
    Guardian_Name: 'guardianName', Guardian_Relation: 'guardianRelation'
};

export const getStudentProfile = async (req, res) => {
    try {
        const registerNumber = req.user.username;
        const student = await Student.findOne({ registerNumber });

        if (!student) return res.status(404).json({ success: false, error: 'Student profile not found' });

        res.json({ success: true, profile: student });
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const updateStudentProfile = async (req, res) => {
    try {
        const registerNumber = req.user.username;
        const updateData = req.body;

        // Only allow whitelisted fields to be updated
        const updates = {};
        for (const [legacyKey, mongoKey] of Object.entries(FIELD_MAP)) {
            if (legacyKey in updateData) updates[mongoKey] = updateData[legacyKey];
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, error: 'No valid fields provided for update' });
        }

        const result = await Student.findOneAndUpdate({ registerNumber }, { $set: updates }, { new: true });
        if (!result) return res.status(404).json({ success: false, error: 'Student record not found' });

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating student profile:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
