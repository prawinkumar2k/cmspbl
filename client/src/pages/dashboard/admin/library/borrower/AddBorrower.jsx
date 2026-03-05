
import Select from 'react-select';
import DataTable from '../../../../../components/DataTable/DataTable';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../../../../components/Navbar';
import Sidebar from '../../../../../components/Sidebar';
import Footer from '../../../../../components/footer';



// Initial state constants for Borrower
const INITIAL_FORM_STATE = {
  id: null, // Database ID for updates
  borrowerId: 'BORROWER-001',
  name: '',
  type: '', // No default, must select
  department: '',
  rollOrEmpId: '',
  yearOrSection: '',
  contact: '',
  email: '',
  registrationDate: '',
  activeStatus: 'Active',
  maxBooksAllowed: 3,
  fineDue: 0,
  remarks: '',
};

// Photo Cell Component
const PhotoCell = ({ row }) => {
  const src = row.original.PhotoPath;
  const [imgError, setImgError] = React.useState(false);

  return (
    src && !imgError ? (
      <img
        src={src}
        alt="Photo"
        style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
        onError={() => setImgError(true)}
      />
    ) : (
      <span className="fa fa-user text-secondary" style={{ fontSize: 32 }}></span>
    )
  );
};

const AddBorrower = () => {
  // ... existing code ...

  // For scrolling form into view
  const formRef = useRef(null);
  // Borrower table state
  const [showTable, setShowTable] = useState(false);
  const [borrowers, setBorrowers] = useState([]);
  const [loadingBorrowers, setLoadingBorrowers] = useState(false);
  const [borrowerTableError, setBorrowerTableError] = useState(null);
  // Fetch all borrowers from backend
  const fetchBorrowers = useCallback(async () => {
    setLoadingBorrowers(true);
    setBorrowerTableError(null);
    try {
      const res = await fetch('/api/library/borrowers/all');
      if (!res.ok) throw new Error('Failed to fetch borrowers');
      const data = await res.json();
      setBorrowers(Array.isArray(data) ? data : []);
    } catch (err) {
      setBorrowerTableError(err.message || 'Error fetching borrowers');
      setBorrowers([]);
    } finally {
      setLoadingBorrowers(false);
    }
  }, []);

  // Fetch borrowers when table is shown
  useEffect(() => {
    if (showTable) fetchBorrowers();
  }, [showTable, fetchBorrowers]);
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    fetch('/api/library/borrowers/departments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => setDepartments([]));
  }, []);
  // Student roll numbers for dropdown
  const [studentRolls, setStudentRolls] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]); // For staff

  useEffect(() => {
    fetch('/api/library/borrowers/student-rolls')
      .then(res => res.json())
      .then(data => setStudentRolls(data))
      .catch(() => setStudentRolls([]));
    // Placeholder: fetch employee IDs for staff
    fetch('/api/library/borrowers/employee-ids')
      .then(res => res.json())
      .then(data => setEmployeeIds(data))
      .catch(() => setEmployeeIds([]));
  }, []);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [isEditMode, setIsEditMode] = useState(false);
  // No need to fetch next BorrowerID, will use Register Number or Employee ID
  const [photoLabel, setPhotoLabel] = useState('Image Not Available');
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);
  // Tab state for UI parity with StaffDetails
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = useCallback(async (e) => {
    const { name, value } = e.target;
    // If rollOrEmpId is changed, set borrowerId to the register/employee number
    if (name === 'rollOrEmpId') {
      let newBorrowerId = '';
      if (form.type === 'Student' && value) {
        // Extract roll number (in case value is '20235262 - NAME')
        newBorrowerId = value.split(' - ')[0];
      } else if (form.type === 'Staff' && value) {
        // Extract employee id (in case value is 'EMP001 - NAME')
        newBorrowerId = value.split(' - ')[0];
      }
      setForm(prev => ({ ...prev, [name]: value, borrowerId: newBorrowerId }));

      // Auto-fill student details when rollOrEmpId is selected and type is Student
      if (form.type === 'Student' && value) {
        const roll = value.split(' - ')[0];
        try {
          const res = await fetch(`/api/library/borrowers/student-details/${roll}`);
          if (res.ok) {
            const data = await res.json();
            setForm(prev => ({
              ...prev,
              name: data.Student_Name || data.name || '',
              department: data.Department || data.department || '',
              contact: data.contact || '',
              yearOrSection: data.yearOrSection || '',
              email: data.email || '',
              borrowerId: roll // Ensure borrowerId is set
            }));
          }
        } catch {
          // intentionally ignored
        }
      }
      // Auto-fill staff details when rollOrEmpId is selected and type is Staff
      if (form.type === 'Staff' && value) {
        const staffId = value.split(' - ')[0];
        try {
          const res = await fetch(`/api/library/borrowers/employee-details/${staffId}`);
          if (res.ok) {
            const data = await res.json();
            setForm(prev => ({
              ...prev,
              name: data.Staff_Name || data.name || '',
              department: data.Department || data.department || '',
              contact: data.contact || '',
              yearOrSection: data.yearOrSection || '',
              email: data.email || '',
              borrowerId: staffId // Ensure borrowerId is set
            }));
          }
        } catch {
          // intentionally ignored
        }
      }
      return;
    }
    // If type is changed, clear borrowerId and rollOrEmpId
    if (name === 'type') {
      setForm(prev => ({ ...prev, [name]: value, borrowerId: '', rollOrEmpId: '' }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  }, [form.type]);

  // Helper for single tab validation
  const validateTab = useCallback((tab = activeTab) => {
    const fieldMapping = {
      basic: {
        type: 'Borrower Type',
        rollOrEmpId: 'Roll Number / Employee ID',
        name: 'Name',
        department: 'Department'
      },
      contact: {
        registrationDate: 'Date of Registration'
      }
    };

    const tabFields = fieldMapping[tab];
    if (!tabFields) return true;

    for (const [key, label] of Object.entries(tabFields)) {
      if (!form[key]) {
        toast.error(`Please fill the required field: ${label.toLowerCase()}`);
        return false;
      }
    }
    return true;
  }, [form, activeTab]);

  // Switch tabs with validation
  const handleTabSwitch = useCallback((newTab) => {
    // Determine which tabs to validate based on current and target
    if (activeTab === 'basic' && (newTab === 'contact' || newTab === 'other')) {
      if (!validateTab('basic')) return;
    }
    if (activeTab === 'contact' && newTab === 'other') {
      if (!validateTab('contact')) return;
    }

    setActiveTab(newTab);
  }, [activeTab, validateTab]);

  const handlePhotoBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setPhotoLabel(file.name);
      const reader = new FileReader();
      reader.onload = ev => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
      toast.success('Photo uploaded successfully!');
    }
  }, []);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setIsEditMode(false);
    setPhotoLabel('Image Not Available');
    setPhotoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Form reset successfully!');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate across all tabs
    if (!validateTab('basic')) {
      setActiveTab('basic');
      return;
    }
    if (!validateTab('contact')) {
      setActiveTab('contact');
      return;
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (form.contact && !/^\d{10}$/.test(form.contact.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit contact number');
      return;
    }
    // Prepare FormData for backend
    const fd = new FormData();
    // Map frontend fields to backend field names
    fd.append('BorrowerID', form.borrowerId);
    fd.append('Name', form.name);
    fd.append('BorrowerType', form.type);
    fd.append('Department', form.department);
    fd.append('RollOrEmpID', form.rollOrEmpId);
    fd.append('YearOrSection', form.yearOrSection);
    fd.append('ContactNumber', form.contact);
    fd.append('EmailAddress', form.email);
    fd.append('DateOfRegistration', form.registrationDate);
    fd.append('ActiveStatus', form.activeStatus);
    fd.append('MaxBooksAllowed', form.maxBooksAllowed);
    fd.append('FineDue', form.fineDue);
    fd.append('Remarks', form.remarks);
    // Add photo file if selected
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      fd.append('photo', fileInputRef.current.files[0]);
    }
    toast.loading(isEditMode ? 'Updating borrower details...' : 'Saving borrower details...');
    try {
      const url = isEditMode
        ? `/api/library/borrowers/${form.id}`
        : '/api/library/borrowers';

      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        body: fd
      });
      toast.dismiss();
      if (!res.ok) {
        let errorMsg = isEditMode ? 'Failed to update borrower' : 'Failed to save borrower';
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch { /* ignore JSON parse error */ }
        toast.error(errorMsg);
        return;
      }
      toast.success(isEditMode ? 'Borrower details updated successfully!' : 'Borrower details saved successfully!');

      // Redundant calls to current-borrowers and current-borrower-report removed as they are handled by the backend controller.

      setForm(INITIAL_FORM_STATE);
      setIsEditMode(false);
      setPhotoLabel('Image Not Available');
      setPhotoPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      // Refresh table if visible
      if (showTable) fetchBorrowers();
    } catch (err) {
      toast.dismiss();
      toast.error('Error: ' + err.message);
    }
  }, [form, isEditMode]);

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
            {/* View/Hide Borrowers Button */}

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Borrower Details</h6>
            </div>
            <div ref={formRef} className="card h-100 p-0 radius-12">
              {/* Tab Navigation for Borrower Details */}
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">

                <div>
                  <h6 className="text-lg fw-semibold mb-2">{isEditMode ? 'Edit Borrower Details' : 'Add Borrower Details'}</h6>
                </div>
                <div className="d-flex justify-content-end mb-3">
                  <button
                    type="button"
                    className={`btn btn-sm d-flex align-items-center ${showTable ? 'btn-outline-info' : 'btn-outline-info'}`}
                    style={{ minWidth: 120, fontWeight: 600, gap: 6 }}
                    onClick={() => setShowTable((prev) => !prev)}
                    title={showTable ? 'Hide Borrowers Table' : 'Show Borrowers Table'}
                  >
                    <span className={`me-1 fa ${showTable ? 'fa-eye-slash' : 'fa-eye'}`}></span>
                    {showTable ? 'Hide Table' : 'View Borrowers'}
                  </button>
                </div>
              </div>
              <div className="card-header border-bottom-0 p-24 pb-0 d-flex align-items-center justify-content-between gap-3" style={{ flexWrap: 'nowrap' }}>
                <div className="nav-tabs-wrapper" style={{ flex: 1, minWidth: 0 }}>
                  <nav className="nav nav-tabs flex-nowrap gap-3" role="tablist">
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'basic' ? 'active' : ''}`}
                      onClick={() => handleTabSwitch('basic')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:file-document-outline" className="me-2"></iconify-icon>
                      Basic Details
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'contact' ? 'active' : ''}`}
                      onClick={() => handleTabSwitch('contact')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:account-outline" className="me-2"></iconify-icon>
                      Contact Details
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'other' ? 'active' : ''}`}
                      onClick={() => handleTabSwitch('other')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:briefcase-outline" className="me-2"></iconify-icon>
                      Other Details
                    </button>
                  </nav>
                </div>
              </div>
              <div className="card-body p-24 pt-20">
                <form onSubmit={handleSubmit}>
                  {/* TAB 1: Basic Details */}
                  {activeTab === 'basic' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Borrower Type <span className="text-danger">*</span>
                          </label>
                          <select name="type" value={form.type} onChange={handleChange} className="form-select radius-8">
                            <option value="" disabled hidden>Select Borrower Type</option>
                            <option value="Student">Student</option>
                            <option value="Staff">Staff</option>
                          </select>
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Roll Number / Employee ID
                          </label>
                          <Select
                            name="rollOrEmpId"
                            classNamePrefix="react-select"
                            options={
                              form.type === 'Student'
                                ? studentRolls.map(s => ({
                                  value: `${s.Register_Number} - ${s.Student_Name}`,
                                  label: `${s.Register_Number} — ${s.Student_Name} (${s.Department || ''})`,
                                  type: 'Student'
                                }))
                                : form.type === 'Staff'
                                  ? employeeIds.map(e => ({
                                    value: `${e.Staff_ID} - ${e.Staff_Name}`,
                                    label: `${e.Staff_ID} — ${e.Staff_Name} (${e.Department || ''})`,
                                    type: 'Staff'
                                  }))
                                  : []
                            }
                            value={(() => {
                              const opts =
                                form.type === 'Student'
                                  ? studentRolls.map(s => ({
                                    value: `${s.Register_Number} - ${s.Student_Name}`,
                                    label: `${s.Register_Number} — ${s.Student_Name} (${s.Department || ''})`,
                                    type: 'Student'
                                  }))
                                  : form.type === 'Staff'
                                    ? employeeIds.map(e => ({
                                      value: `${e.Staff_ID} - ${e.Staff_Name}`,
                                      label: `${e.Staff_ID} — ${e.Staff_Name} (${e.Department || ''})`,
                                      type: 'Staff'
                                    }))
                                    : [];
                              return form.rollOrEmpId ? opts.find(opt => opt.value === form.rollOrEmpId) || null : null;
                            })()}
                            onChange={option => {
                              handleChange({ target: { name: 'rollOrEmpId', value: option ? option.value : '' } });
                            }}
                            isClearable
                            placeholder={form.type === 'Staff' ? 'Select Employee (ID / Name)' : 'Select Student (ID / Name)'}
                            isDisabled={!form.type}
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Borrower ID <span className="text-danger">*</span>
                          </label>
                          <input type="text" name="borrowerId" value={form.borrowerId} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control radius-8" placeholder="Enter borrower name" />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Department <span className="text-danger">*</span>
                          </label>
                          <select name="department" value={form.department} onChange={handleChange} className="form-select radius-8">
                            <option value="">Select Department</option>
                            {departments.map((dept, idx) => (
                              <option key={idx} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Semester / year
                          </label>
                          <input type="text" name="yearOrSection" value={form.yearOrSection} onChange={handleChange} className="form-control radius-8" placeholder="Enter Year / Section" />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* TAB 2: Contact Details */}
                  {activeTab === 'contact' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Contact Number
                          </label>
                          <input type="tel" name="contact" value={form.contact} onChange={handleChange} className="form-control radius-8" placeholder="Enter contact number" />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Email Address
                          </label>
                          <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control radius-8" placeholder="Enter email address" />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Date of Registration
                          </label>
                          <input type="date" name="registrationDate" value={form.registrationDate} onChange={handleChange} className="form-control radius-8" />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Active Status
                          </label>
                          <select name="activeStatus" value={form.activeStatus} onChange={handleChange} className="form-select radius-8">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Max Books Allowed
                          </label>
                          <input type="number" name="maxBooksAllowed" value={form.maxBooksAllowed} onChange={handleChange} className="form-control radius-8" placeholder="Max books allowed" />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Fine Due
                          </label>
                          <input type="number" name="fineDue" value={form.fineDue} onChange={handleChange} className="form-control radius-8" placeholder="Total fine due" />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* TAB 3: Other Details */}
                  {activeTab === 'other' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        <div className="col-12 col-lg-8">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Remarks
                          </label>
                          <textarea name="remarks" value={form.remarks} onChange={handleChange} className="form-control radius-8" rows="2" placeholder="Enter remarks"></textarea>
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Photo Upload
                          </label>
                          <div className="border border-dashed border-neutral-300 rounded-8 p-20">
                            <div className="text-center">
                              {photoPreview ? (
                                <img src={photoPreview} alt="Photo Preview" style={{ maxWidth: 120, maxHeight: 120, marginBottom: 8, borderRadius: 8 }} />
                              ) : (
                                <i className="fa fa-user fa-3x text-neutral-400 mb-8"></i>
                              )}
                              <p className="text-sm text-neutral-500 mb-8">{photoLabel}</p>
                              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="d-none" />
                              <button type="button" className="btn btn-outline-primary btn-sm" onClick={handlePhotoBrowse}>
                                <i className="fa fa-upload me-1"></i> Browse Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                      {isEditMode ? 'Update Borrower Details' : 'Save Borrower Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Borrowers Table (below form) */}
            {showTable && (
              <div className="mt-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-0">
                    <DataTable
                      data={borrowers}
                      columns={[
                        {
                          header: 'Photo',
                          accessorKey: 'PhotoPath',
                          cell: PhotoCell,
                        },
                        { header: 'ID', accessorKey: 'BorrowerID' },
                        { header: 'Name', accessorKey: 'Name' },
                        { header: 'Type', accessorKey: 'BorrowerType' },
                        { header: 'Department', accessorKey: 'Department' },
                        { header: 'Roll/Emp ID', accessorKey: 'RollOrEmpID' },
                        { header: 'Year/Section', accessorKey: 'YearOrSection' },
                        { header: 'Contact', accessorKey: 'ContactNumber' },
                        { header: 'Email', accessorKey: 'EmailAddress' },
                        { header: 'Date Registered', accessorKey: 'DateOfRegistration' },
                        { header: 'Status', accessorKey: 'ActiveStatus' },
                        { header: 'Max Books', accessorKey: 'MaxBooksAllowed' },
                        { header: 'Fine Due', accessorKey: 'FineDue' },
                        { header: 'Remarks', accessorKey: 'Remarks' },
                        {
                          header: 'Action',
                          accessorKey: 'action',
                          cell: ({ row }) => (
                            <button
                              className="btn btn-sm btn-outline-success"
                              style={{ borderColor: '#28a745', color: '#28a745' }}
                              onClick={() => {
                                setForm({
                                  id: row.original.id,
                                  borrowerId: row.original.BorrowerID || '',
                                  name: row.original.Name || '',
                                  type: row.original.BorrowerType || '',
                                  department: row.original.Department || '',
                                  rollOrEmpId: row.original.RollOrEmpID || '',
                                  yearOrSection: row.original.YearOrSection || '',
                                  contact: row.original.ContactNumber || '',
                                  email: row.original.EmailAddress || '',
                                  registrationDate: row.original.DateOfRegistration || '',
                                  activeStatus: row.original.ActiveStatus || 'Active',
                                  maxBooksAllowed: row.original.MaxBooksAllowed || 3,
                                  fineDue: row.original.FineDue || 0,
                                  remarks: row.original.Remarks || '',
                                });
                                setPhotoLabel(row.original.PhotoPath ? 'Photo Available' : 'Image Not Available');
                                setPhotoPreview('');
                                setIsEditMode(true);
                                setActiveTab('basic');
                                setTimeout(() => {
                                  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                                toast.success('Borrower loaded for modification');
                              }}
                            >
                              Modify
                            </button>
                          ),
                        },
                      ]}
                      loading={loadingBorrowers}
                      error={borrowerTableError}
                      title="All Borrowers"
                      enableExport={true}
                      enableSelection={true}
                      enableActions={false}
                      pageSize={10}
                    />
                  </div>
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

export default AddBorrower;
