import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Sidebar from "../../../../components/Sidebar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/footer";
import { toast, ToastContainer } from 'react-toastify';

/* ============================
   FETCH FROM BACKEND
============================ */
const fetchTimetable = async () => {
  const res = await fetch("/api/timetable");
  if (!res.ok) throw new Error("Failed to fetch timetable");
  const json = await res.json();
  return json.data || [];
};

/* ============================
   GROUP BY exam_date + session
============================ */
const groupTimetable = (data) => {
  const grouped = {};
  data.forEach((row) => {
    const key = `${row.exam_date || ""}|${row.session || ""}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  });
  return grouped;
};

/* ============================
   A4 PREVIEW (DESIGN UNCHANGED)
============================ */
const TimetableA4Preview = React.forwardRef(({ data }, ref) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: "center", padding: 40 }}>No timetable data found.</div>;
  }

  const grouped = groupTimetable(data);
  let sno = 1;

  const LOGO_SRC = "/assets/images/Kalam.jpeg";
  const WATERMARK_SRC = "/assets/images/Kalam.jpeg";

  const getVal = (row, ...keys) => {
    for (const k of keys) {
      const v = row[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
    return null;
  };

  return (
    <div className="timetable-a4-container" ref={ref} style={{ width: "100%", minHeight: "297mm", background: "#fff" }}>
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          body * { visibility: hidden !important; }
          .timetable-a4-container, .timetable-a4-container * { visibility: visible !important; }
          .timetable-a4-container {
            position: fixed; inset: 0;
            width: 210mm; height: 297mm;
            padding: 10mm; background: #fff;
          }
        }
        .timetable-a4-container { font-family: 'Times New Roman', serif; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #222; padding: 6px; text-align: center; }
        th { background: #e0e0e0; font-weight: bold; }
      `}</style>

      <div style={{ border: "4px solid #DAA520", padding: 8 }}>
        <div style={{ border: "3px solid #000", padding: "8mm", position: "relative" }}>

          {/* Watermark */}
          <img
            src={WATERMARK_SRC}
            alt="watermark"
            style={{
              position: "absolute",
              inset: "0",
              margin: "auto",
              width: "40%",
              opacity: 0.08,
              pointerEvents: "none"
            }}
          />

          {/* Header */}
          <div style={{ display: "flex", borderBottom: "2px solid #000", paddingBottom: 8 }}>
            <img src={LOGO_SRC} alt="logo" style={{ width: 100, height: 100 }} />
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>DR. KALAM POLYTECHNIC COLLEGE</div>
              <div style={{ fontSize: 12 }}>Avanam, Peravurani - 614623</div>
              <div style={{ fontSize: 11 }}>info@drkalaminstitutions.com | +91 6384044100</div>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "12px 0", fontWeight: 800, textDecoration: "underline" }}>
            TIME TABLE REPORT
          </div>

          {/* Content */}
          {Object.entries(grouped).map(([key, rows]) => {
            const [examDate, session] = key.split("|");
            return (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  Exam Date : {examDate ? new Date(examDate).toLocaleDateString("en-GB") : ""} |
                  Session : {session}
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>EQC No</th>
                      <th>Department</th>
                      <th>Regulation</th>
                      <th>Semester</th>
                      <th>Col No</th>
                      <th>Subject Code</th>
                      <th>Subject Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td>{sno++}</td>
                        <td>{getVal(r, 'eqc', 'eqc_no', 'eqcNo', 'EQC', 'EQC_No') || "-"}</td>
                        <td>{getVal(r, 'department', 'dept_name', 'dept', 'department_name') || "-"}</td>
                        <td>{getVal(r, 'regulation', 'Regulation', 'reg') || "-"}</td>
                        <td>{getVal(r, 'sem', 'semester', 'Semester', 'Sem') || "-"}</td>
                        <td>{getVal(r, 'col_no', 'c_no', 'Col_No', 'ColNo', 'cNo', 'colNo') || "-"}</td>
                        <td>{getVal(r, 'subject_code', 'sub_code', 'Subject_Code', 'SubjectCode', 'subcode') || "-"}</td>
                        <td style={{ textAlign: "left" }}>{getVal(r, 'subject_name', 'sub_name', 'Sub_Name', 'subname') || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Footer */}
          <div style={{ display: "flex", marginTop: 24, fontSize: 11 }}>
            <div style={{ flex: 1 }}>Prepared By</div>
            <div style={{ flex: 1, textAlign: "center" }}>Seal & Date</div>
            <div style={{ flex: 1, textAlign: "right" }}>Principal</div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ============================
   MAIN REPORT PAGE
============================ */
const Report = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("All");
  const [eqc, setEqc] = useState("All");

  const reportRef = useRef(null);

  useEffect(() => {
    fetchTimetable()
      .then(setData)
      .catch(() => toast.error("Failed to load timetable"))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => ["All", ...new Set(data.map(d => d.department).filter(Boolean))],
    [data]
  );

  const eqcs = useMemo(
    () => ["All", ...new Set(data.filter(d => department === "All" || d.department === department).map(d => d.eqc))],
    [data, department]
  );

  const filteredData = useMemo(
    () => data.filter(d =>
      (department === "All" || d.department === department) &&
      (eqc === "All" || String(d.eqc) === String(eqc))
    ),
    [data, department, eqc]
  );

  const handlePrint = useCallback(() => window.print(), []);

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

          <h6 className="fw-semibold mb-3">Timetable Report</h6>

          <div className="card p-3 mb-3 d-flex align-items-center">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label className="form-label mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Department</label>
                <select className="form-select form-select-sm" value={department} onChange={e => setDepartment(e.target.value)} style={{ minWidth: 180 }}>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label className="form-label mb-1" style={{ fontSize: 12, fontWeight: 600 }}>EQC No</label>
                <select className="form-select form-select-sm" value={eqc} onChange={e => setEqc(e.target.value)} style={{ minWidth: 180 }}>
                  {eqcs.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>

            <button className="btn btn-outline-primary btn-sm ms-auto" onClick={handlePrint} disabled={!filteredData.length}>
              PRINT
            </button>
          </div>

          {!loading && <TimetableA4Preview ref={reportRef} data={filteredData} />}
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default Report;
