import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';

import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from '../../../../components/DataTable/DataTable';

const LeaveAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDept, setSelectedDept] = useState('');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/staff_master');
            const data = response.data;
            const depts = [...new Set(data.map(e => e.Dept_Name).filter(Boolean))];
            setDepartments(depts);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mock leave analysis data
    const leaveStats = {
        totalLeavesTaken: 245,
        casualLeave: 98,
        sickLeave: 67,
        earnedLeave: 45,
        lop: 35,
        averagePerEmployee: 5.4,
        pendingRequests: 12
    };

    // Monthly trend data
    const monthlyTrend = [
        { month: 'Jan', cl: 8, sl: 5, el: 3, lop: 2 },
        { month: 'Feb', cl: 10, sl: 7, el: 4, lop: 3 },
        { month: 'Mar', cl: 12, sl: 6, el: 5, lop: 4 },
        { month: 'Apr', cl: 9, sl: 8, el: 4, lop: 2 },
        { month: 'May', cl: 11, sl: 5, el: 6, lop: 3 },
        { month: 'Jun', cl: 8, sl: 6, el: 4, lop: 5 },
        { month: 'Jul', cl: 7, sl: 4, el: 3, lop: 2 },
        { month: 'Aug', cl: 9, sl: 7, el: 5, lop: 4 },
        { month: 'Oct', cl: 8, sl: 6, el: 3, lop: 2 },
        { month: 'Nov', cl: 5, sl: 4, el: 2, lop: 2 },
        { month: 'Dec', cl: 5, sl: 4, el: 2, lop: 3 }
    ];

    // Department-wise leave data
    const deptLeaveData = departments.slice(0, 6).map(dept => ({
        department: dept,
        totalLeaves: Math.floor(Math.random() * 50) + 20,
        cl: Math.floor(Math.random() * 20) + 5,
        sl: Math.floor(Math.random() * 15) + 3,
        el: Math.floor(Math.random() * 10) + 2,
        lop: Math.floor(Math.random() * 5)
    }));

    const handleExport = () => {
        toast.success('Exporting report...');
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
                                <Icon icon="mdi:chart-line" className="text-warning" style={{ fontSize: '28px' }} />
                                Leave Analysis
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Leave Analysis</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Filters */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body py-3">
                                <div className="row align-items-end g-3">
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold mb-1">Year</label>
                                        <select
                                            className="form-select"
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                        >
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                        </select>
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
                                        <button className="btn btn-primary">
                                            <Icon icon="mdi:refresh" className="me-1" /> Refresh
                                        </button>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <button className="btn btn-outline-success" onClick={handleExport}>
                                            <Icon icon="mdi:file-excel" className="me-1" /> Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-lg-2">
                                <div className="card border-0 shadow-sm bg-primary-subtle text-center py-3">
                                    <h4 className="fw-bold text-primary mb-0">{leaveStats.totalLeavesTaken}</h4>
                                    <small>Total Leaves</small>
                                </div>
                            </div>
                            <div className="col-6 col-lg-2">
                                <div className="card border-0 shadow-sm bg-success-subtle text-center py-3">
                                    <h4 className="fw-bold text-success mb-0">{leaveStats.casualLeave}</h4>
                                    <small>Casual</small>
                                </div>
                            </div>
                            <div className="col-6 col-lg-2">
                                <div className="card border-0 shadow-sm bg-danger-subtle text-center py-3">
                                    <h4 className="fw-bold text-danger mb-0">{leaveStats.sickLeave}</h4>
                                    <small>Sick</small>
                                </div>
                            </div>
                            <div className="col-6 col-lg-2">
                                <div className="card border-0 shadow-sm bg-info-subtle text-center py-3">
                                    <h4 className="fw-bold text-info mb-0">{leaveStats.earnedLeave}</h4>
                                    <small>Earned</small>
                                </div>
                            </div>
                            <div className="col-6 col-lg-2">
                                <div className="card border-0 shadow-sm bg-warning-subtle text-center py-3">
                                    <h4 className="fw-bold text-warning mb-0">{leaveStats.lop}</h4>
                                    <small>LOP</small>
                                </div>
                            </div>
                            <div className="col-6 col-lg-2">
                                <div className="card border-0 shadow-sm bg-secondary-subtle text-center py-3">
                                    <h4 className="fw-bold text-secondary mb-0">{leaveStats.averagePerEmployee}</h4>
                                    <small>Avg/Employee</small>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Monthly Trend */}
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold">
                                            <Icon icon="mdi:chart-bar" className="me-2 text-primary" />
                                            Monthly Leave Trend - {selectedYear}
                                        </h6>
                                    </div>
                                    <div className="card-body p-0">
                                        <DataTable
                                            data={monthlyTrend.map(row => ({ ...row, total: row.cl + row.sl + row.el + row.lop }))}
                                            columns={[
                                                {
                                                    accessorKey: 'month',
                                                    header: 'Month',
                                                    cell: ({ row }) => (
                                                        <span className="fw-medium">{row.original.month}</span>
                                                    )
                                                },
                                                {
                                                    accessorKey: 'cl',
                                                    header: 'CL',
                                                    cell: ({ row }) => (
                                                        <span className="badge bg-success">{row.original.cl}</span>
                                                    )
                                                },
                                                {
                                                    accessorKey: 'sl',
                                                    header: 'SL',
                                                    cell: ({ row }) => (
                                                        <span className="badge bg-danger">{row.original.sl}</span>
                                                    )
                                                },
                                                {
                                                    accessorKey: 'el',
                                                    header: 'EL',
                                                    cell: ({ row }) => (
                                                        <span className="badge bg-info">{row.original.el}</span>
                                                    )
                                                },
                                                {
                                                    accessorKey: 'lop',
                                                    header: 'LOP',
                                                    cell: ({ row }) => (
                                                        <span className="badge bg-warning text-dark">{row.original.lop}</span>
                                                    )
                                                },
                                                {
                                                    accessorKey: 'total',
                                                    header: 'Total',
                                                    cell: ({ row }) => (
                                                        <span className="fw-bold">{row.original.total}</span>
                                                    )
                                                }
                                            ]}
                                            title={`Monthly Leave Trend - ${selectedYear}`}
                                            enableActions={false}
                                            enableSelection={false}
                                            enableExport={true}
                                            pageSize={12}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Leave Type Distribution */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold">
                                            <Icon icon="mdi:chart-pie" className="me-2 text-info" />
                                            Leave Distribution
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Casual Leave</span>
                                                <span className="fw-semibold">{Math.round((leaveStats.casualLeave / leaveStats.totalLeavesTaken) * 100)}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '10px' }}>
                                                <div className="progress-bar bg-success" style={{ width: `${(leaveStats.casualLeave / leaveStats.totalLeavesTaken) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Sick Leave</span>
                                                <span className="fw-semibold">{Math.round((leaveStats.sickLeave / leaveStats.totalLeavesTaken) * 100)}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '10px' }}>
                                                <div className="progress-bar bg-danger" style={{ width: `${(leaveStats.sickLeave / leaveStats.totalLeavesTaken) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Earned Leave</span>
                                                <span className="fw-semibold">{Math.round((leaveStats.earnedLeave / leaveStats.totalLeavesTaken) * 100)}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '10px' }}>
                                                <div className="progress-bar bg-info" style={{ width: `${(leaveStats.earnedLeave / leaveStats.totalLeavesTaken) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Loss of Pay</span>
                                                <span className="fw-semibold">{Math.round((leaveStats.lop / leaveStats.totalLeavesTaken) * 100)}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '10px' }}>
                                                <div className="progress-bar bg-warning" style={{ width: `${(leaveStats.lop / leaveStats.totalLeavesTaken) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Department-wise Analysis */}
                        <div className="card border-0 shadow-sm mt-4">
                            <div className="card-header bg-white py-3">
                                <h6 className="mb-0 fw-semibold">
                                    <Icon icon="mdi:office-building" className="me-2 text-primary" />
                                    Department-wise Leave Analysis
                                </h6>
                            </div>
                            <div className="card-body p-0">
                                <DataTable
                                    data={deptLeaveData}
                                    columns={[
                                        {
                                            accessorKey: 'department',
                                            header: 'Department',
                                            cell: ({ row }) => (
                                                <span className="fw-medium">{row.original.department}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'totalLeaves',
                                            header: 'Total',
                                            cell: ({ row }) => (
                                                <span className="fw-bold">{row.original.totalLeaves}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'cl',
                                            header: 'CL',
                                            cell: ({ row }) => (
                                                <span className="badge bg-success-subtle text-success">{row.original.cl}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'sl',
                                            header: 'SL',
                                            cell: ({ row }) => (
                                                <span className="badge bg-danger-subtle text-danger">{row.original.sl}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'el',
                                            header: 'EL',
                                            cell: ({ row }) => (
                                                <span className="badge bg-info-subtle text-info">{row.original.el}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'lop',
                                            header: 'LOP',
                                            cell: ({ row }) => (
                                                <span className="badge bg-warning-subtle text-warning">{row.original.lop}</span>
                                            )
                                        }
                                    ]}
                                    title="Department-wise Leave Analysis"
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

export default LeaveAnalysis;
