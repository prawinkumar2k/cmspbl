import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { toast, Toaster } from 'react-hot-toast';

const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];

const INITIAL_FORM = {
  year: '',
  fromDate: '',
  toDate: ''
};

/* Utility: pretty date for display (DD-MMM-YYYY) */
const prettyDate = (dISOString) => {
  if (!dISOString) return 'Unknown';
  const d = new Date(dISOString);
  if (Number.isNaN(d.getTime())) return dISOString;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = d.toLocaleString('en-GB', { month: 'short' }); // e.g. May
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

/* Utility: group raw entries by date -> course -> totals */
const consolidateByDate = (entries = []) => {
  const map = new Map(); // dateKey => Map(course => {count, amount})
  entries.forEach((r) => {
    // use ISO or provided date; normalize to yyyy-mm-dd to group correctly
    let dateKey = r.issueDate || r.date || '';
    try {
      const d = new Date(dateKey);
      if (!Number.isNaN(d.getTime())) {
        // use yyyy-mm-dd as key
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dateKey = `${yyyy}-${mm}-${dd}`;
      }
    } catch (err) {
      // keep raw
    }

    if (!map.has(dateKey)) map.set(dateKey, new Map());
    const courseMap = map.get(dateKey);
    const course = r.course || r.Course || 'UNKNOWN';
    const amount = Number(r.amount || r.Amount || 0) || 0;

    if (!courseMap.has(course)) courseMap.set(course, { count: 0, amount: 0 });
    const stat = courseMap.get(course);
    stat.count += 1;
    stat.amount += amount;
    courseMap.set(course, stat);
  });

  // return ordered array by date (ascending)
  const arr = Array.from(map.entries())
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([dateKey, courseMap]) => {
      const courses = Array.from(courseMap.entries()).map(([course, stat]) => ({
        course,
        count: stat.count,
        amount: stat.amount
      }));
      const totalCount = courses.reduce((s, c) => s + c.count, 0);
      const totalAmount = courses.reduce((s, c) => s + c.amount, 0);
      return { dateKey, courses, totalCount, totalAmount };
    });

  return arr;
};

// Utility: print the report using native browser print
const handlePrint = () => {
  window.print();
};

