import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';

import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";

const StaffDocuments = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [subjectAllocations, setSubjectAllocations] = useState([]);
    const [allocLoading, setAllocLoading] = useState(false);

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
            toast.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjectAllocations = async (staffId) => {
        setAllocLoading(true);
        try {
            const response = await api.get('/subject_allocation');
            const data = response.data;
            // Filter allocations for selected staff
            const staffAllocations = data.filter(a => a.Staff_Id === staffId);
            setSubjectAllocations(staffAllocations);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch subject allocations');
        } finally {
            setAllocLoading(false);
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.Staff_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.Staff_ID?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
        fetchSubjectAllocations(emp.Staff_ID);
    };

    // Extract subjects from allocation
    const getSubjectsFromAllocation = (alloc) => {
        const subjects = [];
        for (let i = 1; i <= 7; i++) {
            const name = alloc[`Sub${i}_Name`];
            const code = alloc[`Sub${i}_Code`];
            const deptName = alloc[`Sub${i}_Dept_Name`];
            const semester = alloc[`Sub${i}_Semester`];
            const regulation = alloc[`Sub${i}_Regulation`];
            if (name && name.trim()) {
                subjects.push({ name, code, deptName, semester, regulation });
            }
        }
        return subjects;
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
                                <Icon icon="mdi:file-document-multiple" className="text-primary" style={{ fontSize: '28px' }} />
                                Staff Documents - Subject Allocation
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Staff Documents</li>
                                </ol>
                            </nav>
                        </div>

                        <div className="row g-4">
                            {/* Staff List */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold">
                                            <Icon icon="mdi:account-group" className="me-2" />
                                            Staff List
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text bg-light"><Icon icon="mdi:magnify" /></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search staff..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                            {loading ? (
                                                <div className="text-center py-3">
                                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                                </div>
                                            ) : (
                                                filteredEmployees.slice(0, 30).map(emp => (
                                                    <div
                                                        key={emp.Staff_ID}
                                                        className={`p-3 border-bottom ${selectedEmployee?.Staff_ID === emp.Staff_ID ? 'bg-primary-subtle rounded' : ''}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleSelectEmployee(emp)}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="bg-primary-subtle rounded-circle p-2">
                                                                <Icon icon="mdi:account" className="text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-medium">{emp.Staff_Name}</p>
                                                                <small className="text-muted">{emp.Staff_ID} • {emp.Dept_Name || 'N/A'}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subject Allocation Details */}
                            <div className="col-lg-8">
                                {selectedEmployee ? (
                                    <>
                                        {/* Staff Info Header */}
                                        <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                            <div className="card-body py-4 text-white">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-white rounded-circle p-3">
                                                        <Icon icon="mdi:account" style={{ fontSize: '32px', color: '#667eea' }} />
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-0 fw-bold">{selectedEmployee.Staff_Name}</h5>
                                                        <p className="mb-0 opacity-75">
                                                            {selectedEmployee.Staff_ID} • {selectedEmployee.Designation || 'Staff'} • {selectedEmployee.Dept_Name || 'General'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject Allocations */}
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0 fw-semibold">
                                                    <Icon icon="mdi:book-education" className="me-2 text-primary" />
                                                    Subject Allocations
                                                </h6>
                                                <span className="badge bg-primary">{subjectAllocations.length} Allocation(s)</span>
                                            </div>
                                            <div className="card-body">
                                                {allocLoading ? (
                                                    <div className="text-center py-5">
                                                        <div className="spinner-border text-primary"></div>
                                                        <p className="mt-2 text-muted">Loading allocations...</p>
                                                    </div>
                                                ) : subjectAllocations.length === 0 ? (
                                                    <div className="text-center py-5 text-muted">
                                                        <Icon icon="mdi:book-off" style={{ fontSize: '48px' }} />
                                                        <p className="mt-2">No subject allocations found for this staff</p>
                                                    </div>
                                                ) : (
                                                    subjectAllocations.map((alloc, idx) => (
                                                        <div key={alloc.Id || idx} className="mb-4">
                                                            {/* Allocation Header */}
                                                            <div className="bg-light rounded p-3 mb-3">
                                                                <div className="row">
                                                                    <div className="col-md-3">
                                                                        <small className="text-muted">Academic Year</small>
                                                                        <p className="mb-0 fw-semibold">{alloc.Academic_Year || '-'}</p>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <small className="text-muted">Course</small>
                                                                        <p className="mb-0 fw-semibold">{alloc.Course_Name || '-'}</p>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <small className="text-muted">Department</small>
                                                                        <p className="mb-0 fw-semibold">{alloc.Dept_Name || '-'}</p>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <small className="text-muted">Semester</small>
                                                                        <p className="mb-0 fw-semibold">{alloc.Semester || '-'} ({alloc.Sem_Type || '-'})</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Subjects Table */}
                                                            <div className="table-responsive">
                                                                <table className="table table-bordered table-hover mb-0">
                                                                    <thead className="table-light">
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Subject Code</th>
                                                                            <th>Subject Name</th>
                                                                            <th>Department</th>
                                                                            <th>Semester</th>
                                                                            <th>Regulation</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {getSubjectsFromAllocation(alloc).map((sub, sIdx) => (
                                                                            <tr key={sIdx}>
                                                                                <td>{sIdx + 1}</td>
                                                                                <td><span className="badge bg-primary-subtle text-primary">{sub.code}</span></td>
                                                                                <td className="fw-medium">{sub.name}</td>
                                                                                <td>{sub.deptName || alloc.Dept_Name}</td>
                                                                                <td>{sub.semester || alloc.Semester}</td>
                                                                                <td>{sub.regulation || alloc.Regulation}</td>
                                                                            </tr>
                                                                        ))}
                                                                        {getSubjectsFromAllocation(alloc).length === 0 && (
                                                                            <tr>
                                                                                <td colSpan="6" className="text-center text-muted py-3">No subjects assigned</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {idx < subjectAllocations.length - 1 && <hr className="my-4" />}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* Staff Documents Section */}
                                        <div className="card border-0 shadow-sm mt-4">
                                            <div className="card-header bg-white py-3">
                                                <h6 className="mb-0 fw-semibold">
                                                    <Icon icon="mdi:folder-account" className="me-2 text-success" />
                                                    Staff Documents
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    {['Resume', 'ID Proof', 'Experience Certificate', 'Qualification Certificate', 'Joining Letter'].map((doc, idx) => (
                                                        <div className="col-md-4" key={idx}>
                                                            <div className="border rounded p-3 d-flex align-items-center gap-3 hover-shadow" style={{ cursor: 'pointer' }}>
                                                                <div className="bg-success-subtle rounded p-2">
                                                                    <Icon icon="mdi:file-document" className="text-success" style={{ fontSize: '24px' }} />
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <p className="mb-0 fw-medium">{doc}</p>
                                                                    <small className="text-muted">View/Upload</small>
                                                                </div>
                                                                <Icon icon="mdi:chevron-right" className="text-muted" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '500px' }}>
                                        <div className="text-center text-muted">
                                            <Icon icon="mdi:file-document-multiple-outline" style={{ fontSize: '64px' }} />
                                            <p className="mt-3 mb-0">Select a staff member to view subject allocations and documents</p>
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

export default StaffDocuments;
