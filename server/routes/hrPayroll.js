import express from 'express';
import {
    getPayrollData,
    generatePayslips,
    processMonthlyPayroll,
    getPayrollReports,
    getSalaryStructure,
    updateSalaryStructure
} from '../controller/hrPayrollController.js';

const router = express.Router();

// Payroll Routes
router.get('/data', getPayrollData);
router.post('/generate-payslips', generatePayslips);
router.post('/process-monthly', processMonthlyPayroll);
router.get('/reports', getPayrollReports);
router.get('/salary-structure', getSalaryStructure);
router.put('/salary-structure/:id', updateSalaryStructure);

export default router;
