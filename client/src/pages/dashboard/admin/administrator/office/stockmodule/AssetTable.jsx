// src/pages/assets/AssetTable.jsx
import React, { useState, useEffect, useCallback } from 'react';
// import { generateTemplateHtmlForRows } from '../../../../../../utils/reportTemplate'; // REMOVED
import toast from 'react-hot-toast';
import DataTable, { StatusBadge } from '../../../../../../components/DataTable/DataTable';

// Normalize a DB row to the UI shape
const mapDbRowToUi = (r = {}) => {
  if (!r) return null;
  return {
    id: r.id ?? r.asset_id ?? null,
    assetId: r.asset_id ?? r.assetId ?? null,
    date: r.date ?? null,
    assets: r.assets ?? r.asset_type ?? '',
    description: r.description ?? '',
    qty: r.qty ?? r.quantity ?? 0,
    rate: r.rate ?? 0,
    amount: r.amount ?? r.total_amount ?? 0,
    status: r.status ?? 'Active',
    location: r.location ?? '',
    condition: r.condition ?? '',
    createdDate: r.created_date ?? r.createdDate ?? null,
    createdBy: r.created_by ?? r.createdBy ?? '',
    _raw: r,
  };
};

// Template generator (single or multiple rows) - Local definition for Asset
const generateAssetTabularReportHtml = (rows = [], title = "ASSET REPORT") => {
  const logo = window.location.origin + '/assets/images/GRT.png';
  const rowsPerPage = 25;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  let fullHtml = '';

  const grandTotalValue = rows.reduce((acc, r) => acc + (Number(r.amount || r.total_amount || 0)), 0);

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
          <td style="text-align: left; border: 1.5px solid #000; padding: 4px;">${item.assets || '-'}</td>
          <td style="text-align: left; border: 1.5px solid #000; padding: 4px;">${item.description || '-'}</td>
          <td style="text-align: right; border: 1.5px solid #000; padding: 4px;">${Number(item.rate || 0).toFixed(2)}</td>
          <td style="text-align: center; border: 1.5px solid #000; padding: 4px;">${item.qty || 0}</td>
          <td style="text-align: right; border: 1.5px solid #000; padding: 4px; font-weight: bold;">${Number(item.amount || 0).toFixed(2)}</td>
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
                <th style="border: 1.5px solid #000; padding: 6px; width: 20%;">ASSET TYPE</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 33%;">DESCRIPTION</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 10%;">RATE</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 8%;">QTY</th>
                <th style="border: 1.5px solid #000; padding: 6px; width: 12%;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              ${i === totalPages - 1 ? `
                <tr style="background-color: #f2f2f2; font-weight: bold; height: 34px;">
                  <td colspan="6" style="border: 1.5px solid #000; padding: 6px; text-align: right;">GRAND TOTAL</td>
                  <td style="border: 1.5px solid #000; padding: 6px; text-align: right;">${grandTotalValue.toFixed(2)}</td>
                </tr>
                <tr style="height: 30px;">
                  <td colspan="7" style="padding: 10px; text-align: left; font-style: italic; border: none;">
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
        <title>Asset Report</title>
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

const AssetTable = ({ refreshTrigger }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportForm, setExportForm] = useState({ fromDate: '', toDate: '', reportType: 'all' });
  const [downloadType, setDownloadType] = useState('pdf');

  useEffect(() => {
    setLoading(true);
    fetch('/api/stocks')
      .then(async (res) => {
        if (!res.ok) {
          let msg = `Server returned ${res.status}`;
          try { const body = await res.json(); if (body && body.message) msg = body.message; } catch (err) { }
          throw new Error(msg);
        }
        return res.json();
      })
      .then((data) => {
        // assume API returns array of assets
        setAssets(Array.isArray(data) ? data : (data && data.data ? data.data : []));
        setError(null);
      })
      .catch((err) => {
        console.error('fetch assets error:', err);
        setError('Failed to load asset data');
        setAssets([]);
        toast.error('Failed to load asset data');
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const handleExportFormChange = (e) => {
    const { name, value } = e.target;
    setExportForm(prev => ({ ...prev, [name]: value }));
  };

  const handleShowDownloadModal = () => setShowDownloadModal(true);

  const handleDownload = useCallback(() => {
    let filteredRows = assets || [];
    let reportTitle = 'Asset';

    if (exportForm.reportType === 'dateWise') {
      if (!exportForm.fromDate || !exportForm.toDate) {
        toast.error('Please select both From Date and To Date');
        return;
      }
      if (new Date(exportForm.fromDate) > new Date(exportForm.toDate)) {
        toast.error('From Date should be earlier than To Date');
        return;
      }
      filteredRows = filteredRows.filter(row => {
        const d = row.date ? new Date(row.date) : null;
        if (!d || isNaN(d.getTime())) return false;
        return d >= new Date(exportForm.fromDate) && d <= new Date(exportForm.toDate);
      });
      reportTitle = `Asset (${exportForm.fromDate} to ${exportForm.toDate})`;
    }

    if (!filteredRows || filteredRows.length === 0) {
      toast('No asset rows match the selected criteria', { icon: 'ℹ️' });
      return;
    }

    if (downloadType === 'pdf') {
      try {
        const html = generateAssetTabularReportHtml(filteredRows, reportTitle.toUpperCase());
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
  }, [assets, exportForm, downloadType]);

  // Actions
  const handleView = (asset) => {
    toast.success(`Viewing asset: ${asset.description} - ${asset.assetId}`);
  };

  const handleEdit = (asset) => {
    toast.success(`Opening edit mode for: ${asset.description} - ${asset.assetId}`);
  };

  const handleDelete = (asset) => {
    toast((t) => (
      <div>
        <p className="mb-2">Delete asset: {asset.description} - {asset.assetId}?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              setAssets(prev => prev.filter(a => a.id !== asset.id));
              toast.dismiss(t.id);
              toast.success(`Asset "${asset.description} - ${asset.assetId}" deleted successfully!`);
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
    ), { duration: Infinity });
  };

  const columns = [
    { accessorKey: 'assetId', header: 'Asset ID', cell: ({ row }) => <div className="fw-medium">{row.original.assetId}</div> },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => <div>{row.original.date ? new Date(row.original.date).toLocaleDateString() : '-'}</div> },
    { accessorKey: 'assets', header: 'Asset Type', cell: ({ row }) => (<div><div className="fw-medium">{row.original.assets}</div><small className="text-muted">{row.original.location}</small></div>) },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => (<div><div className="fw-medium">{row.original.description}</div><small className="text-muted">Condition: {row.original.condition}</small></div>) },
    { accessorKey: 'qty', header: 'Quantity', cell: ({ row }) => <div className="fw-medium text-center">{row.original.qty}</div> },
    { accessorKey: 'rate', header: 'Rate', cell: ({ row }) => <div className="fw-medium text-success">₹{Number(row.original.rate || 0).toLocaleString()}</div> },
    { accessorKey: 'amount', header: 'Total Amount', cell: ({ row }) => <div className="fw-medium text-primary">₹{Number(row.original.amount || 0).toLocaleString()}</div> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'createdDate', header: 'Created Date', cell: ({ row }) => (<div><div>{row.original.createdDate ? new Date(row.original.createdDate).toLocaleDateString() : '-'}</div><small className="text-muted">By: {row.original.createdBy}</small></div>) }
  ];

  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="card-title mb-0">Asset Management</h5>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={handleShowDownloadModal} title="Download Asset Report">
                  <i className="fas fa-file-download me-1" /> Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={assets}
        columns={columns}
        loading={loading}
        error={error}
        title="Asset Management"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={true}
        enableSelection={true}
        pageSize={10}
      />

      {showDownloadModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Download Asset Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowDownloadModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Report Type:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="reportType" value="all" checked={exportForm.reportType === 'all'} onChange={handleExportFormChange} id="allAsset" />
                      <label className="form-check-label" htmlFor="allAsset">All Asset Report</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="reportType" value="dateWise" checked={exportForm.reportType === 'dateWise'} onChange={handleExportFormChange} id="dateWise" />
                      <label className="form-check-label" htmlFor="dateWise">Date-wise Report</label>
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
                      <input className="form-check-input" type="radio" name="downloadType" value="pdf" checked={downloadType === 'pdf'} onChange={() => setDownloadType('pdf')} id="pdfDownload" />
                      <label className="form-check-label" htmlFor="pdfDownload">PDF</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="downloadType" value="csv" checked={downloadType === 'csv'} onChange={() => setDownloadType('csv')} id="csvDownload" />
                      <label className="form-check-label" htmlFor="csvDownload">CSV</label>
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

export default AssetTable;
