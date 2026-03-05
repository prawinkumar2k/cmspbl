import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';

const ArrearEntry = () => {
    // Filter state
    const [filters, setFilters] = useState({
        deptCode: '',
        deptName: '',
        semester: '',
        year: '',
        regulation: ''
    });

    // Master data state
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [regulations, setRegulations] = useState([]);

    // Table state
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [editMode, setEditMode] = useState({}); // Tracking which rows are in edit mode { studentId: true/false }
    const [allEditMode, setAllEditMode] = useState(false);
    const studentsRef = React.useRef(students);

    // Sync ref with state
    useEffect(() => {
        studentsRef.current = students;
    }, [students]);

    // Fetch master data on mount
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [deptRes, semRes, regRes] = await Promise.all([
                    fetch('/api/branch'),
                    fetch('/api/semesterMaster'),
                    fetch('/api/regulationMaster')
                ]);

                if (deptRes.ok) setDepartments(await deptRes.json());
                if (semRes.ok) setSemesters(await semRes.json());
                if (regRes.ok) setRegulations(await regRes.json());
            } catch (error) {
                console.error('Error fetching master data:', error);
                toast.error('Failed to load master data');
            }
        };
        fetchMasterData();
    }, []);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };

            // Auto-fetch Dept Code when Dept Name changes
            if (name === 'deptName') {
                const selectedDept = departments.find(d => d.Dept_Name === value);
                newFilters.deptCode = selectedDept ? selectedDept.Dept_Code : '';
            }

            // Auto-fetch Year when Semester changes
            if (name === 'semester') {
                const selectedSem = semesters.find(s => s.Semester.toString() === value);
                newFilters.year = selectedSem ? selectedSem.Year : '';
            }

            return newFilters;
        });
    };

    // Fetch student list
    const handleSearch = async () => {
        if (!filters.deptCode || !filters.semester || !filters.regulation) {
            toast.warning('Please select all filters');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/arrear/students?deptCode=${filters.deptCode}&semester=${filters.semester}&regulation=${filters.regulation}`);
            if (response.ok) {
                const data = await response.json();
                if (data.length === 0) {
                    toast.info('No student found');
                    setStudents([]);
                    setShowTable(false);
                } else {
                    setStudents(data);
                    setShowTable(true);
                    setEditMode({});
                    setAllEditMode(false);
                }
            } else {
                toast.error('Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('An error occurred while fetching students');
        } finally {
            setLoading(false);
        }
    };

    // Toggle edit mode for a single student
    const toggleEdit = useCallback((id) => {
        setEditMode(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    // Toggle edit mode for all students
    const toggleEditAll = () => {
        const newMode = !allEditMode;
        setAllEditMode(newMode);
        const newEditMode = {};
        if (newMode) {
            students.forEach(s => {
                newEditMode[s.Id] = true;
            });
        }
        setEditMode(newEditMode);
    };

    // Handle mark input change
    const handleMarkChange = useCallback((id, field, value) => {
        setStudents(prev => prev.map(s =>
            s.Id === id ? { ...s, [field]: value } : s
        ));
    }, []);

    // Update marks in backend
    const handleUpdate = useCallback(async (studentId = null) => {
        let studentsToUpdate = [];
        const currentStudents = studentsRef.current;
        if (studentId) {
            // Update individual student
            const student = currentStudents.find(s => s.Id === studentId);
            if (student) {
                // Ensure marks are valid or NULL
                const updatedMarks = {};
                ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].forEach(field => {
                    updatedMarks[field] = student[field] === '' ? null : student[field];
                });
                studentsToUpdate.push({ Id: student.Id, ...updatedMarks });
            }
        } else {
            // Update all students currently in edit mode
            currentStudents.forEach(student => {
                if (editMode[student.Id] || allEditMode) {
                    const updatedMarks = {};
                    ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].forEach(field => {
                        updatedMarks[field] = student[field] === '' ? null : student[field];
                    });
                    studentsToUpdate.push({ Id: student.Id, ...updatedMarks });
                }
            });
        }

        if (studentsToUpdate.length === 0) {
            toast.info('No changes to update');
            return;
        }

        try {
            const response = await fetch('/api/arrear/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ students: studentsToUpdate })
            });

            if (response.ok) {
                toast.success('Marks updated successfully');
                if (studentId) {
                    toggleEdit(studentId);
                } else {
                    setAllEditMode(false);
                    setEditMode({});
                }
            } else {
                toast.error('Failed to update marks');
            }
        } catch (error) {
            console.error('Error updating marks:', error);
            toast.error('An error occurred during update');
        }
    }, [editMode, allEditMode, toggleEdit]);

    // Define table columns
    const columns = React.useMemo(() => [
        {
            accessorKey: 'Photo_Path',
            header: 'Image',
            cell: ({ row }) => (
                <img
                    src={`/api/studentMaster/student/student-image/${row.original.Photo_Path}`}
                    alt="student"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/api/studentMaster/student/student-image/student.png'; }}
                />
            )
        },
        {
            accessorKey: 'Register_Number',
            header: 'Reg No',
        },
        {
            accessorKey: 'Student_Name',
            header: 'Name',
        },
        // S1 to S8 columns
        ...['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map(mark => ({
            accessorKey: mark,
            header: mark,
            cell: ({ row }) => {
                const isEditing = editMode[row.original.Id] || allEditMode;

                const handleInputChange = (e) => {
                    handleMarkChange(row.original.Id, mark, e.target.value);
                };

                return isEditing ? (
                    <input
                        type="text"
                        value={row.original[mark] || ''}
                        onChange={handleInputChange}
                        className="form-control form-control-sm"
                        style={{
                            width: `${Math.max(60, (row.original[mark] || '').toString().length * 10 + 20)}px`,
                            textAlign: 'center',
                            transition: 'width 0.2s ease'
                        }}
                    />
                ) : (
                    <div style={{ textAlign: 'center' }}>{row.original[mark] || '-'}</div>
                );
            }
        })),
        {
            header: 'Action',
            cell: ({ row }) => {
                const isEditing = editMode[row.original.Id];
                return (
                    <div className="d-flex gap-2">
                        <button
                            className={`btn btn-sm ${isEditing ? 'btn-outline-success' : 'btn-outline-primary'}`}
                            onClick={() => isEditing ? handleUpdate(row.original.Id) : toggleEdit(row.original.Id)}
                        >
                            <Icon icon={isEditing ? "material-symbols:save" : "material-symbols:edit"} />
                        </button>
                    </div>
                );
            }
        }
    ], [editMode, allEditMode, handleMarkChange, handleUpdate, toggleEdit]);

    return (
        <>
            <ToastContainer />
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                            <h6 className="fw-semibold mb-0">Arrear Entry</h6>
                        </div>

                        {/* Filters */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12 col-md-8 col-lg-4">
                                        <label className="form-label">Dept Name</label>
                                        <select
                                            name="deptName"
                                            className="form-select"
                                            value={filters.deptName}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(d => (
                                                <option key={d.id} value={d.Dept_Name}>{d.Dept_Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-4 col-lg-2">
                                        <label className="form-label">Dept Code</label>
                                        <input type="text" className="form-control" value={filters.deptCode} readOnly />
                                    </div>
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label className="form-label">Semester</label>
                                        <select
                                            name="semester"
                                            className="form-select"
                                            value={filters.semester}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Select Sem</option>
                                            {semesters.map(s => (
                                                <option key={s.id} value={s.Semester}>{s.Semester}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label className="form-label">Year</label>
                                        <input type="text" className="form-control" value={filters.year} readOnly />
                                    </div>
                                    <div className="col-12 col-md-4 col-lg-2">
                                        <label className="form-label">Regulation</label>
                                        <select
                                            name="regulation"
                                            className="form-select"
                                            value={filters.regulation}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Select Reg</option>
                                            {regulations.map(r => (
                                                <option key={r.id} value={r.Regulation}>{r.Regulation}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 d-flex justify-content-end">
                                        <button className="btn btn-outline-primary" onClick={handleSearch} disabled={loading}>
                                            {loading ? <Icon icon="eos-icons:loading" spin className="me-2" /> : <Icon icon="material-symbols:search" className="me-2" />}
                                            Show Students
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Student Table */}
                        {showTable && (
                            <div className="card overflow-visible">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">Student List</h6>
                                        <div className="d-flex gap-2">
                                            <button
                                                className={`btn ${allEditMode ? 'btn-warning' : 'btn-outline-primary'}`}
                                                onClick={toggleEditAll}
                                            >
                                                <Icon icon={allEditMode ? "material-symbols:edit-off" : "material-symbols:edit"} className="me-1" />
                                                {allEditMode ? 'Cancel Edit All' : 'Edit All'}
                                            </button>
                                            {allEditMode && (
                                                <button className="btn btn-success" onClick={() => handleUpdate()}>
                                                    <Icon icon="material-symbols:save" className="me-1" />
                                                    Update All
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <DataTable
                                        columns={columns}
                                        data={students}
                                        pagination={true}
                                        filtering={true}
                                        enableActions={false}
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

export default ArrearEntry;
