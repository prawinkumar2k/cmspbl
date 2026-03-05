// src/pages/reports/AcademicReport.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";

const REPORT_TYPES = [
  "Student List",
  "Attendance Summary",
  "Academic Performance",
  "Internal Marks",
  "Consolidated Academic Summary",
];

const INITIAL_FILTERS = {
  academic: "",
  department: "",
  semester: "",
  section: "",
  studentType: "All",
  admissionType: "All",
  registerNo: "",
  fromDate: "",
  toDate: "",
  reportType: "",
};

const DEPARTMENTS = [
  "CSE",
  "ECE",
  "MECH",
  "Science / SCI",
  "Pharmacy",
  "Civil",
  "EEE",
];

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SECTIONS = ["A", "B"];

const AcademicReport = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [generatedOn, setGeneratedOn] = useState("");
  const printAreaRef = useRef(null);

  // --- MOCK DATA (with semester for filtering) ---
  const MOCK_DATA = {
    "Student List": [
      {
        registerNo: "1001",
        studentName: "Alice Johnson",
        department: "CSE",
        classYear: "II",
        section: "A",
        semester: "1",
        status: "Active",
      },
      {
        registerNo: "1002",
        studentName: "Bob Smith",
        department: "ECE",
        classYear: "III",
        section: "B",
        semester: "3",
        status: "Active",
      },
      {
        registerNo: "1003",
        studentName: "Charlie Lee",
        department: "MECH",
        classYear: "I",
        section: "A",
        semester: "5",
        status: "Inactive",
      },
    ],
    "Attendance Summary": [
      {
        registerNo: "1001",
        studentName: "Alice Johnson",
        totalDays: 180,
        present: 170,
        absent: 10,
        attendance: "94.4%",
        semester: "1",
      },
      {
        registerNo: "1002",
        studentName: "Bob Smith",
        totalDays: 180,
        present: 160,
        absent: 20,
        attendance: "88.9%",
        semester: "3",
      },
    ],
    "Academic Performance": [
      {
        registerNo: "1001",
        studentName: "Alice Johnson",
        subject: "Maths",
        totalMarks: 100,
        obtained: 92,
        percentage: "92%",
        score: 92,
        semester: "1",
      },
      {
        registerNo: "1002",
        studentName: "Bob Smith",
        subject: "Physics",
        totalMarks: 100,
        obtained: 85,
        percentage: "85%",
        score: 85,
        semester: "2",
      },
      {
        registerNo: "1003",
        studentName: "Charlie Lee",
        subject: "Chemistry",
        totalMarks: 100,
        obtained: 78,
        percentage: "78%",
        score: 78,
        semester: "3",
      },
    ],
    "Internal Marks": [
      {
        registerNo: "1001",
        studentName: "Alice Johnson",
        subject: "Maths",
        internalMarks: 45,
        maxMarks: 50,
        percentage: "90%",
        score: 45,
        semester: "1",
      },
      {
        registerNo: "1002",
        studentName: "Bob Smith",
        subject: "Physics",
        internalMarks: 40,
        maxMarks: 50,
        percentage: "80%",
        score: 40,
        semester: "2",
      },
    ],
    "Consolidated Academic Summary": [
      {
        registerNo: "1001",
        studentName: "Alice Johnson",
        classYear: "II",
        cgpa: "9.2",
        grade: "A",
        remarks: "Excellent",
      },
      {
        registerNo: "1002",
        studentName: "Bob Smith",
        classYear: "III",
        cgpa: "8.5",
        grade: "B",
        remarks: "Very Good",
      },
    ],
  };

  useEffect(() => {
    // Placeholder for real dropdown loading later
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    setResults([]);
    setGeneratedOn("");
  };

  // --- Helpers for table ---
  const getHeadersForType = (type) => {
    switch (type) {
      case "Student List":
        return [
          "Register No",
          "Student Name",
          "Department",
          "Class/Year",
          "Section",
          "Status",
        ];
      case "Attendance Summary":
        return [
          "Register No",
          "Student Name",
          "Total Days",
          "Present",
          "Absent",
          "Attendance %",
        ];
      case "Academic Performance":
        return [
          "Register No",
          "Student Name",
          "Subject",
          "Total Marks",
          "Obtained Marks",
          "Percentage",
        ];
      case "Internal Marks":
        return [
          "Register No",
          "Student Name",
          "Subject",
          "Internal Marks",
          "Max Marks",
          "Percentage",
        ];
      case "Consolidated Academic Summary":
        return [
          "Register No",
          "Student Name",
          "Class/Year",
          "CGPA",
          "Grade",
          "Remarks",
        ];
      default:
        return [];
    }
  };

  const renderRowForType = (type, row) => {
    switch (type) {
      case "Student List":
        return (
          <>
            <td>{row.registerNo}</td>
            <td>{row.studentName}</td>
            <td>{row.department}</td>
            <td>{row.classYear}</td>
            <td>{row.section}</td>
            <td>{row.status}</td>
          </>
        );
      case "Attendance Summary":
        return (
          <>
            <td>{row.registerNo}</td>
            <td>{row.studentName}</td>
            <td>{row.totalDays}</td>
            <td>{row.present}</td>
            <td>{row.absent}</td>
            <td>{row.attendance}</td>
          </>
        );
      case "Academic Performance":
        return (
          <>
            <td>{row.registerNo}</td>
            <td>{row.studentName}</td>
            <td>{row.subject}</td>
            <td>{row.totalMarks}</td>
            <td>{row.obtained}</td>
            <td>{row.percentage}</td>
          </>
        );
      case "Internal Marks":
        return (
          <>
            <td>{row.registerNo}</td>
            <td>{row.studentName}</td>
            <td>{row.subject}</td>
            <td>{row.internalMarks}</td>
            <td>{row.maxMarks}</td>
            <td>{row.percentage}</td>
          </>
        );
      case "Consolidated Academic Summary":
        return (
          <>
            <td>{row.registerNo}</td>
            <td>{row.studentName}</td>
            <td>{row.classYear}</td>
            <td>{row.cgpa}</td>
            <td>{row.grade}</td>
            <td>{row.remarks}</td>
          </>
        );
      default:
        return null;
    }
  };

  const computeSummary = () => {
    if (!results || results.length === 0) return null;
    const scores = results
      .map((r) => Number(r.score || r.obtained || r.internalMarks || 0))
      .filter((v) => !isNaN(v));

    if (scores.length === 0) {
      return {
        totalStudents: results.length,
        average: "-",
        highest: "-",
        lowest: "-",
      };
    }

    const totalStudents = results.length;
    const sum = scores.reduce((a, b) => a + b, 0);
    const average = (sum / scores.length).toFixed(2);
    const highest = Math.max(...scores).toFixed(2);
    const lowest = Math.min(...scores).toFixed(2);

    return { totalStudents, average, highest, lowest };
  };

  const headers = getHeadersForType(filters.reportType);
  const showSummary =
    filters.reportType === "Academic Performance" ||
    filters.reportType === "Internal Marks";
  const summary = showSummary ? computeSummary() : null;

  // --- Search (mock) ---
  const handleSearch = () => {
    if (!filters.reportType) {
      alert("Please select Report Type");
      return;
    }

    setLoading(true);
    setResults([]);

    setTimeout(() => {
      let data = MOCK_DATA[filters.reportType] || [];

      // Semester: if 1–7, show that sem; if 8, show all
      if (filters.semester && filters.semester !== "8") {
        data = data.filter(
          (r) => !r.semester || r.semester === filters.semester
        );
      }

      // Department & Section filter (if available on row)
      if (filters.department) {
        data = data.filter(
          (r) => !r.department || r.department === filters.department
        );
      }
      if (filters.section) {
        data = data.filter(
          (r) => !r.section || r.section === filters.section
        );
      }

      setResults(data);
      setGeneratedOn(new Date().toLocaleDateString("en-IN"));
      setLoading(false);
    }, 500);
  };

  // --- Print using Bonafide-style template ---
  const handlePrint = () => {
    if (!printAreaRef.current) return;

    const content = printAreaRef.current.innerHTML;
    const style = `
      @page { size: A4; margin: 15mm; }
      body { font-family: "Times New Roman", serif; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #000; padding: 4px 6px; }
      th { text-align: center; }
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Academic Report</title>
          <style>${style}</style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.onload = () => win.print();
  };

  return (
    <>
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Academic Report</h6>
            </div>

            <div className="card h-100 p-0 radius-12">
              {/* Header + Buttons */}
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Filters</h6>
                  <div className="text-sm">
                    Use filters to narrow down the academic report.
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info"
                    onClick={handlePrint}
                  >
                    Print Report
                  </button>
                </div>
              </div>

              <div className="card-body p-24">
                {/* FILTERS */}
                <form className="row g-3 align-items-end mb-4">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Academic Year
                    </label>
                    <select
                      name="academic"
                      value={filters.academic}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="2022-23">2022-23</option>
                      <option value="2023-24">2023-24</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2026-27">2026-27</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      name="department"
                      value={filters.department}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {DEPARTMENTS.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Semester</label>
                    <select
                      name="semester"
                      value={filters.semester}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Section</label>
                    <select
                      name="section"
                      value={filters.section}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {SECTIONS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Student Type
                    </label>
                    <select
                      name="studentType"
                      value={filters.studentType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Lateral">Lateral</option>
                      <option value="All">All</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">From Date</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">To Date</label>
                    <input
                      type="date"
                      name="toDate"
                      value={filters.toDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Report Type
                    </label>
                    <select
                      name="reportType"
                      value={filters.reportType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {REPORT_TYPES.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>

                {/* REPORT AREA (Bonafide-style template) */}
                <div className="mb-4">
                  {loading ? (
                    <div className="p-4 border rounded">Loading report...</div>
                  ) : (
                    <div
                      ref={printAreaRef}
                      id="academic-report-preview"
                      style={{ background: "#fff" }}
                    >
                      {results.length === 0 ? (
                        <div className="p-4 border rounded text-center text-muted">
                          No data to display. Please apply filters and click
                          Search.
                        </div>
                      ) : (
                        <div
                          style={{
                            border: "4px solid #b8860b",
                            padding: 8,
                            maxWidth: "900px",
                            margin: "0 auto",
                          }}
                        >
                          <div
                            style={{
                              border: "2px solid #000",
                              padding: 20,
                              position: "relative",
                            }}
                          >
                            {/* Watermark */}
                            <img
                              src="/assets/images/GRT.png"
                              alt=""
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                opacity: 0.06,
                                width: "380px",
                              }}
                            />

                            {/* Letterhead */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                              }}
                            >
                              <img
                                src="/assets/images/GRT.png"
                                alt="logo"
                                style={{
                                  width: 96,
                                  height: 96,
                                  objectFit: "contain",
                                }}
                              />
                              <div style={{ textAlign: "left", flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: 20,
                                    fontWeight: 800,
                                    letterSpacing: 0.6,
                                  }}
                                >
                                  GRT INSTITUTE OF PHARMACEUTICAL
                                </div>
                                <div
                                  style={{
                                    fontSize: 20,
                                    fontWeight: 800,
                                    letterSpacing: 0.6,
                                  }}
                                >
                                  EDUCATION AND RESEARCH
                                </div>
                                <div
                                  style={{
                                    marginTop: 6,
                                    fontSize: 11,
                                    color: "#0b4e80",
                                  }}
                                >
                                  GRT Mahalakshmi Nagar, Chennai - Tirupati
                                  Highway, Tiruttani - 631 209.
                                  <br />
                                  Phone No : 044-27885997 / 98 / 27885400
                                  E-mail : grtper@grt.edu.in Website : grtper.com
                                </div>
                                <div style={{ fontSize: 10, marginTop: 6 }}>
                                  Approved by Pharmacy Council of India, New
                                  Delhi and Affiliated to T.N. Dr. MGR Medical
                                  University, Chennai
                                </div>
                              </div>
                            </div>

                            <hr />

                            {/* Meta line */}
                            <div className="d-flex justify-content-between mb-2">
                              <div style={{ fontSize: 12 }}>
                                Academic Year:{" "}
                                <b>{filters.academic || "-"}</b>
                                <br />
                                Department:{" "}
                                <b>{filters.department || "All"}</b>
                              </div>
                              <div style={{ fontSize: 12, textAlign: "right" }}>
                                Semester: <b>{filters.semester || "All"}</b>
                                <br />
                                Generated on: <b>{generatedOn || "-"}</b>
                              </div>
                            </div>

                            {/* Title */}
                            <h5
                              className="text-center text-decoration-underline mb-3"
                              style={{ fontWeight: 700 }}
                            >
                              {filters.reportType || "Academic Report"}
                            </h5>

                            {/* Summary for marks reports */}
                            {summary && (
                              <div
                                className="mb-3"
                                style={{
                                  fontSize: 12,
                                  border: "1px solid #000",
                                  padding: "4px 8px",
                                }}
                              >
                                <span style={{ marginRight: 16 }}>
                                  <b>Total Students:</b> {summary.totalStudents}
                                </span>
                                <span style={{ marginRight: 16 }}>
                                  <b>Average Score:</b> {summary.average}
                                </span>
                                <span style={{ marginRight: 16 }}>
                                  <b>Highest Score:</b> {summary.highest}
                                </span>
                                <span>
                                  <b>Lowest Score:</b> {summary.lowest}
                                </span>
                              </div>
                            )}

                            {/* TABLE */}
                            <table>
                              <thead>
                                <tr>
                                  <th style={{ width: 50 }}>S.No</th>
                                  {headers.map((h) => (
                                    <th key={h}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {results.map((row, idx) => (
                                  <tr
                                    key={row.registerNo || row.studentName || idx}
                                  >
                                    <td style={{ textAlign: "center" }}>
                                      {idx + 1}
                                    </td>
                                    {renderRowForType(filters.reportType, row)}
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Footer line */}
                            <div
                              style={{
                                marginTop: 24,
                                fontSize: 11,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <div style={{ textAlign: "right" }}>
                                <b>Principal</b>
                                <br />
                                <span>
                                  GRT Institute of Pharmaceutical Education and
                                  Research
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          
          </div>
            <Footer />
        </div>
      </section>
    </>
  );
};

export default AcademicReport;
