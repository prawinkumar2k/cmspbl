import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../../../components/Sidebar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/footer.jsx";
import { toast, ToastContainer } from 'react-toastify';
import generateSimpleStrengthReportHtml from "../Reports/SimpleStrengthReport";

const sampleData = [
  { SNo: 1, ExamDate: "09-Sep-2024", Session: "FN", Strength: 3, NoOfHall: "", NoOfInternal: "", NoOfExternal: "", Remark: "" },
  { SNo: 2, ExamDate: "12-Sep-2025", Session: "FN", Strength: 8, NoOfHall: "", NoOfInternal: "", NoOfExternal: "", Remark: "" },
  { SNo: 3, ExamDate: "12-Sep-2025", Session: "AN", Strength: 12, NoOfHall: "", NoOfInternal: "", NoOfExternal: "", Remark: "" },
  { SNo: 4, ExamDate: "17-Sep-2025", Session: "FN", Strength: 0, NoOfHall: "", NoOfInternal: "", NoOfExternal: "", Remark: "" },
];

const SimpleStrengthList = () => {
  const [data, setData] = useState(sampleData);
  const [loading, setLoading] = useState({ close: false });
  const [previewHtml, setPreviewHtml] = useState("");

  const grouped = useMemo(() => {
    const out = {};
    data.forEach(row => {
      if (!out[row.EQC]) out[row.EQC] = [];
      out[row.EQC].push(row);
    });
    return out;
  }, [data]);

  useEffect(() => {
    setPreviewHtml(generateSimpleStrengthReportHtml(data));
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
            <h6 className="fw-semibold mb-0">Simple Strength List</h6>
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

export default SimpleStrengthList;
