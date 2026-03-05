// src/pages/reports/FeeType.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import DataTable from "../../../../../../components/DataTable/DataTable";
import toast, { Toaster } from "react-hot-toast";

const filterModes = [
  { key: "feeType", label: "Fee Type Wise" },
  { key: "classWise", label: "Class Wise" },
  { key: "dateWise", label: "Date Wise" },
  { key: "individual", label: "Individual Student" },
];

const statusOptions = ["All", "Paid", "Unpaid", "Partially Paid"];
// Fee types, departments, classes and sections will be derived from API data

// --- Logo & watermark (same as FeeRecipt) ---
const LOGO_SRC = "/assets/images/GRT.png";
const WATERMARK_SRC = "/assets/images/GRT.png";

// --- helpers reused from FeeRecipt report ---
const fmtMoney = (v) => {
  const n = Number(v || 0);
  return "₹" + n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
const safe = (v) =>
  v === null || typeof v === "undefined" ? "" : String(v);

const formatDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return safe(d);
    return dt.toLocaleDateString();
  } catch {
    return safe(d);
  }
};

// --- Report HTML generator (same style as FeeRecipt) ---
const generateFeesReportHtml = (rows = [], title = "Fee Receipts Report") => {
  const cols = [
    { key: "date", label: "Date" },
    { key: "roll_no", label: "Roll / App No" },
    { key: "student_name", label: "Student Name" },
    { key: "department", label: "Department" },
    { key: "sem", label: "Sem" },
    { key: "fee_type", label: "Fee Type" },
    { key: "total_amount", label: "Total Amount" },
    { key: "pay_now", label: "This Payment" },
    { key: "paid_amount", label: "Paid (Cumulative)" },
    { key: "pending_amount", label: "Pending" },
    { key: "status", label: "Status" },
    { key: "remarks", label: "Remarks" },
  ];

  const rowsHtml = rows
    .map((r) => {
      const date = formatDate(r.date ?? r.date_of ?? "");
      const roll = safe(
        r.roll_no ?? r.rollNo ?? r.application_no ?? r.applicationNo ?? ""
      );
      const name = safe(r.student_name ?? r.studentName ?? "");
      const dept = safe(r.department ?? r.dept ?? "");
      const sem = safe(r.sem ?? "");
      const feeType = safe(r.fee_type ?? r.feeType ?? "");
      const total = fmtMoney(r.total_amount ?? r.totalAmount ?? "");
      const payNow = fmtMoney(r.pay_now ?? r.payNow ?? 0);
      const paid = fmtMoney(r.paid_amount ?? r.paidAmount ?? 0);
      const pending = fmtMoney(r.pending_amount ?? r.pendingAmount ?? 0);
      const status = safe(r.status ?? "");
      const remarks = safe(r.remarks ?? "");
      return `<tr>
        <td style="padding:8px;border:1px solid #e6e6e6">${date}</td>
        <td style="padding:8px;border:1px solid #e6e6e6">${roll}</td>
        <td style="padding:8px;border:1px solid #e6e6e6">${name}</td>
        <td style="padding:8px;border:1px solid #e6e6e6">${dept}</td>
        <td style="padding:8px;border:1px solid #e6e6e6">${sem}</td>
        <td style="padding:8px;border:1px solid #e6e6e6">${feeType}</td>
        <td style="padding:8px;border:1px solid #e6e6e6;text-align:right">${total}</td>
        <td style="padding:8px;border:1px solid #e6e6e6;text-align:right">${payNow}</td>
        <td style="padding:8px;border:1px solid #e6e6e6;text-align:right">${paid}</td>
        <td style="padding:8px;border:1px solid #e6e6e6;text-align:right">${pending}</td>
        <td style="padding:8px;border:1px solid #e6e6e6">${status}</td>
        <td style="padding:8px;border:1px solid #e6e6e6">${remarks}</td>
      </tr>`;
    })
    .join("\n");

  const headerHtml = `
    <div style="text-align:center; font-family: 'Times New Roman', Times, serif;">
      <img src="${LOGO_SRC}" style="width:110px;height:110px;object-fit:contain; display:block; margin:0 auto 6px;" />
      <div style="font-size:20px;font-weight:700;">GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
      <div style="font-size:12px;color:#1a237e;margin-top:6px;">GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631 209.</div>
      <div style="font-size:12px;color:#222;margin-top:4px;">Phone No : 044-27885997 / 98 &nbsp; E-mail : grtper@grt.edu.in</div>
    </div>
    <hr style="border:none;border-top:2px solid #222;margin:12px 0;" />
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div style="font-weight:700">${safe(title)}</div>
      <div style="font-weight:700">Generated: ${new Date().toLocaleDateString()}</div>
    </div>
  `;

  const tableHeader = `<thead><tr>${cols
    .map(
      (c) =>
        `<th style="padding:10px;border:1px solid #ddd;background:#f7f7f7;text-align:left">${c.label}</th>`
    )
    .join("")}</tr></thead>`;

  const html = `<!doctype html>
    <html><head><meta charset="utf-8"/><title>${safe(
      title
    )}</title>
    <style>
      @media print { body { -webkit-print-color-adjust: exact; } }
      body { margin:20px; color:#222; font-family: Arial, Helvetica, sans-serif; }
      .watermark { position: fixed; left:50%; top:50%; transform:translate(-50%,-50%); opacity:0.06; z-index:0; pointer-events:none; }
      table { width:100%; border-collapse:collapse; font-size:12px; }
    </style>
    </head><body>
      <img src="${WATERMARK_SRC}" class="watermark" style="width:420px;height:420px;"/>
      ${headerHtml}
      <div>${`<table>${tableHeader}<tbody>${rowsHtml}</tbody></table>`}</div>
      <script>window.onload=function(){ try{ window.focus(); }catch(e){} };</script>
    </body></html>`;

  return html;
};

