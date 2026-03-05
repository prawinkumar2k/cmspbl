import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';

const LEDGER_TYPES = ['All', 'Tuition', 'Transport', 'Exam', 'Others'];
const TRANSACTION_MODES = ['All', 'Cash', 'Online', 'Card', 'Cheque'];
const TRANSACTION_STATUS = ['All', 'Successful', 'Failed', 'Pending'];

const INITIAL_FILTERS = {
  academic: '',
  department: '',
  classYear: '',
  section: '',
  fromDate: '',
  toDate: '',
  registerNo: '',
  studentName: '',
  ledgerType: 'All',
  transactionMode: 'All',
  transactionStatus: 'All',
  minAmount: '',
  maxAmount: '',
  // advanced
  paymentRef: '',
  bankName: '',
  collector: ''
};

export default function TransactionDetails() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // keep empty as placeholder (no dummy data)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [detailModal, setDetailModal] = useState({ open: false, row: null });
  const printAreaRef = useRef(null);

  useEffect(() => {
    // placeholder: could load dropdown options here in future
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    setResults([]);
    setPage(1);
    setSelected(new Set());
    setSelectAll(false);
  };

  // Placeholder async fetch -- integrate backend later
  const fetchTransactions = async (f) => {
    // Example: return await fetch('/api/transactions', { method: 'POST', body: JSON.stringify(f) })
    // For now return empty array to comply with "no dummy data" requirement
    return [];
  };

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    setSelected(new Set());
    setSelectAll(false);
    try {
      const data = await fetchTransactions(filters);
      // keep empty per requirements; if integrated, set data
      setResults(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
    setLoading(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      const ids = new Set(results.map((r, i) => i));
      setSelected(ids);
      setSelectAll(true);
    }
  };

  const toggleSelectRow = (idx) => {
    const s = new Set(selected);
    if (s.has(idx)) s.delete(idx); else s.add(idx);
    setSelected(s);
    setSelectAll(s.size === results.length && results.length > 0);
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
    // client-side sort placeholder: if results available, apply sort
    if (results.length > 0) {
      const sorted = [...results].sort((a,b) => {
        const av = a[field] ?? '';
        const bv = b[field] ?? '';
        if (av < bv) return sortOrder === 'asc' ? -1 : 1;
        if (av > bv) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      setResults(sorted);
    }
  };

  // Pagination controls (UI-only)
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const pagedResults = results.slice((page-1)*pageSize, page*pageSize);

  const formatCurrency = (v) => {
    if (v === null || v === undefined || v === '') return '-';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(v));
  };
  // Aggregates computation removed — provide from server in future integration

  const openDetails = (row) => {
    setDetailModal({ open: true, row });
  };

  const closeDetails = () => setDetailModal({ open: false, row: null });

  const printModal = () => {
    if (!detailModal.row) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) { alert('Pop-up blocked. Allow pop-ups to print.'); return; }
    const html = `<html><head><title>Transaction Details</title></head><body>${escapeHtml(JSON.stringify(detailModal.row, null, 2)).replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')}</body></html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.print();
  };

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const exportCSV = () => {
    // placeholder: implement CSV export of `results` filtered by selection
    alert('Export CSV placeholder — implement server/client export here.');
  };

  const exportPDF = () => {
    // placeholder: implement PDF export
    alert('Export PDF placeholder — implement PDF generation here.');
  };

  return (
    <>
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Transaction Details</h6>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3 no-print">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Filters</h6>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={exportCSV}>Export CSV</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={exportPDF}>Export PDF</button>
                  <button className="btn btn-sm btn-outline-info" onClick={() => window.print()}>Print Report</button>
                </div>
              </div>

              <div className="card-body p-24">
                {/* Filter Panel */}
                <div className="row g-3 align-items-end mb-3 no-print">
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Academic Year</label>
                    <select name="academic" value={filters.academic} onChange={handleChange} className="form-select">
                      <option value="">Select</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Department</label>
                    <select name="department" value={filters.department} onChange={handleChange} className="form-select">
                      <option value="">Select</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Class / Year</label>
                    <select name="classYear" value={filters.classYear} onChange={handleChange} className="form-select">
                      <option value="">Select</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Section</label>
                    <select name="section" value={filters.section} onChange={handleChange} className="form-select">
                      <option value="">Select</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">From Date</label>
                    <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">To Date</label>
                    <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} className="form-control" />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Register No / Roll No</label>
                    <input type="text" name="registerNo" value={filters.registerNo} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Student Name</label>
                    <input type="text" name="studentName" value={filters.studentName} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Ledger Type</label>
                    <select name="ledgerType" value={filters.ledgerType} onChange={handleChange} className="form-select">
                      {LEDGER_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Transaction Mode</label>
                    <select name="transactionMode" value={filters.transactionMode} onChange={handleChange} className="form-select">
                      {TRANSACTION_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Transaction Status</label>
                    <select name="transactionStatus" value={filters.transactionStatus} onChange={handleChange} className="form-select">
                      {TRANSACTION_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Min Amount</label>
                    <input type="number" name="minAmount" value={filters.minAmount} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Max Amount</label>
                    <input type="number" name="maxAmount" value={filters.maxAmount} onChange={handleChange} className="form-control" />
                  </div>
                <div></div>
                  <div className="col-md-12 d-flex gap-2 mt-2">
                    <button type="button" className="btn btn-primary" onClick={handleSearch}>Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
                    <button type="button" className="btn btn-outline-info" onClick={() => setShowAdvanced(prev => !prev)}>
                      {showAdvanced ? 'Hide Advanced Filters' : 'Advanced Filters'}
                    </button>
                  </div>
                </div>

                {showAdvanced && (
                  <div className="mb-3 p-3 border rounded bg-light no-print">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Payment Reference / Transaction ID</label>
                        <input type="text" name="paymentRef" value={filters.paymentRef} onChange={handleChange} className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Bank Name</label>
                        <input type="text" name="bankName" value={filters.bankName} onChange={handleChange} className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Collector / Operator</label>
                        <input type="text" name="collector" value={filters.collector} onChange={handleChange} className="form-control" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Aggregates removed per request */}

                {/* Bulk actions removed per request */}

                {/* Table
                <div className="table-responsive">
                  {loading ? (
                    <div className="p-4 border rounded">Loading Transactions...</div>
                  ) : (
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th></th>
                          <th onClick={() => handleSort('datetime')} style={{ cursor: 'pointer' }}>Date & Time</th>
                          <th onClick={() => handleSort('transactionId')} style={{ cursor: 'pointer' }}>Transaction ID / Reference</th>
                          <th onClick={() => handleSort('registerNo')} style={{ cursor: 'pointer' }}>Register No</th>
                          <th onClick={() => handleSort('studentName')} style={{ cursor: 'pointer' }}>Student Name</th>
                          <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>Department</th>
                          <th onClick={() => handleSort('classSection')} style={{ cursor: 'pointer' }}>Class / Section</th>
                          <th onClick={() => handleSort('ledgerType')} style={{ cursor: 'pointer' }}>Ledger Type</th>
                          <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>Amount</th>
                          <th onClick={() => handleSort('mode')} style={{ cursor: 'pointer' }}>Transaction Mode</th>
                          <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status</th>
                          <th>Remarks</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.length === 0 ? (
                          <tr>
                            <td colSpan={13} className="text-center py-4">No Transactions Found</td>
                          </tr>
                        ) : (
                          pagedResults.map((r, idx) => {
                            const globalIdx = (page-1)*pageSize + idx;
                            return (
                              <tr key={globalIdx}>
                                <td><input type="checkbox" checked={selected.has(globalIdx)} onChange={() => toggleSelectRow(globalIdx)} /></td>
                                <td>{r.datetime || '--'}</td>
                                <td>{r.transactionId || '--'}</td>
                                <td>{r.registerNo || '--'}</td>
                                <td>{r.studentName || '--'}</td>
                                <td>{r.department || '--'}</td>
                                <td>{r.classSection || '--'}</td>
                                <td>{r.ledgerType || '--'}</td>
                                <td>{formatCurrency(r.amount)}</td>
                                <td>{r.mode || '--'}</td>
                                <td>{r.status || '--'}</td>
                                <td>{r.remarks || '--'}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openDetails(r)}>View Details</button>
                                  <button className="btn btn-sm btn-outline-danger" disabled>Refund / Reverse</button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}
                </div> */}

                {/* Pagination controls */}
                {/* <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="d-flex gap-2 align-items-center">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <label className="mb-0">Page Size</label>
                    <select className="form-select w-auto" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
                      {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div> */}

                <Footer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {detailModal.open && (
        <div className="modal-backdrop show" style={{ display: 'block' }}>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Transaction Details</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeDetails}></button>
                </div>
                <div className="modal-body printable-modal" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  <div><strong>Transaction ID:</strong> {detailModal.row.transactionId || '--'}</div>
                  <hr />
                  <div><strong>Full JSON:</strong></div>
                  <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(detailModal.row, null, 2)}</pre>
                  <hr />
                  <div><strong>Payment Gateway Response (placeholder):</strong></div>
                  <pre>--</pre>
                  <div><strong>Ledger Entries (placeholder):</strong></div>
                  <pre>--</pre>
                  <div><strong>Audit Trail (placeholder):</strong></div>
                  <pre>Operator: -- | Timestamp: --</pre>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeDetails}>Close</button>
                  <button className="btn btn-primary" onClick={printModal}>Print</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print styles: hide filters and other UI when printing; show .print-area or modal print via new window */}
      <style>{`@media print { body * { visibility: hidden; } .print-area, .print-area * { visibility: visible; } .print-area { position: absolute; left:0; top:0; width:100%; } }`}</style>
    </>
  );
}
