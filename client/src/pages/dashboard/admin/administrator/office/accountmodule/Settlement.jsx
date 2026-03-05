import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import DataTable from "../../../../../../components/DataTable";
import toast, { Toaster } from "react-hot-toast";

const EXPENSE_TYPES = [
  "Advertisement",
  "Maintenance",
  "Purchase",
  "Stationery",
  "Travel",
  "Miscellaneous",
  "Others",
];

const samplePersons = ["Senthil", "Ravi", "Department Head", "Admin", "Other"];

const INITIAL_FORM = {
  date: new Date().toISOString().slice(0, 10),
  expenseType: "",
  detail: "",
  person: "",
  amount: "",
};

const fmtMoney = (v) => {
  const n = Number(v || 0);
  return (
    "₹" +
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

const safe = (v) =>
  v === null || typeof v === "undefined" ? "" : String(v);
const formatDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return safe(d);
    return dt.toLocaleDateString("en-IN");
  } catch {
    return safe(d);
  }
};

/* ------------------------------------------------------------------
   Report HTML for PDF print (ALL / DATE-WISE) – LETTERHEAD TEMPLATE
------------------------------------------------------------------ */
const generateSettlementReportHtml = (
  rows = [],
  {
    title = "Settlement Report",
    subtitle = "",
    fromDate = "",
    toDate = "",
    generatedOn = "",
  } = {}
) => {
  const rowsHtml = rows
    .map((r, idx) => {
      const date = formatDate(r.date);
      const expenseType = safe(r.expenseType || r.expense_type);
      const detail = safe(r.detail);
      const person = safe(r.person);
      const amount = fmtMoney(r.amount);

      return `<tr>
        <td style="padding:6px;border:1px solid #000;text-align:center;">${
          idx + 1
        }</td>
        <td style="padding:6px;border:1px solid #000;">${date}</td>
        <td style="padding:6px;border:1px solid #000;">${expenseType}</td>
        <td style="padding:6px;border:1px solid #000;">${detail}</td>
        <td style="padding:6px;border:1px solid #000;">${person}</td>
        <td style="padding:6px;border:1px solid #000;text-align:right;">${amount}</td>
      </tr>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safe(title)}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { margin:0; font-family:"Times New Roman", serif; }
    table { width:100%; border-collapse:collapse; font-size:12px; }
    th, td { border:1px solid #000; padding:4px 6px; }
    th { text-align:center; }
  </style>
</head>
<body>
  <div style="padding:8px 8px 0 8px;">
    <div style="border:4px solid #b8860b; padding:8px;">
      <div style="border:2px solid #000; padding:20px; position:relative; min-height:900px;">

        <!-- Watermark -->
        <img src="/assets/images/GRT.png" alt=""
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.06;width:380px;pointer-events:none;" />

        <!-- Letterhead -->
        <div style="display:flex;align-items:center;gap:16px;">
          <img src="/assets/images/GRT.png" alt="logo"
               style="width:96px;height:96px;object-fit:contain;" />
          <div style="text-align:left;flex:1;">
            <div style="font-size:20px;font-weight:800;letter-spacing:0.6px;">
              GRT INSTITUTE OF PHARMACEUTICAL
            </div>
            <div style="font-size:20px;font-weight:800;letter-spacing:0.6px;">
              EDUCATION AND RESEARCH
            </div>
            <div style="margin-top:6px;font-size:11px;color:#0b4e80;">
              GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631 209.<br/>
              Phone No : 044-27885997 / 98 / 27885400 E-mail : grtper@grt.edu.in Website : grtper.com
            </div>
            <div style="font-size:10px;margin-top:6px;">
              Approved by Pharmacy Council of India, New Delhi and Affiliated to T.N. Dr. MGR Medical University, Chennai
            </div>
          </div>
        </div>

        <hr/>

        <!-- Meta info -->
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
          <div>
            <div><b>Report:</b> ${safe(title)}</div>
            ${
              subtitle
                ? `<div><b>Details:</b> ${safe(subtitle)}</div>`
                : ""
            }
            ${
              fromDate && toDate
                ? `<div><b>Period:</b> ${safe(
                    fromDate
                  )} to ${safe(toDate)}</div>`
                : ""
            }
          </div>
          <div style="text-align:right;">
            <div><b>Generated On:</b> ${safe(generatedOn)}</div>
          </div>
        </div>

        <!-- Heading -->
        <h4 style="text-align:center;text-decoration:underline;margin:4px 0 10px 0;">
          SETTLEMENT REPORT
        </h4>

        <!-- Table -->
        <table>
          <thead>
            <tr>
              <th style="width:40px;">S.No</th>
              <th style="width:80px;">Date</th>
              <th>Expense Type</th>
              <th>Detail</th>
              <th>Person</th>
              <th style="width:90px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- Footer / Sign -->
        <div style="margin-top:30px;font-size:11px;display:flex;justify-content:flex-end;">
          <div style="text-align:right;">
            <b>Authorized Signatory</b><br/>
            <span>GRT Institute of Pharmaceutical Education and Research</span>
          </div>
        </div>

      </div>
    </div>
  </div>

  <script>
    window.onload = function () {
      try { window.focus(); window.print(); } catch (e) {}
    };
  </script>
</body>
</html>`;
  return html;
};

/* ------------------------------------------------------------------ */

const Settlement = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null); // for API update
  const [loading, setLoading] = useState(false);

  // view table toggle
  const [showTable, setShowTable] = useState(false);

  // single report (auto show after submit) – you can keep using if needed
  const [showReport] = useState(false);
  const [reportData] = useState(null);

  // report modal state (Download Report)
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: "all", // all | dateWise
    fromDate: "",
    toDate: "",
  });
  const [reportDownloadType, setReportDownloadType] = useState("pdf"); // pdf | csv

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (
      !form.date ||
      !form.expenseType ||
      !form.detail ||
      !form.person ||
      !form.amount
    ) {
      toast.error("All fields are required.");
      return false;
    }
    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      toast.error("Amount must be a positive number.");
      return false;
    }
    return true;
  }, [form]);

  // Fetch settlements from backend
  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settlements", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        let serverMsg = `HTTP ${res.status}`;
        if (json) {
          if (json.errors && Array.isArray(json.errors)) {
            serverMsg = json.errors
              .map((e) => e.msg || JSON.stringify(e))
              .join("; ");
          } else if (json.message) {
            serverMsg = json.message;
          } else {
            serverMsg = JSON.stringify(json);
          }
        } else if (text) {
          serverMsg = text;
        }
        throw new Error(serverMsg);
      }

      let data = [];
      if (Array.isArray(json)) {
        data = json;
      } else if (json && Array.isArray(json.data)) {
        data = json.data;
      }

      setEntries(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch settlements");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      // CREATE
      if (editingIndex === null) {
        try {
          const res = await fetch("/api/settlements", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          });

          const text = await res.text();
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            json = null;
          }

          if (!res.ok) {
            let serverMsg = `HTTP ${res.status}`;
            if (json) {
              if (json.errors && Array.isArray(json.errors)) {
                serverMsg = json.errors
                  .map((e) => e.msg || JSON.stringify(e))
                  .join("; ");
              } else if (json.message) {
                serverMsg = json.message;
              } else {
                serverMsg = JSON.stringify(json);
              }
            } else if (text) {
              serverMsg = text;
            }
            throw new Error(serverMsg);
          }

          toast.success("Settlement entry submitted successfully.");
          setForm(INITIAL_FORM);
          setEditingIndex(null);
          setEditingId(null);
          fetchSettlements();
        } catch (err) {
          console.error(err);
          toast.error("Failed to submit settlement");
        }
      } else {
        // UPDATE
        if (!editingId) {
          const updatedEntries = [...entries];
          updatedEntries[editingIndex] = { ...form };
          setEntries(updatedEntries);
          setForm(INITIAL_FORM);
          setEditingIndex(null);
          setEditingId(null);
          toast.success("Settlement entry updated (local only).");
          return;
        }

        try {
          const res = await fetch(`/api/settlements/${editingId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          });

          const text = await res.text();
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            json = null;
          }

          if (!res.ok) {
            let serverMsg = `HTTP ${res.status}`;
            if (json) {
              if (json.errors && Array.isArray(json.errors)) {
                serverMsg = json.errors
                  .map((e) => e.msg || JSON.stringify(e))
                  .join("; ");
              } else if (json.message) {
                serverMsg = json.message;
              } else {
                serverMsg = JSON.stringify(json);
              }
            } else if (text) {
              serverMsg = text;
            }
            throw new Error(serverMsg);
          }

          toast.success("Settlement entry updated successfully.");
          setForm(INITIAL_FORM);
          setEditingIndex(null);
          setEditingId(null);
          fetchSettlements();
        } catch (err) {
          console.error(err);
          toast.error("Failed to update settlement");
        }
      }
    },
    [form, editingIndex, editingId, entries, validateForm, fetchSettlements]
  );

  const handleEdit = useCallback((row, idx) => {
    setForm({
      date: row.date
        ? row.date.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      expenseType: row.expenseType || row.expense_type || "",
      detail: row.detail || "",
      person: row.person || "",
      amount: row.amount?.toString() || "",
    });
    setEditingIndex(idx);
    setEditingId(row._id || row.id || null);
  }, []);

  // ----------------- Download report handlers -----------------------------
  const handleReportFormChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadReport = useCallback(() => {
    let filtered = entries || [];
    let reportTitle = "All Settlements";
    let fromDate = "";
    let toDate = "";

    if (reportForm.reportType === "dateWise") {
      if (!reportForm.fromDate || !reportForm.toDate) {
        toast.error("Please select both From Date and To Date");
        return;
      }
      const from = new Date(reportForm.fromDate);
      const to = new Date(reportForm.toDate);
      if (from > to) {
        toast.error("From Date should be earlier than To Date");
        return;
      }
      to.setHours(23, 59, 59, 999);

      filtered = filtered.filter((r) => {
        const d = new Date(r.date || "");
        if (!d || isNaN(d.getTime())) return false;
        return d >= from && d <= to;
      });
      reportTitle = "Date-wise Settlements";
      fromDate = reportForm.fromDate;
      toDate = reportForm.toDate;
    }

    if (!filtered || filtered.length === 0) {
      toast("No settlement rows match the selected criteria", { icon: "ℹ️" });
      return;
    }

    const generatedOn = new Date().toLocaleDateString("en-IN");

    if (reportDownloadType === "pdf") {
      try {
        const html = generateSettlementReportHtml(filtered, {
          title: reportTitle,
          subtitle:
            reportForm.reportType === "all"
              ? "All settlement entries"
              : "",
          fromDate,
          toDate,
          generatedOn,
        });

        const win = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
      } catch (err) {
        console.error("generate pdf error", err);
        toast.error("Failed to generate PDF");
      }
    } else {
      // CSV
      try {
        const headers = ["Date", "Expense Type", "Detail", "Person", "Amount"];
        const rowsCsv = [headers.join(",")];
        filtered.forEach((r) => {
          const vals = [
            formatDate(r.date),
            safe(r.expenseType || r.expense_type),
            safe(r.detail),
            safe(r.person),
            safe(r.amount),
          ].map((v) => {
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
          .toLowerCase()}_${new Date().toISOString().split("T")[0]}.csv`;
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
  }, [entries, reportForm, reportDownloadType]);

  // ----------------- Table columns ----------------------------------------
  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="fw-medium">
          {row.original.date
            ? new Date(row.original.date).toLocaleDateString("en-IN")
            : ""}
        </div>
      ),
    },
    { accessorKey: "expenseType", header: "Expense Type" },
    { accessorKey: "detail", header: "Detail" },
    { accessorKey: "person", header: "Person" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="fw-medium text-success">
          {fmtMoney(row.original.amount || 0)}
        </div>
      ),
    },
    {
      accessorKey: "actions_settlement",
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => handleEdit(row.original, row.index)}
        >
          <i className="fa fa-edit me-1"></i>Edit
        </button>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Settlement Entry</h6>
              
            </div>

            <div className="card h-100 p-0 radius-12 mb-4">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">
                    {editingIndex !== null
                      ? "Edit Settlement Entry"
                      : "Add Settlement Entry"}
                  </h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to record an expense settlement
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    showTable ? "btn-success" : "btn-outline-info"
                  }`}
                  onClick={() => setShowTable((prev) => !prev)}
                  title={
                    showTable ? "Hide Settlement Table" : "View Settlements"
                  }
                >
                  <i
                    className={`fas ${
                      showTable ? "fa-eye-slash" : "fa-table"
                    } me-1`}
                  ></i>
                  {showTable ? "Hide Settlement" : "View Settlement"}
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowReportModal(true)}
                  title="Download Settlement Report"
                >
                  <i className="fas fa-file-download me-1" />
                  Download Report
                </button>
              </div>
              </div>
              <div className="card-body p-24">
                <form
                  onSubmit={handleSubmit}
                  className="row g-2 align-items-end"
                >
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="form-control radius-8"
                      required
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">
                      Expense Type
                    </label>
                    <select
                      name="expenseType"
                      value={form.expenseType}
                      onChange={handleChange}
                      className="form-select radius-8"
                      required
                    >
                      <option value="">Select Type</option>
                      {EXPENSE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">
                      Detail / Description
                    </label>
                    <input
                      type="text"
                      name="detail"
                      value={form.detail}
                      onChange={handleChange}
                      className="form-control radius-8"
                      required
                      placeholder="Reason for expense"
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">Person</label>
                    <select
                      name="person"
                      value={form.person}
                      onChange={handleChange}
                      className="form-select radius-8"
                      required
                    >
                      <option value="">Select Person</option>
                      {samplePersons.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      className="form-control radius-8"
                      min="1"
                      required
                      placeholder="Amount"
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="submit"
                      className="btn btn-outline-primary px-32 w-10"
                      title={
                        editingIndex !== null
                          ? "Update settlement"
                          : "Submit settlement"
                      }
                      disabled={loading}
                    >
                      <i className="fas fa-save me-2"></i>
                      {editingIndex !== null ? "UPDATE" : "SUBMIT"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Settlement table */}
            {showTable && (
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">Settlement Entries</h6>
                </div>
                <div className="card-body">
                  <DataTable
                    data={entries}
                    columns={columns}
                    title="Settlement Entries"
                    enableSelection={false}
                    pageSize={10}
                    loading={loading}
                  />
                </div>
              </div>
            )}
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
                <h5 className="modal-title">Download Settlement Report</h5>
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
                        id="settAll"
                        checked={reportForm.reportType === "all"}
                        onChange={handleReportFormChange}
                      />
                      <label className="form-check-label" htmlFor="settAll">
                        All Settlements
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="reportType"
                        value="dateWise"
                        id="settDateWise"
                        checked={reportForm.reportType === "dateWise"}
                        onChange={handleReportFormChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="settDateWise"
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
                        id="settPdf"
                        checked={reportDownloadType === "pdf"}
                        onChange={() => setReportDownloadType("pdf")}
                      />
                      <label className="form-check-label" htmlFor="settPdf">
                        PDF (Letterhead)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="downloadType"
                        value="csv"
                        id="settCsv"
                        checked={reportDownloadType === "csv"}
                        onChange={() => setReportDownloadType("csv")}
                      />
                      <label className="form-check-label" htmlFor="settCsv">
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

export default Settlement;
