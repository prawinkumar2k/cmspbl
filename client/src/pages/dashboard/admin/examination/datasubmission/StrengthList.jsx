import React, { useState, useRef, useMemo } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import toast, { Toaster } from "react-hot-toast";

const LOGO_SRC = "/public/assets/images/GRT.png";

// Helper to generate paginated report (Strict 10 rows per page)
const generateStrengthListReportHtml = (reportData, reportTitle) => {
  const rowsPerPage = 10;

  // Flatten data for pagination logic
  const flatRows = [];
  reportData.groups.forEach((g) => {
    // Group Header Row
    flatRows.push({ type: 'header', content: `${g.exam_date} – ${g.session}` });

    // Data Rows
    g.records.forEach((r, idx) => {
      flatRows.push({ type: 'data', ...r, sNo: idx + 1 });
    });

    // Group Footer (Total) Row
    flatRows.push({ type: 'footer', ...g.totals });
  });

  const totalPages = Math.ceil(flatRows.length / rowsPerPage);
  let fullHtml = '';

  for (let i = 0; i < totalPages; i++) {
    const pageData = flatRows.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
    let tableRows = '';

    pageData.forEach((row, idx) => {
      if (row.type === 'header') {
        tableRows += `
          <tr style="height: 35px; background-color: #f9f9f9;">
            <td colspan="11" style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px; font-weight: bold;">
              ${row.content}
            </td>
          </tr>
        `;
      } else if (row.type === 'footer') {
        tableRows += `
          <tr style="height: 35px; font-weight: bold; background-color: #f2f2f2;">
            <td colspan="8" style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px;">Total Candidates</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.regular}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.arrear}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.total}</td>
          </tr>
        `;
      } else {
        tableRows += `
          <tr style="height: 35px;">
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.sNo}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.qpc}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px;">${row.dept_name}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.dept_code}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.regulation}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.sem}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.sub_code}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px;">${row.sub_name}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.regular}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.arrear}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.total}</td>
          </tr>
        `;
      }
    });

    // Fill empty rows to make exactly 10 rows per page
    const emptyRowsCount = rowsPerPage - pageData.length;
    for (let j = 0; j < emptyRowsCount; j++) {
      tableRows += `
        <tr style="height: 35px;">
          ${Array(11).fill('<td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>').join('')}
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

          <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px; text-decoration: underline; text-transform: uppercase;">
            ${reportTitle}
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 5px; table-layout: fixed;">
            <thead>
              <tr style="background-color: #f2f2f2; height: 32px;">
                <th style="border: 1.5px solid #000; width: 4%; font-size: 10px; text-align: center;">S.No</th>
                <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">QPC</th>
                <th style="border: 1.5px solid #000; width: 18%; font-size: 10px; text-align: center;">Dept Name</th>
                <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">Code</th>
                <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">Regl</th>
                <th style="border: 1.5px solid #000; width: 6%; font-size: 10px; text-align: center;">Sem</th>
                <th style="border: 1.5px solid #000; width: 10%; font-size: 10px; text-align: center;">Sub Code</th>
                <th style="border: 1.5px solid #000; width: 22%; font-size: 10px; text-align: center;">Subject</th>
                <th style="border: 1.5px solid #000; width: 5%; font-size: 10px; text-align: center;">Reg</th>
                <th style="border: 1.5px solid #000; width: 5%; font-size: 10px; text-align: center;">Arr</th>
                <th style="border: 1.5px solid #000; width: 6%; font-size: 10px; text-align: center;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div style="margin-top: auto; padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px;">
            <div style="text-align: center; width: 200px;">
              <div style="margin-top: 10px;"><b>OFFICE ASST.</b></div>
            </div>
            <div style="text-align: center; width: 200px;">
              <div style="margin-top: 10px;"><b>CONVENOR / AO</b></div>
            </div>
            <div style="text-align: center; width: 200px;">
              <div style="margin-top: 10px;"><b>PRINCIPAL</b></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <html>
      <head>
        <title>Strength List Report</title>
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
  `;
};

const StrengthList = () => {
  const [reportType, setReportType] = useState("normal");
  const [report, setReport] = useState(null);
  const reportRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/strengthlist/report", {
        params: { type: reportType }
      });
      setReport(res.data);
      toast.success("Report generated successfully!");
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!report) {
      toast.error("No records found to print");
      return;
    }

    const html = generateStrengthListReportHtml(report, "Strength List");
    const win = window.open('', '_blank');
    if (!win) {
      toast.error('Please allow pop-ups to print the report');
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

  return (
    <>

      <Toaster position="top-right" />
      <section className="overlay" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body p-24">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-24">
              <h6 className="fw-semibold mb-0">Strength List</h6>
            </div>

            {/* FILTER CARD */}
            <div className="card shadow-sm border-0 radius-12 mb-24">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-0">Report Generation</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Filter records and generate the strength list report
                  </span>
                </div>
                <button
                  className="btn btn-outline-info radius-8 d-flex align-items-center gap-2 fw-bold"
                  style={{ height: '42px' }}
                  onClick={handlePrint}
                  disabled={!report}
                >
                  <Icon icon="mdi:printer" className="text-lg" />
                  Generate Report
                </button>
              </div>

              <div className="p-24">
                <div className="row g-20 align-items-end">
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-primary-light mb-8">Report Type</label>
                    <select
                      className="form-select radius-8 border-neutral-300"
                      style={{ height: '42px', backgroundColor: 'white', color: '#333' }}
                      value={reportType}
                      onChange={e => setReportType(e.target.value)}
                    >
                      <option value="normal">Normal Strength List</option>
                      <option value="simple">Simple Strength List</option>
                      <option value="detailed">Detailed Strength List</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-8 d-flex justify-content-end align-items-end">
                    <button
                      className="btn btn-primary-600 radius-8 px-32"
                      style={{ height: '42px' }}
                      onClick={generateReport}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Search"}
                    </button>
                  </div>
                </div>
              </div>

              {/* IN-PAGE PREVIEW */}
              {report && (
                <div className="card-body p-24 border-top">
                  <div className="d-flex align-items-center justify-content-between mb-16">
                    <h6 className="text-md fw-bold mb-0">Strength List Preview</h6>
                    <span className="badge bg-primary-100 text-primary-600 px-12 py-6 radius-4">
                      Groups: {report.groups.length}
                    </span>
                  </div>

                  <div ref={reportRef} className="table-responsive">
                    <table className="table table-bordered custom-table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>QPC</th>
                          <th>Dept Name</th>
                          <th>Dept Code</th>
                          <th>Regl</th>
                          <th>Sem</th>
                          <th>Sub Code</th>
                          <th>Subject</th>
                          <th>Regular</th>
                          <th>Arrear</th>
                          <th>Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {report.groups.map((g, gi) => (
                          <React.Fragment key={gi}>
                            <tr>
                              <td colSpan="11" className="bg-light text-start ps-3 fw-bold">
                                {g.exam_date} – {g.session}
                              </td>
                            </tr>
                            {g.records.map((r, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{r.qpc}</td>
                                <td>{r.dept_name}</td>
                                <td>{r.dept_code}</td>
                                <td>{r.regulation}</td>
                                <td>{r.sem}</td>
                                <td>{r.sub_code}</td>
                                <td className="text-start">{r.sub_name}</td>
                                <td>{r.regular}</td>
                                <td>{r.arrear}</td>
                                <td>{r.total}</td>
                              </tr>
                            ))}
                            <tr className="table-secondary fw-bold">
                              <td colSpan="8" className="text-start ps-3">Total Candidates</td>
                              <td>{g.totals.regular}</td>
                              <td>{g.totals.arrear}</td>
                              <td>{g.totals.total}</td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
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
};

export default StrengthList;
