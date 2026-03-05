import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import DataTable from "../../../../../components/DataTable/DataTable";

/* -------------------------
   Standardized Print Helper
   ------------------------- */
const printElementById = (id, title = '', orientation = 'portrait') => {
  const contentEl = document.getElementById(id);
  if (!contentEl) {
    alert('Content not found');
    return;
  }

  const printStyle = document.createElement("style");
  printStyle.id = `print-${id}-style`;
  printStyle.textContent = `
    @page { size: A4 ${orientation}; margin: 0; }
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100%;
        background: #fff !important;
      }
      body * { visibility: hidden !important; }
      #${id}, #${id} * { visibility: visible !important; }
      #${id} {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        display: block !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        background: #fff !important;
      }
      .navbar, .footer, .sidebar, .card, button, .btn, .Toastify, .ToastContainer { display: none !important; }
      .print-page {
        page-break-after: always;
        width: ${orientation === 'landscape' ? '297mm' : '210mm'} !important;
        height: ${orientation === 'landscape' ? '210mm' : '297mm'} !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        overflow: hidden !important;
      }
      .print-page:last-child {
        page-break-after: auto;
      }
    }
  `;
  document.head.appendChild(printStyle);

  const waitForImages = (selector, timeout = 1200) => {
    return new Promise((resolve) => {
      const el = document.getElementById(selector);
      if (!el) return resolve();
      const imgs = Array.from(el.querySelectorAll("img"));
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
    try { await waitForImages(id, 1200); } catch (e) { }
    window.print();
    setTimeout(() => {
      const el = document.getElementById(`print-${id}-style`);
      if (el) el.remove();
    }, 1000);
  }, 120);
};

/* -------------------------
   Conduct-style Report Wrapper
   ------------------------- */
const ConductWrapper = ({ mainTitle, children, orientation = 'portrait', className = '', pageNo = 1, totalPages = 1, hideHeader = false, centerContent = false }) => {
  const isLandscape = orientation === 'landscape';
  return (
    <div
      className={`print-page ${className}`}
      style={{
        background: '#fff',
        padding: '5mm', // reduced padding to fit more
        width: isLandscape ? '297mm' : '210mm',
        height: isLandscape ? '210mm' : '297mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: '11px',
        color: '#000',
        position: 'relative'
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: centerContent ? 'center' : 'flex-start' }}>
        {/* DOTE Header */}


        {/* Info Grid */}
        {!hideHeader && (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000ff', fontSize: '10px', marginBottom: '10px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000000ff', padding: '4px', width: '20%' }}>
                  <div style={{ fontSize: '9px', color: '#555' }}>Ins Code</div>
                  <div style={{ fontWeight: 'bold' }}>214</div>
                </td>
                <td style={{ border: '1px solid #000000ff', padding: '4px', width: '60%' }}>
                  <div style={{ fontSize: '9px', color: '#555' }}>Name of the Institution</div>
                  <div style={{ fontWeight: 'bold' }}>GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                </td>
                <td style={{ border: '1px solid #000000ff', padding: '4px', width: '20%' }}>
                  <div style={{ fontSize: '9px', color: '#555' }}>Centre Code</div>
                  <div style={{ fontWeight: 'bold' }}>214</div>
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000000ff', padding: '4px' }}>
                  <div style={{ fontSize: '9px', color: '#555' }}>Department</div>
                  <div style={{ fontWeight: 'bold' }}>B.PHARM</div>
                </td>
                <td style={{ border: '1px solid #000000ff', padding: '4px' }}>
                  <div style={{ fontSize: '9px', color: '#555' }}>Department Name (FULL TIME)</div>
                  <div style={{ fontWeight: 'bold' }}>BACHELOR OF PHARMACY</div>
                </td>
                <td style={{ border: '1px solid #000000ff', padding: '4px' }}>
                  <div style={{ fontSize: '9px', color: '#555' }}>Page No</div>
                  <div style={{ fontWeight: 'bold' }}>{pageNo}</div>
                </td>
              </tr>
            </tbody> 
          </table>
        )}

        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* Footer (If needed) */}
      </div>
    </div>
  );
};

