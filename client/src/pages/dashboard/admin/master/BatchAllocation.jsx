import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from "@iconify/react";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";

const BatchAllocation = () => {
    // Master Lists
    const [academicYears, setAcademicYears] = useState([]);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState(['A', 'B', 'C', 'D']);
    const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

    // Selection State
    const [filters, setFilters] = useState({
        academicYear: '',
        courseName: '',
        deptCode: '',
        semester: '',
        section: ''
    });

    const [students, setStudents] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [batchName, setBatchName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initial Load: Academic Years & Courses
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [ayRes, cRes] = await Promise.all([
                    fetch('/api/academicYearMaster'),
                    fetch('/api/courseMaster')
                ]);
                
                if (ayRes.ok) {
                    const data = await ayRes.json();
                    setAcademicYears(Array.isArray(data) ? data : []);
                }
                if (cRes.ok) {
                    const data = await cRes.json();
                    setCourses(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to load initial data", err);
            }
        };
        fetchInitialData();
    }, []);

    // Load Departments when Course changes
    useEffect(() => {
        if (!filters.courseName) {
            setDepartments([]);
            return;
        }

        const fetchDepts = async () => {
            try {
                const res = await fetch(`/api/branch?courseName=${filters.courseName}`);
                if (res.ok) {
                    const data = await res.json();
                    setDepartments(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to load departments", err);
            }
        };
        fetchDepts();
    }, [filters.courseName]);

    // Fetch Students based on filters
    const handleFetchStudents = async () => {
        const { academicYear, courseName, deptCode, semester } = filters;
        if (!academicYear || !courseName || !deptCode || !semester) {
            toast.warning("Please select all core filters (Year, Course, Dept, Semester)");
            return;
        }

        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                Year: academicYear,
                Course_Name: courseName,
                Dept_Code: deptCode,
                Semester: semester,
                Regulation: '2021', // Default or fetch if available
                Section: filters.section
            });

            const res = await fetch(`/api/batch_allocation/students?${queryParams}`);
            if (!res.ok) throw new Error("Failed to fetch students");
            
            const data = await res.json();
            setStudents(Array.isArray(data) ? data : []);
            setSelectedStudentIds([]); // Reset selection
        } catch (err) {
            toast.error(err.message);
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle Multi-selection
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudentIds(students.map(s => s._id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleSelectStudent = (id) => {
        setSelectedStudentIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Save Allocation
    const handleSaveAllocation = async () => {
        if (selectedStudentIds.length === 0) {
            toast.warning("No students selected");
            return;
        }
        if (!batchName.trim()) {
            toast.warning("Batch Name is required");
            return;
        }

        try {
            const res = await fetch('/api/batch_allocation/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentIds: selectedStudentIds,
                    batchName: batchName
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Batch allocated successfully!");
                handleFetchStudents(); // Refresh data
                setBatchName('');
            } else {
                toast.error(data.error || "Save failed");
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                            <h6 className="fw-semibold mb-0">Batch Allocation</h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                    <li className="breadcrumb-item active">Master</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Filters Card */}
                        <div className="card radius-12 mb-4">
                            <div className="card-body p-24">
                                <div className="row g-3">
                                    <div className="col-md-2">
                                        <label className="form-label">Academic Year</label>
                                        <select 
                                            className="form-select" 
                                            value={filters.academicYear}
                                            onChange={e => setFilters({...filters, academicYear: e.target.value})}
                                        >
                                            <option value="">Select Year</option>
                                            {academicYears.map(ay => (
                                                <option key={ay._id} value={ay.year || ay.AcademicYear}>{ay.year || ay.AcademicYear}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Course</label>
                                        <select 
                                            className="form-select"
                                            value={filters.courseName}
                                            onChange={e => setFilters({...filters, courseName: e.target.value})}
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => (
                                                <option key={c._id} value={c.courseName || c.Course_Name}>{c.courseName || c.Course_Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Department</label>
                                        <select 
                                            className="form-select"
                                            value={filters.deptCode}
                                            onChange={e => setFilters({...filters, deptCode: e.target.value})}
                                        >
                                            <option value="">Select Dept</option>
                                            {departments.map(d => (
                                                <option key={d._id} value={d.deptCode || d.Dept_Code}>{d.deptName || d.Dept_Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Semester</label>
                                        <select 
                                            className="form-select"
                                            value={filters.semester}
                                            onChange={e => setFilters({...filters, semester: e.target.value})}
                                        >
                                            <option value="">Select</option>
                                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Section (Optional)</label>
                                        <select 
                                            className="form-select"
                                            value={filters.section}
                                            onChange={e => setFilters({...filters, section: e.target.value})}
                                        >
                                            <option value="">All</option>
                                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-12 text-end">
                                        <button 
                                            className="btn btn-primary-600 d-inline-flex align-items-center gap-2"
                                            onClick={handleFetchStudents}
                                            disabled={isLoading}
                                        >
                                            <Icon icon={isLoading ? "line-md:loading-twotone-loop" : "solar:magnifer-outline"} />
                                            {isLoading ? "Searching..." : "Find Students"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Students Table & Batch Action */}
                        {students.length > 0 && (
                            <div className="card radius-12">
                                <div className="card-header border-bottom p-24 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <h6 className="mb-0">Students List ({students.length})</h6>
                                        <span className="badge bg-primary-100 text-primary-600 px-12 py-6">
                                            {selectedStudentIds.length} Selected
                                        </span>
                                    </div>
                                    
                                    <div className="d-flex align-items-center gap-2">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm" 
                                            placeholder="Enter Batch Name (e.g. Batch 1)"
                                            style={{ width: '200px' }}
                                            value={batchName}
                                            onChange={e => setBatchName(e.target.value)}
                                        />
                                        <button 
                                            className="btn btn-success-600 btn-sm d-inline-flex align-items-center gap-2"
                                            onClick={handleSaveAllocation}
                                        >
                                            <Icon icon="solar:check-read-outline" />
                                            Allocate Batch
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="px-24 py-16" style={{ width: '50px' }}>
                                                        <div className="form-check">
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                onChange={handleSelectAll}
                                                                checked={selectedStudentIds.length === students.length && students.length > 0}
                                                            />
                                                        </div>
                                                    </th>
                                                    <th className="px-24 py-16">Roll Number</th>
                                                    <th className="px-24 py-16">Register No</th>
                                                    <th className="px-24 py-16">Student Name</th>
                                                    <th className="px-24 py-16">Section</th>
                                                    <th className="px-24 py-16 text-end">Current Batch</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student) => (
                                                    <tr key={student._id}>
                                                        <td className="px-24 py-16">
                                                            <div className="form-check">
                                                                <input 
                                                                    className="form-check-input" 
                                                                    type="checkbox"
                                                                    checked={selectedStudentIds.includes(student._id)}
                                                                    onChange={() => handleSelectStudent(student._id)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-24 py-16 text-secondary-light">{student.Roll_Number || 'N/A'}</td>
                                                        <td className="px-24 py-16 text-secondary-light">{student.Reg_Number || 'N/A'}</td>
                                                        <td className="px-24 py-16 fw-medium text-dark">{student.Student_Name}</td>
                                                        <td className="px-24 py-16">
                                                            <span className="badge bg-info-100 text-info-600 px-12 py-4">
                                                                {student.Section || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-24 py-16 text-end">
                                                            {student.Batch ? (
                                                                <span className="badge bg-success-100 text-success-600 px-12 py-4">
                                                                    {student.Batch}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted small">Not Allocated</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {students.length === 0 && !isLoading && filters.academicYear && (
                            <div className="text-center py-5">
                                <Icon icon="solar:user-block-outline" className="text-muted mb-3" style={{ fontSize: '48px' }} />
                                <h6 className="text-muted">No students found matching these filters.</h6>
                                <p className="text-secondary small">Make sure students are admitted for this academic year and semester.</p>
                            </div>
                        )}
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BatchAllocation;
