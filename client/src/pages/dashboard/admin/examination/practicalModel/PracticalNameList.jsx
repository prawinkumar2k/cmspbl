import React, { useState, useMemo, useCallback, useEffect } from "react";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import DataTable from "../../../../../components/DataTable/DataTable";
import { Toaster, toast } from "react-hot-toast";

/* ---------------- State-backed data (loaded from API) ---------------- */

const SEMS = ["1", "2", "3", "4", "5", "6"];

/* ---------------- COMPONENT ---------------- */

const PracticalNameList = () => {
  const [form, setForm] = useState({
    department: "",
    sem: "",
    QPC: "",
    subject: "",
  });

  const [showDetails, setShowDetails] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subjectsForDepartment = useMemo(() => subjects || [], [subjects]);

  const QPCOptions = useMemo(() => {
    if (!form.subject) return [];
    const s = subjects.find(
      (x) =>
        (x.Sub_Name || x.sub_name || x.name) === form.subject ||
        (x.Sub_Code || x.sub_code) === form.subject
    );
    if (!s) return [];
    // try common field names for QPC/QPC
    return [s.QPC || s.qpc || s.QPC_No || s.QPC || s.QPCNo].filter(Boolean);
  }, [form.subject, subjects]);

  // Auto-populate QPC when subject changes
  useEffect(() => {
    if (QPCOptions && QPCOptions.length > 0) {
      handleChange("QPC", QPCOptions[0]);
    } else {
      handleChange("QPC", "");
    }
  }, [QPCOptions]);

  // Fetch subjects whenever department (or semester) changes
  useEffect(() => {
    if (!form.department) return;
    const dept = departments.find((d) => d.name === form.department);
    const deptCode = dept ? dept.code : "";
    if (!deptCode) return;
    let cancelled = false;
    const loadSubjects = async () => {
      try {
        const semParam = form.sem
          ? `&semester=${encodeURIComponent(form.sem)}`
          : "";
        const res = await fetch(
          `/api/practicaltimetable/master/subjects?deptCode=${encodeURIComponent(
            deptCode
          )}${semParam}`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const body = await res.json();
        const list = Array.isArray(body)
          ? body
          : body.data && Array.isArray(body.data)
            ? body.data
            : [];
        if (!cancelled) setSubjects(list);
      } catch (err) {
        console.warn("Failed to load subjects", err);
        if (!cancelled) setSubjects([]);
      }
    };
    loadSubjects();
    return () => {
      cancelled = true;
    };
  }, [form.department, form.sem, departments]);

  const handleChange = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // departments for selects
        const depRes = await fetch(
          "/api/practicaltimetable/master/departments"
        );
        if (depRes.ok) {
          const body = await depRes.json();
          const list = Array.isArray(body)
            ? body
            : body.data && Array.isArray(body.data)
              ? body.data
              : [];
          if (!cancelled && list.length)
            setDepartments(
              list.map((d) => ({
                name: d.Dept_Name || d.dept_name || d.name,
                code: d.Dept_Code || d.dept_code || d.code,
              }))
            );
        }

        // Fetch practical exam data
        const practicalRes = await fetch("/api/practicalexams/practical-exams");
        if (practicalRes.ok) {
          const practicalBody = await practicalRes.json();
          const practicalList = Array.isArray(practicalBody)
            ? practicalBody
            : practicalBody.data && Array.isArray(practicalBody.data)
              ? practicalBody.data
              : [];
          if (!cancelled) setStudents(practicalList);
        }
      } catch (err) {
        console.warn("Failed to load departments or practical exam data", err);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    if (!form.department || !form.sem) return [];
    // Filter by department and semester from practical exam data
    return students.filter((s) => {
      const deptCode = String(s.Dept_Code || "").toLowerCase();
      const selectedDept = departments.find(
        (d) => d.name.toLowerCase() === form.department.toLowerCase()
      );
      const selectedDeptCode = selectedDept ? String(selectedDept.code || "").toLowerCase() : "";
      const semester = String(s.Semester || "");
      return deptCode === selectedDeptCode && semester === form.sem;
    });
  }, [form.department, form.sem, students, departments]);

  const handleGenerate = useCallback(() => {
    if (!form.department || !form.subject) {
      toast.error("Please fill Department and Subject");
      return;
    }

    // populate table data from filteredStudents and normalize fields
    setLoading(true);
    try {
      const data = filteredStudents.map((s, i) => ({
        _index: i + 1,
        id: s.exam_timetable_id || s.id || null,
        Student_Name: s.Student_Name || "",
        Reg_No: s.Register_Number || "",
        Subject: s.Sub_Code || form.subject || "",
        QPC: s.QPC || form.QPC || "",
        Dept_Name: form.department || "",
        Dept_Code: s.Dept_Code || "",
        raw: s,
      }));
      setTableData(data);
      setShowDetails(true);
      toast.success("Practical details generated");
    } catch (err) {
      console.warn("Failed to prepare table data", err);
      setError("Failed to prepare table data");
      toast.error("Failed to generate details");
    } finally {
      setLoading(false);
    }
  }, [form, filteredStudents]);

  // data table columns for students
  const studentColumns = useMemo(
    () => [
      {
        accessorKey: "_index",
        header: "S.No",
        cell: ({ row }) => <strong>{row.original._index}</strong>,
      },
      { accessorKey: "Student_Name", header: "Name" },
      { accessorKey: "Reg_No", header: "Reg No" },
      { accessorKey: "Subject", header: "Subject" },
      { accessorKey: "QPC", header: "QPC" },
      { accessorKey: "Dept_Name", header: "Department" },
    ],
    [
      /* stable */
    ]
  );

  // Paginated report generator matching CurrentBorrower.jsx design
  const generateMultiPageReport = useCallback(
    (dataRows, reportTitle) => {
      const rowsPerPage = 10;
      const totalPages = Math.ceil((dataRows || []).length / rowsPerPage);
      let fullHtml = '';

      for (let i = 0; i < totalPages; i++) {
        const pageData = dataRows.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
        let tableRows = '';

        // Data rows
        pageData.forEach((row, idx) => {
          const globalIdx = i * rowsPerPage + idx + 1;
          const regNo = row.Reg_No || (row.raw && (row.raw.Register_Number || row.raw.RegisterNo || row.raw.Std_UID)) || '';
          const studName = row.Student_Name || '';
          tableRows += `
            <tr style="height: 34px;">
              <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${globalIdx}</td>
              <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${regNo}</td>
              <td style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px;">${studName}</td>
              <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;"></td>
              <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;"></td>
            </tr>
          `;
        });

        // Fill empty rows to make exactly 10 rows per page
        const emptyRowsCount = rowsPerPage - pageData.length;
        for (let j = 0; j < emptyRowsCount; j++) {
          tableRows += `
            <tr style="height: 34px;">
              <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
              <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
              <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
              <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
              <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
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

              <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                ${reportTitle.toUpperCase()}
              </div>

              <div style="margin-bottom: 10px; font-size: 11px;">
                <b>Department:</b> ${form.department} &nbsp;&nbsp; <b>Semester:</b> ${form.sem || 'N/A'} &nbsp;&nbsp; <b>Subject:</b> ${form.subject}
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-top: 5px; table-layout: fixed;">
                <thead>
                  <tr style="background-color: #f2f2f2; height: 32px;">
                    <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">S.No</th>
                    <th style="border: 1.5px solid #000; width: 20%; font-size: 10px; text-align: center;">Register No</th>
                    <th style="border: 1.5px solid #000; width: 32%; font-size: 10px; text-align: center;">Student Name</th>
                    <th style="border: 1.5px solid #000; width: 15%; font-size: 10px; text-align: center;">Ex. No</th>
                    <th style="border: 1.5px solid #000; width: 25%; font-size: 10px; text-align: center;">Signature</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>

              <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                <div><b>Exam Controller</b></div>
              </div>
            </div>
          </div>
        `;
      }

      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Popup blocked. Allow popups to print.');
        return;
      }
      win.document.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
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
      `);
      win.document.close();
      win.onload = () => {
        setTimeout(() => {
          win.print();
          win.close();
        }, 500);
      };
    },
    [form.department, form.sem, form.subject]
  );

  // Wrapper for DataTable onPrint prop
  const handlePrintReport = useCallback(
    (dataRows, cols, title) => {
      generateMultiPageReport(dataRows, title || 'Practical Namelist');
    },
    [generateMultiPageReport]
  );

  return (
    <>
      <Toaster position="top-right" />

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-semibold mb-0">Practical Name List</h6>
            </div>

            <div className="card p-0 radius-12">
              {/* <div className="card-header p-24 d-flex justify-content-between">
                <div /> */}
              {/* header left intentionally empty - action buttons moved into form */}
              {/* </div> */}

              <div className="card-body p-24">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGenerate();
                  }}
                >
                  <div className="row g-20">
                    <div className="col-12 col-md-3">
                      <label className="form-label">Department *</label>
                      <select
                        className="form-select"
                        value={form.department}
                        onChange={(e) =>
                          handleChange("department", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {departments.map((d) => (
                          <option key={d.code || d.name} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Sem *</label>
                      <select
                        className="form-select"
                        value={form.sem}
                        onChange={(e) => handleChange("sem", e.target.value)}
                      >
                        <option value="">Select</option>
                        {SEMS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-3">
                      <label className="form-label">Subject *</label>
                      <select
                        className="form-select"
                        value={form.subject}
                        onChange={(e) =>
                          handleChange("subject", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {subjectsForDepartment.map((s) => (
                          <option
                            key={
                              s.Sub_Code ||
                              s.sub_code ||
                              s.id ||
                              s.Sub_Name ||
                              s.sub_name
                            }
                            value={
                              s.Sub_Name ||
                              s.sub_name ||
                              s.name ||
                              s.Sub_Code ||
                              s.sub_code
                            }
                          >
                            {s.Sub_Name ||
                              s.sub_name ||
                              s.name ||
                              s.Sub_Code ||
                              s.sub_code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-3">
                      <label className="form-label">QPC</label>
                      <input
                        className="form-control"
                        value={form.QPC}
                        onChange={(e) => handleChange("QPC", e.target.value)}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleGenerate}
                    >
                      VIEW
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {showDetails && (
              <div className="card mt-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Practical Name List</h6>
                    <div className="small">
                      Department: {form.department} &nbsp; Subject:{" "}
                      {form.subject} &nbsp; Sem: {form.sem || "N/A"}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        handlePrintReport(
                          tableData,
                          studentColumns,
                          "Practical Namelist"
                        )
                      }
                    >
                      Print
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    data={tableData}
                    columns={studentColumns}
                    onPrint={handlePrintReport}
                    loading={loading}
                    error={error}
                    title="Practical Students"
                    enableExport={false}
                    enableActions={false}
                    enableSelection={false}
                    pageSize={25}
                  />
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default PracticalNameList;