import { Placement } from '../models/StudentDetails.js';
import Student from '../models/Student.js';

export const getRegisterNumbers = async (req, res) => {
    try {
        const nums = await Student.distinct('registerNumber', {
            registerNumber: { $ne: null, $ne: '' }
        });
        res.json(nums.sort().map(n => ({ Register_Number: n })));
    } catch (error) {
        console.error('Error fetching register numbers:', error);
        res.status(500).json({ message: 'Failed to fetch register numbers', error: error.message });
    }
};

export const getStudentByRegister = async (req, res) => {
    try {
        const { registerNumber } = req.params;
        const s = await Student.findOne({ registerNumber })
            .select('registerNumber studentName deptName deptCode semester year regulation academicYear');

        if (!s) return res.status(404).json({ message: 'Student not found' });

        res.json({
            register_number: s.registerNumber, student_name: s.studentName,
            dept_name: s.deptName, dept_code: s.deptCode,
            semester: s.semester, year: s.year,
            regulation: s.regulation, academic_year: s.academicYear,
        });
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ message: 'Failed to fetch student details', error: error.message });
    }
};

export const createPlacement = async (req, res) => {
    try {
        const { register_number, student_name, dept_name, dept_code, semester, year,
            regulation, company_name, company_location, package_level, academic_year } = req.body;

        if (!register_number || !student_name || !company_name) {
            return res.status(400).json({ message: 'Register number, student name, and company name are required' });
        }

        const doc = await Placement.create({
            registerNumber: register_number, studentName: student_name,
            deptName: dept_name, deptCode: dept_code, semester, year, regulation, academicYear: academic_year,
            companyName: company_name, companyLocation: company_location, packageLevel: package_level,
        });

        res.status(201).json({ message: 'Placement record created successfully', id: doc._id });
    } catch (error) {
        console.error('Error creating placement record:', error);
        res.status(500).json({ message: 'Failed to create placement record', error: error.message });
    }
};

const mapPlacement = (p) => ({
    id: p._id, register_number: p.registerNumber, student_name: p.studentName,
    dept_name: p.deptName, dept_code: p.deptCode, semester: p.semester, year: p.year,
    regulation: p.regulation, academic_year: p.academicYear, company_name: p.companyName,
    company_location: p.companyLocation, package_level: p.packageLevel,
    created_at: p.createdAt, updated_at: p.updatedAt,
});

export const getAllPlacements = async (req, res) => {
    try {
        const rows = await Placement.find().sort({ createdAt: -1 });
        res.json(rows.map(mapPlacement));
    } catch (error) { res.status(500).json({ message: 'Failed to fetch placement records', error: error.message }); }
};

export const getPlacementById = async (req, res) => {
    try {
        const doc = await Placement.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Placement record not found' });
        res.json(mapPlacement(doc));
    } catch (error) { res.status(500).json({ message: 'Failed to fetch placement record', error: error.message }); }
};

export const updatePlacement = async (req, res) => {
    try {
        const { company_name, company_location, package_level } = req.body;
        if (!company_name) return res.status(400).json({ message: 'Company name is required' });

        const result = await Placement.findByIdAndUpdate(req.params.id,
            { companyName: company_name, companyLocation: company_location, packageLevel: package_level },
            { new: true }
        );
        if (!result) return res.status(404).json({ message: 'Placement record not found' });
        res.json({ message: 'Placement record updated successfully' });
    } catch (error) { res.status(500).json({ message: 'Failed to update placement record', error: error.message }); }
};

export const deletePlacement = async (req, res) => {
    try {
        const result = await Placement.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Placement record not found' });
        res.json({ message: 'Placement record deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Failed to delete placement record', error: error.message }); }
};

export const getPlacementStats = async (req, res) => {
    try {
        const total = await Placement.countDocuments();

        // ✅ MongoDB aggregation replaces:
        //    COUNT(*) * 100 / (SELECT COUNT(*) ...) GROUP BY company / academic_year
        const [companyStats, academicYearStats] = await Promise.all([
            Placement.aggregate([
                { $group: { _id: '$companyName', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Placement.aggregate([
                { $group: { _id: '$academicYear', count: { $sum: 1 } } },
                { $sort: { _id: -1 } }
            ]),
        ]);

        const withPct = (arr, key) => arr.map(r => ({
            [key]: r._id,
            count: r.count,
            percentage: total > 0 ? parseFloat(((r.count / total) * 100).toFixed(1)) : 0
        }));

        res.json({
            companyStats: withPct(companyStats, 'company_name'),
            academicYearStats: withPct(academicYearStats, 'academic_year'),
            total
        });
    } catch (error) {
        console.error('Error fetching placement stats:', error);
        res.status(500).json({ message: 'Failed to fetch placement stats', error: error.message });
    }
};
