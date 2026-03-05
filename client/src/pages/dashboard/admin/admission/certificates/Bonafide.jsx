// Bonafide.jsx
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";
import { QRCodeCanvas } from "qrcode.react";
import Select from "react-select";

const DEFAULT_PURPOSES = [
  "Education Loan",
  "Identity Verification",
  "Address Proof",
  "Study Purpose",
  "Scholarship",
  "Other"
];

const DEFAULT_YEARS = (() => {
  const y = new Date().getFullYear();
  return [`${y - 1}-${y}`, `${y}-${y + 1}`, `${y + 1}-${y + 2}`];
})();

const Bonafide = () => {
  const [academicYears] = useState(DEFAULT_YEARS);
  const [purposes, setPurposes] = useState(DEFAULT_PURPOSES);
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [newPurpose, setNewPurpose] = useState("");

  const [students, setStudents] = useState([]);
  const [regOptions, setRegOptions] = useState([]);

  const [form, setForm] = useState({
    academicYear: academicYears[1],
    regNo: "",
    studentName: "",
    address: "",
    branch: "",
    sem: "",
    quota: "",
    admissionYear: "",
    dob: "",
    fatherName: "",
    photo: "",
    purpose: "",
    bNo: "",
  });

  const [previewData, setPreviewData] = useState(null);
  const previewRef = useRef();

  // Load Student Data
  useEffect(() => {
    fetch("/api/studentMaster")
      .then(res => res.json())
      .then(data => {
        // Filter ONLY confirmed/admitted students with valid registration numbers
        const confirmedStudents = data.filter((s) => {
          const status = (s.Admission_Status || s.admission_status || s.status || '').toString().toLowerCase();
          const regNo = String(s.Application_No || '').trim();
          return (status === 'confirmed' || status === 'admitted' || status === 'admission confirmed' || status === 'yes') && regNo.length > 0;
        });

        const mapped = confirmedStudents.map(s => {
          const reg = s.Application_No;

          // Detect photo field from multiple possible keys
          let photoCandidate = s.Photo || s.photo || s.ProfileImage || s.Image || s.image || s.photo_path || s.Photo_Path || s.ImagePath || s.Profile_Pic || "";

          // Normalize path: if it's a filename, construct path under public assets
          let photo = "";
          if (photoCandidate) {
            photoCandidate = String(photoCandidate).trim();
            if (/^https?:\/\//i.test(photoCandidate)) {
              photo = photoCandidate;
            } else if (photoCandidate.startsWith('/')) {
              // remove possible leading /public
              photo = photoCandidate.replace(/^\/public\//, '/');
            } else {
              // treat as filename under assets/images/student/{reg}
              photo = `/assets/student/${photoCandidate}`;
            }
          }

          return {
            regNo: reg,
            name: s.Student_Name,
            branch: s.Course_Name,
            sem: s.Semester,
            admissionYear: s.Year,
            quota: s.Quota || "Management",
            address: s.Current_Address || s.Permanent_Address || "",
            dob: s.Dob || s.DOB || s.Date_Of_Birth || s.date_of_birth || s.birth_date || "",
            fatherName: s.Father_Name || s.FatherName || s.parent_name || "",
            photo,
          };
        });

        setStudents(mapped);
        setRegOptions(mapped.map(s => s.regNo));
      });
  }, []);

  // Autofill on RegNo selection
  useEffect(() => {
    if (!form.regNo) return;

    const s = students.find(st => st.regNo === form.regNo);
    if (!s) return;

    setForm(prev => ({
      ...prev,
      studentName: s.name,
      branch: s.branch,
      sem: s.sem,
      admissionYear: s.admissionYear,
      quota: s.quota,
      address: s.address,
      dob: s.dob,
      fatherName: s.fatherName,
      photo: s.photo || "",
    }));
  }, [form.regNo, students]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Generate options for react-select
  const regNoOptions = students.map(s => ({
    value: s.regNo,
    label: `${s.regNo} - ${s.name}`
  }));

  const handleRegNoChange = (selectedOption) => {
    setForm(prev => ({
      ...prev,
      regNo: selectedOption ? selectedOption.value : ""
    }));
  };

  const handleAddPurpose = () => {
    if (!newPurpose.trim()) return toast.error("Enter purpose name");
    if (purposes.includes(newPurpose.trim())) return toast.error("Purpose already exists");

    setPurposes(prev => [...prev, newPurpose.trim()]);
    setForm(prev => ({ ...prev, purpose: newPurpose.trim() }));
    setNewPurpose("");
    setShowPurposeModal(false);
    toast.success("Purpose added successfully");
  };

  const handleGenerate = () => {
    if (!form.regNo) return toast.error("Select Register Number");

    const data = {
      ...form,
      date: new Date().toLocaleDateString("en-IN"),
      refNo: `BONAFIDE/${form.regNo}/${new Date().getFullYear()}`,
    };

    setPreviewData(data);
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const handlePrint = () => {
    const previewEl = document.getElementById("bonafide-preview") || previewRef.current;
    if (!previewEl) return toast.error("Nothing to print");

    // find local component <style> that contains our preview rules (if any)
    const allStyles = Array.from(document.querySelectorAll('style'));
    const componentStyle = allStyles.find(s => s.innerText && s.innerText.includes('#bonafide-preview'));
    const extraStyle = componentStyle ? componentStyle.innerText : '';

    // Basic print/reset styles + component styles
    const headStyle = `
      @page { size: A4 portrait; margin: 12mm; }
      html, body { margin: 0; padding: 0; }
      body { font-family: "Times New Roman", serif; background: #fff; }
      #bonafide-preview { width: 210mm; height: 297mm; box-sizing: border-box; margin: 0 auto; }
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
          <title>Bonafide Certificate</title>
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

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body">

            <h4 className="fw-semibold mb-3">Bonafide Certificate</h4>

            {/* FORM */}
            <div className="card p-3 mb-4">
              <div className="row g-3">

                <div className="col-md-2">
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

                <div className="col-md-2">
                  <label className="form-label">Student Name</label>
                  <input type="text" className="form-control" value={form.studentName} readOnly />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Academic Year</label>
                  <select name="academicYear" value={form.academicYear} className="form-select" onChange={handleChange}>
                    {academicYears.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>



                <div className="col-md-2">
                  <label className="form-label">Purpose</label>
                  <div className="d-flex gap-2">
                    <select name="purpose" value={form.purpose} className="form-select" onChange={handleChange}>
                      <option value="">Select</option>
                      {purposes.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setShowPurposeModal(true)}
                      title="Add new purpose"
                      style={{ minWidth: '38px' }}
                    >
                      <Icon icon="mdi:plus" />
                    </button>
                  </div>
                </div>


                <div className="col-md-4 d-flex align-items-end justify-content-end gap-2">
                  <button className="btn btn-outline-primary px-20 py-11" onClick={handleGenerate}>
                    Generate
                  </button>
                  <button className="btn btn-outline-secondary px-20 py-11" onClick={() => setPreviewData(null)}>
                    Clear
                  </button>
                </div>

              </div>
            </div>

            {/* PREVIEW */}
            <div ref={previewRef}>
              {previewData ? (
                <>
                  <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-outline-success" onClick={handlePrint}>
                      <Icon icon="material-symbols:print" /> Print
                    </button>
                  </div>
                  <div id="bonafide-preview" style={{ background: "#fff" }}>
                    <div

                    >
                      <div className="page-inner"
                        style={{
                          border: "2px solid #222", // Black inner
                          minHeight: "auto",
                          boxSizing: "border-box",
                          background: "#fff",
                          position: "relative",
                        }}
                      >
                        {/* Header */}
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
                        {/* Student photo moved inline to Ref row (right side) */}
                        {/* Ref No and Date */}
                        <div className="ref-row" style={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-start', margin: "50px 12mm 0 12mm" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Ref No: {previewData.refNo}
                            <div style={{ fontSize: 13, fontWeight: 600 }}>Date : {previewData.date}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {previewData?.photo && (
                              <img
                                src={previewData.photo}
                                alt="student"
                                className="ref-image"
                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Page body and footer wrappers to push footer to bottom */}
                        <div className="page-body">
                          {/* Title */}
                          <div className="report-title" style={{ textAlign: "center", fontSize: 20, fontWeight: 800, textDecoration: "underline", margin: "28px 0 18px 0" }}>
                            BONAFIDE CERTIFICATE
                          </div>

                          {/* Certificate Paragraph */}
                          <div style={{ margin: "0 12mm 8mm 12mm", fontSize: 16, lineHeight: 1.7, textAlign: "justify", textIndent: "40px" }}>
                            This is to certify that <b>{previewData.studentName || "__________"}</b>, S/o/D/o <b>{previewData.fatherName || "__________"}</b>, Date of Birth: <b>{previewData.dob || "__________"}</b>, residing at <b>{previewData.address || "__________"}</b>, is a bonafide student of our college, studying <b>{previewData.sem ? `Year ${previewData.sem} ` : ''}{previewData.branch || previewData.course || "__________"}</b> ({previewData.admissionYear || "2020-2020"}). {previewData.studentName ? `${previewData.studentName} was admitted in course under the ${previewData.quota || '__________'} quota in the academic year (${previewData.admissionYear || ''}).` : ''}
                          </div>
                          <div style={{ margin: "0 12mm 8mm 12mm", fontSize: 16, lineHeight: 1.7, textAlign: "justify", textIndent: "40px" }}>
                            This Certificate is issued based on Student Request for the purpose of <b>{previewData.purpose || '__________'}</b>.
                          </div>
                          {previewData.bNo && (
                            <div style={{ margin: "0 12mm 8mm 12mm", fontSize: 16 }}><b>B. No:</b> {previewData.bNo}</div>
                          )}
                        </div>

                        {/* Signature at bottom */}
                        <div className="page-footer">
                          <div style={{ marginTop: 0, textAlign: "right", fontWeight: 700, marginRight: '12mm' }}>
                            PRINCIPAL<br />
                            {/* <span style={{ fontWeight: 400, fontSize: 12 }}>DR. KALAM POLYTECHNIC COLLEGE</span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card p-5 text-center text-muted">Generate certificate to view preview</div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </section>

      {/* Add Purpose Modal */}
      {showPurposeModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPurposeModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Purpose</h5>
                <button type="button" className="btn-close" onClick={() => setShowPurposeModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Purpose Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPurpose()}
                  placeholder="Enter purpose name"
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPurposeModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAddPurpose}>Add Purpose</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Screen preview as centered portrait A4 */
        #bonafide-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          padding: 18px 0;
          font-family: "Times New Roman", serif;
        }

        /* The page box (visual A4) */
        #bonafide-preview .page-inner {
          width: 100%;
          max-width: 210mm;
          height: 297mm;
          box-sizing: border-box;
          background: #fff;
          margin: 0 auto;
          padding: 12mm;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
          position: relative;
        }

        /* ref-row image (right of Ref No) */
        .ref-image { width: 32mm; height: 40mm; object-fit: cover; border: 1px solid #ddd; padding: 2px; background: #fff; display: block; }

        /* Make page-inner a column so footer can be pushed to bottom */
        #bonafide-preview .page-inner { display: flex; flex-direction: column; }
        #bonafide-preview .page-body { flex: 1 1 auto; padding-top: 6mm; }
        #bonafide-preview .page-footer { flex: 0 0 auto; margin-top: 12mm; }

        @media print {
          html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          #bonafide-preview, #bonafide-preview * { visibility: visible !important; }

          /* Print the A4 page exactly */
          #bonafide-preview { background: transparent; padding: 0; }
          #bonafide-preview .page-inner {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto !important;
            padding: 12mm !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
          }
          #bonafide-preview .page-body { flex: 1 1 auto !important; }
          #bonafide-preview .page-footer { flex: 0 0 auto !important; margin-top: 18mm !important; }

          /* photo box on print (use mm for consistency) */
          .student-photo { top: 40mm; right: 18mm; width: 28mm; height: 36mm; }

          nav, .breadcrumb, button, .btn, footer, .card:first-child { display: none !important; }
          @page { size: A4 portrait; margin: 8mm; }
        }
      `}</style>
    </>
  );
};

export default Bonafide;
