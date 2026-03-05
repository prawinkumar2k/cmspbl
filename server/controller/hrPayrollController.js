/**
 * HR Payroll Controller — MongoDB version
 * ON DUPLICATE KEY UPDATE → findOneAndUpdate with upsert: true
 * GROUP BY + SUM → $group aggregation pipeline
 * JOIN → .populate()
 */
import Payroll from '../models/Payroll.js';
import Staff from '../models/Staff.js';

// ── Get payroll data ──────────────────────────────────────────────────────────

export const getPayrollData = async (req, res) => {
    try {
        const { month, year, staffId, department } = req.query;

        // ✅ MongoDB: Build filter object instead of dynamic SQL string
        const filter = {};
        if (month && year) { filter.month = parseInt(month); filter.year = parseInt(year); }
        if (staffId) filter.staffId = staffId;

        let payrolls = await Payroll.find(filter).sort({ year: -1, month: -1 });

        // If department filter needed: populate and filter (MongoDB doesn't JOIN natively)
        if (department) {
            const staffInDept = await Staff.find({ deptName: department }).select('staffId');
            const staffIds = staffInDept.map(s => s.staffId);
            payrolls = payrolls.filter(p => staffIds.includes(p.staffId));
        }

        // Enrich with staff info
        const staffMap = {};
        const allStaffIds = [...new Set(payrolls.map(p => p.staffId))];
        const staffList = await Staff.find({ staffId: { $in: allStaffIds } }).select('staffId staffName deptName designation');
        for (const s of staffList) staffMap[s.staffId] = s;

        const enriched = payrolls.map(p => ({
            ...p.toObject(),
            Staff_Name: staffMap[p.staffId]?.staffName || '',
            Dept_Name: staffMap[p.staffId]?.deptName || '',
            Designation: staffMap[p.staffId]?.designation || '',
        }));

        res.json(enriched);
    } catch (error) {
        console.error('Error fetching payroll data:', error);
        res.status(500).json({ error: 'Failed to fetch payroll data' });
    }
};

// ── Generate payslips ─────────────────────────────────────────────────────────

export const generatePayslips = async (req, res) => {
    try {
        const { month, year, staffIds } = req.body;

        const staffFilter = { $or: [{ relievingDate: null }, { relievingDate: '' }] };
        if (staffIds && staffIds.length > 0) staffFilter.staffId = { $in: staffIds };

        const staffList = await Staff.find(staffFilter);
        const payslips = [];

        for (const staff of staffList) {
            const salary = staff.salary || {};
            const basic = parseFloat(salary.basicSalary || 0);
            const hra = parseFloat(salary.hra || 0);
            const da = parseFloat(salary.da || 0);
            const ta = parseFloat(salary.ta || 0);
            const specialAllow = parseFloat(salary.specialAllowance || 0);
            const grossSalary = basic + hra + da + ta + specialAllow;
            const pf = parseFloat(salary.pfDeduction || 0);
            const esi = parseFloat(salary.esiDeduction || 0);
            const profTax = parseFloat(salary.professionalTax || 0);
            const tds = parseFloat(salary.tds || 0);
            const totalDeductions = pf + esi + profTax + tds;
            const netSalary = grossSalary - totalDeductions;

            payslips.push({
                staffId: staff.staffId, month: parseInt(month), year: parseInt(year),
                basicSalary: basic, hra, da, ta, specialAllowance: specialAllow,
                grossSalary, pfDeduction: pf, esiDeduction: esi,
                professionalTax: profTax, tds, totalDeductions, netSalary,
                status: 'generated'
            });
        }

        if (payslips.length > 0) {
            // ✅ bulkWrite with upsert replaces MySQL: INSERT ... ON DUPLICATE KEY UPDATE
            const bulkOps = payslips.map(p => ({
                updateOne: {
                    filter: { staffId: p.staffId, month: p.month, year: p.year },
                    update: { $set: p },
                    upsert: true
                }
            }));
            await Payroll.bulkWrite(bulkOps);
        }

        res.status(201).json({ message: 'Payslips generated successfully', count: payslips.length });
    } catch (error) {
        console.error('Error generating payslips:', error);
        res.status(500).json({ error: 'Failed to generate payslips' });
    }
};

// ── Process monthly payroll ───────────────────────────────────────────────────

