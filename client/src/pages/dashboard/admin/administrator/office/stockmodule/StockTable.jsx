import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import DataTable from '../../../../../../components/DataTable/DataTable';

/* helpers to map DB shape to UI */
const mapDbRowToUi = (r = {}) => {
  return {
    ...r,
    id: r.id ?? null,
    stockId: r.stock_id ?? r.stockId ?? null,
    date: r.date ?? r.created_at ?? null,
    productName: r.product_name ?? r.productName ?? r.productNameUi ?? '-',
    brandName: r.brand_name ?? r.brandName ?? '-',
    rate: (r.rate !== undefined && r.rate !== null) ? Number(r.rate) : 0,
    qty: (r.qty !== undefined && r.qty !== null) ? Number(r.qty) : 0,
    scale: r.scale ?? 'Bundle',
    total_value: (r.total_value !== undefined && r.total_value !== null) ? Number(r.total_value) : Number((Number(r.rate || 0) * Number(r.qty || 0)).toFixed(2)),
    scan_image: r.scan_image ?? null,
    remarks: r.remarks ?? r.remark ?? ''
  };
};

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

const formatDate = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString();
  } catch {
    return String(d);
  }
};

// Consolidated Tabular Template generator
const generateStockTabularReportHtml = (rows = [], title = "STOCK REPORT") => {
  const logo = window.location.origin + '/assets/images/GRT.png';
  const rowsPerPage = 25;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  let fullHtml = '';

  const grandTotalValue = rows.reduce((acc, r) => acc + (Number(r.total_value) || 0), 0);

  for (let i = 0; i < totalPages; i++) {
    const pageRows = rows.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
    let tableRows = '';

    pageRows.forEach((r, idx) => {
      const globalIdx = i * rowsPerPage + idx + 1;
      const dateStr = r.date ? new Date(r.date).toLocaleDateString("en-IN") : '-';
      tableRows += `
        <tr style="height: 30px;">
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${globalIdx}</td>
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${dateStr}</td>
          <td style="text-align: left; border: 1.5px solid #000; padding: 4px;">${r.productName || '-'}</td>
          <td style="text-align: left; border: 1.5px solid #000; padding: 4px;">${r.brandName || '-'}</td>
          <td style="text-align: right; border: 1.5px solid #000; padding: 4px;">${Number(r.rate || 0).toFixed(2)}</td>
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${r.qty || 0}</td>
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${r.scale || '-'}</td>
          <td style="text-align: right; border: 1.5px solid #000; padding: 4px; font-weight: bold;">${Number(r.total_value || 0).toFixed(2)}</td>
        </tr>
      `;
    });

    // Padding empty rows on the last page if needed
    if (i === totalPages - 1 && pageRows.length < 5) {
      // don't pad too much for aggregated reports, but maybe 1-2 to maintain structure
    }

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
                <th style="border: 1.5px solid #000; padding: 6px; width: 28%;">PRODUCT NAME</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 15%;">BRAND</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 10%;">RATE</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 8%;">QTY</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 10%;">SCALE</th>
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
              <div style="margin-top: 30px;">STORE KEEPER</div>
            </div>
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
        <title>Stock Report</title>
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

// Template generator (single or multiple rows)
const generateTemplateHtmlForRows = (rows = []) => {
  const logo = window.location.origin + '/assets/images/GRT.png';

  const rowsHtml = rows.map((r, idx) => {
    const item = mapDbRowToUi(r);
    // Format date properly
    const dateStr = item.date ? new Date(item.date).toLocaleDateString("en-IN") : '-';

    return `
      <div style="background: #fff; width: 100%; box-sizing: border-box; page-break-after: always; padding: 10px;">
          <div style="border: 3px solid #222; margin: 0 auto; padding: 0; max-width: 210mm; box-sizing: border-box; background: #fff; position: relative; font-family: 'Times New Roman', Times, serif;">
            
            <!-- Header -->
            <div style="display: flex; align-items: center; margin-top: 24px;">
              <div style="width: 140px; min-width: 140px; text-align: center;">
                <img src="${logo}" alt="logo" style="width: 110px; height: 110px; object-fit: contain;" />
              </div>
              <div style="flex: 1; text-align: center;">
                <div style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #222;">
                  GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                </div>
                <div style="font-size: 12px; font-weight: 500; color: #222;">
                   GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                </div>
                <div style="font-size: 11px; color: #222;">
                   Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                </div>
              </div>
              <div style="width: 140px; min-width: 140px;"></div>
            </div>

            <hr style="border: none; border-top: 2px solid #ffffffff; margin: 12px 20px;" />

            <!-- Title -->
            <div style="text-align: center; font-size: 16px; font-weight: 800; margin: 10px 0 20px 0;">
              STOCK ENTRY REPORT
            </div>

            <div style="padding: 0 40px 40px 40px;">
              <div style="font-weight: 700; margin-bottom: 8px; text-align: right;"> <span style="font-size: 12px;">Stock ID:</span> <span style="font-size: 12px; color:#b30000">${item.stockId || '-'}</span></div>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                <tbody>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; width: 30%; font-size: 12px;">Date:</td>
                    <td style="padding: 8px; font-size: 12px;">${dateStr}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Product Name:</td>
                    <td style="padding: 8px; font-size: 12px;">${item.productName}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Brand Name:</td>
                    <td style="padding: 8px; font-size: 12px;">${item.brandName}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Rate:</td>
                    <td style="padding: 8px; font-size: 12px;">₹${Number(item.rate || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Quantity:</td>
                    <td style="padding: 8px; font-size: 12px;">${Number(item.qty || 0)} ${item.scale}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Total Value:</td>
                    <td style="padding: 8px; font-weight: bold; font-size: 12px;">₹${Number(item.total_value || ((item.rate || 0) * (item.qty || 0))).toFixed(2)}</td>
                  </tr>
                   ${item.remarks ? `<tr><td style="font-weight: bold; padding: 8px; font-size: 12px;">Remarks:</td><td style="padding: 8px; font-size: 12px;">${item.remarks}</td></tr>` : ''}
                </tbody>
              </table>

              <!-- Signature -->
              <div style="margin-top: 60px; display: flex; justify-content: space-between; font-weight: 700;">
                <div style="text-align: center;">
                    <br />
                    <span>Store Keeper</span>
                </div>
                <div style="text-align: center;">
                    <br />
                    <span>Checked By</span>
                </div>
                <div style="text-align: center:">
                    <br/>
                    <span>PRINCIPAL</span>
                </div>
              </div>
            </div>

          </div>
      </div>
      <br/>
    `;
  }).join("\n");

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Stock Entry Report</title>
    <style>
      @page { size: A4 portrait; margin: 10mm; }
      @media print {
        body { margin: 0; padding: 0; }
        .page-break { page-break-after: always; }
      }
      body { font-family: "Times New Roman", Times, serif; background: #fff; margin: 0; padding: 20px; }
    </style>
  </head>
  <body>
    ${rowsHtml}
    <script>
      window.onload = function() {
        try { window.focus(); } catch(e){}
      };
    </script>
  </body>
  </html>
  `;
  return html;
};

const StockTable = ({ refreshTrigger = 0, setStockState, setEditId }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // Download modal state (new)
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportForm, setExportForm] = useState({ fromDate: '', toDate: '', reportType: 'all' });
  const [downloadType, setDownloadType] = useState('pdf');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    const fetchStocks = async () => {
      try {
        const res = await fetch('/api/stocks', { signal });
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
        const mapped = arr.map(mapDbRowToUi);
        if (signal.aborted) return;
        setStocks(mapped);
        setError(null);
      } catch (err) {
        if (!signal.aborted) {
          setStocks([]);
          setError('Could not fetch stock data.');
          toast.error('Network error: Could not fetch stock data.');
          console.error('fetchStocks error:', err);
        }
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    };

    fetchStocks();

    return () => controller.abort();
  }, [refreshTrigger]);

  // action handlers
  const handleView = (row) => {
    const stock = row?.original ?? row;
    toast.success(`Viewing: ${stock.productName} (${stock.stockId ?? stock.id ?? '-'})`);
  };

  const handleEdit = (row) => {
    const stock = row?.original ?? row;
    if (setStockState) setStockState(stock);
    if (setEditId) setEditId(stock.id);
    toast('Loaded into editor');
  };

  const handleDelete = async (row) => {
    const stock = row?.original ?? row;
    const confirmDelete = window.confirm(`Delete stock: ${stock.productName} (${stock.stockId ?? stock.id}) ?`);
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/stocks/${stock.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const t = await res.text().catch(() => null);
        throw new Error(t || `Delete failed ${res.status}`);
      }
      setStocks(prev => prev.filter(s => s.id !== stock.id));
      toast.success('Stock deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete stock');
    }
  };

  // export form handlers
  const handleExportFormChange = (e) => {
    const { name, value } = e.target;
    setExportForm(prev => ({ ...prev, [name]: value }));
  };
  const handleShowDownloadModal = () => setShowDownloadModal(true);

  // utility to filter rows by date range when needed
  const filterRowsByDateRange = (rows, fromDate, toDate) => {
    if (!fromDate || !toDate) return [];
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return [];
    return rows.filter(r => {
      const d = r.date ? new Date(r.date) : null;
      if (!d || isNaN(d.getTime())) return false;
      // normalize times: include whole day
      d.setHours(0, 0, 0, 0);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      return d >= from && d <= to;
    });
  };

  // Download logic supports pdf and csv and date-wise filtering similar to AssetTable
  const handleDownload = useCallback(() => {
    let filteredRows = stocks || [];
    let reportTitle = 'Stock Report';

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
      reportTitle = `Stock (${exportForm.fromDate} to ${exportForm.toDate})`;
    }

    if (!filteredRows || filteredRows.length === 0) {
      toast('No stock rows match the selected criteria', { icon: 'ℹ️' });
      return;
    }

    if (downloadType === 'pdf') {
      try {
        const html = generateStockTabularReportHtml(filteredRows, reportTitle.toUpperCase());
        const win = window.open("");
        if (!win) {
          toast.error('Popup blocked — allow popups for this site');
          return;
        }
        win.document.open();
        win.document.write(html);
        win.document.close();

        // Wait for images
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

    setShowDownloadModal(false);
  }, [stocks, exportForm, downloadType]);

  // download single-row report (keeps as-is)
  const handleDownloadRowReport = useCallback((row) => {
    const stock = row?.original ?? row;
    if (!stock) {
      toast('Invalid row for report', { icon: '⚠️' });
      return;
    }
    try {
      const html = generateTemplateHtmlForRows([stock]);
      const w = window.open("");
      if (!w) {
        toast.error('Popup blocked — allow popups for this site to use the report feature.');
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      toast.success('Row report opened — use browser Print to save as PDF');
    } catch (err) {
      console.error('generate single row report error:', err);
      toast.error('Failed to generate row report');
    }
  }, []);

  const columns = [
    { accessorKey: 'stockId', header: 'Stock ID', cell: ({ row }) => <div className="fw-medium">{row?.original?.stockId ?? '-'}</div> },
    {
      accessorKey: 'date', header: 'Date', cell: ({ row }) => {
        const d = row?.original?.date;
        if (!d) return <div>-</div>;
        const dt = new Date(d);
        return <div>{isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString()}</div>;
      }
    },
    { accessorKey: 'productName', header: 'Product', cell: ({ row }) => <div className="fw-medium">{row?.original?.productName ?? '-'}</div> },
    { accessorKey: 'brandName', header: 'Brand', cell: ({ row }) => <div className="fw-medium">{row?.original?.brandName ?? '-'}</div> },
    {
      accessorKey: 'rate', header: 'Rate', cell: ({ row }) => {
        const r = row?.original?.rate;
        const num = typeof r === 'number' ? r : Number(r);
        return <div className="fw-medium text-success">{Number.isFinite(num) ? `₹${num.toFixed(2)}` : '-'}</div>;
      }
    },
    { accessorKey: 'qty', header: 'Qty', cell: ({ row }) => <div>{row?.original?.qty ?? 0}</div> },
    {
      accessorKey: 'total_value', header: 'Total', cell: ({ row }) => {
        const v = row?.original?.total_value ?? (row?.original?.rate * row?.original?.qty) ?? 0;
        return <div className="fw-medium">₹{Number(v).toFixed(2)}</div>;
      }
    },
  ];

  const actions = [
    { key: 'view', label: 'View', onClick: handleView, className: 'btn btn-sm btn-outline-primary me-1' },
    { key: 'report', label: 'Report', onClick: handleDownloadRowReport, className: 'btn btn-sm btn-outline-info me-1' },
    { key: 'edit', label: 'Edit', onClick: handleEdit, className: 'btn btn-sm btn-outline-warning me-1' },
    { key: 'delete', label: 'Delete', onClick: handleDelete, className: 'btn btn-sm btn-outline-danger' }
  ];

  const NoData = () => (
    <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
      {loading ? 'Loading stock data...' : error ? `Error: ${error}` : 'No stock records found.'}
    </div>
  );

  return (
    <div style={{ width: '100%', padding: 8 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="card-title mb-0">Stock Management</h5>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-outline-primary" onClick={handleShowDownloadModal} title="Download Stock Report">
            <i className="fas fa-file-download me-1" /> Download Report
          </button>
        </div>
      </div>

      {(!loading && (!Array.isArray(stocks) || stocks.length === 0)) && <NoData />}

      <DataTable
        data={stocks}
        columns={columns}
        loading={loading}
        error={error}
        title="Stock Management"
        actions={actions}
        enableExport={true}
        enableSelection={true}
        pageSize={10}
      />

      {showDownloadModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Download Stock Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowDownloadModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Report Type:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="reportType" value="all" checked={exportForm.reportType === 'all'} onChange={handleExportFormChange} id="allStock" />
                      <label className="form-check-label" htmlFor="allStock">All Stock Report</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="reportType" value="dateWise" checked={exportForm.reportType === 'dateWise'} onChange={handleExportFormChange} id="dateWiseStock" />
                      <label className="form-check-label" htmlFor="dateWiseStock">Date-wise Report</label>
                    </div>
                  </div>
                </div>

                {exportForm.reportType === 'dateWise' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">From Date:</label>
                      <input type="date" name="fromDate" value={exportForm.fromDate} onChange={handleExportFormChange} className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">To Date:</label>
                      <input type="date" name="toDate" value={exportForm.toDate} onChange={handleExportFormChange} className="form-control" />
                    </div>
                  </div>
                )}

                <div className="mb-3 mt-4">
                  <label className="form-label fw-semibold">Select Download Format:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="downloadType" value="pdf" checked={downloadType === 'pdf'} onChange={() => setDownloadType('pdf')} id="pdfDownloadStock" />
                      <label className="form-check-label" htmlFor="pdfDownloadStock">PDF</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="downloadType" value="csv" checked={downloadType === 'csv'} onChange={() => setDownloadType('csv')} id="csvDownloadStock" />
                      <label className="form-check-label" htmlFor="csvDownloadStock">CSV</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDownloadModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleDownload}><i className="fas fa-file-download me-2" />Download</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTable;
