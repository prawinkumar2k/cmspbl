import React, { useState, useEffect, useCallback } from 'react';
// import { generateTemplateHtmlForRows } from '../../../../../../utils/reportTemplate'; // REMOVED
import toast from 'react-hot-toast';
import DataTable from '../../../../../../components/DataTable/DataTable';

/**
 * Normalize a DB row (snake_case) to the UI shape (camelCase)
 * Accepts rows from:
 *  - MySQL/Express API returning snake_case fields
 *  - Or already normalized rows
 */
const mapDbRowToUi = (r = {}) => {
  if (!r) return null;

  // helper parsers
  const toNumber = (v) => {
    if (v === null || typeof v === 'undefined' || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const toBool = (v) => {
    if (v === true || v === 'true') return true;
    if (v === false || v === 'false') return false;
    if (v === 1 || v === '1') return true;
    if (v === 0 || v === '0') return false;
    return Boolean(v);
  };

  return {
    // keep original id if exists (useful for DB pk)
    id: r.id ?? r.purchase_id ?? null,

    // canonical UI fields (camelCase)
    purchaseId: r.purchase_id ?? r.purchaseId ?? null,
    date: r.date ?? r.purchase_date ?? null, // tolerate multiple names
    productName: r.product_name ?? r.productName ?? '',
    brandName: r.brand_name ?? r.brandName ?? '',
    companyVendor: r.company_vendor ?? r.companyVendor ?? '',
    purchaseOrderNo: r.purchase_order_no ?? r.purchaseOrderNo ?? '',
    orderDate: r.order_date ?? r.orderDate ?? null,
    dcNo: r.dc_no ?? r.dcNo ?? '',
    billNo: r.bill_no ?? r.billNo ?? '',
    billDate: r.bill_date ?? r.billDate ?? null,
    qty: toNumber(r.qty ?? r.quantity ?? 0),
    rate: toNumber(r.rate ?? 0),
    vatApplied: toBool(r.vat_applied ?? r.vat ?? r.vatApplied ?? false),
    taxApplied: toBool(r.tax_applied ?? r.taxApplied ?? false),
    totalAmount: toNumber(r.total_amount ?? r.totalAmount ?? (r.qty && r.rate ? (Number(r.qty) * Number(r.rate)) : null)),
    currentStock: toNumber(r.current_stock ?? r.currentStock ?? 0),
    totalStock: toNumber(r.total_stock ?? r.totalStock ?? 0),

    // keep raw DB row in case parent needs extra fields
    _raw: r,
  };
};

// If API returns a top-level object, normalize to array
const normalizeResponseToArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.rows && Array.isArray(raw.rows)) return raw.rows;
  if (raw.results && Array.isArray(raw.results)) return raw.results;
  if (raw.payload && Array.isArray(raw.payload)) return raw.payload;
  if (raw.success && raw.data && Array.isArray(raw.data)) return raw.data;
  if (typeof raw === 'object') return [raw];
  return [];
};

