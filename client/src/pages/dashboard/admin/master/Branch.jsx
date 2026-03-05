import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../components/css/style.css";
import "./branch.css";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";

import BranchTable from "./BranchTable";
const AICTEApprovalOptions = ["Approved", "Pending", "Rejected"];

const initialBranchState = {
  Course_Mode: '',
  Course_Name: '',
  Dept_Code: '',
  Dept_Name: '',
  Year_Of_Course: '',
  Dept_Order: '', // <-- Make sure this matches everywhere
  AICTE_Approval: '', // <-- Change from [0] to ''
  AICTE_Approval_No: '',
  S1: '', S2: '', S3: '', S4: '', S5: '', S6: '', S7: '', S8: '',
  R1: '', R2: '', R3: '', R4: '', R5: '', R6: '', R7: '', R8: '',
  Intake: '',
  AddlSeats: '',
  OC: '',
  BC: '',
  BCO: '',
  BCM: '',
  'MBC_DNC': '',
  SC: '',
  SCA: '',
  ST: '',
  Other: '',
  GoiQuota: '',
  MgtQuota: '',
  Ins_Type: '',
};


const Branch = () => {
  const [branchState, setBranchState] = useState(initialBranchState);
  const [refreshTable, setRefreshTable] = useState(0);
  const [editId, setEditId] = useState(null);
  const [courseCodeExists, setCourseCodeExists] = useState(false);
  const [checkingCourseCode, setCheckingCourseCode] = useState(false);
  const [courseNames, setCourseNames] = useState([]);
  const [institutionTypes, setInstitutionTypes] = useState([]);
  const [courseMode, setCourseMode] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    // Fetch course names from backend
    fetch('/api/branch/course-names')
      .then(res => res.json())
      .then(data => setCourseNames(data))
      .catch(() => setCourseNames([]));

    // Fetch institution types from backend
    fetch('/api/branch/institution-types')
      .then(res => res.json())
      .then(data => setInstitutionTypes(data))
      .catch(() => setInstitutionTypes([]));

    // Fetch course mode from backend
    fetch('/api/branch/course-mode')
      .then(res => res.json())
      .then(data => setCourseMode(data))
      .catch(() => setCourseMode([]));

    // Fetch regulations from backend
    fetch('/api/branch/regulations')
      .then(res => res.json())
      .then(data => setRegulations(data))
      .catch(() => setRegulations([]));
  }, []);

  // Real-time course code validation
  const validateCourseCode = async (code) => {
    if (!code) {
      setCourseCodeExists(false);
      return;
    }
    setCheckingCourseCode(true);
    try {
      const params = new URLSearchParams({ courseCode: code });
      if (editId) params.append('excludeId', editId);
      const res = await fetch(`/api/branch/check-course-code?${params.toString()}`);
      const data = await res.json();
      setCourseCodeExists(data.exists);
      if (data.exists) {
        toast.error('Department code already exists!');
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setCheckingCourseCode(false);
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...branchState };

    // 1. Unified Required Field Validation (Sequential)
    const requiredFields = [
      { key: 'Ins_Type', label: 'Institution Type' },
      { key: 'Course_Mode', label: 'Course Mode' },
      { key: 'Course_Name', label: 'Course Name' },
      { key: 'Dept_Code', label: 'Department Code' },
      { key: 'Dept_Name', label: 'Department Name' },
      { key: 'Dept_Order', label: 'Department Order' },
      { key: 'Year_Of_Course', label: 'Year of Department' },
      { key: 'AICTE_Approval', label: 'AICTE Approval' },
      { key: 'AICTE_Approval_No', label: 'Active No' },
      { key: 'Intake', label: 'Sanctioned Intake' },
      { key: 'AddlSeats', label: 'Additional Seats' },
      { key: 'OC', label: 'OC' },
      { key: 'BC', label: 'BC' },
      { key: 'BCO', label: 'BCO' },
      { key: 'BCM', label: 'BCM' },
      { key: 'MBC_DNC', label: 'MBC_DNC' },
      { key: 'SC', label: 'SC' },
      { key: 'SCA', label: 'SCA' },
      { key: 'ST', label: 'ST' },
      { key: 'Other', label: 'Other' },
      { key: 'GoiQuota', label: 'Government Quota (GQ)' },
      { key: 'MgtQuota', label: 'Management Quota (MQ)' }
    ];

    const firstMissing = requiredFields.find(f => {
      const value = payload[f.key];
      return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
    });

    if (firstMissing) {
      toast.error(`${firstMissing.label} is required.`);
      return;
    }

    // 2. Uniqueness Validations (Async)
    if (courseCodeExists) {
      toast.error('Department code already exists!');
      return;
    }
    if (checkingCourseCode) {
      toast.info('Checking department code uniqueness, please wait...');
      return;
    }

    // Check for duplicate Course Code (Dept_Code)
    try {
      const res = await fetch('/api/branch');
      const branches = await res.json();
      const duplicate = branches.find(
        b => b.Dept_Code === branchState.Dept_Code && (editId ? b.id !== editId : true)
      );
      if (duplicate) {
        toast.error('This Department Code already exists!');
        return;
      }
    } catch (err) {
      // If fetch fails, allow save but log error
      console.error('Could not check for duplicates', err);
    }

    const loadingToast = toast.loading(editId ? 'Updating branch...' : 'Saving branch...');
    try {
      let response;
      if (editId) {
        response = await fetch(`/api/branch/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/branch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        throw new Error(editId ? 'Failed to update department' : 'Failed to save department ');
      }
      toast.dismiss(loadingToast);
      toast.success(editId ? 'Department updated successfully!' : 'Department saved successfully!');
      setRefreshTable(prev => prev + 1);
      handleReset();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || (editId ? 'Error updating department' : 'Error saving department'));
    }
  };

  const handleReset = () => {
    setBranchState(initialBranchState);
    setEditId(null);
  };

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
              <h6 className="fw-semibold mb-0">Department Details</h6>
            </div>

            {/* Form Card */}
            <div className="card h-100 p-0 radius-12">
              {/* Tab Navigation */}
              <div className="card-header border-bottom-0 p-24 pb-0">
                <div className="nav-tabs-wrapper">
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
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'semester' ? 'active' : ''}`}
                      onClick={() => setActiveTab('semester')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:book-outline" className="me-2"></iconify-icon>
                      Semester & Regulation
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'quota' ? 'active' : ''}`}
                      onClick={() => setActiveTab('quota')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:percent" className="me-2"></iconify-icon>
                      Quota Allocation
                    </button>
                  </nav>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                <form onSubmit={handleSave}>
                  {/* TAB 1: Basic Details */}
                  {activeTab === 'basic' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        {/* Row 1: Institution Type, Course Mode, Course Name, Department Code */}
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Institution Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select radius-8"
                            value={branchState.Ins_Type}
                            onChange={e => setBranchState(prev => ({ ...prev, Ins_Type: e.target.value }))}
                          >
                            <option value="">Select Institution Type</option>
                            {institutionTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Course Mode <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select radius-8"
                            value={branchState.Course_Mode}
                            onChange={(e) => setBranchState(prev => ({ ...prev, Course_Mode: e.target.value }))}
                          >
                            <option value="">Select Course Mode</option>
                            {courseMode.map((mode) => (
                              <option key={mode} value={mode}>
                                {mode}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Course Name <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select radius-8"
                            value={branchState.Course_Name}
                            onChange={(e) => setBranchState(prev => ({ ...prev, Course_Name: e.target.value }))}
                          >
                            <option value="">Select Course</option>
                            {courseNames.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Department Code <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control radius-8 ${courseCodeExists ? 'is-invalid' : ''}`}
                            placeholder="eg: 1010"
                            value={branchState.Dept_Code}
                            onChange={(e) => {
                              setBranchState(prev => ({ ...prev, Dept_Code: e.target.value }));
                              setCourseCodeExists(false);
                            }}
                            onBlur={e => {
                              validateCourseCode(e.target.value.trim());
                            }}
                          />
                        </div>

                        {/* Row 2: Department Name, Department Order, AICTE Approval, Active No */}
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Department Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control radius-8"
                            placeholder="Enter department name"
                            value={branchState.Dept_Name}
                            onChange={(e) => setBranchState(prev => ({ ...prev, Dept_Name: e.target.value }))}
                          />
                        </div>

                        {/* department order */}
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Department Order <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control radius-8"
                            placeholder="Enter department order"
                            value={branchState.Dept_Order}
                            onChange={(e) => setBranchState(prev => ({ ...prev, Dept_Order: e.target.value }))}
                          />
                        </div>

                        {/* department year of course*/}
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Year of Department <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control radius-8"
                            placeholder="Enter year of department"
                            value={branchState.Year_Of_Course}
                            onChange={(e) => setBranchState(prev => ({ ...prev, Year_Of_Course: e.target.value }))}
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            AICTE Approval <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select radius-8"
                            value={branchState.AICTE_Approval}
                            onChange={(e) => setBranchState(prev => ({ ...prev, AICTE_Approval: e.target.value }))}
                          >
                            <option value="">Select Status</option>
                            {AICTEApprovalOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Active No <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control radius-8"
                            placeholder="Enter active no"
                            value={branchState.AICTE_Approval_No}
                            onChange={(e) => setBranchState(prev => ({ ...prev, AICTE_Approval_No: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Semester & Regulation */}
                  {activeTab === 'semester' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        {/* Semester Section */}
                        <div className="col-12">
                          <div className="section-header mb-20">
                            <h6 className="fw-semibold mb-0">
                              Semesters
                            </h6>
                          </div>
                        </div>
                        {[...Array(8)].map((_, i) => (
                          <div className="col-12 col-md-6 col-lg-3" key={`S${i + 1}`}>
                            <label className="form-label fw-semibold text-primary-light mb-8">No. of Papers in S{i + 1}</label>
                            <input
                              type="text"
                              className="form-control radius-8"
                              value={branchState[`S${i + 1}`]}
                              placeholder="eg: 1010,1020"
                              onChange={e => setBranchState(prev => ({ ...prev, [`S${i + 1}`]: e.target.value }))}
                            />
                          </div>
                        ))}

                        {/* Regulation Section */}
                        <div className="col-12 mt-20">
                          <div className="section-header mb-20">
                            <h6 className="fw-semibold mb-0">
                              Regulations
                            </h6>
                          </div>
                        </div>
                        {[...Array(8)].map((_, i) => (
                          <div className="col-12 col-md-6 col-lg-3" key={`R${i + 1}`}>
                            <label className="form-label fw-semibold text-primary-light mb-8">R{i + 1}</label>
                            <select
                              className="form-select radius-8"
                              value={branchState[`R${i + 1}`]}
                              onChange={e => setBranchState(prev => ({ ...prev, [`R${i + 1}`]: e.target.value }))}
                            >
                              <option value="">Select Regulation</option>
                              {regulations.map((reg) => (
                                <option key={reg} value={reg}>
                                  {reg}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Quota Allocation */}
                  {activeTab === 'quota' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        {/* Intake Section */}
                        <div className="col-12">
                          <div className="section-header mb-20">
                            <h6 className="fw-semibold">
                              {/* <iconify-icon icon="mdi:users-outline" className="me-2"></iconify-icon> */}
                              Sanctioned Intake
                            </h6>
                          </div>
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Total Sanctioned Intake <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control radius-8"
                            placeholder="Enter sanctioned intake"
                            value={branchState.Intake}
                            onChange={(e) => {
                              const intake = e.target.value;
                              const gq = intake ? Math.floor(parseInt(intake) / 2) : '';
                              const mq = intake ? Math.floor(parseInt(intake) / 2) : '';

                              const oc = gq ? Math.round(gq * 31 / 100) : '';
                              const bc = 0;
                              const bco = gq ? Math.round(gq * 26.5 / 100) : '';
                              const bcm = gq ? Math.round(gq * 3.5 / 100) : '';
                              const mbcdnc = gq ? Math.round(gq * 20 / 100) : '';
                              const sc = gq ? Math.round(gq * 15 / 100) : '';
                              const sca = gq ? Math.round(gq * 3 / 100) : '';
                              const st = gq ? Math.round(gq * 1 / 100) : '';
                              const other = 0;

                              setBranchState(prev => ({
                                ...prev,
                                Intake: intake,
                                GoiQuota: gq,
                                MgtQuota: mq,
                                OC: oc,
                                BC: bc,
                                BCO: bco,
                                BCM: bcm,
                                'MBC_DNC': mbcdnc,
                                SC: sc,
                                SCA: sca,
                                ST: st,
                                Other: other,
                                AddlSeats: ''
                              }));
                            }}
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Government Quota (GQ) <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control radius-8"
                            placeholder="Auto-calculated"
                            value={branchState.GoiQuota}
                            readOnly
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Management Quota (MQ) <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control radius-8"
                            placeholder="Auto-calculated"
                            value={branchState.MgtQuota}
                            readOnly
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold text-primary-light mb-8">Additional Seats <span className="text-danger">*</span></label>
                          <input
                            type="number"
                            className="form-control radius-8"
                            value={branchState.AddlSeats}
                            placeholder="Enter additional seats value"
                            onChange={e => setBranchState(prev => ({ ...prev, AddlSeats: e.target.value }))}
                          />
                        </div>

                        {/* Category-wise Allocation Section */}
                        <div className="col-12 mt-20">
                          <div className="section-header mb-20">
                            <h6 className="fw-semibold mb-0">
                              Category-wise Allocation
                            </h6>
                          </div>
                        </div>

                        {['OC', 'BC', 'BCO', 'BCM', 'MBC_DNC', 'SC', 'SCA', 'ST', 'Other'].map(field => (
                          <div className="col-12 col-md-6 col-lg-4" key={field}>
                            <label className="form-label fw-semibold text-primary-light mb-8">{field}</label>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={branchState[field]}
                              placeholder={`${field} seats`}
                              readOnly
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="submit"
                      className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                      title={courseCodeExists ? 'Department code already exists' : checkingCourseCode ? 'Checking course code...' : 'Save department details'}
                      disabled={courseCodeExists || checkingCourseCode}
                    >
                      {checkingCourseCode ? 'Checking...' : 'Save Department'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-20 py-11"
                      onClick={handleReset}
                      title="Reset all fields"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Branch Management Section */}
            <div className="card-body ">
              <BranchTable
                refreshTrigger={refreshTable}
                setBranchState={setBranchState}
                branchState={branchState}
                setEditId={setEditId}
              />
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default Branch;
