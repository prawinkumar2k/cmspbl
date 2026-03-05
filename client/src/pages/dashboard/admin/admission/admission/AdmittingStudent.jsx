import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import DataTable from "../../../../../components/DataTable/DataTable";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";

import { createStudent, updateStudent, deleteStudent } from "../../../../../utils/admittedStudentApi";

/**
 * AdmittingStudent (full file) with reusable validated components embedded.
 *
 * - ValidatedInput and ValidatedSelect are defined inline.
 * - CSS for success/error is injected into document.head (so you get the exact UI).
 * - Status options are ["Pending","Confirm","Rejected"], defaulting to DB value (formData.status).
 */



/* ----------------------------------------------------------
   Inject shared styles for form validation
   ---------------------------------------------------------- */
const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("admit-styles")) return;

  const styleSheet = document.createElement("style");
  styleSheet.id = "admit-styles";
  styleSheet.textContent = `
    /* Toast progress animation */
    @keyframes toast-progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    /* COMMON WRAPPERS */
    .form-control-wrapper,
    .form-select-wrapper {
      position: relative;
    }

    /* smaller touches */
    .form-label .text-danger { margin-left: 4px; }
  `;
  document.head.appendChild(styleSheet);
};
injectStyles();

/* ===========================
   Reusable small components
   - ValidatedInput
   - ValidatedSelect
   Both components expect:
     label, required (bool), name, value, onChange, onBlur, error
   For selects: options = array of string values
   =========================== */

