import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';

import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from '../../../../components/DataTable/DataTable';

const EmployeeReports = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [reportType, setReportType] = useState('all');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/staff_master');
            const data = response.data;
            setEmployees(data || []);
            const depts = [...new Set(data.map(e => e.Dept_Name).filter(Boolean))];
            setDepartments(depts);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchSearch = !searchTerm ||
            emp.Staff_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.Staff_ID?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = !selectedDept || emp.Dept_Name === selectedDept;
        const matchStatus = !selectedStatus ||
            (selectedStatus === 'Active' && !emp.Reliving_Date) ||
            (selectedStatus === 'Inactive' && emp.Reliving_Date);
        return matchSearch && matchDept && matchStatus;
    });

    const stats = {
        total: employees.length,
        active: employees.filter(e => !e.Reliving_Date).length,
        inactive: employees.filter(e => e.Reliving_Date).length,
        departments: departments.length
    };

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
                                <Icon icon="mdi:file-account" className="text-primary" style={{ fontSize: '28px' }} />
                                Employee Reports
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Employee Reports</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Stats Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-primary-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-primary mb-0">{stats.total}</h4>
                                        <small>Total Employees</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-success-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-success mb-0">{stats.active}</h4>
                                        <small>Active</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-danger-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-danger mb-0">{stats.inactive}</h4>
                                        <small>Inactive</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm bg-info-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-info mb-0">{stats.departments}</h4>
                                        <small>Departments</small>
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
                                        <label className="form-label fw-semibold mb-1">Department</label>
                                        <select
                                            className="form-select"
                                            value={selectedDept}
                                            onChange={(e) => setSelectedDept(e.target.value)}
                                        >
                                            <option value="">All</option>
                                            {departments.map((d, i) => (
                                                <option key={i} value={d}>{d}</option>
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
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold mb-1">Report Type</label>
                                        <select
                                            className="form-select"
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                        >
                                            <option value="all">All Employees</option>
                                            <option value="new">New Joiners</option>
                                            <option value="relieved">Relieved</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 text-end">
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

                        {/* Employee Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 fw-semibold">Employee List ({filteredEmployees.length})</h6>
                                <button className="btn btn-sm btn-outline-primary">
                                    <Icon icon="mdi:printer" className="me-1" /> Print
                                </button>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : (
                                    <DataTable
                                        data={filteredEmployees}
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
                                                accessorKey: 'Dept_Name',
                                                header: 'Department',
                                                cell: ({ row }) => row.original.Dept_Name || '-'
                                            },
                                            {
                                                accessorKey: 'Designation_Name',
                                                header: 'Designation',
                                                cell: ({ row }) => row.original.Designation_Name || '-'
                                            },
                                            {
                                                accessorKey: 'Date_of_Join',
                                                header: 'Join Date',
                                                cell: ({ row }) => row.original.Date_of_Join || '-'
                                            },
                                            {
                                                accessorKey: 'Mobile_Number',
                                                header: 'Contact',
                                                cell: ({ row }) => row.original.Mobile_Number || '-'
                                            },
                                            {
                                                accessorKey: 'status',
                                                header: 'Status',
                                                cell: ({ row }) => (
                                                    <span className={`badge ${!row.original.Reliving_Date ? 'bg-success' : 'bg-danger'}`}>
                                                        {!row.original.Reliving_Date ? 'Active' : 'Inactive'}
                                                    </span>
                                                )
                                            }
                                        ]}
                                        loading={loading}
                                        title={`Employee List (${filteredEmployees.length})`}
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

export default EmployeeReports;
