import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/footer';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Users, BookOpen, UserCheck, UserX, Briefcase, HeartPulse,
  ClipboardCheck, LayoutGrid, DollarSign, TrendingUp,
  UserPlus, Calendar, FileText, Bus, BookMarked, GraduationCap
} from 'lucide-react';

/* ---------------- STAT CARD COMPONENT ---------------- */
const StatCard = ({ title, value, icon: Icon, color, progress, left, right, onClick }) => (
  <div className="stat-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="stat-top">
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
      </div>
      <Icon size={26} color={color} />
    </div>

    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${progress}%`, background: color }}
      />
    </div>

    <div className="stat-footer">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  </div>
);



const AdminDashboard = () => {
  const navigate = useNavigate();

  // State management
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceModalType, setAttendanceModalType] = useState("present");
  const [modalAttendanceData, setModalAttendanceData] = useState({
    present: { count: 0, students: [] },
    absent: { count: 0, students: [] },
    onDuty: { count: 0, students: [] },
    medicalLeave: { count: 0, students: [] }
  });
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalDeptFilter, setModalDeptFilter] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalStaff: 0,
    departments: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalOnDuty: 0,
    totalMedicalLeave: 0,
    attendance: 0
  });

  const [enhancedData, setEnhancedData] = useState({
    library: { totalBooks: 0, issuedBooks: 0, overdueBooks: 0, availableBooks: 0 },
    fees: { todayCollection: 0, monthCollection: 0, pendingCount: 0 },
    exams: { averageMarks: 0, passed: 0, failed: 0 },
    health: { todayVisits: 0, medicalLeaveToday: 0 },
    quick: { transportRoutes: 0, pendingApplications: 0 }
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);

  // Derived data for modal
  const modalList = modalAttendanceData[attendanceModalType]?.students || [];
  const filteredModalList = modalList.filter(s => {
    const searchMatch = (s.Student_Name || s.studentName || "").toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
      (s.Register_Number || s.registerNumber || "").toLowerCase().includes(modalSearchQuery.toLowerCase());
    const deptMatch = modalDeptFilter === "" || (s.Dept_Code || "") === modalDeptFilter;
    return searchMatch && deptMatch;
  });
  const uniqueDepts = Array.from(new Set(modalList.map(s => s.Dept_Code).filter(Boolean)));

  const handleOpenAttendanceModal = async (type) => {
    setAttendanceModalType(type);
    setModalLoading(true);
    setShowAttendanceModal(true);

    try {
      let response;
      if (type === 'present' || type === 'absent') {
        response = await axios.get(`/api/dashboard/attendance-details-by-date?date=${selectedDate}`);
      } else {
        response = await axios.get(`/api/dashboard/attendance-details-by-type?date=${selectedDate}&type=${type}`);
      }

      if (response.data.success) {
        if (type === 'present' || type === 'absent') {
          setModalAttendanceData(prev => ({
            ...prev,
            present: response.data.data.present || { count: 0, students: [] },
            absent: response.data.data.absent || { count: 0, students: [] }
          }));
        } else {
          setModalAttendanceData(prev => ({
            ...prev,
            [type]: response.data.data[type] || { count: 0, students: [] }
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching modal attendance details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all dashboard data
        const [
          yearsRes,
          statsRes,
          summaryRes,
          attendRes,
          deptRes,
          libraryRes,
          feeRes,
          examRes,
          healthRes,
          trendsRes,
          quickRes
        ] = await Promise.all([
          axios.get('/api/dashboard/academic-years'),
          axios.get('/api/dashboard/stats'),
          axios.get(`/api/dashboard/stats-by-date?date=${selectedDate}`),
          axios.get(`/api/dashboard/dept-attendance-by-date?date=${selectedDate}`),
          axios.get(`/api/dashboard/department-wise-students?academicYear=${selectedYear || ''}`),
          axios.get('/api/dashboard/library-stats').catch(() => ({ data: { success: true, data: { totalBooks: 0, issuedBooks: 0, overdueBooks: 0, availableBooks: 0 } } })),
          axios.get('/api/dashboard/fee-metrics').catch(() => ({ data: { success: true, data: { todayCollection: 0, monthCollection: 0, pendingCount: 0 } } })),
          axios.get('/api/dashboard/exam-analytics').catch(() => ({ data: { success: true, data: { averageMarks: 0, passed: 0, failed: 0 } } })),
          axios.get('/api/dashboard/health-stats').catch(() => ({ data: { success: true, data: { todayVisits: 0, medicalLeaveToday: 0 } } })),
          axios.get('/api/dashboard/attendance-trends').catch(() => ({ data: { success: true, data: [] } })),
          axios.get('/api/dashboard/quick-stats').catch(() => ({ data: { success: true, data: { transportRoutes: 0, pendingApplications: 0 } } }))
        ]);

        if (yearsRes.data.success) {
          setAcademicYears(yearsRes.data.data || []);
          if (!selectedYear && yearsRes.data.data.length > 0) {
            setSelectedYear(yearsRes.data.data[0]);
          }
        }

        if (statsRes.data.success && summaryRes.data.success) {
          setDashboardData({
            totalStudents: statsRes.data.data.totalStudents || 0,
            totalStaff: statsRes.data.data.totalStaff || 0,
            departments: statsRes.data.data.departments || 0,
            totalPresent: summaryRes.data.data.totalPresent || 0,
            totalAbsent: summaryRes.data.data.totalAbsent || 0,
            totalOnDuty: summaryRes.data.data.totalOnDuty || 0,
            totalMedicalLeave: summaryRes.data.data.totalMedicalLeave || 0,
            attendance: summaryRes.data.data.attendance || 0
          });
        }

        setAttendanceData(attendRes.data.data || []);
        setDepartmentData(deptRes.data.data || []);

        setEnhancedData({
          library: libraryRes.data.data || { totalBooks: 0, issuedBooks: 0, overdueBooks: 0, availableBooks: 0 },
          fees: feeRes.data.data || { todayCollection: 0, monthCollection: 0, pendingCount: 0 },
          exams: examRes.data.data || { averageMarks: 0, passed: 0, failed: 0 },
          health: healthRes.data.data || { todayVisits: 0, medicalLeaveToday: 0 },
          quick: quickRes.data.data || { transportRoutes: 0, pendingApplications: 0 }
        });

        setAttendanceTrends(trendsRes.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, selectedYear]);



  return (
    <>
      <style>{`


        /* Dashboard Card Hover Effects */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 18px 20px;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
          transition: all 0.25s ease;
          border: 1px solid #f1f5f9;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .stat-title {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 26px;
          font-weight: 800;
          margin-top: 6px;
          line-height: 1;
        }

        .progress-track {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 999px;
          margin-top: 14px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.8s ease;
        }

        .stat-footer {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #64748b;
          margin-top: 8px;
        }

        /* Chart Containers */
        .chart-section {
          margin-top: 24px;
        }

        .chart-section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }

        .chart-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
          gap: 20px;
        }

        .chart-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
        }

        .chart-card h6 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #1f2937;
        }

        .chart-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
          font-weight: 500;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Breadcrumb */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <h6 className="fw-semibold mb-0">Admin Dashboard</h6>
              <div className="d-flex align-items-center gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: '160px' }}
                />
              </div>
            </div>



            {/* Statistics Grid */}
            <div className="stat-grid">
              <StatCard
                title="Total Students"
                value={dashboardData.totalStudents.toLocaleString()}
                icon={Users}
                color="#2563eb"
                progress={85}
                left="Enrolled active"
                right="Academic Year"
              />
              <StatCard
                title="Total Staff"
                value={dashboardData.totalStaff.toLocaleString()}
                icon={Users}
                color="#059669"
                progress={75}
                left="Faculty & Admin"
                right="Active Staff"
              />
              <StatCard
                title="Departments"
                value={dashboardData.departments}
                icon={LayoutGrid}
                color="#0891b2"
                progress={60}
                left="Academic Units"
                right="Active Depts"
              />
              <StatCard
                title="Total Present"
                value={dashboardData.totalPresent !== undefined ? dashboardData.totalPresent : '-'}
                icon={UserCheck}
                color="#16a34a"
                progress={dashboardData.attendance || 0}
                left="Currently Present"
                right="Students"
                onClick={() => handleOpenAttendanceModal('present')}
              />
              <StatCard
                title="Total Absent"
                value={dashboardData.totalAbsent !== undefined ? dashboardData.totalAbsent : '-'}
                icon={UserX}
                color="#dc2626"
                progress={100 - (dashboardData.attendance || 0)}
                left="Students Not present"
                right="Today"
                onClick={() => handleOpenAttendanceModal('absent')}
              />
              <StatCard
                title="Total OnDuty"
                value={dashboardData.totalOnDuty !== undefined ? dashboardData.totalOnDuty : '-'}
                icon={Briefcase}
                color="#ea580c"
                progress={15}
                left="Authorized OD"
                right="Pending approval"
                onClick={() => handleOpenAttendanceModal('onDuty')}
              />
              <StatCard
                title="Total Medical Leave"
                value={dashboardData.totalMedicalLeave !== undefined ? dashboardData.totalMedicalLeave : '-'}
                icon={HeartPulse}
                color="#e11d48"
                progress={10}
                left="Medical records"
                right="Approved ML"
                onClick={() => handleOpenAttendanceModal('medicalLeave')}
              />
              <StatCard
                title="Daily Attendance"
                value={`${dashboardData.attendance}%`}
                icon={ClipboardCheck}
                color="#9333ea"
                progress={dashboardData.attendance || 0}
                left="Daily percentage"
                right="Overall Avg"
              />
              <StatCard
                title="Library Books"
                value={enhancedData.library.issuedBooks}
                icon={BookOpen}
                color="#0891b2"
                progress={(enhancedData.library.totalBooks > 0 ? (enhancedData.library.issuedBooks / enhancedData.library.totalBooks) * 100 : 0)}
                left={`${enhancedData.library.availableBooks} Available`}
                right={`${enhancedData.library.overdueBooks} Overdue`}
              />
              <StatCard
                title="Fee Collection"
                value={`₹${(enhancedData.fees.todayCollection / 1000).toFixed(1)}K`}
                icon={DollarSign}
                color="#16a34a"
                progress={65}
                left="Today's Collection"
                right={`${enhancedData.fees.pendingCount} Pending`}
              />
              <StatCard
                title="Exam Performance"
                value={`${enhancedData.exams.averageMarks}%`}
                icon={TrendingUp}
                color="#7c3aed"
                progress={parseFloat(enhancedData.exams.averageMarks) || 0}
                left={`${enhancedData.exams.passed} Passed`}
                right={`${enhancedData.exams.failed} Failed`}
              />
              <StatCard
                title="Health Visits"
                value={enhancedData.health.todayVisits}
                icon={HeartPulse}
                color="#dc2626"
                progress={40}
                left="Today's Visits"
                right={`${enhancedData.health.medicalLeaveToday} ML`}
              />
            </div>

            {/* Attendance Modal */}
            {showAttendanceModal &&
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)', animation: 'fadeIn 0.3s ease-in-out' }} onClick={() => setShowAttendanceModal(false)}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '28px', minWidth: 400, maxWidth: 700, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative', maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h5 style={{ margin: 0, fontWeight: 700, color: '#1f2937', fontSize: '18px' }}>
                      {attendanceModalType === 'present' ? 'Present Students' :
                        attendanceModalType === 'onDuty' ? 'OnDuty Students' :
                          attendanceModalType === 'medicalLeave' ? 'Medical Leave Students' :
                            'Absent Students'}
                    </h5>
                    <button onClick={() => { setShowAttendanceModal(false); setModalSearchQuery(''); }} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                  </div>
                  <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Search by name or reg..."
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: '13px' }}
                    />
                    <select value={modalDeptFilter} onChange={(e) => setModalDeptFilter(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: '13px', minWidth: 120 }}>
                      <option value="">All Departments</option>
                      {uniqueDepts.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ maxHeight: 'calc(85vh - 260px)', overflowY: 'auto', flex: 1 }}>
                    {modalLoading ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>Loading...</div>
                    ) : filteredModalList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>No data</div>
                    ) : (
                      <table style={{ width: '100%', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>S.No</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Dept</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Reg. Number</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Student Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredModalList.map((s, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px' }}>{i + 1}</td>
                              <td style={{ padding: '8px' }}>{s.Dept_Code}</td>
                              <td style={{ padding: '8px' }}>{s.Register_Number || s.registerNumber}</td>
                              <td style={{ padding: '8px' }}>{s.Student_Name || s.studentName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <button className="btn btn-primary mt-4 w-100" onClick={() => setShowAttendanceModal(false)}>Close</button>
                </div>
              </div>
            }

            {/* Chart Section 1: Attendance Analytics */}
            <div className="chart-section">
              <h5 className="chart-section-title">📊 Attendance Analytics</h5>
              <div className="chart-grid-2">
                {/* 30-Day Attendance Trend - Line Chart */}
                <div className="chart-card">
                  <h6>30-Day Attendance Trend</h6>
                  <p className="chart-subtitle">📈 Daily attendance percentage over the last month</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={attendanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        fontSize={11}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis fontSize={11} domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ fill: '#2563eb', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Today's Attendance Breakdown - Doughnut Chart */}
                <div className="chart-card">
                  <h6>Today's Attendance Breakdown</h6>
                  <p className="chart-subtitle">🎯 Current day attendance distribution</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Present', value: dashboardData.totalPresent },
                          { name: 'Absent', value: dashboardData.totalAbsent },
                          { name: 'OnDuty', value: dashboardData.totalOnDuty },
                          { name: 'Medical Leave', value: dashboardData.totalMedicalLeave }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        <Cell fill="#16a34a" />
                        <Cell fill="#dc2626" />
                        <Cell fill="#ea580c" />
                        <Cell fill="#e11d48" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart Section 2: Department Performance */}
            <div className="chart-section">
              <h5 className="chart-section-title">🏛️ Department Performance</h5>
              <div className="chart-grid-2">
                {/* Department-wise Student Strength - Column Chart */}
                <div className="chart-card">
                  <h6>Department-wise Student Strength</h6>
                  <p className="chart-subtitle">👥 Student distribution across departments</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={departmentData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="deptName" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="studentCount" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Department Attendance % - Horizontal Bar */}
                <div className="chart-card">
                  <h6>Department-wise Attendance %</h6>
                  <p className="chart-subtitle">📊 Attendance percentage by department</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={attendanceData.slice(0, 6)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 100]} fontSize={11} />
                      <YAxis type="category" dataKey="deptName" fontSize={11} width={80} />
                      <Tooltip />
                      <Bar dataKey="presentPercentage" fill="#059669" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart Section 3: Financial Overview */}
            <div className="chart-section">
              <h5 className="chart-section-title">💰 Financial Overview</h5>
              <div className="chart-grid-2">
                {/* Fee Collection Trend - Area Chart */}
                <div className="chart-card">
                  <h6>Monthly Fee Collection Trend</h6>
                  <p className="chart-subtitle">💵 Fee collection over time</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={[
                      { month: 'Jan', amount: 45000 },
                      { month: 'Feb', amount: 52000 },
                      { month: 'Mar', amount: 48000 },
                      { month: 'Apr', amount: 61000 },
                      { month: 'May', amount: 55000 },
                      { month: 'Jun', amount: 67000 }
                    ]}>
                      <defs>
                        <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Area type="monotone" dataKey="amount" stroke="#16a34a" fill="url(#feeGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Fee Status Distribution - Pie Chart */}
                <div className="chart-card">
                  <h6>Fee Status Distribution</h6>
                  <p className="chart-subtitle">📈 Payment status breakdown</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Paid', value: 850 },
                          { name: 'Pending', value: enhancedData.fees.pendingCount },
                          { name: 'Overdue', value: 45 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        <Cell fill="#16a34a" />
                        <Cell fill="#ea580c" />
                        <Cell fill="#dc2626" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart Section 4: Exam Performance */}
            <div className="chart-section">
              <h5 className="chart-section-title">🎓 Exam Performance</h5>
              <div className="chart-grid-2">
                {/* Pass/Fail Ratio - Doughnut */}
                <div className="chart-card">
                  <h6>Exam Pass/Fail Ratio</h6>
                  <p className="chart-subtitle">✅ Overall exam performance</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Passed', value: enhancedData.exams.passed || 750 },
                          { name: 'Failed', value: enhancedData.exams.failed || 150 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        <Cell fill="#16a34a" />
                        <Cell fill="#dc2626" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Subject-wise Performance - Bar Chart */}
                <div className="chart-card">
                  <h6>Subject-wise Average Marks</h6>
                  <p className="chart-subtitle">📚 Performance across subjects</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { subject: 'Math', average: 78 },
                      { subject: 'Physics', average: 72 },
                      { subject: 'Chemistry', average: 81 },
                      { subject: 'Biology', average: 75 },
                      { subject: 'English', average: 85 },
                      { subject: 'CS', average: 88 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="subject" fontSize={11} />
                      <YAxis domain={[0, 100]} fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
