import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------
// API SIMULATION — replace with your real API
// ----------------------------------------------------------
import {
  getStaffProfile,
  getStaffSubjects
} from "../../../../../utils/staffReportApi";

// ----------------------------------------------------------
// STATIC DATA (Dept, Staff Dropdowns)
// ----------------------------------------------------------
const DEPARTMENTS = ["MPHARM", "BPHARM", "D.PHARM"];

const STAFF_LIST = [
  { empNo: "1045", name: "SEKAR A M", department: "MPHARM" },
  { empNo: "1046", name: "RAJESH K", department: "BPHARM" }
];

// ----------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------
const StaffReport = () => {
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmpNo, setSelectedEmpNo] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const [profileReport, setProfileReport] = useState(null);
  const [subjectReport, setSubjectReport] = useState(null);

  const [loading, setLoading] = useState(false);

  // Filter staff based on department
  const filteredStaff = STAFF_LIST.filter(
    (s) => !selectedDept || s.department === selectedDept
  );

  // ---------------------------
  // SELECT HANDLERS
  // ---------------------------
  const handleDeptChange = (e) => {
    setSelectedDept(e.target.value);
    setSelectedEmpNo("");
    setSelectedName("");
    setProfileReport(null);
    setSubjectReport(null);
  };

  const handleEmpNoChange = (e) => {
    const emp = e.target.value;
    setSelectedEmpNo(emp);

    const staff = filteredStaff.find((s) => s.empNo === emp);
    setSelectedName(staff ? staff.name : "");

    setProfileReport(null);
    setSubjectReport(null);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setSelectedName(name);

    const staff = filteredStaff.find((s) => s.name === name);
    setSelectedEmpNo(staff ? staff.empNo : "");

    setProfileReport(null);
    setSubjectReport(null);
  };

  // ----------------------------------------------------------
  // PROFILE BUTTON → Staff Profile Report
  // ----------------------------------------------------------
  const loadProfile = async () => {
    if (!selectedEmpNo || !selectedName) {
      toast.error("Please select both EmpNo and Name");
      return;
    }

    setLoading(true);
    try {
      const data = await getStaffProfile(selectedEmpNo);
      setProfileReport(data);
      setSubjectReport(null);
    } catch {
      toast.error("Failed to load staff profile");
    }
    setLoading(false);
  };

  // ----------------------------------------------------------
  // VIEW BUTTON → Subject Report
  // ----------------------------------------------------------
  const loadSubjects = async () => {
    if (!selectedEmpNo || !selectedName) {
      toast.error("Please select both EmpNo and Name");
      return;
    }

    setLoading(true);
    try {
      const data = await getStaffSubjects(selectedEmpNo);
      setSubjectReport(data);
      setProfileReport(null);
    } catch {
      toast.error("Failed to load subject report");
    }
    setLoading(false);
  };

  // ----------------------------------------------------------
  // PRINT REPORT
  // ----------------------------------------------------------
  const printReport = () => {
    window.print();
  };

  // ----------------------------------------------------------
  // DOWNLOAD REPORT (HTML to PDF)
  // ----------------------------------------------------------
  const downloadReport = () => {
    const content = document.getElementById("print-area").innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.html";
    a.click();
  };

  // ----------------------------------------------------------
  // RENDER COMPONENT
  // ----------------------------------------------------------
  return (
    <>
      <Toaster position="top-right" />

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* SEARCH SECTION */}
            <div className="card mb-4 p-4 shadow-sm" style={{maxWidth: 900, margin: '0 auto'}}>
              <div className="row g-3 align-items-end justify-content-center">
                {/* Department */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Department</label>
                  <select className="form-select" value={selectedDept} onChange={handleDeptChange}>
                    <option value="">Select</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                {/* Emp No */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Emp No</label>
                  <select className="form-select" value={selectedEmpNo} onChange={handleEmpNoChange}>
                    <option value="">Select</option>
                    {filteredStaff.map((s) => (
                      <option key={s.empNo} value={s.empNo}>{s.empNo}</option>
                    ))}
                  </select>
                </div>
                {/* Name */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Name</label>
                  <select className="form-select" value={selectedName} onChange={handleNameChange}>
                    <option value="">Select</option>
                    {filteredStaff.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                {/* Buttons */}
                <div className="col-md-3 d-flex gap-2 justify-content-end">
                  <button className="btn btn-outline-primary-600 px-4" onClick={loadProfile}>PROFILE</button>
                  <button className="btn btn-outline-success px-4" onClick={loadSubjects}>VIEW</button>
                  <button className="btn btn-outline-secondary px-4" onClick={()=>{setProfileReport(null);setSubjectReport(null);}}>CLOSE</button>
                </div>
              </div>
            </div>

            {/* REPORT DISPLAY SECTION */}
            {(profileReport || subjectReport) && (
              <div className="card shadow-sm" style={{maxWidth: 900, margin: '0 auto'}}>
                <div className="card-body">
                  {/* Print & Download */}
                  <div className="d-flex justify-content-end gap-3 mb-3">
                    <button className="btn btn-dark btn-sm" onClick={printReport}>Print</button>
                    <button className="btn btn-info btn-sm" onClick={downloadReport}>Download</button>
                  </div>
                  <div id="print-area">
                    {/* SHOW PROFILE REPORT */}
                    {profileReport && (
                      <div>
                        <h4 className="text-center fw-bold mb-4">STAFF PROFILE</h4>
                        <div className="row mb-2">
                          <div className="col-md-6"><b>Name:</b> {profileReport.staffName}</div>
                          <div className="col-md-6"><b>Post:</b> {profileReport.post}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-6"><b>Department:</b> {profileReport.department}</div>
                          <div className="col-md-6"><b>DOB:</b> {profileReport.dob}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-6"><b>Email:</b> {profileReport.email}</div>
                          <div className="col-md-6"><b>Contact:</b> {profileReport.contact}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-6"><b>Community:</b> {profileReport.community}</div>
                          <div className="col-md-6"><b>Caste:</b> {profileReport.caste}</div>
                        </div>
                      </div>
                    )}
                    {/* SHOW SUBJECT REPORT */}
                    {subjectReport && (
                      <div>
                        <h4 className="text-center fw-bold mb-4">STAFF SUBJECTS</h4>
                        <table className="table table-bordered mt-3">
                          <thead className="table-light">
                            <tr>
                              <th>S.No</th>
                              <th>Course No</th>
                              <th>Regl</th>
                              <th>Sem</th>
                              <th>ColNo</th>
                              <th>SubCode</th>
                              <th>Subject Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjectReport.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.courseNo}</td>
                                <td>{row.regl}</td>
                                <td>{row.sem}</td>
                                <td>{row.colNo}</td>
                                <td>{row.subCode}</td>
                                <td>{row.subjectName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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

export default StaffReport;
