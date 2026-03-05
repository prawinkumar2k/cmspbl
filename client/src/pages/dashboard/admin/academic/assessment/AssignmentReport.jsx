import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../../components/css/style.css";

const LOGO_SRC = '/assets/images/GRT.png';

const AssignmentReport = () => {
  // Filter state
  const [filters, setFilters] = useState({
    courseName: '',
    deptName: '',
    deptCode: '',
    semester: '',
    regulation: '',
    section: '',
    subjectName: '',
    subjectCode: '',
    assignmentNo: '',
    assignmentDate: '',
    maxMarks: ''
  });

  // Master data state
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Table state
  const [assignmentMarks, setAssignmentMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/assignmentMark/report/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      }
    };
    fetchCourses();
  }, []);

  // Fetch departments when course is selected
  useEffect(() => {
    const fetchDepartments = async () => {
      if (filters.courseName) {
        try {
          const response = await fetch(`/api/assignmentMark/report/departments?courseName=${encodeURIComponent(filters.courseName)}`);
          const data = await response.json();
          setDepartments(data);
        } catch (error) {
          console.error('Error fetching departments:', error);
          toast.error('Failed to load departments');
        }
      } else {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, [filters.courseName]);

  // Fetch semesters when course and department are selected
  useEffect(() => {
    const fetchSemesters = async () => {
      if (filters.courseName && filters.deptName) {
        try {
          const response = await fetch(`/api/assignmentMark/report/semesters?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}`);
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
  }, [filters.courseName, filters.deptName]);

  // Fetch regulations when course, department, and semester are selected
  useEffect(() => {
    const fetchRegulations = async () => {
      if (filters.courseName && filters.deptName && filters.semester) {
        try {
          const response = await fetch(`/api/assignmentMark/report/regulations?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}`);
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
  }, [filters.courseName, filters.deptName, filters.semester]);

  // Fetch sections
  useEffect(() => {
    const fetchSections = async () => {
      if (filters.courseName && filters.deptName && filters.semester && filters.regulation) {
        try {
          const response = await fetch(`/api/assignmentMark/report/sections?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}`);
          const data = await response.json();
          setSections(data);
        } catch (error) {
          console.error('Error fetching sections:', error);
          toast.error('Failed to load sections');
        }
      } else {
        setSections([]);
      }
    };
    fetchSections();
  }, [filters.courseName, filters.deptName, filters.semester, filters.regulation]);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      if (filters.courseName && filters.deptName && filters.semester && filters.regulation && filters.section) {
        try {
          const response = await fetch(`/api/assignmentMark/report/subjects?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}&section=${encodeURIComponent(filters.section)}`);
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
  }, [filters.courseName, filters.deptName, filters.semester, filters.regulation, filters.section]);

  // Fetch assignments when subject is selected
  useEffect(() => {
    const fetchAssignments = async () => {
      if (filters.courseName && filters.deptName && filters.semester && filters.regulation && filters.section && filters.subjectName) {
        try {
          const response = await fetch(`/api/assignmentMark/report/assignments?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}&section=${encodeURIComponent(filters.section)}&subjectName=${encodeURIComponent(filters.subjectName)}`);
          const data = await response.json();
          setAssignments(data);
        } catch (error) {
          console.error('Error fetching assignments:', error);
          toast.error('Failed to load assignments');
        }
      } else {
        setAssignments([]);
      }
    };
    fetchAssignments();
  }, [filters.courseName, filters.deptName, filters.semester, filters.regulation, filters.section, filters.subjectName]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };

      // Handle department selection - auto-fill dept code
      if (name === 'deptName') {
        const selectedDept = departments.find(d => d.deptName === value);
        newFilters.deptCode = selectedDept ? selectedDept.deptCode : '';
        // Reset dependent fields
        newFilters.semester = '';
        newFilters.regulation = '';
        newFilters.section = '';
        newFilters.subjectName = '';
        newFilters.subjectCode = '';
      }

      // Handle subject selection - auto-fill subject code
      if (name === 'subjectName') {
        const selectedSubject = subjects.find(s => s.subjectName === value);
        newFilters.subjectCode = selectedSubject ? selectedSubject.subjectCode : '';
        // Reset assignment fields
        newFilters.assignmentNo = '';
        newFilters.assignmentDate = '';
        newFilters.maxMarks = '';
      }

      // Handle assignment number selection - auto-fill date and max marks
      if (name === 'assignmentNo') {
        const selectedAssignment = assignments.find(a => a.assignmentNo === parseInt(value));
        if (selectedAssignment) {
          const date = selectedAssignment.assessmentDate ? new Date(selectedAssignment.assessmentDate).toLocaleDateString('en-GB') : '';
          newFilters.assignmentDate = date;
          newFilters.maxMarks = selectedAssignment.maxMarks || '';
        }
      }

      // Reset dependent fields when course changes
      if (name === 'courseName') {
        newFilters.deptName = '';
        newFilters.deptCode = '';
        newFilters.semester = '';
        newFilters.regulation = '';
        newFilters.section = '';
        newFilters.subjectName = '';
        newFilters.subjectCode = '';
        newFilters.assignmentNo = '';
        newFilters.assignmentDate = '';
        newFilters.maxMarks = '';
      }

      // Reset dependent fields when semester changes
      if (name === 'semester') {
        newFilters.regulation = '';
        newFilters.section = '';
        newFilters.subjectName = '';
        newFilters.subjectCode = '';
        newFilters.assignmentNo = '';
        newFilters.assignmentDate = '';
        newFilters.maxMarks = '';
      }

      // Reset dependent fields when regulation changes
      if (name === 'regulation') {
        newFilters.section = '';
        newFilters.subjectName = '';
        newFilters.subjectCode = '';
        newFilters.assignmentNo = '';
        newFilters.assignmentDate = '';
        newFilters.maxMarks = '';
      }

      // Reset dependent fields when section changes
      if (name === 'section') {
        newFilters.subjectName = '';
        newFilters.subjectCode = '';
        newFilters.assignmentNo = '';
        newFilters.assignmentDate = '';
        newFilters.maxMarks = '';
      }

      return newFilters;
    });

    // Hide table when filters change
    setShowTable(false);
  };

  // Handle view button click
  const handleView = async () => {
    if (!filters.courseName || !filters.deptName || !filters.semester ||
      !filters.regulation || !filters.section) {
      toast.error('Please fill all required filter fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = `/api/assignmentMark/report/marks?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}&section=${encodeURIComponent(filters.section)}`;

      if (filters.subjectName) {
        url += `&subjectName=${encodeURIComponent(filters.subjectName)}`;
      }

      if (filters.assignmentNo) {
        url += `&assignmentNo=${encodeURIComponent(filters.assignmentNo)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch assignment marks');
      }

      const data = await response.json();
      setAssignmentMarks(data);
      setShowTable(true);

      if (data.length === 0) {
        toast.info('No assignment marks found for the selected filters');
      } else {
        toast.success(`${data.length} records loaded successfully`);
      }
    } catch (error) {
      console.error('Error fetching assignment marks:', error);
      toast.error('Failed to load assignment marks');
      setAssignmentMarks([]);
      setShowTable(false);
      setError('Failed to load assignment marks');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    setFilters({
      courseName: '',
      deptName: '',
      deptCode: '',
      semester: '',
      regulation: '',
      section: '',
      subjectName: '',
      subjectCode: '',
      assignmentNo: '',
      assignmentDate: '',
      maxMarks: ''
    });
    setShowTable(false);
    setAssignmentMarks([]);
    setError(null);
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const renderHeader = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
      <div style={{ width: 100, textAlign: "center" }}>
        <img src={LOGO_SRC} alt="logo" style={{ width: 90, height: 90, objectFit: "contain" }} />
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#222", textTransform: "uppercase" }}>
          GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
        </div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#222", marginTop: 4 }}>
          GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
        </div>
        <div style={{ fontSize: "13px", fontWeight: "500", color: "#222", marginTop: 2 }}>
          Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
        </div>
      </div>
      <div style={{ width: 100 }}></div>
    </div>
  );

  const renderSignatures = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingBottom: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Subject In-charge</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>HOD</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Principal</div>
      </div>
    </div>
  );

  // Define table columns
  const columns = [
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
      accessorKey: 'subjectCode',
      header: 'Subject Code',
      cell: ({ row }) => <div className="fw-medium">{row.original.subjectCode}</div>,
    },
    {
      accessorKey: 'subjectName',
      header: 'Subject Name',
      cell: ({ row }) => <div className="fw-medium">{row.original.subjectName}</div>,
    },
    {
      accessorKey: 'assignmentNo',
      header: 'Assignment No',
      cell: ({ row }) => <div className="fw-medium">{row.original.assignmentNo}</div>,
    },
    {
      accessorKey: 'assessmentDate',
      header: 'Assessment Date',
      cell: ({ row }) => {
        const date = row.original.assessmentDate;
        return (
          <div className="fw-medium">
            {date ? new Date(date).toLocaleDateString('en-GB') : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'maxMarks',
      header: 'Max Marks',
      cell: ({ row }) => <div className="fw-medium">{row.original.maxMarks}</div>,
    },
    {
      accessorKey: 'obtainedMark',
      header: 'Obtained Marks',
      cell: ({ row }) => <div className="fw-medium">{row.original.obtainedMark}</div>
    },
    {
      accessorKey: 'enteredBy',
      header: 'Entered By',
      cell: ({ row }) => <div className="fw-medium">{row.original.enteredBy}</div>,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = row.original.updatedAt;
        return (
          <div className="fw-medium">
            {date ? new Date(date).toLocaleString('en-GB') : '-'}
          </div>
        );
      },
    }
  ];

  return (
    <>

      <section className="overlay">
        <Sidebar />

        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Assignment Mark Report</h6>
            </div>

            {/* Standardized Print Content */}
            <div id="assignment-report" className="assignment-report-print-container" style={{ display: 'none' }}>
              <style>
                {`
                  @media print {
                    body * { visibility: hidden; }
                    #assignment-report, #assignment-report * { visibility: visible; }
                    #assignment-report {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      display: block !important;
                      background: #fff !important;
                    }
                    .page-container {
                      page-break-after: always;
                      border: 2px solid #222 !important;
                      padding: 12mm !important;
                      min-height: 277mm;
                      display: flex;
                      flex-direction: column;
                      box-sizing: border-box;
                      margin-bottom: 0;
                    }
                    .page-container:last-child {
                      page-break-after: auto;
                    }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    @page { size: A4 portrait; margin: 5mm; }
                  }
                `}
              </style>
              {(() => {
                const ROWS_PER_PAGE = 10;
                const chunks = chunkArray(assignmentMarks, ROWS_PER_PAGE);

                return chunks.map((chunk, pageIdx) => (
                  <div key={pageIdx} className="page-container" style={{ background: '#fff', fontFamily: "'Times New Roman', serif" }}>
                    {renderHeader()}

                    <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "900", textDecoration: "underline", marginBottom: "20px", color: "#000" }}>
                      ASSIGNMENT MARK REPORT
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '13px', color: "#000" }}>
                      <div>
                        <div><strong>Course:</strong> {filters.courseName}</div>
                        <div><strong>Dept:</strong> {filters.deptName}</div>
                        <div><strong>Sem/Sec:</strong> {filters.semester} / {filters.section}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div><strong>Subject:</strong> {filters.subjectName} ({filters.subjectCode})</div>
                        <div><strong>Assignment No:</strong> {filters.assignmentNo || 'All'}</div>
                        <div><strong>Max Marks:</strong> {filters.maxMarks || '-'}</div>
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: "#000" }}>
                      <thead>
                        <tr>
                          <th style={{ border: '1px solid #222', padding: '8px', background: '#f4f4f4', textAlign: 'center' }}>S.No</th>
                          <th style={{ border: '1px solid #222', padding: '8px', background: '#f4f4f4' }}>Register No</th>
                          <th style={{ border: '1px solid #222', padding: '8px', background: '#f4f4f4' }}>Student Name</th>
                          <th style={{ border: '1px solid #222', padding: '8px', background: '#f4f4f4', textAlign: 'center' }}>Assgn No</th>
                          <th style={{ border: '1px solid #222', padding: '8px', background: '#f4f4f4', textAlign: 'center' }}>Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chunk.map((m, idx) => (
                          <tr key={m.id}>
                            <td style={{ border: '1px solid #222', padding: '8px', textAlign: 'center' }}>{pageIdx * ROWS_PER_PAGE + idx + 1}</td>
                            <td style={{ border: '1px solid #222', padding: '8px' }}>{m.registerNo}</td>
                            <td style={{ border: '1px solid #222', padding: '8px' }}>{m.studentName}</td>
                            <td style={{ border: '1px solid #222', padding: '8px', textAlign: 'center' }}>{m.assignmentNo}</td>
                            <td style={{ border: '1px solid #222', padding: '8px', textAlign: 'center' }}>{m.obtainedMark}</td>
                          </tr>
                        ))}
                        {/* Fill empty rows to maintain layout if needed, though with 10 rows it's usually fine */}
                        {chunk.length < ROWS_PER_PAGE && Array.from({ length: ROWS_PER_PAGE - chunk.length }).map((_, i) => (
                          <tr key={`empty-${i}`}>
                            <td style={{ border: '1px solid #222', padding: '20px' }}>&nbsp;</td>
                            <td style={{ border: '1px solid #222', padding: '20px' }}>&nbsp;</td>
                            <td style={{ border: '1px solid #222', padding: '20px' }}>&nbsp;</td>
                            <td style={{ border: '1px solid #222', padding: '20px' }}>&nbsp;</td>
                            <td style={{ border: '1px solid #222', padding: '20px' }}>&nbsp;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ marginTop: 'auto' }}>
                      {renderSignatures()}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Filter Card */}
            <div className="card h-100 p-0 radius-12 mb-4">
              <div className="card-body p-24">
                <div className="row g-3">
                  {/* Course Name */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Course Name <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select radius-8"
                      value={filters.courseName}
                      onChange={(e) => handleFilterChange('courseName', e.target.value)}
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.courseName} value={course.courseName}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department Name */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Department Name <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select radius-8"
                      value={filters.deptName}
                      onChange={(e) => handleFilterChange('deptName', e.target.value)}
                      disabled={!filters.courseName}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.deptName} value={dept.deptName}>
                          {dept.deptName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department Code (Auto-filled) */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Department Code
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      value={filters.deptCode}
                      readOnly
                      placeholder="Auto-filled"
                    />
                  </div>

                  {/* Semester */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Semester <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select radius-8"
                      value={filters.semester}
                      onChange={(e) => handleFilterChange('semester', e.target.value)}
                      disabled={!filters.deptName}
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem.semester} value={sem.semester}>
                          {sem.semester}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Regulation */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Regulation <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select radius-8"
                      value={filters.regulation}
                      onChange={(e) => handleFilterChange('regulation', e.target.value)}
                      disabled={!filters.semester}
                    >
                      <option value="">Select Regulation</option>
                      {regulations.map((reg) => (
                        <option key={reg.regulation} value={reg.regulation}>
                          {reg.regulation}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Section <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select radius-8"
                      value={filters.section}
                      onChange={(e) => handleFilterChange('section', e.target.value)}
                      disabled={!filters.regulation}
                    >
                      <option value="">Select Section</option>
                      {sections.map((sec) => (
                        <option key={sec.section} value={sec.section}>
                          {sec.section}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Name (Optional) */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Subject Name (Optional)
                    </label>
                    <select
                      className="form-select radius-8"
                      value={filters.subjectName}
                      onChange={(e) => handleFilterChange('subjectName', e.target.value)}
                      disabled={!filters.section}
                    >
                      <option value="">All Subjects</option>
                      {subjects.map((sub) => (
                        <option key={sub.subjectName} value={sub.subjectName}>
                          {sub.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Code (Auto-filled) */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Subject Code
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      value={filters.subjectCode}
                      readOnly
                      placeholder="Auto-filled"
                    />
                  </div>

                  {/* Assignment Number (Optional) */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Assignment Number (Optional)
                    </label>
                    <select
                      className="form-select radius-8"
                      value={filters.assignmentNo}
                      onChange={(e) => handleFilterChange('assignmentNo', e.target.value)}
                      disabled={!filters.subjectName}
                    >
                      <option value="">All Assignments</option>
                      {assignments.map((assignment) => (
                        <option key={assignment.assignmentNo} value={assignment.assignmentNo}>
                          Assignment {assignment.assignmentNo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assignment Date (Auto-filled) */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Assignment Date
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      value={filters.assignmentDate}
                      readOnly
                      placeholder="Auto-filled"
                    />
                  </div>

                  {/* Max Marks (Auto-filled) */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Max Marks
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      value={filters.maxMarks}
                      readOnly
                      placeholder="Auto-filled"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button
                    type="button"
                    className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                    onClick={handleView}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'View'}
                  </button>
                  {showTable && (
                    <button
                      className="btn btn-outline-success radius-8 px-20 py-11"
                      onClick={() => window.print()}
                    >
                      <i className="fas fa-print me-2"></i> Print
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-secondary radius-8 px-20 py-11"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Data Table */}
            {showTable && (
              <div className="card h-100 p-0 radius-12">
                <div className="card-body p-24">
                  <DataTable
                    data={assignmentMarks}
                    columns={columns}
                    loading={loading}
                    error={error}
                    title="Assignment Marks Report"
                    enableExport={false}
                    enableSelection={false}
                    enableActions={false}
                    pageSize={10}
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

export default AssignmentReport;
