import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import axios from 'axios';
import api from '../../../../utils/api';

const PayslipGeneration = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedDept, setSelectedDept] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/staff_master');
            const data = Array.isArray(response.data) ? response.data : [];
            const activeEmployees = data.filter(e => !e.Reliving_Date) || [];
            setEmployees(activeEmployees);
            const depts = [...new Set(activeEmployees.map(e => e.Dept_Name).filter(Boolean))];
            setDepartments(depts);
        } catch (error) {
            console.error('Error:', error);
            setEmployees([]);
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(e => !selectedDept || e.Dept_Name === selectedDept);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(filteredEmployees.map(e => e.Staff_ID));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectEmployee = (staffId) => {
        if (selectedEmployees.includes(staffId)) {
            setSelectedEmployees(selectedEmployees.filter(id => id !== staffId));
        } else {
            setSelectedEmployees([...selectedEmployees, staffId]);
        }
    };

    const handleGeneratePayslips = async () => {
        if (selectedEmployees.length === 0) {
            toast.error('Please select at least one employee');
            return;
        }

        setProcessing(true);
        try {
            // Simulate payslip generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success(`Payslips generated for ${selectedEmployees.length} employees`);
            setSelectedEmployees([]);
            setSelectAll(false);
        } catch (error) {
            toast.error('Failed to generate payslips');
        } finally {
            setProcessing(false);
        }
    };

    // Mock salary data
    const getSalaryData = (emp) => ({
        basic: 25000,
        hra: 10000,
        da: 5000,
        other: 5000,
        gross: 45000,
        pf: 3000,
        esi: 700,
        tax: 2000,
        deductions: 5700,
        net: 39300
    });

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
                                <Icon icon="mdi:file-document-edit" className="text-success" style={{ fontSize: '28px' }} />
                                Payslip Generation
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Payslip Generation</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Filters & Actions */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body py-3">
                                <div className="row align-items-end g-3">
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold mb-1">Payroll Month</label>
                                        <input
                                            type="month"
                                            className="form-control"
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
                                        <span className="badge bg-primary fs-6">
                                            {selectedEmployees.length} Selected
                                        </span>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <button
                                            className="btn btn-success"
                                            onClick={handleGeneratePayslips}
                                            disabled={processing || selectedEmployees.length === 0}
                                        >
                                            {processing ? (
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                            ) : (
                                                <Icon icon="mdi:file-document-check" className="me-1" />
                                            )}
                                            Generate Payslips
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employee Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 fw-semibold">
                                    Select Employees for Payslip - {new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                </h6>
                                <button className="btn btn-sm btn-outline-primary" onClick={handleSelectAll}>
                                    {selectAll ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th style={{ width: '50px' }}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                        />
                                                    </th>
                                                    <th>Staff ID</th>
                                                    <th>Name</th>
                                                    <th>Department</th>
                                                    <th className="text-end">Gross (₹)</th>
                                                    <th className="text-end text-danger">Deductions (₹)</th>
                                                    <th className="text-end text-success">Net (₹)</th>
                                                    <th className="text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEmployees.slice(0, 30).map(emp => {
                                                    const salary = getSalaryData(emp);
                                                    const isSelected = selectedEmployees.includes(emp.Staff_ID);
                                                    return (
                                                        <tr key={emp.Staff_ID} className={isSelected ? 'table-success' : ''}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={isSelected}
                                                                    onChange={() => handleSelectEmployee(emp.Staff_ID)}
                                                                />
                                                            </td>
                                                            <td><span className="badge bg-light text-dark">{emp.Staff_ID}</span></td>
                                                            <td className="fw-medium">{emp.Staff_Name}</td>
                                                            <td>{emp.Dept_Name || '-'}</td>
                                                            <td className="text-end">₹{salary.gross.toLocaleString()}</td>
                                                            <td className="text-end text-danger">₹{salary.deductions.toLocaleString()}</td>
                                                            <td className="text-end fw-bold text-success">₹{salary.net.toLocaleString()}</td>
                                                            <td className="text-center">
                                                                <span className="badge bg-warning-subtle text-warning">Pending</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </section>
        </>
    );
};

export default PayslipGeneration;
