import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';


const StudentProfile = () => {
  // Handle close button
  const handleClose = () => {
    setFormData({ department: '', semester: '', regno: '' });
    setRegnoSearchInput('');
    setProfileData(null);
    setShowProfile(false);
    toast.info('Profile closed');
  };

  // Form state
  const [formData, setFormData] = useState({
    department: '',
    semester: '',
    regno: ''
  });

  // Profile data state
  const [profileData, setProfileData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [regnoOptions, setRegnoOptions] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [regnoSearchInput, setRegnoSearchInput] = useState('');
  const [isRegnoDropdownOpen, setIsRegnoDropdownOpen] = useState(false);

  // Fetch registration numbers and metadata on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students for register number list
        const resStudents = await fetch('/api/studentMaster');
        if (!resStudents.ok) throw new Error('Failed to fetch student data');
        const studentsData = await resStudents.json();
        if (Array.isArray(studentsData)) {
          setStudentsData(studentsData);
          const regnoList = [...new Set(studentsData.map(s => String(s.Register_Number).trim()).filter(Boolean))].sort();
          setRegnoOptions(regnoList);
        }

        // Fetch metadata for dropdowns (not needed anymore for select but could be useful for validation, 
        // however the user specifically asked for readonly inputs, so we can skip fetching these for dropdowns)
      } catch (err) {
        toast.error('Failed to load initial data');
        console.error(err);
      }
    };
    fetchData();
  }, []);


  // Handle form input changes
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill department and semester when Regno is selected or typed exactly
    if (name === 'regno' && value) {
      // First try local studentsData
      const localStudent = studentsData.find(s =>
        String(s.Register_Number).trim().toLowerCase() === value.trim().toLowerCase()
      );

      if (localStudent) {
        setFormData(prev => ({
          ...prev,
          department: localStudent.Dept_Name || '',
          semester: localStudent.Semester ? String(localStudent.Semester) : ''
        }));
      } else {
        // Option to fetch from server if not in local list (optional, but good for completeness)
        try {
          const res = await fetch(`/api/studentMaster/register/${value}`);
          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
              setFormData(prev => ({
                ...prev,
                department: result.data.Dept_Name || '',
                semester: result.data.Semester ? String(result.data.Semester) : ''
              }));
            }
          }
        } catch (err) {
          // Ignore error for auto-fill
        }
      }
    }
  };

  // Handle profile button click
  const handleProfile = async () => {
    if (!formData.department || !formData.semester || !formData.regno) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      // Fetch detailed student data directly
      const res = await fetch(`/api/studentMaster/register/${formData.regno}`);
      if (!res.ok) throw new Error('Failed to fetch student data');
      const result = await res.json();

      if (result.success && result.data) {
        const student = result.data;
        // Verify it matches the selected department and semester
        if (
          String(student.Dept_Name).trim().toLowerCase() === formData.department.trim().toLowerCase() &&
          String(student.Semester).trim() === formData.semester.trim()
        ) {
          setProfileData(student);
          setShowProfile(true);
          toast.success('Profile loaded');
        } else {
          toast.error('Student details mismatch with selected filters');
        }
      } else {
        toast.error('Student not found');
      }
    } catch (err) {
      toast.error('Error loading profile');
    }
  };

  // Handle print
  const handlePrint = () => {
    const printArea = document.getElementById('profile-print-area');
    if (!printArea) return;

    const printStyle = document.createElement("style");
    printStyle.id = "print-profile-style";
    printStyle.textContent = `
      @page { size: A4 portrait; margin: 0; }
      @media print {
        body { margin: 0; padding: 0; background: #fff !important; }
        /* Hide UI elements but keep containers that hold the print area */
        .sidebar, .navbar, .footer, .btn, .d-print-none, .Toastify { display: none !important; }
        
        body * { visibility: hidden !important; }
        #profile-print-area, #profile-print-area * { visibility: visible !important; }
        
        #profile-print-area {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 8mm !important;
          box-sizing: border-box !important;
          background: #fff !important;
          border: none !important;
          overflow: hidden !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    window.print();
    setTimeout(() => {
      const el = document.getElementById("print-profile-style");
      if (el) el.remove();
    }, 1000);
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-24">Student Profile</h6>
            </div>

            {/* Search Form Card */}
            <div className="card mb-24">
              <div className="card-body">
                <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">Report Filters</h6>
                <div className="row g-3 align-items-end">
                  {/* Regno as dropdown select */}
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">Register Number</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        name="regno"
                        placeholder="Search Register Number"
                        value={regnoSearchInput}
                        onChange={(e) => {
                          setRegnoSearchInput(e.target.value);
                          handleInputChange(e);
                        }}
                        onFocus={() => setIsRegnoDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsRegnoDropdownOpen(false), 200)}
                      />
                      {formData.regno && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, regno: '' }));
                            setRegnoSearchInput('');
                          }}
                          title="Clear selection"
                        >
                          <i className="fas fa-times text-muted"></i>
                        </button>
                      )}
                      {isRegnoDropdownOpen && studentsData.length > 0 && (
                        <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                          {studentsData
                            .filter(student =>
                              (student.Register_Number && String(student.Register_Number).toLowerCase().includes(regnoSearchInput.toLowerCase())) ||
                              (student.Student_Name && student.Student_Name.toLowerCase().includes(regnoSearchInput.toLowerCase()))
                            )
                            .map((student, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="dropdown-item py-2 border-bottom"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    regno: student.Register_Number,
                                    department: student.Dept_Name || '',
                                    semester: student.Semester ? String(student.Semester) : ''
                                  }));
                                  setRegnoSearchInput(student.Register_Number);
                                  setIsRegnoDropdownOpen(false);
                                }}
                              >
                                <div className="d-flex flex-column">
                                  <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{student.Register_Number}</span>
                                  <span className="small text-muted text-uppercase" style={{ fontSize: '12px' }}>{student.Student_Name}</span>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Department Name */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Department</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="department"
                      value={formData.department}
                      placeholder="Auto-filled"
                      readOnly
                    />
                  </div>
                  {/* Semester */}
                  <div className="col-12 col-md-2">
                    <label className="form-label fw-semibold">Sem</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      name="semester"
                      value={formData.semester}
                      placeholder="Auto-filled"
                      readOnly
                    />
                  </div>
                  {/* Action Buttons */}
                  <div className="col-12 col-md-3">
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                        onClick={handleProfile}
                      >
                        PROFILE
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger-600 radius-8 px-20 py-11"
                        onClick={handleClose}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Profile Display */}
            {showProfile && profileData && (
              <>
                {/* Print Button */}
                <div className="d-flex justify-content-end mb-3 d-print-none">
                  <button
                    type="button"
                    className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                    onClick={handlePrint}
                  >
                    <Icon icon="solar:printer-outline" className="text-lg me-2" />
                    Print Profile
                  </button>
                </div>
                {/* Unified Report Print Area */}
                <div
                  id="profile-print-area"
                  className="mx-auto"
                  style={{
                    width: '210mm',
                    height: '297mm',
                    padding: '8mm',
                    boxSizing: 'border-box',
                    background: '#fff',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  <div style={{
                    border: '2px solid #222',
                    padding: '5mm',
                    height: '100%',
                    position: 'relative',
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Header - Standardized institutional format */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 15 }}>
                      <div style={{ width: 80, minWidth: 80, textAlign: "center" }}>
                        <img
                          src="/assets/images/GRT.png"
                          alt="logo"
                          style={{ width: 75, height: 75, objectFit: "contain" }}
                        />
                      </div>
                      <div style={{ flex: 1, textAlign: "center", padding: '0 10px' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.5, color: "#222", textTransform: 'uppercase', lineHeight: 1.2 }}>
                          GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#222", marginTop: 4 }}>
                          GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#222", marginTop: 2 }}>
                          Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                        </div>
                      </div>
                      <div style={{ width: 80, minWidth: 80 }}></div>
                    </div>

                    <div style={{ borderBottom: '1px solid #222', marginBottom: 15 }}></div>

                    {/* Title */}
                    <div style={{ textAlign: 'center', marginBottom: 15 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, textDecoration: 'underline', textTransform: 'uppercase' }}>
                        Student Profile Report
                      </div>
                    </div>

                    {/* Student Details Section */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                      <div style={{ flex: 2 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <tbody>
                            <tr>
                              <td style={{ width: '130px', padding: '6px 0', fontWeight: 'bold' }}>Admn. No.</td>
                              <td style={{ width: '10px', padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888' }}>{profileData.Admission_No}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Reg. No.</td>
                              <td style={{ padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888', fontWeight: 'bold' }}>{profileData.Register_Number}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Name</td>
                              <td style={{ padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888', fontWeight: 'bold', textTransform: 'uppercase' }}>{profileData.Student_Name}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Department</td>
                              <td style={{ padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888' }}>{profileData.Dept_Name}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Academic Year</td>
                              <td style={{ padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888' }}>{profileData.Academic_Year}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Date of Birth</td>
                              <td style={{ padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888' }}>{profileData.Dob?.split('T')[0]}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Religion / Comm.</td>
                              <td style={{ padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888' }}>{profileData.Religion} / {profileData.Community}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>Father's Name</td>
                              <td style={{ padding: '6px 0' }}>:</td>
                              <td style={{ padding: '6px 0', borderBottom: '1px dotted #888' }}>{profileData.Father_Name}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Fee Details Box - Right Side */}
                      <div style={{ flex: 1 }}>
                        <div style={{ border: '2px solid #222', padding: '12px', background: '#f9f9f9' }}>
                          <h6 style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', fontSize: '14px', marginBottom: 12 }}>FEES DETAILS</h6>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: '6px 0' }}>Semester</td>
                                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold' }}>{profileData.Semester}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '6px 0' }}>Course Fees</td>
                                <td style={{ padding: '6px 0', textAlign: 'right' }}>₹{(Number(profileData.Course_Fees) || 0).toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '6px 0' }}>Paid Fees</td>
                                <td style={{ padding: '6px 0', textAlign: 'right', color: 'green', fontWeight: 'bold' }}>₹{(Number(profileData.Paid_Fees) || 0).toLocaleString()}</td>
                              </tr>
                              <tr style={{ borderTop: '1px solid #222' }}>
                                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Balance</td>
                                <td style={{ padding: '8px 0', textAlign: 'right', color: 'red', fontWeight: 'bold' }}>₹{(Number(profileData.Balance_Fees) || 0).toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Address & Contact Section */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 'bold', borderBottom: '1px solid #222', paddingBottom: '3px', marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase' }}>
                        Address & Contact Details
                      </div>

                      <div style={{ display: 'flex', gap: 20, marginBottom: 15 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '2px' }}>CURRENT ADDRESS:</div>
                          <div style={{ fontSize: '12px', lineHeight: '1.3' }}>
                            {profileData.Current_Address || profileData.Address1}<br />
                            {profileData.Current_State} - {profileData.Current_Pincode}
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '2px' }}>PERMANENT ADDRESS:</div>
                          <div style={{ fontSize: '12px', lineHeight: '1.3' }}>
                            {profileData.Permanent_Address || profileData.Address3}<br />
                            {profileData.Permanent_State || profileData.Current_District}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #eee', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', gap: 30 }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginRight: '5px' }}>FATHER MOBILE:</span>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>{profileData.Father_Mobile}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginRight: '5px' }}>MOTHER MOBILE:</span>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>{profileData.Mother_Mobile}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Declaration / Footer Statement */}
                    {/* Signature area */}
                    <div style={{
                      marginTop: 20,
                      textAlign: "right",
                      fontWeight: 800,
                      fontSize: 14,
                      paddingRight: 10
                    }}>
                      <div style={{ marginBottom: 30 }}></div>
                      PRINCIPAL
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Instructions when no profile is loaded */}
            {!showProfile && (
              <div className="card">
                <div className="card-body text-center py-5">
                  <Icon icon="solar:user-circle-outline" className="text-9xl text-muted mb-3" />
                  <h5 className="text-muted">No Student Profile Selected</h5>
                  <p className="text-muted">Please select Department, Semester, and Registration Number, then click "PROFILE" to view student details.</p>
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

export default StudentProfile;
