import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import DataTable from "../../../../../components/DataTable/DataTable";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";
import api from "../../../../../utils/api"; // ✅ FIXED: required import

/* =====================================================
   CUSTOM TOAST UI (Matches StudentEnquiry)
===================================================== */
const CustomToast = ({ message }) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "0px 2px 8px rgba(48, 28, 28, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderLeft: "3px solid #3B82F6",
        position: "relative"
      }}
    >
      <div style={{ color: "#3B82F6", fontSize: "16px" }}>ℹ️</div>
      <div style={{ fontSize: "13px", fontWeight: 500 }}>{message}</div>
    </div>
  );
};


// Removed hardcoded COURSES and COMMUNITIES
const QUALIFICATIONS = ['Diploma', '12', '10', '8'];

const ApplicationIssue = () => {
  // Normalize incoming API rows to predictable frontend fields
  const normalizeRow = (row) => {
    if (!row) return {};
    const parsedDate = row.Admission_Date || row.date || row.admissionDate || "";
    const parsedDateOnly = parsedDate ? String(parsedDate).split("T")[0] : "";
    return {
      id: row.id || row.ID || row.Id || null,
      applicationNo:
        row.Application_No || row.application_no || row.ApplicationNo || row.applicationNo || "",
      courseApplied:
        row.Course_Name || row.Course_Applied || row.course_applied || row.courseApplied || "",
      name:
        row.Student_Name || row.student_name || row.name || "",
      gender:
        row.Gender || row.gender || row.gender_name || "",
      community: row.Community || row.community || "",
      date: parsedDateOnly,
      qualification: row.Qualification || row.qualification || "",
      parentName:
        row.Father_Name || row.father_name || row.parent_name || row.parentName || "",
      address:
        row.Current_Address || row.current_address || row.address || "",
      parentMobile:
        row.Father_Mobile || row.father_mobile || row.parent_mobile || row.parentMobile || "",
      reference: row.Reference || row.reference || "",
      amount: row.Amount || row.amount || "100",
      admissionDate: parsedDateOnly,
    };
  };
  const [formData, setFormData] = useState({
    applicationNo: "",
    courseApplied: "",
    name: "",
    gender: "",
    community: "",
    date: new Date().toISOString().split("T")[0],
    qualification: "",
    parentName: "",
    address: "",
    parentMobile: "",
    reference: "",
    amount: "100",
  });

  const [courseOptions, setCourseOptions] = useState([]);
  const [communityOptions, setCommunityOptions] = useState([]);
  // Fetch course and community options from backend
  useEffect(() => {
    api.get('/courseMaster').then(res => {
      setCourseOptions(res.data || []);
    }).catch(() => setCourseOptions([]));
    api.get('/applicationIssue/communityMaster').then(res => {
      setCommunityOptions(res.data || []);
    }).catch(() => setCommunityOptions([]));
  }, []);

  const [applications, setApplications] = useState([]);
  const [lastSoldNo, setLastSoldNo] = useState(2575);
  const [searchNo, setSearchNo] = useState("2575");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch all applications from backend and map to frontend fields
  useEffect(() => {
    setLoading(true);
    api
      .get("/applicationIssue/")
      .then((res) => {
        // Normalize API rows so table columns get populated regardless of casing
        const mapped = (res.data || []).map((row) => normalizeRow(row));
        setApplications(mapped);
        setError(null);
        // Set next application number
        if (mapped.length > 0) {
          const maxNo = Math.max(...mapped.map((a) => Number(a.applicationNo) || 0));
          setLastSoldNo(maxNo);
        }
      })
      .catch(() => setError("Failed to fetch students"))
      .finally(() => setLoading(false));
  }, []);

  // Update next application number when lastSoldNo changes
  useEffect(() => {
    const nextNo = (lastSoldNo + 1).toString();
    setFormData((prev) => ({ ...prev, applicationNo: nextNo }));
  }, [lastSoldNo]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleReceive = () => {
    if (!searchNo.trim()) return toast.info("Select an application number");

    const found = applications.find((app) => app.applicationNo === searchNo);
    if (found) {
      setFormData((prev) => ({ ...prev, ...normalizeRow(found) }));
      setSelectedReport(found);
      setShowReportModal(true);
      toast.info(`Loaded application ${searchNo}`);
    } else {
      toast.info(`Application ${searchNo} not found`);
    }
  };

  // Unified delete handler for both row and form
  const handleDeleteRow = (app) => {
    const appNo = app?.applicationNo || formData.applicationNo;
    if (!appNo) return toast.error("No application selected");
    toast(
      (t) => (
        <div>
          <p>Delete application {appNo}?</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-danger btn-sm"
              onClick={async () => {
                setApplications((prev) => prev.filter((i) => i.applicationNo !== appNo));
                toast.success("Deleted");
                toast.dismiss(t.id);
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleReport = () => {
    if (applications.length === 0)
      return toast.error("No applications available");
    toast.success("Generating report...");
  };

  const handleSubmit = async () => {
    if (!formData.applicationNo) {
      toast.error('Application No is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.courseApplied) {
      toast.error('Course is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.name) {
      toast.error('Name is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.gender) {
      toast.error('Gender is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.qualification) {
      toast.error('Qualification is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.parentName) {
      toast.error('Parent Name is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.parentMobile) {
      toast.error('Parent mobile number is required', { position: "top-right", autoClose: 3000 });
      return;
    } else if (!/^[0-9]{10}$/.test(formData.parentMobile)) {
      toast.error('Parent mobile number must be exactly 10 digits', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.reference) {
      toast.error('Reference is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!formData.community) {
      toast.error('Community is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    const payload = {
      Application_No: formData.applicationNo,
      Course_Applied: formData.courseApplied || null,
      Course_Name: formData.courseApplied || null,
      Student_Name: formData.name,
      Gender: formData.gender,
      Qualification: formData.qualification || null,
      Father_Name: formData.parentName,
      Father_Mobile: formData.parentMobile,
      Community: formData.community,
      Current_Address: formData.address,
      Admission_Date: formData.date,
      Reference: formData.reference || null,
      Paid_Fees: formData.amount || null,
    };

    try {
      if (isEditing && editId) {
        await api.put(`/applicationIssue/update/${editId}`, payload);
        toast.success("Application updated successfully");
        setLoading(true);
        const res = await api.get("/applicationIssue/");
        const mapped = (res.data || []).map((app) => normalizeRow(app));
        setApplications(mapped);
        setIsEditing(false);
        setEditId(null);
        const nextNo = (Number(formData.applicationNo) + 1).toString();
        setLastSoldNo(Number(formData.applicationNo));
        setFormData({
          applicationNo: nextNo,
          courseApplied: "",
          name: "",
          community: "",
          date: new Date().toISOString().split("T")[0],
          qualification: "",
          parentName: "",
          address: "",
          parentMobile: "",
          reference: "",
          amount: "100",
        });
      } else {
        await api.post("/applicationIssue/create", payload);
        toast.success("Application saved successfully");
        setLoading(true);
        const res = await api.get("/applicationIssue/");
        const mapped = (res.data || []).map((app) => normalizeRow(app));
        setApplications(mapped);
        const nextNo = (Number(formData.applicationNo) + 1).toString();
        setLastSoldNo(Number(formData.applicationNo));
        setFormData({
          applicationNo: nextNo,
          courseApplied: "",
          name: "",
          gender: "",
          community: "",
          date: new Date().toISOString().split("T")[0],
          qualification: "",
          parentName: "",
          address: "",
          parentMobile: "",
          reference: "",
          amount: "100",
        });
      }
    } catch (err) {
      console.error(isEditing ? "UPDATE ERROR:" : "SAVE ERROR:", err);
      toast.error(
        isEditing
          ? "Failed to update application"
          : "Failed to save application"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { accessorKey: "applicationNo", header: "App No" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "parentName", header: "Parent Name" },
    { accessorKey: "parentMobile", header: "Parent Mobile" },
    { accessorKey: "community", header: "Community" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "admissionDate", header: "Application Date" },
  ];

  const handleView = (app) => {
    setFormData((prev) => ({ ...prev, ...normalizeRow(app) }));
    setIsEditing(false);
    setEditId(null);
    toast.info(`Viewing ${app.applicationNo}`);
  };

  const handleEdit = (app) => {
    setFormData((prev) => ({ ...prev, ...normalizeRow(app) }));
    setIsEditing(true);
    setEditId(app.id);
    toast.info(`Editing ${app.applicationNo}`);
  };

  // ========================= UPDATED REPORT MODAL =========================
  const ReportModal = () => {
    const handlePrint = () => {
      window.print();
    };

    return (
      <div
        className={`modal fade ${showReportModal ? "show" : ""}`}
        style={{
          display: showReportModal ? "block" : "none",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "650px" }}
        >
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Application Fee Receipt</h5>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={handlePrint}
                >
                  <i className="fas fa-print me-1" /> Print
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowReportModal(false)}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="modal-body p-0">
              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  padding: "25px",
                  fontFamily: "Times New Roman, serif",
                  position: "relative",
                }}
              >
                {/* Outer Border */}
                <div
                  style={{
                    border: "2px solid black",
                    padding: "20px",
                    minHeight: "650px",
                  }}
                >
                  {/* Header Text */}
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      GRT MAHALAKSHMI NAGAR, PATTABIRAMAPURAM VILLAGE CHENNAI -
                    </div>
                  </div>

                  {/* Top Row: No & Date */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      marginBottom: "15px",
                    }}
                  >
                    <div>
                      <strong>No. {selectedReport?.applicationNo || "—"}</strong>
                    </div>
                    <div>
                      <strong>
                        Date{" "}
                        {new Date().toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </div>
                  </div>

                  {/* Gray Title Bar */}
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      padding: "4px 0",
                      background: "#d9d9d9",
                      marginBottom: "18px",
                      fontWeight: "bold",
                      width: "220px",
                      margin: "0 auto 18px",
                    }}
                  >
                    APPLICATION FEE RECEIPT
                  </div>

                  {/* Receipt Details */}
                  <div style={{ fontSize: "13px", lineHeight: "2" }}>
                    {/* Received Rupees */}
                    <div>
                      Received Rupees{" "}
                      <span style={{ fontStyle: "italic", marginLeft: "10px" }}>
                        one hundred
                      </span>
                    </div>

                    {/* Cost of prospectus */}
                    <div
                      style={{
                        borderBottom: "1px dotted black",
                        width: "100%",
                        margin: "8px 0",
                      }}
                    />

                    <div style={{ marginBottom: "10px" }}>
                      only towards the cost of prospectus and
                    </div>

                    {/* Application Form From */}
                    <div>
                      Application form from{" "}
                      <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                        {selectedReport?.name || "—"}
                      </span>
                    </div>

                    <div
                      style={{
                        borderBottom: "1px dotted black",
                        width: "100%",
                        marginTop: "12px",
                      }}
                    />
                  </div>

                  {/* Amount Box + Principal */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "35px",
                      alignItems: "center",
                    }}
                  >
                    {/* Rs box */}
                    <div
                      style={{
                        border: "1px solid black",
                        padding: "6px 14px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      Rs. {selectedReport?.amount || "100"}
                    </div>

                    <div style={{ textAlign: "center", marginRight: "30px" }}>
                      <div
                        style={{
                          borderTop: "1px solid black",
                          width: "120px",
                          fontSize: "12px",
                          paddingTop: "4px",
                        }}
                      >
                        Principal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


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
      {showReportModal && <div className="modal-backdrop fade show"></div>}
      <ReportModal />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Application Issue</h6>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className={`btn btn-sm ${showTable ? "btn-success" : "btn-outline-info"
                    }`}
                  onClick={() => setShowTable(!showTable)}
                  title={
                    showTable ? "Hide Student Table" : "Show Student Table"
                  }
                >
                  <i
                    className={`fas ${showTable ? "fa-eye-slash" : "fa-table"
                      } me-1`}
                  ></i>
                  {showTable ? "Hide Table" : "View Students"}
                </button>
              </div>
            </div>

            {/* ----------------- FORM ----------------- */}
            <div className="card mb-24">
              <div className="card-body">
                <form noValidate>
                  <div className="row">
                    <div className="mb-24">
                      <div className="row g-20">
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Application No{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="applicationNo"
                            value={formData.applicationNo}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">Date <span className="text-danger">*</span></label>
                          <div className="form-control-wrapper">
                            <input
                              type="date"
                              className="form-control"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Course Applied
                          </label>
                          <span className="text-danger">*</span>
                          <div className="form-select-wrapper">
                            <select
                              className="form-select"
                              name="courseApplied"
                              value={formData.courseApplied}
                              onChange={handleInputChange}
                            >
                              <option value="">Select</option>
                              {courseOptions.map((c, index) => (
                                <option key={`course-${c.id}-${index}`} value={c.Course_Name}>{c.Course_Name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Name <span className="text-danger">*</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="form-control"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <select
                              className="form-select"
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Qualification
                          </label>
                          <span className="text-danger">*</span>
                          <div style={{ position: 'relative' }}>
                            <select
                              className="form-select"
                              name="qualification"
                              value={formData.qualification}
                              onChange={handleInputChange}
                            >
                              <option value="">Select</option>
                              {QUALIFICATIONS.map((q) => (
                                <option key={q}>{q}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Parent Name
                          </label>
                          <span className="text-danger">*</span>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="form-control"
                              name="parentName"
                              value={formData.parentName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Parent Mobile
                          </label>
                          <span className="text-danger">*</span>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="form-control"
                              name="parentMobile"
                              value={formData.parentMobile}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Reference
                          </label>
                          <span className="text-danger">*</span>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="form-control"
                              name="reference"
                              value={formData.reference}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Application Amount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Community
                          </label>
                          <span className="text-danger">*</span>
                          <div style={{ position: 'relative' }}>
                            <select
                              className="form-select"
                              name="community"
                              value={formData.community}
                              onChange={handleInputChange}
                            >
                              <option value="">Select</option>
                              {communityOptions.map((c, index) => (
                                <option key={`comm-${c.id || index}`} value={c.Community_Name}>{c.Community_Name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold">
                            Address
                          </label>
                          <span className="text-danger">*</span>
                          <div style={{ position: 'relative' }}>
                            <textarea
                              className="form-control"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="d-flex justify-content-end gap-2 mt-24 pt-24 border-top">
                    <select
                      className="form-select form-select-sm w-auto"
                      value={searchNo}
                      onChange={(e) => setSearchNo(e.target.value)}
                      style={{ maxWidth: 200 }}
                    >
                      <option value="">Select Application No</option>
                      {applications.map((app) => (
                        <option key={app.applicationNo} value={app.applicationNo}>
                          {app.applicationNo} - {app.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-20 py-11"
                      onClick={handleReceive}
                      disabled={!searchNo}
                    >
                      <i className="fas fa-receipt me-1"></i>Receive
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-warning px-20 py-11"
                      onClick={handleReport}
                    >
                      Report
                    </button>
                    {isEditing ? (
                      <button
                        type="button"
                        className="btn btn-success px-20 py-11"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-success px-20 py-11"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* TABLE */}
            {showTable && (
              <DataTable
                data={applications}
                columns={columns}
                loading={loading}
                error={error}
                title="Issued Applications"
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteRow}
                enableExport
                enableSelection
                pageSize={10}
              />
            )}
          </div>

          <Footer />
        </div>
      </section>
    </>
  );
};

export default ApplicationIssue;
