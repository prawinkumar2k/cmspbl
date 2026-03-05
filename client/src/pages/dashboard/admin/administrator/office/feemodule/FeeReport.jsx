// // NOTE: Keep styles/layout identical to FeeRecipt.jsx — reuse classes or import styles from FeeRecipt.jsx
// import React, { useState, useRef } from "react";
// import Sidebar from "../../../../../../components/Sidebar";
// import Navbar from "../../../../../../components/Navbar";
// import Footer from "../../../../../../components/footer";


// const ACADEMIC_YEARS = ["2023-24", "2024-25", "2025-26"];
// const DEPARTMENTS = ["Science", "Commerce", "Arts", "Engineering"];
// const COURSES = {
//   Science: ["B.Sc", "B.Pharm", "D.Pharm", "M.Sc"],
//   Commerce: ["B.Com", "M.Com"],
//   Arts: ["BA", "MA"],
//   Engineering: ["B.Tech", "M.Tech"]
// };
// const FEE_TYPES = ["Tuition", "Library", "Transport", "Hostel", "Exam Fees", "Advance Pay"];
// const REPORT_TYPES = ["Paid List", "Unpaid List", "Both"];
// const RANGE_TYPES = ["Today", "Date Range", "Month Wise", "Quarter", "Yearly"];
// const SORT_OPTIONS = ["Name", "Class", "Largest Pending", "Smallest Pending"];
// const OUTPUT_FORMATS = ["Preview", "Printable View", "CSV"];
// const INCLUDE_SECTIONS = ["Summary", "Detailed List", "Totals", "Concession/Fine Details"];

// function generateMockFeeReport(filters) {
//   // Simulate report data
//   return {
//     summary: {
//       totalStudents: 3,
//       totalPaid: 2,
//       totalUnpaid: 1,
//       totalAmount: 42000,
//       totalPending: 12000
//     },
//     details: [
//       {
//         name: "EDISON",
//         regNo: "1001",
//         department: "Science",
//         course: "B.Pharm",
//         paid: true,
//         pending: 0,
//         feeType: "Tuition",
//         amount: 12000
//       },
//       {
//         name: "Fayaz",
//         regNo: "1002",
//         department: "Science",
//         course: "D.Pharm",
//         paid: false,
//         pending: 12000,
//         feeType: "Tuition",
//         amount: 12000
//       },
//       {
//         name: "Amelia",
//         regNo: "1003",
//         department: "Science",
//         course: "B.Sc",
//         paid: true,
//         pending: 0,
//         feeType: "Library",
//         amount: 800
//       }
//     ]
//   };
// }

// export default function FeeReport() {
//   const [filters, setFilters] = useState({
//     academicYear: "",
//     department: "",
//     course: "",
//     studentSearch: "",
//     reportType: "Paid List",
//     rangeType: "Today",
//     dateFrom: "",
//     dateTo: "",
//     month: "",
//     quarter: "",
//     year: "",
//     feeTypes: [],
//     sortBy: "Name",
//     outputFormat: "Preview",
//     reportTitle: "",
//     includeSections: []
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [showPrintModal, setShowPrintModal] = useState(false);
//   const printAreaRef = useRef(null);

//   // Validation
//   const validate = () => {
//     const errs = {};
//     if (!filters.academicYear) errs.academicYear = "Required";
//     if (!filters.reportType) errs.reportType = "Required";
//     return errs;
//   };

