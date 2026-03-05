// NOTE: Keep styles/layout identical to FeeRecipt.jsx — reuse classes or import styles from FeeRecipt.jsx
import React, { useState, useRef, useCallback } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import toast from "react-hot-toast";

// Mock data for dropdowns (keep these in-sync with project lists)
const TRANSACTION_TYPES = [
  "All",
  "Cash Receipt",
  "Cash Payment",
  "Transfer",
  "Adjustment",
];

// If later you want these, keep here (currently not used in API call)
const LEDGER_ACCOUNTS = [
  "Sales",
  "Purchase",
  "Salary",
  "Rent",
  "Interest",
  "Other",
];
const CATEGORY_OPTIONS = [
  "Salary",
  "Rent",
  "Utilities",
  "Supplies",
  "Sales",
  "Interest",
  "Grants",
  "Other",
];
const SORT_OPTIONS = ["Date", "Amount Desc", "Amount Asc", "Category"];

// Helper to format numbers with commas
const fmtMoney = (v) =>
  Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Generate printable HTML (re-usable for PDF/print)
const generateCashbookHtml = (filters, cashbookData) => {
  const logo = "/assets/images/GRT.png";
  const title = filters.reportTitle || "Cash Book Report";
  const header = `
    <div style="font-family:'Times New Roman', Times, serif; text-align:center;">
      <img src="${logo}" style="width:100px;height:100px;object-fit:contain;vertical-align:middle;margin-bottom:6px;" />
      <div style="font-size:20px;font-weight:700;">GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
      <div style="font-size:12px;color:#333;margin-top:6px;">Cash Book — ${title}</div>
      <div style="font-size:12px;color:#333;margin-top:6px;">
        Cash Book: ${filters.cashBook || "-"} | 
        Period: ${filters.dateFrom || "-"} to ${filters.dateTo || "-"}
      </div>
    </div>
    <hr style="border:none;border-top:1px solid #222;margin:10px 0;" />
  `;

  const rowsHtml = cashbookData.transactions
    .map(
      (txn) => `
    <tr>
      <td style="padding:6px;border:1px solid #ddd;">${txn.date}</td>
      <td style="padding:6px;border:1px solid #ddd;">${txn.voucherNo}</td>
      <td style="padding:6px;border:1px solid #ddd;">${txn.account}</td>
      <td style="padding:6px;border:1px solid #ddd;">${txn.description}</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:right;">${
        txn.debit ? fmtMoney(txn.debit) : ""
      }</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:right;">${
        txn.credit ? fmtMoney(txn.credit) : ""
      }</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
        txn.balance
      )}</td>
      <td style="padding:6px;border:1px solid #ddd;">${txn.remarks || ""}</td>
    </tr>
  `
    )
    .join("\n");

  const footer = `
    <tfoot>
      <tr style="font-weight:700;">
        <td colspan="4" style="padding:6px;border:1px solid #ddd;">Totals</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
          cashbookData.summary.totalReceipts
        )}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
          cashbookData.summary.totalPayments
        )}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
          cashbookData.summary.closingBalance
        )}</td>
        <td style="padding:6px;border:1px solid #ddd;"></td>
      </tr>
    </tfoot>
  `;

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; color:#222; margin:18px; }
        table { width:100%; border-collapse:collapse; font-size:12px; }
        th, td { border:1px solid #ddd; padding:6px; }
        th { background:#f5f5f5; font-weight:700; }
        @media print { body { -webkit-print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      ${header}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Voucher/Ref No</th>
            <th>Account</th>
            <th>Description</th>
            <th style="text-align:right;">Receipt (Debit)</th>
            <th style="text-align:right;">Payment (Credit)</th>
            <th style="text-align:right;">Running Balance</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        ${footer}
      </table>
      <script>window.onload=function(){ try{ window.focus(); }catch(e){} };</script>
    </body>
  </html>
  `;
};

// ---- Build cashbook from /api/fee-receipt data (OFFICE only) ----
function buildCashbookFromFeeReceipts(rawData, filters) {
  const data = Array.isArray(rawData)
    ? rawData
    : rawData?.data && Array.isArray(rawData.data)
    ? rawData.data
    : [];

  const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const to = filters.dateTo ? new Date(filters.dateTo) : null;
  if (to) to.setHours(23, 59, 59, 999);

  // Office-related fee types
  const OFFICE_FEE_TYPES = [
    "Exam Fees",
    "Book Fees",
    "Tuition",
    "Library",
    "Hostel",
    "Other Office Fee",
  ];

  // Filter rows
  const filtered = data.filter((r) => {
    // Only OFFICE cashbook uses this function
    const feeType = (r.fee_type || r.feeType || "").toString();
    if (!OFFICE_FEE_TYPES.includes(feeType)) return false;

    // Date range filter
    const rawDate =
      r.date || r.receipt_date || r.created_at || r.createdAt || "";
    if (!rawDate) return false;
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return false;
    if (from && d < from) return false;
    if (to && d > to) return false;

    // Transaction type (we only have receipts from fee-receipt)
    if (
      filters.transactionType === "Cash Payment" ||
      filters.transactionType === "Transfer" ||
      filters.transactionType === "Adjustment"
    ) {
      // No payments from fee-receipt; skip
      return false;
    }

    return true;
  });

  // Sort by date ascending
  filtered.sort((a, b) => {
    const ad = new Date(
      a.date || a.receipt_date || a.created_at || a.createdAt || ""
    ).getTime();
    const bd = new Date(
      b.date || b.receipt_date || b.created_at || b.createdAt || ""
    ).getTime();
    return ad - bd;
  });

  // Build transactions with running balance
  let runningBalance = 0;
  const transactions = filtered.map((r, idx) => {
    const date = (
      r.date ||
      r.receipt_date ||
      r.created_at ||
      r.createdAt ||
      ""
    ).slice(0, 10);
    const voucherNo = r.receipt_no || r.voucher_no || `CB${idx + 1}`;
    const account = "Office Cash";
    const description = r.fee_type || "Fee Receipt";
    const remarks = r.student_name || r.remarks || "";

    // Treat all fee-receipt records as cash receipts
    const debit = Number(r.paid_amount || r.total_amount || 0) || 0;
    const credit = 0;

    runningBalance += debit - credit;

    return {
      date,
      voucherNo,
      account,
      description,
      debit,
      credit,
      balance: runningBalance,
      remarks,
      reconciled: false,
    };
  });

  const summary = transactions.reduce(
    (acc, t) => {
      acc.totalReceipts += t.debit;
      acc.totalPayments += t.credit;
      acc.closingBalance = t.balance;
      return acc;
    },
    { totalReceipts: 0, totalPayments: 0, closingBalance: 0 }
  );

  return { summary, transactions };
}

export default function CashBook() {
  const [filters, setFilters] = useState({
    cashBook: "",
    dateFrom: "",
    dateTo: "",
    transactionType: "All",
    voucherNo: "",
    ledgerAccount: "",
    amountMin: "",
    amountMax: "",
    payeePayer: "",
    categories: [],
    includeZero: false,
    sortBy: "Date",
    outputFormat: "Preview",
    reportTitle: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cashbookData, setCashbookData] = useState(null);

  // Download modal states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState("pdf");

  const printAreaRef = useRef(null);

  const validate = () => {
    const errs = {};
    if (!filters.cashBook) errs.cashBook = "Cash Book is required.";
    if (!filters.dateFrom) errs.dateFrom = "From date is required.";
    if (!filters.dateTo) errs.dateTo = "To date is required.";
    if (
      filters.amountMin &&
      filters.amountMax &&
      Number(filters.amountMin) > Number(filters.amountMax)
    ) {
      errs.amountMax = "Max must be greater than or equal to Min.";
    }
    if (filters.dateFrom && filters.dateTo) {
      if (new Date(filters.dateFrom) > new Date(filters.dateTo))
        errs.dateTo = "To date must be same or after From date.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === "checkbox") {
      setFilters((f) => ({ ...f, [name]: checked }));
    } else if (type === "select-multiple") {
      setFilters((f) => ({
        ...f,
        [name]: Array.from(options)
          .filter((o) => o.selected)
          .map((o) => o.value),
      }));
    } else {
      setFilters((f) => ({ ...f, [name]: value }));
    }
  };

  const handleGenerate = async (e) => {
    e?.preventDefault?.();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // 👉 Only OFFICE cash book uses /api/fee-receipt as per your requirement
    if (filters.cashBook !== "Office") {
      toast.error(
        "Currently only Office Cash Book is linked with /api/fee-receipt."
      );
      setCashbookData(null);
      return;
    }

    setLoading(true);
    try {
      // Call /api/fee-receipt WITHOUT extra filters, then filter on frontend
      const res = await fetch("/api/fee-receipt");
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();

      const built = buildCashbookFromFeeReceipts(json, filters);
      if (!built.transactions.length) {
        setCashbookData(null);
        toast.error("No transactions found for given filters.");
      } else {
        setCashbookData(built);
        toast.success("Cash Book generated from fee receipts");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch report");
      setCashbookData(null);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFilters({
      cashBook: "",
      dateFrom: "",
      dateTo: "",
      transactionType: "All",
      voucherNo: "",
      ledgerAccount: "",
      amountMin: "",
      amountMax: "",
      payeePayer: "",
      categories: [],
      includeZero: false,
      sortBy: "Date",
      outputFormat: "Preview",
      reportTitle: "",
    });
    setErrors({});
    setCashbookData(null);
  };

  const handleExportCSV = useCallback(() => {
    if (!cashbookData) return toast("Generate report first");
    const headers = [
      "Date",
      "Voucher/Ref No",
      "Account",
      "Description",
      "Receipt (Debit)",
      "Payment (Credit)",
      "Running Balance",
      "Remarks",
    ];
    const rows = cashbookData.transactions.map((txn) => [
      txn.date,
      txn.voucherNo,
      txn.account,
      txn.description,
      txn.debit,
      txn.credit,
      txn.balance,
      txn.remarks,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(filters.reportTitle || "cashbook")
      .replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  }, [cashbookData, filters.reportTitle]);

  const handleShowDownloadModal = () => {
    if (!cashbookData) return toast("Generate the report first");
    setShowDownloadModal(true);
  };

  const handleDownload = useCallback(() => {
    if (!cashbookData) return toast("Generate the report first");

    if (downloadType === "pdf") {
      try {
        const html = generateCashbookHtml(filters, cashbookData);
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
            console.error(err);
            toast.error("Print failed — check popup/print permissions.");
          } finally {
            document.body.removeChild(iframe);
          }
        }, 600);
        toast.success("PDF print initiated (use browser Save as PDF)");
      } catch (err) {
        console.error(err);
        toast.error("Failed to generate PDF");
      }
    } else if (downloadType === "csv") {
      handleExportCSV();
    } else if (downloadType === "preview") {
      const html = generateCashbookHtml(filters, cashbookData);
      const w = window.open("");
      if (!w) return toast.error("Popup blocked — allow popups");
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      toast.success("Preview opened");
    }

    setShowDownloadModal(false);
  }, [cashbookData, downloadType, filters, handleExportCSV]);

  const handlePrint = () => {
    if (!cashbookData) return toast("Generate the report first");
    const html = generateCashbookHtml(filters, cashbookData);
    const w = window.open("");
    if (!w) return toast.error("Popup blocked — allow popups");
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  const handleMarkReconciled = (idx) => {
    setCashbookData((data) => {
      if (!data) return data;
      const txns = [...data.transactions];
      txns[idx] = { ...txns[idx], reconciled: !txns[idx].reconciled };
      return { ...data, transactions: txns };
    });
  };

  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Cash Book</h6>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={handleShowDownloadModal}
                title="Download / Print Report"
              >
                <i className="fas fa-file-download me-1" /> Download
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handlePrint}
              >
                <i className="fas fa-print me-1" /> Print
              </button>
            </div>
          </div>

          <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h6 className="text-lg fw-semibold mb-2">
                  Generate Cash Book Report
                </h6>
              </div>
            </div>

            <div className="card-body p-24">
              <form
                className="row g-3 align-items-end mb-3"
                onSubmit={handleGenerate}
                aria-label="Cash Book Filter Form"
              >
                <div className="col-md-3">
                  <label className="form-label fw-semibold" htmlFor="cashBook">
                    Cash Book
                  </label>
                  <select
                    id="cashBook"
                    name="cashBook"
                    className="form-select"
                    value={filters.cashBook}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.cashBook}
                  >
                    <option value="">Select</option>
                    <option value="Office">Office</option>
                    <option value="Transport">Transport</option>
                  </select>
                  {errors.cashBook && (
                    <span className="text-danger" role="alert">
                      {errors.cashBook}
                    </span>
                  )}
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold" htmlFor="dateFrom">
                    From
                  </label>
                  <input
                    id="dateFrom"
                    name="dateFrom"
                    type="date"
                    className="form-control"
                    value={filters.dateFrom}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.dateFrom}
                  />
                  {errors.dateFrom && (
                    <span className="text-danger" role="alert">
                      {errors.dateFrom}
                    </span>
                  )}
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold" htmlFor="dateTo">
                    To
                  </label>
                  <input
                    id="dateTo"
                    name="dateTo"
                    type="date"
                    className="form-control"
                    value={filters.dateTo}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.dateTo}
                  />
                  {errors.dateTo && (
                    <span className="text-danger" role="alert">
                      {errors.dateTo}
                    </span>
                  )}
                </div>

                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="transactionType"
                  >
                    Transaction Type
                  </label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    className="form-select"
                    value={filters.transactionType}
                    onChange={handleChange}
                  >
                    {TRANSACTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-12 d-flex gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </form>

              {loading && (
                <div className="skeleton-loader my-4">Loading...</div>
              )}

              {cashbookData && !loading && (
                <div
                  id="cashbookPrintArea"
                  ref={printAreaRef}
                  className="mt-4"
                >
                  <div className="card radius-12 p-3 mb-3">
                    <h6 className="fw-semibold mb-2">
                      {filters.reportTitle || "Cash Book Report"}
                    </h6>
                    <div className="mb-2 text-muted">
                      <span>Cash Book: {filters.cashBook}</span> |{" "}
                      <span>
                        Date: {filters.dateFrom} to {filters.dateTo}
                      </span>
                    </div>

                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Voucher/Ref No</th>
                          <th>Account</th>
                          <th>Description</th>
                          <th>Receipt (Debit)</th>
                          <th>Payment (Credit)</th>
                          <th>Running Balance</th>
                          <th>Remarks</th>
                          <th>Reconciled</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cashbookData.transactions.map((txn, idx) => (
                          <tr
                            key={`${txn.voucherNo}-${idx}`}
                            className={txn.reconciled ? "table-success" : ""}
                          >
                            <td>{txn.date}</td>
                            <td>{txn.voucherNo}</td>
                            <td>{txn.account}</td>
                            <td>{txn.description}</td>
                            <td>
                              {txn.debit ? fmtMoney(txn.debit) : ""}
                            </td>
                            <td>
                              {txn.credit ? fmtMoney(txn.credit) : ""}
                            </td>
                            <td>{fmtMoney(txn.balance)}</td>
                            <td>{txn.remarks}</td>
                            <td>{txn.reconciled ? "Yes" : "No"}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleMarkReconciled(idx)}
                              >
                                {txn.reconciled ? "Undo" : "Mark Reconciled"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="fw-bold">
                          <td colSpan={4}>Totals</td>
                          <td>
                            {fmtMoney(
                              cashbookData.summary.totalReceipts || 0
                            )}
                          </td>
                          <td>
                            {fmtMoney(
                              cashbookData.summary.totalPayments || 0
                            )}
                          </td>
                          <td>
                            {fmtMoney(
                              cashbookData.summary.closingBalance || 0
                            )}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Export Cash Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDownloadModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
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
                        checked={downloadType === "pdf"}
                        onChange={() => setDownloadType("pdf")}
                        id="pdfCashbook"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="pdfCashbook"
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
                        checked={downloadType === "csv"}
                        onChange={() => setDownloadType("csv")}
                        id="csvCashbook"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="csvCashbook"
                      >
                        CSV
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="downloadType"
                        value="preview"
                        checked={downloadType === "preview"}
                        onChange={() => setDownloadType("preview")}
                        id="previewCashbook"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="previewCashbook"
                      >
                        Preview Window
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDownloadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownload}
                >
                  <i className="fas fa-file-download me-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
