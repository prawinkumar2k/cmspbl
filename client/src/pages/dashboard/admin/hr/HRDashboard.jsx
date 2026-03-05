import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';

import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Users, UserCheck, UserX, Clock, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";

// Stat Card Component - Matching Admin Dashboard Style
const StatCard = ({ title, value, icon: LucideIcon, color, progress, left, right, onClick }) => (
    <div className="stat-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="stat-top">
            <div>
                <div className="stat-title">{title}</div>
                <div className="stat-value" style={{ color }}>{value}</div>
            </div>
            <LucideIcon size={26} color={color} />
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

const HRDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        onLeave: 0,
        newJoinees: 0
    });

    // Quick Actions
    const quickActions = [
        { title: 'Staff Directory', icon: 'mdi:account-search', path: '/hr/staff-directory', color: '#06b6d4', description: 'View all employees' },
        { title: 'Add Employee', icon: 'mdi:account-plus', path: '/admin/master/StaffDetails?add=true', color: '#10b981', description: 'Register new staff' },
        { title: 'Leave Requests', icon: 'mdi:calendar-check', path: '/hr/leave-approval', color: '#f59e0b', description: 'Approve/reject leaves' },
        { title: 'Attendance', icon: 'mdi:clipboard-check', path: '/hr/staff-attendance', color: '#8b5cf6', description: 'Mark daily attendance' },
    ];

    // HR Modules
    const hrModules = [
        {
            title: 'Employee Management',
            icon: 'mdi:account-group',
            color: '#3b82f6',
            items: [
                { name: 'Staff Directory', icon: 'mdi:account-search', path: '/hr/staff-directory' },
                { name: 'Employee Profile', icon: 'mdi:account-details', path: '/hr/employee-profile' },
                { name: 'Staff Documents', icon: 'mdi:file-document-multiple', path: '/hr/staff_documents' },
                { name: 'Employee Reports', icon: 'mdi:file-account', path: '/hr/employee-reports' },
            ]
        },
        {
            title: 'Attendance & Time',
            icon: 'mdi:clock-time-eight',
            color: '#8b5cf6',
            items: [
                { name: 'Staff Attendance', icon: 'mdi:clipboard-check', path: '/hr/staff-attendance' },
                { name: 'Time Office', icon: 'mdi:clock-outline', path: '/hr/time-office' },
                { name: 'Shift Management', icon: 'mdi:calendar-clock', path: '/hr/shift_management' },
                { name: 'Attendance Report', icon: 'mdi:file-chart', path: '/hr/attendance_report' },
            ]
        },
        {
            title: 'Leave Management',
            icon: 'mdi:calendar-check',
            color: '#f59e0b',
            items: [
                { name: 'Leave Application', icon: 'mdi:calendar-plus', path: '/hr/leave-application' },
                { name: 'Leave Approval', icon: 'mdi:calendar-check', path: '/hr/leave-approval' },
                { name: 'Leave Register', icon: 'mdi:book-open-page-variant', path: '/hr/leave-register' },
                { name: 'Leave Configuration', icon: 'mdi:cog', path: '/hr/leave-configuration' },
                { name: 'Leave Balance', icon: 'mdi:calendar-account', path: '/hr/leave_balance' },
                { name: 'Leave Analysis', icon: 'mdi:chart-line', path: '/hr/leave-analysis' },
            ]
        },
        {
            title: 'Payroll & Salary',
            icon: 'mdi:cash-multiple',
            color: '#10b981',
            items: [
                { name: 'Salary Structure', icon: 'mdi:currency-inr', path: '/hr/salary-structure' },
                { name: 'Monthly Processing', icon: 'mdi:cog-sync', path: '/hr/monthly-processing' },
                { name: 'Payslip Generation', icon: 'mdi:file-document', path: '/hr/payslip_generation' },
                { name: 'Payroll Reports', icon: 'mdi:chart-bar', path: '/hr/payroll_reports' },
                { name: 'Payroll Summary', icon: 'mdi:file-chart', path: '/hr/payroll-summary' },
            ]
        },
    ];

    // Fetch dashboard stats
    const fetchStats = async () => {
        try {
            const response = await api.get('/staff_master');
            console.log('📡 API Response:', response);
            console.log('📡 Response data:', response.data);
            console.log('📡 Data type:', typeof response.data, Array.isArray(response.data));
            const data = Array.isArray(response.data) ? response.data : [];
            console.log('📊 Staff data fetched:', data.length, 'records');

            const activeCount = data.filter(s => !s.Reliving_Date || s.Reliving_Date === '' || s.Reliving_Date === null).length;
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            const newJoinees = data.filter(s => {
                if (!s.Joining_Date) return false;
                const joiningDate = new Date(s.Joining_Date);
                return joiningDate >= thirtyDaysAgo && joiningDate <= today;
            }).length;
            console.log('✅ Stats:', { total: data.length, active: activeCount, newJoinees });

            setStats({
                totalEmployees: data.length,
                activeEmployees: activeCount,
                onLeave: Math.floor(activeCount * 0.05), // Placeholder
                newJoinees: newJoinees
            });
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error message:', error.message);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        fetchStats();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchStats();
        toast.success('Dashboard refreshed');
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <style>{`
                /* Dashboard Card Styles - Matching Admin Dashboard */
                .stat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }

                /* Dashboard Card Hover Effects - From Admin Dashboard */
                .dashboard-card-dept {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border-radius: 20px;
                    border: 2px solid rgba(102, 126, 234, 0.1);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                    position: relative;
                    overflow: hidden;
                    background: white;
                }

                .dashboard-card-dept:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
                    border-color: rgba(102, 126, 234, 0.3);
                }

                /* Badge Styling with Gradient */
                .badge-gradient {
                    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    display: inline-block;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                }

                .badge-gradient:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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

                /* Quick Action Card */
                .quick-action-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border-radius: 12px;
                    background: #ffffff;
                }

                .quick-action-card:hover {
                    transform: translateY(-5px);
                }

                /* HR Module Card */
                .hr-module-card {
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 1px solid #e5e7eb;
                }

                .hr-module-card:hover {
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .hr-module-header {
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .hr-module-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hr-module-items {
                    padding: 12px 16px;
                }

                .hr-module-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    color: #374151;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }

                .hr-module-item:hover {
                    background: #f8fafc;
                    color: #1e40af;
                }

                .hr-module-item-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                }

                /* Animation */
                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .fade-in-up {
                    animation: fadeInUp 0.6s ease backwards;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .activity-timeline .border-bottom:last-child {
                    border-bottom: none !important;
                }
            `}</style>

            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        {/* Page Header */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                            <div>
                                <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    <Icon icon="mdi:account-tie" className="text-purple" style={{ fontSize: '28px' }} />
                                    HR Dashboard
                                </h6>
                                <small className="text-muted">Human Resource Management System</small>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                >
                                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0">
                                        <li className="breadcrumb-item"><a href="/admin/dashboard">Admin</a></li>
                                        <li className="breadcrumb-item active">HR Dashboard</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="stat-grid fade-in-up">
                                    <StatCard
                                        title="Total Employees"
                                        value={stats.totalEmployees}
                                        icon={Users}
                                        color="#3b82f6"
                                        progress={100}
                                        left="All Staff"
                                        right="Complete Roster"
                                        onClick={() => navigate('/admin/master/StaffDetails')}
                                    />
                                    <StatCard
                                        title="Active Employees"
                                        value={stats.activeEmployees}
                                        icon={UserCheck}
                                        color="#10b981"
                                        progress={(stats.activeEmployees / stats.totalEmployees) * 100 || 0}
                                        left="Currently Working"
                                        right={`${((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}%`}
                                    />
                                    <StatCard
                                        title="On Leave Today"
                                        value={stats.onLeave}
                                        icon={Calendar}
                                        color="#f59e0b"
                                        progress={(stats.onLeave / stats.activeEmployees) * 100 || 0}
                                        left="Approved Leaves"
                                        right="Today"
                                        onClick={() => navigate('/hr/leave-approval')}
                                    />
                                    <StatCard
                                        title="New Joinees"
                                        value={stats.newJoinees}
                                        icon={UserCheck}
                                        color="#8b5cf6"
                                        progress={(stats.newJoinees / stats.totalEmployees) * 100 || 0}
                                        left="Last 30 Days"
                                        right="Recent Hires"
                                    />
                                </div>

                                {/* Quick Actions */}
                                <div className="mb-4 mt-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    <h6 className="fw-semibold mb-3">
                                        <Icon icon="mdi:lightning-bolt" className="text-warning me-2" />
                                        Quick Actions
                                    </h6>
                                    <div className="row g-3">
                                        {quickActions.map((action, index) => (
                                            <div key={index} className="col-6 col-md-3">
                                                <div
                                                    className="quick-action-card p-3 border shadow-sm text-center h-100"
                                                    onClick={() => navigate(action.path)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div
                                                        className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            background: `${action.color}15`
                                                        }}
                                                    >
                                                        <Icon icon={action.icon} style={{ fontSize: '24px', color: action.color }} />
                                                    </div>
                                                    <h6 className="mb-1" style={{ fontSize: '14px' }}>{action.title}</h6>
                                                    <small className="text-muted">{action.description}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* HR Modules */}
                                <div className="fade-in-up mt-4" style={{ animationDelay: '0.2s' }}>
                                    <h6 className="fw-semibold mb-3">
                                        <Icon icon="mdi:apps" className="text-primary me-2" />
                                        HR Modules
                                    </h6>
                                    <div className="row g-4">
                                        {hrModules.map((module, index) => (
                                            <div key={index} className="col-12 col-md-6 col-lg-3">
                                                <div className="hr-module-card h-100">
                                                    <div className="hr-module-header" style={{ background: `${module.color}10` }}>
                                                        <div
                                                            className="hr-module-icon"
                                                            style={{ background: module.color }}
                                                        >
                                                            <Icon icon={module.icon} style={{ fontSize: '22px', color: 'white' }} />
                                                        </div>
                                                        <h6 className="mb-0 fw-semibold" style={{ fontSize: '15px' }}>{module.title}</h6>
                                                    </div>
                                                    <div className="hr-module-items">
                                                        {module.items.map((item, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={item.path}
                                                                className="hr-module-item"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    navigate(item.path);
                                                                }}
                                                            >
                                                                <div className="hr-module-item-icon">
                                                                    <Icon icon={item.icon} style={{ fontSize: '16px', color: module.color }} />
                                                                </div>
                                                                <span>{item.name}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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

export default HRDashboard;
