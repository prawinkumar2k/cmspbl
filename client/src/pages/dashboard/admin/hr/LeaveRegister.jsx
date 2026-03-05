import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import axios from 'axios';
import api from '../../../../utils/api';
import DataTable from '../../../../components/DataTable/DataTable';

const LeaveRegister = () => {
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeaveRecords();
    }, [selectedYear, selectedMonth, selectedStatus]);

    const fetchLeaveRecords = async () => {
        setLoading(true);
        // OFFLINE MODE: prevent 404 console errors
        // Directly use mock data instead of calling API
        setLeaveRecords(generateMockData());
        setLoading(false);

        /* 
        // Original Backend Connection Logic (Uncomment when server is restarted)
        try {
            const response = await api.get('/hr/leave-requests');
            const data = Array.isArray(response.data) ? response.data : [];
            setLeaveRecords(data);
        } catch (error) {
            console.error('Error fetching leave records:', error);
            setLeaveRecords(generateMockData());
        } finally {
            setLoading(false);
        }
        */
    };

    const generateMockData = () => {
        const statuses = ['Approved', 'Pending', 'Rejected'];
        const leaveTypes = ['CL', 'SL', 'EL', 'LOP'];
        const names = ['John Smith', 'Sarah Johnson', 'Mike Brown', 'Emily Davis', 'David Wilson'];

        return Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            staff_id: `EMP${String(1000 + i).padStart(4, '0')}`,
            staff_name: names[i % names.length],
            leave_type: leaveTypes[i % leaveTypes.length],
            from_date: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
            to_date: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 3).padStart(2, '0')}`,
            days: Math.floor(Math.random() * 5) + 1,
            status: statuses[i % statuses.length],
            reason: 'Personal work / Medical / Family function',
            applied_on: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
        }));
    };

    const filteredRecords = leaveRecords.filter(record => {
        const matchSearch = !searchTerm ||
            record.staff_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.staff_id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !selectedStatus || record.status === selectedStatus;
        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        const classes = {
            'Approved': 'bg-success',
            'Pending': 'bg-warning text-dark',
            'Rejected': 'bg-danger'
        };
        return <span className={`badge ${classes[status] || 'bg-secondary'}`}>{status}</span>;
    };

    const stats = {
        total: leaveRecords.length,
        approved: leaveRecords.filter(r => r.status === 'Approved').length,
        pending: leaveRecords.filter(r => r.status === 'Pending').length,
        rejected: leaveRecords.filter(r => r.status === 'Rejected').length
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
                                <Icon icon="mdi:book-open-page-variant" className="text-info" style={{ fontSize: '28px' }} />
                                Leave Register
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Leave Register</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Stats Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-primary-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-primary mb-0">{stats.total}</h4>
                                        <small>Total Requests</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-success-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-success mb-0">{stats.approved}</h4>
                                        <small>Approved</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-warning-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-warning mb-0">{stats.pending}</h4>
                                        <small>Pending</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-danger-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-danger mb-0">{stats.rejected}</h4>
                                        <small>Rejected</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body py-3">
                                <div className="row g-3 align-items-end">
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold mb-1">Search</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><Icon icon="mdi:magnify" /></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name or ID..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
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
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold mb-1">Month</label>
                                        <select
                                            className="form-select"
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                        >
                                            <option value="">All</option>
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                                <option key={i} value={i + 1}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold mb-1">Status</label>
                                        <select
                                            className="form-select"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <option value="">All</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <button className="btn btn-outline-success">
                                            <Icon icon="mdi:file-excel" className="me-1" /> Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leave Records Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3">
                                <h6 className="mb-0 fw-semibold">Leave Records - {selectedYear}</h6>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : (
                                    <DataTable
                                        data={filteredRecords}
                                        columns={[
                                            {
                                                accessorKey: 'staff_id',
                                                header: 'Staff ID',
                                                cell: ({ row }) => (
                                                    <span className="badge bg-light text-dark">{row.original.staff_id}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'staff_name',
                                                header: 'Name',
                                                cell: ({ row }) => (
                                                    <span className="fw-medium">{row.original.staff_name}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'leave_type',
                                                header: 'Type',
                                                cell: ({ row }) => (
                                                    <span className="badge bg-info-subtle text-info">{row.original.leave_type}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'from_date',
                                                header: 'From'
                                            },
                                            {
                                                accessorKey: 'to_date',
                                                header: 'To'
                                            },
                                            {
                                                accessorKey: 'days',
                                                header: 'Days',
                                                cell: ({ row }) => (
                                                    <span className="fw-bold">{row.original.days}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'status',
                                                header: 'Status',
                                                cell: ({ row }) => getStatusBadge(row.original.status)
                                            },
                                            {
                                                accessorKey: 'applied_on',
                                                header: 'Applied On'
                                            }
                                        ]}
                                        loading={loading}
                                        title={`Leave Records - ${selectedYear}`}
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

export default LeaveRegister;
