import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { TrendingUp } from 'react-feather';
import { Icon } from '@iconify/react';
import { useFormValidation } from '../../../../../hooks/useFormValidation';
import {
  addStudentEnquiry,
  updateStudentEnquiry
} from '../../../../../utils/studentEnquiryApi';
import axios from 'axios';

/* -----------------------------------------------------
      REQUIRED FIELDS / CONSTANTS
----------------------------------------------------- */
const REQUIRED_FIELDS = {
  studentName: 'Student Name',
  mobileNo: 'Mobile No',
  parentName: 'Parent Name',
  community: 'Community',
  standard: 'Standard',
  district: 'District'
};

const STANDARDS = ['Diploma', '12', '10', '8'];
const SCHOOL_TYPES = ['Government', 'Private'];

/* -----------------------------------------------------
      INJECT STYLES FOR TOAST ANIMATION & FORM VALIDATION
----------------------------------------------------- */
const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("student-enquiry-styles")) return;

  const styleSheet = document.createElement("style");
  styleSheet.id = "student-enquiry-styles";
  styleSheet.textContent = `
    /* Required field styling - green when filled */
    .form-control.is-valid,
    .form-select.is-valid {
      border-width: 2px !important;
      border-color: #22c55e !important;
      background-color: #ffffff !important;
    }

    .form-control.is-valid:focus,
    .form-select.is-valid:focus {
      border-color: #22c55e !important;
      box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.25) !important;
    }

    /* Required field styling - red when empty */
    .form-control.is-invalid,
    .form-select.is-invalid {
      border-width: 2px !important;
      border-color: #dc2626 !important;
      background-color: #fef2f2 !important;
    }

    .form-control.is-invalid:focus,
    .form-select.is-invalid:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
    }

    /* Error message styling */
    .form-control.is-invalid ~ small,
    .form-select.is-invalid ~ small {
      color: #dc2626 !important;
      font-weight: 500;
      display: block !important;
      margin-top: 6px;
    }

    /* Success checkmark positioning */
    .form-control.is-valid,
    .form-select.is-valid {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2322c55e' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1em;
      padding-right: 2.5rem;
    }

    /* Required field label indicator */
    .form-label {
      font-weight: 600;
    }

    .text-danger {
      color: #dc2626 !important;
      margin-left: 4px;
    }
  `;
  document.head.appendChild(styleSheet);
};
injectStyles();

