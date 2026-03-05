import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from '../../../../components/DataTable/DataTable';

const LeaveConfiguration = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [formData, setFormData] = useState({
        leave_code: '',
        leave_name: '',
        max_days_per_year: 0,
        carry_forward: false,
        is_paid: true,
        is_active: true
    });

    const defaultLeaveTypes = [
        { id: 1, leave_code: 'CL', leave_name: 'Casual Leave', max_days_per_year: 12, carry_forward: false, is_paid: true, is_active: true },
        { id: 2, leave_code: 'SL', leave_name: 'Sick Leave', max_days_per_year: 10, carry_forward: false, is_paid: true, is_active: true },
        { id: 3, leave_code: 'EL', leave_name: 'Earned Leave', max_days_per_year: 15, carry_forward: true, is_paid: true, is_active: true },
        { id: 4, leave_code: 'ML', leave_name: 'Maternity Leave', max_days_per_year: 180, carry_forward: false, is_paid: true, is_active: true },
        { id: 5, leave_code: 'PL', leave_name: 'Paternity Leave', max_days_per_year: 15, carry_forward: false, is_paid: true, is_active: true },
        { id: 6, leave_code: 'LOP', leave_name: 'Loss of Pay', max_days_per_year: 365, carry_forward: false, is_paid: false, is_active: true },
    ];

    useEffect(() => {
        setLeaveTypes(defaultLeaveTypes);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openAddModal = () => {
        setEditingType(null);
        setFormData({ leave_code: '', leave_name: '', max_days_per_year: 0, carry_forward: false, is_paid: true, is_active: true });
        setShowModal(true);
    };

    const openEditModal = (type) => {
        setEditingType(type);
        setFormData(type);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.leave_code || !formData.leave_name) {
            toast.error('Please fill all required fields');
            return;
        }
        if (editingType) {
            setLeaveTypes(prev => prev.map(lt => lt.id === editingType.id ? { ...lt, ...formData } : lt));
            toast.success('Leave type updated');
        } else {
            setLeaveTypes(prev => [...prev, { id: Date.now(), ...formData }]);
            toast.success('Leave type added');
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this leave type?')) {
            setLeaveTypes(prev => prev.filter(lt => lt.id !== id));
            toast.success('Leave type deleted');
        }
    };

    const toggleStatus = (id) => {
        setLeaveTypes(prev => prev.map(lt => lt.id === id ? { ...lt, is_active: !lt.is_active } : lt));
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
                                <Icon icon="mdi:cog" className="text-purple" style={{ fontSize: '28px' }} />
                                Leave Configuration
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Leave Configuration</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Info Card */}
                        <div className="card border-0 shadow-sm mb-4 bg-purple-subtle">
                            <div className="card-body py-3 d-flex align-items-center gap-3">
                                <Icon icon="mdi:information" className="text-purple" style={{ fontSize: '32px' }} />
                                <div>
                                    <h6 className="mb-0 fw-semibold text-purple">Leave Types Configuration</h6>
                                    <small className="text-muted">Configure leave types, yearly limits, and policies</small>
                                </div>
                                <button className="btn btn-primary ms-auto" onClick={openAddModal}>
                                    <Icon icon="mdi:plus" className="me-1" />
                                    Add Leave Type
                                </button>
                            </div>
                        </div>

                        {/* Leave Types Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <DataTable
                                    data={leaveTypes}
                                    columns={[
                                        {
                                            accessorKey: 'leave_code',
                                            header: 'Code',
                                            cell: ({ row }) => (
                                                <span className="badge bg-primary-subtle text-primary fw-bold">{row.original.leave_code}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'leave_name',
                                            header: 'Leave Type',
                                            cell: ({ row }) => (
                                                <span className="fw-medium">{row.original.leave_name}</span>
                                            )
                                        },
                                        {
                                            accessorKey: 'max_days_per_year',
                                            header: 'Max Days/Year',
                                            cell: ({ row }) => (
                                                <span className="fw-semibold">{row.original.max_days_per_year}</span>
                                            )
                                        },
                                        {
                                            id: 'carry_forward',
                                            header: 'Carry Forward',
                                            cell: ({ row }) => (
                                                row.original.carry_forward ? (
                                                    <Icon icon="mdi:check-circle" className="text-success" style={{ fontSize: '20px' }} />
                                                ) : (
                                                    <Icon icon="mdi:close-circle" className="text-muted" style={{ fontSize: '20px' }} />
                                                )
                                            ),
                                            enableSorting: false
                                        },
                                        {
                                            id: 'is_paid',
                                            header: 'Paid',
                                            cell: ({ row }) => (
                                                <span className={`badge ${row.original.is_paid ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                    {row.original.is_paid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            )
                                        },
                                        {
                                            id: 'status',
                                            header: 'Status',
                                            cell: ({ row }) => (
                                                <div className="form-check form-switch d-flex justify-content-center">
                                                    <input className="form-check-input" type="checkbox" checked={row.original.is_active} onChange={() => toggleStatus(row.original.id)} style={{ width: '40px', height: '20px' }} />
                                                </div>
                                            ),
                                            enableSorting: false
                                        },
                                        {
                                            id: 'actions',
                                            header: 'Actions',
                                            cell: ({ row }) => (
                                                <>
                                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditModal(row.original)}><Icon icon="mdi:pencil" /></button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row.original.id)}><Icon icon="mdi:delete" /></button>
                                                </>
                                            ),
                                            enableSorting: false
                                        }
                                    ]}
                                    title="Leave Types"
                                    enableActions={false}
                                    enableSelection={false}
                                    enableExport={true}
                                    pageSize={10}
                                />
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="row g-3 mt-4">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-success-subtle p-3">
                                            <Icon icon="mdi:calendar-check" className="text-success" style={{ fontSize: '28px' }} />
                                        </div>
                                        <div>
                                            <h4 className="mb-0 fw-bold">{leaveTypes.filter(lt => lt.is_active).length}</h4>
                                            <small className="text-muted">Active Leave Types</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-info-subtle p-3">
                                            <Icon icon="mdi:swap-horizontal" className="text-info" style={{ fontSize: '28px' }} />
                                        </div>
                                        <div>
                                            <h4 className="mb-0 fw-bold">{leaveTypes.filter(lt => lt.carry_forward).length}</h4>
                                            <small className="text-muted">Carry Forward Enabled</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-warning-subtle p-3">
                                            <Icon icon="mdi:cash" className="text-warning" style={{ fontSize: '28px' }} />
                                        </div>
                                        <div>
                                            <h4 className="mb-0 fw-bold">{leaveTypes.filter(lt => lt.is_paid).length}</h4>
                                            <small className="text-muted">Paid Leave Types</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </section>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-purple-subtle">
                                <h5 className="modal-title fw-semibold text-purple">
                                    <Icon icon={editingType ? "mdi:pencil" : "mdi:plus"} className="me-2" />
                                    {editingType ? 'Edit Leave Type' : 'Add Leave Type'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Leave Code *</label>
                                        <input type="text" className="form-control" name="leave_code" value={formData.leave_code} onChange={handleInputChange} placeholder="e.g., CL" maxLength={5} />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label fw-semibold">Leave Name *</label>
                                        <input type="text" className="form-control" name="leave_name" value={formData.leave_name} onChange={handleInputChange} placeholder="e.g., Casual Leave" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Max Days Per Year</label>
                                        <input type="number" className="form-control" name="max_days_per_year" value={formData.max_days_per_year} onChange={handleInputChange} min={0} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold d-block">Options</label>
                                        <div className="d-flex gap-4 mt-2">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="carryForward" name="carry_forward" checked={formData.carry_forward} onChange={handleInputChange} />
                                                <label className="form-check-label" htmlFor="carryForward">Carry Forward</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="isPaid" name="is_paid" checked={formData.is_paid} onChange={handleInputChange} />
                                                <label className="form-check-label" htmlFor="isPaid">Paid Leave</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    <Icon icon="mdi:content-save" className="me-1" />
                                    {editingType ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LeaveConfiguration;
