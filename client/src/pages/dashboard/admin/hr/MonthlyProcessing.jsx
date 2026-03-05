import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from '../../../../components/DataTable/DataTable';
import axios from 'axios';
import api from '../../../../utils/api';

const MonthlyProcessing = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedDept, setSelectedDept] = useState('');
    const [departments, setDepartments] = useState([]);
    const [processedData, setProcessedData] = useState([]);

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
            generateProcessedData(activeEmployees);
        } catch (error) {
            console.error('Error:', error);
            setEmployees([]);
            setDepartments([]);
            setProcessedData([]);
        } finally {
            setLoading(false);
        }
    };

    const generateProcessedData = (emps) => {
        const data = emps.slice(0, 25).map(emp => ({
            ...emp,
            workingDays: 26,
            presentDays: Math.floor(Math.random() * 4) + 22,
            absentDays: Math.floor(Math.random() * 3),
            halfDays: Math.floor(Math.random() * 2),
            leaveDays: Math.floor(Math.random() * 3),
            lopDays: 0,
            otHours: Math.floor(Math.random() * 10),
            basic: 25000,
            hra: 10000,
            da: 5000,
            otPay: Math.floor(Math.random() * 3000),
            gross: 0,
            pf: 3000,
            esi: 700,
            ptax: 200,
            lopDeduction: 0,
            totalDeductions: 0,
            netPay: 0,
            status: 'Pending'
        })).map(d => {
            d.gross = d.basic + d.hra + d.da + d.otPay;
            d.lopDeduction = d.lopDays * Math.floor(d.basic / 30);
            d.totalDeductions = d.pf + d.esi + d.ptax + d.lopDeduction;
            d.netPay = d.gross - d.totalDeductions;
            return d;
        });
        setProcessedData(data);
    };

    const filteredData = processedData.filter(d => !selectedDept || d.Dept_Name === selectedDept);

    const handleProcessPayroll = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setProcessedData(prev => prev.map(d => ({ ...d, status: 'Processed' })));
            toast.success('Payroll processed successfully for all employees');
        } catch (error) {
            toast.error('Error processing payroll');
        } finally {
            setProcessing(false);
        }
    };

    const totals = {
        employees: filteredData.length,
        grossTotal: filteredData.reduce((a, b) => a + b.gross, 0),
        deductionsTotal: filteredData.reduce((a, b) => a + b.totalDeductions, 0),
        netTotal: filteredData.reduce((a, b) => a + b.netPay, 0)
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
                                <Icon icon="mdi:cog-sync" className="text-purple" style={{ fontSize: '28px' }} />
                                Monthly Processing
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Monthly Processing</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Summary Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <div className="card-body text-white py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-1 opacity-75">Employees</p>
                                                <h3 className="fw-bold mb-0">{totals.employees}</h3>
                                            </div>
                                            <Icon icon="mdi:account-group" style={{ fontSize: '40px', opacity: 0.5 }} />
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
                                                <h3 className="fw-bold mb-0">₹{(totals.grossTotal / 100000).toFixed(1)}L</h3>
                                            </div>
                                            <Icon icon="mdi:cash-plus" style={{ fontSize: '40px', opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' }}>
                                    <div className="card-body text-white py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-1 opacity-75">Deductions</p>
                                                <h3 className="fw-bold mb-0">₹{(totals.deductionsTotal / 100000).toFixed(1)}L</h3>
                                            </div>
                                            <Icon icon="mdi:cash-minus" style={{ fontSize: '40px', opacity: 0.5 }} />
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
                                                <h3 className="fw-bold mb-0">₹{(totals.netTotal / 100000).toFixed(1)}L</h3>
                                            </div>
                                            <Icon icon="mdi:bank-transfer" style={{ fontSize: '40px', opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                        <button className="btn btn-primary" onClick={() => generateProcessedData(employees)}>
                                            <Icon icon="mdi:refresh" className="me-1" /> Refresh Data
                                        </button>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <button
                                            className="btn btn-success"
                                            onClick={handleProcessPayroll}
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                            ) : (
                                                <Icon icon="mdi:cog-play" className="me-1" />
                                            )}
                                            Process Payroll
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Processing Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3">
                                <h6 className="mb-0 fw-semibold">
                                    Monthly Payroll - {new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                </h6>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : (
                                    <DataTable
                                        data={filteredData}
                                        columns={[
                                            {
                                                accessorKey: 'Staff_ID',
                                                header: 'Staff ID',
                                                cell: ({ row }) => (
                                                    <span className="badge bg-light text-dark">{row.original.Staff_ID}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'Staff_Name',
                                                header: 'Name',
                                                cell: ({ row }) => (
                                                    <span className="fw-medium">{row.original.Staff_Name}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'presentDays',
                                                header: 'Present',
                                                cell: ({ row }) => (
                                                    <span className="text-success">{row.original.presentDays}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'leaveDays',
                                                header: 'Leave',
                                                cell: ({ row }) => (
                                                    <span className="text-warning">{row.original.leaveDays}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'lopDays',
                                                header: 'LOP',
                                                cell: ({ row }) => (
                                                    <span className="text-danger">{row.original.lopDays}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'gross',
                                                header: 'Gross',
                                                cell: ({ row }) => `₹${row.original.gross.toLocaleString()}`
                                            },
                                            {
                                                accessorKey: 'totalDeductions',
                                                header: 'Deduct',
                                                cell: ({ row }) => (
                                                    <span className="text-danger">₹{row.original.totalDeductions.toLocaleString()}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'netPay',
                                                header: 'Net',
                                                cell: ({ row }) => (
                                                    <span className="fw-bold text-success">₹{row.original.netPay.toLocaleString()}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'status',
                                                header: 'Status',
                                                cell: ({ row }) => (
                                                    <span className={`badge ${row.original.status === 'Processed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {row.original.status}
                                                    </span>
                                                )
                                            }
                                        ]}
                                        loading={loading}
                                        title={`Monthly Payroll - ${new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
                                        enableActions={false}
                                        enableSelection={false}
                                        enableExport={true}
                                        pageSize={10}
                                    />
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

export default MonthlyProcessing;
