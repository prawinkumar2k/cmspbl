import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './subject.css';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import StaffTable from './StaffTable';


const INITIAL_FORM_STATE = {
  staffId: 'AUTO-001',
  name: '',
  designation: '',
  qualification: '',
  category: '',
  department: '',
  departmentCode: '',
  courseName: '',
  dob: '',
  gender: '',
  contact: '',
  email: '',
  religion: '',
  community: '',
  caste: '',
  tempAddress: '',
  permAddress: '',
  basicPay: '',
  pf: '',
  joiningDate: '',
  relivingDate: '',
  accountNumber: '',
  bankName: '',
  panNo: '',
  adharNo: '',
  others: ''
};

const StaffDetails = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [photoLabel, setPhotoLabel] = useState('Image Not Available');
  const [showTable, setShowTable] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const [activeTab, setActiveTab] = useState('basic');
  const fileInputRef = useRef(null);

  // State for dropdowns
  const [designationList, setDesignationList] = useState([]);
  const [religionList, setReligionList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]); // Added departmentList state
  const [filteredDepartmentList, setFilteredDepartmentList] = useState([]); // Filtered departments
  const [courseList, setCourseList] = useState([]); // Added courseList state

  const [photoFile, setPhotoFile] = useState(null);
  const [editId, setEditId] = useState(null); // Track editing staff

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (name === 'contact') {
      // Only allow numbers and max 10 digits
      newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    // Filter departments when course name changes
    if (name === 'courseName') {
      const filtered = departmentList.filter(dept => dept.Course_Name === value);
      setFilteredDepartmentList(filtered);
      setForm(prev => ({
        ...prev,
        courseName: value,
        department: '',
        departmentCode: '',
        staffId: 'AUTO-001'
      }));
      return;
    }
    // Auto-set departmentCode when department changes
    if (name === 'department') {
      const selected = departmentList.find(d => d.Dept_Name === value);
      const deptCode = selected ? selected.Dept_Code : '';
      setForm(prev => ({
        ...prev,
        department: value,
        departmentCode: deptCode,
        staffId: 'AUTO-001' // reset while fetching
      }));
      if (deptCode) {
        fetch(`/api/next_staff_id?deptCode=${deptCode}`)
          .then(res => {
            if (!res.ok) {
              // Log error for debugging
              console.error('Failed to fetch next staff ID:', res.status, res.statusText);
              throw new Error('Failed to fetch');
            }
            return res.json();
          })
          .then(data => {
            setForm(prev => ({
              ...prev,
              staffId: data.staffId || 'AUTO-001'
            }));
          })
          .catch((err) => {
            // Log error for debugging
            console.error('Error fetching next staff ID:', err);
            setForm(prev => ({
              ...prev,
              staffId: 'AUTO-001'
            }));
          });
      }
      return;
    }
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue
    }));
  }, [departmentList, filteredDepartmentList]);

  const handlePhotoBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setPhotoLabel(file.name);
      setPhotoFile(file);
      toast.success('Photo uploaded successfully!');
    }
  }, []);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setPhotoLabel('Image Not Available');
    setPhotoFile(null);
    setEditId(null);
    setActiveTab('basic');
    toast.success('Form reset successfully!');
  }, []);

  // Populate form for editing
  const handleEditStaff = useCallback((staff) => {
    // Filter departments based on course name
    const filtered = departmentList.filter(dept => dept.Course_Name === staff.Course_Name);
    setFilteredDepartmentList(filtered);

    setForm({
      staffId: staff.Staff_ID || '',
      name: staff.Staff_Name || '',
      designation: staff.Designation || '',
      qualification: staff.Qualification || '',
      category: staff.Category || '',
      courseName: staff.Course_Name || '',
      department: staff.Dept_Name || '',
      departmentCode: staff.Dept_Code || '',
      dob: staff.DOB ? staff.DOB.split('T')[0] : '',
      gender: staff.Gender || '',
      contact: staff.Mobile || '',
      email: staff.Email || '',
      religion: staff.Religion || '',
      community: staff.Community || '',
      caste: staff.Caste || '',
      tempAddress: staff.Temporary_Address || '',
      permAddress: staff.Permanent_Address || '',
      basicPay: staff.Basic_Pay || '',
      pf: staff.PF_Number || '',
      joiningDate: staff.Joining_Date ? staff.Joining_Date.split('T')[0] : '',
      relivingDate: staff.Reliving_Date ? staff.Reliving_Date.split('T')[0] : '',
      accountNumber: staff.Account_Number || '',
      bankName: staff.Bank_Name || '',
      panNo: staff.PAN_Number || '',
      adharNo: staff.Aadhar_Number || '',
      others: staff.Others || ''
    });
    setPhotoLabel(staff.Photo ? staff.Photo : 'Image Not Available');
    setPhotoFile(null);
    setEditId(staff.id);
    setShowTable(false);
    setActiveTab('basic');
  }, [departmentList]);

  // Delete staff
  const handleDeleteStaff = useCallback(async (id) => {
    if (!id) {
      toast.error('Invalid staff ID');
      return;
    }
    try {
      const res = await fetch(`/api/staff_master/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete staff');
      toast.success('Staff deleted successfully!');
      setRefreshTable(prev => prev + 1);
      if (editId === id) {
        setEditId(null);
        setForm(INITIAL_FORM_STATE);
      }
    } catch (err) {
      toast.error('Failed to delete staff');
    }
  }, [editId]);

  // Save or update staff
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // 1. Unified Sequential Validation
    const requiredFields = [
      { value: form.name, label: 'Staff Name' },
      { value: form.designation, label: 'Designation' },
      { value: form.qualification, label: 'Qualification' },
      { value: form.category, label: 'Category' },
      { value: form.courseName, label: 'Section' },
      { value: form.department, label: 'Department Name' },
      { value: form.contact, label: 'Contact Number' },
      { value: form.basicPay, label: 'Basic Pay' },
      { value: form.joiningDate, label: 'Joining Date' }
    ];

    const firstMissing = requiredFields.find(f => !f.value || (typeof f.value === 'string' && f.value.trim() === ''));
    if (firstMissing) {
      toast.error(`${firstMissing.label} is required.`);
      return;
    }

    // Validate Staff ID is generated
    if (!form.staffId || form.staffId === 'AUTO-001') {
      toast.error('Staff ID is not generated. Please select department again.');
      return;
    }

    // Email validation
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation
    if (form.contact && !/^\d{10}$/.test(form.contact.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit contact number');
      return;
    }

    const formData = new FormData();
    formData.append('Staff_ID', form.staffId);
    formData.append('Staff_Name', form.name);
    formData.append('Designation', form.designation);
    formData.append('Qualification', form.qualification);
    formData.append('Category', form.category);
    formData.append('Course_Name', form.courseName);
    formData.append('Dept_Name', form.department);
    formData.append('Dept_Code', form.departmentCode);
    formData.append('DOB', form.dob);
    formData.append('Gender', form.gender);
    formData.append('Mobile', form.contact);
    formData.append('Email', form.email);
    formData.append('Religion', form.religion);
    formData.append('Community', form.community);
    formData.append('Caste', form.caste);
    formData.append('Temporary_Address', form.tempAddress);
    formData.append('Permanent_Address', form.permAddress);
    formData.append('Basic_Pay', form.basicPay);
    formData.append('PF_Number', form.pf);
    formData.append('Joining_Date', form.joiningDate);
    formData.append('Reliving_Date', form.relivingDate);
    formData.append('Account_Number', form.accountNumber);
    formData.append('Bank_Name', form.bankName);
    formData.append('PAN_Number', form.panNo);
    formData.append('Aadhar_Number', form.adharNo);
    if (photoFile) {
      formData.append('Photo', photoFile);
    }

    toast.loading(editId ? 'Updating staff details...' : 'Saving staff details...');
    try {
      let res;
      if (editId) {
        res = await fetch(`/api/staff_master/${editId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        res = await fetch('/api/staff_master', {
          method: 'POST',
          body: formData
        });
      }
      toast.dismiss();
      if (res.ok) {
        toast.success(editId ? 'Staff details updated successfully!' : 'Staff details saved successfully!');
        setRefreshTable(prev => prev + 1);
        setShowTable(true);
        setForm(INITIAL_FORM_STATE);
        setPhotoLabel('Image Not Available');
        setPhotoFile(null);
        setEditId(null);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save staff');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to save staff');
    }
  }, [form, photoFile, editId]);


  const handleClose = useCallback(() => {
    toast.success('Closing staff details form');
    setTimeout(() => {
      window.history.back();
    }, 1000);
  }, []);

  // Fetch dropdown data from server
  useEffect(() => {
    // Replace URLs with your actual API endpoints
    fetch('/api/designation_master')
      .then(res => res.json())
      .then(data => setDesignationList(data))
      .catch(() => setDesignationList([]));

    fetch('/api/religion_master')
      .then(res => res.json())
      .then(data => setReligionList(data)) // <-- add semicolon here
      .catch(() => setReligionList([]));

    fetch('/api/community_master')
      .then(res => res.json())
      .then(data => setCommunityList(data))
      .catch(() => setCommunityList([]));

    fetch('/api/department_master') // Fetch department list
      .then(res => res.json())
      .then(data => setDepartmentList(data))
      .catch(() => setDepartmentList([]));

    fetch('/api/branch/course-names') // Fetch course names
      .then(res => res.json())
      .then(data => setCourseList(data))
      .catch(() => setCourseList([]));
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Staff Details</h6>
            </div>

            {/* Form Card */}
            <div className="card h-100 p-0 radius-12">
              {/* Tab Navigation */}
              <div className="card-header border-bottom-0 p-24 pb-0 d-flex align-items-center justify-content-between gap-3" style={{ flexWrap: 'nowrap' }}>
                <div className="nav-tabs-wrapper" style={{ flex: 1, minWidth: 0 }}>
                  <nav className="nav nav-tabs flex-nowrap gap-3" role="tablist">
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'basic' ? 'active' : ''}`}
                      onClick={() => setActiveTab('basic')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:file-document-outline" className="me-2"></iconify-icon>
                      Basic Details
                    </button>
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
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'employment' ? 'active' : ''}`}
                      onClick={() => setActiveTab('employment')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:briefcase-outline" className="me-2"></iconify-icon>
                      Employment Details
                    </button>
                  </nav>
                </div>

                <div className="d-flex align-items-center gap-2 ms-auto">
                  <button
                    type="button"
                    className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                    onClick={() => setShowTable(!showTable)}
                    title={showTable ? 'Hide Staff Table' : 'Show Staff Table'}
                  >
                    <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                    {showTable ? 'Hide Table' : 'View Staff'}
                  </button>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                <form onSubmit={handleSubmit}>
                  {/* TAB 1: Basic Details */}
                  {activeTab === 'basic' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        {/* Row 1: Staff ID, Name, Designation, Qualification */}
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Staff ID <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="staffId"
                            value={form.staffId}
                            readOnly
                            className="form-control radius-8 bg-neutral-50"
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter staff name"
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Designation <span className="text-danger">*</span>
                          </label>
                          <select
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            <option value="">Select Designation</option>
                            {designationList.map(d => (
                              <option key={d.id} value={d.Designation}>{d.Designation}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Qualification <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="qualification"
                            value={form.qualification}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter qualification"
                          />
                        </div>

                        {/* Row 2: Category, Section, Department, Department Code */}
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Category <span className="text-danger">*</span>
                          </label>
                          <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            <option value="">Select Category</option>
                            <option value="Teaching">Teaching</option>
                            <option value="Non-Teaching">Non-Teaching</option>
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Section <span className="text-danger">*</span>
                          </label>
                          <select
                            name="courseName"
                            value={form.courseName}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            <option value="">Select Section</option>
                            {courseList.map((course, idx) => (
                              <option key={idx} value={course}>{course}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Department Name <span className="text-danger">*</span>
                          </label>
                          <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            className="form-select radius-8"
                            disabled={!form.courseName}
                          >
                            <option value="">Select Department</option>
                            {filteredDepartmentList.map((d, idx) => (
                              <option key={idx} value={d.Dept_Name}>{d.Dept_Name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Department Code <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="departmentCode"
                            value={form.departmentCode}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Auto-filled"
                            readOnly
                          />
                        </div>

                        {/* Row 3: Contact, Email, DOB, Gender */}
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Contact Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            name="contact"
                            value={form.contact}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="10-digit number"
                            maxLength={10}
                            pattern="[0-9]{10}"
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter email address"
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            className="form-control radius-8"
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Row 4: Photo Upload */}
                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Photo Upload
                          </label>
                          <div className="border border-dashed border-neutral-300 rounded-8 p-20">
                            <div className="text-center">
                              {photoFile ? (
                                <img
                                  src={URL.createObjectURL(photoFile)}
                                  alt="Preview"
                                  className="mb-8 radius-8"
                                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                              ) : (
                                <img
                                  src={`/api/staff/staff-image/${photoLabel}`}
                                  alt="Staff"
                                  className="mb-8 radius-8"
                                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = '/api/staff/staff-image/staff.png'; }}
                                />
                              )}
                              <p className="text-sm text-neutral-500 mb-8">{photoLabel}</p>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                accept="image/*"
                                className="d-none"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={handlePhotoBrowse}
                              >
                                <i className="fa fa-upload me-1"></i>
                                Browse Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Personal Details */}
                  {activeTab === 'personal' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        {/* Row 1: Religion, Community, Caste */}
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Religion
                          </label>
                          <select
                            name="religion"
                            value={form.religion}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            <option value="">Select Religion</option>
                            {religionList.map(r => (
                              <option key={r.id} value={r.Religion}>{r.Religion}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Community
                          </label>
                          <select
                            name="community"
                            value={form.community}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            <option value="">Select Community</option>
                            {communityList.map(c => (
                              <option key={c.id} value={c.Community}>{c.Community}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Caste
                          </label>
                          <input
                            type="text"
                            name="caste"
                            value={form.caste}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter caste"
                          />
                        </div>

                        {/* Row 2: Aadhar Number, PAN Number */}
                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Aadhar Number
                          </label>
                          <input
                            type="text"
                            name="adharNo"
                            value={form.adharNo}
                            onChange={handleChange}
                            maxLength={12}
                            className="form-control radius-8"
                            placeholder="Enter Aadhar number"
                          />
                        </div>

                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            PAN Number
                          </label>
                          <input
                            type="text"
                            name="panNo"
                            value={form.panNo}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter PAN number"
                          />
                        </div>

                        {/* Row 3: Addresses */}
                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Temporary Address
                          </label>
                          <textarea
                            name="tempAddress"
                            value={form.tempAddress}
                            onChange={handleChange}
                            className="form-control radius-8"
                            rows="4"
                            placeholder="Enter temporary address"
                          ></textarea>
                        </div>

                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Permanent Address
                          </label>
                          <textarea
                            name="permAddress"
                            value={form.permAddress}
                            onChange={handleChange}
                            className="form-control radius-8"
                            rows="4"
                            placeholder="Enter permanent address"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Employment Details */}
                  {activeTab === 'employment' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        {/* Row 1: Employment Information */}
                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Basic Pay <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="basicPay"
                            value={form.basicPay}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter basic pay"
                          />
                        </div>

                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            PF Number
                          </label>
                          <input
                            type="text"
                            name="pf"
                            value={form.pf}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter PF number"
                          />
                        </div>

                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Joining Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            name="joiningDate"
                            value={form.joiningDate}
                            onChange={handleChange}
                            className="form-control radius-8"
                          />
                        </div>

                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Relieving Date
                          </label>
                          <input
                            type="date"
                            name="relivingDate"
                            value={form.relivingDate}
                            onChange={handleChange}
                            className="form-control radius-8"
                          />
                        </div>

                        {/* Row 2: Bank Details */}
                        <div className="col-12">
                          <h6 className="fw-semibold text-lg mb-20 pb-8 border-bottom border-neutral-200">
                            Bank Details
                          </h6>
                        </div>

                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Account Number
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={form.accountNumber}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter account number"
                          />
                        </div>

                        <div className="col-12 col-lg-6">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={form.bankName}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter bank name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit and Reset Buttons */}
                  <div className="d-flex align-items-center justify-content-end gap-3 mt-4">
                    <button
                      type="button"
                      className="btn btn btn-sm btn-outline-danger radius-8"
                      onClick={handleReset}
                    >
                      <i className="fa fa-eraser me-1"></i>
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      className="btn btn btn-sm btn-outline-primary radius-8"
                    >
                      <i className="fa fa-save me-1"></i>
                      {editId ? 'Update Details' : 'Save Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Staff Table - Hidden by default */}
            {showTable && (
              <div className="card mt-4">
                <div className="card-header border-bottom bg-base py-16 px-24">
                  <h6 className="text-lg fw-semibold mb-0">Staff List</h6>
                </div>
                <div className="card-body p-24">
                  <StaffTable
                    refresh={refreshTable}
                    onEdit={handleEditStaff}
                    onDelete={handleDeleteStaff}
                  />
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

export default StaffDetails;
