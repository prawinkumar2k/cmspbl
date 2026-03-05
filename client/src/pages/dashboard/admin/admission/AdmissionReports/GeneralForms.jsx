import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import DataTable from '../../../../../components/DataTable/DataTable';
import { Icon } from '@iconify/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * General Forms Report Generator - Professional Print-Ready Reports
 * - Professional letterhead with institution details- [x] Research existing reports in `GeneralForms.jsx` <!-- id: 0 -->
- [x] Create multi-page report generator for list-based forms (A, B, F3) <!-- id: 1 -->
- [x] Update aggregated forms (C, D, F1, F2) to match design <!-- id: 2 -->
- [x] Standardize header and signature block <!-- id: 3 -->
- [/] Update UI buttons and filters to match modern design <!-- id: 4 -->
- Responsive filter interface with department, semester, and mode of join selection
 * - Integrated data table view of filtered students
 */

/* -------------------------
   Constants & sample data
   ------------------------- */
const emptyFilters = {
  department: '',
  sem: '',
  modeOfJoin: '',
  confirmed: true
};

const normalize = (val) => (val === undefined || val === null ? '' : String(val).trim());
const normalizeLower = (val) => normalize(val).toLowerCase();
const pickField = (row, keys) => {
  for (const key of keys) {
    if (row && row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return row[key];
    }
  }
  return '';
};

const statusIsConfirmed = (row) => {
  const status = normalizeLower(pickField(row, ['Admission_Status', 'status', 'Current_Status']));
  return ['confirm', 'confirmed', 'admitted', 'admission confirmed', 'active'].includes(status);
};

// Helper to get qualification from database with fallback options
const getQualification = (row) => {
  return pickField(row, ['Qualification', 'qualification', 'Qualification_Type', 'Quota', 'quota', 'Category', 'category']) || 'N/A';
};

// Removed SAMPLE_METADATA and SAMPLE_STUDENTS, will use API data

/* -------------------------
   Enhanced print helper using TC.jsx A4 format
   - Exact A4 dimensions (210mm x 297mm)
   - Professional fixed positioning
   - Proper media query handling with !important flags
   ------------------------- */
const printElementById = (id, title = '') => {
  const contentEl = document.getElementById(id);
  if (!contentEl) {
    alert('Content not found');
    return;
  }

  const printStyle = document.createElement("style");
  printStyle.id = `print-${id}-style`;
  printStyle.textContent = `
    @page { size: A4 portrait; margin: 0; }
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100%;
      }

      /* hide everything first */
      body * { visibility: hidden !important; }

      /* show only report container and its children */
      #${id}, #${id} * { visibility: visible !important; }

      /* position report at exact page origin */
      #${id} {
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

      /* hide UI */
      .navbar, .footer, .sidebar, .card, button, .btn { display: none !important; }
    }
  `;
  document.head.appendChild(printStyle);

  // Wait for images to load then print
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
    try { await waitForImages(id, 1200); } catch (e) { /* ignore */ }
    window.print();
    setTimeout(() => {
      const el = document.getElementById(`print-${id}-style`);
      if (el) el.remove();
    }, 1000);
  }, 120);
};

/* -------------------------
   Conduct-style Report Wrapper - Optimized for A4 Print Format
   - Professional letterhead with logo left and institution title centered
   - Proper A4 spacing and margins
   - Watermark support
   - Footer contact/trust info at bottom
   ------------------------- */
