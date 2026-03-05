// AttendanceReport.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';

// Logo and watermark (adjust paths if needed)
const LOGO_SRC = '/assets/images/GRT.png';
const WATERMARK_SRC = '/assets/images/GRT.png';

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    deptCode: '',
    semester: '',
    class: '',
    date: '',
    monthNo: '',
    weekNo: '',
  });

  // Report state
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState(''); // 'datewise' or 'weekly'
  const [reportData, setReportData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  // State for dropdown data
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [months, setMonths] = useState([]);
  const [weeks, setWeeks] = useState([]);

  const reportRef = useRef(null);

  // Fetch initial dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [deptsRes, semsRes] = await Promise.all([
          fetch('/api/dailyAttendance/departments'),
          fetch('/api/dailyAttendance/semesters')
        ]);

        const deptsData = await deptsRes.json();
        const semsData = await semsRes.json();

        setDepartments(deptsData || []);
        setSemesters(semsData || []);

        // Fetch available months for weekly report
        const monthsRes = await fetch('/api/attendanceReport/months');
        const monthsData = await monthsRes.json();
        setMonths(monthsData || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch weeks based on selected month
  useEffect(() => {
    const fetchWeeks = async () => {
      if (!filters.monthNo) {
        setWeeks([]);
        return;
      }

      try {
        const response = await fetch(`/api/attendanceReport/weeks?monthNo=${filters.monthNo}`);
        const data = await response.json();
        setWeeks(data || []);
      } catch (error) {
        console.error('Error fetching weeks:', error);
        setWeeks([]);
      }
    };

    fetchWeeks();
  }, [filters.monthNo]);

  // Fetch classes based on selected department and semester
  useEffect(() => {
    const fetchClasses = async () => {
      if (!filters.deptCode || !filters.semester) {
        setClasses([]);
        if (filters.class) {
          setFilters(prev => ({ ...prev, class: '' }));
        }
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('deptCode', filters.deptCode);
        queryParams.append('semester', filters.semester);

        const response = await fetch(`/api/attendanceReport/classes?${queryParams.toString()}`);
        const data = await response.json();
        setClasses(data || []);
        setFilters(prev => ({ ...prev, class: '' }));
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]);
      }
    };

    fetchClasses();
  }, [filters.deptCode, filters.semester]);

  // Define table columns for attendance table (unchanged logic)
  const columns = useMemo(() => [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="fw-medium">
          {row.original.date ? new Date(row.original.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'dayorder',
      header: 'Day',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.dayorder}</div>
      ),
    },
    {
      accessorKey: 'dept_code',
      header: 'Dept Code',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.dept_code}</div>
      ),
    },
    {
      accessorKey: 'dept_name',
      header: 'Department',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.dept_name}</div>
      ),
    },
    {
      accessorKey: 'semester',
      header: 'Semester',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.semester}</div>
      ),
    },
    {
      accessorKey: 'class',
      header: 'Class',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.class}</div>
      ),
    },
    {
      accessorKey: 'register_number',
      header: 'Register Number',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.register_number}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Student Name',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.name}</div>
      ),
    },
    // Period columns (1..6)
    ...[1, 2, 3, 4, 5, 6].map(num => ({
      accessorKey: `${num}`,
      header: `Period ${num}`,
      cell: ({ row }) => {
        const status = row.original[String(num)];
        return (
          <div className={`fw-medium text-center ${status === 'P' ? 'text-success' :
            status === 'A' ? 'text-danger' :
              status === 'OD' ? 'text-info' :
                status === 'ML' ? 'text-warning' : ''
            }`}>
            {status || '-'}
          </div>
        );
      }
    }))
  ], []);

  // Fetch attendance report from API (for DataTable listing)
  useEffect(() => {
    const fetchAttendanceReport = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (filters.deptCode) queryParams.append('deptCode', filters.deptCode);
        if (filters.semester) queryParams.append('semester', filters.semester);
        if (filters.class) queryParams.append('class', filters.class);
        if (filters.date) queryParams.append('date', filters.date);

        const response = await fetch(`/api/attendanceReport?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch attendance report data');
        }

        const data = await response.json();
        setAttendanceData(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching attendance report:', err);
        setError('Failed to fetch attendance report data');
        toast.error('Failed to fetch attendance report data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceReport();
  }, [filters]);

  // Helper: validate common filter selections
  const validateCommonFilters = () => {
    if (!filters.deptCode || !filters.semester || !filters.class) {
      toast.error('Please select Department, Semester, and Class');
      return false;
    }
    if (!filters.date) {
      toast.error('Please select Date');
      return false;
    }
    return true;
  };

  // Helper: validate weekly filter selections
  const validateWeeklyFilters = () => {
    if (!filters.deptCode || !filters.semester || !filters.class) {
      toast.error('Please select Department, Semester, and Class');
      return false;
    }
    if (!filters.monthNo || !filters.weekNo) {
      toast.error('Please select Month and Week Number');
      return false;
    }
    return true;
  };

  // Handle date-wise report
  const handleDateWiseReport = async () => {
    if (!validateCommonFilters()) return;

    setReportLoading(true);
    setReportError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('deptCode', filters.deptCode);
      queryParams.append('semester', filters.semester);
      queryParams.append('class', filters.class);
      queryParams.append('date', filters.date);
      queryParams.append('reportType', 'datewise');

      const response = await fetch(`/api/attendanceReport/detailed?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch date-wise report');
      }

      const data = await response.json();
      setReportData(data || []);
      setReportType('datewise');
      setShowReport(true);
      toast.success('Date-wise report generated successfully');
      // scroll to report
      setTimeout(() => {
        if (reportRef.current) reportRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error fetching date-wise report:', err);
      setReportError('Failed to fetch date-wise report');
      toast.error('Failed to fetch date-wise report');
    } finally {
      setReportLoading(false);
    }
  };

  // Handle weekly report
  const handleWeeklyReport = async () => {
    if (!validateWeeklyFilters()) return;

    setReportLoading(true);
    setReportError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('deptCode', filters.deptCode);
      queryParams.append('semester', filters.semester);
      queryParams.append('class', filters.class);
      queryParams.append('monthNo', filters.monthNo);
      queryParams.append('weekNo', filters.weekNo);
      queryParams.append('reportType', 'weekly');

      const response = await fetch(`/api/attendanceReport/weekly?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch weekly report');
      }

      const data = await response.json();
      setReportData(data || []);
      setReportType('weekly');
      setShowReport(true);
      toast.success('Weekly report generated successfully');
      setTimeout(() => {
        if (reportRef.current) reportRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error fetching weekly report:', err);
      setReportError('Failed to fetch weekly report');
      toast.error('Failed to fetch weekly report');
    } finally {
      setReportLoading(false);
    }
  };

  // A4 print handler with @page CSS for borders and watermark on every page
  // Standardized print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        /* Page UI + print hiding helpers */
        @media print {
          body * { visibility: hidden !important; }
          .attendance-report-print-container, .attendance-report-print-container * { visibility: visible !important; }
          .attendance-report-print-container {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          nav, .sidebar, .navbar, .breadcrumb, button, .btn, footer, .filter-card, .legend-card, .data-table-section { display: none !important; }
          @page { 
            size: A4 ${reportType === 'weekly' ? 'landscape' : 'portrait'}; 
            margin: 10mm; 
          }
        }

        .report-view-section {
          background: white;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-top: 20px;
        }

        .report-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }

        .report-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .report-header p {
          margin: 5px 0;
          font-size: 12px;
        }

        .report-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin: 20px 0;
          text-decoration: none;
        }

        .report-info {
          margin: 15px 0;
          font-size: 14px;
        }

        .date-section {
          background: #f5f5f5;
          padding: 10px;
          margin: 20px 0 10px 0;
          border-left: 4px solid #333;
          font-weight: bold;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .report-table th,
        .report-table td {
          border: 1px solid #000;
          padding: 6px;
          font-size: 12px;
        }

        .report-table th {
          background: #e0e0e0;
          font-weight: bold;
          text-align: center;
        }

        .report-table td {
          text-align: left;
        }

        .report-table td.text-center {
          text-align: center;
        }

        .action-buttons {
          text-align: center;
          margin-bottom: 20px;
          padding: 10px;
        }
      `}</style>

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
          <div className="dashboard-main-body" style={{ padding: 20 }}>
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Attendance Report</h6>
            </div>

            {/* Filter Card */}
            <div className="card mb-4 filter-card">
              <div className="card-body">
                <div className="row g-3">
                  {/* Department Filter */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      className="form-select"
                      value={filters.deptCode}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, deptCode: e.target.value }));
                      }}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.Dept_Code} value={dept.Dept_Code}>{dept.Dept_Name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Filter */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Semester</label>
                    <select
                      className="form-select"
                      value={filters.semester}
                      onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                    >
                      <option value="">All Semesters</option>
                      {semesters.map(sem => (
                        <option key={sem.id} value={sem.Semester}>{sem.Semester}</option>
                      ))}
                    </select>
                  </div>

                  {/* Class Filter */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Class</label>
                    <select
                      className="form-select"
                      value={filters.class}
                      onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
                    >
                      <option value="">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.Class}>{cls.Class}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.date}
                      onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  {/* Month Filter */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Month <span className="text-muted">(Weekly Report)</span></label>
                    <select
                      className="form-select"
                      value={filters.monthNo}
                      onChange={(e) => setFilters(prev => ({ ...prev, monthNo: e.target.value, weekNo: '' }))}
                    >
                      <option value="">Select Month</option>
                      {months.map(month => (
                        <option key={month.month_no} value={month.month_no}>
                          {month.month_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Week Number Filter */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label fw-semibold">Week No <span className="text-muted">(Weekly Report)</span></label>
                    <select
                      className="form-select"
                      value={filters.weekNo}
                      onChange={(e) => setFilters(prev => ({ ...prev, weekNo: e.target.value }))}
                      disabled={!filters.monthNo}
                    >
                      <option value="">Select Week</option>
                      {weeks.map(week => (
                        <option key={week.week_no} value={week.week_no}>
                          Week {week.week_no}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Actions */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200" style={{ width: '100%' }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary radius-8 px-20 py-11"
                      onClick={() => {
                        setFilters({
                          deptCode: '',
                          semester: '',
                          class: '',
                          date: '',
                          monthNo: '',
                          weekNo: '',
                        });
                        setShowReport(false);
                        setReportData([]);
                      }}
                    >
                      Reset Filters
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary radius-8 px-20 py-11"
                      onClick={handleDateWiseReport}
                      disabled={reportLoading}
                    >
                      {reportLoading && reportType === 'datewise' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Loading...
                        </>
                      ) : (
                        <>
                          Date Wise Report
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success radius-8 px-20 py-11"
                      onClick={handleWeeklyReport}
                      disabled={reportLoading}
                    >
                      {reportLoading && reportType === 'weekly' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Loading...
                        </>
                      ) : (
                        <>
                          Weekly Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend for Attendance Status */}
            <div className="card mb-4 legend-card">
              <div className="card-body">
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-success fw-bold">P</span>
                    <span className="text-sm">- Present</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-danger fw-bold">A</span>
                    <span className="text-sm">- Absent</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-info fw-bold">OD</span>
                    <span className="text-sm">- On Duty</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-warning fw-bold">ML</span>
                    <span className="text-sm">- Medical Leave</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="data-table-section">
              <DataTable
                data={attendanceData}
                columns={columns}
                loading={loading}
                error={error}
                title="Attendance Report"
                enableExport={false}
                enableSelection={false}
                enableActions={false}
                pageSize={10}
              />
            </div>

            {/* Report Section - Below Table */}
            {showReport && (
              <>
                {/* Print Button - Top of report section */}
                <div className="d-flex justify-content-end mb-3 print-hide">
                  <button
                    type="button"
                    className="btn btn-outline-primary-600 radius-8 d-flex align-items-center gap-2 fw-bold"
                    onClick={handlePrint}
                  >
                    <Icon icon="solar:printer-outline" className="text-lg" />
                    Print Report (A4)
                  </button>
                </div>

                <div ref={reportRef} className="report-view-section">

                  {reportLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Generating report...</p>
                    </div>
                  ) : reportError ? (
                    <div className="alert alert-danger" role="alert">
                      {reportError}
                    </div>
                  ) : reportData.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                      No records found for the selected criteria.
                    </div>
                  ) : (
                    <div id="attendance-report" className="attendance-report-print-container" style={{ background: '#fff' }}>
                      {(() => {
                        const ROWS_PER_PAGE = 10;

                        // Chunking helper
                        const chunkArray = (arr, size) => {
                          const chunks = [];
                          for (let i = 0; i < arr.length; i += size) {
                            chunks.push(arr.slice(i, i + size));
                          }
                          return chunks;
                        };

                        const renderHeader = () => (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 12 }}>
                            <div style={{ width: 100, minWidth: 100, textAlign: "center" }}>
                              <img src={LOGO_SRC} alt="logo" style={{ width: 90, height: 90, objectFit: "contain" }} />
                            </div>
                            <div style={{ flex: 1, textAlign: "center" }}>
                              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.5, color: "#222", textTransform: 'uppercase' }}>
                                GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#222", marginTop: 4 }}>
                                GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#222", marginTop: 2 }}>
                                Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                              </div>
                            </div>
                            <div style={{ width: 100, minWidth: 100 }}></div>
                          </div>
                        );

                        const renderSignatures = () => (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
                              <div style={{ fontSize: '13px', fontWeight: '700' }}>Class Coordinator</div>
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

                        if (reportType === 'datewise') {
                          const chunks = chunkArray(reportData, ROWS_PER_PAGE);
                          return chunks.map((chunk, pageIdx) => (
                            <div key={pageIdx} className="page-break" style={{
                              border: '2px solid #222',
                              margin: 12,
                              padding: "0 0 24px 0",
                              minHeight: '277mm', // Approximate A4 height minus margins
                              position: 'relative',
                              background: '#fff',
                              fontFamily: "'Times New Roman', Times, serif",
                              pageBreakAfter: 'always',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              {renderHeader()}

                              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, textDecoration: "underline", margin: "18px 0 12px 0", textTransform: 'uppercase' }}>
                                DATE WISE ABSENT LIST
                              </div>

                              <div style={{ padding: "0 24px" }}>
                                <div style={{ marginBottom: '15px', padding: '12px', border: '1px solid #222', background: '#fff' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px' }}><strong>DATE:</strong> {filters.date ? new Date(filters.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'} {reportData[0]?.dayorder && `- ${reportData[0].dayorder.toUpperCase()}`}</span>
                                    <span style={{ fontSize: '13px' }}><strong>DEPARTMENT:</strong> {reportData[0]?.dept_name?.toUpperCase() || 'N/A'}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '40px' }}>
                                    <span style={{ fontSize: '13px' }}><strong>SEMESTER:</strong> {filters.semester || 'N/A'}</span>
                                    <span style={{ fontSize: '13px' }}><strong>CLASS:</strong> {filters.class?.toUpperCase() || 'N/A'}</span>
                                  </div>
                                </div>

                                <table style={{ width: '100%', border: '1px solid #222', borderCollapse: 'collapse', background: '#fff' }}>
                                  <thead>
                                    <tr>
                                      <th style={thStyle}>S.No</th>
                                      <th style={thStyle}>REGNO</th>
                                      <th style={{ ...thStyle, textAlign: 'left' }}>NAME</th>
                                      <th style={thStyle}>H1</th>
                                      <th style={thStyle}>H2</th>
                                      <th style={thStyle}>H3</th>
                                      <th style={thStyle}>H4</th>
                                      <th style={thStyle}>H5</th>
                                      <th style={thStyle}>H6</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {chunk.map((record, idx) => (
                                      <tr key={idx}>
                                        <td style={tdStyle}>{pageIdx * ROWS_PER_PAGE + idx + 1}</td>
                                        <td style={tdStyle}>{record.register_number}</td>
                                        <td style={{ ...tdStyle, textAlign: 'left' }}>{record.name}</td>
                                        {[1, 2, 3, 4, 5, 6].map(hour => (
                                          <td key={hour} style={tdStyle}>
                                            {record[hour.toString()] || ''}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                    {/* Empty rows to fill space and maintain consistency */}
                                    {chunk.length < ROWS_PER_PAGE && Array.from({ length: ROWS_PER_PAGE - chunk.length }).map((_, i) => (
                                      <tr key={`empty-${i}`}>
                                        <td style={{ ...tdStyle, height: '38px' }}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                        <td style={tdStyle}>&nbsp;</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div style={{ marginTop: 'auto', padding: "0 24px" }}>
                                {renderSignatures()}
                              </div>
                            </div>
                          ));
                        } else {
                          // Weekly Report Logic
                          const uniqueDates = [...new Set(reportData.map(r => r.date))].sort();
                          const studentMap = {};
                          reportData.forEach(record => {
                            const key = record.Register_Number;
                            if (!studentMap[key]) {
                              studentMap[key] = {
                                register_number: record.Register_Number,
                                name: record.name,
                                dept_name: record.Dept_Name,
                                semester: record.Semester,
                                class: record.Class,
                                dates: {}
                              };
                            }
                            studentMap[key].dates[record.date] = {
                              dayorder: record.dayorder,
                              P1: record.P1, P2: record.P2, P3: record.P3,
                              P4: record.P4, P5: record.P5, P6: record.P6
                            };
                          });
                          const students = Object.values(studentMap);
                          const firstRecord = reportData[0] || {};
                          const chunks = chunkArray(students, ROWS_PER_PAGE);

                          return chunks.map((chunk, pageIdx) => (
                            <div key={pageIdx} className="page-break" style={{
                              border: '2px solid #222',
                              margin: 12,
                              padding: "0 0 24px 0",
                              minHeight: '190mm', // Landscape A4 height approx
                              position: 'relative',
                              background: '#fff',
                              fontFamily: "'Times New Roman', Times, serif",
                              pageBreakAfter: 'always',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              {renderHeader()}

                              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, textDecoration: "underline", margin: "18px 0 12px 0", textTransform: 'uppercase' }}>
                                WEEKLY ATTENDANCE REPORT
                              </div>

                              <div style={{ padding: "0 24px" }}>
                                <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '15px', padding: '12px', border: '1px solid #222' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', gap: '25px' }}>
                                      <span><strong>MONTH:</strong> {firstRecord.month_name?.toUpperCase() || 'N/A'}</span>
                                      <span><strong>WEEK NO:</strong> {firstRecord.week_no || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span><strong>COURSE:</strong> {firstRecord.Dept_Name?.toUpperCase() || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '40px' }}>
                                    <span><strong>SEMESTER:</strong> {firstRecord.Semester || 'N/A'}</span>
                                    <span><strong>SECTION:</strong> {firstRecord.Class?.toUpperCase() || 'N/A'}</span>
                                  </div>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                  <table style={{ width: '100%', border: '1px solid #222', borderCollapse: 'collapse', fontSize: 9 }}>
                                    <thead>
                                      <tr>
                                        <th rowSpan="2" style={thStyle}>S.No</th>
                                        <th rowSpan="2" style={thStyle}>REGNO</th>
                                        <th rowSpan="2" style={{ ...thStyle, minWidth: '120px' }}>NAME</th>
                                        {uniqueDates.map((date, idx) => {
                                          const d = new Date(date);
                                          return (
                                            <th key={idx} colSpan="6" style={thStyle}>
                                              {d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}<br />
                                              {reportData.find(r => r.date === date)?.dayorder || ''}
                                            </th>
                                          );
                                        })}
                                        <th rowSpan="2" style={thStyle}>WD</th>
                                        <th rowSpan="2" style={thStyle}>ATT</th>
                                        <th rowSpan="2" style={thStyle}>%</th>
                                      </tr>
                                      <tr>
                                        {uniqueDates.map((date, dateIdx) => (
                                          <React.Fragment key={dateIdx}>
                                            {[1, 2, 3, 4, 5, 6].map(period => (
                                              <th key={period} style={{ ...thStyle, padding: '2px', width: '20px' }}>{period}</th>
                                            ))}
                                          </React.Fragment>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {chunk.map((student, idx) => {
                                        let totalHours = 0, attendedHours = 0;
                                        uniqueDates.forEach(date => {
                                          const dateData = student.dates[date];
                                          if (dateData) {
                                            [1, 2, 3, 4, 5, 6].forEach(p => {
                                              const s = dateData[`P${p}`];
                                              if (s && s !== '-') {
                                                totalHours++;
                                                if (['Pr', 'pr', 'OD', 'od'].includes(s)) attendedHours++;
                                              }
                                            });
                                          }
                                        });
                                        const attendancePercentage = totalHours > 0 ? ((attendedHours / totalHours) * 100).toFixed(2) : '0.00';
                                        return (
                                          <tr key={idx}>
                                            <td style={tdStyle}>{pageIdx * ROWS_PER_PAGE + idx + 1}</td>
                                            <td style={tdStyle}>{student.register_number}</td>
                                            <td style={{ ...tdStyle, textAlign: 'left' }}>{student.name}</td>
                                            {uniqueDates.map((date, dIdx) => (
                                              <React.Fragment key={dIdx}>
                                                {[1, 2, 3, 4, 5, 6].map(p => (
                                                  <td key={p} style={{ ...tdStyle, padding: '2px' }}>{student.dates[date]?.[`P${p}`] || ''}</td>
                                                ))}
                                              </React.Fragment>
                                            ))}
                                            <td style={tdStyle}>{uniqueDates.length}</td>
                                            <td style={tdStyle}>{attendedHours}</td>
                                            <td style={tdStyle}>{attendancePercentage}%</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                    {pageIdx === chunks.length - 1 && (
                                      <tfoot>
                                        {['Present', 'Absent', 'OD', 'ML'].map(statusName => (
                                          <tr key={statusName} style={{ fontWeight: 'bold' }}>
                                            <td colSpan="3" style={{ ...tdStyle, textAlign: 'left' }}>No. of Students {statusName}</td>
                                            {uniqueDates.map((date, dIdx) => (
                                              <React.Fragment key={dIdx}>
                                                {[1, 2, 3, 4, 5, 6].map(p => {
                                                  const count = students.filter(s => {
                                                    const stat = s.dates[date]?.[`P${p}`];
                                                    if (statusName === 'Present') return ['Pr', 'pr'].includes(stat);
                                                    if (statusName === 'Absent') return ['Ab', 'ab'].includes(stat);
                                                    if (statusName === 'OD') return ['OD', 'od'].includes(stat);
                                                    if (statusName === 'ML') return ['ML', 'ml'].includes(stat);
                                                    return false;
                                                  }).length;
                                                  return <td key={p} style={tdStyle}>{count || ''}</td>;
                                                })}
                                              </React.Fragment>
                                            ))}
                                            <td colSpan="3" style={tdStyle}></td>
                                          </tr>
                                        ))}
                                      </tfoot>
                                    )}
                                  </table>
                                </div>
                              </div>
                              <div style={{ marginTop: 'auto', padding: "0 24px" }}>
                                {renderSignatures()}
                              </div>
                            </div>
                          ));
                        }
                      })()}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

const thStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  fontWeight: 700,
  background: "#f4f4f4",
  textAlign: "center",
  color: "#222"
};

const tdStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  textAlign: "center",
  color: "#222"
};

export default AttendanceReport;
