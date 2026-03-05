import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { useAuth } from '../../../context/AuthContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    PieChart, Pie
} from 'recharts';
import {
    BookOpen, Calendar, ClipboardCheck, GraduationCap,
    TrendingUp, CheckCircle, Target, AlertCircle,
    Award, Clock, Book, Activity
} from 'lucide-react';

import "./components/css/studentDashboard.css";

/* ---------------- TOOLTIP ---------------- */
const DashboardTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="dashboard-tooltip">
            <strong>{label}</strong>
            <div>Value: {payload[0].value}{payload[0].name === 'attendance' ? '%' : ''}</div>
        </div>
    );
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value, icon: Icon, color, progress, left, right }) => (
    <div className="stat-card">
        <div className="stat-top">
            <div>
                <div className="stat-title">{title}</div>
                <div className="stat-value" style={{ color }}>{value}</div>
            </div>
            <Icon size={26} color={color} />
        </div>
        <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%`, background: color }} />
        </div>
        <div className="stat-footer">
            <span>{left}</span>
            <span>{right}</span>
        </div>
    </div>
);


/* ---------------- MAIN COMPONENT ---------------- */
const StudentDashboard = () => {
    const { getAuthHeaders } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        profile: null,
        attendance: null,
        marks: null,
        academic: null,
        timetable: null
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const endpoints = [
                    '/api/student-portal/profile',
                    '/api/student-portal/attendance',
                    '/api/student-portal/marks',
                    '/api/student-portal/academic-history',
                    '/api/student-portal/timetable'
                ];

                const [profileRes, attRes, marksRes, academicRes, timetableRes] = await Promise.all(
                    endpoints.map(url => fetch(url, { headers: getAuthHeaders() }).then(res => res.json()))
                );

                setDashboardData({
                    profile: profileRes.success ? profileRes.profile : null,
                    attendance: attRes.success ? attRes : null,
                    marks: marksRes.success ? marksRes.data : null,
                    academic: academicRes.success ? academicRes : null,
                    timetable: timetableRes.success ? timetableRes.timetable : null
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Derived Statistics
    const stats = useMemo(() => {
        if (!dashboardData.attendance || !dashboardData.marks) {
            return {
                attendance: 0,
                subjects: 0,
                assignments: 0,
                gpa: 0,
                arrears: 0,
                courseProgress: 0
            };
        }

        const att = dashboardData.attendance.stats.averagePercentage;
        const subCount = dashboardData.academic?.subjects?.length || 0;
        const arrears = dashboardData.academic?.arrears?.length || 0;

        // Simple GPA calculation from Unit Tests and Assignments
        const allMarks = [
            ...(dashboardData.marks.assignments || []),
            ...(dashboardData.marks.unitTests || [])
        ];

        const gpa = allMarks.length > 0
            ? (allMarks.reduce((acc, m) => acc + (m.Obtained_Mark / m.Max_Marks), 0) / allMarks.length * 10).toFixed(1)
            : '0.0';

        // Course Progress based on Semester (Assuming 8 semesters total)
        const currentSem = parseInt(dashboardData.profile?.Semester || 1);
        const courseProgress = Math.round((currentSem / 8) * 100);

        return {
            attendance: att,
            subjects: subCount,
            assignments: dashboardData.marks.assignments?.length || 0,
            gpa: gpa,
            arrears: arrears,
            courseProgress: courseProgress
        };
    }, [dashboardData]);

    // Attendance Trend Data
    const attendanceTrend = useMemo(() => {
        if (!dashboardData.attendance?.monthlyTrend) return [];
        return dashboardData.attendance.monthlyTrend.map(m => ({
            name: m.month,
            attendance: m.percentage
        }));
    }, [dashboardData.attendance]);

    // Performance Comparison
    const performanceData = useMemo(() => {
        if (!dashboardData.attendance?.subjectWiseStats) return [];
        return dashboardData.attendance.subjectWiseStats.slice(0, 5).map(s => ({
            subject: s.name.split(' ').map(w => w[0]).join(''), // Abbreviate
            score: s.value,
            avg: 75 // Class average placeholder
        }));
    }, [dashboardData.attendance]);

    // Syllabus Progress Pie
    const syllabusProgress = [
        { name: 'Completed', value: stats.courseProgress },
        { name: 'Pending', value: 100 - stats.courseProgress },
    ];


    const COLORS = ['#3b82f6', '#e2e8f0', '#f59e0b', '#ef4444'];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">

                    {/* HEADER */}
                    <div className="dashboard-header">
                        <h5>Student Portal Analytics</h5>
                        <p><Activity size={16} /> Welcome back, {dashboardData.profile?.Student_Name || 'Student'}! Here's your real-time academic overview.</p>
                    </div>

                    {/* STAT CARDS */}
                    <div className="stat-grid">
                        <StatCard
                            title="Overall Attendance"
                            value={`${stats.attendance}%`}
                            icon={Calendar}
                            color="#2563eb"
                            progress={stats.attendance}
                            left="Current Semester"
                            right={`Target: 75%`}
                        />
                        <StatCard
                            title="Total Subjects"
                            value={stats.subjects}
                            icon={BookOpen}
                            color="#059669"
                            progress={100}
                            left="Enrolled Courses"
                            right={`Sem ${dashboardData.profile?.Semester || 'N/A'}`}
                        />
                        <StatCard
                            title="Arrears Count"
                            value={stats.arrears}
                            icon={AlertCircle}
                            color={stats.arrears > 0 ? "#ef4444" : "#059669"}
                            progress={stats.arrears > 0 ? 30 : 100}
                            left="Previous History"
                            right={stats.arrears > 0 ? "Action Required" : "All Clear"}
                        />
                        <StatCard
                            title="Internal GPA"
                            value={stats.gpa}
                            icon={GraduationCap}
                            color="#9333ea"
                            progress={parseFloat(stats.gpa) * 10}
                            left="Current Standing"
                            right="Estimated"
                        />
                    </div>


                    {/* CHARTS ROW 1 */}
                    <div className="row gy-4 mb-4">
                        <div className="col-12 col-xl-8">
                            <div className="premium-card h-100">
                                <div className="card-title-area">
                                    <div>
                                        <h6>Attendance Trend Analysis</h6>
                                        <p className="chart-subtitle">5-Month presence tracking</p>
                                    </div>
                                    <TrendingUp size={20} className="text-muted" />
                                </div>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                                            <Tooltip content={<DashboardTooltip />} />
                                            <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} fill="url(#colorAtt)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-4">
                            <div className="premium-card h-100">
                                <div className="card-title-area">
                                    <div>
                                        <h6>Academic Milestone</h6>
                                        <p className="chart-subtitle">Overall Degree Progress</p>
                                    </div>
                                    <BookOpen size={20} className="text-muted" />
                                </div>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={syllabusProgress} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                                                {syllabusProgress.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<DashboardTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center mt-3">
                                    <h4 className="fw-extrabold text-blue-900 mb-0">{stats.courseProgress}%</h4>
                                    <p className="text-xs text-muted mb-0">Total Degree Completed</p>
                                </div>
                                <div className="d-flex justify-content-center gap-4 mt-3">
                                    {syllabusProgress.map((item, i) => (
                                        <div key={i} className="d-flex align-items-center gap-2">
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                                            <span className="text-xs text-muted">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <style>{`
                .text-xxs { font-size: 10px; }
                .text-blue-900 { color: #1e3a8a; }
                .timetable-table { font-size: 11px; }
                .timetable-table th { background: #f8fbff; color: #64748b; font-weight: 700; border: none; padding: 12px 8px; }
                .timetable-table td { border-bottom: 1px solid #f1f5f9; padding: 12px 8px; }
                .hover-bg-soft-blue:hover { background: #eff6ff; }
            `}</style>
        </section>
    );
};

export default StudentDashboard;
