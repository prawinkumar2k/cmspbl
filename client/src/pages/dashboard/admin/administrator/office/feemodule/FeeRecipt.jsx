import React, { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import toast, { Toaster } from "react-hot-toast";
import FeeTable from "./FeeTable";
import { generateReceiptHtml } from "../../../../../../utils/reportTemplate";

// Logo & watermark (re-using paths from TC page)
const LOGO_SRC = "/assets/images/GRT.png";
const WATERMARK_SRC = "/assets/images/GRT.png";

const SEMS = [1, 2, 3, 4, 5, 6, 7, 8];

const INITIAL_FORM = {
  id: null,
  date: new Date().toISOString().slice(0, 10),
  department: "",
  sem: "",
  feestype: "",
  rollNo: "",
  studentName: "",
  totalAmount: "",
  paidSoFar: 0,
  payNow: "",
  paidAmount: 0,
  pendingAmount: 0,
  status: "Unpaid",
  securityCode: "",
  academic: "",
  remarks: "",
  paymentMode: "Cash", // ⭐ payment mode in form
  referenceNo: "",
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

// prefer amounts from fetched feeOptions; no static/mock fallbacks
const getAmountForfeestype = (type, feeOptionsList = []) => {
  if (!type) return 0;
  const opt = (feeOptionsList || []).find((o) => o.feestype === type);
  if (opt) return Number(opt.amount || 0) || 0;
  return 0;
};

export default function FeeRecipt() {
  const [form, setForm] = useState(INITIAL_FORM);
  // when a roll no / identifier is entered we lock autofilled fields
  const [autoLocked, setAutoLocked] = useState(false);
  const PAYMENT_MODES = ["Cash", "Bank", "UPI", "Online", "Card"];
  const [entries, setEntries] = useState([]);
  const [feeOptions, setFeeOptions] = useState([]); // from /api/student-fee-master
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payNowError, setPayNowError] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const formRef = useRef(null);
  const receiptRef = useRef(null);

  // --- NEW: report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    fromDate: "",
    toDate: "",
    reportType: "all",
  });





  // Fetch entries (keeps existing behavior)
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fee-receipt");
      const json = await res.json();
      const data = Array.isArray(json)
        ? json
        : json.data && Array.isArray(json.data)
          ? json.data
          : [];
      setEntries(data);
    } catch (err) {
      console.error(err);
      setEntries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // helper: compute paidSoFar (server-backed)
  const fetchPaidSoFar = useCallback(
    async (identifier, feeType, excludeId = null, idType = "roll") => {
      if (!identifier || !feeType) return 0;
      try {
        const params =
          idType === "application"
            ? { applicationNo: identifier, feeType }
            : { rollNo: identifier, feeType };
        const q = new URLSearchParams(params).toString();
        const res = await fetch(`/api/fee-receipt?${q}`);
        const json = await res.json();
        const rows = Array.isArray(json)
          ? json
          : json.data && Array.isArray(json.data)
            ? json.data
            : [];
        let sum = 0;
        for (const r of rows) {
          if (excludeId && Number(r.id) === Number(excludeId)) continue;
          sum += Number(r.pay_now || r.payNow || 0) || 0;
        }
        return Math.round(sum * 100) / 100;
      } catch (err) {
        console.error(err);
        return 0;
      }
    },
    []
  );

  // handleChange with auto-fill logic (unchanged except still handles paymentMode via generic setForm)
  const handleChange = useCallback(
    async (e) => {
      const { name, value } = e.target;

      if (name === "identifier") {
        const id = value;
        const update = {
          rollNo: "",
          studentName: "",
          department: "",
          securityCode: "",
          academic: "",
          totalAmount: "",
        };

        const found = entries.find(
          (r) => String(r.roll_no || r.rollNo) === String(id)
        );
        if (found) {
          update.rollNo = id;
          update.studentName =
            found.student_name || found.studentName || "";
          update.department = found.department || found.dept || "";
          update.securityCode =
            found.security_code || found.securityCode || "";
          update.academic = found.academic || "";
          update.sem = found.sem || found.semester || "";
          update.totalAmount = found.total_amount || found.totalAmount || "";
        } else {
          update.rollNo = id;
          // Try to fetch student + fee master details from backend (studentFeeMaster)
          try {
            // send both camelCase and snake_case register param to support different server implementations
            const params = { registerNumber: id, register_number: id };
            if (form.sem) params.semester = form.sem;
            if (form.academic) params.academicYear = form.academic;
            const q = new URLSearchParams(params).toString();
            const resp = await fetch(`/api/student-fee-master?${q}`);
            if (resp && resp.ok) {
              const json = await resp.json();
              const rows = Array.isArray(json) ? json : json.data && Array.isArray(json.data) ? json.data : [];
              if (rows && rows.length) {
                // pick first row for student-level details
                const s = rows[0];
                update.studentName = s.Student_Name || s.student_name || "";
                update.securityCode = s.Dept_Name || s.dept_name || s.Dept_Code || s.dept_code || update.securityCode || "";
                update.department = s.Dept_Code || s.dept_code || s.Dept_Name || s.dept_name || update.department || "";
                update.academic = s.Academic_Year || s.academic || update.academic || "";
                update.sem = s.Semester || s.sem || update.sem || "";

                // build fee options from returned rows
                const options = rows.map((r) => ({
                  feestype: r.Fees_Type || r.FeesType || r.fee_type || r.feestype || "",
                  amount: Number(r.Amount || r.amount || 0) || 0,
                  raw: r,
                }));
                setFeeOptions(options);

                // choose default feestype: prefer current form.feestype if present and available
                const selectedOption =
                  options.find((o) => o.feestype === form.feestype) || options[0];
                if (selectedOption) {
                  update.totalAmount = selectedOption.amount || update.totalAmount;
                  update.feestype = selectedOption.feestype || update.feestype || "";
                }
              } else {
                setFeeOptions([]);
              }
            }
          } catch (err) {
            console.error("Student fee master lookup failed", err);
          }
        }

        setForm((prev) => ({ ...prev, ...update }));
        // lock autofilled fields once an identifier is present
        setAutoLocked(Boolean(id));

        const feestypeVal = form.feestype || update.feestype || "";
        if (id && feestypeVal) {
          const paid = await fetchPaidSoFar(id, feestypeVal, editingId);
          const total = Number(
            update.totalAmount || form.totalAmount || getAmountForfeestype(feestypeVal, feeOptions) || 0
          );
          const payNowVal = Number(form.payNow || 0);
          const paidAmount = Math.round((paid + payNowVal) * 100) / 100;
          const pending = Math.max(
            0,
            Math.round((total - paidAmount) * 100) / 100
          );
          const status =
            paidAmount === 0
              ? "Unpaid"
              : pending === 0
                ? "Paid"
                : "Partially Paid";
          setForm((prev) => ({
            ...prev,
            paidSoFar: paid,
            paidAmount,
            pendingAmount: pending,
            status,
          }));
        }
        return;
      }

      if (name === "feestype") {
        const total = getAmountForfeestype(value, feeOptions) || "";
        setForm((prev) => ({ ...prev, feestype: value, totalAmount: total }));
        if ((form.rollNo || form.identifier) && value) {
          const idToUse = form.rollNo || form.identifier || "";
          const paid = await fetchPaidSoFar(idToUse, value, editingId);
          const payNowVal = Number(form.payNow || 0);
          const paidAmount = Math.round((paid + payNowVal) * 100) / 100;
          const pending = Math.max(
            0,
            Math.round((Number(total || 0) - paidAmount) * 100) / 100
          );
          const status =
            paidAmount === 0
              ? "Unpaid"
              : pending === 0
                ? "Paid"
                : "Partially Paid";
          setForm((prev) => ({
            ...prev,
            paidSoFar: paid,
            paidAmount,
            pendingAmount: pending,
            status,
          }));
        }
        return;
      }

      if (name === "totalAmount") {
        const total = Number(value || 0);
        const paidSoFar = Number(form.paidSoFar || 0);
        const payNowVal = Number(form.payNow || 0);
        const paidAmount =
          Math.round((paidSoFar + payNowVal) * 100) / 100;
        const pending = Math.max(
          0,
          Math.round((total - paidAmount) * 100) / 100
        );
        const status =
          paidAmount === 0
            ? "Unpaid"
            : pending === 0
              ? "Paid"
              : "Partially Paid";
        setForm((prev) => ({
          ...prev,
          totalAmount: value,
          paidAmount,
          pendingAmount: pending,
          status,
        }));
        return;
      }

      if (name === "payNow") {
        const raw = value;
        const parsed = raw === "" ? "" : Number(raw);
        if (raw !== "" && (isNaN(parsed) || parsed < 0)) return;
        const payNowNum = raw === "" ? "" : parsed;
        const paidSoFar = Number(form.paidSoFar || 0);
        const total = Number(
          form.totalAmount || getAmountForfeestype(form.feestype, feeOptions) || 0
        );

        // allowed maximum to pay now is remaining pending before this payment
        const allowedMax = Math.max(0, Math.round((total - paidSoFar) * 100) / 100);

        // set inline error if entered amount exceeds allowedMax; do NOT clamp here
        if (payNowNum !== "" && payNowNum > allowedMax) {
          setPayNowError(
            `Entered amount exceeds pending amount (₹${allowedMax.toFixed(2)})`
          );
        } else {
          setPayNowError("");
        }

        const paidAmount =
          payNowNum === "" ? paidSoFar : Math.round((paidSoFar + payNowNum) * 100) / 100;
        const pending = Math.max(0, Math.round((total - paidAmount) * 100) / 100);
        const status =
          paidAmount === 0
            ? "Unpaid"
            : pending === 0
              ? "Paid"
              : "Partially Paid";
        setForm((prev) => ({
          ...prev,
          payNow: payNowNum,
          paidAmount,
          pendingAmount: pending,
          status,
        }));
        return;
      }

      // prevent overwriting autofilled fields when locked
      if (autoLocked && ["studentName", "securityCode", "sem"].includes(name)) {
        return;
      }

      // includes paymentMode, remarks, etc.
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    [entries, form, fetchPaidSoFar, editingId, autoLocked, feeOptions]
  );

  // Submit -> save then show receipt below form
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !form.date ||
        !form.sem ||
        !form.feestype ||
        !form.rollNo ||
        !form.studentName ||
        form.totalAmount === ""
      ) {
        toast.error("Please fill all required fields.");
        return;
      }

      const payNowVal =
        form.payNow === "" ? 0 : Number(form.payNow || 0);
      if (payNowVal < 0) {
        toast.error("Invalid payment amount.");
        return;
      }

      // Prevent submitting an amount greater than pending
      const paidSoFarCheck = Number(form.paidSoFar || 0);
      const totalCheck = Number(form.totalAmount || 0);
      const allowedMaxCheck = Math.max(0, Math.round((totalCheck - paidSoFarCheck) * 100) / 100);
      if (payNowVal > allowedMaxCheck) {
        toast.error(
          `Entered amount exceeds pending amount (₹${allowedMaxCheck.toFixed(2)})`
        );
        return;
      }

      const paidSoFar = Number(form.paidSoFar || 0);
      const totalAmount = Number(form.totalAmount || 0);
      const paidAmount =
        Math.round((paidSoFar + payNowVal) * 100) / 100;
      const pendingAmount = Math.max(
        0,
        Math.round((totalAmount - paidAmount) * 100) / 100
      );
      const computedStatus =
        paidAmount === 0
          ? "Unpaid"
          : pendingAmount === 0
            ? "Paid"
            : "Partially Paid";

      const payload = {
        date: form.date,
        department: form.department,
        sem: form.sem,
        fee_type: form.feestype,
        roll_no: form.rollNo,
        application_no: null,
        student_name: form.studentName,
        total_amount: Number(totalAmount),
        pay_now: Number(payNowVal),
        paid_amount: Number(paidAmount),
        pending_amount: Number(pendingAmount),
        status: computedStatus,
        security_code: form.securityCode,
        remarks: form.remarks,
        academic: form.academic,
        payment_mode: form.paymentMode, // ⭐ send payment mode to backend
        reference_no: form.referenceNo || null, // optional
      };

      try {
        if (editingId) {
          const res = await fetch(`/api/fee-receipt/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Update failed");
          toast.success("Updated");
          await fetchEntries();
        } else {
          const res = await fetch("/api/fee-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Create failed");
        }

        const receipt = {
          id: editingId || Date.now(),
          ...payload,
        };
        setReceiptData(receipt);
        setShowReceipt(true);

        setTimeout(() => {
          fetchEntries();
          setRefreshTable((prev) => prev + 1);
        }, 300);

        setForm((prev) => ({ ...INITIAL_FORM, date: prev.date }));
        setEditingId(null);
        setAutoLocked(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to save entry");
      }
    },
    [form, editingId, fetchEntries]
  );

  // Print receipt: opens a new window with isolated styles to print only the receipt
  const handlePrintReceipt = useCallback(() => {
    if (!receiptData) return;

    // Hide the in-page preview so only the popup preview is printed
    setShowReceipt(false);

    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      toast.error("Pop-up blocked. Allow pop-ups and try again.");
      return;
    }

    try {
      const html = generateReceiptHtml(receiptData || {});

      // Inject a small script into the generated HTML that prints and closes the window
      const printScript = `
        <script>
          function doPrint(){
            try{ window.focus(); window.print(); }catch(e){}
            setTimeout(function(){ try{ window.close(); }catch(e){} }, 200);
          }
          if(document.readyState === 'complete') doPrint(); else window.onload = doPrint;
        </script>
      `;

      // ensure the script is placed before </body></html>
      const htmlWithPrint = html.replace(/<\/body>\s*<\/html>/i, printScript + "</body></html>");

      w.document.open();
      w.document.write(htmlWithPrint);
      w.document.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to open print window");
    }
  }, [receiptData, setShowReceipt]);

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setShowReceipt(false);
    setReceiptData(null);
    setAutoLocked(false);
    toast.success("Form closed.");
  }, []);

  // ---------- Report HTML generator (table style) --------------------
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



  // ---------- Report handlers ---------------------------------------
  const handleShowReportModal = () => setShowReportModal(true);
  const handleReportFormChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadReport = useCallback(() => {
    let filtered = entries || [];
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
      toast("No receipt rows match the selected criteria", {
        icon: "ℹ️",
      });
      return;
    }


    // CSV
    try {
      const headers = [
        "Date",
        "Roll/App No",
        "Student Name",
        "Department",
        "Sem",
        "Fees Type",
        "Total Amount",
        "This Payment",
        "Paid (Cumulative)",
        "Pending",
        "Payment Mode", // ⭐ payment mode in CSV header
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
        "payment_mode", // ⭐ new key
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
          if (k === "payment_mode") {
            v = r.payment_mode ?? r.paymentMode ?? ""; // ⭐ payment mode value
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
      a.download = `${reportTitle.replace(
        /\s+/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch (err) {
      console.error("csv error", err);
      toast.error("Failed to generate CSV");
    }

    setShowReportModal(false);
  }, [entries, reportForm]);

  // ---------- UI: render --------------------------------------------------
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Fee Receipt Entry</h6>

            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">
                    {editingId
                      ? "Edit Fee Receipt"
                      : "Add Fee Receipt Entry"}
                  </h6>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${showTable ? "btn-success" : "btn-outline-info"
                      }`}
                    onClick={() => setShowTable((prev) => !prev)}
                    title={
                      showTable ? "Hide Fee Table" : "Show Fee Table"
                    }
                  >
                    <i
                      className={`fas ${showTable ? "fa-eye-slash" : "fa-table"
                        } me-1`}
                    ></i>
                    {showTable ? "Hide Table" : "View Receipts"}
                  </button>


                </div>
              </div>

              <div className="card-body p-24">
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="row g-3 align-items-end mb-3"
                >
                  {/* ...existing form fields... */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Register No</label>
                    <input
                      type="text"
                      name="identifier"
                      value={form.rollNo}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Register Number"
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Student Name</label>
                    <input
                      type="text"
                      name="studentName"
                      value={form.studentName}
                      onChange={handleChange}
                      readOnly={autoLocked}
                      className="form-control"
                      placeholder="Student Name"
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Department Name
                    </label>
                    <input
                      type="text"
                      name="securityCode"
                      value={form.securityCode}
                      onChange={handleChange}
                      readOnly={autoLocked}
                      className="form-control"
                      placeholder="Enter Department Name"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Semester</label>
                    {autoLocked ? (
                      <input
                        type="text"
                        name="sem"
                        value={form.sem}
                        className="form-control"
                        readOnly
                        disabled
                      />
                    ) : (
                      <select
                        name="sem"
                        value={form.sem}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select</option>
                        {SEMS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Fees Type
                    </label>
                    <select
                      name="feestype"
                      value={form.feestype}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select</option>
                      {feeOptions && feeOptions.length ? (
                        feeOptions.map((o, i) => (
                          <option
                            key={o.feestype ? `${o.feestype}_${i}` : `fee_${i}`}
                            value={o.feestype || ""}
                          >
                            {o.feestype || ""}
                          </option>
                        ))
                      ) : (
                        <option value="">No fee types available</option>
                      )}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={form.totalAmount}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                      placeholder="Total Amount"
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Pay Now
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="payNow"
                      value={form.payNow}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                      placeholder="Enter payment now"
                    />
                    {payNowError && (
                      <div style={{ color: "#b30000", marginTop: 6, fontSize: 13 }}>
                        {payNowError}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Payment Mode
                    </label>
                    <select
                      name="paymentMode"
                      value={form.paymentMode}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      {PAYMENT_MODES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Pending Amount
                    </label>
                    <input
                      type="text"
                      name="pendingAmount"
                      value={Number(
                        form.pendingAmount || 0
                      ).toFixed(2)}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partially Paid">
                        Partially Paid
                      </option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>



                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Remarks
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Remarks"
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="submit"
                      className="btn btn-outline-primary w-10"
                    >
                      <i className="fas fa-save me-2"></i>
                      {editingId ? "UPDATE" : "SUBMIT"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger fw-bold w-10"
                      onClick={handleClose}
                    >
                      CLOSE
                    </button>
                  </div>
                </form>

                {/* Receipt preview + actions */}
                {showReceipt && receiptData && (
                  <div style={{ marginTop: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowReceipt(false)}
                      >
                        Hide
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setEditingId(receiptData.id);
                          setForm((prev) => ({
                            ...prev,
                            rollNo:
                              receiptData.roll_no ||
                              receiptData.application_no ||
                              receiptData.rollNo,
                            studentName:
                              receiptData.student_name ||
                              receiptData.studentName,
                            sem: receiptData.sem,
                            feestype:
                              receiptData.fee_type ||
                              receiptData.feestype,
                            totalAmount:
                              receiptData.total_amount ||
                              receiptData.totalAmount,
                            payNow:
                              receiptData.pay_now ||
                              receiptData.payNow,
                            pendingAmount:
                              receiptData.pending_amount ||
                              receiptData.pendingAmount,
                            status: receiptData.status,
                            securityCode:
                              receiptData.security_code ||
                              receiptData.securityCode,
                            academic: receiptData.academic,
                            remarks:
                              receiptData.remarks || "",
                            paymentMode:
                              receiptData.payment_mode ||
                              receiptData.paymentMode ||
                              "Cash", // ⭐ prefill payment mode on Edit
                          }));
                          setAutoLocked(true);

                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handlePrintReceipt}
                      >
                        Print Receipt
                      </button>

                    </div>

                    <div
                      ref={receiptRef}
                      style={{
                        border: "3px solid #b8860b",
                        padding: 12,
                        background: "#fff",
                      }}
                    >
                      {/* Receipt markup */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <img
                          src={LOGO_SRC}
                          alt="logo"
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                            marginRight: 12,
                          }}
                        />
                        <div
                          style={{ textAlign: "center", flex: 1 }}
                        >
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 20,
                            }}
                          >
                            GRT INSTITUTE OF PHARMACEUTICAL
                            EDUCATION AND RESEARCH
                          </div>
                          <div
                            style={{ fontSize: 13, marginTop: 4 }}
                          >
                            GRT Mahalakshmi Nagar, Chennai -
                            Tirupati Highway, Tiruttani - 631
                            209.
                          </div>
                          <div
                            style={{ fontSize: 12, marginTop: 2 }}
                          >
                            Phone : 044-27885997 / 98 E-mail :
                            grtper@grt.edu.in
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              marginTop: 6,
                              fontWeight: 700,
                            }}
                          >
                            Fee Receipt
                          </div>
                        </div>
                      </div>

                      <table
                        style={{
                          width: "100%",
                          fontSize: 14,
                          borderCollapse: "collapse",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                width: "40%",
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Date
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.date}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Roll / Reg No
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.roll_no || ""}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Application No
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.application_no || receiptData.applicationNo || ""}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Student Name
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.student_name ||
                                receiptData.studentName}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Department / Code
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.department} /{" "}
                              {receiptData.security_code ||
                                receiptData.securityCode}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Semester
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.sem}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Academic Year
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.academic}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Fees Type
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.fee_type ||
                                receiptData.feestype}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Total Amount
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {fmtMoney(
                                receiptData.total_amount ||
                                receiptData.totalAmount
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              This Payment
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {fmtMoney(
                                receiptData.pay_now ||
                                receiptData.payNow
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Paid (Cumulative)
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {fmtMoney(
                                receiptData.paid_amount ||
                                receiptData.paidAmount
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Pending
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {fmtMoney(
                                receiptData.pending_amount ||
                                receiptData.pendingAmount
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Payment Mode
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.payment_mode || receiptData.paymentMode || ""}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Remarks
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#333",
                                fontWeight: 600,
                              }}
                            >
                              {receiptData.remarks || ""}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: 6,
                                fontWeight: 600,
                              }}
                            >
                              Status
                            </td>
                            <td
                              style={{
                                padding: 6,
                                color: "#b30000",
                                fontWeight: 700,
                              }}
                            >
                              {receiptData.status}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 24,
                          fontWeight: 700,
                        }}
                      >
                        <div>Signature of Student</div>
                        <div>Institution Seal</div>
                        <div>Signature of Principal</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fee Receipts Table */}
                {showTable && (
                  <FeeTable
                    refreshTrigger={refreshTable}
                    onViewReceipt={(row) => {
                      setReceiptData(row);
                      setShowReceipt(true);
                    }}
                    onEdit={(row) => {
                      setEditingId(row.id);
                      setForm((prev) => ({
                        ...prev,
                        date: row.date || prev.date,
                        rollNo: row.rollNo || row.roll_no || "",
                        studentName: row.studentName || row.student_name || "",
                        sem: row.sem || row.semester || "",
                        feestype: row.feeType || row.fee_type || "",
                        totalAmount: row.totalAmount || row.total_amount || "",
                        payNow: row.payNow || row.pay_now || "",
                        pendingAmount: row.pendingAmount || row.pending_amount || 0,
                        status: row.status || "",
                        securityCode: row.securityCode || row.security_code || "",
                        academic: row.academic || "",
                        remarks: row.remarks || "",
                        paymentMode: row.payment_mode || row.paymentMode || "Cash",
                        referenceNo: row.reference_no || row.referenceNo || "",
                      }));
                      setAutoLocked(true);
                      setShowReceipt(false);
                      toast.info('Loaded receipt for editing');
                    }}
                    onDelete={() => setRefreshTable((p) => p + 1)}
                    onShowReport={() => setShowReportModal(true)}
                  />
                )}
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
                <h5 className="modal-title">
                  Download Fee Receipts Report
                </h5>
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
                        id="allFees"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="allFees"
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
                        checked={
                          reportForm.reportType === "dateWise"
                        }
                        onChange={handleReportFormChange}
                        id="dateWiseFees"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="dateWiseFees"
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
}
