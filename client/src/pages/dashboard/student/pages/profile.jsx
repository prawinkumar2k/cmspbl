import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import {
    User, Mail, Phone, MapPin, GraduationCap,
    Calendar, CreditCard, Award, BookOpen,
    Activity, Shield, Heart, Globe, Users,
    Briefcase, Landmark, Hash, Info, Loader2,
    ShieldCheck, Home, Bus, Gift, FileText, UserCheck, Scale,
    Edit2, Save, X, CheckCircle
} from 'lucide-react';

const ProfileSection = ({ title, icon: Icon, children, className = "", canEdit = false, isEditing = false, onEditToggle }) => (
    <div className={`premium-card profile-section-card ${className} ${isEditing ? 'editing-mode' : ''}`}>
        <div className="section-header-modern d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
                <div className="icon-container-modern d-flex align-items-center justify-content-center">
                    <Icon size={22} strokeWidth={2.5} />
                </div>
                <div className="title-container-modern">
                    <h6 className="section-title-modern mb-0">{title}</h6>
                    <div className="accent-line-modern"></div>
                </div>
            </div>
            {canEdit && (
                <button
                    onClick={onEditToggle}
                    className={`edit-toggle-btn d-flex align-items-center justify-content-center transition-all ${isEditing ? 'active' : ''}`}
                    title={isEditing ? "Stop Editing" : "Edit Section"}
                >
                    {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                </button>
            )}
        </div>
        <div className="card-content">
            <div className="row g-4">
                {children}
            </div>
        </div>
    </div>
);

const DetailItem = ({ label, value, icon: Icon, className = "col-12 col-md-6", isEditing = false, name, type = "text", onChange }) => (
    <div className={className}>
        <div className={`detail-item-modern d-flex align-items-center gap-3 p-3 rounded-4 transition-all h-100 ${isEditing ? 'editing' : ''}`}>
            <div className="detail-icon-box d-flex align-items-center justify-content-center flex-shrink-0">
                {Icon ? <Icon size={16} strokeWidth={2.5} /> : <div className="placeholder-dot" />}
            </div>
            <div className="flex-grow-1 min-w-0">
                <p className="detail-label mb-0">{label}</p>
                {isEditing ? (
                    type === "textarea" ? (
                        <textarea
                            name={name}
                            value={value || ''}
                            onChange={onChange}
                            className="form-control-modern mt-1"
                            rows="2"
                        />
                    ) : (
                        <input
                            type={type}
                            name={name}
                            value={value || ''}
                            onChange={onChange}
                            className="form-control-modern mt-1"
                        />
                    )
                ) : (
                    <div className="detail-value text-xs">{value || '---'}</div>
                )}
            </div>
        </div>
    </div>
);

const StudentProfiles = () => {
    const { getAuthHeaders } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState({
        personal: false,
        contact: false,
        family: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const isAnyEditing = Object.values(isEditing).some(v => v);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/student-portal/profile', {
                    headers: getAuthHeaders()
                });
                const result = await response.json();
                if (result.success) {
                    setProfile(result.profile);
                } else {
                    setError(result.error || 'Failed to fetch profile');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditToggle = (section) => {
        setIsEditing(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
        if (!isEditing[section]) {
            // Store current profile data into editData when starting edit
            setEditData(prev => ({
                ...prev,
                ...profile
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const response = await fetch('/api/student-portal/profile', {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData)
            });
            const result = await response.json();
            if (result.success) {
                setProfile(editData);
                setIsEditing({ personal: false, contact: false, family: false });
                toast.success('Profile updated successfully!');
            } else {
                toast.error(result.error || 'Update failed');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error('Connection error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing({ personal: false, contact: false, family: false });
        setEditData({});
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '---';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body d-flex align-items-center justify-content-center">
                        <div className="text-center">
                            <Loader2 size={40} className="text-primary spin-animation mb-3" />
                            <h6 className="text-muted fw-medium pulse-animation">Syncing Profile Details...</h6>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

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

                        <div className="dashboard-header">
                            <h5>Student Profile</h5>
                            <p>
                                <Shield size={16} /> Secure Academic Records Identification
                            </p>
                        </div>

                        <div className="row g-5">
                            {/* Profile Identity Card - Premium Banner Style */}
                            <div className="col-12">
                                <div className="premium-card p-0 border-0 shadow-lg overflow-hidden rounded-5 mb-2">
                                    <div className="profile-banner position-relative">
                                        {/* Abstract Pattern Background */}
                                        <div className="position-absolute top-0 start-0 w-100 h-100"
                                            style={{
                                                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                                zIndex: 0
                                            }}>
                                            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-20"
                                                style={{
                                                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                                    backgroundSize: '32px 32px'
                                                }}></div>
                                        </div>

                                        <div className="p-5 d-flex flex-column flex-md-row align-items-center gap-4 position-relative" style={{ zIndex: 1 }}>
                                            <div className="profile-avatar-wrapper shadow-2xl rounded-circle p-1 bg-white">
                                                <img
                                                    src={profile?.Photo_Path ? `/api/studentMaster/student/student-image/${profile.Photo_Path}` : "/api/studentMaster/student/student-image/student.png"}
                                                    alt="Profile"
                                                    className="rounded-circle object-fit-cover border border-5 border-white shadow-sm"
                                                    style={{ width: '120px', height: '120px' }}
                                                    onError={(e) => { e.target.src = "/api/studentMaster/student/student-image/student.png" }}
                                                />
                                            </div>
                                            <div className="text-center text-md-start text-white">
                                                <div className="badge bg-white bg-opacity-20 text-primary px-3 py-1 rounded-pill mb-3 fw-bold text-xs tracking-widest border border-white border-opacity-25 uppercase">
                                                    Active Student
                                                </div>
                                                <h1 className="fw-extrabold mb-3 display-5 text-2xl letter-spacing-tight">{profile?.Student_Name}</h1>

                                                <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-md-start align-items-center opacity-90">
                                                    <div className="d-flex align-items-center gap-2 fw-semibold">
                                                        <Hash size={18} className="text-white-50" />
                                                        <span className="fs-5">{profile?.Register_Number}</span>
                                                    </div>
                                                    <div className="vr bg-white opacity-25 d-none d-md-block" style={{ height: '24px' }}></div>
                                                    <div className="d-flex align-items-center gap-2 fw-medium">
                                                        <Landmark size={18} className="text-white-50" />
                                                        <span>{profile?.Dept_Name}</span>
                                                    </div>
                                                    <div className="vr bg-white opacity-25 d-none d-md-block" style={{ height: '24px' }}></div>
                                                    <div className="d-flex align-items-center gap-2 fw-medium">
                                                        <Users size={18} className="text-white-50" />
                                                        <span>Section {profile?.Class}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 d-flex gap-3 justify-content-center justify-content-md-start">
                                                    <div className="glass-badge px-4 py-2 rounded-pill">
                                                        Semester {profile?.Semester}
                                                    </div>
                                                    <div className="glass-badge px-4 py-2 rounded-pill">
                                                        Year {profile?.Year}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Split Details with Massive Spacing */}
                            <div className="col-12 col-xl-8">
                                <div className="d-flex flex-column gap-4">
                                    {/* Personal Details */}
                                    <ProfileSection
                                        title="Personal Information"
                                        icon={User}
                                        canEdit={true}
                                        isEditing={isEditing.personal}
                                        onEditToggle={() => handleEditToggle('personal')}
                                    >
                                        <DetailItem label="Full Name" value={isEditing.personal ? editData.Student_Name : profile?.Student_Name} icon={User} isEditing={isEditing.personal} name="Student_Name" onChange={handleChange} />
                                        <DetailItem label="Date of Birth" value={isEditing.personal ? editData.Dob : formatDateForDisplay(profile?.Dob)} icon={Calendar} isEditing={isEditing.personal} name="Dob" type="date" onChange={handleChange} />
                                        <DetailItem label="Gender" value={isEditing.personal ? editData.Gender : profile?.Gender} icon={Activity} isEditing={isEditing.personal} name="Gender" onChange={handleChange} />
                                        <DetailItem label="Blood Group" value={isEditing.personal ? editData.Blood_Group : profile?.Blood_Group} icon={Heart} isEditing={isEditing.personal} name="Blood_Group" onChange={handleChange} />
                                        <DetailItem label="Nationality" value={isEditing.personal ? editData.Nationality : profile?.Nationality} icon={Globe} isEditing={isEditing.personal} name="Nationality" onChange={handleChange} />
                                        <DetailItem label="Religion" value={isEditing.personal ? editData.Religion : profile?.Religion} icon={Scale} isEditing={isEditing.personal} name="Religion" onChange={handleChange} />
                                        <DetailItem label="Community" value={isEditing.personal ? editData.Community : profile?.Community} icon={Users} isEditing={isEditing.personal} name="Community" onChange={handleChange} />
                                        <DetailItem label="Caste" value={isEditing.personal ? editData.Caste : profile?.Caste} icon={Users} isEditing={isEditing.personal} name="Caste" onChange={handleChange} />
                                        <DetailItem label="Aadhaar Number" value={isEditing.personal ? editData.Aadhaar_No : profile?.Aadhaar_No} icon={ShieldCheck} isEditing={isEditing.personal} name="Aadhaar_No" onChange={handleChange} />
                                    </ProfileSection>

                                    {/* Contact Details */}
                                    <ProfileSection
                                        title="Contact Information"
                                        icon={Mail}
                                        canEdit={true}
                                        isEditing={isEditing.contact}
                                        onEditToggle={() => handleEditToggle('contact')}
                                    >
                                        <DetailItem label="Email Address" value={isEditing.contact ? editData.Std_Email : profile?.Std_Email} icon={Mail} isEditing={isEditing.contact} name="Std_Email" onChange={handleChange} />
                                        <DetailItem label="Phone Number" value={isEditing.contact ? editData.Student_Mobile : profile?.Student_Mobile} icon={Phone} isEditing={isEditing.contact} name="Student_Mobile" onChange={handleChange} />
                                        <DetailItem label="Permanent Address" value={isEditing.contact ? editData.Permanent_Address : profile?.Permanent_Address} icon={MapPin} isEditing={isEditing.contact} name="Permanent_Address" type="textarea" onChange={handleChange} />
                                        <DetailItem label="Current Address" value={isEditing.contact ? editData.Current_Address : profile?.Current_Address} icon={MapPin} isEditing={isEditing.contact} name="Current_Address" type="textarea" onChange={handleChange} />
                                    </ProfileSection>

                                    {/* Guardian Details */}
                                    <ProfileSection
                                        title="Guardian & Family"
                                        icon={Users}
                                        canEdit={true}
                                        isEditing={isEditing.family}
                                        onEditToggle={() => handleEditToggle('family')}
                                    >
                                        <DetailItem label="Father's Name" value={isEditing.family ? editData.Father_Name : profile?.Father_Name} icon={User} isEditing={isEditing.family} name="Father_Name" onChange={handleChange} />
                                        <DetailItem label="Father's Phone" value={isEditing.family ? editData.Father_Mobile : profile?.Father_Mobile} icon={Phone} isEditing={isEditing.family} name="Father_Mobile" onChange={handleChange} />
                                        <DetailItem label="Mother's Name" value={isEditing.family ? editData.Mother_Name : profile?.Mother_Name} icon={User} isEditing={isEditing.family} name="Mother_Name" onChange={handleChange} />
                                        <DetailItem label="Mother's Phone" value={isEditing.family ? editData.Mother_Mobile : profile?.Mother_Mobile} icon={Phone} isEditing={isEditing.family} name="Mother_Mobile" onChange={handleChange} />
                                        <DetailItem label="Guardian Name" value={isEditing.family ? editData.Guardian_Name : profile?.Guardian_Name} icon={UserCheck} isEditing={isEditing.family} name="Guardian_Name" onChange={handleChange} />
                                        <DetailItem label="Guardian Relation" value={isEditing.family ? editData.Guardian_Relation : profile?.Guardian_Relation} icon={Info} isEditing={isEditing.family} name="Guardian_Relation" onChange={handleChange} />
                                    </ProfileSection>
                                </div>
                            </div>

                            <div className="col-12 col-xl-4">
                                <div className="d-flex flex-column gap-4 sticky-top-custom">
                                    {/* Academic Context */}
                                    <ProfileSection title="Academic Standing" icon={GraduationCap}>
                                        <div className="row g-3">
                                            <DetailItem label="Dept Code" value={profile?.Dept_Code} icon={Hash} className="col-12" />
                                            <DetailItem label="Course" value={profile?.Course_Name} icon={BookOpen} className="col-12" />
                                            <DetailItem label="Admission Date" value={profile?.Admission_Date ? new Date(profile.Admission_Date).toLocaleDateString() : '---'} icon={Calendar} className="col-12" />
                                            <DetailItem label="Regulation" value={profile?.Regulation} icon={FileText} className="col-12" />
                                        </div>
                                    </ProfileSection>

                                    {/* Financial Summary - Professional Card */}
                                    <ProfileSection title="Fee Details" icon={Landmark}>
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between mb-3 align-items-end">
                                                <div>
                                                    <p className="text-[11px] text-muted fw-bold mb-1">Payment Progress</p>
                                                    <h6 className={`mb-0 fw-black ${profile?.Balance_Fees <= 0 ? 'text-success' : 'text-primary'}`}>
                                                        {profile?.Balance_Fees <= 0 ? (
                                                            <span className="d-flex text-xs align-items-center gap-1"><Award size={16} /> Fully Settled</span>
                                                        ) : 'Partial Settlement'}
                                                    </h6>
                                                </div>
                                                <span className="fs-5 fw-black text-dark">
                                                    {profile?.Total_Fees > 0 ? Math.round((profile?.Paid_Fees / profile?.Total_Fees) * 100) : 0}%
                                                </span>
                                            </div>

                                            <div className="progress rounded-pill mb-4" style={{ height: '12px', background: '#f1f5f9' }}>
                                                <div
                                                    className="progress-bar bg-primary shadow-sm progress-bar-striped progress-bar-animated"
                                                    role="progressbar"
                                                    style={{ width: `${profile?.Total_Fees > 0 ? (profile?.Paid_Fees / profile?.Total_Fees) * 100 : 0}%` }}
                                                ></div>
                                            </div>

                                            <div className="row g-3">
                                                <div className="col-6">
                                                    <div className="p-3 bg-light rounded-4 border-dashed border-2 text-center">
                                                        <p className="text-[9px] text-muted mb-1 fw-bold">Total Fees</p>
                                                        <h6 className="mb-0 fw-black text-dark">₹{profile?.Total_Fees?.toLocaleString()}</h6>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 bg-light rounded-4 border-dashed border-2 text-center">
                                                        <p className="text-[9px] text-muted mb-1 fw-bold">Balance</p>
                                                        <h6 className="mb-0 fw-black text-danger">₹{profile?.Balance_Fees?.toLocaleString()}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ProfileSection>

                                    {/* Miscellaneous */}
                                    <ProfileSection title="Other Information" icon={Info}>
                                        <div className="row g-3">
                                            <DetailItem label="Hostel" value={profile?.Hostel_Required} icon={Home} className="col-12" />
                                            <DetailItem label="Transport" value={profile?.Transport_Required} icon={Bus} className="col-12" />
                                            <DetailItem label="Scholarship" value={profile?.Scholarship} icon={Gift} className="col-12" />
                                        </div>
                                    </ProfileSection>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>

                {/* Action Buttons Overlay */}
                {isAnyEditing && (
                    <div className="action-buttons-overlay">
                        <div className="container-fluid">
                            <div className="d-flex justify-content-end gap-3 p-4">
                                <button
                                    className="btn-modern-secondary d-flex align-items-center gap-2"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    <X size={18} /> Cancel
                                </button>
                                <button
                                    className="btn-modern-primary d-flex align-items-center gap-2"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 size={18} className="spin-animation" /> : <Save size={18} />}
                                    {saving ? 'Saving...' : 'Save All Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications */}
                {successMessage && (
                    <div className="toast-notification success shadow-lg">
                        <CheckCircle size={20} />
                        <span>{successMessage}</span>
                    </div>
                )}
                {error && (
                    <div className="toast-notification error shadow-lg">
                        <Activity size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <style dangerouslySetInnerHTML={{
                    __html: `
                .profile-section-card {
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    border: 1.5px solid transparent !important;
                }
                .profile-section-card:hover {
                    border-color: rgba(59, 130, 246, 0.2) !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05) !important;
                }
                .fs-7 { font-size: 0.95rem; }
                .fw-black { font-weight: 900 !important; }
                .letter-spacing-tight { letter-spacing: -1px; }
                .glass-badge {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    font-size: 0.75rem;
                }
                .hover-bg-light:hover {
                    background: #f8fafc;
                    transform: translateX(5px);
                }
                .sticky-top-custom {
                    position: sticky;
                    top: 90px;
                    z-index: 1;
                }
                .section-header-modern {
                    position: relative;
                    display: flex;
                    font-size: 1rem;
                    align-items: center;
                    gap: 1.25rem;
                }
                .icon-container-modern {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
                    color: #487fff;
                    border-radius: 14px;
                    box-shadow: 0 4px 12px rgba(72, 127, 255, 0.1);
                    border: 1px solid rgba(72, 127, 255, 0.1);
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .title-container-modern {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    min-width: 0;
                }
                .section-title-modern {
                    font-size: 0.7rem;
                    font-weight: 850;
                    color: #1e3a8a;
                    margin: 0;
                }
                .accent-line-modern {
                    width: 45px;
                    height: 3px;
                    background: #487fff;
                    border-radius: 10px;
                    margin-top: 6px;
                }
                .detail-item-modern {
                    background: #fcfdfe;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .detail-item-modern:hover {
                    background: #ffffff;
                    border-color: #e2e8f0;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                }
                .detail-icon-box {
                    width: 40px;
                    height: 40px;
                    background: #f1f5f9;
                    color: #64748b;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }
                .detail-item-modern:hover .detail-icon-box {
                    background: #e0efff;
                    color: #487fff;
                    transform: scale(1.05);
                }
                .detail-label {
                    font-size: 10px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    margin-bottom: 2px;
                }
                .detail-value {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #1a202c;
                    word-break: break-word;
                    line-height: 1.4;
                }
                .form-control-modern {
                    width: 100%;
                    padding: 8px 12px;
                    border-radius: 10px;
                    border: 2px solid #e2e8f0;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    background: #fff;
                }
                .form-control-modern:focus {
                    outline: none;
                    border-color: #487fff;
                    box-shadow: 0 0 0 4px rgba(72, 127, 255, 0.1);
                }
                .edit-toggle-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: #f1f5f9;
                    color: #64748b;
                    border: none;
                }
                .edit-toggle-btn:hover {
                    background: #e2e8f0;
                    color: #1e3a8a;
                }
                .edit-toggle-btn.active {
                    background: #fee2e2;
                    color: #dc2626;
                }
                .action-buttons-overlay {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(15px);
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    z-index: 1000;
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .btn-modern-primary {
                    background: linear-gradient(135deg, #487fff 0%, #3b82f6 100%);
                    color: white;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 14px;
                    font-weight: 700;
                    box-shadow: 0 10px 20px rgba(72, 127, 255, 0.2);
                    transition: all 0.3s ease;
                }
                .btn-modern-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(72, 127, 255, 0.3);
                }
                .btn-modern-secondary {
                    background: #f1f5f9;
                    color: #475569;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 14px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }
                .btn-modern-secondary:hover:not(:disabled) {
                    background: #e2e8f0;
                    color: #1e293b;
                }
                .toast-notification {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    padding: 16px 24px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 2000;
                    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    color: white;
                    font-weight: 600;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .toast-notification.success {
                    background: #10b981;
                }
                .toast-notification.error {
                    background: #ef4444;
                }
                .detail-item-modern.editing {
                    background: #fff;
                    border-color: #cbd5e1;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .placeholder-dot {
                    width: 6px;
                    height: 6px;
                    background: #cbd5e1;
                    border-radius: 50%;
                }
                .border-dashed { border-style: dashed !important; }
                .spin-animation { animation: spin 2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}} />
            </section>
        </>
    );
};

export default StudentProfiles;