// Data will be provided by server or parent; start empty here

const DEFAULT_FILTERS = {
  DepartmentName: 'All',
  DepartmentCode: 'All',
  year: 'All',
  semester: 'All'
};

const NominalRoll = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });

  // derive options from data and ensure pharmacy departments exist
  const DepartmentNames = useMemo(() => {
    const vals = Array.from(new Set(data.map(d => d.DepartmentName).filter(Boolean)));
    const extras = [
      'D.PHARM (DIPLOMA IN PHARMACY)',
      'B.PHARM (BACHELOR OF PHARMACY)',
      'M.PHARM (MASTER OF PHARMACY)'
    ];
    extras.forEach(e => { if (!vals.includes(e)) vals.push(e); });
    return ['All', ...vals];
  }, [data]);

  // Auto-fetch Department Codes based on selected Department Name
  const DepartmentCodes = useMemo(() => {
    if (filters.DepartmentName === 'All') {
      return ['All', ...Array.from(new Set(data.map(d => d.DepartmentCode).filter(Boolean)))];
    }
    const codes = Array.from(new Set(
      data
        .filter(d => d.DepartmentName === filters.DepartmentName)
        .map(d => d.DepartmentCode)
        .filter(Boolean)
    ));
    return ['All', ...codes];
  }, [data, filters.DepartmentName]);

  // Auto-fetch Years based on selected Department
  const years = useMemo(() => {
    let filtered = data;
    if (filters.DepartmentName !== 'All') {
      filtered = filtered.filter(d => d.DepartmentName === filters.DepartmentName);
    }
    if (filters.DepartmentCode !== 'All') {
      filtered = filtered.filter(d => d.DepartmentCode === filters.DepartmentCode);
    }
    const yrs = Array.from(new Set(filtered.map(d => d.year).filter(Boolean))).sort((a, b) => a - b);
    return ['All', ...yrs];
  }, [data, filters.DepartmentName, filters.DepartmentCode]);

  // Auto-fetch Semesters based on selected Department
  const semesters = useMemo(() => {
    let filtered = data;
    if (filters.DepartmentName !== 'All') {
      filtered = filtered.filter(d => d.DepartmentName === filters.DepartmentName);
    }
    if (filters.DepartmentCode !== 'All') {
      filtered = filtered.filter(d => d.DepartmentCode === filters.DepartmentCode);
    }
    const sems = Array.from(new Set(filtered.map(d => d.semester).filter(Boolean))).sort((a, b) => a - b);
    return ['All', ...sems];
  }, [data, filters.DepartmentName, filters.DepartmentCode]);

  // fetch student data to populate the table
  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/nominalRoll');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        const rows = Array.isArray(json)
          ? json
          : (json && Array.isArray(json.data)
            ? json.data
            : (json && Array.isArray(json.rows)
              ? json.rows
              : (json && Array.isArray(json.result)
                ? json.result
                : [])));
        const normalize = (r) => ({
          rollNo: r.Reg_Number ?? r.Register_Number ?? r.Application_No ?? r.Roll_No ?? r.RollNo ?? r.Id ?? r.id ?? '',
          studentName: r.Student_Name ?? r.student_name ?? r.StudentName ?? r.name ?? '',
          dob: r.DOB ?? r.dob ?? '',
          photoPath: r.Photo_Path ?? r.photo_path ?? r.PhotoPath ?? '',
          DepartmentName: r.Dept_Name ?? r.dept_name ?? r.Department ?? r.department ?? r.Dept ?? r.dept ?? '',
          DepartmentCode: r.Dept_Code ?? r.dept_code ?? r.Department_code ?? r.DepartmentCode ?? r.c_no ?? r.cno ?? '',
          semester: r.Semester ?? r.semester ?? '',
          year: r.Year ?? r.year ?? '',
          regulation: r.Regulation ?? r.regulation ?? '',
          S1: r.S1 ?? '', S2: r.S2 ?? '', S3: r.S3 ?? '', S4: r.S4 ?? '',
          S5: r.S5 ?? '', S6: r.S6 ?? '', S7: r.S7 ?? '', S8: r.S8 ?? '',
          R1: r.R1 ?? '', R2: r.R2 ?? '', R3: r.R3 ?? '', R4: r.R4 ?? '',
          R5: r.R5 ?? '', R6: r.R6 ?? '', R7: r.R7 ?? '', R8: r.R8 ?? ''
        });
        const normalized = rows.map(normalize);
        if (mounted) setData(normalized);
      } catch (err) {
        console.error('Failed to fetch /api/nominalRoll', err);
        toast.error('Failed to fetch students');
      }
    };
    fetchStudents();
    return () => { mounted = false; };
  }, []);

  // controlled change handler - auto apply filters when selection changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(f => {
      const updated = { ...f, [name]: value };

      // When DepartmentName changes, auto-fetch matching DepartmentCode
      if (name === 'DepartmentName' && value !== 'All') {
        const matchingCodes = Array.from(new Set(
          data
            .filter(d => d.DepartmentName === value)
            .map(d => d.DepartmentCode)
            .filter(Boolean)
        ));
        // Auto-set DepartmentCode if there's only one match, otherwise set to 'All'
        updated.DepartmentCode = matchingCodes.length === 1 ? matchingCodes[0] : 'All';
        updated.year = 'All';
        updated.semester = 'All';
      }
      // When Semester changes, auto-fetch corresponding Year
      else if (name === 'semester' && value !== 'All') {
        const semNum = parseInt(value);
        let yearNum;
        if (semNum <= 2) yearNum = 1;
        else if (semNum <= 4) yearNum = 2;
        else if (semNum <= 6) yearNum = 3;
        else yearNum = 4;
        updated.year = String(yearNum);
      }
      // When Year changes, reset semester
      else if (name === 'year' && value !== 'All') {
        updated.semester = 'All';
      }

      return updated;
    });
  }, [data]);

  // Auto-filter effect - apply filters whenever filter selections change
  useEffect(() => {
    // Filters are auto-applied
  }, [filters]);

  // compute filtered rows based on current filters (auto-filter)
  const filtered = useMemo(() => {
    return data.filter(row => {
      // DepartmentName
      if (filters.DepartmentName && filters.DepartmentName !== 'All' && String(row.DepartmentName) !== String(filters.DepartmentName)) return false;
      // Department Code
      if (filters.DepartmentCode && filters.DepartmentCode !== 'All' && String(row.DepartmentCode) !== String(filters.DepartmentCode)) return false;
      // Year
      if (filters.year && filters.year !== 'All' && String(row.year) !== String(filters.year)) return false;
      // Semester
      if (filters.semester && filters.semester !== 'All' && String(row.semester) !== String(filters.semester)) return false;
      return true;
    });
  }, [data, filters]);

  // Format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    if (!arr) return chunks;
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const handlePrint = () => {
    printElementById('nominal-roll-report-print', 'Nominal Roll Report', 'landscape');
  };

  const renderPrintTable = (chunk) => {
    const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '9px', color: '#000', border: '1.5px solid #000000ff' };
    const thStyle = { border: '1px solid #000000ff', padding: '6px', textAlign: 'center', fontWeight: 'bold' };
    const tdStyle = { border: '1px solid #000000ff', padding: '6px' };

    return (
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: '40px' }}>SNo</th>
            <th style={{ ...thStyle, width: '100px' }}>Reg No</th>
            <th style={thStyle}>Name of the Applicant</th>
            <th style={{ ...thStyle, width: '100px' }}>DoB</th>
            <th style={{ ...thStyle, width: '100px' }}>Sem/Regl</th>
            <th style={{ ...thStyle, width: '150px' }}>Subject(s)</th>
            <th style={{ ...thStyle, width: '70px' }}>Photo</th>
          </tr>
        </thead>
        <tbody>
          {chunk.map((row, idx) => (
            <React.Fragment key={idx}>
              <tr>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{idx + 1}</td>
                <td style={tdStyle}>{row.rollNo}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold', textTransform: 'uppercase' }}>{row.studentName}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{formatDate(row.dob).replace(/-/g, '.')}</td>
                <td style={tdStyle}>
                  {/* Matching image style with multiple semesters if data exists */}
                  <div style={{ fontSize: '8px' }}>
                    {row.semester ? `${row.semester} / ${row.regulation || 'R2023'}` : '-'}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '8px' }}>
                    {/* Combine subjects S1-S8 for top row if needed, or list them */}
                    {[row.S1, row.S2, row.S3, row.S4, row.S5, row.S6, row.S7, row.S8].filter(Boolean).join(', ')}
                  </div>
                </td>
                <td style={{ ...tdStyle, height: '60px', padding: '2px', textAlign: 'center' }}>
                  <img
                    src={row.photoPath ? `/api/studentMaster/student/student-image/${row.photoPath}` : '/api/studentMaster/student/student-image/student.png'}
                    alt="Student"
                    style={{ height: '55px', width: 'auto', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.src = '/api/studentMaster/student/student-image/student.png';
                    }}
                  />
                </td>
              </tr>
              {/* Elective row placeholder */}
              <tr>
                <td colSpan={7} style={{ ...tdStyle, fontSize: '8px', padding: '2px 6px', color: '#666' }}>
                  Elective I: [ ] Elective II: [ ]
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  const renderSummaryTable = (dataRows) => {
    const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '10px', color: '#000', border: '1.5px solid #000' };
    const thStyle = { border: '1px solid #000', padding: '8px', background: '#f0fff0', textAlign: 'center', fontWeight: 'bold' };
    const tdStyle = { border: '1px solid #000', padding: '8px' };

    // Group by department
    const summaryMap = {};
    dataRows.forEach(row => {
      const dept = row.DepartmentName || 'Unknown';
      const deptCode = row.DepartmentCode || '-';
      if (!summaryMap[dept]) {
        summaryMap[dept] = { deptCode, deptName: dept, I: 0, III: 0, V: 0, VII: 0, Sup: 0, GC: 0, Total: 0 };
      }
      const sem = parseInt(row.semester);
      if (sem <= 2) summaryMap[dept].I++;
      else if (sem <= 4) summaryMap[dept].III++;
      else if (sem <= 6) summaryMap[dept].V++;
      else if (sem <= 8) summaryMap[dept].VII++;
      summaryMap[dept].Total++;
    });

    const summaryRows = Object.values(summaryMap);
    const grandTotal = summaryRows.reduce((acc, row) => ({
      I: acc.I + row.I, III: acc.III + row.III, V: acc.V + row.V, VII: acc.VII + row.VII,
      Sup: acc.Sup + row.Sup, GC: acc.GC + row.GC, Total: acc.Total + row.Total
    }), { I: 0, III: 0, V: 0, VII: 0, Sup: 0, GC: 0, Total: 0 });

    return (
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Course</th>
            <th style={thStyle}>Course Name</th>
            <th style={thStyle}>I</th>
            <th style={thStyle}>III</th>
            <th style={thStyle}>V</th>
            <th style={thStyle}>VII</th>
            <th style={thStyle}>Sup</th>
            <th style={thStyle}>GC</th>
            <th style={thStyle}>Total</th>
          </tr>
        </thead>
        <tbody>
          {summaryRows.map((row, idx) => (
            <tr key={idx}>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{row.deptCode}</td>
              <td style={tdStyle}>{row.deptName}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{row.I}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{row.III}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{row.V}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{row.VII}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{row.Sup}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{row.GC}</td>
              <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold' }}>{row.Total}</td>
            </tr>
          ))}
          <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
            <td colSpan={2} style={{ ...tdStyle, textAlign: 'right' }}>TOTAL(s)</td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>{grandTotal.I}</td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>{grandTotal.III}</td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>{grandTotal.V}</td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>{grandTotal.VII}</td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>{grandTotal.Sup}</td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>{grandTotal.GC}</td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>{grandTotal.Total}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // DataTable columns (reuse existing DataTable structure)
  const columns = [
    {
      header: "SNo",
      accessorKey: "sno",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: 'rollNo', header: 'Register No', cell: ({ row }) => <div>{row?.original?.rollNo ?? '-'}</div> },
    { accessorKey: 'studentName', header: 'Student Name', cell: ({ row }) => <div>{row?.original?.studentName ?? '-'}</div> },
    { accessorKey: 'dob', header: 'DOB', cell: ({ row }) => <div>{formatDate(row?.original?.dob)}</div> },
    // Photo column
    {
      accessorKey: 'photoPath',
      header: 'Photo',
      cell: ({ row }) => {
        const photoPath = row?.original?.photoPath;
        return (
          <div>
            <img
              src={photoPath ? `/api/studentMaster/student/student-image/${photoPath}` : '/api/studentMaster/student/student-image/student.png'}
              alt="Student"
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
              onError={(e) => {
                e.target.src = '/api/studentMaster/student/student-image/student.png';
              }}
            />
          </div>
        );
      }
    },
    { accessorKey: 'DepartmentName', header: 'Dept Name', cell: ({ row }) => <div>{row?.original?.DepartmentName ?? '-'}</div> },
    { accessorKey: 'DepartmentCode', header: 'Dept Code', cell: ({ row }) => <div>{row?.original?.DepartmentCode ?? '-'}</div> },
    { accessorKey: 'year', header: 'Year', cell: ({ row }) => <div>{row?.original?.year ?? '-'}</div> },
    { accessorKey: 'semester', header: 'Semester', cell: ({ row }) => <div>{row?.original?.semester ?? '-'}</div> },
    { accessorKey: 'regulation', header: 'Regulation', cell: ({ row }) => <div>{row?.original?.regulation ?? '-'}</div> },
    // Subject codes S1-S8
    { accessorKey: 'S1', header: 'S1', cell: ({ row }) => <div>{row?.original?.S1 ?? '-'}</div> },
    { accessorKey: 'S2', header: 'S2', cell: ({ row }) => <div>{row?.original?.S2 ?? '-'}</div> },
    { accessorKey: 'S3', header: 'S3', cell: ({ row }) => <div>{row?.original?.S3 ?? '-'}</div> },
    { accessorKey: 'S4', header: 'S4', cell: ({ row }) => <div>{row?.original?.S4 ?? '-'}</div> },
    { accessorKey: 'S5', header: 'S5', cell: ({ row }) => <div>{row?.original?.S5 ?? '-'}</div> },
    { accessorKey: 'S6', header: 'S6', cell: ({ row }) => <div>{row?.original?.S6 ?? '-'}</div> },
    { accessorKey: 'S7', header: 'S7', cell: ({ row }) => <div>{row?.original?.S7 ?? '-'}</div> },
    { accessorKey: 'S8', header: 'S8', cell: ({ row }) => <div>{row?.original?.S8 ?? '-'}</div> },
    // Result codes R1-R8
    { accessorKey: 'R1', header: 'R1', cell: ({ row }) => <div>{row?.original?.R1 ?? '-'}</div> },
    { accessorKey: 'R2', header: 'R2', cell: ({ row }) => <div>{row?.original?.R2 ?? '-'}</div> },
    { accessorKey: 'R3', header: 'R3', cell: ({ row }) => <div>{row?.original?.R3 ?? '-'}</div> },
    { accessorKey: 'R4', header: 'R4', cell: ({ row }) => <div>{row?.original?.R4 ?? '-'}</div> },
    { accessorKey: 'R5', header: 'R5', cell: ({ row }) => <div>{row?.original?.R5 ?? '-'}</div> },
    { accessorKey: 'R6', header: 'R6', cell: ({ row }) => <div>{row?.original?.R6 ?? '-'}</div> },
    { accessorKey: 'R7', header: 'R7', cell: ({ row }) => <div>{row?.original?.R7 ?? '-'}</div> },
    { accessorKey: 'R8', header: 'R8', cell: ({ row }) => <div>{row?.original?.R8 ?? '-'}</div> },
  ];

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

      {/* Hidden Full Report for Printing */}
      {filtered.length > 0 && (
        <div id="nominal-roll-report-print" style={{ display: 'none' }}>
          {(() => {
            const ROWS_PER_PAGE = 7; // Fewer rows per page because each student has 2 rows + photo box
            const chunks = chunkArray(filtered, ROWS_PER_PAGE);
            const currentMonthYear = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase();
            const reportTitle = `BOARD EXAMINATIONS :: NOMINAL ROLL :: ${currentMonthYear}`;
            const showSummary = filters.DepartmentName === 'All';
            const totalPages = chunks.length + (showSummary ? 1 : 0);

            let pageCounter = 1;
            const output = [];

            // Add Summary Page if "All" is selected
            if (showSummary) {
              output.push(
                <ConductWrapper
                  key="summary-page"
                  mainTitle={reportTitle}
                  orientation="landscape"
                  pageNo={pageCounter++}
                  totalPages={totalPages}
                  hideHeader={true}
                  centerContent={true}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <div style={{ width: '100px' }}>
                      <img
                        src="/public/assets/images/GRT.png"
                        alt="logo"
                        style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '22px', fontWeight: '800', textTransform: 'uppercase', color: '#222' }}>
                        GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#222', marginTop: '4px' }}>
                        GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#222', marginTop: '2px' }}>
                        Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                      </div>
                    </div>
                    <div style={{ width: '100px' }}></div> {/* Spacer to maintain center alignment */}
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>
                    SUMMARY REPORT
                  </div>
                  {renderSummaryTable(filtered)}
                </ConductWrapper>
              );
            }

            // Add Student Pages
            chunks.forEach((chunk, idx) => {
              output.push(
                <ConductWrapper
                  key={`student-page-${idx}`}
                  mainTitle={reportTitle}
                  orientation="landscape"
                  pageNo={pageCounter++}
                  totalPages={totalPages}
                >
                  {renderPrintTable(chunk)}
                </ConductWrapper>
              );
            });

            return output;
          })()}
        </div>
      )}

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Nominal Roll</h6>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Filter Nominal Roll</h6>
                  <span className="text-sm fw-medium text-secondary-light">Select Semester to auto-fetch Year (1,2→Year1 | 3,4→Year2 | 5,6→Year3 | 7,8→Year4)</span>
                </div>
              </div>

              <div className="card-body p-24">
                <div className="row g-20 mb-20">
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Department Name</label>
                    <select name="DepartmentName" value={filters.DepartmentName} onChange={handleChange} className="form-select radius-8">
                      {DepartmentNames.map((ins) => <option key={ins} value={ins}>{ins}</option>)}
                    </select>
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Department Code</label>
                    <input
                      type="text"
                      name="DepartmentCode"
                      value={filters.DepartmentCode}
                      readOnly
                      className="form-control radius-8"
                      placeholder="Auto-fetched"
                    />
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Semester</label>
                    <select name="semester" value={filters.semester} onChange={handleChange} className="form-select radius-8">
                      {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Year</label>
                    <input
                      type="text"
                      name="year"
                      value={filters.year}
                      readOnly
                      className="form-control radius-8"
                      placeholder="Auto-fetched"
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-outline-success radius-8 px-20 py-11"
                        onClick={handlePrint}
                        disabled={filtered.length === 0}
                      >
                        <i className="fas fa-print me-2"></i>
                        Print Report
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                        onClick={() => {
                          setFilters({ ...DEFAULT_FILTERS });
                          toast.success('Filters cleared');
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <DataTable
                data={filtered}
                columns={columns}
                loading={false}
                error={null}
                title={'Nominal Roll'}
                enableActions={false}
                enableExport={false}
                enableSelection={false}
                pageSize={10}
              />
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default NominalRoll;