const ValidatedInput = ({ label, required, name, value, onChange, onBlur, error, readOnly, type = "text", placeholder }) => {
  const baseClass = `form-control`;
  return (
    <div>
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="form-control-wrapper">
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          className={baseClass}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

const ValidatedSelect = ({ label, required, name, value, onChange, onBlur, error, options = [], readOnly }) => {
  const baseClass = `form-select`;

  // Filter options to include the current value even if it's not in the predefined list
  const allOptions = value && !options.includes(value) ? [value, ...options] : options;

  return (
    <div>
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="form-select-wrapper">
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          className={baseClass}
          disabled={readOnly}
        >
          <option value="">Select</option>
          {allOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
   Constants (unchanged)
   ---------------------------------------------------------- */
const BRANCHES = [
  { code: "B.PHARM" },
  { code: "D.PHARM" },
  { code: "M.PHARM" },
  { code: "Ph.D" },
];

const DEPT_CODE_MAP = {
  'D.PHARM': '1000',
  'B.PHARM': '2000',
  'M.PHARM': '3000',
  'Ph.D': '4000',
};

// Per your request: status options exact
const STATUS_OPTIONS = ["Pending", "Confirm", "Rejected"];
const ALLOCATED_QUOTAS = ["Government", "Management", "Other"];

/* ===========================
   AdmittingStudent component
   =========================== */

const AdmittingStudent = () => {
  const [formData, setFormData] = useState({
    entry_type: "Regular",
    application_no: "",
    name: "",
    status: "", // default: use DB value if present; new forms empty
    branch_sec: "",
    dept_code: "",
    roll_no: "",
    reg_no: "",
    community: "",
    allocated_quota: "",
    student_uid: "",
  });

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]); // { name, code }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [applicationNos, setApplicationNos] = useState([]);
  const [appSearchInput, setAppSearchInput] = useState('');
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [touchedFields, setTouchedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const REQUIRED_FIELDS = {
    application_no: 'Application No',
    name: 'Name',
    status: 'Status',
    branch_sec: 'Department',
    community: 'Community',
    allocated_quota: 'Allocated Quota'
  };

  // helper functions (kept as in your original code)
  const generateRollNo = (branch) => {
    const prefixMap = {
      'D.PHARM': 'DP',
      'D.PHARM ': 'DP',
      'B.PHARM': 'BP',
      'B.PHARM ': 'BP',
      'M.PHARM': 'MP',
      'M.PHARM ': 'MP',
      'Ph.D': 'PH',
      'Ph.D ': 'PH'
    };
    const br = (branch || '').trim();
    const prefix = prefixMap[br] || (() => {
      const letters = (br.match(/[A-Za-z]/g) || []).join('').toUpperCase();
      return (letters.slice(0, 2) || 'RN');
    })();

    const existingForPrefix = (students || [])
      .map(s => (s && s.roll_no != null) ? String(s.roll_no) : '')
      .filter(r => r && r.startsWith(prefix));
    const nums = existingForPrefix
      .map(r => parseInt(r.slice(prefix.length), 10))
      .filter(n => !isNaN(n));
    const startSerial = 1000001;
    const nextSerial = nums.length ? Math.max(...nums) + 1 : startSerial;
    return prefix + String(nextSerial).padStart(7, '0');
  };

  const getDeptCodeForBranch = (branchName) => {
    if (!branchName) return '';
    const name = String(branchName).trim();
    if (DEPT_CODE_MAP[name]) return DEPT_CODE_MAP[name];
    const found = (departments || []).find(d => d.name === name);
    if (found && found.code) return found.code;
    return '';
  };

  const normalizeRollValue = (v) => {
    if (v == null) return '';
    const s = String(v).trim();
    if (!s) return '';
    const lower = s.toLowerCase();
    if (lower === 'null' || s === '-') return '';
    return s;
  };

  const safeTrim = (v) => String(v || '').trim();

  // Generate or fetch student UID based on application number
  const generateStudentUID = async (applicationNo) => {
    if (!applicationNo) return "";

    try {
      const res = await fetch(`/api/admittedStudent/check-uid/${applicationNo}`);
      if (res.ok) {
        const data = await res.json();
        if (data.uid) {
          return data.uid; // Return existing UID
        }
        // Generate new UID
        const nextSequence = (data.nextSequence || 0) + 1;
        return applicationNo + String(nextSequence).padStart(3, "0");
      }
    } catch (err) {
      console.error("Error generating UID:", err);
    }
    return "";
  };

  const generateRollNoForDept = (deptCode) => {
    const dc = String(deptCode || '').trim();
    if (!dc) return generateRollNo();
    const year = String(new Date().getFullYear()).slice(-2);
    const prefix = `${year}${dc}`;
    const existingForPrefix = (students || [])
      .map(s => (s && s.roll_no != null) ? String(s.roll_no) : '')
      .filter(r => r && r.startsWith(prefix));
    const nums = existingForPrefix
      .map(r => parseInt(r.slice(prefix.length), 10))
      .filter(n => !isNaN(n));
    const nextSerial = nums.length ? Math.max(...nums) + 1 : 1;
    return prefix + String(nextSerial).padStart(3, '0');
  };

  // validation function (same as original) -- ===== CHANGED to treat "Select" as empty =====
  const validateField = (fieldName, value) => {
    if (!REQUIRED_FIELDS[fieldName]) return null;
    const fieldLabel = REQUIRED_FIELDS[fieldName];
    if (!value || (typeof value === 'string' && (value.trim() === '' || value === 'Select'))) {
      return `${fieldLabel} is required`;
    }
    return null;
  };
  // =======================================================================================

  // fetch students & departments (unchanged logic)
  useEffect(() => {
    setLoading(true);
    fetch('/api/studentMaster/students')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch student_master records');
        return res.json();
      })
      .then((data) => {
        const normalized = data.map((s) => ({
          id: s.Id || s.id,
          entry_type: s.Mode_Of_Joinig || s.ModeOfJoining || "-",
          application_no: s.Application_No || "-",
          name: s.Student_Name || "-",
          status: s.Admission_Status || "-",
          branch_sec: s.Dept_Name || s.Course_Name || "-",
          dept_code: s.Dept_Code || s.DeptCode || s.Course_Code || s.CourseCode || s.DeptCode || "",
          seat_no: s.Seat_No || s.SeatNo || "",
          roll_no: normalizeRollValue(s.Roll_Number) || normalizeRollValue(s.RollNo) || normalizeRollValue(s.RollNo),
          reg_no: s.Register_Number || s.RegNo || "",
          community: s.Community || s.Caste || s.community || "",
          allocated_quota: s.Allocated_Quota || s.AllocatedQuota || "-",
        }));
        setStudents(normalized);
        const map = {};
        normalized.forEach(n => {
          const name = safeTrim(n.branch_sec);
          const code = safeTrim(n.dept_code);
          if (name) map[name] = map[name] || code;
        });
        const depts = Object.keys(map).map(k => ({ name: k, code: map[k] || '' }));
        setDepartments(depts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // fetch application nos with student names
  useEffect(() => {
    fetch('/api/studentMaster/students')
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => {
        // Store full student data for dropdown display
        setStudents((data || []).map((s) => ({
          Application_No: s.Application_No,
          Student_Name: s.Student_Name || "",
        })));
        setApplicationNos((data || []).map(d => d.Application_No));
        try {
          const normalized = (data || []).map((s) => ({
            branch_sec: s.Dept_Name || s.Course_Name || "",
            dept_code: s.Dept_Code || s.DeptCode || s.Course_Code || s.CourseCode || s.DeptCode || "",
          }));
          const map = {};
          normalized.forEach(n => {
            const name = safeTrim(n.branch_sec);
            const code = safeTrim(n.dept_code);
            if (name) map[name] = map[name] || code;
          });
          const depts = Object.keys(map).map(k => ({ name: k, code: map[k] || '' }));
          if (depts.length) setDepartments(depts);
        } catch (e) { /* ignore */ }
      })
      .catch(() => setApplicationNos([]));
  }, []);

  // input handler (kept same)
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "application_no") {
      setFormData((prev) => ({ ...prev, application_no: value }));
      if (value) {
        let selected = students.find(s => String(s.application_no) === String(value));
        if (!selected) {
          try {
            const res = await fetch('/api/studentMaster/students');
            if (res.ok) {
              const all = await res.json();
              const normalized = all.map((s) => ({
                id: s.Id || s.id,
                entry_type: s.Mode_Of_Joinig || s.ModeOfJoining || "-",
                application_no: s.Application_No || "-",
                name: s.Student_Name || "-",
                status: s.Admission_Status || "-",
                branch_sec: s.Dept_Name || s.Course_Name || "-",
                seat_no: s.Seat_No || s.SeatNo || "",
                roll_no: normalizeRollValue(s.Roll_Number) || normalizeRollValue(s.RollNo) || "",
                reg_no: s.Register_Number || s.RegNo || "",
                community: s.Community || s.Caste || s.community || "",
                allocated_quota: s.Allocated_Quota || s.AllocatedQuota || "-",
                student_uid: s.Std_UID || s.student_uid || "",
              }));
              setStudents(normalized);
              selected = normalized.find(x => String(x.application_no) === String(value));
            }
          } catch (err) {
            selected = null;
          }
        }

        if (selected) {
          const existingRoll = normalizeRollValue(selected.roll_no) || normalizeRollValue(selected.RollNo) || normalizeRollValue(selected.Roll_Number);
          let computedRoll = existingRoll;
          if (!computedRoll) {
            const deptCode = getDeptCodeForBranch(selected.branch_sec || formData.branch_sec || selected.Dept_Name || selected.Course_Name);
            computedRoll = deptCode ? generateRollNoForDept(deptCode) : generateRollNo(selected.branch_sec || formData.branch_sec);
          }

          // Generate or fetch student UID
          const uid = selected.student_uid || await generateStudentUID(value);

          const updatedFormData = {
            application_no: value,
            name: selected.name || "",
            entry_type: selected.entry_type || "",
            branch_sec: selected.branch_sec || "",
            reg_no: selected.reg_no || "",
            dept_code: selected.dept_code || getDeptCodeForBranch(selected.branch_sec) || "",
            status: selected.status || "",
            community: selected.community || "",
            roll_no: computedRoll,
            student_uid: uid,
          };

          setFormData((prev) => ({
            ...prev,
            ...updatedFormData,
          }));

          // Validate auto-filled required fields and set errors if empty
          const newErrors = {};
          const requiredAutoFillFields = ['application_no', 'name', 'status', 'branch_sec', 'community'];
          requiredAutoFillFields.forEach(fieldName => {
            const fieldValue = updatedFormData[fieldName] || '';
            const error = validateField(fieldName, fieldValue);
            if (error) {
              newErrors[fieldName] = error;
            }
          });
          setFieldErrors(newErrors);

          setTouchedFields(prev => ({
            ...prev,
            application_no: true,
            name: true,
            status: true,
            branch_sec: true,
            community: true,
          }));
          toast.info(`Data loaded for ${selected.name || 'student'}`, { autoClose: 2000 });
        } else {
          setFormData((prev) => ({
            ...prev,
            name: "",
            entry_type: "Regular",
            branch_sec: "",
            reg_no: "",
            dept_code: "",
            student_uid: "",
          }));
          toast.info('Application No not found', { autoClose: 2000 });
        }
      }
      return;
    }

    if (name === 'branch_sec') {
      setFormData((prev) => {
        const mappedCode = DEPT_CODE_MAP[String(value || '')] || '';
        const updated = { ...prev, [name]: value, dept_code: mappedCode || prev.dept_code };
        if (!updated.id && (!updated.roll_no || String(updated.roll_no).trim() === '' || String(updated.roll_no).toLowerCase() === 'null')) {
          (async () => {
            const final = mappedCode ? generateRollNoForDept(mappedCode) : generateRollNo(value);
            setFormData((p) => ({ ...p, roll_no: final }));
          })();
        }
        return updated;
      });
      return;
    }

    setTouchedFields(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (student) => {
    setFormData({
      id: student.id,
      entry_type: student.entry_type,
      application_no: student.application_no,
      name: student.name,
      status: student.status,
      branch_sec: student.branch_sec,
      roll_no: normalizeRollValue(student.roll_no) || normalizeRollValue(student.RollNo) || normalizeRollValue(student.Roll_Number) || '',
      reg_no: student.reg_no,
      community: student.community || "",
      dept_code: student.dept_code || student.DeptCode || "",
      allocated_quota: student.allocated_quota,
      student_uid: student.student_uid || "",
    });
    toast.info(`Editing ${student.name}`, { autoClose: 2000 });
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/studentMaster/students');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      return data;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setTouchedFields(Object.keys(REQUIRED_FIELDS).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {}));

    const errors = {};
    let missingFieldsCount = 0;
    const missingFields = [];

    Object.keys(REQUIRED_FIELDS).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error;
        missingFieldsCount++;
        missingFields.push(REQUIRED_FIELDS[fieldName]);
      }
    });

    setFieldErrors(errors);

    if (missingFieldsCount > 0) {
      const firstMissingField = missingFields[0];
      toast.info(`${firstMissingField} is required`, { autoClose: 2000 });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let saved;
      let rollNo = formData.roll_no;
      if (!formData.id && (!rollNo || String(rollNo).trim() === '' || String(rollNo).toLowerCase() === 'null')) {
        const deptCode = formData.dept_code || getDeptCodeForBranch(formData.branch_sec) || '';
        if (deptCode) {
          rollNo = generateRollNoForDept(deptCode);
        } else {
          rollNo = generateRollNo(formData.branch_sec);
        }
      }
      const submitData = { ...formData, roll_no: rollNo };
      if (formData.id) {
        saved = await updateStudent(formData.id, submitData);
        const fresh = await fetchStudents();
        const normalized = fresh.map((s) => ({
          id: s.id,
          entry_type: s.EntryType || "-",
          application_no: s.ApplicationNo || "-",
          name: s.Name || "-",
          status: s.Status || "-",
          branch_sec: s.BranchSec || "-",
          dept_code: s.DeptCode || s.Dept_Code || s.Course_Code || s.CourseCode || s.dept_code || "",
          seat_no: s.SeatNo || "",
          roll_no: normalizeRollValue(s.RollNo) || normalizeRollValue(s.Roll_Number) || normalizeRollValue(s.roll_no) || "",
          reg_no: s.RegNo || "",
          allocated_quota: s.AllocatedQuota || "-",
        }));
        setStudents(normalized);
        toast.info('Record updated', { autoClose: 2000 });
      } else {
        saved = await createStudent(submitData);
        const normalized = {
          id: saved.id,
          entry_type: saved.EntryType || saved.entry_type || "-",
          application_no: saved.ApplicationNo || saved.application_no || "-",
          name: saved.Name || saved.name || "-",
          status: saved.Status || saved.status || "-",
          branch_sec: saved.BranchSec || saved.branch_sec || "-",
          dept_code: saved.DeptCode || saved.dept_code || saved.Dept_Code || saved.Course_Code || "",
          seat_no: saved.SeatNo || saved.seat_no || "",
          roll_no: normalizeRollValue(saved.RollNo) || normalizeRollValue(saved.Roll_Number) || normalizeRollValue(saved.roll_no) || "",
          reg_no: saved.RegNo || saved.reg_no || "",
          allocated_quota: saved.AllocatedQuota || saved.allocated_quota || "-",
        };
        setStudents((prev) => [normalized, ...prev]);
        toast.info('Record submitted', { autoClose: 2000 });
      }

      setFormData({
        entry_type: "Regular",
        application_no: "",
        name: "",
        status: "",
        branch_sec: "",
        dept_code: "",
        roll_no: "",
        reg_no: "",
        community: "",
        allocated_quota: "",
      });
    } catch (err) {
      toast.info(err.message || 'Failed', { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const mapFieldToDbKey = (name) => {
    const map = {
      application_no: 'Application_No',
      name: 'Student_Name',
      entry_type: 'Mode_Of_Joining',
      status: 'Admission_Status',
      branch_sec: 'Dept_Name',
      dept_code: 'Dept_Code',
      roll_no: 'Roll_Number',
      reg_no: 'Register_No',
      community: 'Community',
      allocated_quota: 'Allocated_Quota',
    };
    return map[name] || name;
  };

  const buildDbPayload = (fields) => {
    const payload = {};
    Object.keys(fields).forEach(k => {
      const dbKey = mapFieldToDbKey(k);
      payload[dbKey] = fields[k];
    });
    return payload;
  };

  const handleFieldBlur = async (e) => {
    const { name } = e.target;
    if (!formData.id) return;

    const toSend = {};
    toSend[name] = formData[name];

    if (name === 'branch_sec') {
      toSend.dept_code = formData.dept_code;
      toSend.roll_no = formData.roll_no;
    }

    const fullFields = {
      entry_type: formData.entry_type,
      application_no: formData.application_no,
      name: formData.name,
      status: formData.status,
      branch_sec: formData.branch_sec,
      dept_code: formData.dept_code,
      roll_no: formData.roll_no,
      reg_no: formData.reg_no,
      community: formData.community,
      allocated_quota: formData.allocated_quota,
    };
    const payload = buildDbPayload(fullFields);
    setLoading(true);
    try {
      const updated = await updateStudent(formData.id, payload);
      setStudents(prev => prev.map(s => (s.id === formData.id ? {
        ...s, ...{
          branch_sec: formData.branch_sec,
          dept_code: formData.dept_code,
          roll_no: formData.roll_no,
          reg_no: formData.reg_no,
          status: formData.status,
          name: formData.name,
          application_no: formData.application_no,
          community: formData.community,
          allocated_quota: formData.allocated_quota,
        }
      } : s)));
      toast.info('Field saved', { autoClose: 2000 });
    } catch (err) {
      toast.info('Failed to save', { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      entry_type: "Regular",
      application_no: "",
      name: "",
      status: "",
      branch_sec: "",
      dept_code: "",
      roll_no: "",
      reg_no: "",
      community: "",
      allocated_quota: "",
      student_uid: "",
    });
  };

  const handleDelete = (student) => {
    toast(t => (
      <div>
        <p className="mb-2">Delete record?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={async () => {
              setLoading(true);
              try {
                await deleteStudent(student.id);
                setStudents((prev) => prev.filter((s) => s.id !== student.id));
                toast.info('Deleted', { autoClose: 2000 });
                toast.dismiss(t.id);
              } catch (err) {
                toast.info('Failed to delete', { autoClose: 2000 });
              } finally {
                setLoading(false);
              }
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const columns = [
    {
      accessorKey: "sno",
      header: "S.NO",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    { accessorKey: "roll_no", header: "ROLL NO" },
    { accessorKey: "application_no", header: "APP NO" },
    { accessorKey: "name", header: "NAME" },
    {
      accessorKey: "branch_sec",
      header: "DEPARTMENT",
      cell: ({ row }) => row.original.branch_sec || "-",
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const raw = String(row.original.status || '');
        const s = raw.toLowerCase();
        let cls = 'bg-secondary';
        if (s.includes('admit') || s.includes('confirm') || s.includes('approved')) cls = 'bg-success';
        else if (s.includes('pending') || s.includes('wait')) cls = 'bg-warning';
        else if (s.includes('reject') || s.includes('cancel')) cls = 'bg-danger';
        else cls = 'bg-info';
        return <span className={`badge ${cls}`}>{raw}</span>;
      }
    },
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

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h6 className="fw-semibold mb-0">Admitting Student</h6>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                  onClick={() => setShowTable(!showTable)}
                  title={showTable ? 'Hide Student Table' : 'Show Student Table'}
                >
                  <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                  {showTable ? 'Hide Table' : 'View Students'}
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Application No <span className="text-danger">*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Application No"
                          value={appSearchInput}
                          onChange={(e) => {
                            setAppSearchInput(e.target.value);
                            setIsAppDropdownOpen(true);
                          }}
                          onFocus={() => {
                            setIsAppDropdownOpen(true);
                          }}
                          onBlur={() => {
                            setTimeout(() => setIsAppDropdownOpen(false), 200);
                          }}
                        />
                        {isAppDropdownOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              backgroundColor: 'white',
                              border: '1px solid #ccc',
                              borderTop: 'none',
                              maxHeight: '250px',
                              overflowY: 'auto',
                              zIndex: 1000,
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }}
                          >
                            {students
                              .filter(s =>
                                appSearchInput === '' ||
                                String(s.Application_No).includes(appSearchInput) ||
                                String(s.Student_Name).toLowerCase().includes(appSearchInput.toLowerCase())
                              )
                              .map((student, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, application_no: student.Application_No }));
                                    setAppSearchInput(student.Application_No);
                                    setIsAppDropdownOpen(false);
                                    handleInputChange({ target: { name: 'application_no', value: student.Application_No } });
                                  }}
                                  style={{
                                    padding: '10px 12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: formData.application_no === student.Application_No ? '#e7f1ff' : 'white',
                                  }}
                                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#e7f1ff')}
                                  onMouseLeave={(e) =>
                                  (e.target.style.backgroundColor =
                                    formData.application_no === student.Application_No ? '#e7f1ff' : 'white')
                                  }
                                >
                                  <div style={{ fontWeight: 'bold' }}>{student.Application_No}</div>
                                  <div style={{ fontSize: '0.85em', color: '#666' }}>{student.Student_Name}</div>
                                </div>
                              ))}
                            {students.filter(s =>
                              appSearchInput === '' ||
                              String(s.Application_No).includes(appSearchInput) ||
                              String(s.Student_Name).toLowerCase().includes(appSearchInput.toLowerCase())
                            ).length === 0 && (
                                <div style={{ padding: '10px 12px', color: '#999' }}>
                                  No results found
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <ValidatedInput
                        label="Entry Type"
                        name="entry_type"
                        value={formData.entry_type}
                        onChange={() => { }}
                        onBlur={() => { }}
                        readOnly
                        error={null}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedInput
                        label="Name"
                        required={true}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        error={fieldErrors.name}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedSelect
                        label="Status"
                        required={true}
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        error={fieldErrors.status}
                        options={STATUS_OPTIONS}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedSelect
                        label="Department"
                        required={true}
                        name="branch_sec"
                        value={formData.branch_sec}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        error={fieldErrors.branch_sec}
                        options={BRANCHES.map(b => b.code)}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedInput
                        label="Department Code"
                        name="dept_code"
                        value={formData.dept_code}
                        readOnly
                        onChange={() => { }}
                        onBlur={() => { }}
                        error={null}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedInput
                        label="Roll No"
                        name="roll_no"
                        value={formData.roll_no}
                        readOnly
                        onChange={() => { }}
                        onBlur={() => { }}
                        error={null}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedInput
                        label="Reg No"
                        name="reg_no"
                        value={formData.reg_no}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        error={fieldErrors.reg_no}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedInput
                        label="Student UID"
                        name="student_uid"
                        value={formData.student_uid}
                        readOnly
                        onChange={() => { }}
                        onBlur={() => { }}
                        error={null}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedInput
                        label="Community"
                        required={true}
                        name="community"
                        value={formData.community}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        error={fieldErrors.community}
                      />
                    </div>

                    <div className="col-md-4">
                      <ValidatedSelect
                        label="Allocated Quota"
                        required={true}
                        name="allocated_quota"
                        value={formData.allocated_quota}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        error={fieldErrors.allocated_quota}
                        options={ALLOCATED_QUOTAS}
                      />
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button type="submit" className="btn btn-outline-primary px-20 py-11">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-outline-danger px-20 py-11"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Table */}
            {showTable && (
              <DataTable
                data={students}
                columns={columns}
                loading={loading}
                error={error}
                title="Submission Records"
                pageSize={10}
                onEdit={handleEdit}
                onDelete={handleDelete}
                enableExport={true}
                enableSelection={true}
              />
            )}
          </div>

          <Footer />
        </div>
      </section>
    </>
  );
};

export default AdmittingStudent;
