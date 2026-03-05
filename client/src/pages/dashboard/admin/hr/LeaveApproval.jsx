import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from '../../../../components/DataTable/DataTable';

const LeaveApproval = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState('All');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    // Mock data
    const mockRequests = [
        { id: 1, emp_id: 'EMP001', name: 'Rajesh Kumar', department: 'Computer Science', type: 'Casual Leave', from: '2026-02-05', to: '2026-02-06', days: 2, reason: 'Family function', status: 'Pending', applied: '2026-02-01' },
        { id: 2, emp_id: 'EMP002', name: 'Priya Sharma', department: 'Electronics', type: 'Sick Leave', from: '2026-02-04', to: '2026-02-04', days: 1, reason: 'Medical appointment', status: 'Pending', applied: '2026-02-02' },
        { id: 3, emp_id: 'EMP003', name: 'Amit Singh', department: 'Mechanical', type: 'Earned Leave', from: '2026-02-10', to: '2026-02-15', days: 6, reason: 'Vacation trip', status: 'Approved', applied: '2026-01-25' },
        { id: 4, emp_id: 'EMP004', name: 'Sneha Patel', department: 'Civil', type: 'Casual Leave', from: '2026-02-03', to: '2026-02-03', days: 1, reason: 'Personal work', status: 'Rejected', applied: '2026-02-01' },
    ];

    useEffect(() => {
        setTimeout(() => {
            setLeaveRequests(mockRequests);
            setLoading(false);
        }, 500);
    }, []);

    const departments = ['All', ...new Set(leaveRequests.map(r => r.department))];

    const filteredRequests = leaveRequests.filter(r => {
        const matchDept = selectedDept === 'All' || r.department === selectedDept;
        const matchTab = activeTab === 'all' || r.status.toLowerCase() === activeTab;
        return matchDept && matchTab;
    });

    const handleApprove = (id) => {
        setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        toast.success('Leave request approved');
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        setLeaveRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Rejected' } : r));
        toast.success('Leave request rejected');
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedRequest(null);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return 'bg-success';
            case 'Pending': return 'bg-warning text-dark';
            case 'Rejected': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const getLeaveTypeBadge = (type) => {
        if (type.includes('Casual')) return 'bg-primary-subtle text-primary';
        if (type.includes('Sick')) return 'bg-danger-subtle text-danger';
        if (type.includes('Earned')) return 'bg-success-subtle text-success';
        return 'bg-secondary-subtle text-secondary';
    };

    const summary = {
        pending: leaveRequests.filter(r => r.status === 'Pending').length,
        approved: leaveRequests.filter(r => r.status === 'Approved').length,
        rejected: leaveRequests.filter(r => r.status === 'Rejected').length,
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
                                <Icon icon="mdi:calendar-check" className="text-warning" style={{ fontSize: '28px' }} />
                                Leave Approval
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Leave Approval</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Summary Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm bg-warning-subtle">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-warning p-3">
                                            <Icon icon="mdi:clock-outline" className="text-white" style={{ fontSize: '24px' }} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-warning mb-0">{summary.pending}</h4>
                                            <small>Pending Requests</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm bg-success-subtle">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-success p-3">
                                            <Icon icon="mdi:check-circle" className="text-white" style={{ fontSize: '24px' }} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-success mb-0">{summary.approved}</h4>
                                            <small>Approved</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm bg-danger-subtle">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-danger p-3">
                                            <Icon icon="mdi:close-circle" className="text-white" style={{ fontSize: '24px' }} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-danger mb-0">{summary.rejected}</h4>
                                            <small>Rejected</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters & Tabs */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <ul className="nav nav-pills">
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                                                    Pending ({summary.pending})
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                                                    All Leaves
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3 ms-auto">
                                        <select className="form-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leave Requests Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : (
                                    <DataTable
                                        data={filteredRequests}
                                        columns={[
                                            {
                                                accessorKey: 'name',
                                                header: 'Employee',
                                                cell: ({ row }) => (
                                                    <div>
                                                        <p className="mb-0 fw-medium">{row.original.name}</p>
                                                        <small className="text-muted">{row.original.emp_id} • {row.original.department}</small>
                                                    </div>
                                                )
                                            },
                                            {
                                                accessorKey: 'type',
                                                header: 'Leave Type',
                                                cell: ({ row }) => (
                                                    <span className={`badge ${getLeaveTypeBadge(row.original.type)}`}>{row.original.type}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'from',
                                                header: 'From',
                                                cell: ({ row }) => new Date(row.original.from).toLocaleDateString('en-IN')
                                            },
                                            {
                                                accessorKey: 'to',
                                                header: 'To',
                                                cell: ({ row }) => new Date(row.original.to).toLocaleDateString('en-IN')
                                            },
                                            {
                                                accessorKey: 'days',
                                                header: 'Days',
                                                cell: ({ row }) => (
                                                    <span className="fw-semibold">{row.original.days}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'reason',
                                                header: 'Reason',
                                                cell: ({ row }) => (
                                                    <span style={{ maxWidth: '200px', display: 'block' }}>{row.original.reason}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'status',
                                                header: 'Status',
                                                cell: ({ row }) => (
                                                    <span className={`badge ${getStatusBadge(row.original.status)}`}>{row.original.status}</span>
                                                )
                                            },
                                            {
                                                id: 'actions',
                                                header: 'Actions',
                                                cell: ({ row }) => (
                                                    row.original.status === 'Pending' && (
                                                        <>
                                                            <button className="btn btn-sm btn-success me-1" onClick={() => handleApprove(row.original.id)} title="Approve">
                                                                <Icon icon="mdi:check" />
                                                            </button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => { setSelectedRequest(row.original); setShowRejectModal(true); }} title="Reject">
                                                                <Icon icon="mdi:close" />
                                                            </button>
                                                        </>
                                                    )
                                                ),
                                                enableSorting: false
                                            }
                                        ]}
                                        loading={loading}
                                        title="Leave Requests"
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

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-danger-subtle">
                                <h5 className="modal-title fw-semibold text-danger">
                                    <Icon icon="mdi:close-circle" className="me-2" />
                                    Reject Leave Request
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Rejecting leave request for <strong>{selectedRequest?.name}</strong></p>
                                <label className="form-label fw-semibold">Reason for Rejection *</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter reason..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleReject}>Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LeaveApproval;
