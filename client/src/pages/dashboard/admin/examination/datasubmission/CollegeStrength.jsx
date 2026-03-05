import React from "react";
import { toast, ToastContainer } from 'react-toastify';
// import generateCollegeStrengthReportHtml from "./Reports/CollegeStrengthReport";
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";

const sampleRows = [
  { code: '1020', branch: 'MECHANICAL ENGINEERING (FULL TIME)', year1: 29, year2: 33, year3: 27, year4: '', others: 4, total: 93 },
  { code: '1030', branch: 'ELECTRICAL AND ELECTRONICS ENGINEERING (FULL TIME)', year1: 22, year2: 32, year3: 14, year4: '', others: 8, total: 76 },
  { code: '1040', branch: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year1: 4, year2: 2, year3: 1, year4: '', others: '', total: 7 },
  { code: '1052', branch: 'COMPUTER ENGINEERING (FULL TIME)', year1: 20, year2: 22, year3: '', year4: '', others: '', total: 42 },
  { code: '1060', branch: 'TEXTILE TECHNOLOGY (FULL TIME)', year1: 33, year2: 16, year3: 27, year4: '', others: '', total: 76 },
  { code: '1061', branch: 'TEXTILE PROCESSING (FULL TIME)', year1: 26, year2: 26, year3: 10, year4: '', others: 7, total: 69 },
  { code: '1068', branch: 'TEXTILE TECHNOLOGY (KNITTING FULL)', year1: 18, year2: 19, year3: 9, year4: '', others: 6, total: 52 },
];

const totals = {
  year1: 152,
  year2: 150,
  year3: 88,
  year4: 0,
  others: 25,
  total: 415,
};

const CollegeStrength = () => {
  const handlePrintNow = () => {
    const html = generateCollegeStrengthReportHtml({ rows: sampleRows, totals });
    if (!html) return;
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 800);
      }, 300);
    } catch (err) {
      toast.error('Print failed');
    }
  };

  const handleClose = () => {
    toast.success('Closing college strength');
    setTimeout(() => window.history.back(), 1000);
  };

  return (
    <section className="overlay">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">College Strength</h6>
          </div>

          <div className="card p-3 mb-4 en-flex-card" style={{ borderRadius: 12 }}>
            <div className="d-flex align-items-center justify-content-end w-100" style={{ gap: 10 }}>
              <button className="btn btn-outline-primary-600 radius-8 px-20 py-11 me-2" style={{ minWidth: '100px' }} onClick={handlePrintNow}>
                PRINT
              </button>
              <button className="btn btn-outline-danger-600 radius-8 px-20 py-11" style={{ minWidth: '100px' }} onClick={handleClose}>
                CLOSE
              </button>
            </div>
          </div>

          <div className="card">
            <div className="cd-table-container" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              <div dangerouslySetInnerHTML={{ __html: generateCollegeStrengthReportHtml({ rows: sampleRows, totals }) }} />
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </section>
  );
};

export default CollegeStrength;
