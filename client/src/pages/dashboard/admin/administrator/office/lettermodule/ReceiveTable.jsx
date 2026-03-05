import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DataTable, { StatusBadge } from '../../../../../../components/DataTable/DataTable';

const RecieveTable = ({ refreshTrigger }) => {
  const [receivedLetters, setReceivedLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({
    fromDate: '',
    toDate: '',
    reportType: 'all'
  });
  const [downloadType, setDownloadType] = useState('pdf'); // 'pdf' | 'csv'

  // --- helpers ------------------------------------------------------------
  const normalizeResponse = (raw) => {
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

  const safe = (v) => (v === null || typeof v === 'undefined' ? '' : String(v));
  const formatDate = (d) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return safe(d);
      return dt.toLocaleDateString();
    } catch {
      return safe(d);
    }
  };

  const filterRowsByDateRange = (rows, fromDate, toDate) => {
    if (!fromDate || !toDate) return [];
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return [];
    to.setHours(23, 59, 59, 999);
    return rows.filter(r => {
      // support common date fields
      const rawDate = r.date ?? r.receivedDate ?? r.received_date ?? r.createdAt ?? r.created_at;
      const d = rawDate ? new Date(rawDate) : null;
      if (!d || isNaN(d.getTime())) return false;
      return d >= from && d <= to;
    });
  };

  // --- generate printable HTML (table) -----------------------------------
  const generateReceivedLettersReportHtml = (rows = [], title = 'Received Letters Report') => {
    const logo = window.location.origin + '/assets/images/GRT.png';

    const rowsHtml = rows.map(r => {
      const letterId = r.letterId ?? r.id ?? r.letter_id ?? '';
      const rawDate = r.date ?? r.receivedDate ?? r.received_date ?? r.createdAt ?? r.created_at ?? '';
      const from = r.from ?? r.sender ?? '';
      const message = r.message ?? '';
      const status = r.status ?? '';
      const replay = r.replay ?? '';

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
              ${title.toUpperCase()}
            </div>

            <div style="padding: 0 40px 40px 40px;">
              <div style="font-weight: 700; margin-bottom: 8px; text-align: right;"> <span style="font-size: 12px;">Letter ID:</span> <span style="font-size: 12px; color:#b30000">${safe(letterId)}</span></div>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                <tbody>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; width: 30%; font-size: 12px;">Date:</td>
                    <td style="padding: 8px; font-size: 12px;">${formatDate(rawDate)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">From:</td>
                    <td style="padding: 8px; font-size: 12px;">${safe(from)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Message:</td>
                    <td style="padding: 8px; font-size: 12px;">${safe(message)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Status:</td>
                    <td style="padding: 8px; font-size: 12px;">${safe(status)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; padding: 8px; font-size: 12px;">Replay:</td>
                    <td style="padding: 8px; font-size: 12px;">${safe(replay)}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Signature -->
              <div style="margin-top: 60px; display: flex; justify-content: space-between; font-weight: 700;">
                <div style="text-align: center;">
                    <br />
                    <span>Checked By</span>
                </div>
                 <div style="text-align: center;">
                    PRINCIPAL<br />
                    <span style="font-weight: 400; font-size: 10px;">GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</span>
                </div>
              </div>
            </div>

          </div>
      </div>
      <br/>
    `;
    }).join("");

    const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>${title}</title>
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

  // --- fetch received letters --------------------------------------------
  useEffect(() => {
    const fetchReceivedLetters = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/receiverletter');
        if (!res.ok) {
          let errText = `Server returned ${res.status}`;
          try {
            const errBody = await res.json();
            if (errBody && errBody.message) errText = `${errText}: ${errBody.message}`;
          } catch { }
          throw new Error(errText);
        }
        const raw = await res.json().catch(() => null);
        const arr = normalizeResponse(raw);
        setReceivedLetters(arr);
        setError(null);
      } catch (err) {
        setReceivedLetters([]);
        setError('Could not fetch received letter data.');
        toast.error('Network error: Could not fetch received letter data.');
        console.error('fetchReceivedLetters error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceivedLetters();
  }, [refreshTrigger]);

  // --- table columns (UI) -----------------------------------------------
  const columns = [
    {
      accessorKey: 'letterId',
      header: 'Letter ID',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.letterId ?? row.original.id}</div>
          <small className="text-muted">{row.original.department}</small>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div>{row.original.date ? <div className="fw-medium">{new Date(row.original.date).toLocaleDateString()}</div> : <div>-</div>}</div>
      ),
    },
    {
      accessorKey: 'from',
      header: 'From',
      cell: ({ row }) => <div className="fw-medium">{row.original.from || '-'}</div>,
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => <div className="fw-medium">{row.original.message || '-'}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const getStatusVariant = (status) => {
          switch ((status || '').toString()) {
            case 'Confirm':
            case 'Approved':
            case 'Completed':
            case 'Processed':
              return 'Active';
            case 'Under Review':
            case 'Pending':
              return 'Pending';
            default:
              return 'Active';
          }
        };
        return <StatusBadge status={getStatusVariant(row.original.status)} />;
      },
    },
    {
      accessorKey: 'replay',
      header: 'Replay',
      cell: ({ row }) => <div className="fw-medium">{row.original.replay || '-'}</div>,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <div>
          <span
            className={`badge ${row.original.priority === 'High' ? 'bg-danger' : row.original.priority === 'Medium' ? 'bg-warning' : 'bg-success'
              }`}
            style={{ fontSize: '0.75rem' }}
          >
            {row.original.priority || '-'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'receivedInfo',
      header: 'Received Info',
      cell: ({ row }) => (
        <div>
          <div><small className="text-muted">Date: {row.original.receivedDate ? new Date(row.original.receivedDate).toLocaleDateString() : '-'}</small></div>
          <div><small className="text-muted">By: {row.original.receivedBy || '-'}</small></div>
        </div>
      ),
    },
  ];

  // --- actions -----------------------------------------------------------
  const handleView = (letter) => {
    console.log('View received letter:', letter);
    toast.success(`Viewing received letter: ${letter.message} - ${letter.letterId}`);
  };

  const handleEdit = (letter) => {
    console.log('Edit received letter:', letter);
    toast.success(`Opening edit mode for: ${letter.message} - ${letter.letterId}`);
  };

  const handleDelete = async (letter) => {
    console.log('Delete received letter:', letter);
    toast((t) => (
      <div>
        <p className="mb-2">Delete received letter: {letter.message} - {letter.letterId}?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={async () => {
              try {
                const res = await fetch(`/api/receiverletter/${letter.id}`, { method: 'DELETE' });
                if (!res.ok) {
                  toast.error('Failed to delete from database');
                  return;
                }
                setReceivedLetters(prev => prev.filter(l => l.id !== letter.id));
                toast.dismiss(t.id);
                toast.success(`Received letter "${letter.message} - ${letter.letterId}" deleted successfully!`);
              } catch (err) {
                toast.error('Network error: Could not delete');
              }
            }}
          >
            Delete
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // --- export modal helpers ---------------------------------------------
  const handleGetReport = () => setShowExportModal(true);
  const handleExportFormChange = (e) => {
    const { name, value } = e.target;
    setExportForm(prev => ({ ...prev, [name]: value }));
  };

  // unified download handler
  const handleDownload = useCallback(() => {
    let filteredRows = receivedLetters || [];
    let reportTitle = 'Received Letters Report';

    if (exportForm.reportType === 'dateWise') {
      if (!exportForm.fromDate || !exportForm.toDate) { toast.error('Please select both From Date and To Date'); return; }
      if (new Date(exportForm.fromDate) > new Date(exportForm.toDate)) { toast.error('From Date should be earlier than To Date'); return; }
      filteredRows = filterRowsByDateRange(filteredRows, exportForm.fromDate, exportForm.toDate);
      reportTitle = `Received Letters (${exportForm.fromDate} to ${exportForm.toDate})`;
    }

    if (!filteredRows || filteredRows.length === 0) { toast('No rows match the selected criteria', { icon: 'ℹ️' }); return; }

    if (downloadType === 'pdf') {
      try {
        const html = generateReceivedLettersReportHtml(filteredRows, reportTitle);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
          try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch (err) { console.error('print error:', err); toast.error('Print failed — check popup/print permissions.'); }
          finally { document.body.removeChild(iframe); }
        }, 600);
        toast.success('PDF print initiated (use browser Save as PDF)');
      } catch (err) {
        console.error('PDF download error:', err);
        toast.error('Failed to generate PDF');
      }
    } else {
      // CSV
      try {
        const headers = ['Letter ID', 'Department', 'Date', 'From', 'Message', 'Status', 'Replay', 'Priority', 'Received Info'];
        const keys = ['letterId', 'department', 'date', 'from', 'message', 'status', 'replay', 'priority', 'receivedInfo'];
        const rowsCsv = [headers.join(',')];
        filteredRows.forEach(r => {
          const vals = keys.map(k => {
            let v = r[k];
            if (k === 'letterId') v = r.letterId ?? r.id ?? r.letter_id ?? '';
            if (k === 'department') v = r.department ?? r.dept ?? '';
            if (k === 'date') v = r.date ?? r.receivedDate ?? r.received_date ?? r.createdAt ?? r.created_at ?? '';
            if (k === 'from') v = r.from ?? r.sender ?? '';
            if (k === 'receivedInfo') {
              const d = formatDate(r.receivedDate ?? r.received_date ?? '');
              const by = r.receivedBy ?? r.received_by ?? '';
              v = (d || by) ? `${d}${by ? ' | By: ' + by : ''}` : '';
            }
            if (v === null || typeof v === 'undefined') return '""';
            const s = String(v).replace(/"/g, '""');
            return `"${s}"`;
          });
          rowsCsv.push(vals.join(','));
        });
        const blob = new Blob([rowsCsv.join('\n')], { type: 'text/csv;charset=utf-8;' });
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
  }, [receivedLetters, exportForm, downloadType]);

  const actions = [
    { key: 'view', label: 'View', onClick: handleView, className: 'btn btn-sm btn-outline-primary me-1' },
    { key: 'edit', label: 'Edit', onClick: handleEdit, className: 'btn btn-sm btn-outline-warning me-1' },
    { key: 'delete', label: 'Delete', onClick: handleDelete, className: 'btn btn-sm btn-outline-danger' }
  ];

  const NoData = () => (
    <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
      {loading ? 'Loading received letter data...' : error ? `Error: ${error}` : 'No received letter records found.'}
    </div>
  );

  // --- render -------------------------------------------------------------
  return (
    <div className="mt-4">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6"><h5 className="card-title mb-0">Received Letter Management</h5></div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-sm btn-outline-success" onClick={handleGetReport} title="Generate Received Letter Reports">
                  <i className="fas fa-file-alt me-1" /> Get Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={receivedLetters}
        columns={columns}
        loading={loading}
        error={error}
        title="Received Letter Management"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actions={actions}
        enableExport={true}
        enableSelection={true}
        pageSize={10}
      />

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Export Received Letter Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowExportModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Report Type:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="reportType" value="all" checked={exportForm.reportType === 'all'} onChange={handleExportFormChange} id="allReceivedLetter" />
                      <label className="form-check-label" htmlFor="allReceivedLetter">All Received Letter Report</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="reportType" value="dateWise" checked={exportForm.reportType === 'dateWise'} onChange={handleExportFormChange} id="dateWiseReceived" />
                      <label className="form-check-label" htmlFor="dateWiseReceived">Date-wise Report</label>
                    </div>
                  </div>
                </div>

                {exportForm.reportType === 'dateWise' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">From Date:</label>
                      <input type="date" name="fromDate" value={exportForm.fromDate} onChange={handleExportFormChange} className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">To Date:</label>
                      <input type="date" name="toDate" value={exportForm.toDate} onChange={handleExportFormChange} className="form-control" required />
                    </div>
                  </div>
                )}

                <div className="mb-3 mt-4">
                  <label className="form-label fw-semibold">Select Download Format:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="downloadType" value="pdf" checked={downloadType === 'pdf'} onChange={() => setDownloadType('pdf')} id="pdfDownloadReceived" />
                      <label className="form-check-label" htmlFor="pdfDownloadReceived">PDF</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="downloadType" value="csv" checked={downloadType === 'csv'} onChange={() => setDownloadType('csv')} id="csvDownloadReceived" />
                      <label className="form-check-label" htmlFor="csvDownloadReceived">CSV</label>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExportModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleDownload}><i className="fas fa-file-download me-2" />Download</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecieveTable;
