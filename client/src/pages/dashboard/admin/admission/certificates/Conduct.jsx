// Conduct.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";
import Select from "react-select";

/* ================= PREVIEW ================= */

const ConductCertificatePreview = React.forwardRef(({ data }, ref) => {
  if (!data) return null;

  const {
    certificateNo,
    name,
    regNo,
    Department,
    sem,
    academicYear,
    conduct,
    date,
  } = data;

  return (
    <div id="conduct-preview" ref={ref}>
      <div className="page-inner">

        {/* HEADER */}
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

        {/* REF ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "45px 12mm 0 12mm",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <div>
            Ref No : {certificateNo}
            <div>Date : {date}</div>
          </div>
          <div>Reg No : {regNo}</div>
        </div>

        {/* BODY */}
        <div className="page-body">
          <div
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: 800,
              textDecoration: "underline",
              margin: "30px 0 20px",
            }}
          >
            CONDUCT CERTIFICATE
          </div>

          <div
            style={{
              margin: "0 12mm",
              fontSize: 16,
              lineHeight: 1.8,
              textAlign: "justify",
            }}
          >
            This is to certify that <b>{name}</b> (Register Number:
            <b> {regNo}</b>) is a bonafide student of this institution,
            studying <b>Semester {sem}</b> in the department of{" "}
            <b>{Department}</b> during the academic year{" "}
            <b>{academicYear}</b>.
          </div>

          <div
            style={{
              margin: "12mm 12mm",
              fontSize: 16,
              lineHeight: 1.8,
              textAlign: "justify",
            }}
          >
            During the period of study in this institution, the conduct and
            character of the student was found to be{" "}
            <b>{conduct}</b>.
          </div>
        </div>

        {/* FOOTER */}
        <div className="page-footer">
          <div style={{ textAlign: "right", marginRight: "12mm" }}>
            <div style={{ fontWeight: 700 }}>PRINCIPAL</div>
            <div style={{ fontSize: 12 }}>
              DR. KALAM POLYTECHNIC COLLEGE
            </div>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        #conduct-preview {
          display: flex;
          justify-content: center;
          background: #f0f0f0;
          padding: 18px 0;
        }

        .page-inner {
          width: 210mm;
          height: 297mm;
          border: 2px solid #222;
          padding: 12mm;
          background: #fff;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .page-body {
          flex: 1;
        }

        .page-footer {
          margin-top: 20mm;
        }

        @media print {
          body * { visibility: hidden !important; }
          #conduct-preview, #conduct-preview * {
            visibility: visible !important;
          }

          #conduct-preview {
            padding: 0;
            background: transparent;
          }

          .page-inner {
            box-shadow: none;
            margin: 0;
          }

          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
});

/* ================= MAIN ================= */

const Conduct = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    regNo: "",
    name: "",
    Department: "",
    sem: "",
    academicYear: "",
  });
  const [previewData, setPreviewData] = useState(null);
  const previewRef = useRef();

  useEffect(() => {
    fetch("/api/studentMaster")
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.filter(
          (s) => s.Register_Number && s.Student_Name
        );
        setStudents(filtered);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Generate options for react-select
  const regNoOptions = students.map(s => ({
    value: s.Register_Number,
    label: `${s.Register_Number} - ${s.Student_Name}`
  }));

  const handleRegNoChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setForm(p => ({ ...p, regNo: value }));

    if (value) {
      const s = students.find((x) => x.Register_Number === value);
      if (s) {
        setForm((p) => ({
          ...p,
          regNo: value,
          name: s.Student_Name,
          Department: s.Course_Name,
          sem: s.Semester,
          academicYear: s.Academic_Year,
        }));
      }
    } else {
      setForm({
        regNo: "",
        name: "",
        Department: "",
        sem: "",
        academicYear: "",
      });
    }
  };

  const handleGenerate = () => {
    if (!form.regNo) return toast.error("Select Register Number");

    setPreviewData({
      ...form,
      certificateNo: `CC/${form.regNo}/${new Date().getFullYear()}`,
      conduct: "GOOD",
      date: new Date().toLocaleDateString("en-IN"),
    });

    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handlePrint = () => {
    const previewEl = document.getElementById("conduct-preview") || previewRef.current;
    if (!previewEl) return toast.error("Nothing to print");

    // find local component <style> that contains our preview rules (if any)
    const allStyles = Array.from(document.querySelectorAll('style'));
    const componentStyle = allStyles.find(s => s.innerText && s.innerText.includes('#conduct-preview'));
    const extraStyle = componentStyle ? componentStyle.innerText : '';

    // Basic print/reset styles + component styles
    const headStyle = `
      @page { size: A4 portrait; margin: 12mm; }
      html, body { margin: 0; padding: 0; }
      body { font-family: "Times New Roman", serif; background: #fff; }
      #conduct-preview { width: 210mm; height: 297mm; box-sizing: border-box; margin: 0 auto; }
      img { -webkit-print-color-adjust: exact; }
      ${extraStyle}
    `;

    // Clone preview and resolve all <img> src to absolute URLs so new window can load them
    const clone = previewEl.cloneNode(true);
    const imgsInClone = clone.querySelectorAll('img');
    imgsInClone.forEach((img) => {
      const src = img.getAttribute('src') || '';
      try {
        const abs = new URL(src, window.location.href).href;
        img.setAttribute('src', abs);
      } catch (e) {
        // leave as-is if URL resolution fails
      }
    });
    const previewHtml = clone.outerHTML;

    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) { return toast.error('Please allow popups to print the document'); }

    const doc = `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Conduct Certificate</title>
          <base href="${window.location.origin}" />
          <style>${headStyle}</style>
        </head>
        <body>
          ${previewHtml}
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(doc);
    win.document.close();

    // Wait for images in the new window to load before printing
    const imgs = win.document.images;
    const promises = Array.from(imgs).map(img => new Promise(res => {
      if (img.complete) return res();
      img.onload = img.onerror = () => res();
    }));

    Promise.all(promises).then(() => {
      setTimeout(() => { try { win.focus(); win.print(); } catch (e) { console.error(e); } }, 120);
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">

            <h4 className="fw-semibold mb-3">Conduct Certificate</h4>

            <div className="card p-3 mb-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Reg No</label>
                  <Select
                    options={regNoOptions}
                    value={regNoOptions.find(opt => opt.value === form.regNo) || null}
                    onChange={handleRegNoChange}
                    placeholder="Select Reg No"
                    isClearable
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Student Name</label>
                  <input className="form-control" value={form.name} readOnly />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Department</label>
                  <input className="form-control" value={form.Department} readOnly />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Semester</label>
                  <input className="form-control" value={form.sem} readOnly />
                </div>

                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button className="btn btn-outline-primary" onClick={handleGenerate}>
                    Generate
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setPreviewData(null)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {previewData && (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <button className="btn btn-outline-primary" onClick={handlePrint}>
                    <Icon icon="material-symbols:print" /> Print
                  </button>
                </div>
                <ConductCertificatePreview data={previewData} ref={previewRef} />
              </>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default Conduct;
