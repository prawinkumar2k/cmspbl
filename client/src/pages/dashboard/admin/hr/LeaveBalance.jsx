import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';

import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from '../../../../components/DataTable/DataTable';

const LeaveBalance = () => {
    const [employees, setEmployees] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [academicYear, setAcademicYear] = useState('2024-2025');

    useEffect(() => {
        fetchEmployees();
        fetchLeaveTypes();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/staff_master');
            const data = response.data;
            setEmployees(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get('/hr/leave-types');
            if (response.data) {
                const data = response.data;
                setLeaveTypes(data);
            } else {
                // Default leave types
                setLeaveTypes([
                    { id: 1, leave_code: 'CL', leave_name: 'Casual Leave', max_days_per_year: 12 },
                    { id: 2, leave_code: 'SL', leave_name: 'Sick Leave', max_days_per_year: 10 },
                    { id: 3, leave_code: 'EL', leave_name: 'Earned Leave', max_days_per_year: 15 },
                    { id: 4, leave_code: 'ML', leave_name: 'Maternity Leave', max_days_per_year: 180 },
                    { id: 5, leave_code: 'LOP', leave_name: 'Loss of Pay', max_days_per_year: 365 },
                ]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.Staff_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.Staff_ID?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
    };

    // Generate mock leave balance
    const generateLeaveBalance = () => {
        return leaveTypes.map(lt => ({
            ...lt,
            opening: lt.max_days_per_year,
            taken: Math.floor(Math.random() * (lt.max_days_per_year / 2)),
            adjustment: 0,
        })).map(lb => ({
            ...lb,
            balance: lb.opening - lb.taken + lb.adjustment
        }));
    };

    const leaveBalance = selectedEmployee ? generateLeaveBalance() : [];

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
                                <Icon icon="mdi:calendar-account" className="text-warning" style={{ fontSize: '28px' }} />
                                Leave Balance
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Leave Balance</li>
                                </ol>
                            </nav>
                        </div>

                        <div className="row g-4">
                            {/* Employee List */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold">
                                            <Icon icon="mdi:account-group" className="me-2" />
                                            Select Employee
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text bg-light"><Icon icon="mdi:magnify" /></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                            {loading ? (
                                                <div className="text-center py-3">
                                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                                </div>
                                            ) : (
                                                filteredEmployees.slice(0, 25).map(emp => (
                                                    <div
                                                        key={emp.Staff_ID}
                                                        className={`p-2 border-bottom ${selectedEmployee?.Staff_ID === emp.Staff_ID ? 'bg-warning-subtle rounded' : ''}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleSelectEmployee(emp)}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="bg-warning-subtle rounded-circle p-2">
                                                                <Icon icon="mdi:account" className="text-warning" />
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-medium" style={{ fontSize: '14px' }}>{emp.Staff_Name}</p>
                                                                <small className="text-muted">{emp.Staff_ID}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Leave Balance Details */}
                            <div className="col-lg-8">
                                {selectedEmployee ? (
                                    <>
                                        {/* Employee Header */}
                                        <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                                            <div className="card-body py-4 text-white">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="bg-white rounded-circle p-3">
                                                                <Icon icon="mdi:account" style={{ fontSize: '32px', color: '#f59e0b' }} />
                                                            </div>
                                                            <div>
                                                                <h5 className="mb-0 fw-bold">{selectedEmployee.Staff_Name}</h5>
                                                                <p className="mb-0 opacity-75">{selectedEmployee.Staff_ID} • {selectedEmployee.Dept_Name || 'General'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                                        <select
                                                            className="form-select form-select-sm bg-white"
                                                            value={academicYear}
                                                            onChange={(e) => setAcademicYear(e.target.value)}
                                                            style={{ maxWidth: '150px', marginLeft: 'auto' }}
                                                        >
                                                            <option>2024-2025</option>
                                                            <option>2023-2024</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Leave Balance Table */}
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-white py-3">
                                                <h6 className="mb-0 fw-semibold">
                                                    <Icon icon="mdi:calendar-check" className="me-2 text-warning" />
                                                    Leave Balance for {academicYear}
                                                </h6>
                                            </div>
                                            <div className="card-body p-0">
                                                <DataTable
                                                    data={leaveBalance}
                                                    columns={[
                                                        {
                                                            accessorKey: 'leave_name',
                                                            header: 'Leave Type',
                                                            cell: ({ row }) => (
                                                                <>
                                                                    <span className="badge bg-warning-subtle text-warning me-2">{row.original.leave_code}</span>
                                                                    <span className="fw-medium">{row.original.leave_name}</span>
                                                                </>
                                                            )
                                                        },
                                                        {
                                                            accessorKey: 'opening',
                                                            header: 'Opening Balance'
                                                        },
                                                        {
                                                            accessorKey: 'taken',
                                                            header: 'Taken',
                                                            cell: ({ row }) => (
                                                                <span className="text-danger">{row.original.taken}</span>
                                                            )
                                                        },
                                                        {
                                                            accessorKey: 'adjustment',
                                                            header: 'Adjustment'
                                                        },
                                                        {
                                                            accessorKey: 'balance',
                                                            header: 'Available Balance',
                                                            cell: ({ row }) => (
                                                                <span className={`badge ${row.original.balance > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                                                                    {row.original.balance}
                                                                </span>
                                                            )
                                                        }
                                                    ]}
                                                    title={`Leave Balance for ${academicYear}`}
                                                    enableActions={false}
                                                    enableSelection={false}
                                                    enableExport={true}
                                                    pageSize={10}
                                                />
                                            </div>
                                        </div>

                                        {/* Quick Summary Cards */}
                                        <div className="row g-3 mt-3">
                                            {leaveBalance.slice(0, 4).map((lb, idx) => (
                                                <div className="col-md-3" key={idx}>
                                                    <div className="card border-0 shadow-sm text-center">
                                                        <div className="card-body py-3">
                                                            <small className="text-muted">{lb.leave_code}</small>
                                                            <h3 className={`mb-0 fw-bold ${lb.balance > 0 ? 'text-success' : 'text-danger'}`}>{lb.balance}</h3>
                                                            <small>Available</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '450px' }}>
                                        <div className="text-center text-muted">
                                            <Icon icon="mdi:calendar-account-outline" style={{ fontSize: '64px' }} />
                                            <p className="mt-3 mb-0">Select an employee to view leave balance</p>
                                        </div>
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

export default LeaveBalance;