//   // Handlers
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       if (name === "includeSections") {
//         setFilters((prev) => ({
//           ...prev,
//           includeSections: checked
//             ? [...prev.includeSections, value]
//             : prev.includeSections.filter((v) => v !== value)
//         }));
//       } else {
//         setFilters((prev) => ({ ...prev, [name]: checked }));
//       }
//     } else if (name === "feeTypes") {
//       const val = value;
//       setFilters((prev) => ({
//         ...prev,
//         feeTypes: prev.feeTypes.includes(val)
//           ? prev.feeTypes.filter((v) => v !== val)
//           : [...prev.feeTypes, val]
//       }));
//     } else {
//       setFilters((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleGenerate = async (e) => {
//     e.preventDefault();
//     const errs = validate();
//     setErrors(errs);
//     if (Object.keys(errs).length) return;
//     setLoading(true);
//     setReportData(null);
//     // Simulate loading
//     setTimeout(async () => {
//       let data;
//       // TODO: replace fallback with project integration getFeeReport(filters)
//       // try {
//       //   data = await getFeeReport(filters);
//       // } catch (err) {
//       //   data = generateMockFeeReport(filters);
//       // }
//       data = generateMockFeeReport(filters);
//       setReportData(data);
//       setLoading(false);
//     }, 500);
//   };

//   const handleExportCSV = () => {
//     if (!reportData || !reportData.details) return;
//     const headers = ["Name", "Reg No", "Department", "Course", "Paid", "Pending", "Fee Type", "Amount"];
//     const rows = reportData.details.map((r) => [r.name, r.regNo, r.department, r.course, r.paid ? "Paid" : "Unpaid", r.pending, r.feeType, r.amount]);
//     const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `FeeReport_${filters.academicYear || "report"}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handlePrint = () => {
//     setShowPrintModal(true);
//     setTimeout(() => {
//       window.print();
//     }, 250);
//   };

//   // TODO: call html2pdf(document.getElementById('printArea'))
//   const handleDownloadPDF = () => {
//     // TODO: call html2pdf(document.getElementById('printArea'))
//     alert("PDF download is not implemented. See TODO in code.");
//   };

//   const handleReset = () => {
//     setFilters({
//       academicYear: "",
//       department: "",
//       course: "",
//       studentSearch: "",
//       reportType: "Paid List",
//       rangeType: "Today",
//       dateFrom: "",
//       dateTo: "",
//       month: "",
//       quarter: "",
//       year: "",
//       feeTypes: [],
//       sortBy: "Name",
//       outputFormat: "Preview",
//       reportTitle: "",
//       includeSections: []
//     });
//     setErrors({});
//     setReportData(null);
//     setShowPrintModal(false);
//   };

//   // Dependent dropdowns
//   const courseOptions = filters.department ? COURSES[filters.department] || [] : [];

//   return (
//     <section className="overlay">
//       <Sidebar />
//       <div className="dashboard-main">
//         <Navbar />
//         <div className="dashboard-main-body">
//           <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
//             <h6 className="fw-semibold mb-0">Fee Report</h6>
//           </div>
//           <div className="card h-100 p-0 radius-12">
//             <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
//               <div>
//                 <h6 className="text-lg fw-semibold mb-2">Generate Fee Report</h6>
//               </div>
//             </div>
//             <div className="card-body p-24">
//               <form className="row g-3 align-items-end mb-3" onSubmit={handleGenerate} aria-label="Fee Report Filter Form">
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="academicYear">Academic Year</label>
//                   <select
//                     id="academicYear"
//                     name="academicYear"
//                     className="form-select"
//                     value={filters.academicYear}
//                     onChange={handleChange}
//                     required
//                     aria-required="true"
//                     aria-invalid={!!errors.academicYear}
//                   >
//                     <option value="">Select</option>
//                     {ACADEMIC_YEARS.map((y) => (
//                       <option key={y} value={y}>{y}</option>
//                     ))}
//                   </select>
//                   {errors.academicYear && <span className="text-danger" role="alert">{errors.academicYear}</span>}
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="department">Department</label>
//                   <select
//                     id="department"
//                     name="department"
//                     className="form-select"
//                     value={filters.department}
//                     onChange={handleChange}
//                     aria-required="true"
//                   >
//                     <option value="">Select</option>
//                     {DEPARTMENTS.map((d) => (
//                       <option key={d} value={d}>{d}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="course">Course / Class</label>
//                   <select
//                     id="course"
//                     name="course"
//                     className="form-select"
//                     value={filters.course}
//                     onChange={handleChange}
//                     disabled={!filters.department}
//                   >
//                     <option value="">Select</option>
//                     {courseOptions.map((c) => (
//                       <option key={c} value={c}>{c}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="studentSearch">Student Search</label>
//                   <input
//                     id="studentSearch"
//                     name="studentSearch"
//                     type="text"
//                     className="form-control"
//                     value={filters.studentSearch}
//                     onChange={handleChange}
//                     placeholder="Name / Reg No"
//                     aria-label="Student Search"
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="reportType">Report Type</label>
//                   <select
//                     id="reportType"
//                     name="reportType"
//                     className="form-select"
//                     value={filters.reportType}
//                     onChange={handleChange}
//                     required
//                     aria-required="true"
//                     aria-invalid={!!errors.reportType}
//                   >
//                     {REPORT_TYPES.map((r) => (
//                       <option key={r} value={r}>{r}</option>
//                     ))}
//                   </select>
//                   {errors.reportType && <span className="text-danger" role="alert">{errors.reportType}</span>}
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="rangeType">Report Range Type</label>
//                   <select
//                     id="rangeType"
//                     name="rangeType"
//                     className="form-select"
//                     value={filters.rangeType}
//                     onChange={handleChange}
//                   >
//                     {RANGE_TYPES.map((r) => (
//                       <option key={r} value={r}>{r}</option>
//                     ))}
//                   </select>
//                 </div>
//                 {/* Consistent columns for date/month/quarter/year pickers */}
//                 <div className="col-md-3" style={{ display: filters.rangeType === "Date Range" ? "block" : "none" }}>
//                   <label className="form-label fw-semibold" htmlFor="dateFrom">From</label>
//                   <input
//                     id="dateFrom"
//                     name="dateFrom"
//                     type="date"
//                     className="form-control"
//                     value={filters.dateFrom}
//                     onChange={handleChange}
//                     aria-label="From Date"
//                   />
//                 </div>
//                 <div className="col-md-3" style={{ display: filters.rangeType === "Date Range" ? "block" : "none" }}>
//                   <label className="form-label fw-semibold" htmlFor="dateTo">To</label>
//                   <input
//                     id="dateTo"
//                     name="dateTo"
//                     type="date"
//                     className="form-control"
//                     value={filters.dateTo}
//                     onChange={handleChange}
//                     aria-label="To Date"
//                   />
//                 </div>
//                 <div className="col-md-3" style={{ display: filters.rangeType === "Month Wise" ? "block" : "none" }}>
//                   <label className="form-label fw-semibold" htmlFor="month">Month</label>
//                   <input
//                     id="month"
//                     name="month"
//                     type="month"
//                     className="form-control"
//                     value={filters.month}
//                     onChange={handleChange}
//                     aria-label="Month"
//                   />
//                 </div>
//                 <div className="col-md-3" style={{ display: filters.rangeType === "Quarter" ? "block" : "none" }}>
//                   <label className="form-label fw-semibold" htmlFor="quarter">Quarter</label>
//                   <select
//                     id="quarter"
//                     name="quarter"
//                     className="form-select"
//                     value={filters.quarter}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select</option>
//                     <option value="Q1">Q1</option>
//                     <option value="Q2">Q2</option>
//                     <option value="Q3">Q3</option>
//                     <option value="Q4">Q4</option>
//                   </select>
//                 </div>
//                 <div className="col-md-3" style={{ display: filters.rangeType === "Yearly" ? "block" : "none" }}>
//                   <label className="form-label fw-semibold" htmlFor="year">Year</label>
//                   <input
//                     id="year"
//                     name="year"
//                     type="number"
//                     className="form-control"
//                     value={filters.year}
//                     onChange={handleChange}
//                     aria-label="Year"
//                     min="2020"
//                     max="2030"
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="feeType">Fee Type</label>
//                   <select
//                     id="feeType"
//                     name="feeType"
//                     className="form-select"
//                     value={filters.feeTypes[0] || ""}
//                     onChange={e => setFilters(prev => ({
//                       ...prev,
//                       feeTypes: e.target.value ? [e.target.value] : []
//                     }))}
//                     required
//                     aria-required="true"
//                   >
//                     <option value="">Select</option>
//                     {FEE_TYPES.map((f) => (
//                       <option key={f} value={f}>{f}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label fw-semibold" htmlFor="sortBy">Sort By</label>
//                   <select
//                     id="sortBy"
//                     name="sortBy"
//                     className="form-select"
//                     value={filters.sortBy}
//                     onChange={handleChange}
//                   >
//                     {SORT_OPTIONS.map((s) => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="col-md-3 mb-3">
//                   <label className="form-label fw-semibold" htmlFor="outputFormat">Output Format</label>
//                   <select
//                     id="outputFormat"
//                     name="outputFormat"
//                     className="form-select"
//                     value={filters.outputFormat}
//                     onChange={handleChange}
//                   >
//                     {OUTPUT_FORMATS.map((o) => (
//                       <option key={o} value={o}>{o}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="col-md-3 mb-3">
//                   <label className="form-label fw-semibold" htmlFor="reportTitle">Report Title</label>
//                   <input
//                     id="reportTitle"
//                     name="reportTitle"
//                     type="text"
//                     className="form-control"
//                     value={filters.reportTitle}
//                     onChange={handleChange}
//                     placeholder="Report Title (optional)"
//                   />
//                 </div>
//                 <div className="col-md-3 mb-3">
//                   <label className="form-label fw-semibold" htmlFor="includeSection">Include Section</label>
//                   <select
//                     id="includeSection"
//                     name="includeSection"
//                     className="form-select"
//                     value={filters.includeSections[0] || ""}
//                     onChange={e => setFilters(prev => ({
//                       ...prev,
//                       includeSections: e.target.value ? [e.target.value] : []
//                     }))}
//                     required
//                     aria-required="true"
//                   >
//                     <option value="">Select</option>
//                     {INCLUDE_SECTIONS.map((s) => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="col-md-12 d-flex gap-2 align-items-end mt-2">
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading || Object.keys(validate()).length > 0}
//                     aria-disabled={loading || Object.keys(validate()).length > 0}
//                   >
//                     <i className="fas fa-table me-2"></i>Generate Report
//                   </button>
//                   <button type="button" className="btn btn-secondary fw-bold" onClick={handleReset}>Reset</button>
//                   <button type="button" className="btn btn-success" onClick={handleExportCSV} disabled={!reportData}>Export CSV</button>
//                   <button type="button" className="btn btn-primary" onClick={handlePrint} disabled={!reportData}>Printable View</button>
//                   <button type="button" className="btn btn-info" onClick={handleDownloadPDF} disabled={!reportData}>Download PDF</button>
//                 </div>
//               </form>
//               {/* Loading skeleton */}
//               {loading && (
//                 <div className="mt-4">
//                   <div className="skeleton-loader" style={{ height: 120, background: "#eee", borderRadius: 8 }}></div>
//                 </div>
//               )}
//               {/* Report Preview */}
//               {reportData && !showPrintModal && (
//                 <div id="printArea" ref={printAreaRef} className="mt-4">
//                   {/* PASTE FEE REPORT TEMPLATE HERE */}
//                   {/* 
//                     Replace this block with the project's exact template HTML/CSS for fee report rendering.
//                     Use filters and reportData to render metadata and report details.
//                   */}
//                   <div className="card radius-12 p-24 mb-4">
//                     <h5 className="fw-bold mb-2">{filters.reportTitle || "Fee Report"}</h5>
//                     <div className="mb-2">Academic Year: <span className="fw-semibold">{filters.academicYear}</span></div>
//                     <div className="mb-2">Department: <span className="fw-semibold">{filters.department}</span></div>
//                     <div className="mb-2">Course: <span className="fw-semibold">{filters.course}</span></div>
//                     <div className="mb-2">Report Type: <span className="fw-semibold">{filters.reportType}</span></div>
//                     <div className="mb-2">Range: <span className="fw-semibold">{filters.rangeType}</span></div>
//                     <div className="mb-2">Fee Types: <span className="fw-semibold">{filters.feeTypes.join(", ")}</span></div>
//                     <div className="mb-2">Sort By: <span className="fw-semibold">{filters.sortBy}</span></div>
//                     <div className="mb-2">Include Sections: <span className="fw-semibold">{filters.includeSections.join(", ")}</span></div>
//                     <div className="mb-2">Output Format: <span className="fw-semibold">{filters.outputFormat}</span></div>
//                   </div>
//                   {/* Summary Section */}
//                   {filters.includeSections.includes("Summary") && reportData.summary && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Summary</h6>
//                       <div>Total Students: {reportData.summary.totalStudents}</div>
//                       <div>Total Paid: {reportData.summary.totalPaid}</div>
//                       <div>Total Unpaid: {reportData.summary.totalUnpaid}</div>
//                       <div>Total Amount: ₹{reportData.summary.totalAmount}</div>
//                       <div>Total Pending: ₹{reportData.summary.totalPending}</div>
//                     </div>
//                   )}
//                   {/* Detailed List Section */}
//                   {filters.includeSections.includes("Detailed List") && reportData.details && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Detailed List</h6>
//                       <table className="table table-bordered">
//                         <thead>
//                           <tr>
//                             <th>Name</th>
//                             <th>Reg No</th>
//                             <th>Department</th>
//                             <th>Course</th>
//                             <th>Paid</th>
//                             <th>Pending</th>
//                             <th>Fee Type</th>
//                             <th>Amount</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {reportData.details.map((row, idx) => (
//                             <tr key={idx}>
//                               <td>{row.name}</td>
//                               <td>{row.regNo}</td>
//                               <td>{row.department}</td>
//                               <td>{row.course}</td>
//                               <td>{row.paid ? "Paid" : "Unpaid"}</td>
//                               <td>₹{row.pending}</td>
//                               <td>{row.feeType}</td>
//                               <td>₹{row.amount}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                   {/* Totals Section */}
//                   {filters.includeSections.includes("Totals") && reportData.summary && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Totals</h6>
//                       <div>Total Amount: ₹{reportData.summary.totalAmount}</div>
//                       <div>Total Pending: ₹{reportData.summary.totalPending}</div>
//                     </div>
//                   )}
//                   {/* Concession/Fine Details Section */}
//                   {filters.includeSections.includes("Concession/Fine Details") && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Concession / Fine Details</h6>
//                       <div>No concession/fine data in mock report.</div>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {/* Print Modal (print-friendly view) */}
//               {showPrintModal && reportData && (
//                 <div id="printArea" ref={printAreaRef} className="mt-4">
//                   {/* @media print CSS: see FeeRecipt.jsx for print styles */}
//                   {/* PASTE FEE REPORT TEMPLATE HERE (same as above) */}
//                   <div className="card radius-12 p-24 mb-4">
//                     <h5 className="fw-bold mb-2">{filters.reportTitle || "Fee Report"}</h5>
//                     <div className="mb-2">Academic Year: <span className="fw-semibold">{filters.academicYear}</span></div>
//                     <div className="mb-2">Department: <span className="fw-semibold">{filters.department}</span></div>
//                     <div className="mb-2">Course: <span className="fw-semibold">{filters.course}</span></div>
//                     <div className="mb-2">Report Type: <span className="fw-semibold">{filters.reportType}</span></div>
//                     <div className="mb-2">Range: <span className="fw-semibold">{filters.rangeType}</span></div>
//                     <div className="mb-2">Fee Types: <span className="fw-semibold">{filters.feeTypes.join(", ")}</span></div>
//                     <div className="mb-2">Sort By: <span className="fw-semibold">{filters.sortBy}</span></div>
//                     <div className="mb-2">Include Sections: <span className="fw-semibold">{filters.includeSections.join(", ")}</span></div>
//                     <div className="mb-2">Output Format: <span className="fw-semibold">{filters.outputFormat}</span></div>
//                   </div>
//                   {/* Summary Section */}
//                   {filters.includeSections.includes("Summary") && reportData.summary && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Summary</h6>
//                       <div>Total Students: {reportData.summary.totalStudents}</div>
//                       <div>Total Paid: {reportData.summary.totalPaid}</div>
//                       <div>Total Unpaid: {reportData.summary.totalUnpaid}</div>
//                       <div>Total Amount: ₹{reportData.summary.totalAmount}</div>
//                       <div>Total Pending: ₹{reportData.summary.totalPending}</div>
//                     </div>
//                   )}
//                   {/* Detailed List Section */}
//                   {filters.includeSections.includes("Detailed List") && reportData.details && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Detailed List</h6>
//                       <table className="table table-bordered">
//                         <thead>
//                           <tr>
//                             <th>Name</th>
//                             <th>Reg No</th>
//                             <th>Department</th>
//                             <th>Course</th>
//                             <th>Paid</th>
//                             <th>Pending</th>
//                             <th>Fee Type</th>
//                             <th>Amount</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {reportData.details.map((row, idx) => (
//                             <tr key={idx}>
//                               <td>{row.name}</td>
//                               <td>{row.regNo}</td>
//                               <td>{row.department}</td>
//                               <td>{row.course}</td>
//                               <td>{row.paid ? "Paid" : "Unpaid"}</td>
//                               <td>₹{row.pending}</td>
//                               <td>{row.feeType}</td>
//                               <td>₹{row.amount}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                   {/* Totals Section */}
//                   {filters.includeSections.includes("Totals") && reportData.summary && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Totals</h6>
//                       <div>Total Amount: ₹{reportData.summary.totalAmount}</div>
//                       <div>Total Pending: ₹{reportData.summary.totalPending}</div>
//                     </div>
//                   )}
//                   {/* Concession/Fine Details Section */}
//                   {filters.includeSections.includes("Concession/Fine Details") && (
//                     <div className="card radius-12 p-16 mb-3">
//                       <h6 className="fw-bold mb-2">Concession / Fine Details</h6>
//                       <div>No concession/fine data in mock report.</div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//             <Footer />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