export const processMonthlyPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;

        // ✅ MongoDB: updateMany replaces MySQL UPDATE WHERE
        const result = await Payroll.updateMany(
            { month: parseInt(month), year: parseInt(year), status: 'generated' },
            { $set: { status: 'paid', paidDate: new Date() } }
        );

        res.json({ message: 'Monthly payroll processed successfully', recordsUpdated: result.modifiedCount });
    } catch (error) {
        console.error('Error processing payroll:', error);
        res.status(500).json({ error: 'Failed to process payroll' });
    }
};

// ── Get payroll reports ───────────────────────────────────────────────────────

export const getPayrollReports = async (req, res) => {
    try {
        const { month, year, reportType } = req.query;
        const matchFilter = { month: parseInt(month), year: parseInt(year) };

        if (reportType === 'summary') {
            // ✅ MongoDB aggregation replaces MySQL SUM/COUNT/CASE WHEN
            const [result] = await Payroll.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: null,
                        total_employees: { $sum: 1 },
                        total_gross: { $sum: '$grossSalary' },
                        total_deductions: { $sum: '$totalDeductions' },
                        total_net: { $sum: '$netSalary' },
                        paid_count: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
                        pending_count: { $sum: { $cond: [{ $eq: ['$status', 'generated'] }, 1, 0] } }
                    }
                }
            ]);
            return res.json(result || {});
        }

        if (reportType === 'department') {
            // Need to join with Staff to get deptName
            const payrolls = await Payroll.find(matchFilter);
            const allStaffIds = [...new Set(payrolls.map(p => p.staffId))];
            const staffList = await Staff.find({ staffId: { $in: allStaffIds } }).select('staffId deptName');
            const staffMap = {};
            for (const s of staffList) staffMap[s.staffId] = s.deptName;

            // Group by department in JS (since we can't do $lookup easily without ref)
            const deptGroups = {};
            for (const p of payrolls) {
                const dept = staffMap[p.staffId] || 'Unknown';
                if (!deptGroups[dept]) deptGroups[dept] = { Dept_Name: dept, employee_count: 0, total_gross: 0, total_net: 0 };
                deptGroups[dept].employee_count++;
                deptGroups[dept].total_gross += p.grossSalary;
                deptGroups[dept].total_net += p.netSalary;
            }
            return res.json(Object.values(deptGroups));
        }

        // Default: full list with staff info
        const payrolls = await Payroll.find(matchFilter).sort({ staffId: 1 });
        const allStaffIds = [...new Set(payrolls.map(p => p.staffId))];
        const staffList = await Staff.find({ staffId: { $in: allStaffIds } }).select('staffId staffName deptName designation');
        const staffMap = {};
        for (const s of staffList) staffMap[s.staffId] = s;

        const rows = payrolls.map(p => ({
            ...p.toObject(),
            Staff_Name: staffMap[p.staffId]?.staffName || '',
            Dept_Name: staffMap[p.staffId]?.deptName || '',
            Designation: staffMap[p.staffId]?.designation || '',
        }));

        res.json(rows);
    } catch (error) {
        console.error('Error fetching payroll reports:', error);
        res.status(500).json({ error: 'Failed to fetch payroll reports' });
    }
};

// ── Get salary structure ──────────────────────────────────────────────────────

export const getSalaryStructure = async (req, res) => {
    try {
        const filter = {};
        if (req.query.staffId) filter.staffId = req.query.staffId;

        // salary is embedded in Staff model
        const staffList = await Staff.find(filter).sort({ staffName: 1 });

        const result = staffList.map(s => ({
            _id: s._id,
            staffId: s.staffId,
            Staff_Name: s.staffName,
            Dept_Name: s.deptName,
            Designation: s.designation,
            ...s.salary?.toObject?.() || s.salary
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching salary structure:', error);
        res.status(500).json({ error: 'Failed to fetch salary structure' });
    }
};

// ── Update salary structure ───────────────────────────────────────────────────

export const updateSalaryStructure = async (req, res) => {
    try {
        const { id } = req.params;
        const salaryData = req.body;

        // salary is embedded as sub-document in Staff
        const updateFields = {};
        for (const [key, value] of Object.entries(salaryData)) {
            updateFields[`salary.${key}`] = value;
        }

        await Staff.findByIdAndUpdate(id, { $set: updateFields });
        res.json({ message: 'Salary structure updated successfully' });
    } catch (error) {
        console.error('Error updating salary structure:', error);
        res.status(500).json({ error: 'Failed to update salary structure' });
    }
};
