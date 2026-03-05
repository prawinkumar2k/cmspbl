import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Sidebar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/footer.jsx";
import { toast, ToastContainer } from 'react-toastify';
import generateNormalStrengthReportHtml from "../Reports/NormalStrengthReport";

const sampleData = [
  // 09-Sep-2024 FN
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "161", Department: "DCE", Regl: "N", Sem: "6", ColNo: "1", SubCode: "4010610", SubjectName: "Construction Management", Regular: 0, Suppl: 0, Candidate: 0 },
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "261", Department: "DME", Regl: "N", Sem: "6", ColNo: "1", SubCode: "4020610", SubjectName: "Industrial Engineering and Management", Regular: 0, Suppl: 3, Candidate: 3 },
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "362", Department: "DAE", Regl: "N", Sem: "6", ColNo: "3", SubCode: "4020531", SubjectName: "Computer Integrated Manufacturing *", Regular: 0, Suppl: 0, Candidate: 0 },
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "561", Department: "DEEE", Regl: "N", Sem: "6", ColNo: "1", SubCode: "4030610", SubjectName: "Distribution and Utilization", Regular: 0, Suppl: 0, Candidate: 0 },
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "661", Department: "DECE", Regl: "N", Sem: "6", ColNo: "1", SubCode: "4040610", SubjectName: "Computer Hardware Servicing and Networking", Regular: 0, Suppl: 0, Candidate: 0 },
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "1061", Department: "DCOMP", Regl: "N", Sem: "6", ColNo: "1", SubCode: "4052610", SubjectName: "Computer Hardware and Servicing", Regular: 0, Suppl: 0, Candidate: 0 },
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "201", Department: "DCE", Regl: "N", Sem: "5", ColNo: "2", SubCode: "4010510", SubjectName: "Surveying", Regular: 2, Suppl: 1, Candidate: 3 },
  { ExamDate: "09-Sep-2024", Session: "FN", EQC: "301", Department: "DME", Regl: "N", Sem: "5", ColNo: "2", SubCode: "4020510", SubjectName: "Thermodynamics", Regular: 1, Suppl: 2, Candidate: 3 },
  // 12-Sep-2025 FN
  { ExamDate: "12-Sep-2025", Session: "FN", EQC: "103", Department: "I Year", Regl: "R202", Sem: "2", ColNo: "2", SubCode: "ME23212C", SubjectName: "BASICS OF MECHANICAL ENGINEERING", Regular: 0, Suppl: 8, Candidate: 8 },
  { ExamDate: "12-Sep-2025", Session: "FN", EQC: "104", Department: "I Year", Regl: "R202", Sem: "2", ColNo: "3", SubCode: "ME23213C", SubjectName: "ENGINEERING GRAPHICS", Regular: 2, Suppl: 6, Candidate: 8 },
  // 12-Sep-2025 AN
  { ExamDate: "12-Sep-2025", Session: "AN", EQC: "4020620", Department: "DEEE", Regl: "N", Sem: "4", ColNo: "4", SubCode: "4020620", SubjectName: "E-Vehicle Technology and Policy", Regular: 0, Suppl: 12, Candidate: 12 },
  { ExamDate: "12-Sep-2025", Session: "AN", EQC: "4020621", Department: "DEEE", Regl: "N", Sem: "4", ColNo: "5", SubCode: "4020621", SubjectName: "Power Electronics", Regular: 3, Suppl: 9, Candidate: 12 },
  // 17-Sep-2025 FN
  { ExamDate: "17-Sep-2025", Session: "FN", EQC: "21", Department: "I Year", Regl: "M", Sem: "2", ColNo: "1", SubCode: "30021", SubjectName: "COMMUNICATION ENGLISH - II", Regular: 0, Suppl: 0, Candidate: 0 },
  { ExamDate: "17-Sep-2025", Session: "FN", EQC: "22", Department: "I Year", Regl: "M", Sem: "2", ColNo: "2", SubCode: "30022", SubjectName: "MATHEMATICS - II", Regular: 1, Suppl: 1, Candidate: 2 },
];

const NormalStrengthList = () => {
  const [data, setData] = useState(sampleData);
  const [loading, setLoading] = useState({ close: false });
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    setPreviewHtml(generateNormalStrengthReportHtml(data));
  }, [data]);

  const handlePrintNow = () => {
    if (!previewHtml) return;
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
      doc.write(previewHtml);
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
    setLoading(l => ({ ...l, close: true }));
    toast.success('Closing report');
    setTimeout(() => {
      setLoading(l => ({ ...l, close: false }));
      window.history.back();
    }, 1000);
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
          {/* Breadcrumb Header (Address Bar) */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Normal Strength List</h6>
          </div>
          {/* Action toolbar for PRINT/CLOSE */}
          <div className="card p-3 mb-4" style={{ borderRadius: 8 }}>
            <div className="d-flex align-items-center" style={{ gap: 12 }}>
              <div className="ms-auto d-flex align-items-center" style={{ gap: 8 }}>
                <button className="btn btn-outline-primary-600 radius-8 px-20 py-11 me-2" onClick={handlePrintNow} style={{ minWidth: 90, position: 'relative' }}>PRINT</button>
                <button
                  className="btn btn-outline-danger-600 radius-8 px-20 py-11 me-2"
                  style={{ minWidth: 90, position: 'relative' }}
                  onClick={handleClose}
                  disabled={loading.close}
                >
                  {loading.close && <span className="spinner-border spinner-border-sm me-1" />}
                  CLOSE
                </button>
              </div>
            </div>
          </div>
          <div className="cd-table-container" style={{ marginTop: 16 }}>
            <div className="preview-container" style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default NormalStrengthList;
