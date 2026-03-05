import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';

// ==================== CONSTANTS ====================
const LOGO_SRC = '/assets/images/GRT.png';
const WATERMARK_SRC = '/assets/images/GRT.png';

const PracticalMark = () => {
  const reportRef = useRef(null);

  // Load html2pdf library dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
    practicalNo: '',
    practicalDate: '',
    staffName: '',
    staffId: '',
    maxMarks: '',
    experimentCount: ''
  });

  // Master data state
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [practicals, setPracticals] = useState([]);
  const [staff, setStaff] = useState([]);

  // Table state
  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);  // Track current pagination page
  const [staffSearchInput, setStaffSearchInput] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/practicalMarks/courses');
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
          const response = await fetch(`/api/practicalMarks/departments?courseName=${encodeURIComponent(filters.courseName)}`);
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
          const response = await fetch(`/api/practicalMarks/semesters?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}`);
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
          const response = await fetch(`/api/practicalMarks/regulations?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}`);
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

  // Fetch sections when all prerequisites are selected
  useEffect(() => {
    const fetchSections = async () => {
      if (filters.courseName && filters.deptName && filters.semester && filters.regulation) {
        try {
          const response = await fetch(`/api/practicalMarks/sections?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}`);
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

  // Fetch subjects when all prerequisites including section are selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (filters.courseName && filters.deptName && filters.semester && filters.regulation && filters.section) {
        try {
          const response = await fetch(`/api/practicalMarks/subjects?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}&section=${encodeURIComponent(filters.section)}`);
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

  // Fetch practicals when subject is selected
  useEffect(() => {
    const fetchPracticals = async () => {
      if (filters.subjectName && filters.section) {
        try {
          const response = await fetch(`/api/practicalMarks/practicals?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}&section=${encodeURIComponent(filters.section)}&subjectName=${encodeURIComponent(filters.subjectName)}`);
          const data = await response.json();
          setPracticals(data);
        } catch (error) {
          console.error('Error fetching practicals:', error);
          toast.error('Failed to load practicals');
        }
      } else {
        setPracticals([]);
      }
    };
    fetchPracticals();
  }, [filters.courseName, filters.deptName, filters.semester, filters.regulation, filters.section, filters.subjectName]);

  // Fetch staff when course and department are selected
  useEffect(() => {
    const fetchStaff = async () => {
      if (filters.courseName && filters.deptName) {
        try {
          const response = await fetch(`/api/practicalMarks/staff?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}`);
          const data = await response.json();
          setStaff(data);
        } catch (error) {
          console.error('Error fetching staff:', error);
          toast.error('Failed to load staff');
        }
      } else {
        setStaff([]);
      }
    };
    fetchStaff();
  }, [filters.courseName, filters.deptName]);

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
        newFilters.section = '';
        newFilters.subjectName = '';
        newFilters.subjectCode = '';
        newFilters.practicalNo = '';
        newFilters.practicalDate = '';
        newFilters.staffName = '';
        newFilters.staffId = '';
        newFilters.experimentCount = '';
      }

      // Handle subject selection - auto-fill subject code
      if (name === 'subjectName') {
        const selectedSubject = subjects.find(s => s.subjectName === value);
        newFilters.subjectCode = selectedSubject ? selectedSubject.subjectCode : '';
        // Reset dependent fields
        newFilters.practicalNo = '';
        newFilters.practicalDate = '';
        newFilters.staffName = '';
        newFilters.staffId = '';
        newFilters.experimentCount = '';
      }

      // Handle practical number selection - auto-fill date, max marks and experiment count
      if (name === 'practicalNo') {
        const selectedPractical = practicals.find(p => p.testNo === parseInt(value));
        if (selectedPractical) {
          // Format date as YYYY-MM-DD for MySQL
          if (selectedPractical.assessmentDate) {
            const date = new Date(selectedPractical.assessmentDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            newFilters.practicalDate = `${year}-${month}-${day}`;
          } else {
            newFilters.practicalDate = '';
          }
          newFilters.maxMarks = selectedPractical.maxMarks || '';
          newFilters.experimentCount = selectedPractical.experimentCount || '';
        }
      }

      // Handle staff name selection - auto-fill staff ID
      if (name === 'staffName') {
        const selectedStaff = staff.find(s => s.staffName === value);
        newFilters.staffId = selectedStaff ? selectedStaff.staffId : '';
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
        newFilters.practicalNo = '';
        newFilters.practicalDate = '';
        newFilters.staffName = '';
        newFilters.staffId = '';
        newFilters.experimentCount = '';
      }

      return newFilters;
    });
  };

  // Handle view button click
  const handleView = async () => {
    if (!filters.courseName || !filters.deptName || !filters.semester ||
      !filters.regulation || !filters.section || !filters.subjectName ||
      !filters.practicalNo || !filters.staffName) {
      toast.error('Please fill all filter fields');
      return;
    }

    setLoading(true);
    try {
      // Fetch students and their marks (if any)
      const response = await fetch(`/api/practicalMarks/students?courseName=${encodeURIComponent(filters.courseName)}&deptName=${encodeURIComponent(filters.deptName)}&deptCode=${encodeURIComponent(filters.deptCode)}&semester=${encodeURIComponent(filters.semester)}&regulation=${encodeURIComponent(filters.regulation)}&section=${encodeURIComponent(filters.section)}&subjectCode=${encodeURIComponent(filters.subjectCode)}&testNo=${encodeURIComponent(filters.practicalNo)}&assessmentDate=${encodeURIComponent(filters.practicalDate)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      // Initialize experiments array for each student based on experiment count
      const experimentCount = parseInt(filters.experimentCount || 0);
      const studentsWithExperiments = data.map(student => {
        let experiments;
        if (student.existingExperiments) {
          experiments = student.existingExperiments.slice(0, experimentCount);
        } else {
          experiments = Array.from({ length: experimentCount }, () => ({ marks: '' }));
        }
        return {
          ...student,
          experiments: experiments
        };
      });
      setStudents(studentsWithExperiments);
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

  // Handle mark entry - useCallback to prevent recreation on every render
  const handleMarkChange = useCallback((registerNo, experimentNo, marks) => {
    setStudents(prev => prev.map(student => {
      if (student.registerNo === registerNo) {
        let updatedExperiments;

        // If 'A' or 'a' is entered in ANY experiment, mark ALL experiments as 'A'
        if (marks === 'A' || marks === 'a') {
          updatedExperiments = student.experiments.map(() => ({ marks: 'A' }));
        } else {
          // If a student was previously 'A' and now a number is entered, 
          // we might want to reset other experiments or just update this one.
          // Usually if they were absent, they are absent for the whole session.
          // But if they are editing, they might be correcting an 'A' to a number.
          updatedExperiments = student.experiments.map((exp, idx) => {
            if (idx === experimentNo - 1) return { ...exp, marks };
            // If the whole row was 'A', and we change one cell to a number, clear others or keep them?
            // Let's just update the specific cell unless it's 'A'.
            return exp.marks === 'A' ? { ...exp, marks: '' } : exp;
          });
        }

        // Calculate total and validate (only for numeric marks)
        const hasAbsent = updatedExperiments.some(exp => exp.marks === 'A');

        if (!hasAbsent) {
          const total = updatedExperiments.reduce((sum, exp) => {
            const mark = exp.marks === '' || exp.marks === null ? 0 : parseInt(exp.marks);
            return sum + mark;
          }, 0);

          if (total > 75) {
            toast.error('Total experiment marks should not exceed 75');
            return student;
          }
        }

        return {
          ...student,
          experiments: updatedExperiments
        };
      }
      return student;
    }));
    // Preserve current page when marks are updated
    setCurrentPage(prev => prev);
  }, []);

  // Handle update marks - Show preview
  const handleUpdate = async () => {
    // Set empty experiment marks to 0 by default
    const updatedStudents = students.map(s => ({
      ...s,
      experiments: s.experiments.map(exp => ({
        marks: exp.marks === '' || exp.marks === null ? '0' : exp.marks
      }))
    }));

    // Validate all marks are valid
    const invalidMarks = updatedStudents.some(student =>
      (student.experiments || []).some(exp => {
        if (exp.marks === 'A') return false; // Allow 'A'
        const numericMark = parseInt(exp.marks);
        return isNaN(numericMark) || numericMark < 0 || numericMark > parseInt(filters.maxMarks);
      })
    );

    if (invalidMarks) {
      toast.error(`Please enter valid marks (0-${filters.maxMarks}) or 'A' for Absent for all experiments`);
      return;
    }

    // Prepare preview data
    const preview = {
      courseName: filters.courseName,
      deptName: filters.deptName,
      deptCode: filters.deptCode,
      semester: filters.semester,
      regulation: filters.regulation,
      section: filters.section,
      subjectName: filters.subjectName,
      subjectCode: filters.subjectCode,
      practicalNo: filters.practicalNo,
      practicalDate: filters.practicalDate,
      maxMarks: filters.maxMarks,
      experimentCount: filters.experimentCount,
      staffName: filters.staffName,
      staffId: filters.staffId,
      students: updatedStudents.map(s => ({ ...s })),
      date: new Date().toLocaleDateString('en-GB')
    };

    setPreviewData(preview);
    setShowPreview(true);

    // Scroll to preview section
    setTimeout(() => {
      document.getElementById('preview-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Handle confirm submission
  const handleConfirmSubmission = () => {
    // Show confirmation toast
    toast(
      (t) => (
        <div className="d-flex gap-3">
          <div className="flex-shrink-0">
          </div>
          <div className="flex-grow-1">
            <p className="mb-2 fw-bold text-success" style={{ fontSize: '15px' }}>
              📝 Note: Marks can be updated if already entered.
            </p>
            <p className="mb-3 fw-semibold">Are you sure you want to save the marks?</p>
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => toast.dismiss(t.id)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  toast.dismiss(t.id);
                  submitMarks();
                }}
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          border: '2px solid #dc3545',
          background: '#fff',
          color: '#000',
          minWidth: '400px',
          pauseOnHover: true,
          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
        },
      }
    );
  };

  // A4 print handler adapted from AttendanceReport.jsx with professional spacing
  const handlePrint = useCallback(() => {
    const styleId = 'assignment-a4-print-style';

    // Remove old print style if exists
    const oldStyle = document.getElementById(styleId);
    if (oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = styleId;

    style.innerHTML = `
    @page {
      size: A4 portrait;
      margin: 14mm;
    }

    @media print {

      /* Hide everything */
      body * {
        visibility: hidden !important;
      }

      /* Show only final report */
      #final-report,
      #final-report * {
        visibility: visible !important;
      }

      /* Position report correctly */
      #final-report {
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Remove UI elements */
      .sidebar,
      .navbar,
      footer,
      .no-print {
        display: none !important;
      }

      /* Table styling safety */
      table {
        border-collapse: collapse !important;
        width: 100% !important;
      }

      th, td {
        border: 1px solid #000 !important;
        padding: 6px !important;
      }

      thead {
        display: table-header-group;
      }

      tr {
        page-break-inside: avoid;
      }

      img {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;

    document.head.appendChild(style);

    // Small delay ensures DOM + images are ready
    setTimeout(() => {
      window.print();

      // Cleanup after print
      setTimeout(() => {
        const s = document.getElementById(styleId);
        if (s) s.remove();
      }, 1000);
    }, 200);
  }, []);

  // Download PDF function
  const handleDownloadPDF = async () => {
    try {
      // Check if html2pdf is loaded
      if (!window.html2pdf) {
        toast.error('PDF library is still loading. Please try again in a moment.');
        return;
      }

      const element = document.getElementById('printable-report');

      if (!element) {
        toast.error('Report content not found');
        return;
      }

      const options = {
        margin: [10, 10, 10, 10],
        filename: `Practical_Report_${reportData.practicalNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      toast.loading('Generating PDF...');

      await window.html2pdf().set(options).from(element).save();

      toast.dismiss();
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF. Please try using the Print button instead.');
    }
  };

  // Submit marks function
  const submitMarks = async () => {

    try {
      setLoading(true);
      const response = await fetch('/api/practicalMarks/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: filters.courseName,
          deptCode: filters.deptCode,
          deptName: filters.deptName,
          semester: filters.semester,
          regulation: filters.regulation,
          section: filters.section,
          subjectCode: filters.subjectCode,
          subjectName: filters.subjectName,
          assessmentType: 'Practical',
          testNo: filters.practicalNo,
          assessmentDate: filters.practicalDate,
          staffName: filters.staffName,
          staffId: filters.staffId,
          experimentCount: filters.experimentCount,
          students: students.map(student => ({
            registerNo: student.registerNo,
            studentName: student.studentName,
            experiments: student.experiments.map(exp => ({
              marks: exp.marks === '' || exp.marks === null ? '0' : exp.marks
            }))
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save marks');
      }

      const result = await response.json();
      setIsSubmitted(true);
      setShowPreview(false);
      toast.success(result.message || 'Practical marks saved successfully');

      // Prepare final report data
      setReportData({
        courseName: filters.courseName,
        deptName: filters.deptName,
        deptCode: filters.deptCode,
        semester: filters.semester,
        regulation: filters.regulation,
        section: filters.section,
        subjectName: filters.subjectName,
        subjectCode: filters.subjectCode,
        practicalNo: filters.practicalNo,
        practicalDate: filters.practicalDate,
        maxMarks: filters.maxMarks,
        experimentCount: filters.experimentCount,
        staffName: filters.staffName,
        staffId: filters.staffId,
        students: students,
        date: new Date().toLocaleDateString('en-GB')
      });

      // Scroll to final report
      setTimeout(() => {
        document.getElementById('final-report')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error) {
      console.error('Error saving marks:', error);
      toast.error('Failed to save practical marks');
    } finally {
      setLoading(false);
    }
  };

  // Define table columns - useMemo to prevent recreation on every render
  const columns = React.useMemo(() => {
    const baseColumns = [
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
      }
    ];

    // Add dynamic experiment columns
    const experimentCount = parseInt(filters.experimentCount || 0);
    for (let i = 1; i <= experimentCount; i++) {
      baseColumns.push({
        accessorKey: `exp${i}`,
        header: `Exp ${i}`,
        cell: ({ row }) => {
          const handleExperimentMarkChange = (e) => {
            const value = e.target.value;

            // Allow empty string or 'A' / 'a'
            if (value === '' || value === 'A' || value === 'a') {
              handleMarkChange(row.original.registerNo, i, value.toUpperCase());
              return;
            }

            const numValue = parseFloat(value);

            if (!isNaN(numValue)) {
              if (numValue > filters.maxMarks) {
                toast.error(`Mark should be out of ${filters.maxMarks}`);
                return;
              }
              if (numValue < 0) {
                toast.error('Mark cannot be negative');
                return;
              }
              handleMarkChange(row.original.registerNo, i, value);
            }
          };

          return (
            <input
              type="text"
              value={row.original.experiments?.[i - 1]?.marks || ''}
              placeholder="0-max or A"
              className="form-control form-control-sm"
              style={{
                width: '70px',
                textAlign: 'center',
              }}
              onChange={handleExperimentMarkChange}
              disabled={isSubmitted}
            />
          );
        },
      });
    }

    // Add Total column at the end
    baseColumns.push({
      accessorKey: 'total',
      header: 'Total (out of 75)',
      cell: ({ row }) => {
        const isAbsent = row.original.experiments?.some(exp => exp.marks === 'A');

        if (isAbsent) {
          return <div className="fw-semibold text-center text-danger">A</div>;
        }

        const total = row.original.experiments?.reduce((sum, exp) => {
          const mark = exp.marks === '' || exp.marks === null ? 0 : parseInt(exp.marks);
          return sum + mark;
        }, 0) || 0;

        return (
          <div className="fw-semibold text-center" style={{
            color: total > 75 ? '#dc3545' : '#28a745',
            minWidth: '60px'
          }}>
            {total}
          </div>
        );
      },
    });

    return baseColumns;
  }, [filters.experimentCount, filters.maxMarks, isSubmitted, handleMarkChange]);

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
              <h6 className="fw-semibold mb-0">Practical Mark Entry</h6>
            </div>
            {/* Filter Card */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  {/* Course Name */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Course Name <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      name="courseName"
                      value={filters.courseName}
                      onChange={handleFilterChange}
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map((course, index) => (
                        <option key={index} value={course.courseName}>{course.courseName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department Name */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Department Name <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      name="deptName"
                      value={filters.deptName}
                      onChange={handleFilterChange}
                      required
                      disabled={!filters.courseName}
                    >
                      <option value="">
                        {!filters.courseName ? 'Select Course first' : 'Select Department'}
                      </option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept.deptName}>{dept.deptName}</option>
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
                      className="form-select"
                      name="semester"
                      value={filters.semester}
                      onChange={handleFilterChange}
                      required
                      disabled={!filters.deptName}
                    >
                      <option value="">
                        {!filters.deptName ? 'Select Department first' : 'Select Semester'}
                      </option>
                      {semesters.map((sem, index) => (
                        <option key={index} value={sem.semester}>{sem.semester}</option>
                      ))}
                    </select>
                  </div>

                  {/* Regulation */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Regulation <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      name="regulation"
                      value={filters.regulation}
                      onChange={handleFilterChange}
                      required
                      disabled={!filters.semester}
                    >
                      <option value="">
                        {!filters.semester ? 'Select Semester first' : 'Select Regulation'}
                      </option>
                      {regulations.map((reg, index) => (
                        <option key={index} value={reg.regulation}>{reg.regulation}</option>
                      ))}
                    </select>
                  </div>

                  {/* Class Section */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Class Section <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      name="section"
                      value={filters.section}
                      onChange={handleFilterChange}
                      required
                      disabled={!filters.regulation}
                    >
                      <option value="">
                        {!filters.regulation ? 'Select Regulation first' : 'Select Section'}
                      </option>
                      {sections.map((sec, index) => (
                        <option key={index} value={sec.section}>{sec.section}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Name */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Subject Name <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      name="subjectName"
                      value={filters.subjectName}
                      onChange={handleFilterChange}
                      required
                      disabled={!filters.section}
                    >
                      <option value="">
                        {!filters.section ? 'Select Section first' : 'Select Subject'}
                      </option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject.subjectName}>{subject.subjectName}</option>
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

                  {/* Practical Number */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Practical No <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      name="practicalNo"
                      value={filters.practicalNo}
                      onChange={handleFilterChange}
                      required
                      disabled={!filters.subjectName}
                    >
                      <option value="">
                        {!filters.subjectName ? 'Select Subject first' : 'Select Practical No'}
                      </option>
                      {practicals.map((practical, index) => (
                        <option key={index} value={practical.testNo}>
                          Practical {practical.testNo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Practical Date (Read-only) */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Practical Date</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.practicalDate}
                      readOnly
                    />
                  </div>

                  {/* Max Marks (Read-only) */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Max Marks</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.maxMarks}
                      readOnly
                    />
                  </div>

                  {/* Experiment Count (Read-only) */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Experiment Count</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.experimentCount}
                      readOnly
                    />
                  </div>

                  {/* Staff Name */}
                  {/* Staff Name - Searchable */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Staff Name <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Staff Name or ID"
                        value={staffSearchInput}
                        onChange={(e) => {
                          setStaffSearchInput(e.target.value);
                          setShowStaffDropdown(true);
                        }}
                        onFocus={() => setShowStaffDropdown(true)}
                        onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                        disabled={!filters.subjectName}
                        required
                      />
                      {filters.staffName && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y"
                          onClick={() => {
                            setFilters(prev => ({ ...prev, staffName: '', staffId: '' }));
                            setStaffSearchInput('');
                          }}
                          title="Clear selection"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                      {showStaffDropdown && staff.length > 0 && (
                        <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1000 }}>
                          {staff
                            .filter(s =>
                              s.staffName.toLowerCase().includes(staffSearchInput.toLowerCase()) ||
                              s.staffId.toLowerCase().includes(staffSearchInput.toLowerCase())
                            )
                            .map((s, index) => (
                              <button
                                key={index}
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, staffName: s.staffName, staffId: s.staffId }));
                                  setStaffSearchInput(s.staffName);
                                  setShowStaffDropdown(false);
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <div className="fw-semibold">{s.staffName}</div>
                                    <div className="small text-muted">{s.staffId}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Staff ID (Read-only) */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Staff ID</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={filters.staffId}
                      readOnly
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12">
                    <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                      <button
                        type="button"
                        className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                        onClick={handleView}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Marks Table */}
            {showTable && (
              <div className="card">
                <div className="card-body">
                  <DataTable
                    data={students}
                    columns={columns}
                    loading={loading}
                    error={error}
                    title="Practical Marks Entry"
                    enableSelection={false}
                    enableActions={false}
                    pageSize={20}
                    pageIndex={currentPage}
                    onPageIndexChange={setCurrentPage}
                  />

                  {/* Update Button */}
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-outline-success radius-8 px-20 py-11"
                      onClick={handleUpdate}
                      disabled={isSubmitted}
                    >
                      {isSubmitted ? 'SUBMITTED' : 'UPDATE'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Report Section */}
            {showPreview && previewData && (
              <div id="preview-section" className="card mt-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3 no-print">
                    <h5 className="fw-bold mb-0">Preview - Practical Report</h5>
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={handleConfirmSubmission}
                    >
                      <Icon icon="solar:check-circle-outline" className="me-1" />
                      Confirm & Submit
                    </button>
                  </div>

                  {/* A4 Print Content */}
                  <div className="assessment-a4-container">
                    <div className="assessment-a4-border">
                      <div className="assessment-a4-inner" style={{ position: 'relative', fontFamily: "'Times New Roman', Times, serif" }}>
                        {/* Watermark */}
                        <img
                          src={WATERMARK_SRC}
                          alt="Watermark"
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "48%",
                            transform: "translate(-50%, -50%)",
                            width: "40%",
                            height: "40%",
                            opacity: 0.08,
                            zIndex: 0,
                            pointerEvents: "none",
                            userSelect: "none",
                          }}
                          draggable={false}
                        />

                        {/* Header */}
                        <div style={{ zIndex: 2, position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ width: 110 }}>
                              <img
                                src={LOGO_SRC}
                                alt="GRT Logo"
                                style={{ width: 100, height: 100, objectFit: 'contain', display: 'block' }}
                                draggable={false}
                              />
                            </div>

                            <div style={{ flex: 1, textAlign: 'center', paddingTop: 6 }}>
                              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                                GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#222', lineHeight: 1.05 }}>
                                GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                                <br />
                                Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                              </div>
                            </div>

                            <div style={{ width: 110 }} />
                          </div>
                        </div>

                        <div style={{ marginTop: 16, zIndex: 2, position: 'relative' }}>
                          {/* Report Title */}
                          <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, marginBottom: 12, textDecoration: 'underline' }}>
                            PRACTICAL REPORT
                          </div>

                          {/* Report Info */}
                          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 12 }}>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Sem-Course:</strong> {previewData.semester} - {previewData.deptName} ({previewData.deptCode})
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Subject:</strong> {previewData.subjectCode} - {previewData.subjectName}
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Class:</strong> {previewData.section || 'N/A'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span><strong>Practical Number:</strong> {previewData.practicalNo}</span>
                              <span><strong>Practical Date:</strong> {new Date(previewData.practicalDate).toLocaleDateString('en-GB')}</span>
                              <span><strong>Staff Name:</strong> {previewData.staffName} ({previewData.staffId})</span>
                            </div>
                          </div>

                          {/* Table */}
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, border: '1px solid #000' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#e0e0e0' }}>
                                <th style={{ width: '80px', border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>RollNo</th>
                                <th style={{ width: '120px', border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>RegNo</th>
                                <th style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>Student Name</th>
                                {/* Dynamic experiment columns */}
                                {Array.from({ length: parseInt(previewData.experimentCount || 0) }, (_, i) => (
                                  <th key={`exp-${i}`} style={{ width: '60px', border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Exp {i + 1}</th>
                                ))}
                                {/* Total column */}
                                <th style={{ width: '80px', border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {previewData.students.map((student, index) => {
                                const rollNo = student.rollNo || `${previewData.semester}${String(previewData.deptCode || '').replace('PHARM', 'DF')}${String(index + 1).padStart(2, '0')}`;

                                // Calculate total marks
                                const isAbsent = student.experiments?.some(exp => exp.marks === 'A');

                                const totalMarks = isAbsent ? 'A' : (student.experiments ?
                                  student.experiments.reduce((sum, exp) => {
                                    const marks = parseInt(exp.marks) || 0;
                                    return sum + marks;
                                  }, 0) : 0);

                                return (
                                  <tr key={index}>
                                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{rollNo}</td>
                                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{student.registerNo}</td>
                                    <td style={{ border: '1px solid #000', padding: '6px' }}>{student.studentName}</td>
                                    {/* Experiment marks */}
                                    {student.experiments && student.experiments.map((exp, expIdx) => (
                                      <td key={`exp-${expIdx}`} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{exp.marks || '0'}</td>
                                    ))}
                                    {/* Total */}
                                    <td style={{
                                      border: '1px solid #000',
                                      padding: '6px',
                                      textAlign: 'center',
                                      backgroundColor: totalMarks === 'A' || totalMarks > 75 ? '#ffcccc' : '#ccffcc',
                                      fontWeight: 'bold'
                                    }}>{totalMarks}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Final Report - After Submission */}
            {reportData && isSubmitted && (
              <div id="final-report" className="card mt-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3 no-print">
                    <h6 className="fw-bold mb-0 text-success fs-5">
                      <Icon icon="solar:check-circle-bold" className="me-2" />
                      Practical Report - Submitted Successfully
                    </h6>
                    <button type="button" className="btn btn-outline-primary" onClick={handlePrint}>
                      <Icon icon="solar:printer-outline" className="me-1" />
                      Print
                    </button>
                  </div>

                  {/* A4 Print Content */}
                  <div id="printable-report" className="assessment-a4-container">
                    <div className="assessment-a4-border">
                      <div className="assessment-a4-inner" style={{ position: 'relative', fontFamily: "'Times New Roman', Times, serif" }}>
                        {/* Watermark */}
                        <img
                          src={WATERMARK_SRC}
                          alt="Watermark"
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "48%",
                            transform: "translate(-50%, -50%)",
                            width: "40%",
                            height: "40%",
                            opacity: 0.08,
                            zIndex: 0,
                            pointerEvents: "none",
                            userSelect: "none",
                          }}
                          draggable={false}
                        />

                        {/* Header */}
                        <div style={{ zIndex: 2, position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ width: 110 }}>
                              <img
                                src={LOGO_SRC}
                                alt="GRT Logo"
                                style={{ width: 100, height: 100, objectFit: 'contain', display: 'block' }}
                                draggable={false}
                              />
                            </div>

                            <div style={{ flex: 1, textAlign: 'center', paddingTop: 6 }}>
                              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                                GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#222', lineHeight: 1.05 }}>
                                GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                                <br />
                                Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                              </div>
                            </div>

                            <div style={{ width: 110 }} />
                          </div>
                        </div>

                        <div style={{ marginTop: 16, zIndex: 2, position: 'relative' }}>
                          {/* Report Title */}
                          <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, marginBottom: 12, textDecoration: 'underline' }}>
                            PRACTICAL REPORT
                          </div>

                          {/* Report Info */}
                          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 12 }}>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Sem-Course:</strong> {reportData.semester} - {reportData.deptName} ({reportData.deptCode})
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Subject:</strong> {reportData.subjectCode} - {reportData.subjectName}
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Class/Section:</strong> {reportData.section || 'N/A'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span><strong>Practical Number:</strong> {reportData.practicalNo}</span>
                              <span><strong>Practical Date:</strong> {new Date(reportData.practicalDate).toLocaleDateString('en-GB')}</span>
                              <span><strong>Staff Name:</strong> {reportData.staffName}</span>
                            </div>
                          </div>

                          {/* Table */}
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, border: '1px solid #000' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#e0e0e0' }}>
                                <th style={{ textAlign: 'center', padding: '6px', border: '1px solid #000', fontWeight: 'bold', width: '80px' }}>RollNo</th>
                                <th style={{ textAlign: 'center', padding: '6px', border: '1px solid #000', fontWeight: 'bold', width: '120px' }}>RegNo</th>
                                <th style={{ padding: '6px', border: '1px solid #000', fontWeight: 'bold' }}>Student Name</th>
                                {/* Dynamic experiment columns */}
                                {Array.from({ length: parseInt(reportData.experimentCount || 0) }, (_, i) => (
                                  <th key={`exp-${i}`} style={{ textAlign: 'center', padding: '6px', border: '1px solid #000', fontWeight: 'bold', width: '60px' }}>Exp {i + 1}</th>
                                ))}
                                {/* Total column */}
                                <th style={{ textAlign: 'center', padding: '6px', border: '1px solid #000', fontWeight: 'bold', width: '80px' }}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.students.map((student, index) => {
                                const rollNo = student.rollNo || `${reportData.semester}${String(reportData.deptCode || '').replace('PHARM', 'DF')}${String(index + 1).padStart(2, '0')}`;

                                // Calculate total marks from experiments
                                const isAbsent = student.experiments?.some(exp => exp.marks === 'A');

                                const totalMarks = isAbsent ? 'A' : (student.experiments ?
                                  student.experiments.reduce((sum, exp) => {
                                    const marks = parseInt(exp.marks) || 0;
                                    return sum + marks;
                                  }, 0) : 0);

                                return (
                                  <tr key={index}>
                                    <td style={{ textAlign: 'center', padding: '6px', border: '1px solid #000' }}>{rollNo}</td>
                                    <td style={{ textAlign: 'center', padding: '6px', border: '1px solid #000' }}>{student.registerNo}</td>
                                    <td style={{ padding: '6px', border: '1px solid #000' }}>{student.studentName}</td>
                                    {/* Experiment marks */}
                                    {student.experiments && student.experiments.map((exp, expIdx) => (
                                      <td key={`exp-${expIdx}`} style={{ textAlign: 'center', padding: '6px', border: '1px solid #000' }}>{exp.marks || '0'}</td>
                                    ))}
                                    {/* Total */}
                                    <td style={{
                                      textAlign: 'center',
                                      padding: '6px',
                                      border: '1px solid #000',
                                      backgroundColor: totalMarks === 'A' || totalMarks > 75 ? '#ffcccc' : '#ccffcc',
                                      fontWeight: 'bold'
                                    }}>{totalMarks}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>

      {/* Print Styles */}
      <style>{`
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default PracticalMark;
