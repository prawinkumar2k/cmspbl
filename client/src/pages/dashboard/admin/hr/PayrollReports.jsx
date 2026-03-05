import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from '../../../../components/DataTable/DataTable';
import axios from 'axios';
import api from '../../../../utils/api';

const PayrollReports = () => {
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedDept, setSelectedDept] = useState('');
    const [departments, setDepartments] = useState([]);
    const [reportType, setReportType] = useState('summary');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/staff_master');
            const data = Array.isArray(response.data) ? response.data : [];
            const depts = [...new Set(data.map(e => e.Dept_Name).filter(Boolean))];
            setDepartments(depts);
        } catch (error) {
            console.error('Error:', error);
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    // Mock payroll summary data
    const payrollSummary = {
        totalEmployees: 45,
        totalGross: 2025000,
        totalBasic: 1125000,
        totalHRA: 450000,
        totalDA: 225000,
        totalOther: 225000,
        totalPF: 135000,
        totalESI: 31500,
        totalTax: 90000,
        totalDeductions: 256500,
        totalNet: 1768500
    };

    // Mock department-wise data
    const deptWiseData = departments.slice(0, 6).map((dept, idx) => ({
        department: dept,
        employees: Math.floor(Math.random() * 10) + 5,
        gross: Math.floor(Math.random() * 500000) + 200000,
        deductions: Math.floor(Math.random() * 50000) + 20000,
        net: 0
    })).map(d => ({ ...d, net: d.gross - d.deductions }));

    const handleExport = (type) => {
        toast.success(`Exporting ${type} report...`);
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        {/* Page Header */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                            <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                <Icon icon="mdi:chart-bar" className="text-purple" style={{ fontSize: '28px' }} />
                                Payroll Reports
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Payroll Reports</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Filters */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body py-3">
                                <div className="row align-items-end g-3">
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold mb-1">Month</label>
                                        <input
                                            type="month"
                                            className="form-control"
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold mb-1">Department</label>
                                        <select
                                            className="form-select"
                                            value={selectedDept}
                                            onChange={(e) => setSelectedDept(e.target.value)}
                                        >
                                            <option value="">All Departments</option>
                                            {departments.map((d, i) => (
                                                <option key={i} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold mb-1">Report Type</label>
                                        <select
                                            className="form-select"
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                        >
                                            <option value="summary">Summary</option>
                                            <option value="detailed">Detailed</option>
                                            <option value="department">Department-wise</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <button className="btn btn-primary w-100">
                                            <Icon icon="mdi:magnify" className="me-1" /> Generate
                                        </button>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <div className="btn-group">
                                            <button className="btn btn-outline-success" onClick={() => handleExport('Excel')}>
                                                <Icon icon="mdi:file-excel" className="me-1" /> Excel
                                            </button>
                                            <button className="btn btn-outline-danger" onClick={() => handleExport('PDF')}>
                                                <Icon icon="mdi:file-pdf-box" className="me-1" /> PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <div className="card-body text-white py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-1 opacity-75">Total Employees</p>
                                                <h3 className="fw-bold mb-0">{payrollSummary.totalEmployees}</h3>
                                            </div>
                                            <Icon icon="mdi:account-group" style={{ fontSize: '48px', opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                                    <div className="card-body text-white py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-1 opacity-75">Total Gross</p>
                                                <h3 className="fw-bold mb-0">₹{(payrollSummary.totalGross / 100000).toFixed(1)}L</h3>
                                            </div>
                                            <Icon icon="mdi:cash-multiple" style={{ fontSize: '48px', opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' }}>
                                    <div className="card-body text-white py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-1 opacity-75">Total Deductions</p>
                                                <h3 className="fw-bold mb-0">₹{(payrollSummary.totalDeductions / 100000).toFixed(1)}L</h3>
                                            </div>
                                            <Icon icon="mdi:minus-circle" style={{ fontSize: '48px', opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                    <div className="card-body text-white py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-1 opacity-75">Net Payable</p>
                                                <h3 className="fw-bold mb-0">₹{(payrollSummary.totalNet / 100000).toFixed(1)}L</h3>
                                            </div>
                                            <Icon icon="mdi:bank-transfer" style={{ fontSize: '48px', opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Earnings Breakdown */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold text-success">
                                            <Icon icon="mdi:plus-circle" className="me-2" />
                                            Earnings Breakdown
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td>Basic Salary</td>
                                                        <td className="text-end fw-semibold">₹{payrollSummary.totalBasic.toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>House Rent Allowance (HRA)</td>
                                                        <td className="text-end fw-semibold">₹{payrollSummary.totalHRA.toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dearness Allowance (DA)</td>
                                                        <td className="text-end fw-semibold">₹{payrollSummary.totalDA.toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Other Allowances</td>
                                                        <td className="text-end fw-semibold">₹{payrollSummary.totalOther.toLocaleString()}</td>
                                                    </tr>
                                                    <tr className="table-success">
                                                        <td className="fw-bold">Total Gross</td>
                                                        <td className="text-end fw-bold">₹{payrollSummary.totalGross.toLocaleString()}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Deductions Breakdown */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold text-danger">
                                            <Icon icon="mdi:minus-circle" className="me-2" />
                                            Deductions Breakdown
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td>Provident Fund (PF)</td>
                                                        <td className="text-end fw-semibold">₹{payrollSummary.totalPF.toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>ESI</td>
                                                        <td className="text-end fw-semibold">₹{payrollSummary.totalESI.toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Professional Tax</td>
                                                        <td className="text-end fw-semibold">₹{payrollSummary.totalTax.toLocaleString()}</td>
                                                    </tr>
                                                    <tr className="table-danger">
                                                        <td className="fw-bold">Total Deductions</td>
                                                        <td className="text-end fw-bold">₹{payrollSummary.totalDeductions.toLocaleString()}</td>
                                                    </tr>
                                                    <tr className="table-primary">
                                                        <td className="fw-bold">Net Payable</td>
                                                        <td className="text-end fw-bold text-primary">₹{payrollSummary.totalNet.toLocaleString()}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Department-wise Table */}
                        <div className="card border-0 shadow-sm mt-4">
                            <div className="card-header bg-white py-3">
                                <h6 className="mb-0 fw-semibold">
                                    <Icon icon="mdi:office-building" className="me-2 text-info" />
                                    Department-wise Summary
                                </h6>
                            </div>
                            <div className="card-body p-0">
                                <DataTable
                                    data={deptWiseData}
                                    columns={[
                                        {
                                            accessorKey: 'department',
                                            header: 'Department',
                                            cell: ({ row }) => (
                                                <span className="fw-medium">{row.original.department}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'employees',
                                            header: 'Employees',
                                            cell: ({ row }) => (
                                                <span className="badge bg-primary">{row.original.employees}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'gross',
                                            header: 'Gross (₹)',
                                            cell: ({ row }) => `₹${row.original.gross.toLocaleString()}`
                                        },
                                        {
                                            accessorKey: 'deductions',
                                            header: 'Deductions (₹)',
                                            cell: ({ row }) => (
                                                <span className="text-danger">₹{row.original.deductions.toLocaleString()}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'net',
                                            header: 'Net Payable (₹)',
                                            cell: ({ row }) => (
                                                <span className="fw-bold text-success">₹{row.original.net.toLocaleString()}</span>
                                            )
                                        }
                                    ]}
                                    title="Department-wise Summary"
                                    enableActions={false}
                                    enableSelection={false}
                                    enableExport={true}
                                    pageSize={10}
                                />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </section>
        </>
    );
};

export default PayrollReports;
