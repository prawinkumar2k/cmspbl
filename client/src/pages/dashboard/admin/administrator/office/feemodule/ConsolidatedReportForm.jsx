// src/pages/reports/ConsolidatedReportForm.jsx
import React, { useState, useCallback, useRef } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";

export default function ConsolidatedReportForm() {
  const [rollNo, setRollNo] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [department, setDepartment] = useState("");
  const [feeType, setFeeType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportTitle, setReportTitle] = useState(
    "Student Fee Consolidated Report"
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [message, setMessage] = useState("");
  const previewRef = useRef(null);
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);
  // Fetch student info (tries API then falls back to mock)
  const fetchStudentInfo = async (roll) => {
    const trimmed = String(roll || "").trim();
    if (!trimmed) return null;
    try {
      const q = new URLSearchParams({ rollNo: trimmed, registerNumber: trimmed }).toString();
      const res = await fetch(`/api/studentMaster?${q}`);
      if (res && res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : json.data && Array.isArray(json.data) ? json.data : [];
        if (data && data.length) {
          const s = data[0];
          return {
            rollNo: s.rollNo || s.register_no || s.registerNumber || trimmed,
            department: s.department || s.dept || s.Dept_Name || "",
            academicYear: s.academic || s.academicYear || s.Academic_Year || "",
            studentName: s.student_name || s.Student_Name || "",
            sem: s.sem || s.semester || s.Semester || "",
            raw: s,
          };
        }
      }
    } catch (err) {
      console.warn("/api/studentMaster fetch failed", err);
    }
    return null;
  };

  // Fetch fee receipts for a student (API with fallback to mock)
  const fetchStudentReceipts = useCallback(
    async ({ rollNo, academicYear, department, feeType, fromDate, toDate }) => {
      const trimmed = String(rollNo || "").trim();
      if (!trimmed) return [];
      try {
        const params = { rollNo: trimmed };
        if (feeType) params.feeType = feeType;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;
        const q = new URLSearchParams(params).toString();
        const res = await fetch(`/api/fee-receipt?${q}`);
        if (res && res.ok) {
          const json = await res.json();
          return Array.isArray(json) ? json : json.data && Array.isArray(json.data) ? json.data : [];
        }
      } catch (err) {
        console.warn("/api/fee-receipt fetch failed", err);
      }
      return [];
    },
    []
  );

  // Build and set reportData from student info + rows
  const buildAndSetReport = (roll, info, rows) => {
    const tableRows = (rows || []).map((r) => ({
      date: (r.date || r.created_at || "").slice(0, 10),
      fee_type: r.fee_type || r.feestype || r.Fees_Type || "",
      total_amount: Number(r.total_amount || r.totalAmount || r.Amount || 0),
      pay_now: Number(r.pay_now || r.payNow || 0),
      paid_amount: Number(r.paid_amount || r.paidAmount || 0),
      pending_amount: Number(r.pending_amount || r.pendingAmount || 0),
      status: r.status || "",
      remarks: r.remarks || r.Remarks || "",
      receipt_no: r.receipt_no || r.receiptNo || r.receiptNo || "",
      payment_mode: r.payment_mode || r.paymentMode || r.mode || "",
      transaction_id: r.transaction_id || r.txn_id || r.transactionId || "",
    }));

    const totals = tableRows.reduce(
      (acc, rr) => {
        acc.expected += Number(rr.total_amount || 0);
        acc.collected += Number(rr.pay_now || rr.paid_amount || 0);
        acc.pending += Number(rr.pending_amount || 0);
        return acc;
      },
      { expected: 0, collected: 0, pending: 0 }
    );

    const generatedAt = new Date().toLocaleString();
    // derive fee type options from rows (unique sorted)
    const feeSet = new Set(tableRows.map((t) => (t.fee_type || "").trim()).filter(Boolean));
    const feeArr = Array.from(feeSet).sort();
    setFeeTypeOptions(feeArr);
    // if no feeType selected yet, default to first student's fee type
    if ((!feeType || feeType === "") && feeArr.length) {
      setFeeType(feeArr[0]);
    }

    setReportData({
      rollNo: roll,
      studentName: info?.studentName || info?.Student_Name || "",
      department: info?.department || "",
      sem: info?.sem || info?.Sem || "",
      academic: info?.academicYear || "",
      reportTitle: reportTitle || "Student Fee Consolidated Report",
      generatedAt,
      filters: { academicYear, department, feeType, fromDate, toDate },
      rows: tableRows,
      totals,
    });
    setShowSkeleton(false);
    setLoading(false);
  };
    // end buildAndSetReport

  // --- Auto-fill department and academic year on rollNo blur ---
  const handleRollNoBlur = async () => {
    const trimmedRoll = rollNo.trim();
    if (!trimmedRoll) return;
    setLoading(true);
    setShowSkeleton(true);
    const info = await fetchStudentInfo(trimmedRoll);
    if (info) {
      setDepartment(info.department);
      setAcademicYear(info.academicYear);
    }

    // fetch receipts and auto-build report preview
    const rows = await fetchStudentReceipts({ rollNo: trimmedRoll, feeType: feeType.trim(), fromDate, toDate });
    if (rows && rows.length) {
      buildAndSetReport(trimmedRoll, info, rows);
      setMessage("");
      setTimeout(() => {
        if (previewRef.current) previewRef.current.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      setReportData(null);
      setMessage("No fee records found for this student.");
      setShowSkeleton(false);
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setMessage("");
    setReportData(null);

    const trimmedRoll = rollNo.trim();
    const trimmedTitle = reportTitle.trim();

    const newErrors = {};
    if (!trimmedRoll) newErrors.rollNo = "Roll number is required";
    if (!trimmedTitle) newErrors.reportTitle = "Report title is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      setShowSkeleton(true);

      // Try to get student info for name, sem, etc.
      const info = await fetchStudentInfo(trimmedRoll);

      const rows = await fetchStudentReceipts({
        rollNo: trimmedRoll,
        academicYear: academicYear.trim(),
        department: department.trim(),
        feeType: feeType.trim(),
        fromDate,
        toDate,
      });

      if (!rows.length) {
        setMessage("No fee records found for the given filters.");
        setReportData(null);
        return;
      }

      const first = rows[0];

      const tableRows = rows.map((r) => ({
        date: (r.date || r.created_at || "").slice(0, 10),
        fee_type: r.fee_type || "",
        total_amount: Number(r.total_amount || 0),
        pay_now: Number(r.pay_now || 0),
        paid_amount: Number(r.paid_amount || 0),
        pending_amount: Number(r.pending_amount || 0),
        status: r.status || "",
        remarks: r.remarks || "",
        receipt_no: r.receipt_no || r.receiptNo || "",
        payment_mode: r.payment_mode || r.mode || "",
        transaction_id: r.transaction_id || r.txn_id || "",
      }));

      const totals = tableRows.reduce(
        (acc, r) => {
          acc.expected += r.total_amount;
          acc.collected += r.paid_amount;
          acc.pending += r.pending_amount;
          return acc;
        },
        { expected: 0, collected: 0, pending: 0 }
      );

      setReportData({
        generatedAt: new Date().toLocaleString(),
        rollNo: info?.rollNo || first.roll_no || trimmedRoll,
        studentName: info?.studentName || first.student_name || first.name || "",
        department: info?.department || department || first.department || first.dept || "",
        sem: info?.sem || first.sem || first.semester || "",
        academic: info?.academicYear || academicYear || first.academic || first.academic_year || "",
        rows: tableRows,
        totals,
        filters: {
          fromDate,
          toDate,
          feeType,
          department: info?.department || department || first.department || first.dept || "",
          academicYear:
            info?.academicYear || academicYear || first.academic || first.academic_year || "",
        },
        reportTitle: trimmedTitle,
      });

      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!reportData || !reportData.rows.length) return;

    const header = [
      "Date",
      "Receipt No",
      "Fee Type",
      "Total Amount",
      "This Payment",
      "Paid Amount",
      "Pending Amount",
      "Status",
      "Payment Mode",
      "Transaction ID",
      "Remarks",
    ];

    const rows = reportData.rows.map((r) => [
      r.date,
      r.receipt_no,
      r.fee_type,
      r.total_amount,
      r.pay_now,
      r.paid_amount,
      r.pending_amount,
      r.status,
      r.payment_mode,
      r.transaction_id,
      r.remarks,
    ]);

    const csvLines = [header.join(","), ...rows.map((row) => row.join(","))];

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_fee_consolidated_${reportData.rollNo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PRINT using Bonafide-style template (print only the preview)
  const handlePrint = () => {
    const el = document.getElementById("fee-consolidated-preview");
    if (!el) return;

    const content = el.innerHTML;
    const style = `
      @page { size: A4; margin: 15mm; }
      body { font-family: "Times New Roman", serif; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #333; padding: 4px 6px; }
    `;

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head><title>Student Fee Consolidated Report</title><style>${style}</style></head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.onload = () => win.print();
  };

  const handleDownloadPDF = () => {
    alert("PDF export: Integrate html2pdf or custom print-to-PDF here.");
  };

  const fmtMoney = (n) =>
    "₹" +
    Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

  const currentYear = new Date().getFullYear();
  const refNo = reportData
    ? `FEE/${reportData.rollNo || "STU"}/${currentYear}`
    : "";

  return (
    <>
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Consolidated Report</h6>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">
                    Generate Consolidated Fee Report
                  </h6>
                </div>
              </div>

              <div className="card-body p-24">
                {/* FILTER FORM */}
                <form
                  className="row g-3 align-items-end mb-3"
                  onSubmit={handleGenerate}
                >
                  {/* Roll No */}
                  <div className="col-md-3 position-relative">
                    <label className="form-label fw-semibold">
                      Student Roll No *
                    </label>
                    <input
                      type="text"
                      name="rollNo"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      onBlur={handleRollNoBlur}
                      className={`form-control${
                        errors.rollNo ? " is-invalid" : ""
                      }`}
                      placeholder="Enter Roll Number"
                    />
                    {errors.rollNo && (
                      <div
                        className="invalid-feedback"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "100%",
                          marginTop: 2,
                        }}
                      >
                        {errors.rollNo}
                      </div>
                    )}
                  </div>

                  {/* Academic Year */}
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="form-control"
                      placeholder="2024-2025"
                    />
                  </div>

                  {/* Department */}
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={!!reportData}
                    >
                      <option value="">All</option>
                      <option value="B.Pharm">B.Pharm</option>
                      <option value="D.Pharm">D.Pharm</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MBA">MBA</option>
                    </select>
                  </div>

                  {/* Fee Type */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Fee Type</label>
                    {feeTypeOptions && feeTypeOptions.length > 0 ? (
                      <select
                        className="form-select"
                        value={feeType}
                        onChange={(e) => setFeeType(e.target.value)}
                      >
                        <option value="">All</option>
                        {feeTypeOptions.map((ft) => (
                          <option key={ft} value={ft}>
                            {ft}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={feeType}
                        onChange={(e) => setFeeType(e.target.value)}
                        className="form-control"
                        placeholder="Tuition / Transport / Hostel"
                      />
                    )}
                  </div>

                 

                  {/* Report Title */}
                  <div className="col-md-4 position-relative">
                    <label className="form-label fw-semibold">
                      Report Title *
                    </label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className={`form-control${
                        errors.reportTitle ? " is-invalid" : ""
                      }`}
                      placeholder="Student Fee Consolidated Report"
                    />
                    {errors.reportTitle && (
                      <div
                        className="invalid-feedback"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "100%",
                          marginTop: 2,
                        }}
                      >
                        {errors.reportTitle}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="col-md-3 d-flex gap-2 align-items-end">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      <i className="fas fa-file-alt me-2"></i>
                      {loading ? "Loading..." : "Generate Report"}
                    </button>
                  </div>
                </form>

                {message && (
                  <div className="alert alert-info py-2 px-3 my-2">
                    {message}
                  </div>
                )}

                {/* Skeleton loader */}
                {showSkeleton && (
                  <div className="my-4">
                    <div
                      className="skeleton-loader"
                      style={{
                        height: 120,
                        background: "#eee",
                        borderRadius: 8,
                      }}
                    ></div>
                  </div>
                )}

                {/* REPORT PREVIEW - Bonafide-style template */}
                {reportData && (
                  <div className="mt-4" ref={previewRef}>
                    {/* Top action buttons */}
                    <div className="d-flex justify-content-end gap-2 mb-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleExportCSV}
                      >
                        <i className="fas fa-file-csv me-1"></i>
                        Export CSV
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handlePrint}
                      >
                        <i className="fas fa-print me-1"></i>
                        Printable View
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={handleDownloadPDF}
                      >
                        <i className="fas fa-file-pdf me-1"></i>
                        Download PDF
                      </button>
                    </div>

                    {/* Printable / Report layout */}
                    <div
                      id="fee-consolidated-preview"
                      className="card p-4"
                      style={{ background: "#fff" }}
                    >
                      <div
                       
                      >
                        <div
                          style={{
                            border: "2px solid #000",
                            padding: 20,
                            position: "relative",
                          }}
                        >
                          

                          {/* Letterhead (same style as Bonafide) */}
                          <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
                        <div style={{ width: 140, minWidth: 140, textAlign: "center" }}>
                          <img
                            src="/assets/images/Kalam.jpg"
                            alt="logo"
                            style={{ width: 110, height: 110, objectFit: "contain" }}
                          />
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: 1, color: "#222" }}>
                           Dr.KALAM POLYTECHNIC & PHARMACY COLLEGE
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: "#222" }}>
                            Periyanayagipuramn - Avanam - Thanjavur -614 623 

                          </div>
                          <div style={{ fontSize: 13, color: "#222" }}>
                           www.drkalaminstitutions.com - +91 63840 44100

                          </div>
                         
                        </div>
                        <div style={{ width: 140, minWidth: 140, textAlign: "center" }}>
                          <img
                            src="/assets/images/Kalam1.png"
                            alt="logo-right"
                            style={{ width: 110, height: 110, objectFit: "contain" }}
                          />
                        </div>
                      </div>
                          <hr />

                          {/* Ref + Date */}
                          <div className="d-flex justify-content-between fw-bold mb-3">
                            <span>Ref No: {refNo}</span>
                            <span>{reportData.generatedAt}</span>
                          </div>

                          {/* Report Title */}
                          <h5 className="text-center text-decoration-underline mb-3">
                            {reportData.reportTitle}
                          </h5>

                          {/* Intro text (like body in Bonafide) */}
                          <p
                            style={{
                              textIndent: 40,
                              textAlign: "justify",
                              fontSize: 15,
                            }}
                          >
                            This is a consolidated statement of fee
                            receipts for{" "}
                            <b>
                              {reportData.studentName || "__________"}
                            </b>{" "}
                            (Roll No:{" "}
                            <b>
                              {reportData.rollNo || "__________"}
                            </b>
                            ), studying in{" "}
                            <b>
                              {reportData.department || "__________"}
                            </b>
                            , Semester{" "}
                            <b>{reportData.sem || "__________"}</b> for
                            the academic year{" "}
                            <b>
                              {reportData.academic ||
                                reportData.filters.academicYear ||
                                "__________"}
                            </b>
                            .
                          </p>

                          {/* Filter Summary */}
                          <div className="mb-3 p-3 border rounded small">
                            <div className="row g-2">
                              <div className="col-md-3">
                                <strong>Academic Year:</strong>{" "}
                                {reportData.filters.academicYear || "-"}
                              </div>
                              <div className="col-md-3">
                                <strong>Department:</strong>{" "}
                                {reportData.filters.department || "-"}
                              </div>
                              <div className="col-md-3">
                                <strong>Fee Type:</strong>{" "}
                                {reportData.filters.feeType || "All"}
                              </div>
                              <div className="col-md-3">
                                <strong>Date Range:</strong>{" "}
                                {reportData.filters.fromDate || "-"}{" "}
                                {reportData.filters.fromDate ||
                                reportData.filters.toDate
                                  ? "to"
                                  : ""}{" "}
                                {reportData.filters.toDate || "-"}
                              </div>
                            </div>
                          </div>

                          {/* Student Header Info */}
                          <div className="mb-3 p-3 border rounded">
                            <div className="row g-2">
                              <div className="col-md-4">
                                <strong>Roll No:</strong>{" "}
                                {reportData.rollNo}
                              </div>
                              <div className="col-md-4">
                                <strong>Student Name:</strong>{" "}
                                {reportData.studentName || "-"}
                              </div>
                              <div className="col-md-4">
                                <strong>Department:</strong>{" "}
                                {reportData.department || "-"}
                              </div>
                              <div className="col-md-4">
                                <strong>Semester:</strong>{" "}
                                {reportData.sem || "-"}
                              </div>
                              <div className="col-md-4">
                                <strong>Academic Year:</strong>{" "}
                                {reportData.academic || "-"}
                              </div>
                            </div>
                          </div>

                          {/* Summary Totals */}
                          <div
                            className="mb-3 p-3 border rounded"
                            style={{ background: "#fafafa" }}
                          >
                            <div className="d-flex gap-4 flex-wrap">
                              <div>
                                <div className="text-muted small">
                                  Total Expected
                                </div>
                                <div className="fw-semibold">
                                  {fmtMoney(
                                    reportData.totals.expected
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted small">
                                  Total Collected
                                </div>
                                <div className="fw-semibold">
                                  {fmtMoney(
                                    reportData.totals.collected
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted small">
                                  Total Pending
                                </div>
                                <div className="fw-semibold">
                                  {fmtMoney(
                                    reportData.totals.pending
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted small">
                                  Net Collection %
                                </div>
                                <div className="fw-semibold">
                                  {reportData.totals.expected
                                    ? (
                                        (reportData.totals.collected /
                                          reportData.totals
                                            .expected) *
                                        100
                                      ).toFixed(2) + "%"
                                    : "0.00%"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Detail Table */}
                          <table className="table table-bordered table-striped mt-3">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Receipt No</th>
                                <th>Fee Type</th>
                                <th>Total Amount</th>
                                <th>This Payment</th>
                                <th>Paid Amount</th>
                                <th>Pending Amount</th>
                                <th>Status</th>
                                <th>Payment Mode</th>
                                <th>Transaction ID</th>
                                <th>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.rows.map((row, idx) => (
                                <tr key={idx}>
                                  <td>{row.date}</td>
                                  <td>{row.receipt_no}</td>
                                  <td>{row.fee_type}</td>
                                  <td>
                                    {fmtMoney(row.total_amount)}
                                  </td>
                                  <td>
                                    {fmtMoney(row.pay_now)}
                                  </td>
                                  <td>
                                    {fmtMoney(row.paid_amount)}
                                  </td>
                                  <td>
                                    {fmtMoney(row.pending_amount)}
                                  </td>
                                  <td>{row.status}</td>
                                  <td>{row.payment_mode}</td>
                                  <td>{row.transaction_id}</td>
                                  <td>{row.remarks}</td>
                                </tr>
                              ))}
                              {!reportData.rows.length && (
                                <tr>
                                  <td
                                    colSpan={11}
                                    className="text-center"
                                  >
                                    No fee records found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                            {reportData.rows.length > 0 && (
                              <tfoot>
                                <tr className="fw-semibold">
                                  <td
                                    colSpan={3}
                                    className="text-end"
                                  >
                                    Grand Total:
                                  </td>
                                  <td>
                                    {fmtMoney(
                                      reportData.totals.expected
                                    )}
                                  </td>
                                  <td></td>
                                  <td>
                                    {fmtMoney(
                                      reportData.totals.collected
                                    )}
                                  </td>
                                  <td>
                                    {fmtMoney(
                                      reportData.totals.pending
                                    )}
                                  </td>
                                  <td colSpan={4}></td>
                                </tr>
                              </tfoot>
                            )}
                          </table>

                          {/* Signature (like Bonafide) */}
                          <div
                            style={{
                              marginTop: 40,
                              textAlign: "right",
                              fontWeight: 700,
                            }}
                          >
                            PRINCIPAL
                            <br />
                            <span style={{ fontSize: 12 }}>
                              GRT INSTITUTE OF PHARMACEUTICAL
                              EDUCATION AND RESEARCH
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}
