import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';

// Styles for number input without spinner
const styles = `
  input.no-spinner::-webkit-outer-spin-button,
  input.no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.no-spinner[type=number] {
    -moz-appearance: textfield;
  }
`;

// Logo and watermark
const LOGO_SRC = '/assets/images/Kalam.jpg';
const WATERMARK_SRC = '/assets/images/Kalam.jpg';

const UNIVMarkEntry = () => {
    const reportRef = useRef(null);

    // Load html2pdf library dynamically
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.async = true;
        document.head.appendChild(script);

        // Inject styles for number input
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(script);
            document.head.removeChild(styleElement);
        };
    }, []);

    // Filter state
    const [filters, setFilters] = useState({
        deptName: '',
        deptCode: '',
        semester: '',
        regulation: '',
        subjectName: '',
        subjectCode: '',
        internalMinMark: '',
        externalMinMark: '',
        internalMaxMark: '',
        externalMaxMark: '',
        academicYear: ''
    });

    // Master data state
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [regulations, setRegulations] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);

    // Table state
    const [showTable, setShowTable] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch('/api/UNIVMarkEntry/departments');
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                toast.error('Failed to load departments');
            }
        };
        fetchDepartments();
    }, []);

    // Fetch semesters when department is selected
    useEffect(() => {
        const fetchSemesters = async () => {
            if (filters.deptCode) {
                try {
                    const response = await fetch(`/api/UNIVMarkEntry/semesters?deptCode=${encodeURIComponent(filters.deptCode)}`);
                    const data = await response.json();
                    setSemesters(data);
                } catch (error) {
                    console.error('Error fetching semesters:', error);
                    toast.error('Failed to load semesters');
                }
            } else {
                setSemesters([]);
            }
        };
        fetchSemesters();
    }, [filters.deptCode]);

    // Fetch regulations when department and semester are selected
    useEffect(() => {
        const fetchRegulations = async () => {
            if (filters.deptCode && filters.semester) {
                try {
                    const response = await fetch(`/api/UNIVMarkEntry/regulations?deptCode=${encodeURIComponent(filters.deptCode)}&semester=${encodeURIComponent(filters.semester)}`);
                    const data = await response.json();
                    setRegulations(data);
                } catch (error) {
                    console.error('Error fetching regulations:', error);
                    toast.error('Failed to load regulations');
                }
            } else {
                setRegulations([]);
            }
        };
        fetchRegulations();
    }, [filters.deptCode, filters.semester]);

    // Fetch subjects when all prerequisites are selected
    useEffect(() => {
        const fetchSubjects = async () => {
            if (filters.deptCode && filters.semester && filters.regulation) {
                try {
                    const response = await fetch(`/api/UNIVMarkEntry/subjects?deptCode=${encodeURIComponent(filters.deptCode)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}`);
                    const data = await response.json();
                    setSubjects(data);
                } catch (error) {
                    console.error('Error fetching subjects:', error);
                    toast.error('Failed to load subjects');
                }
            } else {
                setSubjects([]);
            }
        };
        fetchSubjects();
    }, [filters.deptCode, filters.semester, filters.regulation]);

    // Fetch academic years on mount
    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const response = await fetch('/api/UNIVMarkEntry/academic-years');
                const data = await response.json();
                setAcademicYears(data);
            } catch (error) {
                console.error('Error fetching academic years:', error);
                toast.error('Failed to load academic years');
            }
        };
        fetchAcademicYears();
    }, []);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };

            // Handle department selection - auto-fill dept code
            if (name === 'deptName') {
                const selectedDept = departments.find(d => d.deptName === value);
                newFilters.deptCode = selectedDept ? selectedDept.deptCode : '';
                // Reset dependent fields
                newFilters.semester = '';
                newFilters.regulation = '';
                newFilters.subjectName = '';
                newFilters.subjectCode = '';
                newFilters.internalMinMark = '';
                newFilters.externalMinMark = '';
                newFilters.internalMaxMark = '';
                newFilters.externalMaxMark = '';
            }

            // Handle semester selection
            if (name === 'semester') {
                // Reset dependent fields
                newFilters.regulation = '';
                newFilters.subjectName = '';
                newFilters.subjectCode = '';
                newFilters.internalMinMark = '';
                newFilters.externalMinMark = '';
                newFilters.internalMaxMark = '';
                newFilters.externalMaxMark = '';
            }

            // Handle subject selection - auto-fill subject code and marks (min for status, max for validation)
            if (name === 'subjectName') {
                const selectedSubject = subjects.find(s => s.subjectName === value);
                if (selectedSubject) {
                    newFilters.subjectCode = selectedSubject.subjectCode;
                    newFilters.internalMinMark = selectedSubject.internalMinMark;
                    newFilters.externalMinMark = selectedSubject.externalMinMark;
                    newFilters.internalMaxMark = selectedSubject.internalMaxMark;
                    newFilters.externalMaxMark = selectedSubject.externalMaxMark;
                }
            }

            return newFilters;
        });
    };

    // Handle proceed button click
    const handleProceed = async () => {
        if (
            !filters.deptCode ||
            !filters.semester ||
            !filters.regulation ||
            !filters.subjectName ||
            !filters.subjectCode ||
            !filters.academicYear
        ) {
            toast.error('Please fill all filter fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `/api/UNIVMarkEntry/students?deptCode=${encodeURIComponent(filters.deptCode)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}&academicYear=${encodeURIComponent(filters.academicYear)}&subjectCode=${encodeURIComponent(filters.subjectCode)}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const data = await response.json();

            // ✅ PRESERVE EXISTING UNIV MARKS
            const studentsWithMarks = data.map(student => ({
                ...student,
                internalMark:
                    student.internalMark !== null &&
                        student.internalMark !== undefined
                        ? String(student.internalMark)
                        : '',
                externalMark:
                    student.externalMark !== null &&
                        student.externalMark !== undefined
                        ? String(student.externalMark)
                        : '',
                attemptLevel: student.attemptLevel || ''
            }));

            setStudents(studentsWithMarks);
            setShowTable(true);
            setIsSubmitted(false);

            toast.success(`${data.length} students loaded successfully`);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
            setStudents([]);
            setShowTable(false);
        } finally {
            setLoading(false);
        }
    };

    // Handle mark entry
    const handleMarkChange = useCallback((registerNo, field, value) => {
        setStudents(prev => prev.map(student =>
            student.registerNo === registerNo
                ? { ...student, [field]: value.toUpperCase() }
                : student
        ));
    }, []);

    // Calculate total and status - memoized to prevent column recreation
    const calculateTotalAndStatus = useCallback((internalMark, externalMark) => {
        // Handle Absent case
        if (internalMark === 'A' || externalMark === 'A') {
            return { total: 'A', status: 'F' };
        }

        const internal = parseInt(internalMark) || 0;
        const external = parseInt(externalMark) || 0;
        const total = internal + external;

        const status = (internal >= parseInt(filters.internalMinMark || 0) && external >= parseInt(filters.externalMinMark || 0))
            ? 'P'
            : 'F';

        return { total, status };
    }, [filters.internalMinMark, filters.externalMinMark]);

    // Handle update marks - directly submit
    const handleUpdate = async () => {
        // Set empty marks to 0 by default
        const updatedStudents = students.map(student => ({
            ...student,
            internalMark: (student.internalMark === '' || student.internalMark === null) ? '0' : student.internalMark,
            externalMark: (student.externalMark === '' || student.externalMark === null) ? '0' : student.externalMark
        }));

        const invalidMarks = updatedStudents.some(student => {
            const internal = student.internalMark;
            const external = student.externalMark;

            // Validate internal
            if (internal !== 'A') {
                const val = parseInt(internal);
                if (isNaN(val) || val < 0 || val > parseInt(filters.internalMaxMark)) return true;
            }

            // Validate external
            if (external !== 'A') {
                const val = parseInt(external);
                if (isNaN(val) || val < 0 || val > parseInt(filters.externalMaxMark)) return true;
            }

            return false;
        });

        if (invalidMarks) {
            toast.error(`Please enter valid marks or 'A' for Absent. (Internal max: ${filters.internalMaxMark}, External max: ${filters.externalMaxMark})`);
            return;
        }

        // Submit marks directly
        await submitMarks(updatedStudents);
    };

    // Submit marks function
    const submitMarks = async (marksData) => {
        try {
            const marksToSubmit = marksData.map(student => ({
                registerNo: student.registerNo,
                studentName: student.studentName,
                internalMark: student.internalMark,
                externalMark: student.externalMark,
                attemptLevel: student.attemptLevel
            }));

            const response = await fetch('/api/UNIVMarkEntry/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deptCode: filters.deptCode,
                    semester: filters.semester,
                    regulation: filters.regulation,
                    subjectCode: filters.subjectCode,
                    subjectName: filters.subjectName,
                    academicYear: filters.academicYear,
                    enteredBy: 'Admin',
                    marks: marksToSubmit
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save marks');
            }

            const result = await response.json();
            setIsSubmitted(true);
            toast.success(result.message);

            // Reset form after submission
            setTimeout(() => {
                setShowTable(false);
                setStudents([]);
                setFilters({
                    deptName: '',
                    deptCode: '',
                    semester: '',
                    regulation: '',
                    subjectName: '',
                    subjectCode: '',
                    internalMinMark: '',
                    externalMinMark: '',
                    academicYear: ''
                });
            }, 2000);
        } catch (error) {
            console.error('Error submitting marks:', error);
            toast.error(error.message || 'Failed to submit marks');
        }
    };

    // Define table columns
    const columns = React.useMemo(() => [
        {
            accessorKey: 'sno',
            header: 'S.No',
            cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
        },
        {
            accessorKey: 'registerNo',
            header: 'Register No',
            cell: ({ row }) => <div className="fw-medium">{row.original.registerNo}</div>,
        },
        {
            accessorKey: 'studentName',
            header: 'Student Name',
            cell: ({ row }) => <div className="fw-medium">{row.original.studentName}</div>,
        },
        {
            accessorKey: 'internalMark',
            header: 'Internal Mark',
            cell: ({ row }) => {
                const handleInputChange = (e) => {
                    const value = e.target.value;

                    // Allow empty string or 'A'
                    if (value === '' || value.toUpperCase() === 'A') {
                        handleMarkChange(row.original.registerNo, 'internalMark', value.toUpperCase());
                        return;
                    }

                    const numValue = parseFloat(value);
                    const maxInternalMark = parseInt(filters.internalMaxMark, 10);

                    if (!isNaN(numValue)) {
                        if (numValue < 0) {
                            toast.error('Internal mark cannot be negative');
                            return;
                        }
                        if (numValue > maxInternalMark) {
                            toast.error(`Internal mark cannot exceed ${maxInternalMark}`);
                            return;
                        }
                        handleMarkChange(row.original.registerNo, 'internalMark', value);
                    }
                };

                return (
                    <input
                        type="text"
                        value={row.original.internalMark}
                        onChange={handleInputChange}
                        placeholder="0-max or A"
                        className="form-control form-control-sm"
                        disabled={isSubmitted}
                        style={{ width: '100px', textAlign: 'center' }}
                    />
                );
            },
        },
        {
            accessorKey: 'externalMark',
            header: 'External Mark',
            cell: ({ row }) => {
                const handleInputChange = (e) => {
                    const value = e.target.value;

                    // Allow empty string or 'A'
                    if (value === '' || value.toUpperCase() === 'A') {
                        handleMarkChange(row.original.registerNo, 'externalMark', value.toUpperCase());
                        return;
                    }

                    const numValue = parseFloat(value);
                    const maxExternalMark = parseInt(filters.externalMaxMark, 10);

                    if (!isNaN(numValue)) {
                        if (numValue < 0) {
                            toast.error('External mark cannot be negative');
                            return;
                        }
                        if (numValue > maxExternalMark) {
                            toast.error(`External mark cannot exceed ${maxExternalMark}`);
                            return;
                        }
                        handleMarkChange(row.original.registerNo, 'externalMark', value);
                    }
                };

                return (
                    <input
                        type="text"
                        value={row.original.externalMark}
                        onChange={handleInputChange}
                        placeholder="0-max or A"
                        className="form-control form-control-sm"
                        disabled={isSubmitted}
                        style={{ width: '100px', textAlign: 'center' }}
                    />
                );
            },
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => {
                const { total } = calculateTotalAndStatus(row.original.internalMark, row.original.externalMark);
                return <div className="fw-bold">{total}</div>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const { status } = calculateTotalAndStatus(row.original.internalMark, row.original.externalMark);
                return (
                    <div className={`fw-bold ${status === 'P' ? 'text-success' : 'text-danger'}`}>
                        {status}
                    </div>
                );
            },
        },
        {
            accessorKey: 'attemptLevel',
            header: 'Attempt Level',
            cell: ({ row }) => (
                <input
                    type="text"
                    value={row.original.attemptLevel}
                    onChange={(e) => handleMarkChange(row.original.registerNo, 'attemptLevel', e.target.value)}
                    className="form-control form-control-sm"
                    disabled={isSubmitted}
                    style={{ width: '100px' }}
                />
            ),
        },
    ], [isSubmitted, calculateTotalAndStatus, handleMarkChange]);

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
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                            <h6 className="fw-semibold mb-0">University Mark Entry</h6>
                        </div>

                        {/* Filter Form */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row g-3">
                                    {/* Department Name */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Department Name <span className="text-danger">*</span></label>
                                        <select
                                            name="deptName"
                                            value={filters.deptName}
                                            onChange={handleFilterChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept.deptCode} value={dept.deptName}>
                                                    {dept.deptName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Department Code (Read-only) */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Department Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={filters.deptCode}
                                            readOnly
                                        />
                                    </div>

                                    {/* Semester */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Semester <span className="text-danger">*</span></label>
                                        <select
                                            name="semester"
                                            value={filters.semester}
                                            onChange={handleFilterChange}
                                            className="form-select"
                                            disabled={!filters.deptCode}
                                            required
                                        >
                                            <option value="">
                                                {!filters.deptCode ? 'Select Department first' : 'Select Semester'}
                                            </option>
                                            {semesters.map((sem, idx) => (
                                                <option key={idx} value={sem.semester}>
                                                    {sem.semester}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Regulation */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Regulation <span className="text-danger">*</span></label>
                                        <select
                                            name="regulation"
                                            value={filters.regulation}
                                            onChange={handleFilterChange}
                                            className="form-select"
                                            disabled={!filters.semester}
                                            required
                                        >
                                            <option value="">
                                                {!filters.semester ? 'Select Semester first' : 'Select Regulation'}
                                            </option>
                                            {regulations.map((reg, idx) => (
                                                <option key={idx} value={reg.regulation}>
                                                    {reg.regulation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Subject Name */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Subject Name <span className="text-danger">*</span></label>
                                        <select
                                            name="subjectName"
                                            value={filters.subjectName}
                                            onChange={handleFilterChange}
                                            className="form-select"
                                            disabled={!filters.regulation}
                                            required
                                        >
                                            <option value="">
                                                {!filters.regulation ? 'Select Regulation first' : 'Select Subject'}
                                            </option>
                                            {subjects.map((sub, idx) => (
                                                <option key={idx} value={sub.subjectName}>
                                                    {sub.subjectName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Subject Code (Read-only) */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Subject Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={filters.subjectCode}
                                            readOnly
                                        />
                                    </div>

                                    {/* Academic Year */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Academic Year <span className="text-danger">*</span></label>
                                        <select
                                            name="academicYear"
                                            value={filters.academicYear}
                                            onChange={handleFilterChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Select Academic Year</option>
                                            {academicYears.map((year, idx) => (
                                                <option key={idx} value={year.academicYear}>
                                                    {year.academicYear}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Min Marks Display */}
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label className="form-label fw-semibold">Internal / External Min Mark</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={`${filters.internalMinMark} / ${filters.externalMinMark}`}
                                            readOnly
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="col-12">
                                        <div className="d-flex justify-content-end gap-3 mt-3 pt-3 border-top">
                                            <button
                                                onClick={handleProceed}
                                                disabled={loading || !filters.deptCode || !filters.semester || !filters.regulation || !filters.subjectName || !filters.academicYear}
                                                className="btn btn-outline-primary px-20 py-11"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Icon icon="eos-icons:loading" className="me-2" />
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon icon="material-symbols:arrow-forward" className="me-2" />
                                                        View
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Student Marks Table */}
                        {showTable && (
                            <div className="card mt-4">
                                <div className="card-body">
                                    <DataTable
                                        columns={columns}
                                        data={students}
                                        filtering={false}
                                        pagination={true}
                                    />

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-end mt-3">
                                        <button
                                            onClick={handleUpdate}
                                            disabled={isSubmitted || students.length === 0}
                                            className="btn btn-outline-success radius-8 px-20 py-11"
                                        >
                                            {isSubmitted ? 'SUBMITTED' : 'SUBMIT'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <Footer />
                </div>
            </section>
        </>
    );
}

export default UNIVMarkEntry;
