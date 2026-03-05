import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import Navbar from '../../../../../components/Navbar';
import Sidebar from '../../../../../components/Sidebar';
import Footer from '../../../../../components/footer';
import DataTable from '../../../../../components/DataTable/DataTable';
import api from '../../../../../utils/api';

// Bookhistory component definition
function Bookhistory() {
  const [rows, setRows] = useState([]);
  const [showTable, setShowTable] = useState(false);
  useEffect(() => {
    // Fetch book issue data from backend using api utility
    const fetchData = async () => {
      try {
        const res = await api.get('/book-issue-report');
        const data = res.data;
        // Map backend data to table columns
        const mapped = Array.isArray(data) ? data.map((r, idx) => ({
          id: idx + 1,
          bookId: r.BookID || r.bookId,
          title: r.BookTitle || r.title,
          category: r.Category || r.category || 'N/A',
          borrowerId: r.BorrowerID || r.borrowerId,
          borrowerName: r.BorrowerName || r.borrowerName,
          department: r.Department || r.department,
          issueDate: r.IssueDate || r.issueDate,
          dueDate: r.DueDate || r.dueDate,
          returnDate: r.ReturnDate || r.returnDate,
          fine: r.Fine || r.fine || 0,
          renewalCount: r.RenewalCount || r.renewalCount || 0,
          status: r.Status || r.status,
          remarks: r.Remarks || r.remarks || ''
        })) : [];
        setRows(mapped);
      } catch (err) {
        toast.error('Error loading book history: ' + err.message);
        setRows([]);
      }
    };
    fetchData();
  }, []);

  // Helper to format date for display
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    let d = new Date(dateStr);
    if (isNaN(d)) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        if (parts[2].length === 4) {
          d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
    }
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString();
  }
  const [bookQuery, setBookQuery] = useState('');
  const [borrowerQuery, setBorrowerQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Summary by Book ID + Borrower ID
  const filtered = useMemo(() => {
    // Filter first
    let filteredRows = rows.filter(r => {
      if (bookQuery) {
        const q = bookQuery.trim().toLowerCase();
        if (!(r.bookId.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || (r.category || '').toLowerCase().includes(q))) return false;
      }
      if (borrowerQuery) {
        const q = borrowerQuery.trim().toLowerCase();
        if (!(r.borrowerName.toLowerCase().includes(q) || r.borrowerId.toLowerCase().includes(q) || (r.department || '').toLowerCase().includes(q))) return false;
      }
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (fromDate) {
        if (new Date(r.issueDate) < new Date(fromDate)) return false;
      }
      if (toDate) {
        if (r.issueDate && new Date(r.issueDate) > new Date(toDate)) return false;
      }
      return true;
    });
    // Group by BookID + BorrowerID
    const summaryMap = {};
    filteredRows.forEach(r => {
      const key = `${r.bookId}__${r.borrowerId}`;
      if (!summaryMap[key]) {
        summaryMap[key] = {
          ...r,
          totalFine: 0,
          totalRenewalCount: 0,
          lastReturnDate: r.returnDate || '',
          latestStatus: r.status,
        };
      }
      summaryMap[key].totalFine += Number(r.fine) || 0;
      summaryMap[key].totalRenewalCount += Number(r.renewalCount) || 0;
      // Update lastReturnDate if newer
      if (r.returnDate && (!summaryMap[key].lastReturnDate || new Date(r.returnDate) > new Date(summaryMap[key].lastReturnDate))) {
        summaryMap[key].lastReturnDate = r.returnDate;
      }
      // Update latestStatus if newer issueDate
      if (r.issueDate && (!summaryMap[key].issueDate || new Date(r.issueDate) > new Date(summaryMap[key].issueDate))) {
        summaryMap[key].latestStatus = r.status;
        summaryMap[key].issueDate = r.issueDate;
      }
    });
    // Return as array
    return Object.values(summaryMap).sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
  }, [rows, bookQuery, borrowerQuery, statusFilter, fromDate, toDate]);

  // Helper to generate paginated report (Strict 8 rows per page)
  const generateMultiPageReport = (dataToPrint, reportTitle) => {
    const rowsPerPage = 8;
    const totalPages = Math.ceil(dataToPrint.length / rowsPerPage);
    let fullHtml = '';

    for (let i = 0; i < totalPages; i++) {
      const pageData = dataToPrint.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
      let tableRows = '';

      // Data rows
      pageData.forEach((row, idx) => {
        const globalIdx = i * rowsPerPage + idx + 1;
        tableRows += `
          <tr style="height: 35px;">
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${globalIdx}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.bookId}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${row.title}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.category}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.borrowerId}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px;">${row.borrowerName}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.department}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${formatDate(row.issueDate)}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${formatDate(row.returnDate)}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.renewalCount}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.status}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: right; font-size: 11px;">₹${row.fine}</td>
          </tr>
        `;
      });

      // Fill empty rows to make exactly 8 rows per page
      const emptyRowsCount = rowsPerPage - pageData.length;
      for (let j = 0; j < emptyRowsCount; j++) {
        tableRows += `
          <tr style="height: 35px;">
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
          </tr>
        `;
      }

      fullHtml += `
        <div class="page-container" style="page-break-after: always; width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
          <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; gap: 10px;">
              <div style="width: 80px; text-align: center; flex-shrink: 0;">
                <img src="/public/assets/images/GRT.png" alt="logo" style="width: 80px; height: 80px; object-fit: contain;" />
              </div>
              <div style="flex: 1; text-align: center;">
                <div style="font-size: 18px; font-weight: 900; letter-spacing: 0.5px; color: #000; line-height: 1.1;">
                  GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                </div>
                <div style="font-size: 11px; font-weight: 500; color: #000; line-height: 1.2; margin-top: 2px;">
                  GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                </div>
                <div style="font-size: 10px; color: #000; line-height: 1.2;">
                  Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                </div>
              </div>
            </div>

            <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
              ${reportTitle.toUpperCase()}
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; table-layout: fixed;">
              <thead>
                <tr style="background-color: #f2f2f2; height: 32px;">
                  <th style="border: 1.5px solid #000; width: 4%; font-size: 10px; text-align: center;">Sl.No</th>
                  <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">Book ID</th>
                  <th style="border: 1.5px solid #000; width: 20%; font-size: 10px; text-align: center;">Book Title</th>
                  <th style="border: 1.5px solid #000; width: 10%; font-size: 10px; text-align: center;">Category</th>
                  <th style="border: 1.5px solid #000; width: 10%; font-size: 10px; text-align: center;">Borrower ID</th>
                  <th style="border: 1.5px solid #000; width: 15%; font-size: 10px; text-align: center;">Borrower Name</th>
                  <th style="border: 1.5px solid #000; width: 7%; font-size: 10px; text-align: center;">Dept</th>
                  <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">Issue</th>
                  <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">Return</th>
                  <th style="border: 1.5px solid #000; width: 4%; font-size: 10px; text-align: center;">Ren.</th>
                  <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">Status</th>
                  <th style="border: 1.5px solid #000; width: 6%; font-size: 10px; text-align: center;">Fine</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>

            <div style="margin-top: auto; padding-top: 20px; text-align: right; font-size: 11px; padding-right: 20px;">
              <div><b>Librarian</b></div>
            </div>
          </div>
        </div>
      `;
    }

    const win = window.open('', '_blank');
    if (!win) {
      toast.error('Please allow pop-ups to print the report');
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            @page { size: A4 landscape; margin: 2mm; }
            body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; background: #fff; }
            .page-container { box-sizing: border-box; }
            .page-container:last-child { page-break-after: auto !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>${fullHtml}</body>
      </html>
    `);
    win.document.close();
    win.onload = () => {
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);
    };
  };

  // Print report handler
  const printBookHistoryReport = () => {
    if (filtered.length === 0) {
      toast.error('No records found to print');
      return;
    }
    generateMultiPageReport(filtered, 'Book History Report');
  };

  const summary = useMemo(() => {
    const byBook = filtered.reduce((acc, r) => {
      acc.totalBorrows = (acc.totalBorrows || 0) + 1;
      acc.totalRenewals = (acc.totalRenewals || 0) + (r.renewalCount || 0);
      acc.totalFines = (acc.totalFines || 0) + (Number(r.fine) || 0);
      if (!acc.lastIssue || new Date(r.issueDate) > new Date(acc.lastIssue.issueDate)) acc.lastIssue = r;
      return acc;
    }, {});
    return {
      totalBorrows: byBook.totalBorrows || 0,
      totalRenewals: byBook.totalRenewals || 0,
      totalFines: byBook.totalFines || 0,
      lastIssue: byBook.lastIssue || null,
      currentStatus: (byBook.lastIssue && (byBook.lastIssue.status || '')) || 'Unknown'
    };
  }, [filtered]);

  // Summary card styling and hover effects
  const summaryCardStyle = {
    transition: 'all 0.3s ease',
    cursor: 'default'
  };

  const handleCardMouseOver = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
  };

  const handleCardMouseOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
  };

  const columns = [
    { header: 'Book ID', accessorKey: 'bookId' },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Borrower ID', accessorKey: 'borrowerId' },
    { header: 'Borrower Name', accessorKey: 'borrowerName' },
    { header: 'Dept', accessorKey: 'department' },
    { header: 'Total Fine (₹)', accessorKey: 'totalFine' },
    { header: 'Last Return Date', accessorKey: 'lastReturnDate', cell: info => info.getValue() ? info.getValue() : '-' },
    { header: 'Total Renewal Count', accessorKey: 'totalRenewalCount' },
    { header: 'Latest Status', accessorKey: 'latestStatus' },
    { header: 'Remarks', accessorKey: 'remarks' }
  ];

  const exportPdf = (book) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(14);
    doc.text(`MITHREN POLYTECHNIC LIBRARY - BOOK HISTORY REPORT`, 40, 60);
    if (book) {
      doc.setFontSize(12);
      doc.text(`${book.title} (${book.bookId})`, 40, 80);
    }
    doc.setFontSize(10);
    let y = 110;
    doc.text('S.No  Borrower  Dept  Issue Date  Return Date  Fine  Renewal  Status', 40, y);
    y += 16;
    filtered.forEach(r => {
      const line = `${r.id}   ${r.borrowerName}   ${r.department}   ${r.issueDate || '-'}   ${r.returnDate || '-'}   ₹${r.fine || 0}   ${r.renewalCount || 0}   ${r.status}`;
      doc.text(line, 40, y);
      y += 14;
      if (y > doc.internal.pageSize.getHeight() - 60) { doc.addPage(); y = 40; }
    });
    doc.save(`BookHistory_${book ? book.bookId : 'report'}.pdf`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Book History Report</h6>
            </div>

            <div className="card h-100 p-0 radius-12 mb-4">
              {/* Card Header */}
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-0">Book History Report</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Search and analyze historical book issue and return records
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-info radius-8 d-flex align-items-center gap-2 fw-bold"
                    style={{ height: '42px' }}
                    onClick={printBookHistoryReport}
                  >
                    <Icon icon="mdi:printer" className="text-lg" />
                    Print Report
                  </button>
                </div>
              </div>

              {/* Filter Section */}
              <div className="p-24 border-bottom bg-base/50">
                <div className="row g-20">
                  {/* Book Search */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">Book Search</label>
                    <input
                      className="form-control radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      placeholder="ID, Title, or Category..."
                      value={bookQuery}
                      onChange={e => setBookQuery(e.target.value)}
                    />
                  </div>

                  {/* Borrower Search */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">Borrower Search</label>
                    <input
                      className="form-control radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      placeholder="Name, ID, or Dept..."
                      value={borrowerQuery}
                      onChange={e => setBorrowerQuery(e.target.value)}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">History Status</label>
                    <select
                      className="form-select radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Returned">Returned</option>
                      <option value="Returned Late">Returned Late</option>
                      <option value="Not Returned">Not Returned</option>
                    </select>
                  </div>

                  {/* Date From */}
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Issue Date From</label>
                    <input
                      type="date"
                      className="form-control radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                    />
                  </div>

                  {/* Date To */}
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Issue Date To</label>
                    <input
                      type="date"
                      className="form-control radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 col-md-6 d-flex align-items-end justify-content-end gap-8">
                    <button
                      className="btn btn-outline-secondary radius-8 px-20 fw-bold"
                      style={{ height: '42px' }}
                      onClick={() => { setBookQuery(''); setBorrowerQuery(''); setFromDate(''); setToDate(''); setStatusFilter('All'); }}
                    >
                      Clear Filters
                    </button>
                    <button
                      type="button"
                      className={`btn radius-8 px-24 d-flex align-items-center gap-2 fw-bold ${showTable ? 'btn-success-600' : 'btn-primary-600'}`}
                      style={{ height: '42px' }}
                      onClick={() => setShowTable((prev) => !prev)}
                    >
                      <Icon icon={showTable ? 'mdi:eye-off' : 'mdi:eye'} className="text-lg" />
                      {showTable ? 'Hide Table' : 'View Table'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body p-24">
                {/* Summary Section - Dashboard Style */}
                <div className="mt-4">
                  <h6 className="mb-3 text-center">Summary</h6>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    {/* Total Times Borrowed */}
                    <div
                      className="summary-box d-flex flex-column align-items-center justify-content-center"
                      style={{ background: 'linear-gradient(135deg, #f7b267 60%, #fbe6a2 100%)', color: '#222', borderRadius: 16, minWidth: 180, minHeight: 110, boxShadow: '0 2px 12px rgba(247,178,103,0.10)', ...summaryCardStyle }}
                      onMouseOver={handleCardMouseOver}
                      onMouseOut={handleCardMouseOut}
                    >
                      <Icon icon="mdi:book-open-page-variant" width={32} height={32} style={{ marginBottom: 1 }} />
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{summary.totalBorrows}</div>
                      <div style={{ fontSize: 15, fontWeight: 500, opacity: 0.9 }}>Total Times Borrowed</div>
                    </div>
                    {/* Total Renewals */}
                    <div
                      className="summary-box d-flex flex-column align-items-center justify-content-center"
                      style={{ background: 'linear-gradient(135deg, #70d6ff 60%, #c2f0fc 100%)', color: '#222', borderRadius: 16, minWidth: 180, minHeight: 110, boxShadow: '0 2px 12px rgba(112,214,255,0.10)', ...summaryCardStyle }}
                      onMouseOver={handleCardMouseOver}
                      onMouseOut={handleCardMouseOut}
                    >
                      <Icon icon="mdi:autorenew" width={32} height={32} style={{ marginBottom: 1 }} />
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{summary.totalRenewals}</div>
                      <div style={{ fontSize: 15, fontWeight: 500, opacity: 0.9 }}>Total Renewals</div>
                    </div>
                    {/* Total Fines */}
                    <div
                      className="summary-box d-flex flex-column align-items-center justify-content-center"
                      style={{ background: 'linear-gradient(135deg, #ff70a6 60%, #ffd6ec 100%)', color: '#222', borderRadius: 16, minWidth: 180, minHeight: 110, boxShadow: '0 2px 12px rgba(255,112,166,0.10)', ...summaryCardStyle }}
                      onMouseOver={handleCardMouseOver}
                      onMouseOut={handleCardMouseOut}
                    >
                      <Icon icon="mdi:cash-multiple" width={32} height={32} style={{ marginBottom: 1 }} />
                      <div style={{ fontSize: 28, fontWeight: 700 }}>₹{summary.totalFines}</div>
                      <div style={{ fontSize: 15, fontWeight: 500, opacity: 0.9 }}>Total Fines</div>
                    </div>
                    {/* Current Status */}
                    <div
                      className="summary-box d-flex flex-column align-items-center justify-content-center"
                      style={{ background: 'linear-gradient(135deg, #f7b267 60%, #fbe6a2 100%)', color: '#222', borderRadius: 16, minWidth: 180, minHeight: 110, boxShadow: '0 2px 12px rgba(247,178,103,0.10)', ...summaryCardStyle }}
                      onMouseOver={handleCardMouseOver}
                      onMouseOut={handleCardMouseOut}
                    >
                      <Icon icon="mdi:information-outline" width={32} height={32} style={{ marginBottom: 1 }} />
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{summary.currentStatus}</div>
                      <div style={{ fontSize: 15, fontWeight: 500, opacity: 0.9 }}>Current Status</div>
                    </div>
                  </div>
                </div>

                {showTable && (
                  <div className="card-body p-3">
                    <DataTable
                      title={`Book History (${filtered.length})`}
                      data={filtered}
                      columns={columns}
                      enableExport={true}
                      enableSelection={true}
                      enableActions={false}
                      pageSize={12}
                      onView={(row) => {
                        toast(`${row.title} — ${row.borrowerName} (${row.status})`);
                      }}
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

export default Bookhistory;