export default function AppIssueConsolidate() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showReport, setShowReport] = useState(true);
  const [entries, setEntries] = useState([]); // actual fetched entries
  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]); // store all API data

  // Fetch all student data from API on component mount
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await fetch('/api/studentMaster');
        if (!res.ok) throw new Error('Failed to fetch student data');
        const data = await res.json();
        const students = Array.isArray(data) ? data : [];
        setAllStudents(students);
      } catch (err) {
        toast.error('Failed to load student data');
        setAllStudents([]);
      }
    };
    fetchAllStudents();
  }, []);

  const fetchData = async (filters) => {
    setLoading(true);
    try {
      // Transform student data to issue format
      let data = allStudents.map((student) => ({
        appNo: student.Application_No || student.Register_Number || '',
        studentName: student.Student_Name || '',
        course: student.Course_Name || student.course_name || student.CourseName || student.Course || student.course || 'N/A',
        amount: 100, // Fixed amount for now, can be updated from business logic
        issueDate: student.Admission_Date || student.admission_date || student.Created_Date || new Date().toISOString()
      }));

      // Apply year filter
      if (filters.year) {
        data = data.filter((row) => {
          const yearFromDate = new Date(row.issueDate).getFullYear().toString();
          return yearFromDate === filters.year;
        });
      }

      // Apply date range filters
      if (filters.fromDate) {
        data = data.filter((row) => new Date(row.issueDate) >= new Date(filters.fromDate));
      }

      if (filters.toDate) {
        data = data.filter((row) => new Date(row.issueDate) <= new Date(filters.toDate));
      }

      setEntries(data);
      setShowReport(true); // Automatically show report after fetching
    } catch (err) {
      toast.error('Error filtering data');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewYear = (e) => {
    e.preventDefault();
    if (!form.year) {
      toast.error('Please select a year');
      return;
    }
    fetchData({ year: form.year, fromDate: form.fromDate, toDate: form.toDate });
    toast.success(`Viewing consolidated issues for year ${form.year}`);
  };

  const handleView = (e) => {
    e.preventDefault();
    if (!form.year || !form.fromDate || !form.toDate) {
      toast.error('Please fill all required fields');
      return;
    }
    fetchData(form);
    toast.success('Showing filtered results');
  };

  const handleClose = () => window.history.back();

  // consolidated structure for rendering
  const consolidated = consolidateByDate(entries);
  // serial number increments for each date block (1..N)
  let serial = 0;

  return (
    <>
      <Toaster position="top-right" />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Application Issue Consolidate</h6>
              <div>
                <button
                  type="button"
                  className={`btn btn-sm ${showReport ? 'btn-success' : 'btn-outline-info'}`}
                  onClick={() => setShowReport((p) => !p)}
                >
                  <i className={`fas ${showReport ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                  {showReport ? 'Hide Report' : 'View Report'}
                </button>
              </div>
            </div>

            <div className="card h-100 p-0 radius-12 d-print-none">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Consolidated Application Issue</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Filter and view consolidated application issues by year
                  </span>
                </div>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleView}>
                  <div className="mb-24">
                    <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">Filter Criteria</h6>
                    <div className="row g-20 mb-20">
                      <div className="col-12 col-md-6 col-lg-2">
                        <label className="form-label fw-semibold text-primary-light mb-8">Year</label>
                        <select name="year" value={form.year} onChange={handleChange} className="form-select radius-8" required>
                          <option value="">Select Year</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>

                      <div className="col-12 col-md-6 col-lg-2 d-flex align-items-end">
                        <button type="button" className="btn btn-primary px-32 w-100" onClick={handleViewYear}>VIEW</button>
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">From Date</label>
                        <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange} className="form-control radius-8" required />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">To Date</label>
                        <input type="date" name="toDate" value={form.toDate} onChange={handleChange} className="form-control radius-8" required />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button type="button" className="btn btn-outline-secondary px-20" onClick={handleClose}>CLOSE</button>
                    <button type="submit" className="btn btn-primary px-32">VIEW</button>
                  </div>
                </form>
              </div>
            </div>

            <div style={{ minHeight: 520, transition: 'min-height 0.2s' }}>
              {showReport && (
                <div className="card mt-4">
                  <div className="card-header border-bottom bg-base py-12 px-20 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                      <h6 className="mb-1 fw-semibold">Consolidated Application Issue Report</h6>
                      <small className="text-secondary">Grouped by date — shows #applications and amount per department</small>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <div className="badge bg-neutral-100 text-primary-600">{loading ? 'Loading…' : `${entries.length} record${entries.length === 1 ? '' : 's'}`}</div>
                      <button className="btn btn-outline-primary btn-sm" onClick={handlePrint}>Print Report</button>
                    </div>
                  </div>

                  <div className="card-body p-24">
                    <div id="consolidate-report" className="card p-3 mb-4" style={{ background: '#fff' }}>
                      <div ref={null}>
                        {/* Outer border - standardized to black 2px */}
                        <div style={{
                          border: '2px solid #222',
                          margin: 12,
                          padding: 0,
                          minHeight: 'auto',
                          position: 'relative',
                          background: '#fff'
                        }}>
                          {/* Header - Standardized institutional format */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 12 }}>
                            <div style={{ width: 100, minWidth: 100, textAlign: "center" }}>
                              <img
                                src="/public/assets/images/GRT.png"
                                alt="logo"
                                style={{ width: 90, height: 90, objectFit: "contain" }}
                              />
                            </div>
                            <div style={{ flex: 1, textAlign: "center" }}>
                              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.5, color: "#222", textTransform: 'uppercase' }}>
                                GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#222", marginTop: 4 }}>
                                GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#222", marginTop: 2 }}>
                                Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                              </div>
                            </div>
                            <div style={{ width: 100, minWidth: 100 }}></div>
                          </div>

                          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, textDecoration: "underline", margin: "18px 0 12px 0" }}>
                            CONSOLIDATED APPLICATION ISSUE REPORT
                          </div>

                          {/* Filter Summary */}
                          <div style={{ margin: '0 32px 12px 32px', fontSize: 14, fontWeight: 600 }}>
                            <span><strong>Year:</strong> {form.year || '-'} &nbsp;|&nbsp; <strong>From:</strong> {form.fromDate || '-'} &nbsp;|&nbsp; <strong>To:</strong> {form.toDate || '-'}</span>
                          </div>

                          {/* Table */}
                          <div style={{ padding: "0 24px" }}>
                            <table style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              background: '#fff',
                              fontSize: 13
                            }}>
                              <thead>
                                <tr>
                                  <th style={thStyle}>S. No.</th>
                                  <th style={thStyle}>DATE</th>
                                  <th style={thStyle}>DEPARTMENT</th>
                                  <th style={thStyle}>NUMBER OF APPLICATIONS</th>
                                  <th style={thStyle}>AMOUNT</th>
                                </tr>
                              </thead>
                              <tbody>
                                {consolidated.length === 0 && (
                                  <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: 12, border: '1px solid #222' }}>No data found for selected filters.</td>
                                  </tr>
                                )}
                                {consolidated.map((block, bi) => {
                                  serial += 1;
                                  return (
                                    <React.Fragment key={block.dateKey}>
                                      {block.courses.map((c, ci) => (
                                        <tr key={`${block.dateKey}-${c.course}`}>
                                          {ci === 0 ? (
                                            <>
                                              <td style={tdStyle}>{serial}</td>
                                              <td style={tdStyle}>{prettyDate(block.dateKey)}</td>
                                            </>
                                          ) : (
                                            <>
                                              <td style={tdStyle}></td>
                                              <td style={tdStyle}></td>
                                            </>
                                          )}
                                          <td style={tdStyle}>{c.course}</td>
                                          <td style={tdStyle}>{c.count}</td>
                                          <td style={tdStyle}>{c.amount}</td>
                                        </tr>
                                      ))}
                                      <tr style={{ background: '#f5f5f5' }}>
                                        <td style={tdStyle}></td>
                                        <td style={{ ...tdStyle, fontWeight: 800 }}>TOTAL</td>
                                        <td style={tdStyle}></td>
                                        <td style={{ ...tdStyle, fontWeight: 800 }}>{block.totalCount}</td>
                                        <td style={{ ...tdStyle, fontWeight: 800 }}>{block.totalAmount}</td>
                                      </tr>
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Signature area */}
                          <div style={{
                            margin: '48px 48px 24px 0',
                            textAlign: "right",
                            fontWeight: 700,
                            fontSize: 15
                          }}>
                            PRINCIPAL<br />
                            <span style={{ fontWeight: 400, fontSize: 12 }}>GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end report */}
                  </div>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </section>

      {/* Print styles for report - matches AppIssuseCoursewise */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #consolidate-report, #consolidate-report * { visibility: visible !important; }
          #consolidate-report {
            position: absolute !important;
            left: 0; top: 0; width: 100vw !important; min-height: 100vh !important;
            margin: 0 !important; padding: 0 !important; background: #fff !important;
          }
          nav, .breadcrumb, button, .btn, footer { display: none !important; }
          @page { size: A4 portrait; margin: 8mm; }
        }
      `}</style>
      <style>{`
        .exp-cert-table, .exp-cert-table th, .exp-cert-table td {
          border: 1px solid #222 !important;
        }
      `}</style>
    </>
  );
}
const thStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  fontWeight: 700,
  background: "#f4f4f4",
  textAlign: "center",
};
const tdStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  textAlign: "center",
};
