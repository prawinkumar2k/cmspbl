import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../../../../context/AuthContext';
import {
    Book, FileText, TrendingUp, Award, Search,
    Filter, LayoutGrid, Calendar, ChevronRight,
    Target, Activity, Star, Clock, BookOpen, GraduationCap
} from 'lucide-react';
import "../components/css/studentDashboard.css";

/* ---------------- STAT CARD ---------------- */
const SummaryCard = ({ title, value, icon: Icon, color, progress, left, right }) => (
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

const MarkDetails = () => {
    const { getAuthHeaders } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('assignments');
    const [marksData, setMarksData] = useState({
        assignments: [],
        unitTests: [],
        practicals: [],
        universityMarks: []
    });

    // Filters
    const [assignmentFilter, setAssignmentFilter] = useState('All');
    const [unitTestFilter, setUnitTestFilter] = useState('All');
    const [practicalFilter, setPracticalFilter] = useState('All');
    const [semesterFilter, setSemesterFilter] = useState('All');

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const response = await fetch('/api/student-portal/marks', {
                    headers: getAuthHeaders()
                });
                const result = await response.json();
                if (result.success) {
                    setMarksData(result.data);
                }
            } catch (err) {
                console.error('Error fetching marks:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMarks();
    }, []);

    const filteredAssignments = assignmentFilter === 'All'
        ? marksData.assignments
        : marksData.assignments.filter(a => a.Assignment_No.toString() === assignmentFilter);

    const filteredUnitTests = unitTestFilter === 'All'
        ? marksData.unitTests
        : marksData.unitTests.filter(u => u.Test_No.toString() === unitTestFilter);

    const filteredPracticals = practicalFilter === 'All'
        ? marksData.practicals
        : marksData.practicals.filter(p => p.Test_No.toString() === practicalFilter);

    const filteredUniversity = semesterFilter === 'All'
        ? marksData.universityMarks
        : marksData.universityMarks.filter(u => u.Semester.toString() === semesterFilter);

    const assignmentNumbers = ['All', ...new Set(marksData.assignments.map(a => a.Assignment_No.toString()))].sort();
    const unitTestNumbers = ['All', ...new Set(marksData.unitTests.map(u => u.Test_No.toString()))].sort();
    const practicalNumbers = ['All', ...new Set(marksData.practicals.map(p => p.Test_No.toString()))].sort();
    const semesters = ['All', ...new Set(marksData.universityMarks.map(u => u.Semester.toString()))].sort();

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-GB');
    };

    // Calculate Summary Stats
    const getAvg = (data) => {
        if (!data.length) return 0;
        return Math.round(data.reduce((acc, curr) => acc + (curr.Obtained_Mark / curr.Max_Marks * 100), 0) / data.length);
    };

    const stats = {
        assignmentsCount: marksData.assignments.length,
        unitTestsCount: marksData.unitTests.length,
        practicalsCount: marksData.practicals.length,
        univCount: marksData.universityMarks.length,
        avgPerf: activeTab === 'assignments' ? getAvg(marksData.assignments) :
            activeTab === 'unitTests' ? getAvg(marksData.unitTests) :
                getAvg([...marksData.assignments, ...marksData.unitTests])
    };

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
                    <div className="dashboard-header mb-4">
                        <h5>Academic Assessment Report</h5>
                        <p><Activity size={16} /> Detailed insights into your continuous internal evaluations and university exam results.</p>
                    </div>

                    {/* STAT CARDS */}
                    <div className="stat-grid mb-4">
                        <SummaryCard
                            title="Total Assessments"
                            value={stats.assignmentsCount + stats.unitTestsCount + stats.practicalsCount + stats.univCount}
                            icon={FileText}
                            color="#2563eb"
                            progress={100}
                            left="Graded Tasks"
                            right="All Semesters"
                        />
                        <SummaryCard
                            title="Internal Average"
                            value={`${stats.avgPerf}%`}
                            icon={TrendingUp}
                            color="#10b981"
                            progress={stats.avgPerf}
                            left="Overall Accuracy"
                            right="Trend: ↗"
                        />
                        <SummaryCard
                            title="University Records"
                            value={stats.univCount}
                            icon={GraduationCap}
                            color="#9333ea"
                            progress={100}
                            left="Exams Cleared"
                            right="Main Stream"
                        />
                        <SummaryCard
                            title="Continuous Evaluation"
                            value={stats.assignmentsCount + stats.unitTestsCount}
                            icon={Target}
                            color="#f59e0b"
                            progress={85}
                            left="Internal Marks"
                            right="Consistency: High"
                        />
                    </div>

                    {/* NAVIGATION TABS */}
                    <div className="premium-nav-card shadow-sm mb-4">
                        <div className="nav nav-pills custom-assessment-tabs p-1">
                            <button
                                className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
                                onClick={() => setActiveTab('assignments')}
                            >
                                <LayoutGrid size={18} className="me-2" /> Assignments
                            </button>
                            <button
                                className={`nav-link ${activeTab === 'unitTests' ? 'active' : ''}`}
                                onClick={() => setActiveTab('unitTests')}
                            >
                                <Book size={18} className="me-2" /> Unit Tests
                            </button>
                            <button
                                className={`nav-link ${activeTab === 'practicals' ? 'active' : ''}`}
                                onClick={() => setActiveTab('practicals')}
                            >
                                <TrendingUp size={18} className="me-2" /> Practicals
                            </button>
                            <button
                                className={`nav-link ${activeTab === 'university' ? 'active' : ''}`}
                                onClick={() => setActiveTab('university')}
                            >
                                <Award size={18} className="me-2" /> University Results
                            </button>
                        </div>
                    </div>

                    {/* MAIN TABLE CARD */}
                    <div className="premium-card">
                        <div className="card-title-area border-0 mb-2">
                            <div className="d-flex align-items-center gap-3">
                                <div className={`tab-icon-pill bg-${activeTab === 'assignments' ? 'primary' : activeTab === 'unitTests' ? 'purple' : activeTab === 'practicals' ? 'green' : 'orange'}-subtle`}>
                                    {activeTab === 'assignments' ? <LayoutGrid size={20} /> : activeTab === 'unitTests' ? <Book size={20} /> : activeTab === 'practicals' ? <TrendingUp size={20} /> : <Award size={20} />}
                                </div>
                                <div>
                                    <h6 className="text-blue-900 mb-0 capitalize">{activeTab.replace(/([A-Z])/g, ' $1')} Details</h6>
                                    <span className="text-xs text-muted">Showing all evaluated records for the current semester</span>
                                </div>
                            </div>

                            <div className="filter-dropdown-container">
                                <div className="filter-pill">
                                    <Filter size={14} className="text-muted" />
                                    <span className="text-xs fw-bold">Filter By:</span>
                                    {activeTab === 'assignments' && (
                                        <select value={assignmentFilter} onChange={(e) => setAssignmentFilter(e.target.value)}>
                                            {assignmentNumbers.map(n => <option key={n} value={n}>{n === 'All' ? 'All Assignments' : `Assignment ${n}`}</option>)}
                                        </select>
                                    )}
                                    {activeTab === 'unitTests' && (
                                        <select value={unitTestFilter} onChange={(e) => setUnitTestFilter(e.target.value)}>
                                            {unitTestNumbers.map(n => <option key={n} value={n}>{n === 'All' ? 'All Unit Tests' : `Test ${n}`}</option>)}
                                        </select>
                                    )}
                                    {activeTab === 'practicals' && (
                                        <select value={practicalFilter} onChange={(e) => setPracticalFilter(e.target.value)}>
                                            {practicalNumbers.map(n => <option key={n} value={n}>{n === 'All' ? 'All Sessions' : `Session ${n}`}</option>)}
                                        </select>
                                    )}
                                    {activeTab === 'university' && (
                                        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
                                            {semesters.map(n => <option key={n} value={n}>{n === 'All' ? 'All Semesters' : `Semester ${n}`}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive custom-table-scroll mt-3">
                            {/* ASSIGNMENTS TABLE */}
                            {activeTab === 'assignments' && (
                                <table className="table premium-table align-middle">
                                    <thead>
                                        <tr>
                                            <th className="ps-4">Subject Information</th>
                                            <th className="text-center">Reference</th>
                                            <th className="text-center">Score Details</th>
                                            <th>Achievement</th>
                                            <th className="text-center">Date</th>
                                            <th className="pe-4 text-end">Outcome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAssignments.length > 0 ? filteredAssignments.map((a, i) => {
                                            const pct = (a.Obtained_Mark / a.Max_Marks) * 100;
                                            return (
                                                <tr key={i} className="hover-row">
                                                    <td className="ps-4">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="sub-icon bg-light text-primary"><BookOpen size={16} /></div>
                                                            <div>
                                                                <div className="fw-bold text-blue-900">{a.Sub_Name}</div>
                                                                <div className="text-xs text-muted fw-bold">{a.Sub_Code}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge-modern bg-blue-50 text-blue-600 border-blue-100">
                                                            ASSGN {a.Assignment_No}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="score-badge">
                                                            <span className="obtained">{a.Obtained_Mark}</span>
                                                            <span className="separator">/</span>
                                                            <span className="total">{a.Max_Marks}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-1" style={{ minWidth: '120px' }}>
                                                            <div className="progress-mini">
                                                                <div className={`fill ${pct >= 75 ? 'bg-success' : pct >= 50 ? 'bg-primary' : 'bg-warning'}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-xxs fw-extrabold text-blue-900">{Math.round(pct)}% Excellence Rate</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center text-muted text-xs">
                                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                                            <Clock size={12} className="text-blue-400" /> {formatDate(a.Assessment_Date)}
                                                        </div>
                                                    </td>
                                                    <td className="pe-4 text-end">
                                                        <span className={`status-pill ${pct >= 40 ? 'status-done' : 'status-pending'}`}>
                                                            {pct >= 40 ? 'COMPLETED' : 'RE-TRY'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        }) : <tr><td colSpan="6" className="py-5 text-center text-muted border-0">No assignment records found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* UNIT TEST TABLE */}
                            {activeTab === 'unitTests' && (
                                <table className="table premium-table align-middle">
                                    <thead>
                                        <tr>
                                            <th className="ps-4">Examination Subject</th>
                                            <th className="text-center">Test Cycle</th>
                                            <th className="text-center">Score Card</th>
                                            <th>Performance</th>
                                            <th className="text-center">Exam Date</th>
                                            <th className="pe-4 text-end">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUnitTests.length > 0 ? filteredUnitTests.map((u, i) => {
                                            const pct = (u.Obtained_Mark / u.Max_Marks) * 100;
                                            return (
                                                <tr key={i} className="hover-row">
                                                    <td className="ps-4">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="sub-icon bg-light text-purple"><FileText size={16} /></div>
                                                            <div>
                                                                <div className="fw-bold text-blue-900">{u.Sub_Name}</div>
                                                                <div className="text-xs text-muted fw-bold">{u.Sub_Code}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge-modern bg-purple-50 text-purple-600 border-purple-100">
                                                            CYCLE {u.Test_No}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="score-badge">
                                                            <span className="obtained text-purple-600">{u.Obtained_Mark}</span>
                                                            <span className="separator">/</span>
                                                            <span className="total">{u.Max_Marks}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-1" style={{ minWidth: '120px' }}>
                                                            <div className="progress-mini">
                                                                <div className={`fill ${pct >= 75 ? 'bg-success' : pct >= 50 ? 'bg-purple' : 'bg-warning'}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-xxs fw-extrabold text-blue-900">{Math.round(pct)}% Mastery Level</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center text-muted text-xs">
                                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                                            <Calendar size={12} className="text-purple-400" /> {formatDate(u.Assessment_Date)}
                                                        </div>
                                                    </td>
                                                    <td className="pe-4 text-end">
                                                        <span className={`status-pill ${pct >= 50 ? 'status-pass' : 'status-failed'}`}>
                                                            {pct >= 50 ? 'CLEARED' : 'FAILED'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        }) : <tr><td colSpan="6" className="py-5 text-center text-muted border-0">No unit test records found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* PRACTICAL TABLE */}
                            {activeTab === 'practicals' && (() => {
                                const maxExpInView = Math.max(0, ...filteredPracticals.map(p => p.Experiment_Count || 0));
                                const expHeaders = Array.from({ length: Math.min(15, maxExpInView) }, (_, i) => i + 1);

                                return (
                                    <table className="table premium-table align-middle text-center">
                                        <thead>
                                            <tr>
                                                <th className="ps-4 text-start sticky-col">Lab Course</th>
                                                <th className="text-center">Info</th>
                                                {expHeaders.map(num => (
                                                    <th key={num}>E{num}</th>
                                                ))}
                                                <th className="bg-light fw-bold">TOTAL</th>
                                                <th className="pe-4 text-end">SUBMITTED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPracticals.length > 0 ? filteredPracticals.map((p, i) => (
                                                <tr key={i} className="hover-row">
                                                    <td className="ps-4 text-start sticky-col">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="lab-dot" />
                                                            <div>
                                                                <div className="fw-bold text-blue-900 line-clamp-1">{p.Sub_Name}</div>
                                                                <div className="text-xxs text-muted fw-bold">{p.Sub_Code}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="text-xxs fw-extrabold text-blue-400">T-{p.Test_No}</div>
                                                        <div className="text-xxs text-muted fw-bold">CNT:{p.Experiment_Count}</div>
                                                    </td>
                                                    {expHeaders.map(num => {
                                                        const mark = p[`Obtained_Mark_Exp_${num}`];
                                                        const isTracked = num <= p.Experiment_Count;
                                                        return (
                                                            <td key={num} className="px-1">
                                                                {!isTracked ? (
                                                                    <span className="text-muted opacity-25">•</span>
                                                                ) : (
                                                                    <span className={`fw-bold text-xs ${mark === 'A' ? 'text-danger' : 'text-blue-900'}`}>{mark || '0'}</span>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="fw-extrabold text-success bg-light text-xs">{p.Obtained_Mark_Exp_Total}</td>
                                                    <td className="pe-4 text-end text-xxs fw-bold text-muted">
                                                        {formatDate(p.Assessment_Date)}
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan={expHeaders.length + 4} className="py-5 text-center text-muted border-0">No practical records found.</td></tr>}
                                        </tbody>
                                    </table>
                                );
                            })()}

                            {/* UNIVERSITY TABLE */}
                            {activeTab === 'university' && (
                                <table className="table premium-table align-middle">
                                    <thead>
                                        <tr>
                                            <th className="ps-4">Main Coursework</th>
                                            <th className="text-center">Academic Year</th>
                                            <th className="text-center">Internal</th>
                                            <th className="text-center">External</th>
                                            <th className="text-center">Total</th>
                                            <th className="pe-4 text-end">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUniversity.length > 0 ? filteredUniversity.map((u, i) => (
                                            <tr key={i} className="hover-row">
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="sub-icon bg-light text-warning"><Award size={16} /></div>
                                                        <div>
                                                            <div className="fw-bold text-blue-900">{u.Sub_Name}</div>
                                                            <div className="d-flex gap-2">
                                                                <span className="text-xxs text-muted fw-bold">{u.Sub_Code}</span>
                                                                <span className="badge-modern py-0 px-2 bg-orange-50 text-orange-600 border-orange-100">SEM {u.Semester}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="text-xs fw-bold text-blue-900">{u.Academic_Year}</div>
                                                    <div className="text-xxs text-muted">Regulation {u.Regulation}</div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="text-sm fw-bold text-muted">{u.Internal_Mark}</div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="text-sm fw-bold text-muted">{u.External_Mark}</div>
                                                </td>
                                                <td className="text-center">
                                                    <div className={`fw-extrabold fs-6 ${u.Status === 'PASS' ? 'text-primary' : 'text-danger'}`}>
                                                        {u.Total_Mark}
                                                    </div>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <span className={`status-pill ${u.Status === 'PASS' ? 'status-pass' : 'status-failed'}`}>
                                                        {u.Status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan="6" className="py-5 text-center text-muted border-0">No university examination records found.</td></tr>}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            <style>{`
                .premium-nav-card {
                    background: #fff;
                    border-radius: 14px;
                    padding: 6px;
                    width: fit-content;
                    border: 1px solid #eef2f6;
                }
                .custom-assessment-tabs .nav-link {
                    border: none !important;
                    background: transparent;
                    color: #64748b;
                    font-weight: 700;
                    padding: 10px 22px;
                    border-radius: 10px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                }
                .custom-assessment-tabs .nav-link.active {
                    background: #2563eb !important;
                    color: #fff !important;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }
                .tab-icon-pill {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bg-purple-subtle { background: #f5f3ff; color: #7c3aed; }
                .bg-green-subtle { background: #f0fdf4; color: #16a34a; }
                .bg-orange-subtle { background: #fff7ed; color: #ea580c; }
                
                .filter-pill {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #f8fafc;
                    padding: 6px 14px;
                    border-radius: 30px;
                    border: 1px solid #e2e8f0;
                }
                .filter-pill select {
                    background: transparent;
                    border: none;
                    font-size: 12px;
                    font-weight: 700;
                    color: #1e293b;
                    outline: none;
                }
                
                .premium-table thead th {
                    background: #f8fbff;
                    border: none;
                    color: #475569;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 16px 12px;
                }
                .premium-table tbody td {
                    padding: 18px 12px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .hover-row:hover { background-color: #fcfdfe; }
                .sub-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .badge-modern {
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    border: 1px solid;
                }
                .score-badge {
                    display: inline-flex;
                    align-items: baseline;
                    gap: 2px;
                    font-family: 'Inter', sans-serif;
                }
                .obtained { font-weight: 900; font-size: 16px; color: #1e3a8a; }
                .separator { color: #cbd5e1; font-size: 12px; margin: 0 2px; }
                .total { color: #94a3b8; font-weight: 600; font-size: 13px; }
                
                .progress-mini {
                    height: 5px;
                    background: #f1f5f9;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-mini .fill { height: 100%; border-radius: 4px; }
                
                .status-pill {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 800;
                }
                .status-done { background: #e0f2fe; color: #0369a1; }
                .status-pass { background: #dcfce7; color: #15803d; }
                .status-failed { background: #fee2e2; color: #b91c1c; }
                .status-pending { background: #fef3c7; color: #92400e; }
                
                .sticky-col { 
                    position: sticky; 
                    left: 0; 
                    background: #fff; 
                    z-index: 10;
                    box-shadow: 4px 0 8px rgba(0,0,0,0.02);
                }
                .lab-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #3b82f6;
                    flex-shrink: 0;
                }
                .custom-table-scroll {
                    max-height: 500px;
                    overflow: auto;
                }
                .custom-table-scroll::-webkit-scrollbar { width: 4px; height: 6px; }
                .custom-table-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
                .custom-table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                
                .text-xxs { font-size: 10px; }
                .bg-blue-50 { background: #eff6ff; }
                .text-blue-600 { color: #2563eb; }
                .border-blue-100 { border-color: #dbeafe; }
                .bg-purple-50 { background: #faf5ff; }
                .text-purple-600 { color: #9333ea; }
                .border-purple-100 { border-color: #f3e8ff; }
                .text-blue-400 { color: #60a5fa; }
                .bg-orange-50 { background: #fff7ed; }
                .text-orange-600 { color: #ea580c; }
                .border-orange-100 { border-color: #ffedd5; }
            `}</style>
        </section>
    );
};

export default MarkDetails;
