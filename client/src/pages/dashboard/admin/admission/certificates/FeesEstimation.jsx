// FeesEstimation.jsx (Expenditure Certificate Print - Official Format)
import React, { useState, useEffect, useRef } from "react";
import { toast as toastify, ToastContainer } from "react-toastify";
import Sidebar from "../../../../../components/Sidebar.jsx";
import Navbar from "../../../../../components/Navbar.jsx";
import Footer from "../../../../../components/footer";
import { Toaster } from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import DataTable from "../../../../../components/DataTable/DataTable";
import Select from "react-select";

const startYear = 2020;
const endYear = 2030;

const YEAR_RANGES = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
  const start = startYear + i;
  return `${start}-${start + 1}`;
}).reverse();

const BRANCHES_DEFAULT = ["1010", "1020", "1030"];
const SEMS_DEFAULT = [1, 2, 3, 4, 5, 6];
const REGNOS_DEFAULT = ["858101003", "858101004", "858101005"];

const INITIAL_FORM = {
  yearRange: "2025-2026",
  regNo: "",
  branch: "",
  sem: "",
  withoutHeader: false,
  studentName: "",
};

const INITIAL_TABLE = [
  { sno: 1, particular: "Tuition Fee", I_Year: 43000, II_year: 43000, III_Year: 43000, IV_Year: 43000 },
  { sno: 2, particular: "Application Fee", I_Year: 1000, II_year: 0, III_Year: 0, IV_Year: 0 },
  { sno: 3, particular: "Registration and S...", I_Year: 28500, II_year: 28500, III_Year: 28500, IV_Year: 28500 },
  { sno: 4, particular: "Other Fee", I_Year: 15000, II_year: 15000, III_Year: 15000, IV_Year: 15000 },
  { sno: 5, particular: "Administrative Ex...", I_Year: 28500, II_year: 28500, III_Year: 28500, IV_Year: 28500 },
  { sno: 6, particular: "Examination/Proj...", I_Year: 10000, II_year: 10000, III_Year: 10000, IV_Year: 10000 },
  { sno: 7, particular: "Books", I_Year: 0, II_year: 0, III_Year: 0, IV_Year: 0 },
  { sno: 8, particular: "Hostel/Mess and ...", I_Year: 0, II_year: 0, III_Year: 0, IV_Year: 0 },
  { sno: 9, particular: "Transport Fee", I_Year: 0, II_year: 30000, III_Year: 0, IV_Year: 0 },
  { sno: 10, particular: "Other Fee1", I_Year: 2000, II_year: 2000, III_Year: 2000, IV_Year: 200 },
];