// Template generator (single or multiple rows) - Local definition for Purchase
const generatePurchaseTabularReportHtml = (rows = [], title = "PURCHASE REPORT") => {
  const logo = window.location.origin + '/assets/images/GRT.png';
  const rowsPerPage = 25;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  let fullHtml = '';

  const grandTotalValue = rows.reduce((acc, r) => acc + (Number(r.totalAmount || r.total_amount || 0)), 0);

  for (let i = 0; i < totalPages; i++) {
    const pageRows = rows.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
    let tableRows = '';

    pageRows.forEach((r, idx) => {
      const globalIdx = i * rowsPerPage + idx + 1;
      const item = mapDbRowToUi(r);
      const dateStr = item.date ? new Date(item.date).toLocaleDateString("en-IN") : '-';
      tableRows += `
        <tr style="height: 30px;">
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${globalIdx}</td>
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${dateStr}</td>
          <td style="text-align: left; border: 1.5px solid #000; padding: 4px;">${item.productName || '-'}</td>
          <td style="text-align: left; border: 1.5px solid #000; padding: 4px;">${item.brandName || '-'}</td>
          <td style="text-align: left; border: 1.5px solid #000; padding: 4px;">${item.companyVendor || '-'}</td>
          <td style="text-align: right; border: 1.5px solid #000; padding: 4px;">${Number(item.rate || 0).toFixed(2)}</td>
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${item.qty || 0}</td>
          <td style="text-align: right; border: 1.5px solid #000; padding: 4px; font-weight: bold;">${Number(item.totalAmount || 0).toFixed(2)}</td>
        </tr>
      `;
    });

    fullHtml += `
      <div class="page-container" style="page-break-after: always; width: 210mm; padding: 10mm; box-sizing: border-box; background: white; margin: 0 auto; font-family: 'Times New Roman', Times, serif;">
        <div style="border: 2px solid #000; padding: 12px; display: flex; flex-direction: column; box-sizing: border-box;">
          
          <!-- Header -->
          <div style="display: flex; alignItems: center; marginBottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <div style="width: 80px; flex-shrink: 0; text-align: center;">
              <img src="${logo}" alt="logo" style="width: 70px; height: 70px; objectFit: contain;" />
            </div>
            <div style="flex: 1; text-align: center; padding-right: 40px;">
              <div style="fontSize: 16px; fontWeight: 900; letterSpacing: 0.5px; color: #000; line-height: 1.1;">
                GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
              </div>
              <div style="fontSize: 10px; fontWeight: 500; color: #000; line-height: 1.2; margin-top: 4px;">
                GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
              </div>
              <div style="fontSize: 9px; color: #000; line-height: 1.2;">
                Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
              </div>
            </div>
          </div>

          <!-- Report Title -->
          <div style="text-align: center; margin: 15px 0; font-weight: 900; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            ${title}
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1.5px solid #000; padding: 6px; width: 5%;">SL</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 12%;">DATE</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 20%;">PRODUCT</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 15%;">BRAND</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 18%;">VENDOR</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 10%;">RATE</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 8%;">QTY</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 12%;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              ${i === totalPages - 1 ? `
                <tr style="background-color: #f2f2f2; font-weight: bold; height: 34px;">
                  <td colspan="7" style="border: 1.5px solid #000; padding: 6px; text-align: right;">GRAND TOTAL</td>
                  <td style="border: 1.5px solid #000; padding: 6px; text-align: right;">${grandTotalValue.toFixed(2)}</td>
                </tr>
                <tr style="height: 30px;">
                  <td colspan="8" style="padding: 10px; text-align: left; font-style: italic; border: none;">
                    Total Entries: ${rows.length}
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>

          <!-- Footer Signature -->
          <div style="padding-top: 40px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; padding-left: 20px; padding-right: 20px;">
            <div style="text-align: center;">
              <div style="margin-top: 30px;">CHECKED BY</div>
            </div>
            <div style="text-align: center;">
              <div style="margin-top: 30px;">PRINCIPAL</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Purchase Report</title>
        <style>
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; padding: 0; background: #eee; }
          @media print {
            body { background: white; }
            .page-container { box-shadow: none !important; margin: 0 !important; }
          }
        </style>
      </head>
      <body>
        ${fullHtml}
      </body>
    </html>
  `;
};

const PurchaseTable = ({ refreshTrigger, setPurchaseState, setEditId }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({
    fromDate: '',
    toDate: '',
    reportType: 'all',
  });
  const [downloadType, setDownloadType] = useState('pdf'); // pdf | csv

  // Fetch purchases and normalize rows
  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/purchases');
      if (!res.ok) {
        let errText = `Server returned ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody && errBody.message) errText = `${errText}: ${errBody.message}`;
        } catch { }
        throw new Error(errText);
      }
      const raw = await res.json().catch(() => null);
      const arr = normalizeResponseToArray(raw);
      const normalized = arr.map(mapDbRowToUi);
      setPurchases(normalized);
      setError(null);
    } catch (err) {
      setPurchases([]);
      setError('Could not fetch purchase data.');
      toast.error('Network error: Could not fetch purchase data.');
      console.error('fetchPurchases error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const columns = [
    {
      accessorKey: 'purchaseId',
      header: 'Purchase ID',
      cell: ({ row }) => <div className="fw-medium">{row.original.purchaseId ?? '-'}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const d = row.original.date;
        if (!d) return <div>-</div>;
        const dt = new Date(d);
        return <div className="fw-medium">{isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: 'productName',
      header: 'Product Details',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.productName || '-'}</div>
          <small className="text-muted">{row.original.brandName || ''}</small>
        </div>
      ),
    },
    {
      accessorKey: 'companyVendor',
      header: 'Vendor',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.companyVendor || '-'}</div>
          <small className="text-muted">PO: {row.original.purchaseOrderNo || 'N/A'}</small>
        </div>
      ),
    },
    {
      accessorKey: 'billNo',
      header: 'Bill Details',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.billNo || 'N/A'}</div>
          <small className="text-muted">DC: {row.original.dcNo || 'N/A'}</small>
        </div>
      ),
    },
    {
      accessorKey: 'qty',
      header: 'Quantity',
      cell: ({ row }) => <div className="fw-medium text-center">{row.original.qty ?? '-'}</div>,
    },
    {
      accessorKey: 'rate',
      header: 'Rate',
      cell: ({ row }) => (
        <div className="fw-medium text-success">
          {Number.isFinite(Number(row.original.rate)) ? `₹${Number(row.original.rate).toLocaleString()}` : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'taxes',
      header: 'Tax Details',
      cell: ({ row }) => (
        <div>
          {row.original.vatApplied && (
            <span className="badge bg-info me-1" style={{ fontSize: '0.7rem' }}>
              VAT
            </span>
          )}
          {row.original.taxApplied && (
            <span className="badge bg-warning" style={{ fontSize: '0.7rem' }}>
              Tax
            </span>
          )}
          {!row.original.vatApplied && !row.original.taxApplied && <span className="text-muted">No Tax</span>}
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => (
        <div className="fw-medium text-primary">
          {Number.isFinite(Number(row.original.totalAmount)) ? `₹${Number(row.original.totalAmount).toLocaleString()}` : '-'}
        </div>
      ),
    },
  ];

  const handleView = (purchase) => {
    console.log('View purchase:', purchase);
    toast.success(`Viewing purchase: ${purchase.productName} - ${purchase.purchaseId}`);
  };

  const handleEdit = (purchase) => {
    console.log('Edit purchase:', purchase);
    toast.success(`Opening edit mode for: ${purchase.productName} - ${purchase.purchaseId}`);
    if (typeof setPurchaseState === 'function') setPurchaseState(purchase);
    if (typeof setEditId === 'function') setEditId(purchase.id ?? purchase.purchaseId);
  };

  const handleDelete = (purchase) => {
    toast((t) => (
      <div>
        <p className="mb-2">Delete purchase: {purchase.productName} - {purchase.purchaseId}?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              setPurchases(prev => prev.filter(p => (p.id ?? p.purchaseId) !== (purchase.id ?? purchase.purchaseId)));
              toast.dismiss(t.id);
              toast.success(`Purchase "${purchase.productName} - ${purchase.purchaseId}" deleted successfully!`);
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const handleGetReport = () => setShowExportModal(true);

  const handleExportFormChange = (e) => {
    const { name, value } = e.target;
    setExportForm(prev => ({ ...prev, [name]: value }));
  };

  const filterRowsByDateRange = (rows, fromDate, toDate) => {
    if (!fromDate || !toDate) return [];
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return [];
    // include entire to-day
    to.setHours(23, 59, 59, 999);
    return rows.filter(r => {
      const d = r.date ? new Date(r.date) : null;
      if (!d || isNaN(d.getTime())) return false;
      return d >= from && d <= to;
    });
  };

  // Unified download handler (PDF/CSV) based on modal selection
  const handleDownload = useCallback(() => {
    let filteredRows = purchases || [];
    let reportTitle = 'Purchase Report';

    if (exportForm.reportType === 'dateWise') {
      if (!exportForm.fromDate || !exportForm.toDate) {
        toast.error('Please select both From Date and To Date');
        return;
      }
      if (new Date(exportForm.fromDate) > new Date(exportForm.toDate)) {
        toast.error('From Date should be earlier than To Date');
        return;
      }
      filteredRows = filterRowsByDateRange(filteredRows, exportForm.fromDate, exportForm.toDate);
      reportTitle = `Purchase (${exportForm.fromDate} to ${exportForm.toDate})`;
    }

    if (!filteredRows || filteredRows.length === 0) {
      toast('No purchase rows match the selected criteria', { icon: 'ℹ️' });
      return;
    }

    if (downloadType === 'pdf') {
      try {
        const html = generatePurchaseTabularReportHtml(filteredRows, reportTitle.toUpperCase());
        const win = window.open("");
        if (!win) {
          toast.error('Popup blocked — allow popups for this site');
          return;
        }
        win.document.open();
        win.document.write(html);
        win.document.close();

        setTimeout(() => {
          win.focus();
          win.print();
        }, 500);

        toast.success('Print initiated');
      } catch (err) {
        console.error('PDF download error:', err);
        toast.error('Failed to generate PDF');
      }
    } else {
      // CSV export
      try {
        // build rows using flattened UI keys (safe for CSV)
        const headers = Object.keys(filteredRows[0] || {});
        const rows = [headers.join(',')];
        filteredRows.forEach(r => {
          const vals = headers.map(h => {
            const v = r[h];
            if (v === null || typeof v === 'undefined') return '""';
            const s = String(v).replace(/"/g, '""');
            return `"${s}"`;
          });
          rows.push(vals.join(','));
        });
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('CSV downloaded');
      } catch (err) {
        console.error('CSV download error:', err);
        toast.error('Failed to generate CSV');
      }
    }

    setShowExportModal(false);
  }, [purchases, exportForm, downloadType]);

  // Keep the older semantics for quick "All" or "Date-wise" success toast without generating file (if you need)
  const handleAllPurchaseReport = () => {
    const reportData = {
      reportType: 'All Purchase Report',
      generatedDate: new Date().toLocaleDateString(),
      totalItems: purchases.length,
      format: 'PDF/Excel',
    };
    console.log('Generating All Purchase Report:', reportData);
    toast.success('All Purchase Report exported successfully!');
    setShowExportModal(false);
  };

  const handleDateWiseReport = () => {
    if (!exportForm.fromDate || !exportForm.toDate) {
      toast.error('Please select both From Date and To Date');
      return;
    }
    if (new Date(exportForm.fromDate) > new Date(exportForm.toDate)) {
      toast.error('From Date should be earlier than To Date');
      return;
    }
    const reportData = {
      reportType: 'Date-wise Purchase Report',
      fromDate: exportForm.fromDate,
      toDate: exportForm.toDate,
      generatedDate: new Date().toLocaleDateString(),
      format: 'PDF/Excel',
    };
    console.log('Generating Date-wise Purchase Report:', reportData);
    toast.success(`Date-wise Purchase Report (${exportForm.fromDate} to ${exportForm.toDate}) exported successfully!`);
    setShowExportModal(false);
  };

  const actions = [
    { key: 'view', label: 'View', onClick: handleView, className: 'btn btn-sm btn-outline-primary me-1' },
    { key: 'edit', label: 'Edit', onClick: handleEdit, className: 'btn btn-sm btn-outline-warning me-1' },
    { key: 'delete', label: 'Delete', onClick: handleDelete, className: 'btn btn-sm btn-outline-danger' }
  ];

  const NoData = () => (
    <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
      {loading ? 'Loading purchase data...' : error ? `Error: ${error}` : 'No purchase records found.'}
    </div>
  );

  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="card-title mb-0">Purchase Management</h5>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={handleGetReport}
                  title="Show Purchase Report Options"
                >
                  <i className="fas fa-file-alt me-1"></i>
                  Get Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={purchases}
        columns={columns}
        loading={loading}
        error={error}
        title="Purchase Management"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actions={actions}
        enableExport={true}
        enableSelection={true}
        pageSize={10}
      />

      {showExportModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Show Purchase Report</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowExportModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Report Type:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="reportType"
                        value="all"
                        checked={exportForm.reportType === 'all'}
                        onChange={handleExportFormChange}
                        id="allPurchase"
                      />
                      <label className="form-check-label" htmlFor="allPurchase">
                        All Purchase Report
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="reportType"
                        value="dateWise"
                        checked={exportForm.reportType === 'dateWise'}
                        onChange={handleExportFormChange}
                        id="dateWise"
                      />
                      <label className="form-check-label" htmlFor="dateWise">
                        Date-wise Report
                      </label>
                    </div>
                  </div>
                </div>

                {exportForm.reportType === 'dateWise' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">From Date:</label>
                      <input
                        type="date"
                        name="fromDate"
                        value={exportForm.fromDate}
                        onChange={handleExportFormChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">To Date:</label>
                      <input
                        type="date"
                        name="toDate"
                        value={exportForm.toDate}
                        onChange={handleExportFormChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="mb-3 mt-4">
                  <label className="form-label fw-semibold">Select Download Format:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="downloadType"
                        value="pdf"
                        checked={downloadType === 'pdf'}
                        onChange={() => setDownloadType('pdf')}
                        id="pdfDownloadPurchase"
                      />
                      <label className="form-check-label" htmlFor="pdfDownloadPurchase">PDF</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="downloadType"
                        value="csv"
                        checked={downloadType === 'csv'}
                        onChange={() => setDownloadType('csv')}
                        id="csvDownloadPurchase"
                      />
                      <label className="form-check-label" htmlFor="csvDownloadPurchase">CSV</label>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDownload}
                >
                  <i className="fas fa-file-download me-2"></i>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseTable;
