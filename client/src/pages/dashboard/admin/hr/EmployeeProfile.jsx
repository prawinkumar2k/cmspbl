import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';

import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";

const EmployeeProfile = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        fetchEmployees();
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

    const filteredEmployees = employees.filter(e =>
        e.Staff_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.Staff_ID?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
        setActiveTab('personal');
    };

    // Tab panels
    const tabs = [
        { id: 'personal', label: 'Personal', icon: 'mdi:account' },
        { id: 'employment', label: 'Employment', icon: 'mdi:briefcase' },
        { id: 'salary', label: 'Salary', icon: 'mdi:cash' },
        { id: 'documents', label: 'Documents', icon: 'mdi:file-document' },
    ];

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
                                <Icon icon="mdi:account-details" className="text-primary" style={{ fontSize: '28px' }} />
                                Employee Profile
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Employee Profile</li>
                                </ol>
                            </nav>
                        </div>

                        <div className="row g-4">
                            {/* Employee List */}
                            <div className="col-lg-3">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-primary text-white py-3">
                                        <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                                            <Icon icon="mdi:account-group" style={{ fontSize: '20px' }} />
                                            Employees
                                        </h6>
                                    </div>
                                    <div className="card-body p-0">
                                        {/* Search Input */}
                                        <div className="p-3 border-bottom">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search by name, mobile, or department..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '4px',
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>

                                        {/* Employee List */}
                                        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                                </div>
                                            ) : filteredEmployees.length === 0 ? (
                                                <div className="text-center py-4 text-muted">
                                                    <Icon icon="mdi:account-search" style={{ fontSize: '32px' }} />
                                                    <p className="mb-0 mt-2" style={{ fontSize: '14px' }}>No employees found</p>
                                                </div>
                                            ) : (
                                                filteredEmployees.slice(0, 25).map(emp => (
                                                    <div
                                                        key={emp.Staff_ID}
                                                        className={`px-3 py-2 border-bottom ${selectedEmployee?.Staff_ID === emp.Staff_ID ? 'bg-primary-subtle' : ''}`}
                                                        style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                                        onClick={() => handleSelectEmployee(emp)}
                                                        onMouseEnter={(e) => {
                                                            if (selectedEmployee?.Staff_ID !== emp.Staff_ID) {
                                                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (selectedEmployee?.Staff_ID !== emp.Staff_ID) {
                                                                e.currentTarget.style.backgroundColor = '';
                                                            }
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="form-check mb-0">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    checked={selectedEmployee?.Staff_ID === emp.Staff_ID}
                                                                    onChange={() => handleSelectEmployee(emp)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </div>
                                                            <Icon icon="mdi:account" className="text-muted" style={{ fontSize: '24px' }} />
                                                            <div>
                                                                <p className="mb-0 text-primary fw-medium" style={{ fontSize: '14px' }}>
                                                                    {emp.Staff_Name}
                                                                </p>
                                                                <small className="text-muted">
                                                                    {emp.Mobile_No || emp.Staff_ID} | {emp.Dept_Name || 'N/A'}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="col-lg-9">
                                {selectedEmployee ? (
                                    <>
                                        {/* Profile Header */}
                                        <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                            <div className="card-body py-4 text-white">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="bg-white rounded-circle p-3">
                                                                <Icon icon="mdi:account" style={{ fontSize: '40px', color: '#667eea' }} />
                                                            </div>
                                                            <div>
                                                                <h4 className="mb-0 fw-bold">{selectedEmployee.Staff_Name}</h4>
                                                                <p className="mb-0 opacity-75">{selectedEmployee.Designation || 'Staff Member'}</p>
                                                                <small className="opacity-75">ID: {selectedEmployee.Staff_ID} | Dept: {selectedEmployee.Dept_Name || 'General'}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                                        <span className="badge bg-white text-success fs-6 px-3 py-2">
                                                            <Icon icon="mdi:check-circle" className="me-1" />
                                                            Active
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tabs */}
                                        <ul className="nav nav-pills mb-4">
                                            {tabs.map(tab => (
                                                <li className="nav-item" key={tab.id}>
                                                    <button
                                                        className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                                        onClick={() => setActiveTab(tab.id)}
                                                    >
                                                        <Icon icon={tab.icon} className="me-1" />
                                                        {tab.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Tab Content */}
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body">
                                                {activeTab === 'personal' && (
                                                    <div className="row g-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Full Name</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Staff_Name}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Employee ID</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Staff_ID}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Email</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Email_ID || 'Not provided'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Phone</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Mobile_No || 'Not provided'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Date of Birth</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.DOB || 'Not provided'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Gender</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Gender || 'Not provided'}</p>
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label text-muted small">Address</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Address || 'Not provided'}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {activeTab === 'employment' && (
                                                    <div className="row g-4">
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Department</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Dept_Name || 'Not assigned'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Designation</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Designation || 'Not assigned'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Joining Date</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Joining_Date || 'Not provided'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Employment Type</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Employment_Type || 'Regular'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Reporting Manager</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Reporting_Manager || 'Not assigned'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label text-muted small">Work Location</label>
                                                            <p className="fw-semibold mb-0">{selectedEmployee.Work_Location || 'Main Campus'}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {activeTab === 'salary' && (
                                                    <div className="row g-4">
                                                        <div className="col-md-6">
                                                            <div className="card bg-success-subtle border-0">
                                                                <div className="card-body py-3">
                                                                    <small className="text-muted">Basic Salary</small>
                                                                    <h4 className="fw-bold text-success mb-0">₹25,000</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="card bg-primary-subtle border-0">
                                                                <div className="card-body py-3">
                                                                    <small className="text-muted">Net Salary</small>
                                                                    <h4 className="fw-bold text-primary mb-0">₹42,500</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <p className="text-muted">
                                                                <Icon icon="mdi:information" className="me-1" />
                                                                For detailed salary structure, visit <a href="/hr/salary-structure">Salary Structure</a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {activeTab === 'documents' && (
                                                    <div className="row g-3">
                                                        {['Aadhar Card', 'PAN Card', 'Resume', 'Offer Letter', 'ID Proof'].map((doc, idx) => (
                                                            <div className="col-md-6 col-lg-4" key={idx}>
                                                                <div className="border rounded p-3 d-flex align-items-center gap-3">
                                                                    <div className="bg-primary-subtle rounded p-2">
                                                                        <Icon icon="mdi:file-document" className="text-primary" style={{ fontSize: '24px' }} />
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <p className="mb-0 fw-medium">{doc}</p>
                                                                        <small className="text-muted">Uploaded</small>
                                                                    </div>
                                                                    <button className="btn btn-sm btn-outline-primary"><Icon icon="mdi:download" /></button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '500px' }}>
                                        <div className="text-center text-muted">
                                            <Icon icon="mdi:account-search" style={{ fontSize: '64px' }} />
                                            <p className="mt-3 mb-0">Select an employee to view profile</p>
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

export default EmployeeProfile;