export default function FeesEstimation() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showReport, setShowReport] = useState(false);
  const [table, setTable] = useState(INITIAL_TABLE);
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [students, setStudents] = useState([]);
  const [regnos, setRegnos] = useState(REGNOS_DEFAULT);
  const [branches, setBranches] = useState(BRANCHES_DEFAULT);
  const [sems, setSems] = useState(SEMS_DEFAULT);
  const [previewData, setPreviewData] = useState(null);
  const [showExpenditure, setShowExpenditure] = useState(false);
  const [expenditureData, setExpenditureData] = useState(null);

  const printableRef = useRef(null);

  // Calculate totals for each year column
  const totalRow =
    table.length > 0
      ? {
        sno: "",
        particular: "Total",
        I_Year: table.reduce((sum, row) => sum + Number(row.I_Year || 0), 0),
        II_year: table.reduce((sum, row) => sum + Number(row.II_year || 0), 0),
        III_Year: table.reduce((sum, row) => sum + Number(row.III_Year || 0), 0),
        IV_Year: table.reduce((sum, row) => sum + Number(row.IV_Year || 0), 0),
      }
      : null;

  // Fetch student_master and dbSemester data on mount
  useEffect(() => {
    fetch("/api/studentMaster")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
          setRegnos(
            Array.from(
              new Set(
                data.map((s) => s.Register_Number || s.reg_no || s.RegNo || s.RollNo || "")
              )
            ).filter(Boolean)
          );
          setBranches(
            Array.from(
              new Set(
                data.map((s) => s.Dept_Code || s.branch || s.Branch || s.DepCode || "")
              )
            ).filter(Boolean)
          );
        }
      })
      .catch(() => { });

    fetch("/api/dbSemester/list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const semList = Array.from(
            new Set(
              data.map(
                (s) =>
                  s.semester ||
                  s.Semester ||
                  s.sem ||
                  s.Sem ||
                  s.Sem_No ||
                  s.name ||
                  s.value ||
                  ""
              )
            )
          ).filter(Boolean);
          setSems(semList);
        }
      })
      .catch(() => { });
  }, []);

  // Auto-fill Student Name, Branch, Sem, Year, and filter year columns when Roll No changes
  useEffect(() => {
    if (!form.regNo || students.length === 0) return;
    const s = students.find(
      (st) =>
        (st.Register_Number || st.reg_no || st.RegNo || st.RollNo) === form.regNo
    );
    if (s) {
      const admissionYear =
        s.Year_of_Admission || s.year_of_admission || s.admission_year || "";
      const academicYear = admissionYear
        ? `${admissionYear}-${parseInt(admissionYear) + 1}`
        : form.yearRange;

      // Determine current year (1, 2, 3, 4) based on semester or year fields
      let currentYear = 4;
      const semVal = Number(s.Semester || s.sem || s.Sem || s.Sem_No || s.current_semester || form.sem || 0);
      if (semVal > 0) {
        if (semVal <= 2) currentYear = 1;
        else if (semVal <= 4) currentYear = 2;
        else if (semVal <= 6) currentYear = 3;
        else currentYear = 4;
      }
      // If there is a direct year field, prefer that
      if (s.Year || s.year || s.Study_Year || s.study_year) {
        const y = Number(s.Year || s.year || s.Study_Year || s.study_year);
        if (y >= 1 && y <= 4) currentYear = y;
      }

      setForm((prev) => ({
        ...prev,
        branch: s.Dept_Code || s.branch || s.Branch || s.DepCode || prev.branch,
        sem:
          s.Semester || s.sem || s.Sem || s.Sem_No || s.current_semester || prev.sem,
        studentName: s.Student_Name || s.name || s.student_name || "",
        parentName: s.Father_Name || s.parent_name || s.Parent_Name || "",
        address:
          s.Address ||
          s.Address1 ||
          s.Address_Line ||
          s.Addr ||
          s.AddressDetails ||
          "-",
        quota: s.Quota || s.quota || "-",
        yearRange: academicYear,
        currentYear: currentYear,
      }));
    }
  }, [form.regNo, students]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Generate options for react-select
  const regNoOptions = students.map(s => ({
    value: s.Register_Number || s.reg_no || s.RegNo || s.RollNo,
    label: `${s.Register_Number || s.reg_no || s.RegNo || s.RollNo} - ${s.Student_Name || s.name || s.student_name || ""}`
  })).filter(opt => opt.value);

  const handleRegNoChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      regNo: selectedOption ? selectedOption.value : ""
    }));
  };

  // DataTable edit/delete actions
  const handleEdit = (row, idx) => {
    setEditIdx(idx);
    setEditRow({ ...row });
    toastify.info(`Editing row ${idx + 1}`, { autoClose: 2000 });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({
      ...prev,
      [name]: name === "sno" ? Number(value) : value,
    }));
  };

  const handleEditSave = () => {
    setTable((prev) =>
      prev.map((row, idx) => {
        if (idx !== editIdx) return row;
        return {
          ...row,
          [editRow.accessorKey]: editRow[editRow.accessorKey],
        };
      })
    );
    setEditIdx(null);
    setEditRow(null);
    toastify.success("Row updated");
  };

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditRow(null);
  };

  const handleDelete = (row, idx) => {
    toastify.dismiss();
    const toastId = toastify(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete this row?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={() => {
                setTable((prev) => prev.filter((_, i) => i !== idx));
                toastify.success('Row deleted successfully');
                toastify.dismiss(toastId);
              }}
            >
              Delete
            </button>
            <button
              style={{ background: '#757575', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={() => toastify.dismiss(toastId)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // DataTable columns - show only up to the student's current year
  const getYearColumns = () => {
    const yearCols = [
      {
        accessorKey: "sno",
        header: "S.No",
        cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
      },
      {
        accessorKey: "particular",
        header: "Particular",
        cell: ({ row }) => <div className="fw-medium">{row.original.particular}</div>
      }
    ];
    if (!form.currentYear) {
      // Default: show all
      yearCols.push(
        {
          accessorKey: "I_Year",
          header: "1st Year",
          cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.I_Year || 0}</div>
        },
        {
          accessorKey: "II_year",
          header: "2nd Year",
          cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.II_year || 0}</div>
        },
        {
          accessorKey: "III_Year",
          header: "3rd Year",
          cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.III_Year || 0}</div>
        },
        {
          accessorKey: "IV_Year",
          header: "4th Year",
          cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.IV_Year || 0}</div>
        }
      );
    } else {
      if (form.currentYear >= 1) yearCols.push({
        accessorKey: "I_Year",
        header: "1st Year",
        cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.I_Year || 0}</div>
      });
      if (form.currentYear >= 2) yearCols.push({
        accessorKey: "II_year",
        header: "2nd Year",
        cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.II_year || 0}</div>
      });
      if (form.currentYear >= 3) yearCols.push({
        accessorKey: "III_Year",
        header: "3rd Year",
        cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.III_Year || 0}</div>
      });
      if (form.currentYear >= 4) yearCols.push({
        accessorKey: "IV_Year",
        header: "4th Year",
        cell: ({ row }) => <div style={{ textAlign: "right" }}>{row.original.IV_Year || 0}</div>
      });
    }
    // Actions column
    yearCols.push({
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (editIdx === row.index) {
          return (
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-sm btn-success" title="Save" onClick={handleEditSave}>
                <i className="fa fa-check" />
              </button>
              <button className="btn btn-sm btn-secondary" title="Cancel" onClick={handleEditCancel}>
                <i className="fa fa-times" />
              </button>
            </div>
          );
        }
        return (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn btn-sm btn-outline-warning"
              title="Edit"
              onClick={() => handleEdit(row.original, row.index)}
            >
              <Edit size={16} />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              title="Delete"
              onClick={() => handleDelete(row.original, row.index)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
      enableSorting: false
    });
    return yearCols;
  };
  const columns = getYearColumns();

  // Expenditure certificate preview data
  const prepareExpenditureData = () => {
    // Find student record
    const student = students.find(
      (s) => (s.Register_Number || s.reg_no || s.RegNo || s.RollNo) === form.regNo
    );
    const parentName = student?.Father_Name || student?.parent_name || student?.Parent_Name || "-";
    const address =
      student?.Address ||
      student?.Address1 ||
      student?.Address_Line ||
      student?.Addr ||
      student?.AddressDetails ||
      "-";
    // Relation label based on Gender: S/o for male, D/o for female
    const genderRaw = student?.Gender || student?.gender || student?.Sex || student?.sex || "";
    const relation = String(genderRaw).toUpperCase().startsWith("F") ? "D/o" : "S/o";
    const course = "B.Pharmacy";
    const year = form.yearRange || "-";
    const quota = student?.Quota || student?.quota || "-";
    const studentName = form.studentName || "-";
    const regNo = form.regNo || "-";
    const today = new Date();
    const refNo = `EXPENDITURE/${regNo}/${today.getFullYear()}`;
    const dateStr = today.toLocaleDateString("en-GB");

    // Table rows
    const feeRows = table.map((row, idx) => [
      row.sno,
      row.particular,
      row.I_Year || 0,
      row.II_year || 0,
      row.III_Year || 0,
      row.IV_Year || 0
    ]);
    // Total row
    const totalRow = [
      "",
      "Total",
      table.reduce((sum, r) => sum + Number(r.I_Year || 0), 0),
      table.reduce((sum, r) => sum + Number(r.II_year || 0), 0),
      table.reduce((sum, r) => sum + Number(r.III_Year || 0), 0),
      table.reduce((sum, r) => sum + Number(r.IV_Year || 0), 0)
    ];

    return {
      refNo,
      dateStr,
      studentName,
      parentName,
      address,
      course,
      year,
      quota,
      relation,
      feeRows,
      totalRow
    };
  };

  // Print function for expenditure certificate — print the on-screen preview
  const handlePrintExpenditure = () => {
    const printableNode = printableRef.current;
    if (!printableNode) return toastify.error("Nothing to print");

    // Resolve img src to absolute URLs in-place so print preview can load them
    const imgs = printableNode.querySelectorAll('img');
    imgs.forEach((img) => {
      const src = img.getAttribute('src') || '';
      try {
        const abs = new URL(src, window.location.href).href;
        img.setAttribute('src', abs);
      } catch (e) {
        // ignore resolution failures
      }
    });

    // Wait for images inside the preview to load, then call native print which
    // will use the existing @media print rules in this component to show only
    // the expenditure preview on the printed page.
    const loadPromises = Array.from(imgs).map(img => new Promise(res => {
      if (img.complete) return res();
      img.onload = img.onerror = () => res();
    }));

    Promise.all(loadPromises).then(() => {
      try {
        window.focus();
        window.print();
      } catch (e) {
        console.error(e);
      }
    });
  };

  // EXPENDITURE button handler
  const handleExpenditure = () => {
    const data = prepareExpenditureData();
    setExpenditureData(data);
    setShowExpenditure(true);
    setTimeout(() => {
      const el = document.getElementById("expenditure-certificate");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 180);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} gutter={8} toastOptions={{ duration: 4000, style: { background: "#363636", color: "#fff" }, success: { duration: 3000 } }} />
      <ToastContainer />

      <section className="overlay">
        <Sidebar />

        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Fees Estimation</h6>
            </div>
            <div className="card h-100 p-0 radius-12">
              <div className="card-body p-24">
                <div className="row g-20 m-24">
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Reg No <span className="text-danger">*</span></label>
                    <Select
                      options={regNoOptions}
                      value={regNoOptions.find(opt => opt.value === form.regNo) || null}
                      onChange={handleRegNoChange}
                      placeholder="Select Reg No"
                      isClearable
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Student Name <span className="text-danger">*</span></label>
                    <input type="text" name="studentName" value={form.studentName || ""} className="form-control" readOnly />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Current Semester <span className="text-danger">*</span></label>
                    <input type="text" name="sem" value={form.sem || ""} className="form-control" readOnly />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Year of Admission <span className="text-danger">*</span></label>
                    <input type="text" name="yearRange" value={form.yearRange} className="form-control" readOnly />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button type="button" className="btn btn-outline-primary px-20 py-11" style={{ fontSize: "1rem" }} onClick={() => setShowReport(true)} disabled={!form.yearRange || !form.regNo}>
                    View
                  </button>
                  <button type="button" className="btn btn-outline-warning px-20 py-11" style={{ fontSize: "1rem" }} onClick={handleExpenditure}>
                    EXPENDITURE
                  </button>
                </div>
              </div>
            </div>

            {/* Report Table - shown after clicking VIEW */}
            {showReport && (
              <div id="fees-table-section" className="card p-3 mb-4">
                <DataTable
                  data={table}
                  columns={columns}
                  loading={false}
                  error={null}
                  title={`Fees Estimation Table`}
                  enableExport={true}
                  enableSelection={true}
                  enableActions={false}
                  pageSize={10}
                  footer={(() => {
                    // Only show total columns up to current year
                    const tds = [<td key="empty"></td>, <td key="total">Total</td>];
                    if (!form.currentYear) {
                      tds.push(
                        <td key="I_Year" style={{ textAlign: "right" }}>{totalRow.I_Year}</td>,
                        <td key="II_year" style={{ textAlign: "right" }}>{totalRow.II_year}</td>,
                        <td key="III_Year" style={{ textAlign: "right" }}>{totalRow.III_Year}</td>,
                        <td key="IV_Year" style={{ textAlign: "right" }}>{totalRow.IV_Year}</td>
                      );
                    } else {
                      if (form.currentYear >= 1) tds.push(<td key="I_Year" style={{ textAlign: "right" }}>{totalRow.I_Year}</td>);
                      if (form.currentYear >= 2) tds.push(<td key="II_year" style={{ textAlign: "right" }}>{totalRow.II_year}</td>);
                      if (form.currentYear >= 3) tds.push(<td key="III_Year" style={{ textAlign: "right" }}>{totalRow.III_Year}</td>);
                      if (form.currentYear >= 4) tds.push(<td key="IV_Year" style={{ textAlign: "right" }}>{totalRow.IV_Year}</td>);
                    }
                    tds.push(<td key="empty2"></td>);
                    return <tr style={{ background: "#ffe4b5", fontWeight: 700 }}>{tds}</tr>;
                  })()}
                />
                {/* Print button placed below the table */}
                {/* <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    <i className="fas fa-print me-2"></i>Print Report
                  </button>
                </div> */}
              </div>
            )}

            {/* Expenditure Certificate - shown after clicking EXPENDITURE */}
            {showExpenditure && expenditureData && (
              <div id="expenditure-certificate" className="card p-3 mb-4" style={{ background: "#fff" }}>
                <div className="d-flex justify-content-end mb-2">
                  <button className="btn btn-primary" onClick={handlePrintExpenditure}>
                    <i className="fas fa-print me-2"></i>Print Certificate
                  </button>
                </div>
                <div ref={printableRef}>
                  <div
                    style={{
                      border: "2px solid #222", // Black inner
                      margin: 12,
                      padding: 0,
                      minHeight: "auto", // For A4 portrait
                      position: "relative",
                      background: "#fff",
                    }}
                  >
                    {/* Header */}
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

                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, textDecoration: "underline", margin: "18px 0 12px 0" }}>
                      TO WHOMSOEVER IT MAY CONCERN
                    </div>
                    {/* Certificate Paragraph */}
                    <div style={{ textAlign: "justify", textIndent: "40px", fontSize: 15, marginBottom: 18, lineHeight: 1.7, padding: "0 60px" }}>
                      This is to certify that <b>{expenditureData.studentName}</b>, {expenditureData.relation} <b>{expenditureData.parentName}</b>, residing at <b>{expenditureData.address}</b>, has been admitted to the <b>{expenditureData.course}</b> course for the academic year <b>{expenditureData.year}</b> under <b>{expenditureData.quota}</b> quota in our institution.
                    </div>
                    {/* Subheading */}
                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, textDecoration: "underline", margin: "18px 0 12px 0" }}>
                      PROPOSED EXPENDITURE FOR B.PHARMACY COURSE
                    </div>
                    {/* Table */}
                    <div style={{ padding: "0 24px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>S.No</th>
                            <th style={thStyle}>Fee Details</th>
                            {form.currentYear >= 1 && <th style={thStyle}>1st Year</th>}
                            {form.currentYear >= 2 && <th style={thStyle}>2nd Year</th>}
                            {form.currentYear >= 3 && <th style={thStyle}>3rd Year</th>}
                            {form.currentYear >= 4 && <th style={thStyle}>4th Year</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {expenditureData.feeRows.map((row, idx) => (
                            <tr key={idx}>
                              <td style={tdStyle}>{row[0]}</td>
                              <td style={{ ...tdStyle, textAlign: "left" }}>{row[1]}</td>
                              {form.currentYear >= 1 && <td style={tdStyle}>{row[2]}</td>}
                              {form.currentYear >= 2 && <td style={tdStyle}>{row[3]}</td>}
                              {form.currentYear >= 3 && <td style={tdStyle}>{row[4]}</td>}
                              {form.currentYear >= 4 && <td style={tdStyle}>{row[5]}</td>}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td style={tdStyle}></td>
                            <td style={{ ...tdStyle, fontWeight: 700 }}>TOTAL</td>
                            {form.currentYear >= 1 && <td style={{ ...tdStyle, fontWeight: 700 }}>{expenditureData.totalRow[2]}</td>}
                            {form.currentYear >= 2 && <td style={{ ...tdStyle, fontWeight: 700 }}>{expenditureData.totalRow[3]}</td>}
                            {form.currentYear >= 3 && <td style={{ ...tdStyle, fontWeight: 700 }}>{expenditureData.totalRow[4]}</td>}
                            {form.currentYear >= 4 && <td style={{ ...tdStyle, fontWeight: 700 }}>{expenditureData.totalRow[5]}</td>}
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {/* Note */}
                    <div style={{ margin: "24px 0 0 24px", fontSize: 12 }}>
                      <b>Note:</b> This certificate is issued for the purpose of applying for an educational loan. The institution is not responsible for the recovery of the loan.
                    </div>
                    {/* Signature */}
                    <div style={{ margin: "48px 48px 0 0", textAlign: "right", fontWeight: 700, fontSize: 15 }}>
                      PRINCIPAL<br />
                      <span style={{ fontWeight: 400, fontSize: 12 }}>DR. KALAM POLYTECHNIC COLLEGE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>

      {/* Inline CSS for print preview and styling */}
      <style>{`
        .exp-cert-table, .exp-cert-table th, .exp-cert-table td {
          border: 1px solid #222 !important;
        }
        .exp-cert-table {
          border-collapse: collapse !important;
        }
        .exp-cert-table th, .exp-cert-table td {
          padding: 7px 10px !important;
        }
        @media print {
          body * { visibility: hidden !important; }
          #expenditure-certificate, #expenditure-certificate * { visibility: visible !important; }
          #expenditure-certificate {
            position: absolute !important;
            left: 0; top: 0; width: 100vw !important; min-height: 100vh !important;
            margin: 0 !important; padding: 0 !important; background: #fff !important;
          }
          nav, .breadcrumb, button, .btn, footer, .card:first-child { display: none !important; }
          @page { size: A4 portrait; margin: 8mm; }
        }
      `}</style>
    </>
  );
}

const thStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  fontWeight: 700,
  background: "#f4f4f4",
  textAlign: "center",
};
const tdStyle = {
  border: "1px solid #222",
  padding: "7px 10px",
  textAlign: "center",
};
