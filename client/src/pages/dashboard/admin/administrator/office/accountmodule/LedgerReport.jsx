// NOTE: Keep styles/layout identical to FeeRecipt.jsx — reuse classes or import styles from FeeRecipt.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";

// LedgerReport: frontend-only report page
// Matches FeeRecipt.jsx visual style and layout. No backend code is added.
export default function LedgerReport() {
  // --- Filters ---
  const [academicYear, setAcademicYear] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactionType, setTransactionType] = useState('All');
  const [accountNo, setAccountNo] = useState('');
  const [feeType, setFeeType] = useState('');
  const [includeZero, setIncludeZero] = useState(false);
  const [sortBy, setSortBy] = useState('Date');
  const [outputFormat, setOutputFormat] = useState('Preview');
  const [reportTitle, setReportTitle] = useState('');
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeRunning, setIncludeRunning] = useState(true);
  const [includeRemarks, setIncludeRemarks] = useState(true);

  // --- State ---
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedAt, setGeneratedAt] = useState(null);

  const printRef = useRef(null);

  // --- Options (can be populated by backend later) ---
  const ACADEMIC_YEARS = ['2023-24', '2024-25', '2025-26'];
  const DEPARTMENTS = ['Science', 'Commerce', 'Arts', 'Engineering'];
  const COURSE_MAP = {
    Science: ['B.Sc', 'B.Pharm'],
    Commerce: ['B.Com'],
    Arts: ['B.A'],
    Engineering: ['B.E', 'B.Tech']
  };
  const ALL_FEE_TYPES = ['Tuition', 'Library', 'Transport', 'Hostel', 'Exam Fees'];
  // Dropdown option sets (kept in one place like FeeType.jsx)
  const TRANSACTION_TYPES = ['All', 'Debit', 'Credit', 'Adjustment', 'Refund'];
  const SORT_OPTIONS = ['Date', 'Student Name', 'Amount Desc', 'Amount Asc'];
  const OUTPUT_FORMATS = ['Preview', 'Printable View', 'CSV'];
  const SECTIONS = ['A', 'B', 'C', 'D'];
  const CLASSES = ['1','2','3','4','5','6','7','8'];

  // --- Validation ---
  const validationErrors = {};
  //if (!academicYear) validationErrors.academicYear = 'Academic Year is required.';
  if (!fromDate) validationErrors.fromDate = 'From Date is required.';
  if (!toDate) validationErrors.toDate = 'To Date is required.';
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) validationErrors.dateRange = 'From Date cannot be after To Date.';

  const canGenerate = Object.keys(validationErrors).length === 0 && !loading;

  // --- Mock fallback ---
  function generateMockLedgerReport(filters) {
    // TODO: replace fallback with project integration getLedgerReport(filters)
    // Return ledgerData structure with rows, meta, and summary totals.
    const rows = [];
    const meta = { filters, generatedAt: new Date().toISOString() };
    const summary = { totalDebit: 0, totalCredit: 0, closingBalance: 0 };
    return { rows, meta, summary };
  }

  // --- Integration attempt ---
  async function tryGetLedgerReport(filters) {
    // NOTE: avoid static dynamic import here because Vite will try to resolve the path at build-time
    // and fail if the file doesn't exist. Instead, integration modules should expose an API on
    // `window.projectIntegration` (or similar) at app startup. Example (in your app entry):
    // import * as projectIntegration from './services/projectIntegration';
    // window.projectIntegration = projectIntegration;
    // Then this function can safely call the helper at runtime if present.
    try {
      if (typeof window !== 'undefined' && window.projectIntegration && typeof window.projectIntegration.getLedgerReport === 'function') {
        return await window.projectIntegration.getLedgerReport(filters);
      }
    } catch (err) {
      // ignore and fall back
      console.error('Integration helper threw:', err);
    }

    // Fallback to local mock implementation
    return generateMockLedgerReport(filters);
  }

  // // --- Quick presets ---
  // const handleQuickPreset = (preset) => {
  //   const today = new Date();
  //   let from = today.toISOString().slice(0,10);
  //   let to = today.toISOString().slice(0,10);
  //   if (preset === 'This Month') {
  //     const d = new Date();
  //     from = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10);
  //     to = new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().slice(0,10);
  //   } else if (preset === 'This Quarter') {
  //     const d = new Date();
  //     const q = Math.floor(d.getMonth()/3);
  //     from = new Date(d.getFullYear(), q*3, 1).toISOString().slice(0,10);
  //     to = new Date(d.getFullYear(), q*3+3, 0).toISOString().slice(0,10);
  //   }
  //   setFromDate(from); setToDate(to);
  // };

  // --- Generate report ---
  const handleGenerate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    if (!canGenerate) return setError('Please fix validation errors.');
    const filters = { academicYear, department, course, studentQuery, fromDate, toDate, transactionType, accountNo, feeType, includeZero, sortBy, outputFormat, reportTitle, sections: { includeSummary, includeDetails, includeRunning, includeRemarks } };
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // 500ms skeleton
    try {
      const data = await tryGetLedgerReport(filters);
      // ensure structure
      setLedgerData(data || generateMockLedgerReport(filters));
      setGeneratedAt(new Date());
    } catch (err) {
      console.error(err);
      setError('Failed to generate report');
      setLedgerData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAcademicYear(''); setDepartment(''); setCourse(''); setStudentQuery(''); setFromDate(''); setToDate(''); setTransactionType('All'); setAccountNo(''); setFeeType(''); setIncludeZero(false); setSortBy('Date'); setOutputFormat('Preview'); setReportTitle(''); setIncludeSummary(true); setIncludeDetails(true); setIncludeRunning(true); setIncludeRemarks(true); setLedgerData(null); setError(''); setGeneratedAt(null);
  };

  // --- Export CSV ---
  const handleExportCSV = () => {
    if (!ledgerData || !ledgerData.rows || ledgerData.rows.length === 0) return alert('No data to export');
    const headers = ['Date','VoucherNo','Student','Description','Debit','Credit','RunningBalance','Remarks'];
    const lines = [headers.join(',')];
    for (const r of ledgerData.rows) {
      const row = [r.date||'', r.voucherNo||'', r.student||'', (r.description||'').replace(/\n/g,' '), r.debit||0, r.credit||0, r.runningBalance||0, (r.remarks||'').replace(/,/g,'')];
      lines.push(row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `LedgerReport_${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // --- Printable view ---
  const handlePrintableView = () => {
    const node = printRef.current;
    if (!node) return alert('No report to print');
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return alert('Pop-up blocked.');
    const style = `@media print{ body{font-family: Arial, Helvetica, sans-serif;} }`;
    w.document.open();
    w.document.write(`<!doctype html><html><head><title>Ledger Report</title><style>${style}</style></head><body>${node.innerHTML}<script>setTimeout(()=>window.print(),200);</script></body></html>`);
    w.document.close();
  };

  // --- Download PDF TODO (do not include external scripts) ---
  const handleDownloadPDF = () => {
    // TODO: call html2pdf(document.getElementById('ledgerPrintArea')) when html2pdf is available in the project (do not load external scripts here)
    alert('PDF export is a TODO — integrate html2pdf in the future.');
  };

  // --- Row action: toggle reconciled ---
  const toggleReconciled = (idx) => {
    if (!ledgerData || !ledgerData.rows) return;
    const rows = ledgerData.rows.map((r,i) => i===idx ? { ...r, reconciled: !r.reconciled } : r);
    const totalDebit = rows.reduce((s,r) => s + (Number(r.debit||0)), 0);
    const totalCredit = rows.reduce((s,r) => s + (Number(r.credit||0)), 0);
    const closingBalance = totalDebit - totalCredit;
    setLedgerData({ ...ledgerData, rows, summary: { totalDebit, totalCredit, closingBalance } });
  };

  // --- Render ---
  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Ledger Report</h6>
          </div>

          <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h6 className="text-lg fw-semibold mb-2">Generate Ledger Report</h6>
              </div>
            </div>

            <div className="card-body p-24">
              <form className="row g-3 align-items-end mb-3" onSubmit={handleGenerate} aria-label="Ledger Filter Form">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Academic Year</label>
                  <select className="form-select" value={academicYear} onChange={e=>setAcademicYear(e.target.value)} required>
                    <option value="">Select</option>
                    {ACADEMIC_YEARS.map(y=> <option key={y} value={y}>{y}</option>)}
                  </select>
                  {validationErrors.academicYear && <div className="text-danger mt-1">{validationErrors.academicYear}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Department</label>
                  <select className="form-select" value={department} onChange={e=>{ setDepartment(e.target.value); setCourse(''); }}>
                    <option value="">Select</option>
                    {DEPARTMENTS.map(d=> <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Course / Class</label>
                  <select className="form-select" value={course} onChange={e=>setCourse(e.target.value)}>
                    <option value="">Select</option>
                    {(department ? (COURSE_MAP[department]||[]) : []).map(c=> <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Student Name / Reg No</label>
                  <input className="form-control" type="text" value={studentQuery} onChange={e=>setStudentQuery(e.target.value)} placeholder="Search student or reg no" />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">From</label>
                  <input className="form-control" type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} required />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">To</label>
                  <input className="form-control" type="date" value={toDate} onChange={e=>setToDate(e.target.value)} required />
                </div>

                {/* <div className="col-md-3 d-flex align-items-center">
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>{ handleQuickPreset('Today'); }}>Today</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>{ handleQuickPreset('This Month'); }}>This Month</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>{ handleQuickPreset('This Quarter'); }}>This Quarter</button>
                  </div>
                </div> */}

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Transaction Type</label>
                  <select className="form-select" value={transactionType} onChange={e=>setTransactionType(e.target.value)}>
                    {TRANSACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Account / Receipt No</label>
                  <input className="form-control" type="text" value={accountNo} onChange={e=>setAccountNo(e.target.value)} />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Fee Type</label>
                  <select className="form-select" value={feeType} onChange={e=>setFeeType(e.target.value)}>
                    <option value="">Select</option>
                    {ALL_FEE_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* <div className="col-md-3 d-flex align-items-center">
                  <input id="incZero2" name="incZero" type="checkbox" className="form-check-input me-2" checked={includeZero} onChange={e=>setIncludeZero(e.target.checked)} />
                  <label className="form-check-label fw-semibold" htmlFor="incZero2">Include Zero-Balance Rows</label>
                </div> */}

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Sort By</label>
                  <select className="form-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Output Format</label>
                  <select className="form-select" value={outputFormat} onChange={e=>setOutputFormat(e.target.value)}>
                    {OUTPUT_FORMATS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold">Report Title</label>
                  <input className="form-control" type="text" value={reportTitle} onChange={e=>setReportTitle(e.target.value)} placeholder="Optional" />
                </div>

                
                <div className="col-md-12 d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-primary" disabled={!canGenerate}>{loading ? 'Generating...' : 'Generate Report'}</button>
                  <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
                  
                </div>
              </form>

              {error && <div className="text-danger mb-3">{error}</div>}

              <div id="ledgerPrintArea" ref={printRef}>
                {loading && <div className="skeleton-loader my-4">Loading report...</div>}

                {!loading && ledgerData && (
                  <div style={{ marginTop: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                      <button className="btn btn-outline-primary" onClick={handlePrintableView}>Print</button>
                      <button className="btn btn-outline-danger" onClick={handleDownloadPDF}>Download PDF</button>
                      <button className="btn btn-outline-success" onClick={handleExportCSV}>Export CSV</button>
                    </div>
                    <div style={{ position: "relative", margin: "2rem auto", maxWidth: "900px", background: "#fff", borderRadius: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "2rem" }}>
                      {/* Watermark */}
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-20deg)", color: "#e5e7eb", fontSize: "2.5rem", fontWeight: "bold", opacity: 0.18, pointerEvents: "none", zIndex: 0, whiteSpace: "nowrap" }}>COLLEGE MANAGEMENT SYSTEM</div>
                      {/* College Logo and Header */}
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem", zIndex: 1, position: "relative" }}>
                        <img src="/assets/images/GRT.png" alt="College Logo" style={{ height: "60px", marginRight: "1rem" }} />
                        <div>
                          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</h2>
                          <div style={{ fontSize: "1rem", color: "#374151" }}>Ledger Report</div>
                        </div>
                      </div>
                      <hr style={{ margin: "1rem 0" }} />
                      <div style={{ zIndex: 1, position: "relative" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <tbody>
                            <tr><td style={{ fontWeight: 600, width: "40%" }}>Academic Year:</td><td>{academicYear}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Department:</td><td>{department}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Course/Class:</td><td>{course}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Student Name/Reg No:</td><td>{studentQuery}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>From Date:</td><td>{fromDate}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>To Date:</td><td>{toDate}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Transaction Type:</td><td>{transactionType}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Account/Receipt No:</td><td>{accountNo}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Fee Type:</td><td>{feeType}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Sort By:</td><td>{sortBy}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Report Title:</td><td>{reportTitle || '-'}</td></tr>
                          </tbody>
                        </table>
                        <hr style={{ margin: "1rem 0" }} />
                        {/* Summary Totals */}
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                          <tbody>
                            <tr>
                              <td style={{ fontWeight: 600 }}>Total Debit:</td>
                              <td>₹{(ledgerData.summary?.totalDebit||0).toFixed(2)}</td>
                              <td style={{ fontWeight: 600 }}>Total Credit:</td>
                              <td>₹{(ledgerData.summary?.totalCredit||0).toFixed(2)}</td>
                              <td style={{ fontWeight: 600 }}>Closing Balance:</td>
                              <td>₹{(ledgerData.summary?.closingBalance||0).toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                        {/* Ledger Table */}
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Voucher/Receipt No</th>
                              <th>Student/Account</th>
                              <th>Description</th>
                              <th className="text-end">Debit</th>
                              <th className="text-end">Credit</th>
                              {includeRunning && <th className="text-end">Running Balance</th>}
                              {includeRemarks && <th>Remarks</th>}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!ledgerData.rows || ledgerData.rows.length === 0) && (
                              <tr><td colSpan={includeRunning ? 9 : 8} className="text-center text-muted">No transactions found for selected filters.</td></tr>
                            )}
                            {ledgerData.rows && ledgerData.rows.map((r, idx) => (
                              <tr key={idx} className={r.reconciled ? 'table-success' : ''}>
                                <td>{r.date}</td>
                                <td>{r.voucherNo}</td>
                                <td>{r.student}</td>
                                <td>{r.description}</td>
                                <td className="text-end">{r.debit ? Number(r.debit).toFixed(2) : ''}</td>
                                <td className="text-end">{r.credit ? Number(r.credit).toFixed(2) : ''}</td>
                                {includeRunning && <td className="text-end">{r.runningBalance != null ? Number(r.runningBalance).toFixed(2) : ''}</td>}
                                {includeRemarks && <td>{r.remarks || ''}</td>}
                                <td><button type="button" className="btn btn-sm btn-outline-success" onClick={()=>toggleReconciled(idx)}>{r.reconciled ? 'Undo' : 'Mark Reconciled'}</button></td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="fw-semibold">
                              <td colSpan={includeRunning ? 4 : 4} className="text-end">Totals</td>
                              <td className="text-end">{(ledgerData.summary?.totalDebit||0).toFixed(2)}</td>
                              <td className="text-end">{(ledgerData.summary?.totalCredit||0).toFixed(2)}</td>
                              {includeRunning && <td className="text-end">{(ledgerData.summary?.closingBalance||0).toFixed(2)}</td>}
                              {includeRemarks && <td></td>}
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

               
              </div>
            </div>

           
          </div>
        </div>
         <Footer />
      </div>
    </section>
  );
}
