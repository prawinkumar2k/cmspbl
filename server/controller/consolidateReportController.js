import { ConsolidatedReport } from '../models/index.js';

// Get all consolidated report data with optional filters
export const getReportData = async (req, res) => {
    try {
        const { deptName, semester, regulation, subName } = req.query;
        const filter = {};

        if (deptName) filter.deptName = deptName;
        if (semester) filter.semester = semester;
        if (regulation) filter.regulation = regulation;
        if (subName) filter.subName = subName;

        const rows = await ConsolidatedReport.find(filter).sort({ registerNumber: 1, subCode: 1 });

        // Map to old SQL field names if frontend expects them
        res.json(rows.map(r => ({
            ...r.toObject(),
            Register_Number: r.registerNumber,
            Student_Name: r.studentName,
            Dept_Name: r.deptName,
            Sub_Code: r.subCode,
            Sub_Name: r.subName
        })));
    } catch (error) {
        console.error('Error fetching consolidated report data:', error);
        res.status(500).json({ error: 'Failed to fetch report data' });
    }
};

// Get unique filter options
export const getFilterOptions = async (req, res) => {
    try {
        // Using distinct and finding samples for deptCode/year
        const departments = await ConsolidatedReport.aggregate([
            { $group: { _id: "$deptName", deptCode: { $first: "$deptCode" } } },
            { $project: { deptName: "$_id", deptCode: 1, _id: 0 } },
            { $sort: { deptName: 1 } }
        ]);

        const semesters = await ConsolidatedReport.aggregate([
            { $group: { _id: "$semester", year: { $first: "$year" } } },
            { $project: { semester: "$_id", year: 1, _id: 0 } },
            { $sort: { semester: 1 } }
        ]);

        const regulationsList = await ConsolidatedReport.distinct('regulation');
        const regulations = regulationsList.sort((a, b) => b.localeCompare(a)).map(r => ({ regulation: r }));

        const subjects = await ConsolidatedReport.aggregate([
            { $group: { _id: "$subName", subCode: { $first: "$subCode" } } },
            { $project: { subName: "$_id", subCode: 1, _id: 0 } },
            { $sort: { subName: 1 } }
        ]);

        res.json({
            departments,
            semesters,
            regulations,
            subjects
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ error: 'Failed to fetch filter options' });
    }
};
