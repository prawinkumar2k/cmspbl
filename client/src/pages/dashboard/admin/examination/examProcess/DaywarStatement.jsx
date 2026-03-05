import React, { useEffect, useMemo, useState, useRef } from 'react';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import DataTable from '../../../../../components/DataTable/DataTable';
import api from '../../../../../utils/api';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';

const LOGO_SRC = "/public/assets/images/GRT.png";

const generateDaywarStatementHtml = (daywarData, examDate, session) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  let fullHtml = '';

  daywarData.forEach((dept) => {
    dept.subjects.forEach((subject) => {
      const studentChunks = [];
      for (let i = 0; i < subject.students.length; i += 40) { // 40 students per page (8x5 grid)
        studentChunks.push(subject.students.slice(i, i + 40));
      }

      studentChunks.forEach((pageStudents, pageIdx) => {
        const rows = [];
        for (let j = 0; j < pageStudents.length; j += 8) {
          rows.push(pageStudents.slice(j, j + 8));
        }

        const gridHtml = rows.map(row => `
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            ${row.map(student => `
              <div style="flex: 1; text-align: center; border: 1px solid #eee; padding: 4px;">
                <div style="font-size: 10px; font-weight: bold; font-family: monospace;">${student.register_number}</div>
                <div style="font-size: 8px; color: #555; overflow: hidden; height: 1.2em;">${student.student_name || ''}</div>
              </div>
            `).join('')}
            ${Array(8 - row.length).fill('<div style="flex: 1;"></div>').join('')}
          </div>
        `).join('');

        fullHtml += `
          <div class="page-container" style="page-break-after: always; width: 210mm; height: 296mm; padding: 10mm; box-sizing: border-box; background: white; margin: 0 auto; font-family: 'Times New Roman', Times, serif; overflow: hidden;">
            <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
              <!-- Header -->
              <div style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                <div style="width: 70px; flex-shrink: 0; text-align: center;">
                  <img src="${LOGO_SRC}" alt="logo" style="width: 60px; height: 60px; object-fit: contain;" />
                </div>
                <div style="flex: 1; text-align: center; padding-right: 40px;">
                  <div style="font-size: 16px; font-weight: 900; letter-spacing: 0.5px; color: #000; line-height: 1.1;">
                    GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                  </div>
                  <div style="font-size: 10px; font-weight: 500; color: #000; line-height: 1.2; margin-top: 4px;">
                    GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                  </div>
                  <div style="font-size: 9px; color: #000; line-height: 1.2;">
                    Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                  </div>
                </div>
              </div>

              <div style="text-align: center; margin-bottom: 15px; font-weight: 900; font-size: 14px; text-decoration: underline; text-transform: uppercase;">
                Daywar Statement Report
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 11px;">
                <div><strong>Date & Session :</strong> ${formatDate(examDate)} & ${session}</div>
                <div style="text-align: right;"><strong>Dept :</strong> ${dept.dept_code} - ${dept.dept_name}</div>
                <div style="grid-column: span 2;"><strong>Subject :</strong> ${subject.subject_code} - ${subject.subject_name}</div>
              </div>

              <div style="flex: 1;">
                ${gridHtml}
              </div>

              ${pageIdx === studentChunks.length - 1 ? `
                <div style="display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 10px; font-size: 11px; font-weight: bold;">
                  <div>Total Regular Candidates: ${subject.total_strength}</div>
                  <div>Department Strength: ${subject.total_strength}</div>
                </div>
              ` : ''}

              <!-- Footer Signature -->
              <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
                <div>CONVENOR / AO</div>
                <div>PRINCIPAL</div>
              </div>
            </div>
          </div>
        `;
      });
    });
  });

  return `
    <html>
      <head>
        <title>Daywar Statement</title>
        <style>
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; padding: 0; background: #eee; }
          @media print {
            body { background: white; }
            .page-container { box-shadow: none !important; margin: 0 !important; }
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        </style>
      </head>
      <body>${fullHtml}</body>
    </html>
  `;
};

const formatDateSession = (date, session) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  const parts = d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/ /g, '-');
  return `${parts} - ${session}`;
};

