// Show/hide issued books table
import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../../../../components/Navbar';
import Sidebar from '../../../../../components/Sidebar';
import DataTable from '../../../../../components/DataTable/DataTable';
import Footer from '../../../../../components/footer';

export default function BookIssue() {
  // Removed missing books API and state as requested
  const [showTable, setShowTable] = useState(false);
  const [borrower, setBorrower] = useState(null);
  const [book, setBook] = useState(null);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [borrowers, setBorrowers] = useState(null); // null = loading
  const [books, setBooks] = useState(null); // null = loading
  const [loadError, setLoadError] = useState(false);

  // Function to fetch books - extracted for reuse
  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/library/books/available');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setLoadError(true);
      setBooks([]);
      console.error('Failed to load books:', err);
    }
  };
  // const librarianName = 'Librarian'; // TODO: get from auth
  // const [issues, setIssues] = useState([]); // for local issue records
  const [nextIssueId, setNextIssueId] = useState('IS001');
  const [returnDate, setReturnDate] = useState('');
  const [issuedRecord, setIssuedRecord] = useState(null); // store last issued book details
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issuedBooksLoading, setIssuedBooksLoading] = useState(true);
  const [issuedBooksError, setIssuedBooksError] = useState(null);
  // Search/filter state for issued books table
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTriggered, setSearchTriggered] = useState(false);
  // Memoized filtered issued books
  const filteredIssuedBooks = useMemo(() => {
    let filtered = issuedBooks;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(b => (b.Status || b.status) === statusFilter);
    }
    if (searchTriggered && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(b =>
        (b.IssueID || '').toLowerCase().includes(q) ||
        (b.BookID || '').toLowerCase().includes(q) ||
        (b.BookTitle || '').toLowerCase().includes(q) ||
        (b.BorrowerID || '').toLowerCase().includes(q) ||
        (b.BorrowerName || '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [issuedBooks, search, statusFilter, searchTriggered]);
  // Fetch all issued books
  useEffect(() => {
    const fetchIssuedBooks = async () => {
      setIssuedBooksLoading(true);
      setIssuedBooksError(null);
      try {
        const res = await fetch('/api/library/circulation/reports/issued');
        if (!res.ok) throw new Error('Failed to fetch issued books');
        const data = await res.json();
        setIssuedBooks(data);
      } catch (err) {
        setIssuedBooksError(err.message);
      } finally {
        setIssuedBooksLoading(false);
      }
    };
    fetchIssuedBooks();
  }, []);
  // Fetch next Issue ID from backend
  const fetchNextIssueId = () => {
    fetch('/api/library/circulation/next-id')
      .then(res => res.json())
      .then(data => setNextIssueId(data.nextIssueId || 'IS001'))
      .catch(() => setNextIssueId('IS001'));
  };

  useEffect(() => {
    fetchNextIssueId();
  }, []);

  // Fetch borrowers from backend
  useEffect(() => {
    fetch('/api/library/borrowers/all')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => setBorrowers(data))
      .catch(() => {
        setLoadError(true);
        setBorrowers([]);
        toast.error('Failed to load borrowers');
      });
  }, []);

  // Fetch books from backend
  useEffect(() => {
    fetchBooks();
  }, []);


  // Map backend fields to frontend expected fields for borrowers
  const mappedBorrowers = Array.isArray(borrowers) ? borrowers.map(b => ({
    borrowerId: b.BorrowerID || b.borrowerId,
    name: b.Name || b.name,
    type: b.BorrowerType || b.type,
    department: b.Department || b.department,
    borrowLimit: b.MaxBooksAllowed || b.borrowLimit || 3,
    booksIssued: b.BooksIssued || b.booksIssued || 0,
    fineDue: b.FineDue || b.fineDue || 0,
    phone: b.ContactNumber || b.phone || '',
    registerNo: b.RegisterNo || b.registerNo || b.RegNo || b.regno || '',
    yearSection: b.YearSection || b.yearSection || b.YearSec || b.yearSec || b.Year_Section || b.year_section || '',
  })) : [];


  // Map backend fields to frontend expected fields for books
  const mappedBooks = Array.isArray(books) ? books.map(b => {
    const bookId = b.BookNo || b.book_id || b.id || b.bookId;
    const title = b.Title || b.title || b.BookTitle || 'Unknown Title';
    const author = b.Author || b.author || 'Unknown Author';
    const category = b.Category || b.category || 'Uncategorized';
    // Priority for status: Availability, Status, status, then default
    const statusValue = (b.Availability || b.Status || b.status || 'Available').toUpperCase();
    const copies = b.Quantity !== undefined ? Number(b.Quantity) : (b.quantity !== undefined ? Number(b.quantity) : (b.copies !== undefined ? Number(b.copies) : 0));

    return {
      bookId,
      title,
      author,
      category,
      status: statusValue,
      copies,
    };
  }) : [];


  // const suggestBorrowers = mappedBorrowers.filter(b =>
  //   b.borrowerId && b.borrowerId.toLowerCase().includes(borrowerQuery.trim().toLowerCase()) ||
  //   b.name && b.name.toLowerCase().includes(borrowerQuery.trim().toLowerCase())
  // ).slice(0,8);

  // const suggestBooks = mappedBooks.filter(b =>
  //   b.bookId && b.bookId.toLowerCase().includes(bookQuery.trim().toLowerCase()) ||
  //   b.title && b.title.toLowerCase().includes(bookQuery.trim().toLowerCase())
  // ).slice(0,8);

  const selectBorrower = (b) => {
    setBorrower(b);
    // calculate default due date
    const days = b.type === 'Staff' ? 15 : 7;
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().slice(0, 10));
    toast.success('Borrower selected');
  };

  const selectBook = (bk) => {
    // Check availability with proper field handling
    const availability = (bk.Availability || bk.Status || bk.status || 'Available').toUpperCase();
    const quantity = Number(bk.Quantity || bk.quantity || bk.copies || 0);

    // Prevent selecting unavailable or missing book
    if (availability === 'UNAVAILABLE' || quantity <= 0) {
      toast.error('This book is unavailable and cannot be issued.');
      setBook(null);
      return;
    }
    if (availability === 'MISSING') {
      toast.error('This book is marked as missing and cannot be issued.');
      setBook(null);
      return;
    }
    setBook(bk);
    toast.success('Book selected');
  };

  // Generate Return ID and Renewal ID from Issue ID
  const getReturnId = (issueId) => issueId ? issueId.replace(/^IS/, 'RT') : '';
  const getRenewalId = (issueId) => issueId ? issueId.replace(/^IS/, 'RN') : '';

  const handleIssue = async () => {
    if (!borrower) return toast.error('Select a borrower first');
    if (!book) return toast.error('Select a book to issue');
    if ((book.status || '').toUpperCase() === 'UNAVAILABLE' || (book.copies || 0) <= 0) {
      toast.error('This book is unavailable and cannot be issued.');
      return;
    }
    if ((borrower.booksIssued || 0) >= (borrower.borrowLimit || 0)) return toast.error('Borrower has reached borrow limit');
    if (borrower.fineDue && borrower.fineDue > 0) return toast.error('Borrower has unpaid fines');

    // Prepare payload matching backend expectation (snake_case or PascalCase as per controller)
    // The controller uses req.body.BorrowerID, BookID, etc.
    const record = {
      IssueID: nextIssueId,
      BookID: book.bookId,
      BookTitle: book.title || '',
      BorrowerID: borrower.borrowerId,
      BorrowerName: borrower.name,
      Department: borrower.department,
      ContactNumber: borrower.phone || '',
      RegisterNo: borrower.registerNo || '',
      YearSection: borrower.yearSection || '',
      IssueDate: issueDate,
      DueDate: dueDate,
      RenewalID: getRenewalId(nextIssueId), // Generated on frontend or backend? Backend ignores this usually and generates its own or uses it.
      Status: 'Issued',
      Remarks: '',
      // ReturnID and ReturnDate are for return process, not issue.
    };

    toast.loading('Issuing book...');
    try {
      const res = await fetch('/api/library/circulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to issue book');
      }

      toast.dismiss();
      toast.success(`Issued ${book.title} to ${borrower.name} (${borrower.borrowerId})`);
      setBook(null);
      setIssuedRecord(record);
      fetchNextIssueId();
      fetchBooks(); // Refresh books list to show updated quantities
      // Refresh issued books list
      const resList = await fetch('/api/library/circulation/reports/issued');
      if (resList.ok) {
        const dataList = await resList.json();
        setIssuedBooks(dataList);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || 'Failed to issue book');
    }
  };

  const handleReturn = async (row) => {
    if (!window.confirm(`Are you sure you want to return book "${row.BookTitle}"?`)) return;

    const toastId = toast.loading('Processing return...');
    try {
      const res = await fetch('/api/library/circulation/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          IssueID: row.IssueID,
          BookID: row.BookID,
          BorrowerID: row.BorrowerID,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Return failed');

      toast.success(data.message || 'Book returned successfully', { id: toastId });

      // Refresh list
      const resList = await fetch('/api/library/circulation/reports/issued');
      if (resList.ok) setIssuedBooks(await resList.json());
      // Refresh books availability
      fetchBooks();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleRenew = async (row) => {
    if (!window.confirm(`Renew book "${row.BookTitle}"?`)) return;

    const toastId = toast.loading('Processing renewal...');
    try {
      const res = await fetch('/api/library/circulation/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          IssueID: row.IssueID,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Renewal failed');

      toast.success(data.message || 'Book renewed successfully', { id: toastId });

      // Refresh list
      const resList = await fetch('/api/library/circulation/reports/issued');
      if (resList.ok) setIssuedBooks(await resList.json());
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  // Optionally, keep printSlip for future use, but not called automatically
  const printSlip = (record) => {
    const isLate = record.ReturnDate && record.DueDate && record.ReturnDate > record.DueDate;
    const html = `
      <html>
        <head><title>Issue Slip</title></head>
        <body>
          <h3>Library Issue Slip</h3>
          <p>Issue ID: ${record.IssueID}</p>
          <p>Return ID: ${record.ReturnID}</p>
          <p>Renewal ID: ${record.RenewalID}</p>
          <p>Borrower: ${record.BorrowerName} (${record.BorrowerID})</p>
          <p>Book: ${record.BookTitle} (${record.BookID})</p>
          <p>Issue Date: ${record.IssueDate}</p>
          <p>Due Date: ${record.DueDate}</p>
          <p style="color:${isLate ? 'red' : 'inherit'}">Return Date: ${record.ReturnDate || '-'}</p>
          <p>Issued By: Librarian</p>
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
      w.print();
    }
  };

  if (borrowers === null || books === null) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }
  if (loadError) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="alert alert-danger">Failed to load borrowers or books. Please check your backend connection.</div>
        </div>
      </>
    );
  }
  return (
    <>
      <Toaster position="top-right" />

      <section className="overlay" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Circulation Management</h6>
            </div>
            <div className="card border-0 shadow-sm mb-24">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Book Issue Form</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Search and select borrower/book to process new circulation.
                  </span>

                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-3 border-bottom d-flex align-items-center justify-content-end" style={{ gap: 8 }}>
                    <button
                      type="button"
                      className={`btn btn-outline-sm d-flex align-items-center ${showTable ? 'btn-outline-success' : 'btn-outline-info'}`}
                      style={{ minWidth: 120, fontWeight: 600, gap: 6 }}
                      onClick={() => setShowTable((prev) => !prev)}
                      title={showTable ? 'Hide Book Table' : 'Show Book Table'}
                    >
                      <Icon icon={showTable ? 'mdi:eye-off' : 'mdi:eye'} className="me-1" />
                      {showTable ? 'Hide Table' : 'View Books'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body p-24">
                <div className="row g-20 mb-24">
                  {/* Borrower Selection */}
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-base border border-neutral-200 radius-12 h-100">
                      <label className="form-label fw-semibold text-primary-light mb-8">1. Select Borrower</label>
                      <Select
                        className="mb-12"
                        placeholder="Search Name or ID..."
                        value={borrower ? { value: borrower.borrowerId, label: `${borrower.borrowerId} — ${borrower.name}` } : null}
                        onChange={option => {
                          const selected = mappedBorrowers.find(b => b.borrowerId === option?.value);
                          if (selected) selectBorrower(selected);
                        }}
                        options={mappedBorrowers.map(b => ({
                          value: b.borrowerId,
                          label: `${b.borrowerId} — ${b.name} (${b.department})`
                        }))}
                        isClearable
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '44px',
                            borderRadius: '8px',
                            borderColor: '#d1d5db',
                          })
                        }}
                      />
                      {borrower ? (
                        <div className="bg-primary-50 border border-primary-100 rounded-3 p-12 mt-8">
                          <div className="d-flex align-items-center justify-content-between mb-4">
                            <span className="fw-bold text-primary-light fs-6">{borrower.name}</span>
                            <span className="badge bg-primary-100 text-primary-600 radius-4">{borrower.borrowerId}</span>
                          </div>
                          <div className="text-xs text-secondary-light mb-8 fw-medium">
                            <Icon icon="mdi:school" className="me-4" /> {borrower.department} | {borrower.type}
                          </div>
                          <div className="row g-4 border-top pt-8 mt-8">
                            <div className="col-6">
                              <div className="text-xs text-neutral-500">Issued Books</div>
                              <div className="fw-bold text-neutral-800">{borrower.booksIssued || 0} / {borrower.borrowLimit}</div>
                            </div>
                            <div className="col-6">
                              <div className="text-xs text-neutral-500">Fine Due</div>
                              <div className={`fw-bold ${+borrower.fineDue > 0 ? 'text-danger' : 'text-success'}`}>₹{borrower.fineDue || 0}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-neutral-50 radius-8 border border-dashed border-neutral-300">
                          <Icon icon="mdi:account-search" className="display-6 text-neutral-300 mb-8" />
                          <div className="text-xs text-neutral-500">No borrower selected</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Selection */}
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-base border border-neutral-200 radius-12 h-100">
                      <label className="form-label fw-semibold text-primary-light mb-8">2. Select Book</label>
                      <Select
                        className="mb-12"
                        placeholder="Search Title or Book ID..."
                        value={book ? { value: book.bookId, label: book.title } : null}
                        onChange={option => {
                          const selected = mappedBooks.find(b => b.bookId === option?.value);
                          if (selected) selectBook(selected);
                        }}
                        options={mappedBooks.map(b => ({
                          value: b.bookId,
                          label: `${b.bookId} — ${b.title}`
                        }))}
                        isClearable
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '44px',
                            borderRadius: '8px',
                            borderColor: '#d1d5db',
                          })
                        }}
                      />
                      {book ? (
                        <div className="bg-success-50 border border-success-100 rounded-3 p-12 mt-8">
                          <div className="d-flex align-items-center justify-content-between mb-4">
                            <span className="fw-bold text-success-700 fs-6">{book.title}</span>
                            <span className="badge bg-success-100 text-success-600 radius-4">{book.bookId}</span>
                          </div>
                          <div className="text-xs text-secondary-light mb-8 fw-medium">
                            <Icon icon="mdi:account-edit" className="me-4" /> {book.author} | {book.category}
                          </div>
                          <div className="row g-4 border-top pt-8 mt-8">
                            <div className="col-6">
                              <div className="text-xs text-neutral-500">Status</div>
                              <div className={`fw-bold ${book.status === 'AVAILABLE' ? 'text-success' : 'text-danger'}`}>{book.status}</div>
                            </div>
                            <div className="col-6">
                              <div className="text-xs text-neutral-500">Copies</div>
                              <div className="fw-bold text-neutral-800">{book.copies ?? '—'}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-neutral-50 radius-8 border border-dashed border-neutral-300">
                          <Icon icon="mdi:book-search" className="display-6 text-neutral-300 mb-8" />
                          <div className="text-xs text-neutral-500">No book selected</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transaction Details (Dates & Submit) */}
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-base border border-neutral-200 radius-12 h-100">
                      <label className="form-label fw-semibold text-primary-light mb-16 px-4">3. Transaction Details</label>
                      <div className="mb-12">
                        <label className="text-xs fw-bold text-neutral-500 mb-4 px-4 text-uppercase">Issue Date</label>
                        <input type="date" className="form-control radius-8 border-neutral-300" style={{ fontSize: '14px', height: '40px' }} value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                      </div>
                      <div className="mb-20">
                        <label className="text-xs fw-bold text-neutral-500 mb-4 px-4 text-uppercase">Due Date</label>
                        <input type="date" className="form-control radius-8 border-neutral-300" style={{ fontSize: '14px', height: '40px' }} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                      </div>
                      <button
                        className="btn btn-outline-primary w-100 py-12 radius-8 fw-bold d-flex align-items-center justify-content-center gap-2"
                        onClick={handleIssue}
                        disabled={!borrower || !book}
                      >
                        <Icon icon="mdi:check-circle" className="text-lg" />
                        Issue Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Show all issued books below the form using DataTable */}
            <div style={{ width: '100%', margin: 0, padding: 0 }}>
              {showTable && (
                <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(33,150,243,0.08)', padding: '1.5rem 2rem', width: '100%', margin: '0 auto', border: '1px solid #e3eaf3' }}>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.5rem' }}>



                  </div>
                  <div style={{ maxHeight: '70vh', overflow: 'auto', width: '100%' }}>
                    <DataTable
                      data={filteredIssuedBooks}
                      columns={[
                        { accessorKey: 'IssueID', header: 'Issue ID', cell: ({ row }) => <span style={{ fontWeight: 700, color: '#222', fontSize: 16 }}>{row.original.IssueID}</span> },
                        { accessorKey: 'BookID', header: 'Book ID', cell: ({ row }) => <span style={{ fontWeight: 700 }}>{row.original.BookID}</span> },
                        { accessorKey: 'BookTitle', header: 'Book Title', cell: ({ row }) => <span style={{ fontWeight: 500 }}>{row.original.BookTitle}</span> },
                        { accessorKey: 'BorrowerID', header: 'Borrower ID' },
                        { accessorKey: 'BorrowerName', header: 'Borrower Name' },
                        { accessorKey: 'RegisterNo', header: 'Reg. No' }, // Optional column
                        { accessorKey: 'YearSection', header: 'Class' }, // Optional column
                        { accessorKey: 'Department', header: 'Dept' },
                        { accessorKey: 'IssueDate', header: 'Issue Date', cell: ({ row }) => new Date(row.original.IssueDate).toLocaleDateString() },
                        { accessorKey: 'DueDate', header: 'Due Date', cell: ({ row }) => new Date(row.original.DueDate).toLocaleDateString() },
                        {
                          accessorKey: 'Status', header: 'Status', cell: ({ row }) => (
                            <span className={`badge ${row.original.Status === 'Returns' || row.original.Status === 'Returned' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>
                              {row.original.Status}
                            </span>
                          )
                        },
                        {
                          header: 'Actions',
                          cell: ({ row }) => (
                            <div className="d-flex gap-2">
                              {(row.original.Status !== 'Returned' && row.original.Status !== 'Return') && (
                                <>
                                  <button
                                    className="btn btn-sm btn-outline-danger px-2 py-1"
                                    onClick={() => handleReturn(row.original)}
                                    title="Return Book"
                                  >
                                    <Icon icon="mdi:keyboard-return" /> Return
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-secondary px-2 py-1"
                                    onClick={() => handleRenew(row.original)}
                                    title="Renew Book"
                                  >
                                    <Icon icon="mdi:autorenew" /> Renew
                                  </button>
                                </>
                              )}
                              {row.original.Status === 'Returned' && <span className="text-success text-xs fw-bold">Completed</span>}
                            </div>
                          )
                        },
                      ]}
                      loading={issuedBooksLoading}
                      error={issuedBooksError}
                      title={''}
                      enableExport={true}
                      enableSelection={false}
                      enableActions={false}
                      pageSize={10}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}
