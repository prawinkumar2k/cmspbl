import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../components/css/style.css";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from "../../../../components/DataTable/DataTable";

const initialState = {
    Course_Name: '',
    Dept_Name: '',
    Dept_Code: '',
    Semester: '',
    Year: '',
    Regulation: '',
    Section: '',
    Class_Teacher: '',
    Room_No: '',
    Max_Strength: ''
};

const ClassAllocation = () => {
    const [formState, setFormState] = useState(initialState);
    const [courseNames, setCourseNames] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [regulations, setRegulations] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [newClass, setNewClass] = useState('');
    const [editId, setEditId] = useState(null);
    const [refreshTable, setRefreshTable] = useState(0);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [staff, setStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [updatingStudents, setUpdatingStudents] = useState(false);
    const [staffSearchInput, setStaffSearchInput] = useState('');
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);

    // Calculate selected students from rowSelection
    const selectedStudents = Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(index => students[parseInt(index)]?.Roll_Number)
        .filter(Boolean);

    // Fetch initial data
    useEffect(() => {
        // Fetch course names
        fetch('/api/branch/course-names')
            .then(res => res.json())
            .then(data => setCourseNames(data))
            .catch(() => setCourseNames([]));

        // Fetch all departments
        fetch('/api/branch')
            .then(res => res.json())
            .then(data => setDepartments(data))
            .catch(() => setDepartments([]));

        // Fetch semesters
        fetch('/api/semesterMaster')
            .then(res => res.json())
            .then(data => setSemesters(data))
            .catch(() => setSemesters([]));

        // Fetch regulations
        fetch('/api/branch/regulations')
            .then(res => res.json())
            .then(data => setRegulations(data))
            .catch(() => setRegulations([]));

        // Fetch distinct classes from class_master
        fetch('/api/classAllocation/classes')
            .then(res => res.json())
            .then(data => setClasses(data))
            .catch(() => setClasses([]));
    }, []);

    // Filter departments when course name changes
    useEffect(() => {
        if (formState.Course_Name) {
            const filtered = departments.filter(dept => dept.Course_Name === formState.Course_Name);
            setFilteredDepartments(filtered);
        } else {
            setFilteredDepartments([]);
        }
    }, [formState.Course_Name, departments]);

    // Auto-fill Dept_Code when Dept_Name is selected
    useEffect(() => {
        if (formState.Dept_Name) {
            const selectedDept = filteredDepartments.find(dept => dept.Dept_Name === formState.Dept_Name);
            if (selectedDept) {
                setFormState(prev => ({ ...prev, Dept_Code: selectedDept.Dept_Code }));
            }
        } else {
            setFormState(prev => ({ ...prev, Dept_Code: '' }));
        }
    }, [formState.Dept_Name, filteredDepartments]);

    // Auto-fill Year when Semester is selected
    useEffect(() => {
        if (formState.Semester) {
            const selectedSem = semesters.find(sem => sem.Semester == formState.Semester);
            if (selectedSem && selectedSem.Year) {
                setFormState(prev => ({ ...prev, Year: selectedSem.Year }));
            } else {
                // Fallback: calculate year if not found in semester data
                const semNum = parseInt(formState.Semester);
                let year = '';
                if (semNum >= 1 && semNum <= 2) year = '1';
                else if (semNum >= 3 && semNum <= 4) year = '2';
                else if (semNum >= 5 && semNum <= 6) year = '3';
                else if (semNum >= 7 && semNum <= 8) year = '4';
                setFormState(prev => ({ ...prev, Year: year }));
            }
        } else {
            setFormState(prev => ({ ...prev, Year: '' }));
        }
    }, [formState.Semester, semesters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    // Handle create class
    const handleCreateClass = async () => {
        if (!newClass.trim()) {
            toast.error('Please enter a class name');
            return;
        }

        try {
            const res = await fetch('/api/classAllocation/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ className: newClass })
            });

            if (res.ok) {
                const data = await res.json();
                setClasses(prev => [...prev, data.className].sort());
                setFormState(prev => ({ ...prev, Section: newClass }));
                setNewClass('');
                setIsCreatingClass(false);
                toast.success('Class created successfully!');
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || 'Failed to create class');
            }
        } catch (err) {
            console.error('Error creating class:', err);
            toast.error('Error creating class');
        }
    };

    // Fetch staff when Course_Name and Dept_Code are selected
    useEffect(() => {
        const { Course_Name, Dept_Code } = formState;

        if (Course_Name && Dept_Code) {
            setLoadingStaff(true);
            const params = new URLSearchParams({
                Course_Name,
                Dept_Code
            });

            fetch(`/api/classAllocation/staff?${params.toString()}`)
                .then(res => res.json())
                .then(data => {
                    setStaff(data);
                    setLoadingStaff(false);
                })
                .catch(err => {
                    console.error('Error fetching staff:', err);
                    setStaff([]);
                    setLoadingStaff(false);
                });
        } else {
            setStaff([]);
        }
    }, [formState.Course_Name, formState.Dept_Code]);

    // Fetch students when all required fields are selected
    useEffect(() => {
        const { Course_Name, Dept_Code, Semester, Year, Regulation } = formState;

        if (Course_Name && Dept_Code && Semester && Year && Regulation) {
            setLoadingStudents(true);
            const params = new URLSearchParams({
                Course_Name,
                Dept_Code,
                Semester,
                Year,
                Regulation
            });

            fetch(`/api/classAllocation/students?${params.toString()}`)
                .then(res => res.json())
                .then(data => {
                    setStudents(data);
                    setLoadingStudents(false);
                })
                .catch(err => {
                    console.error('Error fetching students:', err);
                    setStudents([]);
                    setLoadingStudents(false);
                });
        } else {
            setStudents([]);
        }
    }, [formState.Course_Name, formState.Dept_Code, formState.Semester, formState.Year, formState.Regulation]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Unified Required Field Validation (Sequential)
        const requiredFields = [
            { key: 'Course_Name', label: 'Course Name' },
            { key: 'Dept_Name', label: 'Department Name' },
            { key: 'Dept_Code', label: 'Department Code' },
            { key: 'Semester', label: 'Semester' },
            { key: 'Year', label: 'Year' },
            { key: 'Regulation', label: 'Regulation' }
        ];

        const firstMissing = requiredFields.find(f => {
            const value = formState[f.key];
            return !value || (typeof value === 'string' && value.trim() === '');
        });

        if (firstMissing) {
            toast.error(`${firstMissing.label} is required.`);
            return;
        }

        try {
            let response;
            if (editId) {
                response = await fetch(`/api/classAllocation/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formState),
                });
            } else {
                response = await fetch('/api/classAllocation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formState),
                });
            }

            if (!response.ok) {
                throw new Error(editId ? 'Failed to update class allocation' : 'Failed to save class allocation');
            }

            toast.success(editId ? 'Class allocation updated successfully!' : 'Class allocation saved successfully!', { autoClose: 2000 });
            setRefreshTable(prev => prev + 1);
            handleReset();
        } catch (error) {
            toast.error(error.message || (editId ? 'Error updating class allocation' : 'Error saving class allocation'));
        }
    };

    const handleReset = () => {
        setFormState(initialState);
        setEditId(null);
        setFilteredDepartments([]);
        setRowSelection({});
    };

    const handleUpdateStudents = async () => {
        if (selectedStudents.length === 0) {
            toast.error('Please select at least one student');
            return;
        }

        if (!formState.Section) {
            toast.error('Please select a section');
            return;
        }

        if (!formState.Class_Teacher) {
            toast.error('Please select a class teacher');
            return;
        }

        setUpdatingStudents(true);
        try {
            // Extract only Staff_ID from "Staff_ID - Staff_Name" format
            const staffId = formState.Class_Teacher.split(' - ')[0];

            const response = await fetch('/api/classAllocation/updateStudents', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rollNumbers: selectedStudents,
                    section: formState.Section,
                    classTeacher: staffId,
                    courseName: formState.Course_Name,
                    deptCode: formState.Dept_Code
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Successfully updated ${selectedStudents.length} student(s)`, { autoClose: 2000 });
                setRowSelection({});
                // Refresh student list
                const params = new URLSearchParams({
                    Course_Name: formState.Course_Name,
                    Dept_Code: formState.Dept_Code,
                    Semester: formState.Semester,
                    Year: formState.Year,
                    Regulation: formState.Regulation
                });
                const studentsRes = await fetch(`/api/classAllocation/students?${params.toString()}`);
                const studentsData = await studentsRes.json();
                setStudents(studentsData);
            } else {
                toast.error(data.error || 'Failed to update students');
            }
        } catch (err) {
            console.error('Error updating students:', err);
            toast.error('Failed to update students');
        } finally {
            setUpdatingStudents(false);
        }
    };

    // Define columns for DataTable
    const studentColumns = [
        {
            accessorKey: 'Roll_Number',
            header: 'Roll Number',
            cell: ({ row }) => (
                <div className="fw-medium">{row.original.Roll_Number || '-'}</div>
            ),
        },
        {
            accessorKey: 'Register_Number',
            header: 'Register Number',
            cell: ({ row }) => (
                <div className="fw-medium">{row.original.Register_Number || '-'}</div>
            ),
        },
        {
            accessorKey: 'Student_Name',
            header: 'Student Name',
            cell: ({ row }) => (
                <div className="fw-medium">{row.original.Student_Name}</div>
            ),
        },
        {
            accessorKey: 'Class',
            header: 'Current Section',
            cell: ({ row }) => (
                <div className="text-center">
                    <span className={`badge ${row.original.Class ? 'bg-success-focus text-success-main' : 'bg-neutral-200 text-secondary-light'}`}>
                        {row.original.Class || 'Not Set'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'Class_Teacher',
            header: 'Current Class Teacher',
            cell: ({ row }) => (
                <div>
                    {row.original.Class_Teacher ? (
                        <span className="text-primary-600">{row.original.Class_Teacher}</span>
                    ) : (
                        <span className="text-secondary-light">Not Assigned</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <section className="overlay">
                <Sidebar />

                <div className="dashboard-main">
                    <Navbar />

                    <div className="dashboard-main-body">
                        {/* Header */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                            <h6 className="fw-semibold mb-0">Class Allocation</h6>
                        </div>

                        {/* Form Card */}
                        <div className="card h-100 p-0 radius-12">
                            <div className="card-body p-24">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="mb-24">
                                            <div className="row g-20">

                                                {/* Course Name */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Course Name <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className="form-select radius-8"
                                                        name="Course_Name"
                                                        value={formState.Course_Name}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select Course</option>
                                                        {courseNames.map((name) => (
                                                            <option key={name} value={name}>
                                                                {name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Department Name */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Department Name <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className="form-select radius-8"
                                                        name="Dept_Name"
                                                        value={formState.Dept_Name}
                                                        onChange={handleChange}
                                                        disabled={!formState.Course_Name}
                                                    >
                                                        <option value="">Select Department</option>
                                                        {filteredDepartments.map((dept) => (
                                                            <option key={dept.id} value={dept.Dept_Name}>
                                                                {dept.Dept_Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Department Code (Auto-filled) */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Department Code <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control radius-8 bg-neutral-50"
                                                        name="Dept_Code"
                                                        value={formState.Dept_Code}
                                                        placeholder="Auto-filled"
                                                        readOnly
                                                    />
                                                </div>

                                                {/* Semester */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Semester <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className="form-select radius-8"
                                                        name="Semester"
                                                        value={formState.Semester}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select Semester</option>
                                                        {semesters.map((sem) => (
                                                            <option key={sem.id} value={sem.Semester}>
                                                                {sem.Semester}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Year (Auto-filled) */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Year <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control radius-8 bg-neutral-50"
                                                        name="Year"
                                                        value={formState.Year}
                                                        placeholder="Auto-filled"
                                                        readOnly
                                                    />
                                                </div>

                                                {/* Regulation */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Regulation <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className="form-select radius-8"
                                                        name="Regulation"
                                                        value={formState.Regulation}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select Regulation</option>
                                                        {regulations.map((reg) => (
                                                            <option key={reg} value={reg}>
                                                                {reg}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Section */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Section <span className="text-danger">*</span>
                                                    </label>
                                                    {!isCreatingClass ? (
                                                        <div className="d-flex gap-2">
                                                            <select
                                                                className="form-select radius-8"
                                                                name="Section"
                                                                value={formState.Section}
                                                                onChange={handleChange}
                                                                placeholder="Select Section"
                                                            >
                                                                <option value="">Select Section</option>
                                                                {classes.map((cls, index) => (
                                                                    <option key={index} value={cls}>
                                                                        {cls}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary px-3"
                                                                onClick={() => setIsCreatingClass(true)}
                                                                title="Create New Class"
                                                            >
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={newClass}
                                                                onChange={(e) => setNewClass(e.target.value)}
                                                                className="form-control radius-8"
                                                                placeholder="Enter new class name"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-success px-3"
                                                                onClick={handleCreateClass}
                                                                title="Save Class"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger px-3"
                                                                onClick={() => {
                                                                    setIsCreatingClass(false);
                                                                    setNewClass('');
                                                                }}
                                                                title="Cancel"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Class Teacher Searchable Dropdown */}
                                                <div className="col-12 col-lg-3">
                                                    <label className="form-label fw-semibold text-primary-light mb-8">
                                                        Class Teacher
                                                    </label>
                                                    <div className="position-relative">
                                                        <input
                                                            type="text"
                                                            className="form-control radius-8"
                                                            placeholder={loadingStaff ? 'Loading staff...' : 'Search Staff ID or Name'}
                                                            value={staffSearchInput}
                                                            onChange={(e) => {
                                                                setStaffSearchInput(e.target.value);
                                                                setShowStaffDropdown(true);
                                                            }}
                                                            onFocus={() => setShowStaffDropdown(true)}
                                                            onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                                                            disabled={!formState.Course_Name || !formState.Dept_Code || loadingStaff}
                                                        />
                                                        {formState.Class_Teacher && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y"
                                                                onClick={() => {
                                                                    setFormState(prev => ({ ...prev, Class_Teacher: '' }));
                                                                    setStaffSearchInput('');
                                                                }}
                                                                title="Clear selection"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        )}
                                                        {showStaffDropdown && staff.length > 0 && (
                                                            <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                                                                {staff
                                                                    .filter(teacher =>
                                                                        teacher.Staff_ID.toLowerCase().includes(staffSearchInput.toLowerCase()) ||
                                                                        teacher.Staff_Name.toLowerCase().includes(staffSearchInput.toLowerCase())
                                                                    )
                                                                    .map((teacher) => (
                                                                        <button
                                                                            key={teacher.Staff_ID}
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setFormState(prev => ({ ...prev, Class_Teacher: teacher.Staff_ID }));
                                                                                setStaffSearchInput(`${teacher.Staff_ID} - ${teacher.Staff_Name}`);
                                                                                setShowStaffDropdown(false);
                                                                            }}
                                                                        >
                                                                            <div className="d-flex justify-content-between align-items-start">
                                                                                <div>
                                                                                    <div className="fw-semibold">{teacher.Staff_ID}</div>
                                                                                    <div className="small text-muted">{teacher.Staff_Name}</div>
                                                                                </div>
                                                                                {teacher.Designation && (
                                                                                    <span className="badge bg-light text-dark small">{teacher.Designation}</span>
                                                                                )}
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger radius-8 px-20 py-11"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Student List Table */}
                        {formState.Course_Name && formState.Dept_Code && formState.Semester && formState.Year && formState.Regulation && (
                            <div className="card mt-24 p-0 radius-12">
                                <div className="card-body p-24">
                                    <div className="d-flex align-items-center justify-content-between mb-20">
                                        <h6 className="fw-semibold mb-0">Student List</h6>
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="text-secondary-light">Total: {students.length} | Selected: {selectedStudents.length}</span>
                                            {selectedStudents.length > 0 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary-600 radius-8 px-20 py-8"
                                                    onClick={handleUpdateStudents}
                                                    disabled={updatingStudents || !formState.Section || !formState.Class_Teacher}
                                                >
                                                    {updatingStudents ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Update Selected Students
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {!formState.Section || !formState.Class_Teacher ? (
                                        <div className="alert alert-warning mb-3" role="alert">
                                            <iconify-icon icon="solar:info-circle-bold" className="icon me-2"></iconify-icon>
                                            Please select Section and Class Teacher above to enable student updates
                                        </div>
                                    ) : null}

                                    <DataTable
                                        data={students}
                                        columns={studentColumns}
                                        loading={loadingStudents}
                                        error={null}
                                        title=""
                                        onEdit={() => { }}
                                        onDelete={() => { }}
                                        enableExport={false}
                                        enableSelection={true}
                                        enableActions={false}
                                        pageSize={10}
                                        externalRowSelection={rowSelection}
                                        onRowSelectionChange={setRowSelection}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                    <Footer />
                </div>
            </section>
        </>
    );
};

export default ClassAllocation;