const inferColumns = (rows = []) => {
  if (!rows || rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys.map(k => ({ header: k.replace(/_/g, ' ').toUpperCase(), accessorKey: k }));
};

const DaywarStatement = () => {
  const [date, setDate] = useState('');
  const [dates, setDates] = useState([]);
  const [session, setSession] = useState('FN');
  const [reportData, setReportData] = useState([]);
  const [daywarData, setDaywarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const dateSession = useMemo(() => formatDateSession(date, session), [date, session]);
  const columns = useMemo(() => inferColumns(reportData), [reportData]);

  // Fetch exam dates on component mount
  useEffect(() => {
    const fetchExamDates = async () => {
      try {
        const response = await api.get('/exam-dates');
        const datesData = response.data || [];
        setDates(datesData);
      } catch (err) {
        console.error('Error fetching exam dates:', err);
        setDates([]);
      }
    };
    fetchExamDates();
  }, []);

  const handleView = () => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);
    api.get('/daywarStatement/daywar-report', {
      params: {
        examDate: date,
        session: session
      }
    })
      .then(response => {
        const daywarReportData = response.data || [];
        const flatData = [];
        let serialNo = 1;

        daywarReportData.forEach(dept => {
          dept.subjects.forEach(subject => {
            subject.students.forEach(student => {
              flatData.push({
                sno: serialNo++,
                dept_code: dept.dept_code,
                dept_name: dept.dept_name,
                subject_code: subject.subject_code,
                subject_name: subject.subject_name,
                register_number: student.register_number,
                student_name: student.student_name,
                date: date,
                session: session
              });
            });
          });
        });

        setDaywarData(daywarReportData);
        setReportData(flatData);
        setShowReport(true);

        if (flatData.length === 0) {
          toast.success('No data for this date');
        } else {
          toast.success(`Generated ${flatData.length} records`);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Error loading report');
      })
      .finally(() => setLoading(false));
  };

  const handlePrint = () => {
    if (!daywarData || daywarData.length === 0) {
      toast.error("No data to print");
      return;
    }

    const html = generateDaywarStatementHtml(daywarData, date, session);
    const win = window.open('', '_blank');
    if (!win) {
      toast.error('Please allow pop-ups to print');
      return;
    }

    win.document.write(html);
    win.document.close();
    win.onload = () => {
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);
    };
  };

  const handleClose = () => {
    setShowReport(false);
    setReportData([]);
    setDaywarData([]);
    setDate('');
    setSession('FN');
  };

  return (
    <>

      <ToastContainer />
      <section className="overlay" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body p-24">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-24">
              <h6 className="fw-semibold mb-0">Daywar Statement</h6>
            </div>

            {/* FILTER CARD */}
            <div className="card shadow-sm border-0 radius-12 mb-24">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-0">Report Generation</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Select date and session to generate daywar statement
                  </span>
                </div>
                <button
                  className="btn btn-outline-info radius-8 d-flex align-items-center gap-2 fw-bold"
                  style={{ height: '42px' }}
                  onClick={handlePrint}
                  disabled={!daywarData.length}
                >
                  <Icon icon="mdi:printer" className="text-lg" />
                  Generate Report
                </button>
              </div>

              <div className="card-body p-24">
                <div className="row g-20 align-items-end">
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">Date <span className="text-danger">*</span></label>
                    <select
                      className="form-select radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    >
                      <option value="">Select Exam Date</option>
                      {dates.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Session</label>
                    <select
                      className="form-select radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      value={session}
                      onChange={e => setSession(e.target.value)}
                    >
                      <option value="FN">FN</option>
                      <option value="AN">AN</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-5 d-flex justify-content-end gap-3 mt-md-0 mt-24">
                    <button
                      className="btn btn-outline-primary radius-8 px-24"
                      style={{ height: '42px' }}
                      onClick={handleView}
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'View'}
                    </button>
                    <button
                      className="btn btn-outline-danger radius-8 px-24"
                      style={{ height: '42px' }}
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </div>
                </div>

                {showReport && (
                  <div className="mt-24 border-top pt-24">
                    <DataTable
                      data={reportData}
                      columns={columns}
                      loading={loading}
                      title={`Daywar Statement Preview - ${dateSession || ''}`}
                      enableExport={true}
                      enableActions={false}
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
};

export default DaywarStatement;
