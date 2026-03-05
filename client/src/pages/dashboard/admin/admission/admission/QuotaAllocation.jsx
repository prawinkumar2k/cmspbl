import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";


// Will be fetched from course_details table

const QUOTA_TYPES = [
  { id: "govt", label: "Government", color: "#FF6B6B" },
  { id: "management", label: "Management", color: "#95E1D3" },
  { id: "other", label: "Other", color: "#F38181" }
];

const CATEGORIES = [
  "OC",
  "BC",
  "BCO",
  "BCM",
  "MBC/DNC",
  "SC",
  "SCA",
  "ST",
  "TotSeat"
];

// -----------------------------
// FIXED QUOTA INITIALIZATION
// -----------------------------
const initializeQuotas = () => {
  const result = {};
  QUOTA_TYPES.forEach(type => {
    result[type.id] = {};
    CATEGORIES.forEach(cat => {
      result[type.id][cat] = "";
    });
  });
  return result;
};

const QuotaAllocation = () => {
  const [savedRecords, setSavedRecords] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [quotas, setQuotas] = useState(initializeQuotas());
  const [courseDetails, setCourseDetails] = useState([]); // fetched from DB
  const [courseList, setCourseList] = useState([]); // fetched from course_master
  const [selectedDeptObj, setSelectedDeptObj] = useState(null);

  // Fetch course_details from backend
  useEffect(() => {
    axios.get("/api/quotaAllocation/course-details")
      .then(res => {
        setCourseDetails(res.data || []);
      })
      .catch(() => setCourseDetails([]));
  }, []);

  // Fetch course list from course_master
  useEffect(() => {
    axios.get("/api/quotaAllocation/course-list")
      .then(res => setCourseList(res.data || []))
      .catch(() => setCourseList([]));
  }, []);

  // Fetch saved quota allocations from server and group them into records
  const fetchSavedRecords = async () => {
    try {
      const res = await axios.get('/api/quotaAllocation');
      const rows = res.data || [];

      // group rows by Course_Name + Dept_Code + created_at (rows created together share timestamp)
      const groups = {};
      rows.forEach(r => {
        const key = `${r.Course_Name || ''}||${r.Dept_Code || ''}||${r.created_at || r.created_at}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
      });

      const records = Object.values(groups).map(groupRows => {
        // pick first row for metadata
        const meta = groupRows[0] || {};
        // build quotas object
        const quotasObj = {
          govt: {},
          management: {},
          other: {}
        };

        groupRows.forEach(r => {
          const role = (r.Type || '').toLowerCase().includes('gov') ? 'govt' : (r.Type || '').toLowerCase().includes('mgt') || (r.Type || '').toLowerCase().includes('manage') ? 'management' : 'other';
          quotasObj[role] = {
            OC: r.OC || 0,
            BC: r.BC || 0,
            BCO: r.BCO || 0,
            BCM: r.BCM || 0,
            'MBC/DNC': r.MBC || 0,
            SC: r.SC || 0,
            SCA: r.SCA || 0,
            ST: r.ST || 0,
            TotSeat: r.TotSeat || 0
          };
        });

        // try to resolve Dept_Name from courseDetails using Dept_Code
        const deptNameMatch = courseDetails.find(cd => String(cd.Dept_Code) === String(meta.Dept_Code));

        return {
          courseCode: meta.Course_Name || '',
          branchCode: meta.Dept_Code || '',
          branchName: deptNameMatch ? deptNameMatch.Dept_Name : '',
          quotas: quotasObj,
          created_at: meta.created_at || null
        };
      });

      setSavedRecords(records);
    } catch (err) {
      console.error('Failed to load saved quota allocations', err);
    }
  };

  // load saved records after component mounts and whenever courseDetails updates
  useEffect(() => {
    fetchSavedRecords();
  }, [courseDetails]);

  // Pre-fill quotas from courseDetails if available
  useEffect(() => {
    if (!selectedCourse || !selectedDepartment) return;
    const deptObj = courseDetails.find(cd => cd.Course_Name === selectedCourse && cd.Dept_Name === selectedDepartment);
    if (!deptObj) return;
    // Map DB fields to quota allocation communities
    const newQuotas = initializeQuotas();
    // Government (GoiQuota)
    if (deptObj.GoiQuota) {
      newQuotas.govt.OC = deptObj.OC || 0;
      newQuotas.govt.BC = deptObj.BC || 0;
      newQuotas.govt.BCO = deptObj.BCO || 0;
      newQuotas.govt.BCM = deptObj.BCM || 0;
      newQuotas.govt["MBC/DNC"] = deptObj.MBC_DNC || 0;
      newQuotas.govt.SC = deptObj.SC || 0;
      newQuotas.govt.SCA = deptObj.SCA || 0;
      newQuotas.govt.ST = deptObj.ST || 0;
      newQuotas.govt.TotSeat = deptObj.GoiQuota || 0;
    }
    // Management (MgtQuota)
    if (deptObj.MgtQuota) {
      newQuotas.management.OC = deptObj.OC || 0;
      newQuotas.management.BC = deptObj.BC || 0;
      newQuotas.management.BCO = deptObj.BCO || 0;
      newQuotas.management.BCM = deptObj.BCM || 0;
      newQuotas.management["MBC/DNC"] = deptObj.MBC_DNC || 0;
      newQuotas.management.SC = deptObj.SC || 0;
      newQuotas.management.SCA = deptObj.SCA || 0;
      newQuotas.management.ST = deptObj.ST || 0;
      newQuotas.management.TotSeat = deptObj.MgtQuota || 0;
    }
    // Set all 'other' row fields to 0
    Object.keys(newQuotas.other).forEach(cat => {
      newQuotas.other[cat] = 0;
    });
    setQuotas(newQuotas);
  }, [selectedCourse, selectedDepartment, courseDetails]);

  // ...existing state and handlers...
  // Helper to calculate row sum (OC-Others)
  const getRowSum = (rowId) => {
    return CATEGORIES.slice(0, -1).reduce((acc, cat) => {
      const val = quotas[rowId][cat];
      return acc + (parseInt(val) || 0);
    }, 0);
  };

  // Calculate total for a category across all quota rows (govt, management, other)
  const getColumnTotal = (category) => {
    return QUOTA_TYPES.reduce((acc, row) => {
      const v = quotas[row.id][category];
      return acc + (parseInt(v) || 0);
    }, 0);
  };

  // Totals object for current editable quotas
  const getTotalsForQuotas = () => {
    const totals = {};
    CATEGORIES.forEach(cat => {
      if (cat === 'TotSeat') {
        totals[cat] = QUOTA_TYPES.reduce((acc, row) => acc + getRowSum(row.id), 0);
      } else {
        totals[cat] = getColumnTotal(cat);
      }
    });
    return totals;
  };

  // Dummy download handlers
  const handleDownloadCSV = () => {
    toast.info('CSV download initiated', { autoClose: 2000 });
  };
  const handleDownloadPDF = () => {
    toast.info('PDF download initiated', { autoClose: 2000 });
  };

  // Handler for course selection
  const handleCourseSelect = (e) => {
    const value = e.target.value;
    setSelectedCourse(value);
    setSelectedDepartment("");
    setDepartmentCode("");
  };

  // Handler for department selection
  const handleDepartmentSelect = (e) => {
    const dep = e.target.value;
    setSelectedDepartment(dep);
    const deptObj = courseDetails.find(cd => cd.Course_Name === selectedCourse && cd.Dept_Name === dep);
    setDepartmentCode(deptObj ? deptObj.Dept_Code : "");
    setSelectedDeptObj(deptObj || null);
    setQuotas(initializeQuotas());
  };


  // Validate form before saving (show toast messages like StudentEnquiry)
  const validateForm = () => {
    if (!selectedCourse || String(selectedCourse).trim() === '') {
      toast.error('Course is required', { position: "top-right", autoClose: 3000 });
      return false;
    }
    if (!selectedDepartment || String(selectedDepartment).trim() === '') {
      toast.error('Department is required', { position: "top-right", autoClose: 3000 });
      return false;
    }
    if (!departmentCode || String(departmentCode).trim() === '') {
      toast.error('Department Code is required', { position: "top-right", autoClose: 3000 });
      return false;
    }

    // ensure at least one numeric quota is provided (optional)
    const anyQuota = QUOTA_TYPES.some(row =>
      CATEGORIES.slice(0, -1).some(cat => parseInt(quotas[row.id][cat]) > 0)
    );
    if (!anyQuota) {
      toast.info('Enter at least one quota value', { position: "top-right", autoClose: 3000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Prepare payloads for each quota row (Government, Management, Other)
      const getVal = (rowId, cat) => parseInt(quotas[rowId][cat]) || 0;

      const payloads = QUOTA_TYPES.map(row => ({
        type: row.label,
        courseName: selectedCourse,
        deptCode: departmentCode,
        oc: getVal(row.id, 'OC'),
        bc: getVal(row.id, 'BC'),
        bco: getVal(row.id, 'BCO'),
        bcm: getVal(row.id, 'BCM'),
        mbc: getVal(row.id, 'MBC/DNC'),
        sc: getVal(row.id, 'SC'),
        sca: getVal(row.id, 'SCA'),
        st: getVal(row.id, 'ST'),
        other: 0,
        totSeat: getVal(row.id, 'TotSeat'),
      }));

      // Send all rows to server
      await Promise.all(payloads.map(pl => axios.post('/api/quotaAllocation/create', pl)));

      // update local saved records for UI
      setSavedRecords([...savedRecords, { courseCode: selectedCourse, branchCode: departmentCode, branchName: selectedDepartment, quotas }]);
      toast.info('Quota records saved successfully', { autoClose: 2000 });
      // reset form after save
      setSelectedCourse('');
      setSelectedDepartment('');
      setDepartmentCode('');
      setSelectedDeptObj(null);
      setQuotas(initializeQuotas());
    } catch (err) {
      console.error('Failed to save quota allocation', err);
      toast.info('Failed to save quota allocation', { autoClose: 2000 });
    }
  };

  const handleQuotaChange = (rowId, category, value) => {
    setQuotas((prev) => {
      const updatedRow = {
        ...prev[rowId],
        [category]: value
      };
      if (category !== "TotSeat") {
        updatedRow["TotSeat"] = CATEGORIES.slice(0, -1).reduce((acc, cat) => {
          const val = updatedRow[cat];
          return acc + (parseInt(val) || 0);
        }, 0);
      }
      return {
        ...prev,
        [rowId]: updatedRow
      };
    });
  };

  const handleClose = () => {
    setSelectedCourse("");
    setSelectedDepartment("");
    setDepartmentCode("");
    setQuotas(initializeQuotas());
    toast.info('Form reset successfully', { position: "top-right", autoClose: 2000 });
  };

  // Remove a saved record from local UI (does not touch server rows)
  const handleDeleteRecord = (index) => {
    setSavedRecords(prev => prev.filter((_, i) => i !== index));
    toast.info('Saved record cleared', { autoClose: 2000 });
  };

  const [showTable, setShowTable] = useState(false);

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
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Quota Allocation</h6>
            </div>
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Quota Allocation</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to allocate quotas
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                    onClick={() => setShowTable(!showTable)}
                    title={showTable ? 'Hide Quota Records' : 'Show Quota Records'}
                  >
                    <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                    {showTable ? 'Hide Table' : 'View Records'}
                  </button>
                </div>
              </div>
              <div className="card-body p-24">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-20 mb-3 align-items-end">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-primary-light mb-8">Course <span className="text-danger">*</span></label>
                      <div className="form-select-wrapper">
                        <select className="form-select radius-8" value={selectedCourse} onChange={handleCourseSelect}>
                          <option value="">Select Course</option>
                          {courseList.map(course => (
                            <option key={course.Course_Name} value={course.Course_Name}>{course.Course_Name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-primary-light mb-8">Department <span className="text-danger">*</span></label>
                      <div className="form-select-wrapper">
                        <select className="form-select radius-8" value={selectedDepartment} onChange={handleDepartmentSelect} disabled={!selectedCourse}>
                          <option value="">Select Department</option>
                          {courseDetails.filter(cd => cd.Course_Name === selectedCourse).map(cd => (
                            <option key={cd.Dept_Name} value={cd.Dept_Name}>{cd.Dept_Name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-primary-light mb-8">Department Code <span className="text-danger">*</span></label>
                      <div className="form-control-wrapper">
                        <input
                          className="form-control radius-8"
                          type="text"
                          value={departmentCode}
                          readOnly
                          placeholder="Department code will appear here"
                        />
                      </div>
                    </div>
                  </div>
                  {selectedDeptObj && (
                    <div className="row g-20 mb-3">
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Intake</label>
                        <input className="form-control radius-8" readOnly value={selectedDeptObj.Intake || ''} />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Government Quota</label>
                        <input className="form-control radius-8" readOnly value={selectedDeptObj.GoiQuota || ''} />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Management Quota</label>
                        <input className="form-control radius-8" readOnly value={selectedDeptObj.MgtQuota || ''} />
                      </div>
                    </div>
                  )}
                  <div className="table-responsive mb-4">
                    <table className="table table-bordered table-sm text-center align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Type</th>
                          {CATEGORIES.map((cat) => (
                            cat === "TotSeat" ? (
                              <th key={cat} style={{ background: "#f0f0f0" }}>{cat}</th>
                            ) : (
                              <th key={cat}>{cat}</th>
                            )
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {QUOTA_TYPES.map((row) => (
                          <tr key={row.id}>
                            <td style={{ backgroundColor: row.color, fontWeight: "bold" }}>{row.label}</td>
                            {CATEGORIES.map((cat, idx) => (
                              cat === "TotSeat" ? (
                                <td key={cat} style={{ background: "#f0f0f0" }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#222" }}>{getRowSum(row.id)}</span>
                                  </div>
                                </td>
                              ) : (
                                <td key={cat}>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center radius-8"
                                    value={quotas[row.id][cat]}
                                    onChange={(e) => handleQuotaChange(row.id, cat, e.target.value)}
                                    style={{ minWidth: 60 }}
                                    disabled={row.id !== "other"}
                                  />
                                </td>
                              )
                            ))}
                          </tr>
                        ))}
                        {/* Totals row for editable table */}
                        <tr style={{ background: '#eef2f6', fontWeight: '700' }}>
                          <td style={{ textAlign: 'right' }}>Total</td>
                          {CATEGORIES.map(cat => (
                            cat === 'TotSeat' ? (
                              <td key={cat} style={{ background: '#f0f0f0' }}>{getTotalsForQuotas()[cat]}</td>
                            ) : (
                              <td key={cat}>{getTotalsForQuotas()[cat]}</td>
                            )
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button className="btn btn-outline-secondary px-20 py-11" type="button" onClick={handleClose}>
                      Reset
                    </button>
                    <button
                      className="btn btn-outline-success px-20 py-11"
                      style={{ fontSize: "1rem" }}
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Quota Records Table Section */}
            {showTable && savedRecords.length > 0 && (
              <div className="mt-5 border-top pt-10">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">Quota Records</h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-success px-3 py-1 fw-semibold d-flex align-items-center radius-8"
                      style={{ fontSize: "1rem" }}
                      onClick={handleDownloadCSV}
                      type="button"
                    >
                      <Icon icon="mdi:file-download-outline" className="me-1" /> CSV
                    </button>
                    <button
                      className="btn btn-outline-danger px-3 py-1 fw-semibold d-flex align-items-center radius-8"
                      style={{ fontSize: "1rem" }}
                      onClick={handleDownloadPDF}
                      type="button"
                    >
                      <Icon icon="mdi:file-download-outline" className="me-1" /> PDF
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm text-center align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Type</th>
                        {CATEGORIES.map(cat => (
                          cat === "TotSeat"
                            ? <th key={cat} style={{ background: "#f0f0f0" }}>{cat}</th>
                            : <th key={cat}>{cat}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {savedRecords.map((rec, recIdx) => (
                        <React.Fragment key={"record-" + recIdx}>
                          <tr>
                            <td colSpan={4 + CATEGORIES.length} style={{ background: '#f8f9fb' }}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>Course:</strong> {rec.courseCode || '-'}
                                  <span style={{ margin: '0 8px' }} />
                                  <strong>Department:</strong> {rec.branchName || '-'}
                                  <span style={{ margin: '0 8px' }} />
                                  <strong>Code:</strong> {rec.branchCode || '-'}
                                </div>
                                <div>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRecord(recIdx)} type="button">Clear</button>
                                </div>
                              </div>
                            </td>
                          </tr>
                          {QUOTA_TYPES.map((row, rowIdx) => (
                            <tr key={recIdx + "-" + row.id} style={rowIdx === 0 ? { borderTop: "3px solid #e9ecef" } : {}}>
                              <td style={{ backgroundColor: row.color, fontWeight: "bold" }}>{row.label}</td>
                              {CATEGORIES.map(cat => (
                                cat === "TotSeat"
                                  ? <td key={cat} style={{ background: "#f0f0f0" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                      <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#222" }}>
                                        {CATEGORIES.slice(0, -1).reduce((acc, c) => acc + (parseInt(rec.quotas[row.id][c]) || 0), 0)}
                                      </span>
                                    </div>
                                  </td>
                                  : <td key={cat}>{rec.quotas[row.id][cat]}</td>
                              ))}
                            </tr>
                          ))}
                          {/* Totals row for saved record */}
                          <tr style={{ background: '#eef2f6', fontWeight: '700' }}>
                            <td style={{ textAlign: 'right' }}>Total</td>
                            {CATEGORIES.map(cat => {
                              if (cat === 'TotSeat') {
                                const totalSeats = QUOTA_TYPES.reduce((acc, r) => acc + (CATEGORIES.slice(0, -1).reduce((s, c) => s + (parseInt(rec.quotas[r.id][c]) || 0), 0)), 0);
                                return <td key={cat} style={{ background: '#f0f0f0' }}>{totalSeats}</td>;
                              }
                              const colTotal = QUOTA_TYPES.reduce((acc, r) => acc + (parseInt(rec.quotas[r.id][cat]) || 0), 0);
                              return <td key={cat}>{colTotal}</td>;
                            })}
                          </tr>
                          <tr><td colSpan={4 + CATEGORIES.length} style={{ height: 12, background: "#fff" }}></td></tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}
export default QuotaAllocation;
