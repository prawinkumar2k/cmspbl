import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../components/css/style.css";
import "./subject.css";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import SubjectTable from "./SubjectTable";

const Subject = () => {
  const [colNo, setColNo] = useState("");
  const [regl, setRegl] = useState("");
  const [department, setdepartment] = useState("");
  const [sem, setSem] = useState("");
  const [type, setType] = useState("");
  const [elective, setElective] = useState("");
  const [elec, setElec] = useState("");
  const [qpc, setQPC] = useState("");
  const [maxMark, setMaxMark] = useState("");
  const [passMark, setPassMark] = useState("");
  const [internalMaxMark, setInternalMaxMark] = useState("");
  const [internalMinMark, setInternalMinMark] = useState("");
  const [externalMaxMark, setExternalMaxMark] = useState("");
  const [externalMinMark, setExternalMinMark] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [refreshTable, setRefreshTable] = useState(0);
  const [editId, setEditId] = useState(null);
  const [subjectCodeExists, setSubjectCodeExists] = useState(false);
  const [checkingSubjectCode, setCheckingSubjectCode] = useState(false);

  // Master data states
  const [deptCode, setDeptCode] = useState([]);
  const [electiveOptions, setElectiveOptions] = useState([]);
  const [regulationOptions, setRegulationOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  // Fetch master data on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, electiveRes, regulationRes, semesterRes, typeRes] = await Promise.all([
          fetch('/api/subject/master/department'),
          fetch('/api/subject/master/elective'),
          fetch('/api/subject/master/regulation'),
          fetch('/api/subject/master/semester'),
          fetch('/api/subject/master/subject-type'),
        ]);
        setDeptCode(await deptRes.json());
        setElectiveOptions(await electiveRes.json());
        setRegulationOptions(await regulationRes.json());
        setSemesterOptions(await semesterRes.json());
        setTypeOptions(await typeRes.json());
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchMasterData();
  }, []);

  // Real-time subject code validation
  const validateSubjectCode = async (code) => {
    if (!code) {
      setSubjectCodeExists(false);
      return;
    }
    setCheckingSubjectCode(true);
    try {
      const params = new URLSearchParams({ subjectCode: code });
      if (editId) params.append('excludeId', editId);
      const res = await fetch(`/api/subject/check-subject-code?${params.toString()}`);
      const data = await res.json();
      setSubjectCodeExists(data.exists);
      if (data.exists) {
        toast.error('Subject code already exists!');
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setCheckingSubjectCode(false);
    }
  };

  // Auto-calculate mark fields based on Max Mark and Pass Mark
  useEffect(() => {
    if (maxMark && passMark) {
      const maxMarkNum = parseFloat(maxMark);
      const passMarkNum = parseFloat(passMark);

      if (!isNaN(maxMarkNum) && !isNaN(passMarkNum) && maxMarkNum > 0) {
        // Internal Max Mark = 1/4 × Max Mark
        const internalMax = Math.round((maxMarkNum / 4) * 100) / 100;
        setInternalMaxMark(internalMax);

        // Internal Min Mark = Fixed 9
        const internalMin = 9;
        setInternalMinMark(internalMin);

        // External Max Mark = 3/4 × Max Mark
        const externalMax = Math.round(((maxMarkNum * 3) / 4) * 100) / 100;
        setExternalMaxMark(externalMax);

        // External Min Mark = Pass Mark - Internal Min Mark
        const externalMin = passMarkNum - internalMin;
        setExternalMinMark(externalMin);
      }
    }
  }, [maxMark, passMark]);

  // Save or update subject
  const handleSave = async (e) => {
    e.preventDefault();

    // 1. Unified Required Field Validation (Sequential)
    const requiredFields = [
      { key: 'department', label: 'Department Code' },
      { id: 'subjectCode', key: 'subjectCode', label: 'Subject Code' },
      { id: 'subjectName', key: 'subjectName', label: 'Subject Name' },
      { key: 'sem', label: 'Semester' },
      { key: 'colNo', label: 'Col No' },
      { key: 'regl', label: 'Regulation' },
      { key: 'type', label: 'Type' },
      { key: 'elective', label: 'Elective' },
      { key: 'maxMark', label: 'Max Mark' },
      { key: 'passMark', label: 'Pass Mark' },
      { key: 'internalMinMark', label: 'Internal Min Mark' },
      { key: 'externalMaxMark', label: 'External Max Mark' },
      { key: 'externalMinMark', label: 'External Min Mark' }
    ];

    const firstMissing = requiredFields.find(f => {
      const val = eval(f.key);
      return val === null || val === undefined || (typeof val === 'string' && val.trim() === '');
    });

    if (firstMissing) {
      toast.error(`${firstMissing.label} is required.`);
      return;
    }

    // 2. Uniqueness Validations (Async)
    if (subjectCodeExists) {
      toast.error('Subject code already exists!');
      return;
    }
    if (checkingSubjectCode) {
      toast.info('Checking subject code uniqueness, please wait...', { autoClose: 2000 });
      return;
    }
    const payload = {
      Dept_Code: department,
      Sub_Code: subjectCode,
      Sub_Name: subjectName,
      Semester: sem,
      Col_No: colNo,
      Regulation: regl,
      Sub_Type: type,
      Elective: elective,
      Elective_No: elec,
      QPC: qpc,
      Total_Hours: totalHours
    };
    // include mark fields
    payload.Max_Mark = maxMark;
    payload.Pass_Mark = passMark;
    payload.Internal_Max_Mark = internalMaxMark;
    payload.Internal_Min_Mark = internalMinMark;
    payload.External_Max_Mark = externalMaxMark;
    payload.External_Min_Mark = externalMinMark;

    // Add timestamps
    if (editId) {
      payload.Updated_At = new Date().toISOString().slice(0, 19).replace('T', ' ');
    } else {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      payload.Created_At = now;
      payload.Updated_At = now;
    }
    try {
      let response;
      if (editId) {
        response = await fetch(`/api/subject/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/subject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) throw new Error(editId ? 'Failed to update subject' : 'Failed to save subject');
      toast.success(editId ? 'Subject updated successfully!' : 'Subject saved successfully!', { autoClose: 2000 });
      setRefreshTable(prev => prev + 1);
      handleReset();
    } catch (error) {
      toast.error(error.message || (editId ? 'Error updating subject' : 'Error saving subject'));
    }
  };

  // Reset form
  const handleReset = () => {
    setColNo("");
    setRegl(regulationOptions[0] || "");
    setType(typeOptions[0] || "");
    setdepartment(deptCode[0] || "");
    setSem(semesterOptions[0] || "");
    setElec("");
    setElective(electiveOptions[0] || "");
    setQPC("");
    setSubjectCode("");
    setSubjectName("");
    setTotalHours("");
    setMaxMark("");
    setPassMark("");
    setInternalMaxMark("");
    setInternalMinMark("");
    setExternalMaxMark("");
    setExternalMinMark("");
    setEditId(null);
    setSubjectCodeExists(false);
  };

  // Edit handler (called from SubjectTable)
  const handleEdit = (subject) => {
    setdepartment(subject.Dept_Code || "");
    setSubjectCode(subject.Sub_Code || "");
    setSubjectName(subject.Sub_Name || "");
    setSem(subject.Semester || "");
    setColNo(subject.Col_No || "");
    setRegl(subject.Regulation || "");
    setType(subject.Sub_Type || "");
    setElec(subject.Elective_No || "");
    setElective(subject.Elective || "");
    setQPC(subject.QPC || "");
    setTotalHours(subject.Total_Hours || "");
    setMaxMark(subject.Max_Mark || "");
    setPassMark(subject.Pass_Mark || "");
    setInternalMaxMark(subject.Internal_Max_Mark || "");
    setInternalMinMark(subject.Internal_Min_Mark || "");
    setExternalMaxMark(subject.External_Max_Mark || "");
    setExternalMinMark(subject.External_Min_Mark || "");
    setEditId(subject.id);
    setSubjectCodeExists(false);
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
              <h6 className="fw-semibold mb-0">Subject Details</h6>
            </div>

            {/* Form Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-body p-24">
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    {/* Subject Information Section */}
                    <div className="col-12">
                      <div className="mb-24">
                        <div className="row g-20">
                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Department Code<span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select radius-8"
                              value={department}
                              onChange={(e) => setdepartment(e.target.value)}
                            >
                              <option value="">Select Department Code</option>
                              {deptCode.map((code) => (
                                <option key={code} value={code}>
                                  {code}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Subject Code <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control radius-8 ${subjectCodeExists ? 'is-invalid' : ''}`}
                              value={subjectCode}
                              onChange={(e) => {
                                setSubjectCode(e.target.value);
                                setSubjectCodeExists(false);
                              }}
                              placeholder="Enter Subject Code"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Subject Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control radius-8"
                              value={subjectName}
                              onChange={(e) => setSubjectName(e.target.value)}
                              placeholder="Enter Subject Name"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Semester <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select radius-8"
                              value={sem}
                              onChange={(e) => setSem(Number(e.target.value))}
                            >
                              <option value="">Select Semester</option>
                              {semesterOptions.map((semNum) => (
                                <option key={semNum} value={semNum}>
                                  {semNum}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Col No <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={colNo}
                              onChange={(e) => setColNo(e.target.value)}
                              placeholder="Enter Col No"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Regulation <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select radius-8"
                              value={regl}
                              onChange={(e) => setRegl(e.target.value)}
                            >
                              <option value="">Select Regulation</option>
                              {regulationOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Type <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select radius-8"
                              value={type}
                              onChange={(e) => setType(e.target.value)}
                            >
                              <option value="">Select Type</option>
                              {typeOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Total Hours */}
                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Total Hours <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={totalHours}
                              onChange={(e) => setTotalHours(e.target.value)}
                              placeholder="Enter Total Hours"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Elective <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select radius-8"
                              value={elective}
                              onChange={(e) => setElective(e.target.value)}
                            >
                              <option value="">Select Yes/No</option>
                              {electiveOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Elective No <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={elec}
                              onChange={(e) => setElec(e.target.value)}
                              placeholder="Enter ELEC"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              QPC <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control radius-8"
                              value={qpc}
                              onChange={(e) => setQPC(e.target.value)}
                              placeholder="Enter QPC"
                            />
                          </div>
                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Max Mark
                            </label> <span className="text-danger">*</span>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={maxMark}
                              onChange={(e) => setMaxMark(e.target.value)}
                              placeholder="Enter Max Mark"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Pass Mark
                            </label> <span className="text-danger">*</span>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={passMark}
                              onChange={(e) => setPassMark(e.target.value)}
                              placeholder="Enter Pass Mark"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Internal Max Mark
                            </label> <span className="text-danger">*</span>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={internalMaxMark}
                              placeholder="Enter Internal Max Mark"
                            />
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Internal Min Mark
                            </label> <span className="text-danger">*</span>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={internalMinMark}
                              placeholder="Enter Internal Min Mark"
                            />
                            {/* <small className="text-muted">Auto-calculated: Fixed value 9</small> */}
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              External Max Mark
                            </label> <span className="text-danger">*</span>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={externalMaxMark}
                              placeholder="Enter External Max Mark"
                            />
                            {/* <small className="text-muted">Auto-calculated: 3/4 × Max Mark</small> */}
                          </div>

                          <div className="col-12 col-md-6 col-lg-3">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              External Min Mark
                            </label> <span className="text-danger">*</span>
                            <input
                              type="number"
                              className="form-control radius-8"
                              value={externalMinMark}
                              placeholder="Enter External Min Mark"
                            />
                            {/* <small className="text-muted">Auto-calculated: Pass Mark - Internal Min Mark</small> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                      <button
                        type="submit"
                        className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                        title={subjectCodeExists ? 'Subject code already exists' : checkingSubjectCode ? 'Checking subject code...' : 'Save subject details'}
                        disabled={subjectCodeExists || checkingSubjectCode}
                      >
                        {checkingSubjectCode ? 'Checking...' : editId ? 'Update' : 'Save'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-warning-600 radius-8 px-20 py-11"
                        onClick={handleReset}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Subject Table Component */}
            <SubjectTable refreshTrigger={refreshTable} onEdit={handleEdit} />

          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default Subject;