const FeeType = () => {
  const [mode, setMode] = useState("feeType");
  const [status, setStatus] = useState("All");
  // dynamic lists derived from API data
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  // current selections (start empty, populate after data load)
  const [feeType, setFeeType] = useState("");
  const [department, setDepartment] = useState("");
  const [classVal, setClassVal] = useState("");
  const [section, setSection] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [dbData, setDbData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- force filter update on dropdown change (for classWise mode)
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };
  const handleClassValChange = (e) => {
    setClassVal(e.target.value);
  };
  const handleFeeTypeChange = (e) => {
    setFeeType(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    fromDate: "",
    toDate: "",
    reportType: "all",
  });
  const [reportDownloadType, setReportDownloadType] = useState("pdf"); // 'pdf' | 'csv'

  // 1. FETCH FROM BACKEND
  const fetchReceipts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fee-receipt");
      const json = await res.json();
      const data = Array.isArray(json)
        ? json
        : json.data && Array.isArray(json.data)
        ? json.data
        : [];
      setDbData(data);
      setFilteredData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load fee collection data");
      setDbData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // derive dropdown lists from fetched data
  useEffect(() => {
    if (!dbData || dbData.length === 0) return;
    const feeSet = new Set();
    const deptSet = new Set();
    const classSet = new Set();
    const sectionSet = new Set();

    dbData.forEach((r) => {
      const ft = r.fee_type ?? r.fees_type ?? r.feeType ?? "";
      if (ft) feeSet.add(String(ft));
      const dep = r.department ?? r.dept ?? "";
      if (dep) deptSet.add(String(dep));
      const sem = r.sem ?? r.semester ?? r.class ?? r.class_val ?? "";
      if (sem !== null && typeof sem !== "undefined" && String(sem) !== "") classSet.add(String(sem));
      const sec = r.section ?? "";
      if (sec) sectionSet.add(String(sec));
    });

    const feeArr = Array.from(feeSet).sort();
    const depArr = Array.from(deptSet).sort();
    const classArr = Array.from(classSet).sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
    const secArr = Array.from(sectionSet).sort();

    setFeeTypeOptions(feeArr);
    setDepartments(depArr);
    setClasses(classArr);
    setSections(secArr);

    if (!feeType && feeArr.length) setFeeType(feeArr[0]);
    if (!department && depArr.length) setDepartment(depArr[0]);
    if (!classVal && classArr.length) setClassVal(classArr[0]);
    if (!section && secArr.length) setSection(secArr[0]);
  }, [dbData]);

  // 2. FILTER LOGIC (for table view)
  useEffect(() => {
    let result = [...dbData];

    if (mode === "feeType" && feeType) {
      result = result.filter((r) => {
        const ft = r.fee_type ?? r.fees_type ?? r.feeType ?? "";
        return ft === feeType;
      });
    }

    if (mode === "classWise") {
      if (department)
        result = result.filter((r) => r.department === department);
      if (classVal) result = result.filter((r) => r.sem == classVal);
    }

    if (mode === "dateWise") {
      if (fromDate)
        result = result.filter(
          (r) => (r.date || "").slice(0, 10) >= fromDate
        );
      if (toDate)
        result = result.filter(
          (r) => (r.date || "").slice(0, 10) <= toDate
        );
    }

    // apply feeType filter across modes when a feeType is selected
    if (feeType && String(feeType).trim() !== "") {
      result = result.filter((r) => {
        const ft = r.fee_type ?? r.fees_type ?? r.feeType ?? "";
        return String(ft) === String(feeType);
      });
    }

    if (mode === "individual" && search) {
      const s = search.toLowerCase();
      result = result.filter(
        (r) =>
          (r.student_name || "").toLowerCase().includes(s) ||
          (r.roll_no && r.roll_no.toString().includes(s))
      );
    }

    if (status !== "All") {
      result = result.filter((r) => r.status === status);
    }

    setFilteredData(result);
  }, [
    mode,
    feeType,
    department,
    classVal,
    section,
    fromDate,
    toDate,
    search,
    status,
    dbData,
  ]);

  // 3. TABLE COLUMNS
  const columns = useMemo(
    () => [
      { accessorKey: "roll_no", header: "Roll No" },
      { accessorKey: "student_name", header: "Student Name" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "sem", header: "Sem/Class" },
      { accessorKey: "fee_type", header: "Fee Type" },
      {
        accessorKey: "total_amount",
        header: "Total",
        cell: ({ row }) => (
          <span>
            ₹{Number(row.original.total_amount || 0).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "paid_amount",
        header: "Paid",
        cell: ({ row }) => (
          <span className="text-success">
            ₹{Number(row.original.paid_amount || 0).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "pending_amount",
        header: "Pending",
        cell: ({ row }) => (
          <span className="text-danger">
            ₹{Number(row.original.pending_amount || 0).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: "Last Payment Date",
        cell: ({ row }) => row.original.date?.slice(0, 10),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original.status;
          const cls =
            s === "Paid"
              ? "badge bg-success"
              : s === "Partially Paid"
              ? "badge bg-warning text-dark"
              : "badge bg-danger";
          return <span className={cls}>{s}</span>;
        },
      },
    ],
    []
  );

  // 4. REPORT MODAL HANDLERS
  const handleReportFormChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadReport = useCallback(() => {
    // Use filteredData for the report, not dbData
    let filtered = filteredData || [];
    let reportTitle = "Fee Receipts";

    if (reportForm.reportType === "dateWise") {
      if (!reportForm.fromDate || !reportForm.toDate) {
        toast.error("Please select both From Date and To Date");
        return;
      }
      if (new Date(reportForm.fromDate) > new Date(reportForm.toDate)) {
        toast.error("From Date should be earlier than To Date");
        return;
      }
      const from = new Date(reportForm.fromDate);
      const to = new Date(reportForm.toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => {
        const d = new Date(
          r.date || r.created_at || r.createdAt || ""
        );
        if (!d || isNaN(d.getTime())) return false;
        return d >= from && d <= to;
      });
      reportTitle = `Fee Receipts (${reportForm.fromDate} to ${reportForm.toDate})`;
    }

    if (!filtered || filtered.length === 0) {
      toast("No receipt rows match the selected criteria", { icon: "ℹ️" });
      return;
    }

    if (reportDownloadType === "pdf") {
      try {
        const html = generateFeesReportHtml(filtered, reportTitle);
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } catch (err) {
            console.error("print err", err);
            toast.error("Print failed — check popup permissions");
          } finally {
            document.body.removeChild(iframe);
          }
        }, 600);
        toast.success("PDF print initiated (use browser Save as PDF)");
      } catch (err) {
        console.error("generate pdf error", err);
        toast.error("Failed to generate PDF");
      }
    } else {
      try {
        const headers = [
          "Date",
          "Roll/App No",
          "Student Name",
          "Department",
          "Sem",
          "Fee Type",
          "Total Amount",
          "This Payment",
          "Paid (Cumulative)",
          "Pending",
          "Status",
          "Remarks",
        ];
        const keys = [
          "date",
          "roll_no",
          "student_name",
          "department",
          "sem",
          "fee_type",
          "total_amount",
          "pay_now",
          "paid_amount",
          "pending_amount",
          "status",
          "remarks",
        ];
        const rowsCsv = [headers.join(",")];
        filtered.forEach((r) => {
          const vals = keys.map((k) => {
            let v = r[k];
            if (k === "roll_no")
              v =
                r.roll_no ??
                r.rollNo ??
                r.application_no ??
                r.applicationNo ??
                "";
            if (k === "date")
              v = r.date ?? r.createdAt ?? r.created_at ?? "";
            if (
              k === "total_amount" ||
              k === "pay_now" ||
              k === "paid_amount" ||
              k === "pending_amount"
            ) {
              v =
                r[k] !== undefined && r[k] !== null
                  ? typeof r[k] === "number"
                    ? `₹${Number(r[k]).toLocaleString()}`
                    : String(r[k])
                  : "";
            }
            if (v === null || typeof v === "undefined") return '""';
            const s = String(v).replace(/"/g, '""');
            return `"${s}"`;
          });
          rowsCsv.push(vals.join(","));
        });
        const blob = new Blob([rowsCsv.join("\n")], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportTitle
          .replace(/\s+/g, "_")
          .replace(/[()]/g, "")}_${new Date()
          .toISOString()
          .split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("CSV downloaded");
      } catch (err) {
        console.error("csv error", err);
        toast.error("Failed to generate CSV");
      }
    }

    setShowReportModal(false);
  }, [filteredData, reportForm, reportDownloadType]);

  // 5. UI
  return (
    <>
      <Toaster position="top-right" />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* PAGE HEADER – button removed from here */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-semibold mb-0">Fees Collection Report</h6>
            </div>

            {/* FILTERS */}
            <div className="btn-group mb-3">
              {filterModes.map((fm) => (
                <button
                  key={fm.key}
                  className={`btn btn-outline-primary ${
                    mode === fm.key ? "active" : ""
                  }`}
                  onClick={() => setMode(fm.key)}
                >
                  {fm.label}
                </button>
              ))}
            </div>

            {/* FILTER UI BASED ON MODE */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  {mode === "feeType" && (
                    <div className="col-md-3">
                      <label className="form-label">Fee Type</label>
                      <select
                        className="form-select"
                        value={feeType}
                        onChange={(e) => setFeeType(e.target.value)}
                      >
                        {feeTypeOptions.map((ft) => (
                          <option key={ft}>{ft}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {mode === "classWise" && (
                    <>
                      <div className="col-md-3">
                        <label className="form-label">Department</label>
                        <select
                          className="form-select"
                          value={department}
                          onChange={handleDepartmentChange}
                        >
                          {departments.map((dep) => (
                            <option key={dep}>{dep}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-2">
                        <label className="form-label">Semester</label>
                        <select
                          className="form-select"
                          value={classVal}
                          onChange={handleClassValChange}
                        >
                          {classes.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Fee Type</label>
                        <select
                          className="form-select"
                          value={feeType}
                          onChange={handleFeeTypeChange}
                        >
                          {feeTypeOptions.map((ft) => (
                            <option key={ft}>{ft}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {mode === "dateWise" && (
                    <>
                      <div className="col-md-3">
                        <label className="form-label">From Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">To Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Fee Type</label>
                        <select
                          className="form-select"
                          value={feeType}
                          onChange={handleFeeTypeChange}
                        >
                          <option value="">All</option>
                          {feeTypeOptions.map((ft) => (
                            <option key={ft} value={ft}>{ft}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

            {mode === "individual" && (
              <div className="col-md-4">
                <label className="form-label">Student/Reg No</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

            {/* TABLE SECTION */}
            <div className="card">
              {/* Download button moved here – inside DataTable card */}
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Fee Receipt Records</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowReportModal(true)}
                >
                  <i className="fas fa-file-download me-1" />
                  Download Report
                </button>
              </div>
              <div className="card-body">
                <DataTable
                  data={filteredData}
                  columns={columns}
                  pageSize={10}
                  loading={loading}
                  // if your DataTable supports it, you can pass a prop like this
                  // to hide its default CSV/PDF export buttons:
                  // hideExportButtons
                />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>

      {/* --------- Report Modal (PDF/CSV) --------- */}
      {showReportModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Download Fee Receipts Report</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReportModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Select Report Type:
                  </label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="reportType"
                        value="all"
                        checked={reportForm.reportType === "all"}
                        onChange={handleReportFormChange}
                        id="allFeesReport"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="allFeesReport"
                      >
                        All Receipts
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="reportType"
                        value="dateWise"
                        checked={reportForm.reportType === "dateWise"}
                        onChange={handleReportFormChange}
                        id="dateWiseFeesReport"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="dateWiseFeesReport"
                      >
                        Date-wise Report
                      </label>
                    </div>
                  </div>
                </div>

                {reportForm.reportType === "dateWise" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        From Date:
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        value={reportForm.fromDate}
                        onChange={handleReportFormChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        To Date:
                      </label>
                      <input
                        type="date"
                        name="toDate"
                        value={reportForm.toDate}
                        onChange={handleReportFormChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-3 mt-4">
                  <label className="form-label fw-semibold">
                    Select Download Format:
                  </label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="downloadType"
                        value="pdf"
                        checked={reportDownloadType === "pdf"}
                        onChange={() => setReportDownloadType("pdf")}
                        id="pdfFeeReport"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="pdfFeeReport"
                      >
                        PDF
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="downloadType"
                        value="csv"
                        checked={reportDownloadType === "csv"}
                        onChange={() => setReportDownloadType("csv")}
                        id="csvFeeReport"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="csvFeeReport"
                      >
                        CSV
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownloadReport}
                >
                  <i className="fas fa-file-download me-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeeType;
