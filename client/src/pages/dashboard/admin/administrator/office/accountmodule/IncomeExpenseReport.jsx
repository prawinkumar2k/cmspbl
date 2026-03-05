import React, { useState, useRef, useCallback } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import toast from "react-hot-toast";

// ---------- MASTER DATA ----------

// Academic years (adjust to your real list)
const ACADEMIC_YEARS = ["2023-24", "2024-25", "2025-26"];

// Departments
const DEPARTMENTS = [
  "Science",
  "Commerce",
  "Arts",
  "Engineering",
  "Pharmacy",
  "Management",
];

// Category options (for income/expense)
const CATEGORIES = ["All", "INCOME", "EXPENSE"];

// Heads / Accounts used in main filter
const HEADS = ["Tuition", "Transport", "Salary", "Stock", "Purchase", "Assets"];

// Heads only for income drilldown (from /api/fee-receipt)
const INCOME_HEADS = ["Tuition", "Transport", "Salary"];

// Heads only for expense drilldown (from /api/stocks|purchases|assets)
const EXPENSE_HEADS = ["All", "Stock", "Purchase", "Assets"];

// Fee types used for /api/fee-receipt (adjust to your real fee types)
const FEE_TYPES = ["Tuition", "Library", "Transport", "Hostel", "Exam Fees"];

// ---------- HELPERS ----------

const fmtMoney = (v) =>
  "₹" +
  Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Generate printable HTML for Income & Expense report
 */