/* -----------------------------------------------------
                    COMPONENT
----------------------------------------------------- */
const StudentEnquiry = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    mobileNo: '',
    parentName: '',
    parentMobile: '',
    address: '',
    district: '',
    community: '',
    standard: '',
    department: '',
    schoolType: '',
    studentRegNo: '',
    schoolName: '',
    schoolAddress: '',
    hostel: '',
    transport: '',
    source: '',
    status: ''
  });

  const [communities, setCommunities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sources, setSources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  const { fieldErrors, validateAllFields, getFieldClasses, getSelectClasses, resetValidation, handleFieldChange } =
    useFormValidation(REQUIRED_FIELDS);

  /* -----------------------------------------------------
                      LOAD DATA
  ----------------------------------------------------- */
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load communities from community_master
      const communitiesResponse = await axios.get('/api/masterData/community-master');
      if (communitiesResponse.data.success) {
        setCommunities(communitiesResponse.data.data || []);
      }

      // Load districts from district_master
      const districtsResponse = await axios.get('/api/masterData/district-master');
      if (districtsResponse.data.success) {
        setDistricts(districtsResponse.data.data || []);
      }

      // Load sources from source_master
      const sourcesResponse = await axios.get('/api/masterData/source-master');
      if (sourcesResponse.data.success) {
        setSources(sourcesResponse.data.data || []);
      }

      // Load departments from course_details
      const departmentsResponse = await axios.get('/api/masterData/course-details');
      if (departmentsResponse.data.success) {
        setDepartments(departmentsResponse.data.data || []);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };


  /* -----------------------------------------------------
                    INPUT HANDLING
  ----------------------------------------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    handleFieldChange(name, value);
  };

  /* -----------------------------------------------------
                    VALIDATION
  ----------------------------------------------------- */
  const validateForm = () => {
    const { isValid, missingFields } = validateAllFields(formData);

    if (!isValid) {
      if (missingFields.length > 0) {
        toast.error(`${missingFields[0]} is required`);
      }
      return false;
    }

    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      toast.error('Mobile No must be 10 digits');
      return false;
    }

    return true;
  };

  /* -----------------------------------------------------
                    SUBMIT FORM
  ----------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (editingStudent) {
        await updateStudentEnquiry(editingStudent.id, formData);
        toast.success('Student updated successfully!', { autoClose: 2000 });
        setEditingStudent(null);
      } else {
        await addStudentEnquiry(formData);
        toast.success('Student added successfully!', { autoClose: 2000 });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error?.response?.data?.error || 'Failed to save student data');
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
                      RESET FORM
  ----------------------------------------------------- */
  const resetForm = () => {
    setFormData({
      studentName: '',
      mobileNo: '',
      parentName: '',
      parentMobile: '',
      address: '',
      district: '',
      community: '',
      standard: '',
      department: '',
      schoolType: '',
      studentRegNo: '',
      schoolName: '',
      schoolAddress: '',
      hostel: '',
      transport: '',
      source: '',
      status: ''
    });
    setEditingStudent(null);
    resetValidation();
  };

  const handleCancel = () => {
    resetForm();
    toast.info('Form reset', { autoClose: 2000 });
  };


  /* -----------------------------------------------------
                        RENDER
  ----------------------------------------------------- */
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
            {/* Header */}
            <div className="dashboard-header mb-6">
              <h6 className="fw-semibold mb-1">Student Enquiry</h6>
              <p className="text-secondary flex items-center gap-2">
                <TrendingUp size={16} />
                Comprehensive insights into your admission funnel and team performance.
              </p>
            </div>

            {/* Form Card */}
            <div className="card h-100 p-0 radius-12">
              {/* Tab Navigation */}
              <div className="card-header border-bottom-0 p-24 pb-0">
                <div className="mb-24">
                  <h6 className="text-lg fw-semibold mb-2">
                    {editingStudent ? 'Edit Student Details' : 'Add New Student'}
                  </h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to add student information
                  </span>
                </div>
                <div className="nav-tabs-wrapper">
                  <nav className="nav nav-tabs flex-nowrap gap-3" role="tablist">
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:account-outline" className="me-2"></iconify-icon>
                      Personal Details
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'other' ? 'active' : ''}`}
                      onClick={() => setActiveTab('other')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:book-outline" className="me-2"></iconify-icon>
                      Educational Details
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'additional' ? 'active' : ''}`}
                      onClick={() => setActiveTab('additional')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:information-outline" className="me-2"></iconify-icon>
                      Other Details
                    </button>
                  </nav>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                <form onSubmit={handleSubmit}>
                  {/* TAB 1: Personal Details */}
                  {activeTab === 'personal' && (
                    <div className="tab-content-section">
                      <div className="row g-3">
                        {/* Student Name */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Student Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={getFieldClasses('studentName')}
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleInputChange}
                          />
                          {fieldErrors.studentName && <small className="text-danger">⚠️ {fieldErrors.studentName}</small>}
                        </div>

                        {/* Mobile */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Mobile No <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            className={getFieldClasses('mobileNo')}
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleInputChange}
                            maxLength="10"
                          />
                          {fieldErrors.mobileNo && <small className="text-danger">⚠️ {fieldErrors.mobileNo}</small>}
                        </div>

                        {/* Parent Name */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Parent Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={getFieldClasses('parentName')}
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                          />
                          {fieldErrors.parentName && <small className="text-danger">⚠️ {fieldErrors.parentName}</small>}
                        </div>

                        {/* Parent Mobile */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Parent Mobile</label>
                          <input
                            type="tel"
                            className={getFieldClasses('parentMobile')}
                            name="parentMobile"
                            value={formData.parentMobile}
                            onChange={handleInputChange}
                            maxLength="10"
                          />
                        </div>
                        {/* District */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            District <span className="text-danger">*</span>
                          </label>
                          <select
                            className={getSelectClasses('district')}
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                          >
                            <option value="">Select District</option>
                            {districts.map(d => (
                              <option key={d.id || d.Id} value={d.District}>
                                {d.District}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.district && <small className="text-danger">⚠️ {fieldErrors.district}</small>}
                        </div>

                        {/* Community */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Community <span className="text-danger">*</span>
                          </label>
                          <select
                            className={getSelectClasses('community')}
                            name="community"
                            value={formData.community}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Community</option>
                            {communities.map(c => (
                              <option key={c.id || c.Id} value={c.Community}>
                                {c.Community}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.community && <small className="text-danger">⚠️ {fieldErrors.community}</small>}
                        </div>
                      </div>

                      <div className="row g-3">
                        {/* Address */}
                        <div className="col-12">
                          <label className="form-label fw-semibold">Address</label>
                          <textarea
                            className={getFieldClasses('address')}
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Enter complete address"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Educational Details */}
                  {activeTab === 'other' && (
                    <div className="tab-content-section">
                      <div className="row g-3">
                        {/* Standard */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Standard <span className="text-danger">*</span>
                          </label>
                          <select
                            className={getSelectClasses('standard')}
                            name="standard"
                            value={formData.standard}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Standard</option>
                            {STANDARDS.map(std => (
                              <option key={std} value={std}>{std}</option>
                            ))}
                          </select>
                          {fieldErrors.standard && <small className="text-danger">⚠️ {fieldErrors.standard}</small>}
                        </div>

                        {/* School Type */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">School Type</label>
                          <select
                            className={getSelectClasses('schoolType')}
                            name="schoolType"
                            value={formData.schoolType}
                            onChange={handleInputChange}
                          >
                            <option value="">Select School Type</option>
                            {SCHOOL_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        {/* Student Reg No */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Student Reg. No</label>
                          <input
                            type="text"
                            className={getFieldClasses('studentRegNo')}
                            name="studentRegNo"
                            value={formData.studentRegNo}
                            onChange={handleInputChange}
                          />
                        </div>

                        {/* School Name */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">School Name</label>
                          <input
                            type="text"
                            className={getFieldClasses('schoolName')}
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleInputChange}
                          />
                        </div>

                        {/* School Address */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">School Address</label>
                          <input
                            type="text"
                            className={getFieldClasses('schoolAddress')}
                            name="schoolAddress"
                            value={formData.schoolAddress}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Other Details */}
                  {activeTab === 'additional' && (
                    <div className="tab-content-section">
                      <div className="row g-3">
                        {/* Department */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Department</label>
                          <select
                            className={getSelectClasses('department')}
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                              <option key={d.id || d.Dept_Code} value={d.Dept_Name}>
                                {d.Dept_Name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Hostel */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Hostel</label>
                          <select
                            className={getSelectClasses('hostel')}
                            name="hostel"
                            value={formData.hostel}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Hostel Status</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Transport */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Transport</label>
                          <select
                            className={getSelectClasses('transport')}
                            name="transport"
                            value={formData.transport}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Transport Status</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        {/* Source */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Source</label>
                          <select
                            className={getSelectClasses('source')}
                            name="source"
                            value={formData.source}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Source</option>
                            {sources.map(s => (
                              <option key={s.id || s.Id} value={s.source}>
                                {s.source}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Status</label>
                          <select
                            className={getSelectClasses('status')}
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Status</option>
                            <option value="New">New</option>
                            <option value="Interested">Interested</option>
                            <option value="Confirm">Confirm</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Close">Close</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="button"
                      className="btn btn-outline-danger-600 radius-8 px-20 py-11"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-outline-success-600 radius-8 px-20 py-11"
                    >
                      {editingStudent ? 'Update' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default StudentEnquiry;
