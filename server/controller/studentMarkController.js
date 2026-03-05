import { AssignmentMark, UnitTestMark, PracticalMark, UnivMark } from '../models/index.js';

export const getStudentMarkDetails = async (req, res) => {
    try {
        const registerNumber = req.user.username;

        // 1. Fetch Assignment Marks
        const assignments = await AssignmentMark.find({ registerNumber }).sort({ assessmentDate: -1 });

        // 2. Fetch Unit Test Marks
        const unitTests = await UnitTestMark.find({ registerNumber }).sort({ assessmentDate: -1 });

        // 3. Fetch Practical Marks
        const practicals = await PracticalMark.find({ registerNumber }).sort({ assessmentDate: -1 });

        // 4. Fetch University Marks
        const universityMarks = await UnivMark.find({ registerNumber }).sort({ semester: -1, subCode: 1 });

        // Map to expected frontend formats if needed (SQL column names)
        res.json({
            success: true,
            data: {
                assignments: assignments.map(a => ({
                    Sub_Code: a.subCode,
                    Sub_Name: a.subName,
                    Assignment_No: a.testNo,
                    Max_Marks: a.maxMarks,
                    Obtained_Mark: a.obtainedMark,
                    Assessment_Date: a.assessmentDate
                })),
                unitTests: unitTests.map(u => ({
                    Sub_Code: u.subCode,
                    Sub_Name: u.subName,
                    Test_No: u.testNo,
                    Max_Marks: u.maxMarks,
                    Obtained_Mark: u.obtainedMark,
                    Assessment_Date: u.assessmentDate
                })),
                practicals: practicals.map(p => {
                    let total = 0;
                    let isAbsent = false;
                    if (p.experimentMarks) {
                        for (let [k, v] of p.experimentMarks) {
                            if (v === 'A') isAbsent = true;
                            else total += parseInt(v) || 0;
                        }
                    }
                    return {
                        ...p.toObject(),
                        Register_Number: p.registerNumber,
                        Obtained_Mark: isAbsent ? 'A' : total, // Compatible field for frontend
                        // Also include experiment marks if frontend needs them
                    };
                }),
                universityMarks: universityMarks.map(m => ({
                    Sub_Code: m.subCode,
                    Sub_Name: m.subName,
                    Internal_Mark: m.internalMark,
                    External_Mark: m.externalMark,
                    Total_Mark: m.totalMark,
                    Status: m.status,
                    Semester: m.semester,
                    Academic_Year: m.academicYear,
                    Regulation: m.regulation
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching student marks:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