const ConductWrapper = ({ id, mainTitle, meta = {}, children, printTitle, subtitle }) => {
  return (
    <div
      id={id}
      style={{
        background: '#fff',
        padding: 12,
        marginBottom: 24,
        width: '297mm',
        minHeight: '190.5mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: 13,
        color: '#000',
        position: 'relative',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '1px solid #ddd'
      }}
    >
      <div style={{ position: 'relative', padding: '12px', border: '2px solid #000', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>

        {/* Letterhead */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, gap: 10 }}>
          <div style={{ width: 80, textAlign: 'center', flexShrink: 0 }}>
            <img src="/assets/images/GRT.png" alt="logo" style={{ width: 80, height: 80, objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.5px', color: '#000', lineHeight: 1.1 }}>
              GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#000', lineHeight: 1.2, marginTop: 2 }}>
              GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
            </div>
            <div style={{ fontSize: 10, color: '#000', lineHeight: 1.2 }}>
              Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
            </div>
          </div>
        </div>

        {/* Report Title */}
        <div style={{ textAlign: 'center', margin: '10px 0', fontWeight: 900, fontSize: 15, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {mainTitle}
        </div>

        <div style={{ marginBottom: 8, fontSize: 11 }}>
          <div><b>INSTITUTION CODE:</b> 858</div>
          <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* Footer Signature */}
        <div style={{ marginTop: 'auto', paddingTop: 15, textAlign: 'right', fontSize: 11, paddingRight: 20 }}>
          <div style={{ fontWeight: 'bold' }}>PRINCIPAL</div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   FORM components that use ConductWrapper
   (for brevity these are simplified forms showing how content will be placed)
   ------------------------- */


// Removed all MOCK_FORM_X_ROWS, will use API data

/* FORM A (Admission list) - adapted to conduct style */
const FormA = ({ rows = [], meta = {}, onClose = () => { } }) => {
  return (
    <ConductWrapper
      id="conduct-formA-preview"
      mainTitle="ADMISSION LIST (FORM - A)"
      meta={meta}
      printTitle="Admission Form A"
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '3%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>Sl</th>
              <th style={{ width: '7%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>REG NO</th>
              <th style={{ width: '13%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>NAME</th>
              <th style={{ width: '4%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>SEX</th>
              <th style={{ width: '6%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>COMM</th>
              <th style={{ width: '7%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>DOB</th>
              <th style={{ width: '5%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>QUAL</th>
              <th style={{ width: '6%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>YR PASS</th>
              <th style={{ width: '4%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>MAT</th>
              <th style={{ width: '4%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>SCI</th>
              <th style={{ width: '4%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>ENG</th>
              <th style={{ width: '5%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 10).map((r, idx) => (
              <tr key={idx} style={{ height: '34px' }}>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{idx + 1}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Register_Number', 'register_number', 'Reg_No']) || '-'}</td>
                <td style={{ textAlign: 'left', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Student_Name', 'name', 'Name']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Gender', 'Sex', 'sex']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Community', 'community']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Dob', 'DOB', 'dob', 'Date_Of_Birth']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{getQualification(r) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['HSC_Year_Of_Passing', 'HSCYearOfPassing', 'YearOfPassing', 'year_pass', 'Year_Pass', 'Passing_Year']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['HSC_Subject1_Marks', 'Maths_Marks', 'mat']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['HSC_Subject2_Marks', 'Science_Marks', 'sci']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['HSC_Subject3_Marks', 'English_Marks', 'eng']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4, fontWeight: 'bold' }}>{pickField(r, ['TotalMarks', 'total_marks', 'Total_Marks', 'Total']) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 10 && <div className="text-muted mt-1 small text-center">* Preview limited to first 10 records. Print full report for all pages.</div>}
      </div>
    </ConductWrapper>
  );
};

const FormB = ({ rows = [], meta = {}, onClose = () => { } }) => {
  return (
    <ConductWrapper id="conduct-formB-preview" mainTitle="'B' FORM (CATEGORY-WISE ALLOCATION)" meta={meta} printTitle="Form B">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '4%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>Sl</th>
              <th style={{ width: '10%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>REG NO</th>
              <th style={{ width: '15%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>NAME</th>
              <th style={{ width: '4%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>SEX</th>
              <th style={{ width: '8%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>COMM</th>
              <th style={{ width: '12%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>AADHAAR NO</th>
              <th style={{ width: '8%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>QUAL</th>
              <th style={{ width: '8%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>TOTAL</th>
              <th style={{ width: '8%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>DOB</th>
              <th style={{ width: '10%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>INCOME</th>
              <th style={{ width: '8%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>STATE</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 10).map((r, idx) => (
              <tr key={idx} style={{ height: '34px' }}>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{idx + 1}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Register_Number', 'register_number', 'Reg_No']) || '-'}</td>
                <td style={{ textAlign: 'left', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Student_Name', 'name', 'Name']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Gender', 'Sex', 'sex']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Community', 'community']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Aadhaar_No', 'aadhaar_no', 'Aadhar']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{getQualification(r) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4, fontWeight: 'bold' }}>{pickField(r, ['HSC_Total_Marks_Obtained', 'hsc_total_marks_obtained', 'TotalMarks', 'total_marks', 'Total_Marks', 'Total']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Dob', 'DOB', 'dob', 'Date_Of_Birth']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Father_Annual_Income', 'Family_Income', 'income']) || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{pickField(r, ['Permanent_State', 'State', 'state']) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 10 && <div className="text-muted mt-2 small text-center">* Preview limited to first 10 records. Print full report for all pages.</div>}
      </div>
    </ConductWrapper>
  );
};

// Categories for FormC (Branch x Category allocation report)
const FORM_C_CATEGORIES = [
  "OC",
  "BC",
  "BC(M)",
  "MBC/DNC",
  "SC",
  "SCA",
  "ST",
];

const normalizeBranchForFormC = (name = "") => {
  if (!name) return "UNKNOWN";
  const t = name.toUpperCase();
  if (t.includes("CIVIL")) return "CIVIL";
  if (t.includes("MECH")) return "MECHANICAL";
  if (t.includes("ELECTRICAL") || t.includes("EEE") || t.includes("ELECT")) return "ELECTRICAL";
  if (t.includes("ECE")) return "ECE";
  if (t.includes("CSE") || t.includes("COMPUTER")) return "CSE";
  return t;
};

const mapCategoryForFormC = (caste = "") => {
  if (!caste) return "OC";
  const t = caste.toString().toUpperCase();
  if (t.includes("BC(M)") || t.includes("MUSLIM")) return "BC(M)";
  if (t.includes("BC")) return "BC";
  if (t.includes("MBC") || t.includes("DNC")) return "MBC/DNC";
  if (t.includes("SCA")) return "SCA";
  if (t.includes("SC")) return "SC";
  if (t.includes("ST")) return "ST";
  return "OC";
};

const zeroCountsForFormC = () => {
  const obj = {};
  FORM_C_CATEGORIES.forEach((cat) => {
    obj[cat] = { B: 0, G: 0 };
  });
  obj.total = { B: 0, G: 0 };
  return obj;
};

const FormC = ({ rows = [], meta = {}, onClose = () => { } }) => {
  const tableData = {};
  const seenBranches = new Set();
  const categories = ["OC", "BC", "BC(M)", "MBC/DNC", "SC", "SCA", "ST"];

  rows.forEach((s) => {
    const branch = normalizeBranchForFormC(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
    if (!tableData[branch]) {
      tableData[branch] = {};
      categories.forEach(cat => tableData[branch][cat] = { B: 0, G: 0 });
      tableData[branch].total = { B: 0, G: 0 };
    }
    seenBranches.add(branch);
    const category = mapCategoryForFormC(pickField(s, ['Caste', 'Community', 'Quota', 'Allocated_Quota', 'Category']));
    const gender = pickField(s, ['Gender', 'Sex', 'sex']).toString().toUpperCase().startsWith("F") ? "G" : "B";
    if (!tableData[branch][category]) tableData[branch][category] = { B: 0, G: 0 };
    tableData[branch][category][gender]++;
    tableData[branch].total[gender]++;
  });

  const branchNames = Object.keys(tableData).sort();
  const grandTotals = { total: { B: 0, G: 0 } };
  categories.forEach(cat => grandTotals[cat] = { B: 0, G: 0 });

  branchNames.forEach(bn => {
    categories.forEach(cat => {
      grandTotals[cat].B += tableData[bn][cat].B;
      grandTotals[cat].G += tableData[bn][cat].G;
    });
    grandTotals.total.B += tableData[bn].total.B;
    grandTotals.total.G += tableData[bn].total.G;
  });

  return (
    <ConductWrapper id="conduct-formC-preview" mainTitle="FORM - C (CATEGORY-WISE ALLOCATION)" meta={meta} printTitle="Form C">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: '30px', border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>SL</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>DEPARTMENT</th>
              {categories.map(cat => (
                <th colSpan={2} key={cat} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>{cat}</th>
              ))}
              <th colSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>TOTAL</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>GRAND TOTAL</th>
            </tr>
            <tr>
              {categories.map(cat => (
                <React.Fragment key={cat}>
                  <th style={{ border: '1.5px solid #000', padding: 4, width: 25, backgroundColor: '#f2f2f2' }}>B</th>
                  <th style={{ border: '1.5px solid #000', padding: 4, width: 25, backgroundColor: '#f2f2f2' }}>G</th>
                </React.Fragment>
              ))}
              <th style={{ border: '1.5px solid #000', padding: 4, width: 25, backgroundColor: '#f2f2f2' }}>B</th>
              <th style={{ border: '1.5px solid #000', padding: 4, width: 25, backgroundColor: '#f2f2f2' }}>G</th>
            </tr>
          </thead>
          <tbody>
            {branchNames.map((bn, idx) => {
              const r = tableData[bn];
              return (
                <tr key={bn} style={{ height: '30px' }}>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{idx + 1}</td>
                  <td style={{ textAlign: 'left', border: '1.5px solid #000', padding: 4 }}>{bn}</td>
                  {categories.map(cat => (
                    <React.Fragment key={cat}>
                      <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r[cat].B}</td>
                      <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r[cat].G}</td>
                    </React.Fragment>
                  ))}
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.total.B}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.total.G}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4, fontWeight: 'bold' }}>{r.total.B + r.total.G}</td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2', height: '30px' }}>
              <td colSpan={2} style={{ border: '1.5px solid #000', padding: 4 }}>TOTAL</td>
              {categories.map(cat => (
                <React.Fragment key={cat}>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals[cat].B}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals[cat].G}</td>
                </React.Fragment>
              ))}
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.total.B}</td>
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.total.G}</td>
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.total.B + grandTotals.total.G}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ConductWrapper>
  );
};

// Form D helper functions and constants
const FORM_D_QUOTAS = [
  { key: "OC", label: "OC", percentage: "31.3%" },
  { key: "BC", label: "BC(Other)", percentage: "26.5%" },
  { key: "BC(M)", label: "BC(Muslim)", percentage: "3.5%" },
  { key: "MBC/DNC", label: "MBC/DNC", percentage: "20%" },
  { key: "SC", label: "SC", percentage: "15%" },
  { key: "SCA", label: "SCA", percentage: "3%" },
  { key: "ST", label: "ST", percentage: "1%" },
];

const DEFAULT_SANCTION_INTAKE = {
  "CIVIL": 60,
  "MECHANICAL": 120,
  "ELECTRICAL": 60,
  "ECE": 60,
  "CSE": 60,
};

const normalizeBranchForFormD = (name = "") => {
  if (!name) return "UNKNOWN";
  const t = name.toString().toUpperCase();
  if (t.includes("CIVIL")) return "CIVIL";
  if (t.includes("MECH")) return "MECHANICAL";
  if (t.includes("ELECTRICAL") || t.includes("EEE") || t.includes("ELECT")) return "ELECTRICAL";
  if (t.includes("ECE")) return "ECE";
  if (t.includes("CSE") || t.includes("COMPUTER")) return "CSE";
  return t.trim();
};

const normalizeQuotaForFormD = (q = "") => {
  if (!q) return "OC";
  const t = q.toString().toUpperCase();
  if (t.includes("BC(M)")) return "BC(M)";
  if (t.includes("BC") && !t.includes("BC(M)")) return "BC";
  if (t.includes("MBC") || t.includes("DNC")) return "MBC/DNC";
  if (t.includes("SC(ARUN)") || t.includes("SCA")) return "SCA";
  if (t.includes("SC") && !t.includes("SC(ARUN)") && !t.includes("SCA")) return "SC";
  if (t.includes("ST")) return "ST";
  if (t.includes("MG") || t.includes("MANAGEMENT")) return "MANAGEMENT";
  if (t.includes("GOI") || t.includes("GOVT OF INDIA")) return "GOVT_OF_INDIA";
  return "OC";
};

const FormD = ({ rows = [], meta = {}, onClose = () => { } }) => {
  const quotas = [
    { key: "OC", label: "OC" },
    { key: "BC", label: "BC" },
    { key: "BC(M)", label: "BC(M)" },
    { key: "MBC/DNC", label: "MBC/DNC" },
    { key: "SC", label: "SC" },
    { key: "SCA", label: "SCA" },
    { key: "ST", label: "ST" },
  ];
  const map = {};
  const order = ["CIVIL", "MECHANICAL", "ELECTRICAL", "ECE", "CSE"];

  rows.forEach((s) => {
    const branch = normalizeBranchForFormD(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
    if (!map[branch]) {
      map[branch] = { branch, sanctioned: DEFAULT_SANCTION_INTAKE[branch] || 0, counts: {}, management: 0, govtOfIndia: 0, totalAdmitted: 0 };
      quotas.forEach(q => map[branch].counts[q.key] = 0);
    }

    // Primary categorization by community/caste
    const commRaw = pickField(s, ['Community', 'community', 'Caste', 'caste', 'Category', 'category']);
    const quota = normalizeQuotaForFormD(commRaw);

    if (quotas.find(q => q.key === quota)) {
      map[branch].counts[quota]++;
    } else {
      map[branch].counts["OC"]++;
    }

    // Secondary tracking for MGMT / GOI
    const quotaTypeRaw = pickField(s, ['Quota', 'quota', 'Allocated_Quota']);
    const quotaType = normalizeQuotaForFormD(quotaTypeRaw);
    if (quotaType === "MANAGEMENT") map[branch].management++;
    else if (quotaType === "GOVT_OF_INDIA") map[branch].govtOfIndia++;

    map[branch].totalAdmitted++;
  });

  const ordered = order.filter(k => map[k]).concat(Object.keys(map).filter(k => !order.includes(k)));
  const totals = { sanctioned: 0, counts: {}, management: 0, govtOfIndia: 0, totalAdmitted: 0 };
  quotas.forEach(q => totals.counts[q.key] = 0);

  return (
    <ConductWrapper id="conduct-formD-preview" mainTitle="FORM - D (QUALIFICATION-WISE ALLOCATION)" meta={meta} printTitle="Form D">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>SL</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>DEPARTMENT</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>INTAKE</th>
              <th colSpan={quotas.length} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>GOVT QUOTA</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>MGMT</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>GOI</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>TOTAL</th>
            </tr>
            <tr>
              {quotas.map(q => (
                <th key={q.key} style={{ border: '1.5px solid #000', padding: 4, fontSize: 9, backgroundColor: '#f2f2f2' }}>{q.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordered.map((bn, idx) => {
              const r = map[bn];
              totals.sanctioned += r.sanctioned;
              totals.management += r.management;
              totals.govtOfIndia += r.govtOfIndia;
              totals.totalAdmitted += r.totalAdmitted;
              return (
                <tr key={bn} style={{ height: '30px' }}>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{idx + 1}</td>
                  <td style={{ textAlign: 'left', border: '1.5px solid #000', padding: 4 }}>{bn}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.sanctioned}</td>
                  {quotas.map(q => {
                    totals.counts[q.key] += r.counts[q.key];
                    return <td key={q.key} style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.counts[q.key]}</td>;
                  })}
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.management}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.govtOfIndia}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4, fontWeight: 'bold' }}>{r.totalAdmitted}</td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2', height: '30px' }}>
              <td colSpan={2} style={{ border: '1.5px solid #000', padding: 4 }}>TOTAL</td>
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{totals.sanctioned}</td>
              {quotas.map(q => <td key={q.key} style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{totals.counts[q.key]}</td>)}
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{totals.management}</td>
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{totals.govtOfIndia}</td>
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{totals.totalAdmitted}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ConductWrapper>
  );
};

// Form F1 helper functions and constants
const FORM_F1_RELIGIONS = ["HINDU", "MUSLIM", "CHRISTIAN", "JAIN", "OTHERS"];

const DEFAULT_BRANCHES_F1 = [
  { key: "CIVIL", label: "CIVIL ENGINEERING (FULL TIME)", sanctioned: 60 },
  { key: "MECHANICAL", label: "MECHANICAL ENGINEERING (FULL TIME)", sanctioned: 120 },
  { key: "ELECTRICAL", label: "ELECTRICAL AND ELECTRONICS ENGINEERING (FULL TIME)", sanctioned: 60 },
  { key: "ECE", label: "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)", sanctioned: 60 },
  { key: "CSE", label: "COMPUTER ENGINEERING (FULL TIME)", sanctioned: 60 },
];

const normalizeBranchForFormF1 = (name = "") => {
  if (!name) return "UNKNOWN";
  const t = name.toString().toUpperCase();
  if (t.includes("CIVIL")) return "CIVIL";
  if (t.includes("MECH")) return "MECHANICAL";
  if (t.includes("ELECTRICAL") || t.includes("EEE")) return "ELECTRICAL";
  if (t.includes("ECE")) return "ECE";
  if (t.includes("CSE") || t.includes("COMPUTER")) return "CSE";
  return t.trim();
};

const normalizeReligionForFormF1 = (r = "") => {
  if (!r) return "OTHERS";
  const t = r.toString().toUpperCase();
  if (t.includes("HINDU")) return "HINDU";
  if (t.includes("MUSLIM") || t.includes("ISLAM")) return "MUSLIM";
  if (t.includes("CHRIST")) return "CHRISTIAN";
  if (t.includes("JAIN")) return "JAIN";
  return "OTHERS";
};

const FormF1 = ({ rows = [], meta = {}, onClose = () => { } }) => {
  const religions = ["HINDU", "MUSLIM", "CHRISTIAN", "JAIN", "OTHERS"];
  const map = {};
  const order = ["CIVIL", "MECHANICAL", "ELECTRICAL", "ECE", "CSE"];

  rows.forEach((s) => {
    const branchKey = normalizeBranchForFormF1(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
    if (!map[branchKey]) {
      map[branchKey] = { label: branchKey, counts: {}, totalB: 0, totalG: 0 };
      religions.forEach(rel => map[branchKey].counts[rel] = { B: 0, G: 0 });
    }
    const religion = normalizeReligionForFormF1(pickField(s, ['Religion', 'religion', 'Caste', 'Community']));
    const gender = pickField(s, ['Gender', 'Sex', 'sex']).toString().toLowerCase().startsWith("f") ? "G" : "B";
    map[branchKey].counts[religion][gender]++;
    if (gender === "B") map[branchKey].totalB++; else map[branchKey].totalG++;
  });

  const ordered = order.filter(k => map[k]).concat(Object.keys(map).filter(k => !order.includes(k)));
  const grandTotals = { byRel: {}, totalB: 0, totalG: 0 };
  religions.forEach(rel => grandTotals.byRel[rel] = { B: 0, G: 0 });

  return (
    <ConductWrapper id="conduct-formF1-preview" mainTitle="FORM - F1 (RELIGIOUS MINORITY PARTICULARS)" meta={meta} printTitle="Form F1">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>SL</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>DEPARTMENT</th>
              {religions.map(rel => (
                <th colSpan={2} key={rel} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>{rel}</th>
              ))}
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>TOTAL</th>
            </tr>
            <tr>
              {religions.map(rel => (
                <React.Fragment key={rel}>
                  <th style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>B</th>
                  <th style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>G</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordered.map((bn, idx) => {
              const r = map[bn];
              grandTotals.totalB += r.totalB;
              grandTotals.totalG += r.totalG;
              return (
                <tr key={bn} style={{ height: '30px' }}>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{idx + 1}</td>
                  <td style={{ textAlign: 'left', border: '1.5px solid #000', padding: 4 }}>{bn}</td>
                  {religions.map(rel => {
                    grandTotals.byRel[rel].B += r.counts[rel].B;
                    grandTotals.byRel[rel].G += r.counts[rel].G;
                    return (
                      <React.Fragment key={rel}>
                        <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.counts[rel].B}</td>
                        <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.counts[rel].G}</td>
                      </React.Fragment>
                    );
                  })}
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4, fontWeight: 'bold' }}>{r.totalB + r.totalG}</td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2', height: '30px' }}>
              <td colSpan={2} style={{ border: '1.5px solid #000', padding: 4 }}>TOTAL</td>
              {religions.map(rel => (
                <React.Fragment key={rel}>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.byRel[rel].B}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.byRel[rel].G}</td>
                </React.Fragment>
              ))}
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.totalB + grandTotals.totalG}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ConductWrapper>
  );
};

// Form F2 helper functions and constants
const FORM_F2_LANGUAGES = ["TELUGU", "TAMIL", "MALAYALAM", "HINDI", "OTHERS"];

const DEFAULT_BRANCHES_F2 = [
  { key: "CIVIL", label: "CIVIL ENGINEERING (FULL TIME)" },
  { key: "MECHANICAL", label: "MECHANICAL ENGINEERING (FULL TIME)" },
  { key: "ELECTRICAL", label: "ELECTRICAL AND ELECTRONICS ENGINEERING (FULL TIME)" },
  { key: "ECE", label: "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)" },
  { key: "CSE", label: "COMPUTER ENGINEERING (FULL TIME)" },
];

const normalizeBranchForFormF2 = (name = "") => {
  if (!name) return "UNKNOWN";
  const t = name.toString().toUpperCase();
  if (t.includes("CIVIL")) return "CIVIL";
  if (t.includes("MECH")) return "MECHANICAL";
  if (t.includes("ELECTRICAL") || t.includes("EEE")) return "ELECTRICAL";
  if (t.includes("ECE")) return "ECE";
  if (t.includes("CSE") || t.includes("COMPUTER")) return "CSE";
  return t.trim();
};

const normalizeLanguageForFormF2 = (l = "") => {
  if (!l) return "OTHERS";
  const t = l.toString().toUpperCase();
  if (t.includes("TELUGU")) return "TELUGU";
  if (t.includes("SOWR") || t.includes("TAMIL")) return "TAMIL";
  if (t.includes("MALAY") || t.includes("MALAYALAM")) return "MALAYALAM";
  if (t.includes("HINDI")) return "HINDI";
  return "OTHERS";
};

const FormF2 = ({ rows = [], meta = {}, onClose = () => { } }) => {
  const languages = ["TELUGU", "TAMIL", "MALAYALAM", "HINDI", "OTHERS"];
  const map = {};
  const order = ["CIVIL", "MECHANICAL", "ELECTRICAL", "ECE", "CSE"];

  rows.forEach((s) => {
    const branchKey = normalizeBranchForFormF2(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
    if (!map[branchKey]) {
      map[branchKey] = { label: branchKey, counts: {}, totalB: 0, totalG: 0 };
      languages.forEach(l => map[branchKey].counts[l] = { B: 0, G: 0 });
    }
    const lang = normalizeLanguageForFormF2(pickField(s, ['Mother_Tongue', 'mother_tongue', 'MotherTongue', 'Language']));
    const gender = pickField(s, ['Gender', 'Sex', 'sex']).toString().toLowerCase().startsWith("f") ? "G" : "B";
    map[branchKey].counts[lang][gender]++;
    if (gender === "B") map[branchKey].totalB++; else map[branchKey].totalG++;
  });

  const ordered = order.filter(k => map[k]).concat(Object.keys(map).filter(k => !order.includes(k)));
  const grandTotals = { byLang: {}, totalB: 0, totalG: 0 };
  languages.forEach(l => grandTotals.byLang[l] = { B: 0, G: 0 });

  return (
    <ConductWrapper id="conduct-formF2-preview" mainTitle="FORM - F2 (LINGUISTIC MINORITY PARTICULARS)" meta={meta} printTitle="Form F2">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>SL</th>
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>DEPARTMENT</th>
              {languages.map(l => (
                <th colSpan={2} key={l} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>{l}</th>
              ))}
              <th rowSpan={2} style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>TOTAL</th>
            </tr>
            <tr>
              {languages.map(l => (
                <React.Fragment key={l}>
                  <th style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>B</th>
                  <th style={{ border: '1.5px solid #000', padding: 4, backgroundColor: '#f2f2f2' }}>G</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordered.map((bn, idx) => {
              const r = map[bn];
              grandTotals.totalB += r.totalB;
              grandTotals.totalG += r.totalG;
              return (
                <tr key={bn} style={{ height: '30px' }}>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{idx + 1}</td>
                  <td style={{ textAlign: 'left', border: '1.5px solid #000', padding: 4 }}>{bn}</td>
                  {languages.map(l => {
                    grandTotals.byLang[l].B += r.counts[l].B;
                    grandTotals.byLang[l].G += r.counts[l].G;
                    return (
                      <React.Fragment key={l}>
                        <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.counts[l].B}</td>
                        <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.counts[l].G}</td>
                      </React.Fragment>
                    );
                  })}
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4, fontWeight: 'bold' }}>{r.totalB + r.totalG}</td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2', height: '30px' }}>
              <td colSpan={2} style={{ border: '1.5px solid #000', padding: 4 }}>TOTAL</td>
              {languages.map(l => (
                <React.Fragment key={l}>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.byLang[l].B}</td>
                  <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.byLang[l].G}</td>
                </React.Fragment>
              ))}
              <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{grandTotals.totalB + grandTotals.totalG}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ConductWrapper>
  );
};

const FormF3 = ({ rows = [], meta = {}, onClose = () => { } }) => {
  const formatDateToDDMMYYYY = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d.toString();
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const detectQuota = (q) => {
    if (!q) return "";
    const t = q.toString().toUpperCase();
    if (t.includes("MANAGEMENT") || t.includes("MG") || t.includes("MQ")) return "MQ";
    if (t.includes("GOVT") || t.includes("GOVERNMENT") || t.includes("GQ") || t.includes("GOI")) return "GQ";
    return t;
  };

  const displayRows = rows.slice(0, 10).map((s) => ({
    name: pickField(s, ['Student_Name', 'name', 'student_name']),
    dob: formatDateToDDMMYYYY(pickField(s, ['Dob', 'dob', 'DOB', 'birth_date', 'birthDate'])),
    branch: pickField(s, ['Dept_Name', 'dept_name', 'Course_Name', 'course_name', 'Dept', 'branch']),
    income: pickField(s, ['Father_Annual_Income', 'Family_Income', 'family_income', 'Income_of_Parent', 'parent_income', 'income']),
    quota: detectQuota(pickField(s, ['Quota', 'quota', 'Allocated_Quota', 'allocated_quota', 'AllocatedQuota'])),
    aadhaar: pickField(s, ['Aadhaar_No', 'aadhaar_no', 'Aadhar', 'Aadhaar']),
    mobile: pickField(s, ['Student_Mobile', 'Father_Mobile', 'Mother_Mobile', 'mobile', 'Mobile_No']),
  }));

  return (
    <ConductWrapper id="conduct-formF3-preview" mainTitle="FORM - F3 (SCC - BOYS AND GIRLS STATISTICS)" meta={meta} printTitle="Form F3">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '5%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>Sl</th>
              <th style={{ width: '25%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>NAME OF STUDENT</th>
              <th style={{ width: '12%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>DOB</th>
              <th style={{ width: '15%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>AADHAAR NO</th>
              <th style={{ width: '12%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>CONTACT</th>
              <th style={{ width: '12%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>ANNUAL INCOME</th>
              <th style={{ width: '10%', border: '1.5px solid #000', padding: 4, textAlign: 'center', backgroundColor: '#f2f2f2' }}>QUOTA TYPE</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((r, i) => (
              <tr key={i} style={{ height: '34px' }}>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{i + 1}</td>
                <td style={{ textAlign: 'left', border: '1.5px solid #000', padding: 4 }}>{r.name || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.dob || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.aadhaar || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.mobile || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.income || '-'}</td>
                <td style={{ textAlign: 'center', border: '1.5px solid #000', padding: 4 }}>{r.quota || '-'}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, backgroundColor: '#f2f2f2' }}>
              <td colSpan="7" style={{ border: '1.5px solid #000', padding: 4, textAlign: 'right' }}>
                TOTAL STUDENTS: <span style={{ marginLeft: 10 }}>{rows.length}</span>
              </td>
            </tr>
          </tbody>
        </table>
        {rows.length > 10 && <div className="text-muted mt-2 small text-center">* Preview limited to first 10 records. Print full report for all pages.</div>}
      </div>
    </ConductWrapper>
  );
};

/* -------------------------
   Main page component (filters, table, and report rendering)
   ------------------------- */
const GeneralForms = () => {
  const [filters, setFilters] = useState(emptyFilters);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState('AUTO');

  const [modeOfJoinOptions, setModeOfJoinOptions] = useState([]);

  // small meta used by reports
  const [pageMeta] = useState({
    instName: 'GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH',
    subtitle: 'GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.',
    address: ' Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in',
    academicFrom: '2020',
    academicTo: '2021',
    branchList: ['CIVIL ENGINEERING (FULL TIME)', 'MECHANICAL ENGINEERING (FULL TIME)', 'ELECTRICAL AND ELECTRONICS ENGINEERING', 'ELECTRONICS AND COMMUNICATION', 'COMPUTER ENGINEERING (FULL TIME)'],
    trustTitle: 'Unity Educational and Charitable Trust',
    trustAddress: 'GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.',
    contact: 'info@grtminstitutions.com | +91 6384044100'
  });

  const loadMetadata = useCallback(async () => {
    setLoadingMeta(true);
    try {
      // Fetch student list to extract departments, semesters and mode of join
      const res = await fetch('/api/studentMaster');
      if (!res.ok) throw new Error('Failed to fetch metadata');
      const data = await res.json();
      const students = Array.isArray(data) ? data : (data.data || []);

      // Extract unique values
      const deptSet = new Set();
      const semesterSet = new Set();
      const modeSet = new Set();

      students.forEach((row) => {
        const deptLabel = pickField(row, ['Dept_Name', 'dept_name', 'Department', 'Dept']);
        if (deptLabel) deptSet.add(deptLabel);

        const sem = pickField(row, ['Semester', 'semester', 'Sem', 'sem', 'Semester_No', 'SemesterNo', 'Semester_Name']);
        if (sem) semesterSet.add(sem);

        const mode = pickField(row, ['Mode_Of_Joinig', 'ModeOfJoin', 'entry_type', 'EntryType', 'ModeOfJoining']);
        if (mode) modeSet.add(mode.toString().toUpperCase());
      });

      // Create options
      const deptOptions = Array.from(deptSet)
        .sort()
        .map((d) => ({ label: d, value: d }))
        .filter((item) => item.value);

      const semesterOptions = Array.from(semesterSet)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((s) => ({ label: s, value: normalize(s) }))
        .filter((item) => item.value !== '');

      const modeOptions = Array.from(modeSet)
        .sort()
        .map((m) => ({ label: m, value: m }))
        .filter((item) => item.value);

      setDepartments(deptOptions);
      setSemesters(semesterOptions);
      setModeOfJoinOptions(modeOptions);

      setFilters((prev) => ({
        ...prev,
        department: prev.department || 'ALL',
        sem: prev.sem || (semesterOptions[0] && semesterOptions[0].value) || '',
        modeOfJoin: prev.modeOfJoin || 'ALL'
      }));
    } catch (err) {
      console.error(err);
      console.error('Unable to load dropdown values (server)');
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  const handleFilterChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const fetchStudents = useCallback(async (source = 'AUTO') => {
    if (!filters.sem) {
      console.error('Please select semester');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/studentMaster');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      const students = Array.isArray(data) ? data : (data.data || []);

      const filtered = (students || []).filter((row) => {
        // Department filter - if "ALL" is selected, include all departments
        let deptMatch = true;
        if (filters.department && filters.department !== 'ALL') {
          deptMatch = normalizeLower(pickField(row, ['Dept_Name', 'dept_name', 'Department', 'Dept'])) === normalizeLower(filters.department);
        }

        const semValue = normalizeLower(pickField(row, ['Semester', 'semester', 'Sem', 'sem', 'Semester_No', 'SemesterNo', 'Semester_Name']));
        const semMatch = !filters.sem || semValue === normalizeLower(filters.sem);

        const modeValue = normalizeLower(pickField(row, ['Mode_Of_Joinig', 'ModeOfJoin', 'entry_type', 'EntryType', 'ModeOfJoining']));
        let modeMatch = true;
        if (filters.modeOfJoin && filters.modeOfJoin !== 'ALL') {
          modeMatch = modeValue === normalizeLower(filters.modeOfJoin);
        }

        // If confirmed is true, show only confirmed students. If false, show only unconfirmed students.
        const confirmMatch = filters.confirmed ? statusIsConfirmed(row) : !statusIsConfirmed(row);

        return deptMatch && semMatch && modeMatch && confirmMatch;
      });

      // Sort by registration number (REG001, REG002, etc.)
      const sorted = filtered.sort((a, b) => {
        const regA = pickField(a, ['Register_Number', 'register_number', 'Reg_No']);
        const regB = pickField(b, ['Register_Number', 'register_number', 'Reg_No']);

        // Extract numeric part and compare
        const numA = parseInt(regA.replace(/\D/g, '')) || 0;
        const numB = parseInt(regB.replace(/\D/g, '')) || 0;

        return numA - numB;
      });

      setRows(sorted);
      setError(null);
      setActiveForm(source);
      console.log(`${source === 'AUTO' ? 'Automatic allocation' : `${source} ready`} (${sorted.length} candidates)`);
    } catch (err) {
      console.error(err);
      setError('Failed to load candidates (server)');
      console.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFormButton = useCallback((type) => {
    fetchStudents(type);
  }, [fetchStudents]);

  const handleClose = useCallback(() => {
    setRows([]);
    setActiveForm('AUTO');
    console.log('Panel closed');
  }, []);

  const handlePrint = useCallback(() => {
    if (rows.length === 0) {
      console.error('No data to print');
      return;
    }

    const reportTitle = activeForm;
    const meta = {
      institutionCode: '858',
      instName: pageMeta.instName,
      department: filters.department === 'ALL' ? '' : filters.department,
      academicYear: `${filters.sem === '1' || filters.sem === '2' ? '2024-2025' : '2024-2025'}` // Placeholder or derived
    };

    if (activeForm === 'FORM A') {
      generateFormAReport(rows, meta);
    } else if (activeForm === 'FORM B') {
      generateFormBReport(rows, meta);
    } else if (activeForm === 'FORM C') {
      generateFormCReport(rows, meta);
    } else if (activeForm === 'FORM D') {
      generateFormDReport(rows, meta);
    } else if (activeForm === 'FORM F1') {
      generateFormF1Report(rows, meta);
    } else if (activeForm === 'FORM F2') {
      generateFormF2Report(rows, meta);
    } else if (activeForm === 'FORM F3') {
      generateFormF3Report(rows, meta);
    }
  }, [activeForm, rows, filters, pageMeta]);

  // --- Multi-page Report Generators ---

  const getCommonHeader = () => `
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; gap: 10px;">
                <div style="width: 80px; text-align: center; flex-shrink: 0;">
                  <img src="/assets/images/GRT.png" alt="logo" style="width: 80px; height: 80px; object-fit: contain;" />
                </div>
                <div style="flex: 1; text-align: center;">
                  <div style="font-size: 18px; font-weight: 900; letterSpacing: 0.5px; color: #000; line-height: 1.1;">
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
              `;

  const openPrintWindow = (html, title) => {
    const win = window.open('', '_blank');
    win.document.write(`
              <html>
                <head>
                  <title>${title}</title>
                  <style>
                    @page {size: A4 landscape; margin: 2mm; }
                    body {margin: 0; padding: 0; font-family: 'Times New Roman', serif; background: #fff; }
                    .page-container {box - sizing: border-box; }
                    .page-container:last-child {page -break-after: auto !important; }
                    * {-webkit - print - color - adjust: exact !important; print-color-adjust: exact !important; }
                    table {width: 100%; border-collapse: collapse; table-layout: fixed; }
                    th, td {border: 1.5px solid #000; padding: 4px; font-size: 11px; word-wrap: break-word; }
                    th {background - color: #f2f2f2; font-weight: bold; text-align: center; }
                  </style>
                </head>
                <body>${html}</body>
              </html>
              `);
    win.document.close();
    win.onload = () => {
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);
    };
  };

  const generateFormAReport = (data, meta) => {
    const rowsPerPage = 10;
    const totalPages = Math.ceil(data.length / rowsPerPage);
    let fullHtml = '';

    for (let i = 0; i < totalPages; i++) {
      const pageData = data.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
      let tableRows = '';

      pageData.forEach((r, idx) => {
        const globalIdx = i * rowsPerPage + idx + 1;
        tableRows += `
              <tr style="height: 34px;">
                <td style="text-align: center; width: 3%;">${globalIdx}</td>
                <td style="text-align: center; width: 7%;">${pickField(r, ['Register_Number', 'register_number', 'Reg_No']) || '-'}</td>
                <td style="text-align: left; width: 13%;">${pickField(r, ['Student_Name', 'name', 'Name']) || '-'}</td>
                <td style="text-align: center; width: 4%;">${pickField(r, ['Gender', 'Sex', 'sex']) || '-'}</td>
                <td style="text-align: center; width: 6%;">${pickField(r, ['Community', 'community']) || '-'}</td>
                <td style="text-align: center; width: 7%;">${pickField(r, ['Dob', 'DOB', 'dob', 'Date_Of_Birth']) || '-'}</td>
                <td style="text-align: center; width: 5%;">${getQualification(r) || '-'}</td>
                <td style="text-align: center; width: 6%;">${pickField(r, ['HSC_Year_Of_Passing', 'HSCYearOfPassing', 'YearOfPassing', 'year_pass', 'Year_Pass', 'Passing_Year']) || '-'}</td>
                <td style="text-align: center; width: 4%;">${pickField(r, ['HSC_Subject1_Marks', 'Maths_Marks', 'mat']) || '-'}</td>
                <td style="text-align: center; width: 4%;">${pickField(r, ['HSC_Subject2_Marks', 'Science_Marks', 'sci']) || '-'}</td>
                <td style="text-align: center; width: 4%;">${pickField(r, ['HSC_Subject3_Marks', 'English_Marks', 'eng']) || '-'}</td>
                <td style="text-align: center; width: 5%; font-weight: bold;">${pickField(r, ['TotalMarks', 'total_marks', 'Total_Marks', 'Total']) || '-'}</td>
              </tr>
              `;
      });


      fullHtml += `
              <div class="page-container" style="page-break-after: always; width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
                <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                  ${getCommonHeader()}
                  <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                    ADMISSION LIST (FORM - A)
                  </div>
                  <div style="margin-bottom: 8px; font-size: 11px;">
                    <div><b>INSTITUTION CODE:</b> 858</div>
                    <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th style="width: 3%;">Sl</th>
                        <th style="width: 7%;">REG NO</th>
                        <th style="width: 13%;">NAME</th>
                        <th style="width: 4%;">SEX</th>
                        <th style="width: 6%;">COMM</th>
                        <th style="width: 7%;">DOB</th>
                        <th style="width: 5%;">QUAL</th>
                        <th style="width: 6%;">YR PASS</th>
                        <th style="width: 4%;">MAT</th>
                        <th style="width: 4%;">SCI</th>
                        <th style="width: 4%;">ENG</th>
                        <th style="width: 5%;">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                  </table>
                  <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                    <div><b>PRINCIPAL</b></div>
                  </div>
                </div>
              </div>
              `;
    }
    openPrintWindow(fullHtml, 'Form A Report');
  };

  const generateFormBReport = (data, meta) => {
    const rowsPerPage = 10;
    const totalPages = Math.ceil(data.length / rowsPerPage);
    let fullHtml = '';

    for (let i = 0; i < totalPages; i++) {
      const pageData = data.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
      let tableRows = '';

      pageData.forEach((r, idx) => {
        const globalIdx = i * rowsPerPage + idx + 1;
        tableRows += `
              <tr style="height: 34px;">
                <td style="text-align: center; width: 4%;">${globalIdx}</td>
                <td style="text-align: center; width: 10%;">${pickField(r, ['Register_Number', 'register_number', 'Reg_No']) || '-'}</td>
                <td style="text-align: left; width: 15%;">${pickField(r, ['Student_Name', 'name', 'Name']) || '-'}</td>
                <td style="text-align: center; width: 4%;">${pickField(r, ['Gender', 'Sex', 'sex']) || '-'}</td>
                <td style="text-align: center; width: 8%;">${pickField(r, ['Community', 'community']) || '-'}</td>
                <td style="text-align: center; width: 12%;">${pickField(r, ['Aadhaar_No', 'aadhaar_no', 'Aadhar']) || '-'}</td>
                <td style="text-align: center; width: 8%;">${getQualification(r) || '-'}</td>
                <td style="text-align: center; width: 8%; font-weight: bold;">${pickField(r, ['HSC_Total_Marks_Obtained', 'hsc_total_marks_obtained', 'TotalMarks', 'total_marks', 'Total_Marks', 'Total']) || '-'}</td>
                <td style="text-align: center; width: 8%;">${pickField(r, ['Dob', 'DOB', 'dob', 'Date_Of_Birth']) || '-'}</td>
                <td style="text-align: center; width: 10%;">${pickField(r, ['Father_Annual_Income', 'Family_Income', 'income']) || '-'}</td>
                <td style="text-align: center; width: 8%;">${pickField(r, ['Permanent_State', 'State', 'state']) || '-'}</td>
              </tr>
              `;
      });


      fullHtml += `
              <div class="page-container" style="page-break-after: always; width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
                <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                  ${getCommonHeader()}
                  <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                    'B' FORM (CATEGORY-WISE ALLOCATION)
                  </div>
                  <div style="margin-bottom: 8px; font-size: 11px;">
                    <div><b>INSTITUTION CODE:</b> 858</div>
                    <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th style="width: 4%;">Sl</th>
                        <th style="width: 10%;">REG NO</th>
                        <th style="width: 15%;">NAME</th>
                        <th style="width: 4%;">SEX</th>
                        <th style="width: 8%;">COMM</th>
                        <th style="width: 12%;">AADHAAR NO</th>
                        <th style="width: 8%;">QUAL</th>
                        <th style="width: 8%;">TOTAL</th>
                        <th style="width: 8%;">DOB</th>
                        <th style="width: 10%;">INCOME</th>
                        <th style="width: 8%;">STATE</th>
                      </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                  </table>
                  <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                    <div><b>PRINCIPAL</b></div>
                  </div>
                </div>
              </div>
              `;
    }
    openPrintWindow(fullHtml, 'Form B Report');
  };

  const generateFormF3Report = (data, meta) => {
    const rowsPerPage = 10;
    const totalPages = Math.ceil(data.length / rowsPerPage);
    let fullHtml = '';

    const formatDateToDDMMYYYY = (d) => {
      if (!d) return "";
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d.toString();
      const dd = String(dt.getDate()).padStart(2, "0");
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const yyyy = dt.getFullYear();
      return `${dd}.${mm}.${yyyy}`;
    };

    const detectQuota = (q) => {
      if (!q) return "";
      const t = q.toString().toUpperCase();
      if (t.includes("MANAGEMENT") || t.includes("MG") || t.includes("MQ")) return "MQ";
      if (t.includes("GOVT") || t.includes("GOVERNMENT") || t.includes("GQ") || t.includes("GOI")) return "GQ";
      return t;
    };

    for (let i = 0; i < totalPages; i++) {
      const pageData = data.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
      let tableRows = '';

      pageData.forEach((r, idx) => {
        const globalIdx = i * rowsPerPage + idx + 1;
        const income = pickField(r, ['Father_Annual_Income', 'Family_Income', 'family_income', 'Income_of_Parent', 'parent_income', 'income']) || '-';
        const aadhaar = pickField(r, ['Aadhaar_No', 'aadhaar_no', 'Aadhar', 'Aadhaar']) || '-';
        const mobile = pickField(r, ['Student_Mobile', 'Father_Mobile', 'Mother_Mobile', 'mobile', 'Mobile_No']) || '-';

        tableRows += `
              <tr style="height: 34px;">
                <td style="text-align: center; width: 5%;">${globalIdx}</td>
                <td style="text-align: left; width: 22%;">${pickField(r, ['Student_Name', 'name', 'student_name']) || '-'}</td>
                <td style="text-align: center; width: 10%;">${formatDateToDDMMYYYY(pickField(r, ['Dob', 'dob', 'DOB', 'birth_date', 'birthDate'])) || '-'}</td>
                <td style="text-align: center; width: 18%;">${aadhaar}</td>
                <td style="text-align: center; width: 15%;">${mobile}</td>
                <td style="text-align: center; width: 15%;">${income}</td>
                <td style="text-align: center; width: 15%;">${detectQuota(pickField(r, ['Quota', 'quota', 'Allocated_Quota', 'allocated_quota', 'AllocatedQuota'])) || '-'}</td>
              </tr>
              `;
      });

      fullHtml += `
              <div class="page-container" style="page-break-after: always; width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
                <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                  ${getCommonHeader()}
                  <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                    FORM - F3 (SCC - BOYS AND GIRLS STATISTICS)
                  </div>
                  <div style="margin-bottom: 8px; font-size: 11px;">
                    <div><b>INSTITUTION CODE:</b> 858</div>
                    <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th style="width: 5%;">Sl</th>
                        <th style="width: 22%;">NAME</th>
                        <th style="width: 10%;">DOB</th>
                        <th style="width: 18%;">AADHAAR NO</th>
                        <th style="width: 15%;">CONTACT</th>
                        <th style="width: 15%;">INCOME</th>
                        <th style="width: 15%;">GQ/MQ</th>
                      </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                    ${i === totalPages - 1 ? `
                <tr style="height: 34px; font-weight: bold; background-color: #f2f2f2;">
                  <td colspan="6" style="text-align: right; padding-right: 15px; border: 1.5px solid #000;">TOTAL STUDENTS</td>
                  <td style="text-align: center; border: 1.5px solid #000;">${data.length}</td>
                </tr>
              ` : ''}
                  </table>
                  <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                    <div><b>PRINCIPAL</b></div>
                  </div>
                </div>
              </div>
              `;
    }
    openPrintWindow(fullHtml, 'Form F3 Report');
  };

  const generateFormCReport = (rows, meta) => {
    const tableData = {};
    const seenBranches = new Set();
    const categories = ["OC", "BC", "BC(M)", "MBC/DNC", "SC", "SC(Arun)", "ST"];

    rows.forEach((s) => {
      const branch = normalizeBranchForFormC(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
      if (!tableData[branch]) {
        tableData[branch] = {};
        categories.forEach(cat => tableData[branch][cat] = { B: 0, G: 0 });
        tableData[branch].total = { B: 0, G: 0 };
      }
      seenBranches.add(branch);
      const category = mapCategoryForFormC(pickField(s, ['Caste', 'Community', 'Quota', 'Allocated_Quota', 'Category']));
      const gender = pickField(s, ['Gender', 'Sex', 'sex']).toString().toUpperCase().startsWith("F") ? "G" : "B";
      if (!tableData[branch][category]) tableData[branch][category] = { B: 0, G: 0 };
      tableData[branch][category][gender]++;
      tableData[branch].total[gender]++;
    });

    const branchNames = Object.keys(tableData).sort();
    const grandTotals = { total: { B: 0, G: 0 } };
    categories.forEach(cat => grandTotals[cat] = { B: 0, G: 0 });

    branchNames.forEach(bn => {
      categories.forEach(cat => {
        grandTotals[cat].B += tableData[bn][cat].B;
        grandTotals[cat].G += tableData[bn][cat].G;
      });
      grandTotals.total.B += tableData[bn].total.B;
      grandTotals.total.G += tableData[bn].total.G;
    });

    let tableRows = '';
    branchNames.forEach((bn, idx) => {
      const r = tableData[bn];
      let catCells = '';
      categories.forEach(cat => {
        catCells += `<td style="text-align: center;">${r[cat].B}</td><td style="text-align: center;">${r[cat].G}</td>`;
      });
      tableRows += `
              <tr style="height: 30px;">
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: left;">${bn}</td>
                ${catCells}
                <td style="text-align: center;">${r.total.B}</td>
                <td style="text-align: center;">${r.total.G}</td>
                <td style="text-align: center; font-weight: bold;">${r.total.B + r.total.G}</td>
              </tr>
              `;
    });

    let gtCells = '';
    categories.forEach(cat => {
      gtCells += `<td style="text-align: center;">${grandTotals[cat].B}</td><td style="text-align: center;">${grandTotals[cat].G}</td>`;
    });

    const html = `
              <div class="page-container" style="width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
                <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                  ${getCommonHeader()}
                  <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                    FORM - C (CATEGORY-WISE ALLOCATION)
                  </div>
                  <div style="margin-bottom: 8px; font-size: 11px;">
                    <div><b>INSTITUTION CODE:</b> 858</div>
                    <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                    <div><b>ADMISSION TO FIRST YEAR DIPLOMA COURSES :: ${meta.academicYear}</b></div>
                  </div>
                  <table style="font-size: 9px;">
                    <thead>
                      <tr>
                        <th rowspan="2" style="width: 30px;">SL</th>
                        <th rowspan="2">DEPARTMENT</th>
                        ${categories.map(cat => `<th colspan="2">${cat}</th>`).join('')}
                        <th colspan="2">TOTAL</th>
                        <th rowspan="2">GRAND TOTAL</th>
                      </tr>
                      <tr>
                        ${categories.map(() => `<th>B</th><th>G</th>`).join('')}
                        <th>B</th><th>G</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${tableRows}
                      <tr style="font-weight: bold; background-color: #f2f2f2; height: 30px;">
                        <td colspan="2">TOTAL</td>
                        ${gtCells}
                        <td style="text-align: center;">${grandTotals.total.B}</td>
                        <td style="text-align: center;">${grandTotals.total.G}</td>
                        <td style="text-align: center;">${grandTotals.total.B + grandTotals.total.G}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                    <div><b>PRINCIPAL</b></div>
                  </div>
                </div>
              </div>
              `;
    openPrintWindow(html, 'Form C Report');
  };

  const generateFormDReport = (rows, meta) => {
    const quotas = [
      { key: "OC", label: "OC" },
      { key: "BC", label: "BC" },
      { key: "BC(M)", label: "BC(M)" },
      { key: "MBC/DNC", label: "MBC/DNC" },
      { key: "SC", label: "SC" },
      { key: "SCA", label: "SCA" },
      { key: "ST", label: "ST" },
    ];
    const map = {};
    const order = ["CIVIL", "MECHANICAL", "ELECTRICAL", "ECE", "CSE"];

    rows.forEach((s) => {
      const branch = normalizeBranchForFormD(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
      if (!map[branch]) {
        map[branch] = { branch, sanctioned: DEFAULT_SANCTION_INTAKE[branch] || 0, counts: {}, management: 0, govtOfIndia: 0, totalAdmitted: 0 };
        quotas.forEach(q => map[branch].counts[q.key] = 0);
      }

      const commRaw = pickField(s, ['Community', 'community', 'Caste', 'caste', 'Category', 'category']);
      const quota = normalizeQuotaForFormD(commRaw);

      if (quotas.find(q => q.key === quota)) {
        map[branch].counts[quota]++;
      } else {
        map[branch].counts["OC"]++;
      }

      const quotaTypeRaw = pickField(s, ['Quota', 'quota', 'Allocated_Quota']);
      const quotaType = normalizeQuotaForFormD(quotaTypeRaw);
      if (quotaType === "MANAGEMENT") map[branch].management++;
      else if (quotaType === "GOVT_OF_INDIA") map[branch].govtOfIndia++;

      map[branch].totalAdmitted++;
    });

    const ordered = order.filter(k => map[k]).concat(Object.keys(map).filter(k => !order.includes(k)));
    const totals = { sanctioned: 0, counts: {}, management: 0, govtOfIndia: 0, totalAdmitted: 0 };
    quotas.forEach(q => totals.counts[q.key] = 0);

    let tableRows = '';
    ordered.forEach((bn, idx) => {
      const r = map[bn];
      totals.sanctioned += r.sanctioned;
      totals.management += r.management;
      totals.govtOfIndia += r.govtOfIndia;
      totals.totalAdmitted += r.totalAdmitted;
      let quotaCells = '';
      quotas.forEach(q => {
        quotaCells += `<td style="text-align: center;">${r.counts[q.key]}</td>`;
        totals.counts[q.key] += r.counts[q.key];
      });
      tableRows += `
              <tr style="height: 30px;">
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: left;">${bn}</td>
                <td style="text-align: center;">${r.sanctioned}</td>
                ${quotaCells}
                <td style="text-align: center;">${r.management}</td>
                <td style="text-align: center;">${r.govtOfIndia}</td>
                <td style="text-align: center; font-weight: bold;">${r.totalAdmitted}</td>
              </tr>
              `;
    });

    const html = `
              <div class="page-container" style="width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
                <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                  ${getCommonHeader()}
                  <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                    FORM - D (QUALIFICATION-WISE ALLOCATION)
                  </div>
                  <div style="margin-bottom: 8px; font-size: 11px;">
                    <div><b>INSTITUTION CODE:</b> 858</div>
                    <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                  </div>
                  <table style="font-size: 10px;">
                    <thead>
                      <tr>
                        <th rowspan="2">SL</th>
                        <th rowspan="2">DEPARTMENT</th>
                        <th rowspan="2">INTAKE</th>
                        <th colspan="${quotas.length}">GOVT QUOTA</th>
                        <th rowspan="2">MGMT</th>
                        <th rowspan="2">GOI</th>
                        <th rowspan="2">TOTAL</th>
                      </tr>
                      <tr>
                        ${quotas.map(q => `<th>${q.label}</th>`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${tableRows}
                      <tr style="font-weight: bold; background-color: #f2f2f2; height: 30px;">
                        <td colspan="2">TOTAL</td>
                        <td style="text-align: center;">${totals.sanctioned}</td>
                        ${quotas.map(q => `<td style="text-align: center;">${totals.counts[q.key]}</td>`).join('')}
                        <td style="text-align: center;">${totals.management}</td>
                        <td style="text-align: center;">${totals.govtOfIndia}</td>
                        <td style="text-align: center;">${totals.totalAdmitted}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                    <div><b>PRINCIPAL</b></div>
                  </div>
                </div>
              </div>
              `;
    openPrintWindow(html, 'Form D Report');
  };

  const generateFormF1Report = (rows, meta) => {
    const religions = ["HINDU", "MUSLIM", "CHRISTIAN", "JAIN", "OTHERS"];
    const map = {};
    const order = ["CIVIL", "MECHANICAL", "ELECTRICAL", "ECE", "CSE"];

    rows.forEach((s) => {
      const branchKey = normalizeBranchForFormF1(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
      if (!map[branchKey]) {
        map[branchKey] = { label: branchKey, counts: {}, totalB: 0, totalG: 0 };
        religions.forEach(rel => map[branchKey].counts[rel] = { B: 0, G: 0 });
      }
      const religion = normalizeReligionForFormF1(pickField(s, ['Religion', 'religion', 'Caste', 'Community']));
      const gender = pickField(s, ['Gender', 'Sex', 'sex']).toString().toLowerCase().startsWith("f") ? "G" : "B";
      map[branchKey].counts[religion][gender]++;
      if (gender === "B") map[branchKey].totalB++; else map[branchKey].totalG++;
    });

    const ordered = order.filter(k => map[k]).concat(Object.keys(map).filter(k => !order.includes(k)));
    const grandTotals = { byRel: {}, totalB: 0, totalG: 0 };
    religions.forEach(rel => grandTotals.byRel[rel] = { B: 0, G: 0 });

    let tableRows = '';
    ordered.forEach((bn, idx) => {
      const r = map[bn];
      grandTotals.totalB += r.totalB;
      grandTotals.totalG += r.totalG;
      let relCells = '';
      religions.forEach(rel => {
        relCells += `<td style="text-align: center;">${r.counts[rel].B}</td><td style="text-align: center;">${r.counts[rel].G}</td>`;
        grandTotals.byRel[rel].B += r.counts[rel].B;
        grandTotals.byRel[rel].G += r.counts[rel].G;
      });
      tableRows += `
              <tr style="height: 30px;">
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: left;">${bn}</td>
                ${relCells}
                <td style="text-align: center; font-weight: bold;">${r.totalB + r.totalG}</td>
              </tr>
              `;
    });

    const html = `
              <div class="page-container" style="width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
                <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                  ${getCommonHeader()}
                  <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                    FORM - F1 (RELIGIOUS MINORITY PARTICULARS)
                  </div>
                  <div style="margin-bottom: 8px; font-size: 11px;">
                    <div><b>INSTITUTION CODE:</b> 858</div>
                    <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                  </div>
                  <table style="font-size: 10px;">
                    <thead>
                      <tr>
                        <th rowspan="2">SL</th>
                        <th rowspan="2">DEPARTMENT</th>
                        ${religions.map(rel => `<th colspan="2">${rel}</th>`).join('')}
                        <th rowspan="2">TOTAL</th>
                      </tr>
                      <tr>
                        ${religions.map(() => `<th>B</th><th>G</th>`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${tableRows}
                      <tr style="font-weight: bold; background-color: #f2f2f2; height: 30px;">
                        <td colspan="2">TOTAL</td>
                        ${religions.map(rel => `<td style="text-align: center;">${grandTotals.byRel[rel].B}</td><td style="text-align: center;">${grandTotals.byRel[rel].G}</td>`).join('')}
                        <td style="text-align: center;">${grandTotals.totalB + grandTotals.totalG}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                    <div><b>PRINCIPAL</b></div>
                  </div>
                </div>
              </div>
              `;
    openPrintWindow(html, 'Form F1 Report');
  };

  const generateFormF2Report = (rows, meta) => {
    const languages = ["TELUGU", "TAMIL", "MALAYALAM", "HINDI", "OTHERS"];
    const map = {};
    const order = ["CIVIL", "MECHANICAL", "ELECTRICAL", "ECE", "CSE"];

    rows.forEach((s) => {
      const branchKey = normalizeBranchForFormF2(pickField(s, ['Dept_Name', 'dept_name', 'Department', 'Dept', 'Course_Name']));
      if (!map[branchKey]) {
        map[branchKey] = { label: branchKey, counts: {}, totalB: 0, totalG: 0 };
        languages.forEach(lang => map[branchKey].counts[lang] = { B: 0, G: 0 });
      }
      const lang = normalizeLanguageForFormF2(pickField(s, ['Mother_Tongue', 'mother_tongue', 'MotherTongue', 'Language']));
      const gender = pickField(s, ['Gender', 'Sex', 'sex']).toString().toLowerCase().startsWith("f") ? "G" : "B";
      map[branchKey].counts[lang][gender]++;
      if (gender === "B") map[branchKey].totalB++; else map[branchKey].totalG++;
    });

    const ordered = order.filter(k => map[k]).concat(Object.keys(map).filter(k => !order.includes(k)));
    const grandTotals = { byLang: {}, totalB: 0, totalG: 0 };
    languages.forEach(lang => grandTotals.byLang[lang] = { B: 0, G: 0 });

    let tableRows = '';
    ordered.forEach((bn, idx) => {
      const r = map[bn];
      grandTotals.totalB += r.totalB;
      grandTotals.totalG += r.totalG;
      let langCells = '';
      languages.forEach(lang => {
        langCells += `<td style="text-align: center;">${r.counts[lang].B}</td><td style="text-align: center;">${r.counts[lang].G}</td>`;
        grandTotals.byLang[lang].B += r.counts[lang].B;
        grandTotals.byLang[lang].G += r.counts[lang].G;
      });
      tableRows += `
              <tr style="height: 30px;">
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: left;">${bn}</td>
                ${langCells}
                <td style="text-align: center; font-weight: bold;">${r.totalB + r.totalG}</td>
              </tr>
              `;
    });

    const html = `
              <div class="page-container" style="width: 297mm; height: 195mm; padding: 5mm; box-sizing: border-box; background: white; overflow: hidden;">
                <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
                  ${getCommonHeader()}
                  <div style="text-align: center; margin: 10px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
                    FORM - F2 (LINGUISTIC MINORITY PARTICULARS)
                  </div>
                  <div style="margin-bottom: 8px; font-size: 11px;">
                    <div><b>INSTITUTION CODE:</b> 858</div>
                    <div><b>INSTITUTION NAME:</b> GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
                  </div>
                  <table style="font-size: 10px;">
                    <thead>
                      <tr>
                        <th rowspan="2">SL</th>
                        <th rowspan="2">DEPARTMENT</th>
                        ${languages.map(l => `<th colspan="2">${l}</th>`).join('')}
                        <th rowspan="2">TOTAL</th>
                      </tr>
                      <tr>
                        ${languages.map(() => `<th>B</th><th>G</th>`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${tableRows}
                      <tr style="font-weight: bold; background-color: #f2f2f2; height: 30px;">
                        <td colspan="2">TOTAL</td>
                        ${languages.map(l => `<td style="text-align: center;">${grandTotals.byLang[l].B}</td><td style="text-align: center;">${grandTotals.byLang[l].G}</td>`).join('')}
                        <td style="text-align: center;">${grandTotals.totalB + grandTotals.totalG}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px;">
                    <div><b>PRINCIPAL</b></div>
                  </div>
                </div>
              </div>
              `;
    openPrintWindow(html, 'Form F2 Report');
  };

  const handleDownloadPDF = useCallback(async () => {
    const formMap = {
      'FORM A': 'conduct-formA-preview',
      'FORM B': 'conduct-formB-preview',
      'FORM C': 'conduct-f  ormC-preview',
      'FORM D': 'conduct-formD-preview',
      'FORM F1': 'conduct-formF1-preview',
      'FORM F2': 'conduct-formF2-preview',
      'FORM F3': 'conduct-formF3-preview'
    };

    const contentId = formMap[activeForm];
    if (!contentId) {
      console.error('No form selected to download');
      return;
    }

    const contentEl = document.getElementById(contentId);
    if (!contentEl) {
      console.error('Report not found');
      return;
    }

    try {
      console.log('Generating PDF...');

      // Convert HTML to canvas
      const canvas = await html2canvas(contentEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('/assets/images/GRT.png');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgWidth = pageWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'A3');
      let heightLeft = imgHeight;
      let position = 10; // 10mm margin from top

      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20); // Subtract page height minus margins

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${activeForm.replace(/\s+/g, '_')}_${timestamp}.pdf`;

      // Download PDF
      pdf.save(filename);
      console.log(`${activeForm} downloaded successfully`);
    } catch (err) {
      console.error('PDF generation error:', err);
      console.error('Failed to generate PDF');
    }
  }, [activeForm]);

  const columns = useMemo(() => [
    {
      id: 'applicationNo',
      header: 'Application No',
      accessorFn: (row) => pickField(row, ['Application_No', 'application_no', 'App_No', 'app_no']),
      cell: ({ getValue }) => <span className="fw-medium">{getValue() || '-'}</span>
    },
    {
      id: 'studentName',
      header: 'Student Name',
      accessorFn: (row) => pickField(row, ['Student_Name', 'name', 'Name']),
      cell: ({ getValue }) => <span className="fw-semibold text-dark">{getValue() || '-'}</span>
    },
    {
      id: 'modeOfJoin',
      header: 'Mode of Join',
      accessorFn: (row) => pickField(row, ['Mode_Of_Joinig', 'ModeOfJoin', 'entry_type', 'EntryType']),
      cell: ({ getValue }) => <span className="badge bg-primary-100 text-primary-600">{getValue() || '-'}</span>
    },
    {
      id: 'branch',
      header: 'Department',
      accessorFn: (row) => pickField(row, ['Dept_Name', 'dept_name', 'Department', 'Dept']),
      cell: ({ getValue }) => <span className="fw-medium">{getValue() || '-'}</span>
    },
    {
      id: 'semester',
      header: 'Sem',
      accessorFn: (row) => pickField(row, ['Semester', 'semester', 'Sem', 'sem']),
      cell: ({ getValue }) => <span className="fw-medium">{getValue() || '-'}</span>
    },
    {
      id: 'status',
      header: 'Status',
      accessorFn: (row) => pickField(row, ['Admission_Status', 'status', 'Current_Status']),
      cell: ({ row, getValue }) => (
        <span className={`badge ${statusIsConfirmed(row.original) ? 'bg-success' : 'bg-secondary'}`}>
          {getValue() || 'NA'}
        </span>
      )
    },
    {
      id: 'register',
      header: 'Register No',
      accessorFn: (row) => pickField(row, ['Register_Number', 'register_number', 'Reg_No', 'reg_no']),
      cell: ({ getValue }) => <span className="fw-medium">{getValue() || '-'}</span>
    }
  ], []);

  return (
    <>
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">General Forms Report</h6>
            </div>

            {/* Filter Card - Similar to StudentProfile */}
            <div className="card mb-24">
              <div className="card-body">
                <h6 className="fw-semibold mb-16">Report Filters</h6>
                <div className="row g-3 align-items-end">
                  {/* Department */}
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      name="department"
                      value={filters.department}
                      onChange={handleFilterChange}
                      className="form-select"
                      disabled={loadingMeta}
                    >
                      <option value="ALL">ALL Departments</option>
                      {departments.map((department) => (
                        <option key={department.value} value={department.value}>
                          {department.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div className="col-12 col-md-2">
                    <label className="form-label fw-semibold">Semester</label>
                    <select
                      name="sem"
                      value={filters.sem}
                      onChange={handleFilterChange}
                      className="form-select"
                      disabled={loadingMeta}
                    >
                      <option value="">Select</option>
                      {semesters.map((sem) => (
                        <option key={sem.value} value={sem.value}>{sem.label || sem.value}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mode of Join */}
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold">Mode of Join</label>
                    <select
                      name="modeOfJoin"
                      value={filters.modeOfJoin}
                      onChange={handleFilterChange}
                      className="form-select"
                      disabled={loadingMeta}
                    >
                      <option value="ALL">ALL Modes</option>
                      {modeOfJoinOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Confirmed Only */}
                  <div className="col-12 col-md-2">
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="confirmed"
                        name="confirmed"
                        checked={filters.confirmed}
                        onChange={handleFilterChange}
                      />
                      <label className="form-check-label fw-semibold ms-2" htmlFor="confirmed">
                        Confirmed Only
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row g-3 mt-3">
                  <div className="col-12 col-md-12">
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-primary radius-8 d-flex align-items-center gap-2 fw-semibold"
                        style={{ height: '42px' }}
                        onClick={() => fetchStudents('AUTO')}
                        disabled={loading}
                      >
                        <Icon icon="solar:bolt-outline" className="text-lg" />
                        View Report
                      </button>
                      <button
                        type="button"
                        className={`btn radius-8 px-20 py-11 fw-bold ${activeForm === 'FORM A' ? 'btn-primary' : 'btn-outline-primary-600'}`}
                        style={{ height: '42px' }}
                        onClick={() => handleFormButton('FORM A')}
                        disabled={loading}
                      >
                        FORM A
                      </button>
                      <button
                        type="button"
                        className={`btn radius-8 px-20 py-11 fw-bold ${activeForm === 'FORM B' ? 'btn-primary' : 'btn-outline-primary-600'}`}
                        style={{ height: '42px' }}
                        onClick={() => handleFormButton('FORM B')}
                        disabled={loading}
                      >
                        FORM B
                      </button>
                      <button
                        type="button"
                        className={`btn radius-8 px-20 py-11 fw-bold ${activeForm === 'FORM C' ? 'btn-primary' : 'btn-outline-primary-600'}`}
                        style={{ height: '42px' }}
                        onClick={() => handleFormButton('FORM C')}
                        disabled={loading}
                      >
                        FORM C
                      </button>
                      <button
                        type="button"
                        className={`btn radius-8 px-20 py-11 fw-bold ${activeForm === 'FORM D' ? 'btn-primary' : 'btn-outline-primary-600'}`}
                        style={{ height: '42px' }}
                        onClick={() => handleFormButton('FORM D')}
                        disabled={loading}
                      >
                        FORM D
                      </button>
                      <button
                        type="button"
                        className={`btn radius-8 px-20 py-11 fw-bold ${activeForm === 'FORM F1' ? 'btn-success' : 'btn-outline-success'}`}
                        style={{ height: '42px' }}
                        onClick={() => handleFormButton('FORM F1')}
                        disabled={loading}
                      >
                        FORM F1
                      </button>
                      <button
                        type="button"
                        className={`btn radius-8 px-20 py-11 fw-bold ${activeForm === 'FORM F2' ? 'btn-success' : 'btn-outline-success'}`}
                        style={{ height: '42px' }}
                        onClick={() => handleFormButton('FORM F2')}
                        disabled={loading}
                      >
                        FORM F2
                      </button>
                      <button
                        type="button"
                        className={`btn radius-8 px-20 py-11 fw-bold ${activeForm === 'FORM F3' ? 'btn-success' : 'btn-outline-success'}`}
                        style={{ height: '42px' }}
                        onClick={() => handleFormButton('FORM F3')}
                        disabled={loading}
                      >
                        FORM F3
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger-600 radius-8 d-flex align-items-center gap-2 fw-semibold"
                        style={{ height: '42px' }}
                        onClick={handleClose}
                        disabled={loading}
                      >
                        <Icon icon="solar:close-circle-outline" className="text-lg" />
                        CLOSE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ minHeight: 520, transition: 'min-height 0.2s' }}>
              {/* Print Button - visible when a form is active */}
              {activeForm !== 'AUTO' && (
                <div className="d-flex justify-content-end gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-info radius-8 d-flex align-items-center gap-2 fw-bold"
                    style={{ height: '42px' }}
                    onClick={handleDownloadPDF}
                  >
                    <Icon icon="solar:download-outline" className="text-lg" />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary-600 radius-8 d-flex align-items-center gap-2 fw-bold"
                    style={{ height: '42px' }}
                    onClick={handlePrint}
                  >
                    <Icon icon="solar:printer-outline" className="text-lg" />
                    Print {activeForm}
                  </button>
                </div>
              )}

              {/* Render chosen report */}
              {activeForm === 'FORM A' && (
                <FormA rows={rows} meta={{ ...pageMeta, department: (departments.find(d => d.value === filters.department) || {}).label || filters.department }} onClose={() => setActiveForm('AUTO')} />
              )}
              {activeForm === 'FORM B' && (
                <FormB rows={rows} meta={{ ...pageMeta, department: (departments.find(d => d.value === filters.department) || {}).label || filters.department }} onClose={() => setActiveForm('AUTO')} />
              )}
              {activeForm === 'FORM C' && (
                <FormC rows={rows} meta={{ ...pageMeta, department: (departments.find(d => d.value === filters.department) || {}).label || filters.department }} onClose={() => setActiveForm('AUTO')} />
              )}
              {activeForm === 'FORM D' && (
                <FormD rows={rows} meta={{ ...pageMeta, department: (departments.find(d => d.value === filters.department) || {}).label || filters.department }} onClose={() => setActiveForm('AUTO')} />
              )}
              {activeForm === 'FORM F1' && (
                <FormF1 rows={rows} meta={{ ...pageMeta, department: (departments.find(d => d.value === filters.department) || {}).label || filters.department }} onClose={() => setActiveForm('AUTO')} />
              )}
              {activeForm === 'FORM F2' && (
                <FormF2 rows={rows} meta={{ ...pageMeta, department: (departments.find(d => d.value === filters.department) || {}).label || filters.department }} onClose={() => setActiveForm('AUTO')} />
              )}
              {activeForm === 'FORM F3' && (
                <FormF3 rows={rows} meta={{ ...pageMeta, department: (departments.find(d => d.value === filters.department) || {}).label || filters.department }} onClose={() => setActiveForm('AUTO')} />
              )}
            </div>
          </div>

          <Footer />
        </div>
      </section>

      {/* Small print CSS */}
      <style>{`
        @media print {
          body * { visibility: visible; }
          nav, .breadcrumb, .btn, button, footer, .card:first-child { display: none !important; }
          @page { size: A3; margin: 12mm; }
        }
      `}</style>
    </>
  );
};

export default GeneralForms;
