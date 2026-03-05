import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../../../utils/api';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import Select from 'react-select';

const Placement = () => {
    // Form state
    const [formData, setFormData] = useState({
        id: null,
        register_number: '',
        student_name: '',
        dept_name: '',
        dept_code: '',
        semester: '',
        year: '',
        regulation: '',
        academic_year: '',
        company_name: '',
        company_location: '',
        package_level: ''
    });

    // Data state
    const [registerNumbers, setRegisterNumbers] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);

    // Autocomplete state (removed redundant ones)

    // Fetch register numbers on mount
    useEffect(() => {
        fetchRegisterNumbers();
        fetchPlacements();
    }, []);

    const fetchRegisterNumbers = async () => {
        try {
            const response = await api.get('/placement/register-numbers');
            if (!response.data) throw new Error('Failed to fetch register numbers');
            const data = response.data;
            setRegisterNumbers(data);
        } catch (error) {
            console.error('Error fetching register numbers:', error);
            toast.error('Failed to load register numbers');
        }
    };

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            const response = await api.get('/placement');
            if (!response.data) throw new Error('Failed to fetch placements');
            const data = response.data;
            setPlacements(data);
        } catch (error) {
            console.error('Error fetching placements:', error);
            toast.error('Failed to load placements');
        } finally {
            setLoading(false);
        }
    };

    // Register number options for react-select
    const registerOptions = useMemo(() => {
        return registerNumbers.map(item => ({
            value: item.Register_Number,
            label: item.Register_Number
        }));
    }, [registerNumbers]);

    // Handle register number selection
    const handleRegisterSelect = async (selectedOption) => {
        const registerNumber = selectedOption ? selectedOption.value : '';
        if (!registerNumber) {
            handleCancel();
            return;
        }

        try {
            const response = await api.get(`/placement/student/${registerNumber}`);
            if (!response.data) throw new Error('Student not found');

            const studentData = response.data;
            setFormData(prev => ({
                ...prev,
                register_number: studentData.register_number || '',
                student_name: studentData.student_name || '',
                dept_name: studentData.dept_name || '',
                dept_code: studentData.dept_code || '',
                semester: studentData.semester || '',
                year: studentData.year || '',
                regulation: studentData.regulation || '',
                academic_year: studentData.academic_year || ''
            }));
            toast.success('Student details loaded');
        } catch (error) {
            console.error('Error fetching student details:', error);
            toast.error('Failed to load student details');
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle save
    const handleSave = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.register_number || !formData.student_name || !formData.company_name) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const url = formData.id ? `/placement/${formData.id}` : '/placement';
            const method = formData.id ? 'PUT' : 'POST';

            const response = await api({
                url,
                method,
                data: formData
            });

            if (!response.data) throw new Error('Failed to save placement');

            const result = response.data;
            toast.success(result.message || 'Placement saved successfully');

            // Reset form and refresh data
            handleCancel();
            fetchPlacements();
        } catch (error) {
            console.error('Error saving placement:', error);
            toast.error('Failed to save placement');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit
    const handleEdit = (placement) => {
        setFormData({
            id: placement.id,
            register_number: placement.register_number || '',
            student_name: placement.student_name || '',
            dept_name: placement.dept_name || '',
            dept_code: placement.dept_code || '',
            semester: placement.semester || '',
            year: placement.year || '',
            regulation: placement.regulation || '',
            academic_year: placement.academic_year || '',
            company_name: placement.company_name || '',
            company_location: placement.company_location || '',
            package_level: placement.package_level || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info(`Editing placement for ${placement.student_name}`);
    };

    // Handle delete
    const handleDelete = (placement) => {
        toast(
            (t) => (
                <div className="d-flex gap-3">
                    <div className="flex-grow-1">
                        <p className="mb-2 fw-semibold">Are you sure you want to delete this placement record?</p>
                        <p className="mb-3 text-muted small">{placement.student_name} - {placement.company_name}</p>
                        <div className="d-flex gap-2 justify-content-end">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => toast.dismiss(t.id)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={async () => {
                                    toast.dismiss(t.id);
                                    try {
                                        const response = await api.delete(`/placement/${placement.id}`);
                                        if (!response.data) throw new Error('Failed to delete');
                                        toast.success('Placement deleted successfully');
                                        fetchPlacements();
                                    } catch (error) {
                                        console.error('Error deleting placement:', error);
                                        toast.error('Failed to delete placement');
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                style: {
                    background: '#fff',
                    color: '#000',
                    minWidth: '400px',
                    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                },
            }
        );
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            id: null,
            register_number: '',
            student_name: '',
            dept_name: '',
            dept_code: '',
            semester: '',
            year: '',
            regulation: '',
            academic_year: '',
            company_name: '',
            company_location: '',
            package_level: ''
        });
    };

    // Define table columns
    const columns = useMemo(() => [
        {
            accessorKey: 'sno',
            header: 'S.No',
            cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
        },
        {
            accessorKey: 'register_number',
            header: 'Register No',
            cell: ({ row }) => <div className="fw-medium">{row.original.register_number}</div>
        },
        {
            accessorKey: 'student_name',
            header: 'Student Name',
            cell: ({ row }) => <div>{row.original.student_name}</div>
        },
        {
            accessorKey: 'dept_name',
            header: 'Department',
            cell: ({ row }) => <div>{row.original.dept_name}</div>
        },
        {
            accessorKey: 'semester',
            header: 'Semester',
            cell: ({ row }) => <div className="text-center">{row.original.semester}</div>
        },
        {
            accessorKey: 'academic_year',
            header: 'Academic Year',
            cell: ({ row }) => <div className="text-center">{row.original.academic_year}</div>
        },
        {
            accessorKey: 'company_name',
            header: 'Company Name',
            cell: ({ row }) => <div className="fw-semibold text-primary">{row.original.company_name}</div>
        },
        {
            accessorKey: 'company_location',
            header: 'Location',
            cell: ({ row }) => <div>{row.original.company_location}</div>
        },
        {
            accessorKey: 'package_level',
            header: 'Package',
            cell: ({ row }) => <div className="fw-medium text-success">{row.original.package_level}</div>
        }
    ], []);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        {/* Breadcrumb */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-0">Placement Management</h6>
                        </div>

                        {/* Form Card */}
                        <div className="card mb-4">
                            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                                <div>
                                    <h6 className="text-lg fw-semibold mb-2">{formData.id ? 'Edit Placement' : 'Add Placement'}</h6>
                                    <span className="text-sm fw-medium text-secondary-light">
                                        Fill all the fields below to {formData.id ? 'update' : 'add'} placement information
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={`btn btn-sm ${showTable ? 'btn-outline-success' : 'btn-outline-info'}`}
                                    onClick={() => setShowTable(prev => !prev)}
                                >
                                    <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                                    {showTable ? 'Hide Table' : 'View Placements'}
                                </button>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSave}>
                                    <div className="row g-3">
                                        {/* Register Number - Autocomplete */}
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label className="form-label fw-semibold">
                                                Register Number <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                options={registerOptions}
                                                value={formData.register_number ? { value: formData.register_number, label: formData.register_number } : null}
                                                onChange={handleRegisterSelect}
                                                placeholder="Search register number..."
                                                isClearable
                                                isDisabled={formData.id !== null}
                                                classNamePrefix="react-select"
                                                required
                                            />
                                        </div>

                                        {/* Student Name - Read Only */}
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label className="form-label fw-semibold">Student Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="student_name"
                                                value={formData.student_name}
                                                readOnly
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                        {/* Department Name - Read Only */}
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label className="form-label fw-semibold">Department Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="dept_name"
                                                value={formData.dept_name}
                                                readOnly
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                        {/* Department Code - Read Only */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">Department Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="dept_code"
                                                value={formData.dept_code}
                                                readOnly
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                        {/* Semester - Read Only */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">Semester</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="semester"
                                                value={formData.semester}
                                                readOnly
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                        {/* Year - Read Only */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">Year</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="year"
                                                value={formData.year}
                                                readOnly
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                        {/* Regulation - Read Only */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">Regulation</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="regulation"
                                                value={formData.regulation}
                                                readOnly
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                        {/* Academic Year - Read Only */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">Academic Year</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="academic_year"
                                                value={formData.academic_year}
                                                readOnly
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                        {/* Company Name - Editable */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">
                                                Company Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="company_name"
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                placeholder="Enter company name"
                                                required
                                            />
                                        </div>

                                        {/* Company Location - Editable */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">Company Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="company_location"
                                                value={formData.company_location}
                                                onChange={handleInputChange}
                                                placeholder="Enter company location"
                                            />
                                        </div>

                                        {/* Package Level - Editable */}
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <label className="form-label fw-semibold">Package Level</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="package_level"
                                                value={formData.package_level}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 5 LPA"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="col-12">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary radius-8 px-20 py-11"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-outline-primary radius-8 px-20 py-11"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Saving...' : formData.id ? 'Update' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Data Table */}
                        {showTable && (
                            <DataTable
                                data={placements}
                                columns={columns}
                                loading={loading}
                                title="Placement Records"
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                enableExport={true}
                                enableSelection={false}
                                enableActions={true}
                            />
                        )}
                    </div>
                    <Footer />
                </div>
            </section>
        </>
    );
};

export default Placement;