const generateIncomeExpenseReportHtml = (filters, reportData) => {
  const logo = "/assets/images/GRT.png";
  const title = filters.reportTitle || "Income & Expense Report";
  const periodText =
    filters.fromDate || filters.toDate
      ? `${filters.fromDate || "-"} to ${filters.toDate || "-"}`
      : "-";

  const header = `
    <div style="font-family:'Times New Roman', Times, serif; text-align:center;">
      <img src="${logo}" style="width:100px;height:100px;object-fit:contain;vertical-align:middle;margin-bottom:6px;" />
      <div style="font-size:20px;font-weight:700;">GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
      <div style="font-size:14px;font-weight:600;margin-top:4px;">${title}</div>
      <div style="font-size:12px;color:#333;margin-top:6px;">
        Academic Year: ${filters.academicYear || "-"} |
        Department: ${filters.department || "All"} |
        Category: ${filters.category === "All" ? "All" : filters.category || "All"} |
        Head/Account: ${filters.head || "All"}
      </div>
      <div style="font-size:12px;color:#333;margin-top:4px;">
        Period: ${periodText}
      </div>
    </div>
    <hr style="border:none;border-top:1px solid #222;margin:10px 0;" />
  `;

  const rowsHtml = reportData.rows
    .map(
      (row) => `
      <tr>
        <td style="padding:6px;border:1px solid #ddd;">${row.date}</td>
        <td style="padding:6px;border:1px solid #ddd;">${row.voucher_no}</td>
        <td style="padding:6px;border:1px solid #ddd;">${row.head}</td>
        <td style="padding:6px;border:1px solid #ddd;">${row.category}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
          row.income_amount
        )}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
          row.expense_amount
        )}</td>
        <td style="padding:6px;border:1px solid #ddd;">${row.department}</td>
        <td style="padding:6px;border:1px solid #ddd;">${row.mode}</td>
        <td style="padding:6px;border:1px solid #ddd;">${row.remarks}</td>
      </tr>
    `
    )
    .join("\n");

  const footer = `
    <tfoot>
      <tr style="font-weight:700;">
        <td colspan="4" style="padding:6px;border:1px solid #ddd;">Totals</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
          reportData.totals.income
        )}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">${fmtMoney(
          reportData.totals.expense
        )}</td>
        <td colspan="3" style="padding:6px;border:1px solid #ddd;text-align:right;">
          Net: ${fmtMoney(reportData.totals.net)}
        </td>
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
        .summary { display:flex; gap:12px; margin-bottom:12px; }
        .summary .card { padding:8px; border:1px solid #ddd; border-radius:6px; min-width:150px; text-align:center; }
        @media print { body { -webkit-print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      ${header}
      <div class="summary">
        <div class="card">
          <div style="font-size:11px;color:#666">Total Records</div>
          <div style="font-weight:700;font-size:14px;">${reportData.rows.length}</div>
        </div>
        <div class="card">
          <div style="font-size:11px;color:#666">Total Income</div>
          <div style="font-weight:700;font-size:14px;">${fmtMoney(
            reportData.totals.income
          )}</div>
        </div>
        <div class="card">
          <div style="font-size:11px;color:#666">Total Expense</div>
          <div style="font-weight:700;font-size:14px;">${fmtMoney(
            reportData.totals.expense
          )}</div>
        </div>
        <div class="card">
          <div style="font-size:11px;color:#666">Net (Income - Expense)</div>
          <div style="font-weight:700;font-size:14px;">${fmtMoney(
            reportData.totals.net
          )}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Voucher No / Receipt No</th>
            <th>Head / Account</th>
            <th>Category</th>
            <th style="text-align:right;">Income Amount</th>
            <th style="text-align:right;">Expense Amount</th>
            <th>Department</th>
            <th>Payment Mode</th>
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

// ---------- COMPONENT ----------

export default function IncomeExpenseReport() {
  // Filter state
  const [filters, setFilters] = useState({
    academicYear: "",
    department: "",
    category: "All", // All / INCOME / EXPENSE
    head: "",
    fromDate: "",
    toDate: "",
    reportTitle: "Income & Expense Report",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [message, setMessage] = useState("");

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState("pdf");
  const printAreaRef = useRef(null);

  // ---- Income drill-down state (from /api/fee-receipt) ----
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [feeDetailLoading, setFeeDetailLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);
  const [feeFilters, setFeeFilters] = useState({
    head: "Tuition",
    feeType: "",
  });

  // ---- Expense drill-down state (from /api/stocks|purchases|assets) ----
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [expenseDetailLoading, setExpenseDetailLoading] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [expenseFilters, setExpenseFilters] = useState({
    head: "All", // All / Stock / Purchase / Assets
  });

  // ---------- Validation ----------
  const validate = () => {
    const errs = {};
    if (!filters.fromDate) errs.fromDate = "From date is required";
    if (!filters.toDate) errs.toDate = "To date is required";
    if (!filters.reportTitle?.trim())
      errs.reportTitle = "Report title is required";

    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      if (from > to) errs.toDate = "To date must be same or after From date.";
    }
    return errs;
  };

  // ---------- API / Data Logic ----------

  /**
   * MAIN REPORT:
   * Build Income rows from /api/fee-receipt
   * + Expense rows from /api/stocks, /api/purchases, /api/assets
   * and combine into one income-expense report.
   */
  const fetchIncomeExpense = useCallback(
    async ({ academicYear, department, category, head, fromDate, toDate }) => {
      const paramsReceipt = new URLSearchParams();
      if (academicYear) paramsReceipt.append("academicYear", academicYear);
      if (department) paramsReceipt.append("department", department);
      if (fromDate) paramsReceipt.append("fromDate", fromDate);
      if (toDate) paramsReceipt.append("toDate", toDate);

      // Fetch all sources in parallel
      const [feeRes, stockRes, purchaseRes, assetRes] = await Promise.all([
        fetch(`/api/fee-receipt?${paramsReceipt.toString()}`),
        fetch("/api/stocks"),
        fetch("/api/purchases"),
        fetch("/api/assets"),
      ]);

      const [feeJson, stockJson, purchaseJson, assetJson] = await Promise.all([
        feeRes.json(),
        stockRes.json(),
        purchaseRes.json(),
        assetRes.json(),
      ]);

      const feeData = Array.isArray(feeJson)
        ? feeJson
        : feeJson.data && Array.isArray(feeJson.data)
        ? feeJson.data
        : [];

      const stockData = Array.isArray(stockJson)
        ? stockJson
        : stockJson.data && Array.isArray(stockJson.data)
        ? stockJson.data
        : [];

      const purchaseData = Array.isArray(purchaseJson)
        ? purchaseJson
        : purchaseJson.data && Array.isArray(purchaseJson.data)
        ? purchaseJson.data
        : [];

      const assetData = Array.isArray(assetJson)
        ? assetJson
        : assetJson.data && Array.isArray(assetJson.data)
        ? assetJson.data
        : [];

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (to) {
        to.setHours(23, 59, 59, 999);
      }

      // ---- INCOME ROWS (from fee-receipt) ----
      let incomeRows = feeData.filter((r) => {
        // Academic year
        const ay = r.academic || r.academic_year || r.academicYear || "";
        if (academicYear && ay !== academicYear) return false;

        // Department
        const dept = r.department || r.dept || "";
        if (department && dept !== department) return false;

        // Date range
        const rawDate =
          r.date || r.receipt_date || r.created_at || r.createdAt || "";
        if (!rawDate) return false;
        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;

        return true;
      });

      incomeRows = incomeRows.map((r) => {
        const date = (
          r.date ||
          r.receipt_date ||
          r.created_at ||
          r.createdAt ||
          ""
        ).slice(0, 10);

        const voucherNo = r.receipt_no || r.voucher_no || r.voucherNo || "";

        const headName =
          r.fee_type ||
          r.head ||
          head || // from filters if nothing on record
          "";

        const income_amount =
          Number(r.paid_amount || r.total_amount || 0) || 0;

        return {
          date,
          voucher_no: voucherNo,
          head: headName || "Tuition",
          category: "INCOME",
          income_amount,
          expense_amount: 0,
          department: r.department || r.dept || department || "",
          mode: r.payment_mode || r.mode || "",
          remarks: r.remarks || r.narration || "",
        };
      });

      // ---- EXPENSE ROWS (from stocks/purchases/assets) ----
      const normalizeExpenseArray = (arr, sourceHead) => {
        return arr
          .filter((r) => {
            // Date range
            const rawDate =
              r.date ||
              r.txn_date ||
              r.bill_date ||
              r.created_at ||
              r.createdAt ||
              "";
            if (!rawDate) return false;
            const d = new Date(rawDate);
            if (isNaN(d.getTime())) return false;
            if (from && d < from) return false;
            if (to && d > to) return false;

            // Department (if available)
            const dept = r.department || r.dept || "";
            if (department && dept && dept !== department) return false;

            return true;
          })
          .map((r) => {
            const date = (
              r.date ||
              r.txn_date ||
              r.bill_date ||
              r.created_at ||
              r.createdAt ||
              ""
            ).slice(0, 10);

            const voucherNo =
              r.voucher_no ||
              r.bill_no ||
              r.invoice_no ||
              r.stock_no ||
              r.id ||
              "";

            const amount =
              Number(
                r.amount ||
                  r.total_amount ||
                  r.net_amount ||
                  r.grand_total ||
                  0
              ) || 0;

            return {
              date,
              voucher_no: voucherNo,
              head: sourceHead,
              category: "EXPENSE",
              income_amount: 0,
              expense_amount: amount,
              department: r.department || r.dept || department || "",
              mode: r.payment_mode || r.mode || "",
              remarks: r.remarks || r.description || r.item_name || "",
            };
          });
      };

      let expenseRows = [
        ...normalizeExpenseArray(stockData, "Stock"),
        ...normalizeExpenseArray(purchaseData, "Purchase"),
        ...normalizeExpenseArray(assetData, "Assets"),
      ];

      // ---- Apply HEAD filter (if any) on combined data ----
      if (head) {
        incomeRows = incomeRows.filter((r) => r.head === head);
        expenseRows = expenseRows.filter((r) => r.head === head);
      }

      // Combine
      let allRows = [...incomeRows, ...expenseRows];

      // Category filter
      if (category === "INCOME") {
        allRows = allRows.filter((r) => r.category === "INCOME");
      } else if (category === "EXPENSE") {
        allRows = allRows.filter((r) => r.category === "EXPENSE");
      }

      // Totals
      const totals = allRows.reduce(
        (acc, r) => {
          if (r.category === "INCOME") {
            acc.income += r.income_amount;
          } else if (r.category === "EXPENSE") {
            acc.expense += r.expense_amount;
          }
          return acc;
        },
        { income: 0, expense: 0 }
      );
      const net = totals.income - totals.expense;

      return {
        rows: allRows,
        totals: { ...totals, net },
      };
    },
    []
  );

  // Fetch fee receipts from /api/fee-receipt for INCOME drill-down
  const fetchFeeReceipts = useCallback(
    async ({ academicYear, department, fromDate, toDate, head, feeType }) => {
      const res = await fetch("/api/fee-receipt");
      const json = await res.json();
      const data = Array.isArray(json)
        ? json
        : json.data && Array.isArray(json.data)
        ? json.data
        : [];

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (to) {
        to.setHours(23, 59, 59, 999);
      }

      const filtered = data.filter((r) => {
        // academic year
        if (
          academicYear &&
          (r.academic || r.academic_year || "") !== academicYear
        ) {
          return false;
        }

        // department
        if (department && (r.department || r.dept || "") !== department) {
          return false;
        }

        // head / account -> map to fee_type
        const ft = (r.fee_type || r.feeType || "").toString();
        if (head && head !== "All" && ft !== head) {
          return false;
        }

        // fee type (more specific) if provided
        if (feeType && ft !== feeType) {
          return false;
        }

        // date range
        const dRaw = r.date || r.created_at || r.createdAt || "";
        if (!dRaw) return false;
        const d = new Date(dRaw);
        if (isNaN(d.getTime())) return false;
        if (from && d < from) return false;
        if (to && d > to) return false;

        return true;
      });

      // normalize
      const normalized = filtered.map((r) => ({
        date: (r.date || r.created_at || "").slice(0, 10),
        roll_no: r.roll_no ?? r.application_no ?? "",
        student_name: r.student_name || "",
        department: r.department || "",
        sem: r.sem || "",
        fee_type: r.fee_type || "",
        total_amount: Number(r.total_amount || 0),
        paid_amount: Number(r.paid_amount || 0),
        pending_amount: Number(r.pending_amount || 0),
        status: r.status || "",
      }));

      const summary = normalized.reduce(
        (acc, r) => {
          acc.count += 1;
          acc.totalAmount += r.total_amount;
          acc.totalPaid += r.paid_amount;
          acc.totalPending += r.pending_amount;
          return acc;
        },
        { count: 0, totalAmount: 0, totalPaid: 0, totalPending: 0 }
      );

      return { rows: normalized, summary };
    },
    []
  );

  // Fetch expenses detail for EXPENSE drilldown (stocks/purchases/assets)
  const fetchExpenseDetails = useCallback(
    async ({ head, academicYear, department, fromDate, toDate }) => {
      // Decide which sources to include
      const headsToFetch =
        !head || head === "All"
          ? ["Stock", "Purchase", "Assets"]
          : [head];

      const promises = [];
      if (headsToFetch.includes("Stock")) promises.push(fetch("/api/stocks"));
      if (headsToFetch.includes("Purchase"))
        promises.push(fetch("/api/purchases"));
      if (headsToFetch.includes("Assets")) promises.push(fetch("/api/assets"));

      const responses = await Promise.all(promises);
      const jsons = await Promise.all(responses.map((r) => r.json()));

      // Map index to source
      const sourceForIndex = [];
      if (headsToFetch.includes("Stock")) sourceForIndex.push("Stock");
      if (headsToFetch.includes("Purchase")) sourceForIndex.push("Purchase");
      if (headsToFetch.includes("Assets")) sourceForIndex.push("Assets");

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (to) to.setHours(23, 59, 59, 999);

      const rows = [];

      jsons.forEach((j, idx) => {
        const sourceHead = sourceForIndex[idx];
        const arr = Array.isArray(j)
          ? j
          : j.data && Array.isArray(j.data)
          ? j.data
          : [];

        arr.forEach((r) => {
          // date filter
          const rawDate =
            r.date ||
            r.txn_date ||
            r.bill_date ||
            r.created_at ||
            r.createdAt ||
            "";
          if (!rawDate) return;
          const d = new Date(rawDate);
          if (isNaN(d.getTime())) return;
          if (from && d < from) return;
          if (to && d > to) return;

          // department filter if available
          const dept = r.department || r.dept || "";
          if (department && dept && dept !== department) return;

          const date = (
            r.date ||
            r.txn_date ||
            r.bill_date ||
            r.created_at ||
            r.createdAt ||
            ""
          ).slice(0, 10);

          const voucherNo =
            r.voucher_no ||
            r.bill_no ||
            r.invoice_no ||
            r.stock_no ||
            r.id ||
            "";

          const amount =
            Number(
              r.amount ||
                r.total_amount ||
                r.net_amount ||
                r.grand_total ||
                0
            ) || 0;

          rows.push({
            date,
            voucher_no: voucherNo,
            source: sourceHead,
            head: sourceHead,
            expense_amount: amount,
            department: r.department || r.dept || department || "",
            mode: r.payment_mode || r.mode || "",
            remarks: r.remarks || r.description || r.item_name || "",
          });
        });
      });

      const summary = rows.reduce(
        (acc, r) => {
          acc.count += 1;
          acc.totalExpense += r.expense_amount;
          return acc;
        },
        { count: 0, totalExpense: 0 }
      );

      return { rows, summary };
    },
    []
  );

  // ---------- Handlers ----------

  // main filter change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // income drilldown filter change
  const handleFeeFilterChange = (e) => {
    const { name, value } = e.target;
    setFeeFilters((prev) => ({ ...prev, [name]: value }));
  };

  // expense drilldown filter change
  const handleExpenseFilterChange = (e) => {
    const { name, value } = e.target;
    setExpenseFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Generate main income/expense report
  const handleGenerate = async (e) => {
    e.preventDefault();
    setMessage("");
    setReportData(null);
    setFeeDetails(null);
    setExpenseDetails(null);
    setShowFeeDetails(false);
    setShowExpenseDetails(false);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setErrors({});
    setLoading(true);
    setShowSkeleton(true);

    try {
      const { rows, totals } = await fetchIncomeExpense({
        academicYear: filters.academicYear.trim(),
        department: filters.department.trim(),
        category: filters.category,
        head: filters.head.trim(),
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });

      if (!rows.length) {
        setMessage("No records found for the given filters.");
        setReportData(null);
        return;
      }

      setReportData({
        generatedAt: new Date().toLocaleString(),
        rows,
        totals,
        filters: { ...filters },
        reportTitle: filters.reportTitle || "Income & Expense Report",
      });

      toast.success("Report generated");
    } catch (err) {
      console.error(err);
      setMessage("Failed to load data. Please try again.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  // ---------- Income drill-down (Total Income click) ----------

  const handleOpenFeeDetails = () => {
    if (!reportData) {
      toast("Generate the report first");
      return;
    }
    setShowFeeDetails(true);
  };

  const handleLoadFeeDetails = async (e) => {
    e.preventDefault();

    if (!feeFilters.head) {
      toast.error("Please select a Head / Account");
      return;
    }

    if (feeFilters.head === "Tuition" && !feeFilters.feeType) {
      // As per your requirement: inside Tuition choose Fee Type
      toast.error("Please select Fee Type for Tuition");
      return;
    }

    setFeeDetailLoading(true);
    setFeeDetails(null);

    try {
      const res = await fetchFeeReceipts({
        academicYear: filters.academicYear,
        department: filters.department,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        head: feeFilters.head,
        feeType: feeFilters.head === "Tuition" ? feeFilters.feeType : "",
      });

      setFeeDetails({
        ...res,
        head: feeFilters.head,
        feeType: feeFilters.feeType,
      });

      if (!res.rows.length) {
        toast("No fee receipts found for selected filters");
      } else {
        toast.success("Fee receipt details loaded");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load fee receipts");
    } finally {
      setFeeDetailLoading(false);
    }
  };

  // ---------- Expense drill-down (Total Expense click) ----------

  const handleOpenExpenseDetails = () => {
    if (!reportData) {
      toast("Generate the report first");
      return;
    }
    setShowExpenseDetails(true);
  };

  const handleLoadExpenseDetails = async (e) => {
    e.preventDefault();

    if (!expenseFilters.head) {
      toast.error("Please select Head / Account for Expense");
      return;
    }

    setExpenseDetailLoading(true);
    setExpenseDetails(null);

    try {
      const res = await fetchExpenseDetails({
        head: expenseFilters.head,
        academicYear: filters.academicYear,
        department: filters.department,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });

      setExpenseDetails({
        ...res,
        head: expenseFilters.head,
      });

      if (!res.rows.length) {
        toast("No expense records found for selected filters");
      } else {
        toast.success("Expense details loaded");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load expense details");
    } finally {
      setExpenseDetailLoading(false);
    }
  };

  // ---------- Export / Download ----------

  const handleExportCSV = useCallback(() => {
    if (!reportData || !reportData.rows.length)
      return toast("Generate the report first");

    const header = [
      "Date",
      "Voucher No / Receipt No",
      "Head / Account",
      "Category",
      "Income Amount",
      "Expense Amount",
      "Department",
      "Payment Mode",
      "Remarks",
    ];

    const rows = reportData.rows.map((r) => [
      r.date,
      r.voucher_no,
      r.head,
      r.category,
      r.income_amount,
      r.expense_amount,
      r.department,
      r.mode,
      r.remarks,
    ]);

    const csv = [header, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(filters.reportTitle || "IncomeExpenseReport")
      .replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("CSV downloaded");
  }, [reportData, filters.reportTitle]);

  const handleShowDownloadModal = () => {
    if (!reportData) return toast("Generate the report first");
    setShowDownloadModal(true);
  };

  const handleDownload = useCallback(() => {
    if (!reportData) return toast("Generate the report first");

    if (downloadType === "pdf") {
      try {
        const html = generateIncomeExpenseReportHtml(filters, reportData);
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
    }

    setShowDownloadModal(false);
  }, [downloadType, filters, reportData, handleExportCSV]);

  const handlePrint = () => {
    if (!reportData) return toast("Generate the report first");
    const html = generateIncomeExpenseReportHtml(filters, reportData);
    const w = window.open("");
    if (!w) return toast.error("Popup blocked — allow popups");
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  const handleReset = () => {
    setFilters({
      academicYear: "",
      department: "",
      category: "All",
      head: "",
      fromDate: "",
      toDate: "",
      reportTitle: "Income & Expense Report",
    });
    setErrors({});
    setReportData(null);
    setFeeDetails(null);
    setExpenseDetails(null);
    setShowFeeDetails(false);
    setShowExpenseDetails(false);
  };

  const periodText =
    filters.fromDate || filters.toDate
      ? `${filters.fromDate || "-"} to ${filters.toDate || "-"}`
      : "-";

  // ---------- UI ----------

  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          {/* PAGE TITLE + ACTION BUTTONS */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Income &amp; Expense Report</h6>
           
          </div>

          <div className="card h-100 p-0 radius-12">
            {/* CARD HEADER */}
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h6 className="text-lg fw-semibold mb-2">
                  Generate Income &amp; Expense Report
                </h6>
                <p className="mb-0 text-muted" style={{ fontSize: 13 }}>
                  Select filters and generate a combined summary of income
                  (fee receipts) &amp; expenses (stock, purchase, assets).
                </p>
              </div>
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

            {/* CARD BODY */}
            <div className="card-body p-24">
              {/* Filter Form */}
              <form
                className="row g-3 align-items-end mb-3"
                onSubmit={handleGenerate}
              >
                {/* Academic Year */}
                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="academicYear"
                  >
                    Academic Year
                  </label>
                  <select
                    id="academicYear"
                    name="academicYear"
                    className="form-select"
                    value={filters.academicYear}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="department"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="form-select"
                    value={filters.department}
                    onChange={handleChange}
                  >
                    <option value="">All</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={filters.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c === "All" ? "All" : c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Head / Account */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold" htmlFor="head">
                    Head / Account
                  </label>
                  <select
                    id="head"
                    name="head"
                    className="form-select"
                    value={filters.head}
                    onChange={handleChange}
                  >
                    <option value="">All</option>
                    {HEADS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* From Date */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold" htmlFor="fromDate">
                    From Date *
                  </label>
                  <input
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    className={`form-control${
                      errors.fromDate ? " is-invalid" : ""
                    }`}
                    value={filters.fromDate}
                    onChange={handleChange}
                  />
                  {errors.fromDate && (
                    <span className="text-danger" role="alert">
                      {errors.fromDate}
                    </span>
                  )}
                </div>

                {/* To Date */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold" htmlFor="toDate">
                    To Date *
                  </label>
                  <input
                    id="toDate"
                    name="toDate"
                    type="date"
                    className={`form-control${
                      errors.toDate ? " is-invalid" : ""
                    }`}
                    value={filters.toDate}
                    onChange={handleChange}
                  />
                  {errors.toDate && (
                    <span className="text-danger" role="alert">
                      {errors.toDate}
                    </span>
                  )}
                </div>

                {/* Report Title */}
                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    htmlFor="reportTitle"
                  >
                    Report Title *
                  </label>
                  <input
                    id="reportTitle"
                    name="reportTitle"
                    type="text"
                    className={`form-control${
                      errors.reportTitle ? " is-invalid" : ""
                    }`}
                    value={filters.reportTitle}
                    onChange={handleChange}
                    placeholder="Income & Expense Report"
                  />
                  {errors.reportTitle && (
                    <span className="text-danger" role="alert">
                      {errors.reportTitle}
                    </span>
                  )}
                </div>

                {/* Buttons */}
                 <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button
                    type="submit"
                    className="btn btn-outline-primary w-10"
                    disabled={loading}
                  >
                    <i className="fas fa-table me-2"></i>
                    {loading ? "Generating..." : "Generate Report"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger w-10"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </form>

              {/* Info / No data message */}
              {message && (
                <div className="alert alert-info py-2 px-3 my-2">
                  {message}
                </div>
              )}

              {/* Skeleton loader */}
              {showSkeleton && (
                <div className="mt-4">
                  <div
                    className="skeleton-loader"
                    style={{ height: 120, background: "#eee", borderRadius: 8 }}
                  ></div>
                </div>
              )}

              {/* Report Preview */}
              {reportData && (
                <div id="printArea" ref={printAreaRef} className="mt-3">
                  {/* Header / metadata */}
                  <div className="card radius-12 p-24 mb-4">
                    <h5 className="fw-bold mb-2">
                      {reportData.reportTitle || "Income & Expense Report"}
                    </h5>
                    <div className="mb-1">
                      Academic Year:{" "}
                      <span className="fw-semibold">
                        {reportData.filters.academicYear || "-"}
                      </span>
                    </div>
                    <div className="mb-1">
                      Department:{" "}
                      <span className="fw-semibold">
                        {reportData.filters.department || "All"}
                      </span>
                    </div>
                    <div className="mb-1">
                      Category:{" "}
                      <span className="fw-semibold">
                        {reportData.filters.category === "All"
                          ? "All"
                          : reportData.filters.category || "All"}
                      </span>
                    </div>
                    <div className="mb-1">
                      Head / Account:{" "}
                      <span className="fw-semibold">
                        {reportData.filters.head || "All"}
                      </span>
                    </div>
                    <div className="mb-1">
                      Period:{" "}
                      <span className="fw-semibold">{periodText}</span>
                    </div>
                    <div className="mb-1">
                      Total Records:{" "}
                      <span className="fw-semibold">
                        {reportData.rows.length}
                      </span>
                    </div>
                  </div>

                  {/* Summary cards */}
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <div
                        className="card radius-12 p-16 text-center"
                        style={{ cursor: "pointer" }}
                        onClick={handleOpenFeeDetails}
                        title="Click to view Income details (Fee receipts)"
                      >
                        <h6 className="fw-bold">
                          Total Income{" "}
                          <span className="text-muted" style={{ fontSize: 11 }}>
                            (click for fee details)
                          </span>
                        </h6>
                        <div className="fs-5 fw-semibold text-success">
                          {fmtMoney(reportData.totals.income)}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div
                        className="card radius-12 p-16 text-center"
                        style={{ cursor: "pointer" }}
                        onClick={handleOpenExpenseDetails}
                        title="Click to view Expense details (Stock/Purchase/Assets)"
                      >
                        <h6 className="fw-bold">
                          Total Expense{" "}
                          <span className="text-muted" style={{ fontSize: 11 }}>
                            (click for details)
                          </span>
                        </h6>
                        <div className="fs-5 fw-semibold text-danger">
                          {fmtMoney(reportData.totals.expense)}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card radius-12 p-16 text-center">
                        <h6 className="fw-bold">Net (Income - Expense)</h6>
                        <div className="fs-5 fw-semibold">
                          {fmtMoney(reportData.totals.net)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ---- INCOME DETAIL SECTION (/api/fee-receipt) ---- */}
                  {showFeeDetails && (
                    <div className="card radius-12 p-16 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0">
                          Income Details (Fee Receipts) – /api/fee-receipt
                        </h6>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setShowFeeDetails(false);
                            setFeeDetails(null);
                          }}
                        >
                          Close
                        </button>
                      </div>

                      {/* Head + FeeType filter */}
                      <form
                        className="row g-3 align-items-end mb-3"
                        onSubmit={handleLoadFeeDetails}
                      >
                        <div className="col-md-3">
                          <label
                            className="form-label fw-semibold"
                            htmlFor="incomeHead"
                          >
                            Head / Account *
                          </label>
                          <select
                            id="incomeHead"
                            name="head"
                            className="form-select"
                            value={feeFilters.head}
                            onChange={handleFeeFilterChange}
                          >
                            <option value="">Select</option>
                            {INCOME_HEADS.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* If Head is Tuition, show FeeType dropdown */}
                        {feeFilters.head === "Tuition" && (
                          <div className="col-md-3">
                            <label
                              className="form-label fw-semibold"
                              htmlFor="feeType"
                            >
                              Fee Type *
                            </label>
                            <select
                              id="feeType"
                              name="feeType"
                              className="form-select"
                              value={feeFilters.feeType}
                              onChange={handleFeeFilterChange}
                            >
                              <option value="">Select</option>
                              {FEE_TYPES.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="col-md-3 d-flex align-items-end">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={feeDetailLoading}
                          >
                            {feeDetailLoading ? "Loading..." : "Load Income Details"}
                          </button>
                        </div>
                      </form>

                      {feeDetailLoading && (
                        <div
                          className="skeleton-loader mb-3"
                          style={{
                            height: 80,
                            background: "#eee",
                            borderRadius: 8,
                          }}
                        ></div>
                      )}

                      {feeDetails && (
                        <>
                          {/* Fee summary cards */}
                          <div className="row mb-3">
                            <div className="col-md-3">
                              <div className="card radius-12 p-12 text-center">
                                <h6 className="fw-bold">Head</h6>
                                <div className="fw-semibold">
                                  {feeDetails.head}
                                </div>
                              </div>
                            </div>
                            {feeDetails.head === "Tuition" && (
                              <div className="col-md-3">
                                <div className="card radius-12 p-12 text-center">
                                  <h6 className="fw-bold">Fee Type</h6>
                                  <div className="fw-semibold">
                                    {feeDetails.feeType || "-"}
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="col-md-3">
                              <div className="card radius-12 p-12 text-center">
                                <h6 className="fw-bold">Total Records</h6>
                                <div className="fw-semibold">
                                  {feeDetails.summary.count}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="card radius-12 p-12 text-center">
                                <h6 className="fw-bold">Total Amount</h6>
                                <div className="fw-semibold">
                                  {fmtMoney(feeDetails.summary.totalAmount)}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="card radius-12 p-12 text-center">
                                <h6 className="fw-bold">Total Paid</h6>
                                <div className="fw-semibold text-success">
                                  {fmtMoney(feeDetails.summary.totalPaid)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Fee receipts table */}
                          <div className="card radius-12 p-12">
                            <h6 className="fw-bold mb-2">
                              Fee Receipts ({feeDetails.head}
                              {feeDetails.feeType ? ` - ${feeDetails.feeType}` : ""})
                            </h6>
                            <table className="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Roll/App No</th>
                                  <th>Student Name</th>
                                  <th>Department</th>
                                  <th>Sem</th>
                                  <th>Fee Type</th>
                                  <th style={{ textAlign: "right" }}>
                                    Total Amount
                                  </th>
                                  <th style={{ textAlign: "right" }}>
                                    Paid Amount
                                  </th>
                                  <th style={{ textAlign: "right" }}>
                                    Pending Amount
                                  </th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {feeDetails.rows.map((row, idx) => (
                                  <tr key={idx}>
                                    <td>{row.date}</td>
                                    <td>{row.roll_no}</td>
                                    <td>{row.student_name}</td>
                                    <td>{row.department}</td>
                                    <td>{row.sem}</td>
                                    <td>{row.fee_type}</td>
                                    <td style={{ textAlign: "right" }}>
                                      {fmtMoney(row.total_amount)}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {fmtMoney(row.paid_amount)}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {fmtMoney(row.pending_amount)}
                                    </td>
                                    <td>{row.status}</td>
                                  </tr>
                                ))}
                                {!feeDetails.rows.length && (
                                  <tr>
                                    <td colSpan={10} className="text-center">
                                      No fee receipts found.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* ---- EXPENSE DETAIL SECTION (/api/stocks|purchases|assets) ---- */}
                  {showExpenseDetails && (
                    <div className="card radius-12 p-16 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0">
                          Expense Details – /api/stocks, /api/purchases, /api/assets
                        </h6>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setShowExpenseDetails(false);
                            setExpenseDetails(null);
                          }}
                        >
                          Close
                        </button>
                      </div>

                      {/* Expense head filter */}
                      <form
                        className="row g-3 align-items-end mb-3"
                        onSubmit={handleLoadExpenseDetails}
                      >
                        <div className="col-md-3">
                          <label
                            className="form-label fw-semibold"
                            htmlFor="expenseHead"
                          >
                            Head / Account *
                          </label>
                          <select
                            id="expenseHead"
                            name="head"
                            className="form-select"
                            value={expenseFilters.head}
                            onChange={handleExpenseFilterChange}
                          >
                            {EXPENSE_HEADS.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-3 d-flex align-items-end">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={expenseDetailLoading}
                          >
                            {expenseDetailLoading
                              ? "Loading..."
                              : "Load Expense Details"}
                          </button>
                        </div>
                      </form>

                      {expenseDetailLoading && (
                        <div
                          className="skeleton-loader mb-3"
                          style={{
                            height: 80,
                            background: "#eee",
                            borderRadius: 8,
                          }}
                        ></div>
                      )}

                      {expenseDetails && (
                        <>
                          {/* Expense summary cards */}
                          <div className="row mb-3">
                            <div className="col-md-3">
                              <div className="card radius-12 p-12 text-center">
                                <h6 className="fw-bold">Head</h6>
                                <div className="fw-semibold">
                                  {expenseDetails.head}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="card radius-12 p-12 text-center">
                                <h6 className="fw-bold">Total Records</h6>
                                <div className="fw-semibold">
                                  {expenseDetails.summary.count}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="card radius-12 p-12 text-center">
                                <h6 className="fw-bold">Total Expense</h6>
                                <div className="fw-semibold text-danger">
                                  {fmtMoney(
                                    expenseDetails.summary.totalExpense
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expense table */}
                          <div className="card radius-12 p-12">
                            <h6 className="fw-bold mb-2">
                              Expense Records (
                              {expenseDetails.head === "All"
                                ? "Stock + Purchase + Assets"
                                : expenseDetails.head}
                              )
                            </h6>
                            <table className="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Voucher / Bill No</th>
                                  <th>Source</th>
                                  <th>Head / Account</th>
                                  <th style={{ textAlign: "right" }}>Amount</th>
                                  <th>Department</th>
                                  <th>Payment Mode</th>
                                  <th>Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {expenseDetails.rows.map((row, idx) => (
                                  <tr key={idx}>
                                    <td>{row.date}</td>
                                    <td>{row.voucher_no}</td>
                                    <td>{row.source}</td>
                                    <td>{row.head}</td>
                                    <td style={{ textAlign: "right" }}>
                                      {fmtMoney(row.expense_amount)}
                                    </td>
                                    <td>{row.department}</td>
                                    <td>{row.mode}</td>
                                    <td>{row.remarks}</td>
                                  </tr>
                                ))}
                                {!expenseDetails.rows.length && (
                                  <tr>
                                    <td colSpan={8} className="text-center">
                                      No expense records found.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Main Income/Expense table */}
                  <div className="card radius-12 p-16 mb-3">
                    <h6 className="fw-bold mb-2">Transactions (Income &amp; Expense)</h6>
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Voucher No / Receipt No</th>
                          <th>Head / Account</th>
                          <th>Category</th>
                          <th style={{ textAlign: "right" }}>Income Amount</th>
                          <th style={{ textAlign: "right" }}>Expense Amount</th>
                          <th>Department</th>
                          <th>Payment Mode</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.rows.map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.date}</td>
                            <td>{row.voucher_no}</td>
                            <td>{row.head}</td>
                            <td>{row.category}</td>
                            <td style={{ textAlign: "right" }}>
                              {fmtMoney(row.income_amount)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {fmtMoney(row.expense_amount)}
                            </td>
                            <td>{row.department}</td>
                            <td>{row.mode}</td>
                            <td>{row.remarks}</td>
                          </tr>
                        ))}
                        {!reportData.rows.length && (
                          <tr>
                            <td colSpan={9} className="text-center">
                              No records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {reportData.rows.length > 0 && (
                        <tfoot>
                          <tr className="fw-semibold">
                            <td colSpan={4} className="text-end">
                              Grand Total:
                            </td>
                            <td>{fmtMoney(reportData.totals.income)}</td>
                            <td>{fmtMoney(reportData.totals.expense)}</td>
                            <td colSpan={3}>
                              Net: {fmtMoney(reportData.totals.net)}
                            </td>
                          </tr>
                        </tfoot>
                      )}
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
                <h5 className="modal-title">
                  Export Income &amp; Expense Report
                </h5>
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
                        id="pdfReport"
                      />
                      <label className="form-check-label" htmlFor="pdfReport">
                        PDF (via Print)
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
                        id="csvReport"
                      />
                      <label className="form-check-label" htmlFor="csvReport">
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
