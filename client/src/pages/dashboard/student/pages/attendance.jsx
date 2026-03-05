import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import axios from 'axios';
import {
    Calendar as CalendarIcon, CheckCircle2, XCircle, Clock,
    ArrowUpRight, TrendingUp, Filter, Download, BookOpen
} from 'lucide-react';
import {
    PieChart, Pie, Cell, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import "../components/css/studentDashboard.css";

/* ---------------- STAT CARD ---------------- */
const AttendanceStats = ({ title, value, color, icon: Icon, progress, trend }) => {
    const isNegative = trend.startsWith('-');
    const trendValue = trend.replace(/[+-]/, '');
    const isZero = trend === '0%';

    return (
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
                <span className={`fw-bold d-flex align-items-center gap-1 ${isZero ? 'text-muted' : isNegative ? 'text-danger' : 'text-success'}`}>
                    {!isZero && (isNegative ? <TrendingUp size={14} style={{ transform: 'rotate(90deg)' }} /> : <ArrowUpRight size={14} />)}
                    {trend}
                </span>
                <span>Vs last month</span>
            </div>
        </div>
    );
};

const Attendance = () => {
    const [stats, setStats] = useState({
        totalPeriodAttendanceTakenCount: 0,
        totalPresent: 0,
        totalAbsent: 0,
        averagePercentage: 0
    });
    const [trends, setTrends] = useState({
        totalPeriodAttendanceTakenCount: 0,
        totalPresent: 0,
        totalAbsent: 0,
        averagePercentage: 0
    });
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [subjectWiseStats, setSubjectWiseStats] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendanceData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/student-portal/attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStats(response.data.stats);
                setTrends(response.data.trends);
                setMonthlyTrend(response.data.monthlyTrend);
                setSubjectWiseStats(response.data.subjectWiseStats);
                setAttendanceRecords(response.data.attendanceRecords);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const subjectWiseData = [
        { subject: 'Maths', value: 95 },
        { subject: 'Physics', value: 88 },
        { subject: 'Chem', value: 75 },
        { subject: 'Eng', value: 98 },
        { subject: 'CS', value: 100 },
    ];

    const getStatusBadge = (status) => {
        if (!status || status.trim() === '') return '-';
        const isPresent = status === 'Pr' || status === 'OD';
        const isAbsent = status === 'Ab' || status === 'ML';

        let color = 'secondary';
        if (isPresent) color = 'success';
        if (isAbsent) color = 'danger';

        return (
            <span className={`badge bg-${color}-subtle text-${color} px-2 py-1 rounded-pill fw-bold`} style={{ fontSize: '10px' }}>
                {status}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTrend = (val) => {
        if (val === 0) return '0%';
        return `${val > 0 ? '+' : ''}${val}%`;
    };

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip bg-white p-3 shadow-sm border rounded-3">
                    <p className="fw-bold mb-1" style={{ color: payload[0].payload.fill }}>{data.name}</p>
                    <p className="mb-0 text-muted small">Attendance: <span className="text-dark fw-bold">{data.value}%</span></p>
                    <p className="mb-0 text-muted small">Periods: <span className="text-dark fw-bold">{data.present}/{data.total}</span></p>
                </div>
            );
        }
        return null;
    };

    const COLORS = ['#2563eb', '#059669', '#0891b2', '#f59e0b', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444'];

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">

                    <div className="dashboard-header">
                        <div>
                            <h5>Attendance Analytics</h5>
                            <p><CalendarIcon size={16} /> Track your daily presence and semester-wise trends.</p>
                        </div>
                        {/* 
                        < it is after add this code d-flex justify-content-between align-items-start mb-4>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary btn-sm rounded-3 d-flex align-items-center gap-2">
                                <Filter size={14} /> Filter
                            </button>
                            <button className="btn btn-primary btn-sm rounded-3 d-flex align-items-center gap-2">
                                <Download size={14} /> Report
                            </button>
                        </div> */}
                    </div>

                    <div className="stat-grid mb-24">
                        <AttendanceStats
                            title="Total Period Attendance Taken Count"
                            value={stats.totalPeriodAttendanceTakenCount}
                            color="#2563eb"
                            icon={CalendarIcon}
                            progress={100}
                            trend={formatTrend(trends.totalPeriodAttendanceTakenCount)}
                        />
                        <AttendanceStats
                            title="Total Present"
                            value={stats.totalPresent}
                            color="#059669"
                            icon={CheckCircle2}
                            progress={stats.totalPeriodAttendanceTakenCount > 0 ? (stats.totalPresent / stats.totalPeriodAttendanceTakenCount) * 100 : 0}
                            trend={formatTrend(trends.totalPresent)}
                        />
                        <AttendanceStats
                            title="Total Absent"
                            value={stats.totalAbsent}
                            color="#dc2626"
                            icon={XCircle}
                            progress={stats.totalPeriodAttendanceTakenCount > 0 ? (stats.totalAbsent / stats.totalPeriodAttendanceTakenCount) * 100 : 0}
                            trend={formatTrend(trends.totalAbsent)}
                        />
                        <AttendanceStats
                            title="Average %"
                            value={`${stats.averagePercentage}%`}
                            color="#0891b2"
                            icon={Clock}
                            progress={stats.averagePercentage}
                            trend={formatTrend(trends.averagePercentage)}
                        />
                    </div>

                    <div className="row gy-4 mb-24">
                        {/* Monthly Trend Area Chart */}
                        <div className="col-12 col-lg-7">
                            <div className="premium-card h-100">
                                <div className="card-title-area">
                                    <div>
                                        <h6>Monthly Attendance Trend</h6>
                                        <p className="chart-subtitle">Percentage variation over current semester</p>
                                    </div>
                                    <TrendingUp size={20} className="text-muted" />
                                </div>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="percentage" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#colorPercentage)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Subject-wise Analysis Donut Chart */}
                        <div className="col-12 col-lg-5">
                            <div className="premium-card h-100">
                                <div className="card-title-area">
                                    <div>
                                        <h6>Subject-wise Analysis</h6>
                                        <p className="chart-subtitle">Detailed attendance per course</p>
                                    </div>
                                    <BookOpen size={20} className="text-muted" />
                                </div>
                                <div style={{ height: '300px' }} className="d-flex align-items-center justify-content-center">
                                    {subjectWiseStats.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={subjectWiseStats}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {subjectWiseStats.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomPieTooltip />} />
                                                <Legend
                                                    layout="horizontal"
                                                    verticalAlign="bottom"
                                                    align="center"
                                                    wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-center text-muted">
                                            <div className="mb-2"><BookOpen size={40} opacity={0.2} /></div>
                                            <p>No subject data available</p>
                                        </div>
                                    )}
                                </div>
                                {subjectWiseStats.some(s => s.value < 75) && (
                                    <div className="mt-3 bg-danger-subtle p-2 rounded-3 d-flex align-items-center gap-2">
                                        <XCircle size={14} className="text-danger" />
                                        <span className="text-danger fw-medium" style={{ fontSize: '11px' }}>
                                            Low Attendance: {subjectWiseStats.filter(s => s.value < 75).map(s => s.name).join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Daily Logs Table */}
                    <div className="premium-card">
                        <div className="card-title-area">
                            <h6>Daily Period-wise Attendance Logs</h6>
                            <Clock size={18} className="text-muted" />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th className="border-0 bg-light py-3 px-4 rounded-start">Date</th>
                                        <th className="border-0 bg-light py-3 text-center">P1</th>
                                        <th className="border-0 bg-light py-3 text-center">P2</th>
                                        <th className="border-0 bg-light py-3 text-center">P3</th>
                                        <th className="border-0 bg-light py-3 text-center">P4</th>
                                        <th className="border-0 bg-light py-3 text-center">P5</th>
                                        <th className="border-0 bg-light py-3 text-center rounded-end">P6</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">Loading attendance records...</td>
                                        </tr>
                                    ) : attendanceRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">No attendance records found.</td>
                                        </tr>
                                    ) : (
                                        attendanceRecords.map((record, i) => (
                                            <tr key={i}>
                                                <td className="px-4 fw-medium text-dark">{formatDate(record.date)}</td>
                                                <td className="text-center">{getStatusBadge(record['1'])}</td>
                                                <td className="text-center">{getStatusBadge(record['2'])}</td>
                                                <td className="text-center">{getStatusBadge(record['3'])}</td>
                                                <td className="text-center">{getStatusBadge(record['4'])}</td>
                                                <td className="text-center">{getStatusBadge(record['5'])}</td>
                                                <td className="text-center">{getStatusBadge(record['6'])}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </section>
    );
};

export default Attendance;
