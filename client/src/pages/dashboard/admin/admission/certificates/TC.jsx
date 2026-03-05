// TC.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";
import Select from "react-select";

// Paths for logo and watermark
const WATERMARK_SRC = "/public/assets/images/GRT.png";

// Departments dummy data
const DEPARTMENTS = [
  { code: "4000", name: "B.Pharm" },
  { code: "1000", name: "D.Pharm" },
  { code: "2000", name: "B.E" },
  { code: "3000", name: "M.E" },
];

const INITIAL_CERTIFICATE = {
  studentName: "",
  gender: "",
  dob: "",
  dobWords: "",
  parentName: "",
  nationality: "",
  community: "",
  course: "",
  admissionDate: "",
  yearSem: "",
  promoted: "",
  reasonLeaving: "",
  dateLeft: "",
  dateApplied: "",
  dateIssued: "",
  medium: "",
  conduct: "",
  identification: "",
};

// Helper to convert date to English words
const convertDateToWords = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const dayNames = [
    "", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
    "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth",
    "Twenty First", "Twenty Second", "Twenty Third", "Twenty Fourth", "Twenty Fifth", "Twenty Sixth", "Twenty Seventh", "Twenty Eighth", "Twenty Ninth", "Thirtieth", "Thirty First"
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const numberWords = {
    0: "Zero", 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine",
    10: "Ten", 11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen", 16: "Sixteen", 17: "Seventeen", 18: "Eighteen", 19: "Nineteen",
    20: "Twenty", 30: "Thirty", 40: "Forty", 50: "Fifty", 60: "Sixty", 70: "Seventy", 80: "Eighty", 90: "Ninety"
  };

  const convertYearToWords = (year) => {
    if (year < 1000 || year > 9999) return year.toString();
    const thousands = Math.floor(year / 1000);
    const remainder = year % 1000;
    const hundreds = Math.floor(remainder / 100);
    const lastTwo = remainder % 100;

    let result = numberWords[thousands] + " Thousand";
    if (hundreds > 0) result += " " + numberWords[hundreds] + " Hundred";
    if (lastTwo > 0) {
      if (lastTwo <= 20) {
        result += " " + numberWords[lastTwo];
      } else {
        const tens = Math.floor(lastTwo / 10) * 10;
        const units = lastTwo % 10;
        result += " " + numberWords[tens] + (units > 0 ? " " + numberWords[units] : "");
      }
    }
    return result;
  };

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayNames[day]} ${month} ${convertYearToWords(year)}`;
};

const INITIAL_FORM_STATE = {
  department: DEPARTMENTS[0].code,
  regNo: "",
};

const TC = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [studentList, setStudentList] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [certificate, setCertificate] = useState(INITIAL_CERTIFICATE);
  const formRef = useRef(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/studentMaster");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        if (Array.isArray(data)) {
          const confirmedStudents = data.filter((s) => {
            const status = (s.Admission_Status || s.admission_status || s.status || "")
              .toString()
              .toLowerCase();
            const regNo = String(s.Register_Number || "").trim();
            return (
              (status === "confirmed" ||
                status === "admitted" ||
                status === "admission confirmed" ||
                status === "yes") &&
              regNo.length > 0
            );
          });
          const students = confirmedStudents.map((s) => ({
            regNo: String(s.Register_Number).trim(),
            name: s.Student_Name || "",
            department: s.Course_Name || s.course || s.Department || "",
          }));
          setStudentList(students);
        } else if (data?.data && Array.isArray(data.data)) {
          const confirmedStudents = data.data.filter((s) => {
            const status = (s.Admission_Status || s.admission_status || s.status || "")
              .toString()
              .toLowerCase();
            const regNo = String(s.Register_Number || "").trim();
            return (
              (status === "confirmed" ||
                status === "admitted" ||
                status === "admission confirmed" ||
                status === "yes") &&
              regNo.length > 0
            );
          });
          const students = confirmedStudents.map((s) => ({
            regNo: String(s.Register_Number).trim(),
            name: s.Student_Name || "",
            department: s.Course_Name || s.course || s.Department || "",
          }));
          setStudentList(students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const student = studentList.find((s) => s.regNo === form.regNo);
    if (student) {
      setCertificate((c) => ({ ...c, studentName: student.name.toUpperCase() }));
      setForm((prev) => ({ ...prev, department: student.department }));
    } else if (!form.regNo) {
      setCertificate((c) => ({ ...c, studentName: "" }));
      setForm((prev) => ({ ...prev, department: "" }));
    }
  }, [form.regNo, studentList]);

  // Generate options for react-select
  const studentOptions = studentList.map(s => ({
    value: s.regNo,
    label: `${s.regNo} - ${s.name}`
  }));

  /* New: Fetch existing TC data for selected student */
  useEffect(() => {
    if (!form.regNo) return;

    const fetchStudentTC = async () => {
      try {
        const response = await fetch(`/api/tc/by-regno?regNo=${encodeURIComponent(form.regNo)}`);
        if (response.ok) {
          const data = await response.json();
          // Update certificate state with data from student_master
          setCertificate(prev => ({
            ...prev,
            studentName: (data.name || prev.studentName).toUpperCase(),
            gender: (data.sex || prev.gender).toUpperCase(),
            tc_no: data.tc_no || "",
            dob: data.dob ? new Date(data.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : prev.dob,
            dobWords: data.dob ? convertDateToWords(data.dob) : prev.dobWords,
            parentName: (data.father_name || data.guardian_name || prev.parentName).toUpperCase(),
            nationality: `${data.nationality || 'INDIAN'}, ${data.religion || 'HINDU'}`.toUpperCase(),
            community: `${data.community || ''} - ${data.caste || ''}`.toUpperCase(),
            course: (data.course || prev.course).toUpperCase(),
            admissionDate: data.date_of_admission ? new Date(data.date_of_admission).toLocaleDateString('en-GB') : prev.admissionDate,
            yearSem: `${data.year || ''} YEAR - ${data.sem || ''} SEMESTER`.toUpperCase(),
            promoted: data.completed || prev.promoted,
            reasonLeaving: data.reason_leaving || prev.reasonLeaving,
            dateLeft: data.leaving_date ? new Date(data.leaving_date).toLocaleDateString('en-GB').replace(/\//g, '-') : prev.dateLeft,
            dateApplied: data.date_of_transfer ? new Date(data.date_of_transfer).toLocaleDateString('en-GB').replace(/\//g, '-') : prev.dateApplied,
            dateIssued: data.issue_date_tc ? new Date(data.issue_date_tc).toLocaleDateString('en-GB').replace(/\//g, '-') : prev.dateIssued,
            medium: (data.medium_of_instruction || prev.medium).toUpperCase(),
            conduct: (data.conduct || prev.conduct).toUpperCase(),
            identification: (data.identification || prev.identification).toUpperCase(),
          }));
        }
      } catch (error) {
        console.error("Error fetching student TC data:", error);
      }
    };
    fetchStudentTC();
  }, [form.regNo]);

  const handleSelectChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      regNo: selectedOption ? selectedOption.value : ""
    }));
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCertChange = useCallback((e) => {
    const { name, value } = e.target;
    setCertificate((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        reg_no: form.regNo,
        tc_no: certificate.tc_no, // assuming it's available or editable
        tc_create_date: certificate.dateApplied || certificate.dateOfTransfer || new Date().toISOString().split('T')[0],
        tc_issue_date: certificate.dateIssued || new Date().toISOString().split('T')[0],
        conduct_character: certificate.conduct,
        reason_leaving: certificate.reasonLeaving,
        leaving_date: certificate.dateLeft,
        whether_completed: certificate.promoted,
      };

      const res = await fetch(`/api/tc/update/${form.regNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save TC');
      }

      alert("TC details saved successfully to student_master");
    } catch (error) {
      console.error("Error saving TC:", error);
      alert(error.message);
    }
  };

  const handleIssue = useCallback((e) => {
    e.preventDefault();
    setShowCertificate(true);
    // ensure certificate is visible before printing if user prints immediately
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }, []);

  const handleClose = useCallback(() => {
    setShowCertificate(false);
    setEditMode(false);
    setCertificate(INITIAL_CERTIFICATE);
    setForm(INITIAL_FORM_STATE);
  }, []);

  const handleEditToggle = useCallback(() => {
    if (editMode) {
      handleSave();
    }
    setEditMode((e) => !e);
  }, [editMode, handleSave]);

  // Final print handler: forces top alignment and single A4 page
  const handlePrint = useCallback(() => {
    const printStyle = document.createElement("style");
    printStyle.id = "tc-a4-print";
    printStyle.textContent = `
      /* Remove default margins and enforce A4 exactly at top-left */
      @page { size: A4 portrait; margin: 0; }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 100%;
        }

        /* hide everything first */
        body * { visibility: hidden !important; }

        /* show only certificate container and its children */
        .tc-container, .tc-container * { visibility: visible !important; }

        /* position certificate at exact page origin */
        .tc-container {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        /* make sure outer border and inner border visible & inside the page */
        .tc-certificate-border { border: 3px solid #000000 !important; box-sizing: border-box !important; }
        .tc-certificate-inner { border: 2px solid #222 !important; padding: 5mm !important; box-sizing: border-box !important; height: calc(297mm - 20mm)   }

        /* hide UI */
        .navbar, .footer, .sidebar, .card { display: none !important; }
      }
    `;
    document.head.appendChild(printStyle);

    // wait for images within the certificate to load (short timeout) then print
    const waitForImagesInContainer = (selector = ".tc-container", timeout = 1200) => {
      return new Promise((resolve) => {
        const container = document.querySelector(selector);
        if (!container) return resolve();
        const imgs = Array.from(container.querySelectorAll("img"));
        if (imgs.length === 0) return resolve();
        let settled = 0;
        const done = () => { settled++; if (settled === imgs.length) resolve(); };
        const timer = setTimeout(resolve, timeout);
        imgs.forEach((img) => {
          if (img.complete) done();
          else {
            img.addEventListener("load", function onLoad() { img.removeEventListener("load", onLoad); done(); });
            img.addEventListener("error", function onErr() { img.removeEventListener("error", onErr); done(); });
          }
        });
      });
    };

    setTimeout(async () => {
      try { await waitForImagesInContainer(".tc-container", 1200); } catch (e) { /* ignore */ }
      window.print();
      setTimeout(() => {
        const el = document.getElementById("tc-a4-print");
        if (el) el.remove();
      }, 1000);
    }, 120);
  }, []);

  const fields = [
    { label: "Name of the Student (In Block Letters)", key: "studentName" },
    { label: "Gender", key: "gender" },
    { label: "Date of Birth as per School Record (In Figures) & (Words)", key: "dob" },
    { label: "Name of the Parent / Guardian", key: "parentName" },
    { label: "Nationality & Religion", key: "nationality" },
    { label: "Personal Marks of Identification", key: "identification" },
    { label: "Community and Sub Caste", key: "community" },
    { label: "Course of Study & Duration", key: "course" },
    { label: "Date of Admission to this course", key: "admissionDate" },
    { label: "Year & Semester studied, when applying for Transfer Certificate", key: "yearSem" },
    { label: "Whether the students has completed the course", key: "promoted" },
    { label: "Reason for leaving the college", key: "reasonLeaving" },
    { label: "Date on which the student left the institution", key: "dateLeft" },
    { label: "Date on which Application for Transfer Certificate was made by the student on his/her behalf by the Parent/Guardian.", key: "dateApplied" },
    { label: "Date of Transfer certificate issued", key: "dateIssued" },
    { label: "Medium of Study", key: "medium" },
    { label: "Conduct and Character of the Student", key: "conduct" },
  ];

  // certificate JSX - sized & spaced to fit a single A4 page
  const certificateJSX = (
    <div
      className="tc-container"

    >
      <div

      >
        <div
          className="tc-certificate-inner"
          style={{
            border: "2px solid #222",
            margin: "5mm",
            padding: "10mm",
            minHeight: "287mm", // Fits A4 with margins
            boxSizing: "border-box",
            position: "relative",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          ref={formRef}
        >
          {/* Watermark */}
          <img
            src={WATERMARK_SRC}
            alt="Watermark"
            style={{
              position: "absolute",
              left: "50%",
              top: "48%",
              transform: "translate(-50%, -50%)",
              width: "45%",
              height: "45%",
              opacity: 0.10,
              zIndex: 0,
              pointerEvents: "none",
              userSelect: "none",
            }}
            draggable={false}
          />

          {/* Header area */}
          <div style={{ zIndex: 2 }}>
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

            {/* Title */}
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <div style={{ display: "inline-block", fontWeight: 800, fontSize: 15, textDecoration: "underline", padding: "6px 14px" }}>
                TRANSFER CUM CONDUCT CERTIFICATE
              </div>
            </div>

            {/* TC / Reg row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: 700, fontSize: 12 }}>
              <div>T.C. No: <span style={{ fontWeight: 900 }}>{certificate.tc_no || "-"}</span></div>
              <div>Reg No: <span style={{ fontWeight: 900 }}>{form.regNo || "-"}</span></div>
            </div>
          </div>

          {/* Main content area */}
          <div style={{ marginTop: 12, zIndex: 2, overflow: "hidden", flex: "1 1 auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {fields.map((f) => {
                  if (f.key === "dob") {
                    return (
                      <tr key={f.key} style={{ verticalAlign: "top" }}>
                        <td style={{ width: "45%", padding: "6px 8px", fontWeight: 600 }}>{f.label}</td>
                        <td style={{ width: "3%", padding: "6px 0", textAlign: "center", fontWeight: 600 }}>:</td>
                        <td style={{ width: "52%", padding: "6px 8px", fontWeight: 800, color: "#b30000" }}>
                          {editMode ? (
                            <>
                              <input
                                name="dob"
                                value={certificate.dob}
                                onChange={handleCertChange}
                                style={{ width: "100%", fontWeight: 800, fontSize: 13, border: "none", borderBottom: "1px solid #b30000", background: "#fff" }}
                              />
                              <br />
                              <input
                                name="dobWords"
                                value={certificate.dobWords}
                                onChange={handleCertChange}
                                style={{ width: "100%", fontWeight: 700, fontSize: 12, border: "none", borderBottom: "1px solid #b30000", marginTop: 4 }}
                              />
                            </>
                          ) : (
                            <>
                              {certificate.dob} &nbsp;
                              <span style={{ fontSize: 11, fontWeight: 700, fontStyle: 'italic' }}>
                                ({certificate.dobWords})
                              </span>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={f.key} style={{ verticalAlign: "top" }}>
                      <td style={{ width: "45%", padding: "6px 8px", fontWeight: 600 }}>{f.label}</td>
                      <td style={{ width: "3%", padding: "6px 0", textAlign: "center", fontWeight: 600 }}>:</td>
                      <td style={{ width: "52%", padding: "6px 8px", fontWeight: 800, color: "#b30000" }}>
                        {editMode ? (
                          <input
                            name={f.key}
                            value={certificate[f.key] || ""}
                            onChange={handleCertChange}
                            style={{ width: "100%", fontWeight: 800, fontSize: 13, border: "none", borderBottom: "1px solid #b30000", background: "#fff" }}
                          />
                        ) : (
                          certificate[f.key] || "-"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signature block - bottom with reserved vertical space */}
          <div style={{ marginTop: 10, zIndex: 2, flex: "0 0 auto" }}>
            <div style={{ paddingTop: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "33.33%", textAlign: "center", verticalAlign: "top", padding: "0 8px" }}>
                      {/* <div style={{ borderTop: "2px solid #222", width: "85%", margin: "0 auto" }} /> */}
                      <div style={{ height: 48 }} />
                      <div style={{ fontWeight: 700 }}>Signature of the Student</div>
                    </td>
                    <td style={{ width: "33.33%", textAlign: "center", verticalAlign: "top", padding: "0 8px" }}>
                      {/* <div style={{ borderTop: "2px solid #222", width: "85%", margin: "0 auto" }} /> */}
                      <div style={{ height: 48 }} />
                      <div style={{ fontWeight: 700 }}>Date and Institution Seal</div>
                    </td>
                    <td style={{ width: "33.33%", textAlign: "center", verticalAlign: "top", padding: "0 8px" }}>
                      {/* <div style={{ borderTop: "2px solid #222", width: "85%", margin: "0 auto" }} /> */}
                      <div style={{ height: 48 }} />
                      <div style={{ fontWeight: 700 }}>Signature of the Principal</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          <h4 className="fw-semibold mb-3">TC Certificate</h4>

          <div className="card p-3 mb-4">
            <form className="row g-3" onSubmit={handleIssue}>
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">
                  Reg No <span className="text-danger">*</span>
                </label>
                <Select
                  options={studentOptions}
                  value={studentOptions.find(opt => opt.value === form.regNo) || null}
                  onChange={handleSelectChange}
                  placeholder="Select Reg No"
                  isClearable
                  required
                  classNamePrefix="react-select"
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="studentName"
                  value={certificate.studentName || ""}
                  readOnly
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={form.department || ""}
                  readOnly
                />
              </div>

              <div className="col-12 col-md-3 d-flex justify-content-end align-items-end gap-2">
                <button
                  type="submit"
                  className="btn btn-outline-primary px-20 py-11"
                >
                  ISSUE
                </button>
              </div>
            </form>
          </div>

          {showCertificate && (
            <div style={{ position: "relative" }}>
              <div style={{ marginBottom: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="btn btn-outline-primary px-20 py-11"
                >
                  {editMode ? "SAVE" : "EDIT TC"}
                </button>
                <button className="btn btn-outline-success" onClick={handlePrint}>
                  <Icon icon="material-symbols:print" /> Print
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline-secondary px-20 py-11"
                >
                  CLOSE
                </button>
              </div>

              {certificateJSX}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default TC;
