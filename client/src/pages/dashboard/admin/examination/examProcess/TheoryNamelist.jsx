import React, { useEffect, useMemo, useState, useRef } from 'react';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import DataTable from '../../../../../components/DataTable/DataTable';
import api from '../../../../../utils/api';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';

const LOGO_SRC = "/public/assets/images/GRT.png";

const generateTheoryNamelistHtml = (theoryData, examDate, session) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const paginateStudents = (students) => {
    const pages = [];
    const recordsPerPage = 25;
    for (let i = 0; i < students.length; i += recordsPerPage) {
      pages.push(students.slice(i, i + recordsPerPage));
    }
    return pages;
  };

  let fullHtml = '';

  theoryData.forEach((dept) => {
    dept.subjects.forEach((subject) => {
      subject.halls.forEach((hall) => {
        const studentPages = paginateStudents(hall.students);
        studentPages.forEach((pageStudents, pageIdx) => {
          const tableRows = pageStudents.map(student => `
            <tr>
              <td style="border: 1px solid #000; padding: 4px; text-align: center;">${student.sno}</td>
              <td style="border: 1px solid #000; padding: 4px; font-family: monospace;">${student.register_number}</td>
              <td style="border: 1px solid #000; padding: 4px;">${student.student_name}</td>
              <td style="border: 1px solid #000; padding: 4px;"></td>
              <td style="border: 1px solid #000; padding: 4px;"></td>
            </tr>
          `).join('');

          fullHtml += `
            <div class="page-container" style="page-break-after: always; width: 210mm; height: 296mm; padding: 10mm; box-sizing: border-box; background: white; margin: 0 auto; font-family: 'Times New Roman', Times, serif; overflow: hidden;">
              <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                
                <!-- EX-7 Header -->
                <div style="margin-bottom: 10px; text-align: center;">
                  <div style="font-size: 13px; font-weight: bold;">EX - 7</div>
                  <div style="font-size: 12px; font-weight: bold;">BOARD EXAMINATIONS - OCTOBER 2025</div>
                  <div style="font-size: 12px; font-weight: bold;">ATTENDANCE PARTICULARS OF CANDIDATES</div>
                </div>

                <!-- Info Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; font-size: 10px;">
                  <div><strong>Centre :</strong> 786, GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                  <div style="text-align: right;"><strong>Ques. Code :</strong> ______________</div>
                  <div><strong>Sem / Branch :</strong> ${dept.dept_code} / ${dept.dept_name}</div>
                  <div style="text-align: right;"><strong>Hall Name / No :</strong> ${hall.hall_name}</div>
                  <div><strong>Subject :</strong> ${subject.subject_name}</div>
                  <div style="text-align: right;"><strong>Date & Session :</strong> ${formatDate(examDate)} ${session}</div>
                </div>

                <!-- Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px;">
                  <thead>
                    <tr style="background: #f2f2f2;">
                      <th style="border: 1px solid #000; padding: 6px; width: 8%;">SNO</th>
                      <th style="border: 1px solid #000; padding: 6px; width: 22%;">REGISTER No</th>
                      <th style="border: 1px solid #000; padding: 6px; width: 35%;">STUDENT NAME</th>
                      <th style="border: 1px solid #000; padding: 6px; width: 15%;">ANSWER BOOK NO</th>
                      <th style="border: 1px solid #000; padding: 6px; width: 20%;">SIGNATURE</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows}
                  </tbody>
                </table>

                ${pageIdx === studentPages.length - 1 ? `
                  <div style="margin-bottom: 20px; display: flex; justify-content: space-between; font-size: 10px; font-weight: bold;">
                    <div>Total number of candidates present : _________</div>
                    <div>Total number of candidates absent : _________</div>
                  </div>
                ` : ''}

                <!-- Signatures -->
                <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 10px; font-weight: bold; padding-top: 20px;">
                  <div style="text-align: center;">Hall Superintendent</div>
                  <div style="text-align: center;">Addl. Chief Superintendent</div>
                  <div style="text-align: center;">Chief Superintendent</div>
                </div>
              </div>
            </div>
          `;
        });
      });
    });
  });

  return `
    <html>
      <head>
        <title>Theory Name List</title>
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

const TheoryNamelist = () => {
  const [date, setDate] = useState('');
  const [dates, setDates] = useState([]);
  const [session, setSession] = useState('FN');
  const [reportData, setReportData] = useState([]);
  const [theoryData, setTheoryData] = useState([]);
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
    api.get('/theoryNameList/theory-name-list-report', {
      params: {
        examDate: date,
        session: session
      }
    })
      .then(response => {
        const theoryReportData = response.data || [];
        const flatData = [];
        let serialNo = 1;

        theoryReportData.forEach(dept => {
          dept.subjects.forEach(subject => {
            subject.halls.forEach(hall => {
              hall.students.forEach(student => {
                flatData.push({
                  sno: serialNo++,
                  dept_code: dept.dept_code,
                  dept_name: dept.dept_name,
                  subject_code: subject.subject_code,
                  subject_name: subject.subject_name,
                  hall_code: hall.hall_code,
                  hall_name: hall.hall_name,
                  register_number: student.register_number,
                  student_name: student.student_name,
                  date: date,
                  session: session
                });
              });
            });
          });
        });

        setTheoryData(theoryReportData);
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
    if (!theoryData || theoryData.length === 0) {
      toast.error("No data to print");
      return;
    }

    const html = generateTheoryNamelistHtml(theoryData, date, session);
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
    setTheoryData([]);
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
              <h6 className="fw-semibold mb-0">Theory Name List</h6>
            </div>

            {/* FILTER CARD */}
            <div className="card shadow-sm border-0 radius-12 mb-24">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-0">Report Generation</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Select date and session to generate theory name list
                  </span>
                </div>
                <button
                  className="btn btn-outline-info radius-8 d-flex align-items-center gap-2 fw-bold"
                  style={{ height: '42px' }}
                  onClick={handlePrint}
                  disabled={!theoryData.length}
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
                      title={`Theory Name List Preview - ${dateSession || ''}`}
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

export default TheoryNamelist;
