import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef
} from "react";

import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import DataTable from '../../../../../components/DataTable/DataTable';
import { Toaster, toast } from 'react-hot-toast';

/* ---------------- CONSTANTS ---------------- */

const SEMS = ['1', '2', '3', '4', '5', '6'];

/* Initial form state (keeps shape consistent like StaffDetails.jsx) */
const INITIAL_FORM_STATE = {
  department: '',
  sem: '',
  eqc: '',
  subject: ''
};

/* ---------------- COMPONENT ---------------- */

const PracticalNameList = () => {

  /* ---------- STATE ---------- */
  /* ---------- FORM STATE ---------- */
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  /* helper: reset form to initial shape */
  const handleReset = useCallback(() => setForm(INITIAL_FORM_STATE), []);

  const [showDetails, setShowDetails] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [practicalData, setPracticalData] = useState([]);

  /* ---------- HELPERS ---------- */

  const handleChange = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  /* ---------- LOAD PRACTICAL TIMETABLE DATA ---------- */

  useEffect(() => {
    let cancelled = false;

    const loadPracticalData = async () => {
      try {
        const res = await fetch('/api/practicalTimetable');
        if (res.ok) {
          const data = await res.json();
          const dataArray = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []);

          if (!cancelled) {
            setPracticalData(dataArray);

            // Extract unique departments
            const uniqueDepts = [...new Set(dataArray.map(item => item.Department || item.Dept_Name || ''))].filter(Boolean);
            setDepartments(uniqueDepts);
          }
        }
      } catch (err) {
        console.error('Error loading practical timetable data:', err);
      }
    };

    loadPracticalData();
    return () => { cancelled = true; };
  }, []);

  /* ---------- GENERATE TABLE FROM FILTERED DATA ---------- */

  const handleGenerate = useCallback(() => {
    if (!form.department || !form.sem) {
      toast.error('Please select Department & Semester');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Filter practical data based on selected department and semester
      const filtered = (practicalData || []).filter(item => {
        const itemDept = item.Department || item.Dept_Name || '';
        const itemSem = String(item.Semester || item.semester || item.Sem || '');

        return String(itemDept).toLowerCase() === String(form.department).toLowerCase() &&
          itemSem === String(form.sem);
      });

      // Transform to table rows
      const rows = (filtered || []).map((item, i) => ({
        _index: i + 1,
        Semester: item.Semester || item.semester || form.sem || '',
        Department: item.Department || item.Dept_Name || form.department || '',
        Subject: item.Subject || item.Sub_Name || item.subject_name || 'N/A',
        RegularCount: item.Regular_Count || item.regular_count || 0,
        ArrearCount: item.Arrear_Count || item.arrear_count || 0,
        StudentCount: (item.Regular_Count || item.regular_count || 0) + (item.Arrear_Count || item.arrear_count || 0),
        raw: item
      }));

      setTableData(rows);
      setShowDetails(true);
      toast.success('Practical details loaded successfully');
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error('Failed to load practical details');
    } finally {
      setLoading(false);
    }

  }, [form.department, form.sem, practicalData]);

  /* ---------- DATATABLE COLUMNS ---------- */

  const studentColumns = useMemo(() => [
    { accessorKey: '_index', header: 'S.NO' },
    { accessorKey: 'Semester', header: 'Sem' },
    { accessorKey: 'Department', header: 'Department' },
    { accessorKey: 'Subject', header: 'Subject Name' },
    { accessorKey: 'RegularCount', header: 'Regular Count' },
    { accessorKey: 'ArrearCount', header: 'Arrear Count' },
    { accessorKey: 'StudentCount', header: 'Total Students' },
  ], []);

  /* ---------- PRINT PRACTICAL PANEL REPORT ---------- */

  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  const buildReportHTML = useCallback((rows) => {
    const rowsPerPage = 10;
    const totalPages = Math.ceil((rows || []).length / rowsPerPage);
    let fullHtml = '';

    for (let i = 0; i < totalPages; i++) {
      const pageData = rows.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
      let tableRows = '';

      // Data rows
      pageData.forEach((r, idx) => {
        const globalIdx = i * rowsPerPage + idx + 1;
        const course = r.raw?.Course || r.raw?.Dept_Name || form.department || '';
        const subCode = r.raw?.Sub_Code || r.raw?.SubCode || r.raw?.sub_code || r.Subject || '';
        const subName = r.raw?.Sub_Name || r.raw?.SubName || r.raw?.Sub_name || r.Subject || '';
        tableRows += `
          <tr style="height: 34px;">
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${globalIdx}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${course}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${form.sem}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${subCode}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px;">${subName}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">R</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${r.StudentCount || 1}</td>
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
              PRACTICAL PANEL REPORT
            </div>

            <div style="margin-bottom: 10px; font-size: 11px;">
              <b>Department:</b> ${form.department} &nbsp;&nbsp; <b>Semester:</b> ${form.sem || 'N/A'}
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; table-layout: fixed;">
              <thead>
                <tr style="background-color: #f2f2f2; height: 32px;">
                  <th style="border: 1.5px solid #000; width: 6%; font-size: 10px; text-align: center;">SNo</th>
                  <th style="border: 1.5px solid #000; width: 15%; font-size: 10px; text-align: center;">Course</th>
                  <th style="border: 1.5px solid #000; width: 8%; font-size: 10px; text-align: center;">Sem</th>
                  <th style="border: 1.5px solid #000; width: 12%; font-size: 10px; text-align: center;">SubCode</th>
                  <th style="border: 1.5px solid #000; width: 34%; font-size: 10px; text-align: center;">Subject Name</th>
                  <th style="border: 1.5px solid #000; width: 10%; font-size: 10px; text-align: center;">Type</th>
                  <th style="border: 1.5px solid #000; width: 15%; font-size: 10px; text-align: center;">Candidate</th>
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

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Practical Panel Report</title>
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
    `;

    return html;
  }, [form]);

  const handlePrintNow = useCallback((html) => {
    try {
      // Prefer printing from the preview iframe so styles are isolated
      const frame = previewRef.current;
      if (frame && frame.contentWindow) {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        return;
      }

      // Fallback: open new window
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Unable to open print window (popup blocked)');
        return;
      }
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
    } catch (err) {
      console.error(err);
      toast.error('Print failed');
    }
  }, []);

  /* ---------- JSX ---------- */

  return (
    <>
      <Toaster position="top-right" />
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-main-body">
          <h6>Practical Panel</h6>

          {/* FILTER PANEL */}
          <div className="card p-24">
            <div className="row g-20">

              <div className="col-lg-3">
                <label>Department</label>
                <select className="form-select"
                  value={form.department}
                  onChange={e => handleChange('department', e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(dept =>
                    <option key={dept} value={dept}>{dept}</option>
                  )}
                </select>
              </div>

              <div className="col-lg-3">
                <label>Semester</label>
                <select className="form-select"
                  value={form.sem}
                  onChange={e => handleChange('sem', e.target.value)}>
                  <option value="">Select</option>
                  {SEMS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="col-lg-3 d-flex align-items-end">
                <div>
                  <button className="btn btn-primary me-2" onClick={handleGenerate}>
                    VIEW
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => {
                    if (!tableData || tableData.length === 0) {
                      toast.error('Generate the details first to preview the report');
                      return;
                    }
                    setPreviewHtml(buildReportHTML(tableData));
                    setShowPreview(true);
                  }}>
                    Print
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* TABLE */}
          {showDetails && (
            <div className="card mt-3">
              <div className="card-body">
                <DataTable
                  data={tableData}
                  columns={studentColumns}
                  loading={loading}
                  error={error}
                  enableActions={false}
                />
              </div>
            </div>
          )}

          {/* PREVIEW PANEL (in-page) */}
          {showPreview && (
            <div className="card mt-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Print Preview</h6>
                  <div>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handlePrintNow(previewHtml)}>
                      Print Now
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowPreview(false)}>
                      Close Preview
                    </button>
                  </div>
                </div>
                <div className="report-preview">
                  <iframe
                    title="Practical Panel Preview"
                    ref={previewRef}
                    srcDoc={previewHtml}
                    style={{ width: '100%', minHeight: '600px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        <Footer />
      </div>
    </>
  );
};

export default PracticalNameList;