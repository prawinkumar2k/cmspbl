import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../../../../context/AuthContext';
import {
    BookOpen, GraduationCap, User, Hash,
    Calendar, Users, AlertCircle, CheckCircle,
    Info, BookMarked, UserCheck, Layout
} from 'lucide-react';
import "../components/css/studentDashboard.css";

const ProfileCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`premium-card academic-card ${className}`}>
        <div className="card-header-modern d-flex align-items-center gap-3 mb-4">
            <div className="icon-box-modern">
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <h6 className="mb-0 fw-bold text-dark">{title}</h6>
        </div>
        <div className="card-body p-0">
            {children}
        </div>
    </div>
);

const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="info-item-modern d-flex align-items-center gap-3 p-3 rounded-4 mb-3">
        <div className="info-icon-small">
            <Icon size={16} />
        </div>
        <div>
            <p className="item-label mb-0">{label}</p>
            <p className="item-value mb-0 fw-bold">{value || '---'}</p>
        </div>
    </div>
);

const AcademicHistory = () => {
    const { getAuthHeaders } = useAuth();
    const [loading, setLoading] = useState(true);
    const [academicData, setAcademicData] = useState({
        profile: null,
        subjects: [],
        arrears: []
    });

    useEffect(() => {
        const fetchAcademicDetails = async () => {
            try {
                const response = await fetch('/api/student-portal/academic-history', {
                    headers: getAuthHeaders()
                });
                const result = await response.json();
                if (result.success) {
                    setAcademicData({
                        profile: result.profile,
                        subjects: result.subjects,
                        arrears: result.arrears
                    });
                }
            } catch (err) {
                console.error('Error fetching academic info:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAcademicDetails();
    }, []);

    const { profile, subjects, arrears } = academicData;

    if (loading) {
        return (
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">

                    <div className="dashboard-header">
                        <h5>Academic History</h5>
                        <p><GraduationCap size={16} /> Comprehensive overview of your academic records and current progress.</p>
                    </div>

                    <div className="row g-4">
                        {/* Department & Identity Section - Full Width Top Row */}
                        <div className="col-12">
                            <ProfileCard title="Department Overview" icon={Layout}>
                                <div className="row g-3 px-3 pb-3">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <InfoItem label="Department Name" value={profile?.Dept_Name} icon={GraduationCap} />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <InfoItem label="Department Code" value={profile?.Dept_Code} icon={Hash} />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <InfoItem label="Current Semester" value={`${profile?.Semester} Semester`} icon={Calendar} />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <InfoItem label="Academic Year" value={profile?.Academic_Year} icon={BookOpen} />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <InfoItem label="Section / Class" value={`Section ${profile?.Class}`} icon={Users} />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <InfoItem label="Class Teacher" value={profile?.Class_Teacher} icon={UserCheck} />
                                    </div>
                                </div>
                            </ProfileCard>
                        </div>

                        {/* Current Semester Subjects - Left Column */}
                        <div className="col-12 col-lg-6">
                            <ProfileCard title="Current Semester Subjects" icon={BookMarked}>
                                <div className="table-responsive px-3">
                                    <table className="table table-hover align-middle custom-academic-table">
                                        <thead>
                                            <tr>
                                                <th>Subject Code</th>
                                                <th>Subject Name</th>
                                                <th>Handled By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjects.map((sub, index) => (
                                                <tr key={index}>
                                                    <td><span className="badge bg-light text-primary border">{sub.Sub_Code}</span></td>
                                                    <td className="fw-semibold">{sub.Sub_Name}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="staff-avatar">{sub.Staff_Name ? sub.Staff_Name.charAt(0) : '?'}</div>
                                                            <span className="staff-name text-nowrap">{sub.Staff_Name || 'Not Assigned'}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </ProfileCard>
                        </div>

                        {/* Arrear Details - Right Column */}
                        <div className="col-12 col-lg-6">
                            <ProfileCard title="Arrear subject History" icon={AlertCircle}>
                                {arrears && arrears.length > 0 ? (
                                    <div className="table-responsive px-3">
                                        <table className="table table-hover align-middle custom-academic-table">
                                            <thead>
                                                <tr>
                                                    <th>Semester</th>
                                                    <th>Code</th>
                                                    <th>Subject Name</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {arrears.map((arr, index) => (
                                                    <tr key={index}>
                                                        <td><span className="fw-bold text-muted">Sem {arr.semester}</span></td>
                                                        <td><span className="badge bg-light text-danger border">{arr.code}</span></td>
                                                        <td className="fw-medium">{arr.name}</td>
                                                        <td>
                                                            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill text-nowrap">
                                                                <AlertCircle size={14} className="me-1" /> {arr.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-5 text-center">
                                        <CheckCircle size={48} className="text-success mb-3 opacity-25" />
                                        <h6 className="text-muted">No Arrears Found</h6>
                                        <p className="text-xs text-muted mb-0">You have cleared all previous semester subjects.</p>
                                    </div>
                                )}
                            </ProfileCard>
                        </div>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .icon-box-modern {
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
                            color: #487fff;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 4px 10px rgba(72,127,255,0.1);
                        }
                        .info-item-modern {
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            transition: all 0.3s ease;
                        }
                        .info-item-modern:hover {
                            background: #fff;
                            transform: translateX(5px);
                            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                            border-color: #487fff;
                        }
                        .info-icon-small {
                            width: 32px;
                            height: 32px;
                            background: #fff;
                            color: #64748b;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: 1px solid #e2e8f0;
                        }
                        .item-label {
                            font-size: 10px;
                            font-weight: 700;
                            color: #94a3b8;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .item-value {
                            font-size: 0.9rem;
                            color: #1e293b;
                        }
                        .custom-academic-table thead th {
                            background: #f8fafc;
                            font-size: 11px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: #64748b;
                            font-weight: 800;
                            border-top: none;
                            padding: 15px;
                        }
                        .custom-academic-table tbody td {
                            padding: 15px;
                            border-bottom: 1px solid #f1f5f9;
                            font-size: 0.85rem;
                        }
                        .staff-avatar {
                            width: 30px;
                            height: 30px;
                            background: #487fff;
                            color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 0.8rem;
                            font-weight: bold;
                        }
                        .staff-name {
                            font-weight: 600;
                            color: #475569;
                        }
                        .badge-bg-danger-subtle {
                            background-color: #fee2e2;
                        }
                        .dashboard-header {
                            border: none !important;
                            outline: none !important;
                            box-shadow: none !important;
                            position: relative;
                        }
                        .dashboard-header h5 {
                            font-size: 24px;
                            margin: 0;
                        }
                        .header-icon-pill {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 28px;
                            height: 28px;
                            background: #eff6ff;
                            color: #3b82f6;
                            border-radius: 8px;
                        }
                        .text-muted { color: #64748b !important; font-size: 14px; }
                        .fw-extrabold { font-weight: 800; }
                    `}} />
                </div>
                <Footer />
            </div>
        </section>
    );
};

export default AcademicHistory;
