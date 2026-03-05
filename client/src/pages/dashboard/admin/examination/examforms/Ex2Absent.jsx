import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import DataTable from "../../../../../components/DataTable/DataTable";
import { toast, ToastContainer } from 'react-toastify';
import { Icon } from '@iconify/react';

// Logo and watermark
const LOGO_SRC = "/assets/images/GRT.png";

const thStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  fontWeight: 700,
  background: "#f4f4f4",
  textAlign: "center",
  color: "#222"
};

const tdStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  textAlign: "center",
  color: "#222"
};

export default function Ex2Absent() {
  const [examDate, setExamDate] = useState("");
  const [examSession, setExamSession] = useState("");
  const [examSubject, setExamSubject] = useState('ALL');
  const [timetable, setTimetable] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportRef = useRef(null);

  const dates = useMemo(() => {
    if (!Array.isArray(timetable)) return [];
    return [...new Set(timetable.map(t => (t.exam_date || '').toString()))].filter(Boolean);
  }, [timetable]);

  const sessions = useMemo(() => {
    if (!examDate) return [];
    return [...new Set(timetable.filter(t => (t.exam_date || '') === examDate).map(t => t.session))].filter(Boolean);
  }, [timetable, examDate]);

  const subjects = useMemo(() => {
    if (!examDate || !examSession) return [];
    const filtered = timetable.filter(t => (t.exam_date || '') === examDate && (t.session || '') === examSession);
    const seen = new Set();
    return filtered.reduce((acc, cur) => {
      const key = (cur.subject_code || cur.subject_name || '').toString();
      if (!seen.has(key)) {
        seen.add(key);
        acc.push({ subject_code: cur.subject_code || key, subject_name: cur.subject_name || key });
      }
      return acc;
    }, []);
  }, [timetable, examDate, examSession]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/timetable');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const body = await res.json();
        const data = Array.isArray(body) ? body : (body.data && Array.isArray(body.data) ? body.data : []);
        const mapped = data.map(item => ({
          exam_date: item.exam_date || item.Exam_Date || item.date || '',
          session: item.session || item.Session || item.shift || '',
          subject_code: item.subject_code || item.Sub_Code || item.code || '',
          subject_name: item.subject_name || item.Sub_Name || item.name || ''
        }));
        setTimetable(mapped);
      } catch (err) {
        console.error('Failed to load timetable', err);
        setTimetable([]);
      }
    })();
  }, []);

  const handleClose = () => {
    setExamDate("");
    setExamSession("");
    setExamSubject("ALL");
    setTableData([]);
    setShowTable(false);
    toast.success("Filters cleared");
  };

  const handleView = async () => {
    if (!examDate || !examSession) {
      toast.error('Please select Exam Date and Session');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/examAttendance');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const body = await res.json();
      const data = Array.isArray(body) ? body : (body.data && Array.isArray(body.data) ? body.data : []);

      const filtered = data.filter(item => {
        const matchesDate = String(item.exam_date || '') === String(examDate);
        const matchesSession = !examSession || String(item.session || '') === String(examSession);
        const matchesSubject = (examSubject && examSubject !== 'ALL') ?
          (String(item.subject_name || '') === String(examSubject) || String(item.subject_code || '') === String(examSubject)) : true;

        const status = String(item.attendance_status || item.attendance || item.status || '').toLowerCase();
        const isAbsent = status === 'absent' || status === 'a' || status.includes('absent');
        return matchesDate && matchesSession && matchesSubject && isAbsent;
      });

      const mapped = filtered.map((item, idx) => ({
        Id: item.Id || item.id || idx + 1,
        hallName: item.hall_name || item.hall || '',
        regNo: item.register_number || item.reg_no || '',
        studName: item.student_name || item.name || '',
        attendance: item.attendance_status || 'Absent',
        subject_name: item.subject_name || '',
        subject_code: item.subject_code || ''
      }));

      setTableData(mapped);
      setShowTable(true);
      toast.success(`Loaded ${mapped.length} absent records`);
    } catch (err) {
      console.error('Failed to load exam attendance', err);
      setError(err.message || 'Failed to load');
      toast.error('Failed to load data');
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    { accessorKey: 'hallName', header: 'Hall' },
    { accessorKey: 'regNo', header: 'Reg No' },
    { accessorKey: 'studName', header: 'Student Name' },
    {
      accessorKey: 'attendance',
      header: 'Attendance',
      cell: ({ getValue }) => <span className="badge bg-danger">{getValue()}</span>
    }
  ], []);

  const handlePrint = () => {
    window.print();
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const renderHeader = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 12 }}>
      <div style={{ width: 100, minWidth: 100, textAlign: "center" }}>
        <img src={LOGO_SRC} alt="logo" style={{ width: 90, height: 90, objectFit: "contain" }} />
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
  );

  const renderSignatures = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', marginBottom: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Exam Cell Incharge</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>External Examiner</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Principal / Chief Supdt.</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        /* Hide the report preview on screen */
        .ex2-report-print-container {
          display: none !important;
        }
        @media print {
          body * { visibility: hidden !important; }
          .ex2-report-print-container { display: block !important; }
          .ex2-report-print-container, .ex2-report-print-container * { visibility: visible !important; }
          .ex2-report-print-container {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          nav, .sidebar, .navbar, .breadcrumb, button, .btn, footer, .filter-card, .data-table-section { display: none !important; }
          @page { size: A4 portrait; margin: 10mm; }
        }
      `}</style>

      <section className="overlay">
        <ToastContainer />
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body" style={{ padding: 20 }}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Examination Absentee Report</h6>
            </div>

            <div className="card mb-4 filter-card radius-12 p-24">

              <div className="row g-3 align-items-end">

                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Exam Date</label>
                  <select
                    className="form-select radius-8"
                    value={examDate}
                    onChange={e => { setExamDate(e.target.value); setExamSession(''); setExamSubject('ALL'); }}
                  >
                    <option value="">Select Exam Date</option>
                    {dates.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Session</label>
                  <select
                    className="form-select radius-8"
                    value={examSession}
                    onChange={e => { setExamSession(e.target.value); setExamSubject('ALL'); }}
                    disabled={!examDate}
                  >
                    <option value="">Select Session</option>
                    {sessions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <select
                    className="form-select radius-8"
                    value={examSubject}
                    onChange={e => { setExamSubject(e.target.value); }}
                    disabled={!examSession}
                  >
                    <option value="ALL">ALL</option>
                    {subjects.map(s => (
                      <option key={s.subject_code || s.subject_name} value={s.subject_name || s.subject_code}>
                        {s.subject_name} {s.subject_code ? `(${s.subject_code})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3 d-flex gap-2">
                  <button className="btn btn-outline-primary radius-8 px-20 flex-grow-1" onClick={handleView} disabled={loading}>
                    {loading ? "Loading..." : "View"}
                  </button>
                  <button className="btn btn-outline-secondary radius-8 px-20" onClick={handleClose}>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {showTable && tableData.length > 0 && (
              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  className="btn btn-outline-success radius-8 d-flex align-items-center gap-2 fw-bold px-20"
                  onClick={handlePrint}
                >
                  <Icon icon="solar:printer-outline" className="text-lg" />
                  Print
                </button>
              </div>
            )}

            <div className="data-table-section mb-4">
              <DataTable
                data={tableData}
                columns={columns}
                loading={loading}
                error={error}
                title="Ex2 Absent Candidates"
                enableActions={false}
                pageSize={20}
              />
            </div>

            {showTable && tableData.length > 0 && (
              <div ref={reportRef} className="ex2-report-print-container" style={{ background: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                {(() => {
                  const ROWS_PER_PAGE = 10;
                  const chunks = chunkArray(tableData, ROWS_PER_PAGE);
                  const firstRow = tableData[0] || {};

                  return chunks.map((chunk, pageIdx) => (
                    <div key={pageIdx} className="page-break" style={{
                      border: '2px solid #222',
                      margin: '10px auto',
                      padding: "0 0 24px 0",
                      width: '210mm',
                      minHeight: '280mm',
                      background: '#fff',
                      fontFamily: "'Times New Roman', Times, serif",
                      pageBreakAfter: 'always',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {renderHeader()}

                      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, textDecoration: "underline", margin: "18px 0 12px 0", textTransform: 'uppercase' }}>
                        EX-2 ABSENT CANDIDATES LIST
                      </div>

                      <div style={{ padding: "0 24px" }}>
                        <div style={{ marginBottom: '15px', padding: '12px', border: '1px solid #222' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px' }}><strong>DATE:</strong> {examDate}</span>
                            <span style={{ fontSize: '14px' }}><strong>SESSION:</strong> {examSession}</span>
                          </div>
                          <div style={{ fontSize: '14px' }}>
                            <strong>SUBJECT:</strong> {examSubject === 'ALL' ? firstRow.subject_name : examSubject}
                          </div>
                        </div>

                        <table style={{ width: '100%', border: '1px solid #222', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={thStyle}>S.No</th>
                              <th style={thStyle}>Hall No</th>
                              <th style={thStyle}>Register No</th>
                              <th style={{ ...thStyle, textAlign: 'left' }}>Student Name</th>
                              <th style={thStyle}>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chunk.map((row, idx) => (
                              <tr key={idx}>
                                <td style={tdStyle}>{pageIdx * ROWS_PER_PAGE + idx + 1}</td>
                                <td style={tdStyle}>{row.hallName}</td>
                                <td style={tdStyle}>{row.regNo}</td>
                                <td style={{ ...tdStyle, textAlign: 'left' }}>{row.studName}</td>
                                <td style={tdStyle}>Absent</td>
                              </tr>
                            ))}
                            {chunk.length < ROWS_PER_PAGE && Array.from({ length: ROWS_PER_PAGE - chunk.length }).map((_, i) => (
                              <tr key={`empty-${i}`}>
                                <td style={{ ...tdStyle, height: '35px' }}>&nbsp;</td>
                                <td style={tdStyle}>&nbsp;</td>
                                <td style={tdStyle}>&nbsp;</td>
                                <td style={tdStyle}>&nbsp;</td>
                                <td style={tdStyle}>&nbsp;</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ marginTop: 'auto', padding: "0 24px" }}>
                        {renderSignatures()}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}
