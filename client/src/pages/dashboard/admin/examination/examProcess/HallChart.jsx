import React, { useState, useMemo, useRef, useEffect } from "react";
import api from '../../../../../utils/api';
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import DataTable from "../../../../../components/DataTable/DataTable";
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';

const LOGO_SRC = "/public/assets/images/GRT.png";

const generateHallChartHtml = (hallData, title = "Hall Chart") => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  let fullHtml = '';

  hallData.forEach((hall) => {
    // Summary logic
    const summary = {};
    hall.students.forEach(student => {
      const key = `${student.semester}-${student.dept_short}-${student.subject_code}`;
      if (!summary[key]) {
        summary[key] = {
          semester: student.semester,
          dept_name: student.dept_name,
          subject_name: student.subject_name,
          count: 0
        };
      }
      summary[key].count++;
    });

    const summaryRows = Object.values(summary).map(item => `
      <tr>
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">${item.semester}</td>
        <td style="border: 1px solid #000; padding: 4px;">${item.dept_name}</td>
        <td style="border: 1px solid #000; padding: 4px;">${item.subject_name}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">${item.count}</td>
      </tr>
    `).join('');

    // Seats Grid logic
    const columns = {};
    hall.students.forEach(student => {
      const col = student.seat_column || 'A';
      if (!columns[col]) columns[col] = [];
      columns[col].push(student);
    });

    const seatColumnsHtml = Object.keys(columns).sort().map(colLetter => `
      <div style="flex: 1; border: 1px solid #000; margin: 2px;">
        <div style="background: #f2f2f2; border-bottom: 1px solid #000; text-align: center; font-weight: bold; font-size: 11px;">${colLetter}</div>
        <div style="padding: 2px;">
          ${columns[colLetter]
        .sort((a, b) => (a.seat_label || 0) - (b.seat_label || 0))
        .map(student => `
              <div style="border: 1px solid #eee; margin-bottom: 4px; padding: 2px; text-align: center;">
                <div style="font-size: 10px; font-weight: bold;">${student.seat_label_full}</div>
                <div style="font-size: 9px; font-family: monospace;">${student.register_number}</div>
                <div style="font-size: 8px; color: #555;">${student.dept_short}</div>
              </div>
            `).join('')}
        </div>
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

          <!-- Report Title -->
          <div style="text-align: center; margin-bottom: 15px; font-weight: 900; font-size: 14px; text-decoration: underline; text-transform: uppercase;">
            ${title}
          </div>

          <!-- Exam Info -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid #000; margin-bottom: 10px; font-size: 11px;">
            <div style="padding: 4px; border-right: 1px solid #000;"><strong>DATE:</strong> ${formatDate(hall.exam_date)}</div>
            <div style="padding: 4px; border-right: 1px solid #000;"><strong>SESSION:</strong> ${hall.session}</div>
            <div style="padding: 4px; border-right: 1px solid #000;"><strong>DAY:</strong> ${getDayName(hall.exam_date)}</div>
            <div style="padding: 4px;"><strong>HALL NO:</strong> ${hall.hall_code}</div>
          </div>

          <!-- Summary Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px;">
            <thead>
              <tr style="background: #f2f2f2;">
                <th style="border: 1px solid #000; padding: 4px; width: 10%;">Sem</th>
                <th style="border: 1px solid #000; padding: 4px; width: 35%;">Department</th>
                <th style="border: 1px solid #000; padding: 4px; width: 45%;">Subject</th>
                <th style="border: 1px solid #000; padding: 4px; width: 10%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${summaryRows}
              <tr style="font-weight: bold; background: #eee;">
                <td colspan="3" style="border: 1px solid #000; padding: 4px; text-align: right;">TOTAL :</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${hall.students.length}</td>
              </tr>
            </tbody>
          </table>

          <!-- Seat Grid Title -->
          <div style="margin-bottom: 5px; font-size: 11px; font-weight: bold;">SEATING ARRANGEMENT:</div>
          
          <!-- Seats Grid -->
          <div style="display: flex; gap: 5px; flex-wrap: wrap;">
            ${seatColumnsHtml}
          </div>

          <!-- Footer Signature -->
          <div style="margin-top: auto; padding-top: 40px; text-align: right; font-size: 11px; font-weight: bold;">
            <div style="margin-top: 30px;">CHIEF SUPERINTENDENT</div>
          </div>
        </div>
      </div>
    `;
  });

  return `
    <html>
      <head>
        <title>${title}</title>
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

const HallChart = () => {
  const [date, setDate] = useState('');
  const [dates, setDates] = useState([]);
  // Fetch exam dates from database
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
  const [session, setSession] = useState('FN');

  const [reportData, setReportData] = useState([]);
  const [hallData, setHallData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const reportRef = useRef(null);

  const dateSession = useMemo(() => formatDateSession(date, session), [date, session]);

  const columns = useMemo(() => inferColumns(reportData), [reportData]);

  const handleView = () => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);
    api.get('/seat-assignments', {
      params: {
        examDate: date,
        session: session
      }
    })
      .then(response => {
        const hallChartData = response.data || [];
        const flatData = [];
        let serialNo = 1;

        hallChartData.forEach(hall => {
          hall.students.forEach(student => {
            flatData.push({
              sno: serialNo++,
              hall_code: hall.hall_code,
              seat_label: student.seat_label_full,
              register_number: student.register_number,
              subject_code: student.subject_code,
              subject_name: student.subject_name,
              dept_code: student.dept_code,
              dept_short: student.dept_short,
              semester: student.semester,
              date: hall.exam_date,
              session: hall.session,
              day_order: hall.day_order
            });
          });
        });

        setHallData(hallChartData);
        setReportData(flatData);
        setShowReport(true);

        if (flatData.length === 0) {
          toast.success('No assignments for this date');
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
    if (!hallData || hallData.length === 0) {
      toast.error("No data to print");
      return;
    }

    const html = generateHallChartHtml(hallData, "Hall Chart Report");
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
              <h6 className="fw-semibold mb-0">Hall Chart</h6>
            </div>

            {/* FILTER CARD */}
            <div className="card shadow-sm border-0 radius-12 mb-24">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-0">Report Generation</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Select date and session to generate hall chart
                  </span>
                </div>
                <button
                  className="btn btn-outline-info radius-8 d-flex align-items-center gap-2 fw-bold"
                  style={{ height: '42px' }}
                  onClick={handlePrint}
                  disabled={!hallData.length}
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
                      title={`Hall Chart Preview - ${dateSession || ''}`}
                      enableExport={true}
                      enableActions={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </section>
    </>
  );
};

export default HallChart;