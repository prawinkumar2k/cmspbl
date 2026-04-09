import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../components/css/style.css";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import DataTable from "../../../../components/DataTable";

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

    // Fetch initial data
    useEffect(() => {
        // Fetch course names
        fetch('/api/branch/course-names')
            .then(res => res.json())
            .then(data => setCourseNames(Array.isArray(data) ? data : []))
            .catch(() => setCourseNames([]));

        // Fetch all departments
        fetch('/api/branch')
            .then(res => res.json())
            .then(data => setDepartments(Array.isArray(data) ? data : []))
            .catch(() => setDepartments([]));

        // Fetch semesters
        fetch('/api/semesterMaster')
            .then(res => res.json())
            .then(data => setSemesters(Array.isArray(data) ? data : []))
            .catch(() => setSemesters([]));

        // Fetch regulations
        fetch('/api/branch/regulations')
            .then(res => res.json())
            .then(data => setRegulations(Array.isArray(data) ? data : []))
            .catch(() => setRegulations([]));

        // Fetch distinct classes from class_master
        fetch('/api/classAllocation/classes')
            .then(res => res.json())
            .then(data => setClasses(Array.isArray(data) ? data : []))
            .catch(() => setClasses([]));
    }, []);

    // Filter departments when course name changes
    useEffect(() => {
        if (formState.Course_Name) {
            const filtered = departments.filter(dept => (dept.courseName || dept.Course_Name) === formState.Course_Name);
            setFilteredDepartments(filtered);
        } else {
            setFilteredDepartments([]);
        }
    }, [formState.Course_Name, departments]);

    // Auto-fill Dept_Code when Dept_Name is selected
    useEffect(() => {
        if (formState.Dept_Name) {
            const selectedDept = filteredDepartments.find(dept => (dept.deptName || dept.Dept_Name) === formState.Dept_Name);
            if (selectedDept) {
                setFormState(prev => ({ ...prev, Dept_Code: selectedDept.deptCode || selectedDept.Dept_Code }));
            }
        } else {
            setFormState(prev => ({ ...prev, Dept_Code: '' }));
        }
    }, [formState.Dept_Name, filteredDepartments]);

    // Auto-fill Year when Semester is selected
    useEffect(() => {
        if (formState.Semester) {
            const selectedSem = semesters.find(sem => (sem.semester || sem.Semester) == formState.Semester);
            if (selectedSem && (selectedSem.year || selectedSem.Year)) {
                setFormState(prev => ({ ...prev, Year: selectedSem.year || selectedSem.Year }));
            } else {
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
            toast.error('Error creating class');
        }
    };

    useEffect(() => {
        const { Course_Name, Dept_Code } = formState;
        if (Course_Name && Dept_Code) {
            setLoadingStaff(true);
            const params = new URLSearchParams({ Course_Name, Dept_Code });
            fetch(`/api/classAllocation/staff?${params.toString()}`)
                .then(res => res.json())
                .then(data => {
                    setStaff(Array.isArray(data) ? data : []);
                    setLoadingStaff(false);
                })
                .catch(() => {
                    setStaff([]);
                    setLoadingStaff(false);
                });
        } else {
            setStaff([]);
        }
    }, [formState.Course_Name, formState.Dept_Code]);

    useEffect(() => {
        const { Course_Name, Dept_Code, Semester, Year, Regulation } = formState;
        if (Course_Name && Dept_Code && Semester && Year && Regulation) {
            setLoadingStudents(true);
            const params = new URLSearchParams({ Course_Name, Dept_Code, Semester, Year, Regulation });
            fetch(`/api/classAllocation/students?${params.toString()}`)
                .then(res => res.json())
                .then(data => {
                    setStudents(Array.isArray(data) ? data : []);
                    setLoadingStudents(false);
                })
                .catch(() => {
                    setStudents([]);
                    setLoadingStudents(false);
                });
        } else {
            setStudents([]);
        }
    }, [formState.Course_Name, formState.Dept_Code, formState.Semester, formState.Year, formState.Regulation]);

    const handleUpdateStudents = async () => {
        const selectedRolls = Object.keys(rowSelection)
            .filter(key => rowSelection[key])
            .map(index => students[parseInt(index)]?.Roll_Number || students[parseInt(index)]?.rollNumber)
            .filter(Boolean);

        if (selectedRolls.length === 0) {
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
            const staffId = formState.Class_Teacher;
            const response = await fetch('/api/classAllocation/updateStudents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rollNumbers: selectedRolls,
                    section: formState.Section,
                    classTeacher: staffId,
                    courseName: formState.Course_Name,
                    deptCode: formState.Dept_Code
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(`Successfully updated ${selectedRolls.length} student(s)`);
                setRowSelection({});
                // Refetch students
                const { Course_Name, Dept_Code, Semester, Year, Regulation } = formState;
                const params = new URLSearchParams({ Course_Name, Dept_Code, Semester, Year, Regulation });
                const res = await fetch(`/api/classAllocation/students?${params.toString()}`);
                const updatedData = await res.json();
                setStudents(Array.isArray(updatedData) ? updatedData : []);
            } else {
                toast.error(data.error || 'Failed to update students');
            }
        } catch (err) {
            toast.error('Failed to update students');
        } finally {
            setUpdatingStudents(false);
        }
    };

    const handleReset = () => {
        setFormState(initialState);
        setEditId(null);
        setFilteredDepartments([]);
        setRowSelection({});
        setStaffSearchInput('');
    };

    const studentColumns = [
        {
            accessorKey: 'Roll_Number',
            header: 'Roll Number',
            cell: ({ row }) => (
                <div className="fw-medium">{row.original.Roll_Number || row.original.rollNumber || '-'}</div>
            ),
        },
        {
            accessorKey: 'Register_Number',
            header: 'Reg Number',
            cell: ({ row }) => (
                <div className="fw-medium">{row.original.Register_Number || row.original.registerNumber || '-'}</div>
            ),
        },
        {
            accessorKey: 'Student_Name',
            header: 'Student Name',
            cell: ({ row }) => (
                <div className="fw-medium">{row.original.Student_Name || row.original.studentName}</div>
            ),
        },
        {
            accessorKey: 'Class',
            header: 'Section',
            cell: ({ row }) => (
                <span className={`badge ${row.original.Class || row.original.class ? 'bg-success-focus text-success-main' : 'bg-neutral-200 text-secondary-light'}`}>
                    {row.original.Class || row.original.class || 'Not Set'}
                </span>
            ),
        },
        {
            accessorKey: 'Class_Teacher',
            header: 'Class Teacher',
            cell: ({ row }) => row.original.Class_Teacher || row.original.classTeacher || 'Not Assigned'
        },
    ];

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} />
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                            <h6 className="fw-semibold mb-0">Class Allocation</h6>
                        </div>

                        <div className="card h-100 p-0 radius-12">
                            <div className="card-body p-24">
                                <form onSubmit={(e) => { e.preventDefault(); }}>
                                    <div className="row g-20">
                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Course Name *</label>
                                            <select className="form-select radius-8" name="Course_Name" value={formState.Course_Name} onChange={handleChange}>
                                                <option value="">Select Course</option>
                                                {courseNames.map((name) => <option key={name} value={name}>{name}</option>)}
                                            </select>
                                        </div>

                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Department Name *</label>
                                            <select className="form-select radius-8" name="Dept_Name" value={formState.Dept_Name} onChange={handleChange} disabled={!formState.Course_Name}>
                                                <option value="">Select Department</option>
                                                {filteredDepartments.map((dept) => (
                                                    <option key={dept._id || dept.id || dept.Dept_Code} value={dept.Dept_Name || dept.deptName}>
                                                        {dept.Dept_Name || dept.deptName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Dept Code</label>
                                            <input type="text" className="form-control radius-8 bg-neutral-50" value={formState.Dept_Code} readOnly placeholder="Auto-filled" />
                                        </div>

                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Semester *</label>
                                            <select className="form-select radius-8" name="Semester" value={formState.Semester} onChange={handleChange}>
                                                <option value="">Select Semester</option>
                                                {semesters.map((sem, idx) => (
                                                    <option key={idx} value={sem.semester || sem.Semester}>
                                                        {sem.semester || sem.Semester}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Year</label>
                                            <input type="text" className="form-control radius-8 bg-neutral-50" value={formState.Year} readOnly placeholder="Auto-filled" />
                                        </div>

                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Regulation *</label>
                                            <select className="form-select radius-8" name="Regulation" value={formState.Regulation} onChange={handleChange}>
                                                <option value="">Select Regulation</option>
                                                {regulations.map((reg, idx) => <option key={idx} value={reg}>{reg}</option>)}
                                            </select>
                                        </div>

                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Section *</label>
                                            {!isCreatingClass ? (
                                                <div className="d-flex gap-2">
                                                    <select className="form-select radius-8" name="Section" value={formState.Section} onChange={handleChange}>
                                                        <option value="">Select Section</option>
                                                        {classes.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)}
                                                    </select>
                                                    <button type="button" className="btn btn-outline-primary" onClick={() => setIsCreatingClass(true)}><i className="fas fa-plus"></i></button>
                                                </div>
                                            ) : (
                                                <div className="d-flex gap-2">
                                                    <input type="text" className="form-control" value={newClass} onChange={(e) => setNewClass(e.target.value)} placeholder="New Class" />
                                                    <button type="button" className="btn btn-success" onClick={handleCreateClass}><i className="fas fa-check"></i></button>
                                                    <button type="button" className="btn btn-danger" onClick={() => { setIsCreatingClass(false); setNewClass(''); }}><i className="fas fa-times"></i></button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-12 col-lg-3">
                                            <label className="form-label fw-semibold text-primary-light mb-8">Class Teacher</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    placeholder={loadingStaff ? 'Loading...' : 'Search Teacher'}
                                                    value={staffSearchInput}
                                                    onChange={(e) => { setStaffSearchInput(e.target.value); setShowStaffDropdown(true); }}
                                                    onFocus={() => setShowStaffDropdown(true)}
                                                    onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                                                />
                                                {showStaffDropdown && (
                                                    <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                                                        {staff.filter(s => (s.staffId || s.Staff_ID || '').toLowerCase().includes(staffSearchInput.toLowerCase()) || (s.staffName || s.Staff_Name || '').toLowerCase().includes(staffSearchInput.toLowerCase()))
                                                        .map(s => (
                                                            <button key={s.staffId || s.Staff_ID} className="dropdown-item" onClick={() => {
                                                                setFormState(prev => ({ ...prev, Class_Teacher: s.staffId || s.Staff_ID }));
                                                                setStaffSearchInput(`${s.staffId || s.Staff_ID} - ${s.staffName || s.Staff_Name}`);
                                                                setShowStaffDropdown(false);
                                                            }}>
                                                                {s.staffId || s.Staff_ID} - {s.staffName || s.Staff_Name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end gap-3 mt-24">
                                        <button type="button" className="btn btn-outline-danger" onClick={handleReset}>Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {formState.Course_Name && formState.Dept_Code && (
                            <div className="card mt-24 p-24 radius-12">
                                <div className="d-flex justify-content-between align-items-center mb-16">
                                    <h6 className="fw-semibold mb-0">Students</h6>
                                    <button className="btn btn-primary" onClick={handleUpdateStudents} disabled={updatingStudents || !formState.Section || !formState.Class_Teacher}>
                                        {updatingStudents ? 'Updating...' : 'Apply to Selected'}
                                    </button>
                                </div>
                                <DataTable
                                    data={students}
                                    columns={studentColumns}
                                    loading={loadingStudents}
                                    enableSelection={true}
                                    externalRowSelection={rowSelection}
                                    onRowSelectionChange={setRowSelection}
                                    pageSize={10}
                                />
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
