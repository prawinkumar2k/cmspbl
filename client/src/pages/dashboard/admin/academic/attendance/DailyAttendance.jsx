import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Icon } from "@iconify/react";
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';

// const API_BASE_URL = 'http://localhost:5000/api/dailyAttendance';

const INITIAL_FORM_STATE = {
  date: new Date().toISOString().split('T')[0],
  dayOrder: '',
  staffName: '',
  staffId: '',
  department: '',
  departmentCode: '',
  semester: '',
  regulation: '',
  subjects: [], // Changed to array for multiple selection
  periods: [], // Changed to array for multiple selection
  classSection: ''
};

const PERIODS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6'
];

const classes = [
  'A',
  'B',
  'C',
  'D'
];

const DailyAttendance = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
    onDuty: 0,
    medicalLeave: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // State for dropdown data from backend
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availablePeriods, setAvailablePeriods] = useState([]); // Dynamic periods from timetable
  const [loading, setLoading] = useState(false);
  const [staffSearchInput, setStaffSearchInput] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);

  // Ref to track which dates have already shown the "no day order" toast
  const shownToastDatesRef = useRef(new Set());

  // Fetch initial dropdown data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [staffRes, semRes, regRes] = await Promise.all([
          fetch(`/api/dailyAttendance/staff/all`),
          fetch(`/api/dailyAttendance/semesters`),
          fetch(`/api/dailyAttendance/regulations`)
        ]);

        const staffData = await staffRes.json();
        const semData = await semRes.json();
        const regData = await regRes.json();

        setStaffList(staffData);
        setSemesters(semData);
        setRegulations(regData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load form data. Please refresh the page.', { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch day order when date changes
  useEffect(() => {
    const fetchDayOrder = async () => {
      if (form.date) {
        try {
          const response = await fetch(`/api/dailyAttendance/dayorder?date=${form.date}`);
          const data = await response.json();
          if (data.dayOrder) {
            setForm(prev => ({ ...prev, dayOrder: data.dayOrder }));
          } else {
            setForm(prev => ({ ...prev, dayOrder: '' }));
            // Only show toast if we haven't already shown it for this date
            if (!shownToastDatesRef.current.has(form.date)) {
              toast.info('No day order configured for this date.', { autoClose: 2000 });
              shownToastDatesRef.current.add(form.date);
            }
          }
        } catch (error) {
          console.error('Error fetching day order:', error);
          setForm(prev => ({ ...prev, dayOrder: '' }));
        }
      }
    };

    fetchDayOrder();
  }, [form.date]);

  // Fetch staff ID and departments when staff name is selected
  useEffect(() => {
    const fetchStaffData = async () => {
      if (!form.staffName) {
        setForm(prev => ({ ...prev, staffId: '', department: '', departmentCode: '' }));
        setDepartments([]);
        return;
      }

      try {
        // Find staff ID from staffList
        const selectedStaff = staffList.find(staff => staff.Staff_Name === form.staffName);
        if (selectedStaff) {
          setForm(prev => ({ ...prev, staffId: selectedStaff.Staff_ID }));

          // Fetch departments handled by this staff
          const response = await fetch(`/api/dailyAttendance/departments/bystaff?staffId=${selectedStaff.Staff_ID}`);
          const deptData = await response.json();
          setDepartments(deptData);
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast.error('Failed to fetch staff departments', { autoClose: 2000 });
      }
    };

    fetchStaffData();
  }, [form.staffName, staffList]);

  // Fetch subjects when all required fields are selected (from timetable_period)
  useEffect(() => {
    const fetchSubjects = async () => {
      if (form.staffId && form.departmentCode && form.semester && form.regulation && form.date && form.dayOrder && form.classSection) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/dailyAttendance/subjects?staffId=${form.staffId}&deptCode=${form.departmentCode}&semester=${form.semester}&regulation=${form.regulation}&date=${form.date}&dayOrder=${form.dayOrder}&classSection=${form.classSection}`
          );
          const data = await response.json();

          // Check if response is ok
          if (!response.ok) {
            console.error('Server error fetching subjects:', data);
            setSubjects([]);
            toast.error(data.details || data.error || 'Failed to fetch subjects', { autoClose: 3000 });
            return;
          }

          // Ensure data is an array
          if (Array.isArray(data)) {
            setSubjects(data);
          } else {
            console.error('Invalid response format for subjects:', data);
            setSubjects([]);
            if (data.error) {
              toast.error(data.error, { autoClose: 3000 });
            }
          }
        } catch (error) {
          console.error('Error fetching subjects:', error);
          toast.error('Failed to load subjects: ' + error.message, { autoClose: 3000 });
          setSubjects([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, [form.staffId, form.departmentCode, form.semester, form.regulation, form.date, form.dayOrder, form.classSection]);

  // Fetch periods dynamically when subjects are selected (from timetable_period)
  useEffect(() => {
    const fetchPeriods = async () => {
      if (form.subjects.length > 0 && form.date && form.dayOrder && form.staffId && form.departmentCode && form.semester && form.regulation && form.classSection) {
        try {
          setLoading(true);
          // Fetch periods for the first selected subject (you can modify this logic if needed)
          const subjectCode = form.subjects[0].code;
          const response = await fetch(
            `/api/dailyAttendance/periods?date=${form.date}&dayOrder=${form.dayOrder}&staffId=${form.staffId}&subjectCode=${subjectCode}&deptCode=${form.departmentCode}&semester=${form.semester}&regulation=${form.regulation}&classSection=${form.classSection}`
          );
          const data = await response.json();

          if (Array.isArray(data)) {
            setAvailablePeriods(data.map(p => p.period_no));
          } else {
            console.error('Invalid response format for periods:', data);
            setAvailablePeriods([]);
            if (data.error) {
              toast.error(data.error);
            }
          }
        } catch (error) {
          console.error('Error fetching periods:', error);
          toast.error('Failed to load periods.', { autoClose: 2000 });
          setAvailablePeriods([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAvailablePeriods([]);
      }
    };

    fetchPeriods();
  }, [form.subjects, form.date, form.dayOrder, form.staffId, form.departmentCode, form.semester, form.regulation, form.classSection]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Handle department selection - set both name and code
    if (name === 'department') {
      const selectedDept = departments.find(d => d.Dept_Name === value);
      setForm(prev => ({
        ...prev,
        department: value,
        departmentCode: selectedDept ? selectedDept.Dept_Code : ''
      }));
    }
    else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [departments]);

  // Handle subject checkbox change
  const handleSubjectChange = useCallback((subjectCode, subjectName, checked) => {
    setForm(prev => {
      const newSubjects = checked
        ? [...prev.subjects, { code: subjectCode, name: subjectName }]
        : prev.subjects.filter(s => s.code !== subjectCode);

      return { ...prev, subjects: newSubjects };
    });
  }, []);

  // Handle period checkbox change
  const handlePeriodChange = useCallback((period, checked) => {
    setForm(prev => {
      const newPeriods = checked
        ? [...prev.periods, period]
        : prev.periods.filter(p => p !== period);

      return { ...prev, periods: newPeriods };
    });
  }, []);

  // Fetch students from backend
  const fetchStudents = useCallback(async () => {
    if (!form.departmentCode || !form.semester || !form.regulation || !form.classSection) {
      toast.error('Please select department, semester, regulation, and class first.', { autoClose: 2000 });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/dailyAttendance/students?deptCode=${form.departmentCode}&semester=${form.semester}&regulation=${form.regulation}&classSection=${form.classSection}`
      );
      const data = await response.json();

      if (data.length === 0) {
        toast.info('No students found for the selected criteria.', { autoClose: 2000 });
      }

      setStudentsData(data);

      // Initialize attendance status for all students using Register_Number as unique identifier
      const initialStatus = {};
      data.forEach(student => {
        const studentId = student.Register_Number || student.Student_ID || student.id;
        initialStatus[studentId] = null;
      });
      setAttendanceStatus(initialStatus);

      // Reset counts
      setAttendanceCounts({ present: 0, absent: 0, onDuty: 0, medicalLeave: 0 });
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students.', { autoClose: 2000 });
      setStudentsData([]);
    } finally {
      setLoading(false);
    }
  }, [form.departmentCode, form.semester, form.regulation, form.classSection]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!form.date) {
      toast.error('Please select a date', { autoClose: 2000 });
      return;
    }

    if (!form.staffName.trim()) {
      toast.error('Please select a staff name', { autoClose: 2000 });
      return;
    }

    if (!form.department.trim()) {
      toast.error('Please select a department', { autoClose: 2000 });
      return;
    }

    if (!form.semester.trim()) {
      toast.error('Please select a semester', { autoClose: 2000 });
      return;
    }

    if (!form.regulation.trim()) {
      toast.error('Please select a regulation', { autoClose: 2000 });
      return;
    }

    if (!form.classSection.trim()) {
      toast.error('Please select a class', { autoClose: 2000 });
      return;
    }

    if (form.subjects.length === 0) {
      toast.error('Please select at least one subject', { autoClose: 2000 });
      return;
    }

    if (form.periods.length === 0) {
      toast.error('Please select at least one period', { autoClose: 2000 });
      return;
    }

    toast.success('Attendance criteria set successfully! Loading students...', { autoClose: 2000 });

    // Fetch students from backend and show attendance taking interface
    await fetchStudents();
    setShowAttendanceList(true);
  }, [form, fetchStudents]);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setShowAttendanceList(false);
    setStudentsData([]);
    setAttendanceStatus({});
    setAttendanceCounts({ present: 0, absent: 0, onDuty: 0, medicalLeave: 0 });
    setSearchTerm('');
    setStatusFilter('');
    // toast.success('Form reset successfully!', { autoClose: 2000 });
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Filter students based on search term and status filter
  const filteredStudents = useMemo(() => {
    let filtered = [...studentsData];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(student => {
        const name = (student.Student_Name || student.name || '').toLowerCase();
        const regNo = (student.Register_Number || '').toLowerCase();
        return name.includes(searchLower) || regNo.includes(searchLower);
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(student => {
        const studentId = student.Register_Number || student.Student_ID || student.id;
        if (statusFilter === 'unmarked') {
          return !attendanceStatus[studentId];
        } else {
          return attendanceStatus[studentId] === statusFilter;
        }
      });
    }

    return filtered;
  }, [studentsData, searchTerm, statusFilter, attendanceStatus]);

  // Handle attendance status change for individual student
  const handleAttendanceChange = useCallback((studentId, status) => {
    setAttendanceStatus(prev => {
      const newStatus = { ...prev, [studentId]: status };

      // Update counts
      const counts = { present: 0, absent: 0, onDuty: 0, medicalLeave: 0 };
      Object.values(newStatus).forEach(s => {
        if (s === 'present') counts.present++;
        else if (s === 'absent') counts.absent++;
        else if (s === 'onDuty') counts.onDuty++;
        else if (s === 'medicalLeave') counts.medicalLeave++;
      });

      setAttendanceCounts(counts);
      return newStatus;
    });
  }, []);

  // Check if all students are marked as present
  const allMarkedPresent = useMemo(() => {
    if (studentsData.length === 0) return false;
    return studentsData.every(student => {
      const studentId = student.Register_Number || student.Student_ID || student.id;
      return attendanceStatus[studentId] === 'present';
    });
  }, [studentsData, attendanceStatus]);

  // Toggle mark all students as present / unmark all
  const handleMarkAllPresent = useCallback(() => {
    if (allMarkedPresent) {
      // Unmark all - clear all statuses
      const clearedStatus = {};
      studentsData.forEach(student => {
        const studentId = student.Register_Number || student.Student_ID || student.id;
        clearedStatus[studentId] = null;
      });

      setAttendanceStatus(clearedStatus);
      setAttendanceCounts({
        present: 0,
        absent: 0,
        onDuty: 0,
        medicalLeave: 0
      });

      toast.success('All attendance statuses cleared!', { autoClose: 2000 });
    } else {
      // Mark all as present
      const allPresentStatus = {};
      studentsData.forEach(student => {
        const studentId = student.Register_Number || student.Student_ID || student.id;
        allPresentStatus[studentId] = 'present';
      });

      setAttendanceStatus(allPresentStatus);
      setAttendanceCounts({
        present: studentsData.length,
        absent: 0,
        onDuty: 0,
        medicalLeave: 0
      });

      toast.success('All students marked as present!', { autoClose: 2000 });
    }
  }, [studentsData, allMarkedPresent]);

  // Submit attendance (now supports multiple subjects with multiple periods)
  const handleSubmitAttendance = useCallback(async () => {
    try {
      // Send one record per subject with comma-separated periods
      const promises = [];

      form.subjects.forEach(subject => {
        const attendanceData = {
          date: form.date,
          dayOrder: form.dayOrder,
          department: form.department,
          departmentCode: form.departmentCode,
          semester: form.semester,
          regulation: form.regulation,
          classSection: form.classSection,
          subject: subject.name,
          subjectCode: subject.code,
          staffId: form.staffId,
          staffName: form.staffName,
          period: form.periods.join(','), // Comma-separated periods
          attendance: studentsData.map(student => {
            const studentId = student.Register_Number || student.Student_ID || student.id;
            return {
              studentId: studentId,
              regNo: student.Register_Number,
              name: student.Student_Name || student.name,
              status: attendanceStatus[studentId] || null
            };
          }),
          summary: attendanceCounts
        };

        console.log('Sending attendance for subject:', subject.name, 'periods:', form.periods.join(','));

        promises.push(
          fetch(`/api/dailyAttendance/attendance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(attendanceData),
          }).then(async response => {
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Server error response:', errorData);
              throw new Error(errorData.details || errorData.error || 'Failed to save attendance');
            }
            return response;
          })
        );
      });

      setLoading(true);
      const responses = await Promise.all(promises);

      // Check if all requests were successful
      const allSuccessful = responses.every(res => res.ok);

      if (allSuccessful) {
        toast.success(`Attendance saved successfully for ${form.subjects.length} subject(s) with ${form.periods.length} period(s)!`);
        // Reset form after successful submission
        handleReset();
      } else {
        toast.error('Failed to save attendance for some records', { autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error(`Failed to save attendance: ${error.message}`, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  }, [form, studentsData, attendanceStatus, attendanceCounts, handleReset]);

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
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Daily Attendance</h6>
            </div>

            {/* Hidden Print Content */}
            <div id="attendance-print-content" style={{ display: 'none' }}>
              <div className="page-inner" style={{ width: '210mm', minHeight: '297mm', padding: '12mm', background: '#fff' }}>
                {/* HEADER */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ width: 100 }}>
                    <img src="/assets/images/GRT.png" alt="logo" style={{ width: 80, height: 80, objectFit: "contain" }} />
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: "800", textTransform: "uppercase" }}>
                      GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "600" }}>
                      GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                    </div>
                    <div style={{ fontSize: "11px" }}>
                      Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                    </div>
                  </div>
                  <div style={{ width: 100 }}></div>
                </div>

                <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "800", textDecoration: "underline", marginBottom: "20px" }}>
                  DAILY ATTENDANCE REPORT
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '12px' }}>
                  <div>
                    <div><strong>Date:</strong> {new Date(form.date).toLocaleDateString()}</div>
                    <div><strong>Day Order:</strong> {form.dayOrder || 'N/A'}</div>
                    <div><strong>Staff:</strong> {form.staffName} ({form.staffId})</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div><strong>Dept:</strong> {form.department}</div>
                    <div><strong>Sem/Class:</strong> {form.semester} / {form.classSection}</div>
                    <div><strong>Subjects:</strong> {form.subjects.map(s => s.code).join(', ')}</div>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>S.No</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Reg No</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Student Name</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData.map((s, idx) => (
                      <tr key={s.Register_Number || s.Student_ID}>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '5px' }}>{s.Register_Number}</td>
                        <td style={{ border: '1px solid #000', padding: '5px' }}>{s.Student_Name || s.name}</td>
                        <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center', fontWeight: 'bold' }}>
                          {(attendanceStatus[s.Register_Number || s.Student_ID] || '-').toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: '20px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>Summary:</strong>
                    <div>Present: {attendanceCounts.present} | Absent: {attendanceCounts.absent}</div>
                    <div>OD: {attendanceCounts.onDuty} | ML: {attendanceCounts.medicalLeave}</div>
                  </div>
                  <div style={{ marginTop: '40px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>Staff Signature</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">

                <div>
                  <h6 className="text-lg fw-semibold mb-2">Take Daily Attendance</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Select class details to proceed with attendance taking
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${showAttendanceList ? 'btn-success' : 'btn-outline-info'}`}
                    onClick={() => setShowAttendanceList(!showAttendanceList)}
                    title={showAttendanceList ? 'Hide Attendance List' : 'Show Attendance List'}
                  >
                    <i className={`fas ${showAttendanceList ? 'fa-eye-slash' : 'fa-users'} me-1`}></i>
                    {showAttendanceList ? 'Hide Students' : 'View Students'}
                  </button>
                </div>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                  {/* Attendance Form */}
                  <div className="mb-24">

                    {/* Attendance Form Bar */}
                    <div className="p-20 mb-20 rounded">
                      <div className="row g-20 align-items-end">

                        {/* Date Field */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Date <span className="text-danger">*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type="date"
                              name="date"
                              value={form.date}
                              onChange={handleChange}
                              className="form-control radius-8"
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                color: '#333'
                              }}
                              required
                            />
                          </div>
                        </div>

                        {/* Day Order (Auto-fetched) */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Day Order <span className="text-danger">*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type="text"
                              name="dayOrder"
                              value={form.dayOrder}
                              className="form-control radius-8"
                              style={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #ddd',
                                color: '#333'
                              }}
                              readOnly
                              placeholder="Auto-fetched from calendar"
                            />
                          </div>
                        </div>

                        {/* Staff Name Searchable Dropdown */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Staff Name <span className="text-danger">*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control radius-8"
                              placeholder="Search Staff Name or ID"
                              value={staffSearchInput}
                              onChange={(e) => {
                                setStaffSearchInput(e.target.value);
                                setShowStaffDropdown(true);
                              }}
                              onFocus={() => setShowStaffDropdown(true)}
                              onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                              disabled={loading}
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                color: '#333'
                              }}
                              required
                            />
                            {form.staffName && (
                              <button
                                type="button"
                                className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => {
                                  setForm(prev => ({ ...prev, staffName: '', staffId: '' }));
                                  setStaffSearchInput('');
                                }}
                                title="Clear selection"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                            {showStaffDropdown && staffList.length > 0 && (
                              <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1000 }}>
                                {staffList
                                  .filter(staff =>
                                    staff.Staff_ID.toLowerCase().includes(staffSearchInput.toLowerCase()) ||
                                    staff.Staff_Name.toLowerCase().includes(staffSearchInput.toLowerCase())
                                  )
                                  .map((staff) => (
                                    <button
                                      key={staff.Staff_ID}
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => {
                                        setForm(prev => ({ ...prev, staffName: staff.Staff_Name, staffId: staff.Staff_ID }));
                                        setStaffSearchInput(staff.Staff_Name);
                                        setShowStaffDropdown(false);
                                      }}
                                    >
                                      <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                          <div className="fw-semibold">{staff.Staff_Name}</div>
                                          <div className="small text-muted">{staff.Staff_ID}</div>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Staff ID (Auto-filled) */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Staff ID
                          </label>
                          <input
                            type="text"
                            name="staffId"
                            value={form.staffId}
                            className="form-control radius-8"
                            style={{
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                            readOnly
                            placeholder="Auto-filled"
                          />
                        </div>

                        {/* Department Dropdown (Filtered by Staff) */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Department <span className="text-danger">*</span>
                          </label>
                          <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            className="form-select radius-8"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                            required
                            disabled={loading || !form.staffName}
                          >
                            <option value="">
                              {!form.staffName ? 'Select Staff first' : 'Select Department'}
                            </option>
                            {departments.map(dept => (
                              <option key={dept.Dept_Code} value={dept.Dept_Name}>
                                {dept.Dept_Name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Department Code (Auto-filled) */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Department Code
                          </label>
                          <input
                            type="text"
                            name="departmentCode"
                            value={form.departmentCode}
                            className="form-control radius-8"
                            style={{
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                            readOnly
                            placeholder="Auto-filled"
                          />
                        </div>

                        {/* Semester Dropdown */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Semester <span className="text-danger">*</span>
                          </label>
                          <select
                            name="semester"
                            value={form.semester}
                            onChange={handleChange}
                            className="form-select radius-8"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                            required
                            disabled={loading || !form.department}
                          >
                            <option value="">Select Semester</option>
                            {semesters.map(sem => (
                              <option key={sem.id} value={sem.Semester}>
                                {sem.Semester}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Regulation Dropdown */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Regulation <span className="text-danger">*</span>
                          </label>
                          <select
                            name="regulation"
                            value={form.regulation}
                            onChange={handleChange}
                            className="form-select radius-8"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                            required
                            disabled={loading || !form.semester}
                          >
                            <option value="">Select Regulation</option>
                            {regulations.map(reg => (
                              <option key={reg.id} value={reg.Regulation}>
                                {reg.Regulation}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Class Selection */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Class <span className="text-danger">*</span>
                          </label>
                          <select
                            name="classSection"
                            value={form.classSection}
                            onChange={handleChange}
                            className="form-select radius-8"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                            required
                            disabled={loading || !form.regulation}
                          >
                            <option value="">Select Class</option>
                            {classes.map(cls => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Subject Checkboxes */}
                        <div className="col-12">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Subjects <span className="text-danger">*</span> (Select multiple)
                          </label>
                          <div
                            className="p-3 border rounded"
                            style={{
                              backgroundColor: '#f8f9fa',
                              maxHeight: '220px',
                              overflowY: 'auto',
                              border: '2px solid #e0e0e0 !important'
                            }}
                          >
                            {!Array.isArray(subjects) || subjects.length === 0 ? (
                              <div className="text-center py-4">
                                <i className="fas fa-book-open text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                                <p className="text-muted mb-0 fw-medium">
                                  {!form.staffId || !form.departmentCode || !form.semester || !form.regulation || !form.date || !form.dayOrder || !form.classSection
                                    ? 'Select Date, Day Order, Staff, Department, Semester, Regulation & Class first'
                                    : 'No subjects available in timetable for this criteria'}
                                </p>
                              </div>
                            ) : (
                              <div className="row g-2">
                                {subjects.map(subject => (
                                  <div key={subject.Sub_Code} className="col-12 col-md-6 col-lg-4">
                                    <div
                                      className={`form-check p-3 rounded ${form.subjects.some(s => s.code === subject.Sub_Code) ? 'bg-primary bg-opacity-10 border-primary' : 'bg-white'}`}
                                      style={{
                                        border: form.subjects.some(s => s.code === subject.Sub_Code)
                                          ? '2px solid #0d6efd'
                                          : '1px solid #dee2e6',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-2"
                                        id={`subject-${subject.Sub_Code}`}
                                        checked={form.subjects.some(s => s.code === subject.Sub_Code)}
                                        onChange={(e) => {
                                          handleSubjectChange(subject.Sub_Code, subject.Sub_Name, e.target.checked);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                      />
                                      <label
                                        className="form-check-label fw-medium"
                                        htmlFor={`subject-${subject.Sub_Code}`}
                                        style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                      >
                                        <div className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>
                                          {subject.Sub_Code}
                                        </div>
                                        <div className="text-dark" style={{ fontSize: '0.875rem', lineHeight: '1.3' }}>
                                          {subject.Sub_Name}
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {form.subjects.length > 0 && (
                            <div className="mt-3 p-2 bg-success bg-opacity-10 border border-success rounded">
                              <i className="fas fa-check-circle text-success me-2"></i>
                              <span className="fw-semibold text-success">
                                {form.subjects.length} subject{form.subjects.length > 1 ? 's' : ''} selected
                              </span>
                              <span className="text-muted ms-2" style={{ fontSize: '0.875rem' }}>
                                ({form.subjects.map(s => s.code).join(', ')})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Period Checkboxes */}
                        <div className="col-12">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Periods <span className="text-danger">*</span> (Select multiple)
                          </label>
                          <div
                            className="p-3 border rounded"
                            style={{
                              backgroundColor: '#f8f9fa',
                              maxHeight: '180px',
                              overflowY: 'auto',
                              border: '2px solid #e0e0e0 !important'
                            }}
                          >
                            <div className="row g-2">
                              {availablePeriods.length > 0 ? (
                                availablePeriods.map(period => (
                                  <div key={period} className="col-12 col-md-6 col-lg-4">
                                    <div
                                      className={`form-check p-3 rounded ${form.periods.includes(period) ? 'bg-primary bg-opacity-10 border-primary' : 'bg-white'}`}
                                      style={{
                                        border: form.periods.includes(period)
                                          ? '2px solid #0d6efd'
                                          : '1px solid #dee2e6',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-2"
                                        id={`period-${period}`}
                                        checked={form.periods.includes(period)}
                                        onChange={(e) => {
                                          handlePeriodChange(period, e.target.checked);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                      />
                                      <label
                                        className="form-check-label fw-medium"
                                        htmlFor={`period-${period}`}
                                        style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                      >
                                        <div className="text-dark" style={{ fontSize: '0.875rem', lineHeight: '1.3' }}>
                                          Period {period}
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="col-12 text-center text-muted py-3">
                                  {form.subjects.length > 0
                                    ? 'No periods available for selected subject in timetable'
                                    : 'Select a subject to view available periods'}
                                </div>
                              )}
                            </div>
                          </div>
                          {form.periods.length > 0 && (
                            <div className="mt-3 p-2 bg-success bg-opacity-10 border border-success rounded">
                              <i className="fas fa-check-circle text-success me-2"></i>
                              <span className="fw-semibold text-success">
                                {form.periods.length} period{form.periods.length > 1 ? 's' : ''} selected
                              </span>
                              <span className="text-muted ms-2" style={{ fontSize: '0.875rem' }}>
                                ({form.periods.join(', ')})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit and Reset Buttons */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="submit"
                      className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                      title="Proceed to take attendance"
                    >
                      Proceed To Attendance
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-20"
                      onClick={handleReset}
                      title="Reset all fields"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Student List for Attendance Taking */}
            {showAttendanceList && (
              <div className="card mt-4 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <h6 className="text-lg fw-semibold mb-1">
                        Student Attendance - {form.staffName} - {form.department} ({form.semester}) - Class {form.classSection}
                      </h6>
                      <span className="text-sm fw-medium text-secondary-light">
                        Subjects: {form.subjects.map(s => s.name).join(', ')} | Periods: {form.periods.join(', ')} | {new Date(form.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} - Day Order: {form.dayOrder || 'N/A'}
                      </span>
                    </div>
                    <button
                      className={`btn radius-8 px-20 py-11 ${allMarkedPresent
                        ? 'btn-outline-danger-600'
                        : 'btn-outline-success-600'
                        }`}
                      onClick={handleMarkAllPresent}
                      title={allMarkedPresent ? "Clear all attendance statuses" : "Mark all students as present"}
                    >
                      {allMarkedPresent ? 'Unmark All' : 'Mark All Present'}
                    </button>
                    <button
                      className="btn btn-outline-primary radius-8 px-20 py-11"
                      onClick={() => {
                        const content = document.getElementById('attendance-print-content').innerHTML;
                        const win = window.open('', '_blank');
                        win.document.write(`
                          <html>
                            <head>
                              <title>Daily Attendance Report</title>
                              <style>
                                @page { size: A4 portrait; margin: 10mm; }
                                body { font-family: 'Times New Roman', Times, serif; }
                                table { width: 100%; border-collapse: collapse; }
                                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                                .text-center { text-align: center; }
                                @media print {
                                  .no-print { display: none; }
                                }
                              </style>
                            </head>
                            <body>
                              ${content}
                              <script>
                                window.onload = () => {
                                  window.print();
                                  window.onafterprint = () => window.close();
                                };
                              </script>
                            </body>
                          </html>
                        `);
                        win.document.close();
                      }}
                    >
                      <i className="fas fa-print me-2"></i> Print
                    </button>
                  </div>
                </div>

                <div className="card-body p-24">
                  {/* Enhanced Search Bar with Filters */}
                  <div className="row mb-4">
                    <div className="col-md-8">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control radius-8 shadow-sm"
                          placeholder="Search by name, reg no, or status..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          style={{
                            paddingLeft: '45px',
                            paddingRight: '45px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #e9ecef',
                            height: '45px',
                            fontSize: '14px'
                          }}
                        />
                        <i
                          className="fas fa-search position-absolute"
                          style={{
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#6c757d',
                            fontSize: '16px'
                          }}
                        ></i>
                        <button
                          type="button"
                          className="btn position-absolute"
                          onClick={handleClearSearch}
                          style={{
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#6c757d'
                          }}
                          title="Clear search"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select radius-8 shadow-sm"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '2px solid #e9ecef',
                          height: '45px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Filter by Status</option>
                        <option value="present">Present Only</option>
                        <option value="absent">Absent Only</option>
                        <option value="onDuty">On Duty Only</option>
                        <option value="medicalLeave">Medical Leave Only</option>
                        <option value="unmarked">Unmarked Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Indicator */}
                  {(searchTerm || statusFilter) && (
                    <div className="d-flex align-items-center gap-3 mb-3 p-2 bg-light rounded">
                      <small className="text-muted fw-medium">Active filters:</small>
                      {searchTerm && (
                        <span className="badge bg-primary d-flex align-items-center gap-1">
                          Search: "{searchTerm}"
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: '10px' }}
                            onClick={() => setSearchTerm('')}
                            title="Clear search"
                          ></button>
                        </span>
                      )}
                      {statusFilter && (
                        <span className="badge bg-info d-flex align-items-center gap-1">
                          Status: {statusFilter === 'unmarked' ? 'Unmarked' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: '10px' }}
                            onClick={() => setStatusFilter('')}
                            title="Clear filter"
                          ></button>
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm ms-auto"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('');
                        }}
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  {/* Enhanced Student Cards Grid */}
                  <div className="row g-4 mt-24">
                    {loading ? (
                      <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading students...</p>
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <div className="card border-0 bg-light">
                          <div className="card-body p-5">
                            <i className="fas fa-search text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                            <h6 className="text-muted mb-2">No students found</h6>
                            <p className="text-muted mb-0">
                              {searchTerm || statusFilter
                                ? 'Try adjusting your search criteria or filters'
                                : 'No students available for the selected class'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      filteredStudents.map((student) => {
                        const studentId = student.Register_Number || student.Student_ID || student.id;
                        const currentStatus = attendanceStatus[studentId];
                        return (
                          <div key={studentId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div
                              className="card h-100 shadow-hover radius-12"
                              style={{
                                transition: 'all 0.2s ease',
                                backgroundColor: '#ffffff',
                                border: `2px solid ${currentStatus === 'present' ? '#4caf50' :
                                  currentStatus === 'absent' ? '#f44336' :
                                    currentStatus === 'onDuty' ? '#2196f3' :
                                      currentStatus === 'medicalLeave' ? '#ff9800' : '#e5e7eb'
                                  }`,
                                transform: currentStatus ? 'translateY(-2px)' : 'none',
                                boxShadow: currentStatus ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
                              }}
                            >
                              <div className="card-body p-3 text-center">
                                {/* Student Photo with Status Icon */}
                                <div className="mb-2 d-flex justify-content-center">
                                  {student.Photo_Path ? (
                                    // Show student photo if available
                                    <div className="position-relative" style={{ width: '70px', height: '70px' }}>
                                      <img
                                        src={`/${student.Photo_Path}`}
                                        alt={student.Student_Name || student.name}
                                        className="rounded-circle"
                                        style={{
                                          width: '70px',
                                          height: '70px',
                                          objectFit: 'cover',
                                          display: 'block',
                                          border: `3px solid ${currentStatus === 'present' ? '#4caf50' :
                                            currentStatus === 'absent' ? '#f44336' :
                                              currentStatus === 'onDuty' ? '#2196f3' :
                                                currentStatus === 'medicalLeave' ? '#ff9800' : '#9e9e9e'
                                            }`,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                        }}
                                        onError={(e) => {
                                          // If image fails to load, show fallback icon
                                          e.target.style.display = 'none';
                                          e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                      />
                                      {/* Fallback icon if image fails */}
                                      <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                          width: '70px',
                                          height: '70px',
                                          background: `linear-gradient(135deg, ${currentStatus === 'present' ? '#4caf50, #66bb6a' :
                                            currentStatus === 'absent' ? '#f44336, #ef5350' :
                                              currentStatus === 'onDuty' ? '#2196f3, #42a5f5' :
                                                currentStatus === 'medicalLeave' ? '#ff9800, #ffa726' : '#9e9e9e, #bdbdbd'
                                            })`,
                                          border: '3px solid white',
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                          display: 'none',
                                          position: 'absolute',
                                          top: 0,
                                          left: 0
                                        }}
                                      >
                                        <i className="fas fa-user text-white" style={{ fontSize: '28px' }}></i>
                                      </div>
                                      {/* Status icon overlay */}
                                      {currentStatus && (
                                        <div
                                          className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                                          style={{
                                            width: '24px',
                                            height: '24px',
                                            top: '-4px',
                                            right: '-4px',
                                            backgroundColor:
                                              currentStatus === 'present' ? '#4caf50' :
                                                currentStatus === 'absent' ? '#f44336' :
                                                  currentStatus === 'onDuty' ? '#2196f3' :
                                                    currentStatus === 'medicalLeave' ? '#ff9800' : '#9e9e9e',
                                            border: '2px solid white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                          }}
                                        >
                                          <i
                                            className={`fas ${currentStatus === 'present' ? 'fa-check' :
                                              currentStatus === 'absent' ? 'fa-times' :
                                                currentStatus === 'onDuty' ? 'fa-briefcase' :
                                                  currentStatus === 'medicalLeave' ? 'fa-notes-medical' : ''
                                              } text-white`}
                                            style={{ fontSize: '10px' }}
                                          ></i>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    // Show user icon if no photo
                                    <div className="position-relative" style={{ width: '70px', height: '70px' }}>
                                      <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                          width: '70px',
                                          height: '70px',
                                          background: `linear-gradient(135deg, ${currentStatus === 'present' ? '#4caf50, #66bb6a' :
                                            currentStatus === 'absent' ? '#f44336, #ef5350' :
                                              currentStatus === 'onDuty' ? '#2196f3, #42a5f5' :
                                                currentStatus === 'medicalLeave' ? '#ff9800, #ffa726' : '#ff9800, #ffa726'
                                            })`,
                                          border: '3px solid white',
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                        }}
                                      >
                                        <i className="fas fa-user text-white" style={{ fontSize: '28px' }}></i>
                                      </div>
                                      {/* Status icon overlay */}
                                      {currentStatus && (
                                        <div
                                          className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                                          style={{
                                            width: '24px',
                                            height: '24px',
                                            top: '-4px',
                                            right: '-4px',
                                            backgroundColor:
                                              currentStatus === 'present' ? '#4caf50' :
                                                currentStatus === 'absent' ? '#f44336' :
                                                  currentStatus === 'onDuty' ? '#2196f3' :
                                                    currentStatus === 'medicalLeave' ? '#ff9800' : '#9e9e9e',
                                            border: '2px solid white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                          }}
                                        >
                                          <i
                                            className={`fas ${currentStatus === 'present' ? 'fa-check' :
                                              currentStatus === 'absent' ? 'fa-times' :
                                                currentStatus === 'onDuty' ? 'fa-briefcase' :
                                                  currentStatus === 'medicalLeave' ? 'fa-notes-medical' : ''
                                              } text-white`}
                                            style={{ fontSize: '10px' }}
                                          ></i>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Student Info */}
                                <h6 className="fw-bold mb-0 text-truncate" title={student.Student_Name || student.name} style={{ fontSize: '14px', color: '#1f2937' }}>
                                  {student.Student_Name || student.name}
                                </h6>
                                <p className="text-muted mb-2 small" style={{ fontSize: '12px' }}>
                                  {student.Register_Number}
                                </p>

                                {/* Status Badge */}
                                {currentStatus && (
                                  <div className="mb-2">
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor:
                                          currentStatus === 'present' ? '#e8f5e9' :
                                            currentStatus === 'absent' ? '#ffebee' :
                                              currentStatus === 'onDuty' ? '#e3f2fd' :
                                                currentStatus === 'medicalLeave' ? '#fff3e0' : '#f5f5f5',
                                        color:
                                          currentStatus === 'present' ? '#2e7d32' :
                                            currentStatus === 'absent' ? '#c62828' :
                                              currentStatus === 'onDuty' ? '#1565c0' :
                                                currentStatus === 'medicalLeave' ? '#ef6c00' : '#757575',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        padding: '4px 10px',
                                        borderRadius: '12px'
                                      }}
                                    >
                                      {currentStatus === 'present' ? 'PRESENT' :
                                        currentStatus === 'absent' ? 'ABSENT' :
                                          currentStatus === 'onDuty' ? 'ON DUTY' :
                                            currentStatus === 'medicalLeave' ? 'MEDICAL LEAVE' : ''}
                                    </span>
                                  </div>
                                )}

                                {/* Attendance Buttons - 2x2 Grid */}
                                <div className="row g-2 w-100" role="group">
                                  {/* Present Button */}
                                  <div className="col-6">
                                    <button
                                      type="button"
                                      className={`btn w-100 ${currentStatus === 'present' ? 'btn-success' : 'btn-outline-success'}`}
                                      onClick={() => handleAttendanceChange(studentId, 'present')}
                                      style={{
                                        fontSize: '12px',
                                        padding: '10px 8px',
                                        fontWeight: '700',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                      }}
                                    >
                                      <i className="fas fa-check-circle" style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '6px',
                                        fontSize: '10px'
                                      }}></i>
                                      <div style={{ fontSize: '13px', marginBottom: '2px' }}>PR</div>
                                      <div style={{ fontSize: '9px', opacity: '0.8' }}>Present</div>
                                    </button>
                                  </div>

                                  {/* Absent Button */}
                                  <div className="col-6">
                                    <button
                                      type="button"
                                      className={`btn w-100 ${currentStatus === 'absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                                      onClick={() => handleAttendanceChange(studentId, 'absent')}
                                      style={{
                                        fontSize: '12px',
                                        padding: '10px 8px',
                                        fontWeight: '700',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                      }}
                                    >
                                      <i className="fas fa-times-circle" style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '6px',
                                        fontSize: '10px'
                                      }}></i>
                                      <div style={{ fontSize: '13px', marginBottom: '2px' }}>AB</div>
                                      <div style={{ fontSize: '9px', opacity: '0.8' }}>Absent</div>
                                    </button>
                                  </div>

                                  {/* On Duty Button */}
                                  <div className="col-6">
                                    <button
                                      type="button"
                                      className={`btn w-100 ${currentStatus === 'onDuty' ? 'btn-info' : 'btn-outline-info'}`}
                                      onClick={() => handleAttendanceChange(studentId, 'onDuty')}
                                      style={{
                                        fontSize: '12px',
                                        padding: '10px 8px',
                                        fontWeight: '700',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                      }}
                                    >
                                      <i className="fas fa-briefcase" style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '6px',
                                        fontSize: '10px'
                                      }}></i>
                                      <div style={{ fontSize: '13px', marginBottom: '2px' }}>OD</div>
                                      <div style={{ fontSize: '9px', opacity: '0.8' }}>On Duty</div>
                                    </button>
                                  </div>

                                  {/* Medical Button */}
                                  <div className="col-6">
                                    <button
                                      type="button"
                                      className={`btn w-100 ${currentStatus === 'medicalLeave' ? 'btn-warning' : 'btn-outline-warning'}`}
                                      onClick={() => handleAttendanceChange(studentId, 'medicalLeave')}
                                      style={{
                                        fontSize: '12px',
                                        padding: '10px 8px',
                                        fontWeight: '700',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                      }}
                                    >
                                      <i className="fas fa-notes-medical" style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '6px',
                                        fontSize: '10px'
                                      }}></i>
                                      <div style={{ fontSize: '13px', marginBottom: '2px' }}>ML</div>
                                      <div style={{ fontSize: '9px', opacity: '0.8' }}>Medical</div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Enhanced Submit Section */}
                  <div className="mt-5 pt-4">
                    <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                      <div className="card-body p-4">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                              <div className="d-flex align-items-center gap-2">
                                <div>
                                  <small className="fw-large">
                                    {searchTerm || statusFilter
                                      ? `SHOWING: ${filteredStudents.length} / ${studentsData.length} STUDENTS`
                                      : `TOTAL STUDENTS: ${studentsData.length}`
                                    }
                                  </small>
                                </div>
                              </div>

                              <div className="vr d-none d-md-block" style={{ height: '40px' }}></div>

                              <div className="d-flex gap-3 flex-wrap">
                                <span className="badge px-3 py-2" style={{ backgroundColor: '#f5f5f5', color: '#666', fontSize: '13px' }}>
                                  Present: {attendanceCounts.present}
                                </span>
                                <span className="badge px-3 py-2" style={{ backgroundColor: '#f5f5f5', color: '#666', fontSize: '13px' }}>
                                  Absent: {attendanceCounts.absent}
                                </span>
                                <span className="badge px-3 py-2" style={{ backgroundColor: '#f5f5f5', color: '#666', fontSize: '13px' }}>
                                  OD: {attendanceCounts.onDuty}
                                </span>
                                <span className="badge px-3 py-2" style={{ backgroundColor: '#f5f5f5', color: '#666', fontSize: '13px' }}>
                                  ML: {attendanceCounts.medicalLeave}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 text-md-end mt-3 mt-md-0">
                            <button
                              className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                              onClick={handleSubmitAttendance}
                              title="Save attendance for all students"
                            >
                              Submit Attendance
                            </button>
                          </div>
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
    </>
  );
};

export default DailyAttendance;
