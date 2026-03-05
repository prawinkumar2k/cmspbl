import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import DataTable from "../../../../../../components/DataTable/DataTable";
import toast, { Toaster } from "react-hot-toast";

const DEPARTMENTS = ["Science", "Commerce", "Arts", "Engineering"];
const SEMS = [1, 2, 3, 4, 5, 6, 7, 8];
const FEE_TYPES = [
  "ADMISSION FEE",
  "ANNUAL DAY FEE",
  "APPLICATION FEE",
  "BOOKS & STATIONARY FEE",
  "BUS FEES",
  "COURSE COMPLETION CERT",
  "EXAM FEE",
  "HOSTEL FEE",
  "INDUSTRIAL VISIT",
  "LABORATORY FEE",
  "MESS FEE",
  "PROJECT FEE",
  "SEMESTER FEE",
  "SEMINAR FEE",
  "UNIFORM FEE"
];
// academic years removed — fees type will be used instead of academic year



export default function StudentFeesForm() {
  // Filter fields
  const [department, setDepartment] = useState("");
  const [sem, setSem] = useState("");
  const [feeType, setFeeType] = useState("");
  const [rollNoRegNo, setRollNoRegNo] = useState("");

  // Table state
  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [receiptSummary, setReceiptSummary] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [paying, setPaying] = useState(false);

  // Options fetched from backend for dropdowns
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [semOptions, setSemOptions] = useState([]);
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);
  const [masterRows, setMasterRows] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const pick = (r, keys) => {
    for (const k of keys) if (r[k] !== undefined && r[k] !== null) return r[k];
    return undefined;
  };

  // Handler functions

  const handleFilterChange = (field, value) => {
    if (field === "rollNoRegNo") {
      setRollNoRegNo(value);
      // When the roll/reg no is cleared, also clear dependent filters
      if (!value) {
        setDepartment("");
        setSem("");
        setFeeType("");
      }
    } else {
      switch (field) {
        case "department":
          setDepartment(value);
          break;
        case "sem":
          setSem(value);
          break;
        case "feeType":
          setFeeType(value);
          break;
        default:
          break;
      }
    }
    console.log("Filter changed:", {
      department,
      sem,
      feeType,
      rollNoRegNo,
    });
  };

  // Fetch master data to populate dropdowns
  useEffect(() => {
    let mounted = true;
    const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);
    const pick = (r, keys) => {
      for (const k of keys) if (r[k] !== undefined && r[k] !== null) return r[k];
      return undefined;
    };

    (async () => {
      setOptionsLoading(true);
      try {
        const res = await fetch("/api/studentFeeMaster/student-fee-master");
        if (!res.ok) throw new Error("Failed to fetch master");
        const json = await res.json();
        const rows = Array.isArray(json) ? json : json.data && Array.isArray(json.data) ? json.data : [];
        setMasterRows(rows || []);
        if (!mounted) return;
        const deps = rows.map((r) => pick(r, ["department", "dept", "Dept_Name", "Dept_Code"])).filter(Boolean);
        const sems = rows.map((r) => pick(r, ["sem", "semester", "Semester"])).filter(Boolean).map((s) => String(s));
        const fees = rows.map((r) => pick(r, ["fee_type", "Fees_Type", "feestype", "feeType"])).filter(Boolean);
        setDepartmentOptions(uniq(deps).sort());
        setSemOptions(uniq(sems).sort((a, b) => Number(a) - Number(b)));
        setFeeTypeOptions(uniq(fees).sort());
      } catch (err) {
        console.error('Failed to load master options', err);
      } finally {
        if (mounted) setOptionsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Update feeTypeOptions whenever department or sem changes (use masterRows cached)
  useEffect(() => {
    if (optionsLoading) return;
    if (!masterRows || masterRows.length === 0) return;
    const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

    // when no department/sem selected, restore full master list
    if (!department && !sem) {
      const fees = masterRows.map((r) => pick(r, ["fee_type", "Fees_Type", "feestype", "feeType"])).filter(Boolean);
      setFeeTypeOptions(uniq(fees).sort());
      return;
    }

    const matched = masterRows.filter((r) => {
      const depVal = pick(r, ["department", "dept", "Dept_Name", "Dept_Code"]);
      const semVal = pick(r, ["sem", "semester", "Semester"]);

      if (department) {
        if (!depVal) return false;
        if (String(depVal).trim().toLowerCase().indexOf(String(department).trim().toLowerCase()) === -1) return false;
      }
      if (sem) {
        if (!semVal) return false;
        if (String(semVal).trim() !== String(sem).trim()) return false;
      }
      return true;
    });

    const fees = matched.map((r) => pick(r, ["fee_type", "Fees_Type", "feestype", "feeType"])).filter(Boolean);
    const list = uniq(fees).sort();
    setFeeTypeOptions(list);
    if (list.length === 0) setFeeType("");
  }, [department, sem, masterRows, optionsLoading]);



  // No mock fee rows — real data should come from backend

  const handleUpdate = () => {
    // Allow fetching by rollNo OR by selected filters
    if (!rollNoRegNo && !department && !sem && !feeType) {
      toast.error("Please enter Roll No / Reg No or select at least one filter");
      return;
    }
    fetchFees();
  };

  // Fetcher used by submit and View Table toggle
  const fetchFees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ registerNumber: rollNoRegNo, department, semester: sem, feeType }).toString();
      const res = await fetch(`/api/studentFeeMaster/student-fee-master?${q}`);
      if (!res || !res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Server error ${res ? res.status : 'unknown'}`);
      }
      const json = await res.json().catch(() => null);
      const rows = Array.isArray(json) ? json : json && json.data && Array.isArray(json.data) ? json.data : [];
      if (rows && rows.length) {
        // Map master fee rows
        const mapped = rows.map((r) => {
          const amount = Number(r.amount || r.Amount || r.AmountPaid || 0) || 0;
          return {
            feeType: (r.fee_type ?? r.Fees_Type ?? r.feeType) || '',
            amount,
            concession: Number(r.concession || r.Concession || 0) || 0,
            // will populate paid/toBePaid/balance after receipts aggregation
            alreadyPaid: 0,
            toBePaid: amount,
            paid: 0,
            balance: amount,
            rollNo: rollNoRegNo || r.Register_Number || r.registerNumber || r.rollNo || r.RollNo || '',
            name: r.Student_Name || r.student_name || r.StudentName || '',
            department: r.dept || r.Department || r.Dept_Name || department,
            sem: r.sem || r.Semester || sem,
          };
        });

        // If a register number is provided, fetch fee receipts to compute paid/pending per fee type
        let receiptsByType = {};
        if (rollNoRegNo) {
          try {
            const qr = new URLSearchParams({ registerNumber: rollNoRegNo }).toString();
            const pres = await fetch(`/api/fee-receipt?${qr}`);
            if (pres && pres.ok) {
              const pjson = await pres.json().catch(() => null);
              const prow = Array.isArray(pjson) ? pjson : pjson && pjson.data && Array.isArray(pjson.data) ? pjson.data : [];
              prow.forEach(pr => {
                const ftRaw = (pr.Fees_Type ?? pr.fee_type ?? pr.feeType) || 'ALL';
                const key = String(ftRaw).trim().toLowerCase();
                const paidVal = Number(pr.paid_amount || pr.paid || pr.pay_now || pr.amount_paid || pr.paidAmount || 0) || 0;
                const pendingVal = Number(pr.pending_amount || pr.pending || pr.pendingAmount || 0) || 0;
                const totalVal = Number(pr.total_amount || pr.total || pr.Amount || pr.amount || 0) || 0;
                if (!receiptsByType[key]) receiptsByType[key] = { paid: 0, pending: 0, total: 0 };
                receiptsByType[key].paid += paidVal;
                receiptsByType[key].pending += pendingVal;
                receiptsByType[key].total += totalVal;
                // also accumulate into 'all' bucket
                if (!receiptsByType['all']) receiptsByType['all'] = { paid: 0, pending: 0, total: 0 };
                receiptsByType['all'].paid += paidVal;
                receiptsByType['all'].pending += pendingVal;
                receiptsByType['all'].total += totalVal;
              });
              // after building receiptsByType, set student-level summary
              const all = receiptsByType['all'] || { paid: 0, pending: 0, total: 0 };
              setReceiptSummary({ paid: all.paid || 0, pending: all.pending || 0, total: all.total || 0 });
              // default pay amount to pending if present
              setPayAmount(all.pending || Math.max(0, (all.total || 0) - (all.paid || 0)) || 0);
            }
          } catch (err) {
            console.error('fee-receipt fetch failed', err);
          }
        }

        // Apply receipts to mapped rows: populate explicit paid_amount and pending_amount
        const applied = mapped.map(row => {
          const key = String((row.feeType || '')).trim().toLowerCase();
          const rec = receiptsByType[key] || receiptsByType['all'] || { paid: 0, pending: 0, total: 0 };
          const paidAmount = Number(rec.paid || rec.paid_amount || 0);
          const pendingAmount = Number(rec.pending || rec.pending_amount || 0);
          const amount = Number(row.amount) || 0;
          const computedPending = pendingAmount || Math.max(0, amount - paidAmount);
          const balance = computedPending;
          return { ...row, paid_amount: paidAmount, pending_amount: computedPending, paid: paidAmount, pendingAmount: computedPending, balance };
        });

        // Apply client-side filtering so only selected department/sem/feeType/roll show
        const normalize = (v) => (v === null || typeof v === 'undefined') ? '' : String(v).trim().toLowerCase();
        const filtered = applied.filter((row) => {
          if (department) {
            const depRow = normalize(row.department);
            const depSel = normalize(department);
            if (!depRow || (!depRow.includes(depSel) && depRow !== depSel)) return false;
          }
          if (sem) {
            const semRow = normalize(row.sem);
            if (!semRow || semRow !== String(sem).trim()) return false;
          }
          if (feeType) {
            const ftRow = normalize(row.feeType);
            const ftSel = normalize(feeType);
            if (!ftRow || (!ftRow.includes(ftSel) && ftRow !== ftSel)) return false;
          }
          if (rollNoRegNo) {
            const rn = normalize(row.rollNo);
            if (!rn || !rn.includes(String(rollNoRegNo).trim().toLowerCase())) return false;
          }
          return true;
        });

        setStudents(filtered);
        setStudentsCount(filtered.length);
        setCurrentFilters({ rollNoRegNo, department, sem, feeType });
        setShowTable(true);
        setError(null);
        setLoading(false);
        return;
      }
      // no rows found — try fetching receipts directly (useful when receipts exist but master rows don't)
      if (rollNoRegNo) {
        try {
          const qr = new URLSearchParams({ registerNumber: rollNoRegNo }).toString();
          const pres = await fetch(`/api/fee-receipt?${qr}`);
          if (pres && pres.ok) {
            const pjson = await pres.json().catch(() => null);
            const prow = Array.isArray(pjson) ? pjson : pjson && pjson.data && Array.isArray(pjson.data) ? pjson.data : [];
            if (prow && prow.length) {
              const mappedReceipts = prow.map(pr => {
                const feeType = pr.Fees_Type ?? pr.fee_type ?? pr.feeType ?? 'ALL';
                const amount = Number(pr.total_amount || pr.total || pr.Amount || pr.amount || 0) || 0;
                const paid_amount = Number(pr.paid_amount || pr.pay_now || pr.paid || pr.amount_paid || pr.paidAmount || 0) || 0;
                const pending_amount = Number(pr.pending_amount || pr.pending || pr.pendingAmount || 0) || Math.max(0, amount - paid_amount);
                return {
                  feeType,
                  amount,
                  paid_amount,
                  pending_amount,
                  paid: paid_amount,
                  pendingAmount: pending_amount,
                  balance: pending_amount,
                  rollNo: pr.roll_no || pr.Register_Number || pr.registerNumber || pr.rollNo || '',
                  name: pr.student_name || pr.Student_Name || '',
                  department: pr.dept || pr.Department || '',
                  sem: pr.sem || pr.Semester || '',
                };
              });
              setStudents(mappedReceipts);
              setStudentsCount(mappedReceipts.length);
              setCurrentFilters({ rollNoRegNo, department, sem, feeType });
              setShowTable(true);
              setError(null);
              setLoading(false);
              const all = mappedReceipts.reduce((acc, cur) => { acc.paid += Number(cur.paid_amount || 0); acc.pending += Number(cur.pending_amount || 0); acc.total += Number(cur.amount || 0); return acc; }, { paid: 0, pending: 0, total: 0 });
              setReceiptSummary({ paid: all.paid, pending: all.pending, total: all.total });
              setPayAmount(all.pending || Math.max(0, all.total - all.paid) || 0);
              return;
            }
          }
        } catch (err) {
          console.error('fee-receipt fallback failed', err);
        }
      }
      // no rows found at all
      setStudents([]);
      setStudentsCount(0);
      setCurrentFilters({ rollNoRegNo, department, sem, feeType });
      setShowTable(true);
      setLoading(false);
      setError("No records found. Adjust filters and click 'View Table' again.");
      toast("No records found");
    } catch (err) {
      console.error('fetchFees error:', err);
      setStudents([]);
      setStudentsCount(0);
      setShowTable(true);
      setLoading(false);
      setError("Failed to fetch student fees");
      toast.error("Failed to fetch student fees");
    }
  }, [rollNoRegNo, department, sem, feeType]);

  const handleClose = () => {
    setDepartment("");
    setSem("");
    setFeeType("");
    setRollNoRegNo("");
    setStudentsCount(0);
    setStudents([]);
    setShowTable(false);
    setCurrentFilters(null);
    setReceiptSummary(null);
    setPayAmount(0);
    console.log("Form closed");
  };

  const handleUpdateBalance = () => {
    console.log("Update Balance clicked");
  };

  // 🔹 When clicking View Table, show table (no mock data)
  const handleToggleTable = () => {
    if (showTable) {
      setShowTable(false);
      return;
    }
    // when showing table, fetch with current filters
    fetchFees();
  };

  const handlePay = useCallback(async () => {
    if (!rollNoRegNo) {
      toast.error('Enter Register No to pay');
      return;
    }
    const amt = Number(payAmount) || 0;
    if (amt <= 0) {
      toast.error('Enter a valid pay amount');
      return;
    }
    setPaying(true);
    try {
      const payload = { registerNumber: rollNoRegNo, pay_now: amt };
      const res = await fetch('/api/fee-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `Server error ${res.status}`);
      }
      await res.json().catch(() => null);
      toast.success('Payment recorded');
      // refresh fees and receipts
      await fetchFees();
    } catch (err) {
      console.error('Payment failed', err);
      toast.error('Payment failed');
    } finally {
      setPaying(false);
    }
  }, [rollNoRegNo, payAmount, fetchFees]);

  // DataTable columns (SendTable style)
  // Updated columns for fee details
  const columns = [
    {
      accessorKey: 'name',
      header: 'Student Name',
      cell: ({ row }) => <span className="fw-medium">{row?.original?.name || '-'}</span>,
    },
    {
      accessorKey: 'rollNo',
      header: 'Register No',
      cell: ({ row }) => <div>{row?.original?.rollNo || '-'}</div>,
    },
    {
      accessorKey: 'department',
      header: 'Department Name',
      cell: ({ row }) => <div>{row?.original?.department || '-'}</div>,
    },
    {
      accessorKey: 'feeType',
      header: 'Fees Type',
      cell: ({ row }) => <div className="fw-medium">{row?.original?.feeType || '-'}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div className="fw-medium text-success">₹{Number(row?.original?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>,
    },
    // 'Paid' column removed as requested
    {
      accessorKey: 'pending_amount',
      header: 'Pending',
      cell: ({ row }) => {
        const v = row?.original?.pending_amount ?? row?.original?.pendingAmount ?? row?.original?.balance ?? 0;
        return <div>₹{Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>;
      }
    },
  ];

  // Actions (SendTable style)
  const handleView = (student) => { toast.success(`Viewing: ${student.name} - ${student.rollNo}`); };
  const handleEdit = (student) => { toast.success(`Edit: ${student.name} - ${student.rollNo}`); };
  const handleDelete = (student) => {
    toast((t) => (
      <div>
        <p className="mb-2">Delete student: {student.name} - {student.rollNo}?</p>
        <div className="d-flex gap-2">
          <button className="btn btn-danger btn-sm" onClick={() => { setStudents(prev => prev.filter(l => l.rollNo !== student.rollNo)); toast.dismiss(t.id); toast.success('Deleted'); }}>Delete</button>
          <button className="btn btn-secondary btn-sm" onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const actions = [
    { key: 'view', label: 'View', onClick: handleView, className: 'btn btn-sm btn-outline-primary me-1' },
    { key: 'edit', label: 'Edit', onClick: handleEdit, className: 'btn btn-sm btn-outline-warning me-1' },
    { key: 'delete', label: 'Delete', onClick: handleDelete, className: 'btn btn-sm btn-outline-danger' }
  ];

  return (
    <>
      <Toaster position="top-right" />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Student Fees Form</h6>
              <div>
                <button
                  type="button"
                  className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                  onClick={handleToggleTable}
                >
                  <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`} />
                  {showTable ? 'Hide Table' : 'View Table'}
                </button>
              </div>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">
                    Student Fees Filter
                  </h6>
                </div>
              </div>

              <div className="card-body p-24">
                <form
                  className="row g-3 align-items-end mb-3"
                  onSubmit={(e) => e.preventDefault()}
                >

                  {/* Roll No / Reg No Input */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Roll No / Reg No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={rollNoRegNo}
                      onChange={(e) =>
                        handleFilterChange("rollNoRegNo", e.target.value)
                      }
                      placeholder="Enter Roll No / Reg No"
                    />
                  </div>


                  {/* Department Dropdown */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) =>
                        handleFilterChange("department", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {(departmentOptions.length ? departmentOptions : DEPARTMENTS).map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Dropdown */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Sem</label>
                    <select
                      className="form-select"
                      value={sem}
                      onChange={(e) => handleFilterChange("sem", e.target.value)}
                    >
                      <option value="">Select</option>
                      {(semOptions.length ? semOptions : SEMS).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>





                  {/* Fees Type Dropdown (replaces Academic Year) */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Fees Type</label>
                    <select
                      className="form-select"
                      value={feeType}
                      onChange={(e) => handleFilterChange("feeType", e.target.value)}
                    >
                      <option value="">Select</option>
                      {optionsLoading ? (
                        <option value="">Loading...</option>
                      ) : (feeTypeOptions && feeTypeOptions.length > 0) ? (
                        feeTypeOptions.map((ft) => (
                          <option key={ft} value={ft}>{ft}</option>
                        ))
                      ) : (department || sem) ? (
                        <option value="" disabled>No fees type available</option>
                      ) : (
                        FEE_TYPES.map((ft) => <option key={ft} value={ft}>{ft}</option>)
                      )}
                    </select>
                  </div>


                  {/* UPDATE Button */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="button"
                      className="btn btn-outline-primary w-10"
                      onClick={handleUpdate}
                    >
                      SUBMIT
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger w-10"
                      onClick={handleClose}
                    >
                      CLOSE
                    </button>
                  </div>


                </form>




                {/* DataTable – SendTable style */}
                {showTable && (
                  <div className="mt-3">
                    {currentFilters && (
                      <div className="mb-3 p-3 border rounded bg-white">
                        <div className="d-flex flex-wrap gap-3">
                          <div><strong>Roll/Reg:</strong> {currentFilters.rollNoRegNo || '-'}</div>
                          <div><strong>Department:</strong> {currentFilters.department || '-'}</div>
                          <div><strong>Sem:</strong> {currentFilters.sem || '-'}</div>
                          <div><strong>Fees Type:</strong> {currentFilters.feeType || '-'}</div>
                          <div><strong>Results:</strong> {studentsCount}</div>
                        </div>
                      </div>
                    )}

                    {receiptSummary && (
                      <div className="mb-3 p-3 border rounded bg-white">
                        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                          <div><strong>Paid:</strong> ₹{Number(receiptSummary.paid || 0).toLocaleString('en-IN')}</div>
                          <div><strong>Pending:</strong> ₹{Number(receiptSummary.pending || 0).toLocaleString('en-IN')}</div>
                          <div><strong>Total:</strong> ₹{Number(receiptSummary.total || 0).toLocaleString('en-IN')}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input type="number" className="form-control form-control-sm" style={{ width: 160 }} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} min="0" />
                            <button className="btn btn-sm btn-primary" disabled={paying} onClick={handlePay}>{paying ? 'Paying...' : 'Pay'}</button>
                          </div>
                        </div>
                      </div>
                    )}

                    <DataTable
                      data={students}
                      columns={columns}
                      loading={loading}
                      error={error}
                      title="Student Fees Table"
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      actions={actions}
                      enableExport
                      enableSelection
                      pageSize={10}
                    />
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
