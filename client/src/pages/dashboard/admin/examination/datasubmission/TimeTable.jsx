import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import DataTable from "../../../../../components/DataTable/DataTable";

const defaultEntry = {
  id: null,
  Exam_Date: "",
  Day_Order: "",
  Session: "",
  Dept_Code: "",
  Dept_Name: "",
  Regulation: "",
  Semester: "",
  Year: "",
  Sub_Name: "",
  Sub_Code: "",
  QPC: "",
  Elective: "",
  Elective_No: "",
};



const TimeTable = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [timetables, setTimetables] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");


  const [departments, setDepartments] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [matchingQPCSubjects, setMatchingQPCSubjects] = useState([]);
  const [qpcSubjectsWithCounts, setQpcSubjectsWithCounts] = useState([]);

  // Form state
  const [form, setForm] = useState({ ...defaultEntry });

  // Helper to convert 12-hour to 24-hour format
  const convertTo24Hour = (time12) => {
    if (!time12) return '';
    if (/^\d{2}:\d{2}$/.test(time12)) return time12;
    const match = time12.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return time12;
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  // Helper to format date
  const formatExamDate = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month}-${day}`;
    }
    const dt = new Date(dateStr);
    if (!isNaN(dt.getTime())) {
      return dt.toISOString().split('T')[0];
    }
    return dateStr;
  };

  // Helper to convert 24-hour to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours, 10);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  // reusable fetch function so we can call it from multiple places
  const normalizeItem = (raw) => {
    if (!raw) return { ...defaultEntry };
    return {
      id: raw.id || null,
      Exam_Date: raw.Exam_Date || raw.exam_date || '',
      Day_Order: raw.Day_Order || raw.day_order || '',
      Session: raw.Session || raw.session || '',
      Dept_Code: raw.Dept_Code || raw.dept_code || '',
      Dept_Name: raw.Dept_Name || raw.dept_name || '',
      Regulation: raw.Regulation || raw.regulation || '',
      Semester: raw.Semester || raw.semester || '',
      Year: raw.Year || raw.year || '',
      Sub_Name: raw.Sub_Name || raw.sub_name || '',
      Sub_Code: raw.Sub_Code || raw.sub_code || '',
      QPC: raw.QPC || raw.qpc || '',
      Elective: raw.Elective || raw.elective || '',
      Elective_No: raw.Elective_No || raw.elective_no || '',
      Regular_Count: raw.Regular_Count ?? raw.regular_count ?? 0,
      Arrear_Count: raw.Arrear_Count ?? raw.arrear_count ?? 0,
    };
  };

  const fetchTimetables = async (signal) => {
    try {
      const res = await fetch('/api/timetable', { signal });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const payload = data && data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      const list = payload.map(normalizeItem);
      setTimetables(list);
      return list;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.error('Could not load timetables from API', err);
      return null;
    }
  };


  useEffect(() => {
    if (form.Exam_Date) {
      const day = new Date(form.Exam_Date).toLocaleDateString("en-US", { weekday: "long" });
      if (day !== form.Day_Order) setForm((f) => ({ ...f, Day_Order: day }));
    } else if (form.Day_Order !== "") {
      setForm((f) => ({ ...f, Day_Order: "" }));
    }
  }, [form.Exam_Date]);

  // Fetch master data on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [regRes, semRes, deptRes] = await Promise.all([
          fetch('/api/timetable/master/regulations'),
          fetch('/api/timetable/master/semesters'),
          fetch('/api/timetable/master/departments'),
        ]);
        const regData = await regRes.json();
        const semData = await semRes.json();
        const deptData = await deptRes.json();
        setRegulations(regData.data || []);
        setSemesters(semData.data || []);
        setDepartments(deptData.data || []);
      } catch (err) {
        toast.error('Failed to load master data');
      }
    };
    fetchMasterData();
  }, []);

  // Fetch subjects when department or semester changes
  useEffect(() => {
    if (!form.Dept_Name || !form.Semester) return;
    const deptObj = departments.find(d => d.Dept_Name === form.Dept_Name);
    const deptCodeVal = deptObj ? deptObj.Dept_Code : '';
    setForm(f => ({ ...f, Dept_Code: deptCodeVal }));
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`/api/timetable/master/subjects?deptCode=${encodeURIComponent(deptCodeVal)}&semester=${encodeURIComponent(form.Semester)}`);
        const data = await res.json();
        setSubjects(data.data || []);
      } catch (err) {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [form.Dept_Name, form.Semester, departments]);

  // Auto-set year when semester changes
  useEffect(() => {
    if (!form.Semester) return;
    const semObj = semesters.find(s => String(s.Semester) === String(form.Semester));
    setForm(f => ({ ...f, Year: semObj ? semObj.Year : "" }));
  }, [form.Semester, semesters]);

  // Fetch timetables from server on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchTimetables(controller.signal);
    return () => controller.abort();
  }, []);

  // When subjectName changes, auto-fill related fields from fetched subjects
  useEffect(() => {
    const nameRaw = form.Sub_Name;
    if (!nameRaw) return;
    const name = String(nameRaw).trim().toLowerCase();
    const found = subjects.find((s) => {
      const v = (s.Sub_Name || s.sub_name || s.name || s.subject || s.Subject_Name || s.SubName || '').toString().toLowerCase();
      return v === name;
    });

    const pick = (obj, ...keys) => {
      for (const k of keys) {
        const val = obj[k];
        if (val !== undefined && val !== null && String(val).trim() !== "") return val;
      }
      return 'NA';
    };

    if (found) {
      const wrap = (...keys) => {
        const v = pick(found, ...keys);
        return v === 'NA' ? '' : v;
      };

      const newValues = {
        Sub_Name: wrap('Sub_Name', 'sub_name', 'name', 'Subject_Name'),
        Sub_Code: wrap('Sub_Code', 'subjectCode', 'sub_code'),
        QPC: wrap('QPC', 'qpcNo', 'eqcNo'),
        Elective: wrap('Elective', 'elective'),
        Elective_No: wrap('Elective_No', 'electiveNo'),
      };
      const needUpdate = Object.keys(newValues).some((k) => String(form[k] || '') !== String(newValues[k] || ''));
      if (needUpdate) setForm((f) => ({ ...f, ...newValues }));
    } else {
      const emptyValues = {
        Sub_Code: '',
        QPC: '',
        Elective: '',
        Elective_No: '',
      };
      const needClear = Object.keys(emptyValues).some((k) => String(form[k] || '') !== '');
      if (needClear) setForm((f) => ({ ...f, ...emptyValues }));
    }
  }, [form.Sub_Name, subjects]);

  // Trigger subject fetch when editing department/semester changes
  useEffect(() => {
    if (!isEditing) return;
    if (!form.Dept_Name || !form.Semester) return;

    const deptObj = departments.find(d => d.Dept_Name === form.Dept_Name);
    const deptCodeVal = deptObj ? deptObj.Dept_Code : form.Dept_Code;

    const fetchSubjectsForEdit = async () => {
      try {
        const res = await fetch(`/api/timetable/master/subjects?deptCode=${encodeURIComponent(deptCodeVal)}&semester=${encodeURIComponent(form.Semester)}`);
        const data = await res.json();
        setSubjects(data.data || []);
      } catch (err) {
        console.log('Error fetching subjects:', err);
      }
    };

    fetchSubjectsForEdit();
  }, [isEditing, form.Dept_Name, form.Semester, departments]);

  // Fetch matching QPC subjects when QPC changes
  useEffect(() => {
    if (!form.QPC || form.QPC.trim() === '') {
      setMatchingQPCSubjects([]);
      setQpcSubjectsWithCounts([]);
      return;
    }

    const fetchMatchingQPCSubjects = async () => {
      try {
        const res = await fetch(`/api/timetable/master/subjects?qpc=${encodeURIComponent(form.QPC)}`);
        const data = await res.json();
        setMatchingQPCSubjects(data.data || []);

        // Fetch with counts if department code and semester are available
        if (form.Dept_Code && form.Semester) {
          const countsRes = await fetch(
            `/api/timetable/master/subjects-with-counts?qpc=${encodeURIComponent(form.QPC)}&deptCode=${encodeURIComponent(form.Dept_Code)}&semester=${encodeURIComponent(form.Semester)}`
          );
          const countsData = await countsRes.json();
          setQpcSubjectsWithCounts(countsData.data || []);
        } else {
          setQpcSubjectsWithCounts(data.data || []);
        }
      } catch (err) {
        console.log('Error fetching matching QPC subjects:', err);
        setMatchingQPCSubjects([]);
        setQpcSubjectsWithCounts([]);
      }
    };

    fetchMatchingQPCSubjects();
  }, [form.QPC, form.Dept_Code, form.Semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => {
    setForm({ ...defaultEntry });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e && e.preventDefault();
    const requiredFields = [
      form.Exam_Date,
      form.Day_Order,
      form.Session,
      form.Dept_Code,
      form.Dept_Name,
      form.Regulation,
      form.Semester,
      form.Year,
      form.Sub_Name,
      form.Sub_Code,
      form.QPC,
      form.Elective,
      form.Elective_No
    ];
    const allFilled = requiredFields.every(v => v !== undefined && v !== null && String(v).trim() !== "");
    if (!allFilled) {
      toast.error("Please fill all required fields");
      return;
    }

    // Sum Regular_Count and Arrear_Count from QPC-matched subjects
    let totalRegularCount = 0;
    let totalArrearCount = 0;
    if (Array.isArray(qpcSubjectsWithCounts) && qpcSubjectsWithCounts.length > 0) {
      totalRegularCount = qpcSubjectsWithCounts.reduce((sum, subj) => sum + (parseInt(subj.Regular_Count, 10) || 0), 0);
      totalArrearCount = qpcSubjectsWithCounts.reduce((sum, subj) => sum + (parseInt(subj.Arrear_Count, 10) || 0), 0);
    }

    const savedEntry = {
      ...form,
      Regular_Count: totalRegularCount,
      Arrear_Count: totalArrearCount,
    };

    try {
      if (isEditing && editingId) {
        // Update existing record
        const res = await fetch(`/api/timetable/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedEntry),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        await fetchTimetables();
        toast.success('Timetable updated successfully');
        resetForm();
      } else {
        // Create new record
        const res = await fetch('/api/timetable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedEntry),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        await fetchTimetables();
        toast.success('Timetable saved successfully');
        resetForm();
      }
    } catch (err) {
      console.error('Failed to save timetable', err);
      toast.error('Failed to save timetable');
    }
  };

  const handleEdit = async (item) => {

    if (!item) {
      toast.error('No item provided');
      return;
    }

    try {
      const formData = {
        id: item.id || null,
        Exam_Date: formatExamDate(item.Exam_Date || ''),
        Day_Order: item.Day_Order || '',
        Session: item.Session || '',
        Dept_Code: item.Dept_Code || '',
        Dept_Name: item.Dept_Name || '',
        Regulation: item.Regulation || '',
        Semester: item.Semester || '',
        Year: item.Year || '',
        Sub_Name: item.Sub_Name || '',
        Sub_Code: item.Sub_Code || '',
        QPC: item.QPC || '',
        Elective: item.Elective || '',
        Elective_No: item.Elective_No || '',
      };
      setForm(formData);
      setEditingId(item.id);
      setIsEditing(true);
      setActiveTab('create');

      // Fetch subjects for this department and semester
      if (formData.Dept_Name && formData.Semester) {
        const deptObj = departments.find(d => d.Dept_Name === formData.Dept_Name);
        const deptCodeVal = deptObj?.Dept_Code || formData.Dept_Code;

        const res = await fetch(`/api/timetable/master/subjects?deptCode=${encodeURIComponent(deptCodeVal)}&semester=${encodeURIComponent(formData.Semester)}`);
        const data = await res.json();
        setSubjects(data.data || []);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.info('Record loaded for editing');
    } catch (err) {
      toast.error('Failed to load record');
    }
  };

  const handleView = (row) => {
    const r = row?.original ?? row;
    toast.success(`Viewing: ${r.subjectCode || r.eqcNo || r.id || '-'}`);
  };

  // Handle delete button click with toast confirmation
  const handleDelete = (record) => {
    toast.dismiss();
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete this timetable entry?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={async () => {
                try {
                  const response = await fetch(`/api/timetable/${record.id}`, {
                    method: 'DELETE',
                  });
                  if (!response.ok) {
                    throw new Error('Failed to delete record');
                  }
                  await fetchTimetables();
                  toast.success('Record deleted successfully');
                } catch (error) {
                  console.error('Error deleting record:', error);
                  toast.error('Failed to delete record');
                }
                toast.dismiss(toastId);
              }}
            >Delete</button>
            <button
              style={{ background: '#757575', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={() => toast.dismiss(toastId)}
            >Cancel</button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return timetables.filter((t) => {
      if ((t.type || "Theory").toLowerCase() !== "theory") return false;
      if (!s) return true;
      return (
        String(t.eqcNo || t.qpcNo || "").toLowerCase().includes(s) ||
        String(t.courseCode || "").toLowerCase().includes(s) ||
        String(t.subjectCode || "").toLowerCase().includes(s) ||
        String(t.examDate || "").toLowerCase().includes(s) ||
        String(t.session || "").toLowerCase().includes(s)
      );
    });
  }, [timetables, search]);

  const dtColumns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Exam_Date',
      header: 'Exam Date',
      cell: ({ row }) => {
        const d = row?.original?.Exam_Date;
        if (!d) return <div>-</div>;
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return <div>{String(d)}</div>;
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        return <div>{`${day}-${month}-${year}`}</div>;
      }
    },
    { accessorKey: 'Day_Order', header: 'Day Order', cell: ({ row }) => <div>{row?.original?.Day_Order ?? '-'}</div> },
    { accessorKey: 'Session', header: 'Session', cell: ({ row }) => <div>{row?.original?.Session ?? '-'}</div> },
    { accessorKey: 'Dept_Code', header: 'Dept Code', cell: ({ row }) => <div>{row?.original?.Dept_Code ?? '-'}</div> },
    { accessorKey: 'Dept_Name', header: 'Department', cell: ({ row }) => <div>{row?.original?.Dept_Name ?? '-'}</div> },
    { accessorKey: 'Regulation', header: 'Regulation', cell: ({ row }) => <div>{row?.original?.Regulation ?? '-'}</div> },
    { accessorKey: 'Semester', header: 'Semester', cell: ({ row }) => <div>{row?.original?.Semester ?? '-'}</div> },
    { accessorKey: 'Year', header: 'Year', cell: ({ row }) => <div>{row?.original?.Year ?? '-'}</div> },
    { accessorKey: 'Sub_Name', header: 'Subject Name', cell: ({ row }) => <div>{row?.original?.Sub_Name ?? '-'}</div> },
    { accessorKey: 'Sub_Code', header: 'Subject Code', cell: ({ row }) => <div>{row?.original?.Sub_Code ?? '-'}</div> },
    { accessorKey: 'QPC', header: 'QPC/EQC', cell: ({ row }) => <div>{row?.original?.QPC ?? '-'}</div> },
    { accessorKey: 'Elective', header: 'Elective', cell: ({ row }) => <div>{row?.original?.Elective ?? '-'}</div> },
    { accessorKey: 'Elective_No', header: 'Elective No', cell: ({ row }) => <div>{row?.original?.Elective_No ?? '-'}</div> },
    { accessorKey: 'Regular_Count', header: 'Regular Count', cell: ({ row }) => <div>{row?.original?.Regular_Count ?? 0}</div> },
    { accessorKey: 'Arrear_Count', header: 'Arrear Count', cell: ({ row }) => <div>{row?.original?.Arrear_Count ?? 0}</div> },
  ];

  const qpcMatchColumns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    { accessorKey: 'Dept_Code', header: 'Dept Code', cell: ({ row }) => <div>{row?.original?.Dept_Code ?? '-'}</div> },
    { accessorKey: 'Sub_Code', header: 'Subject Code', cell: ({ row }) => <div>{row?.original?.Sub_Code ?? '-'}</div> },
    { accessorKey: 'Sub_Name', header: 'Subject Name', cell: ({ row }) => <div>{row?.original?.Sub_Name ?? '-'}</div> },
    { accessorKey: 'Semester', header: 'Semester', cell: ({ row }) => <div>{row?.original?.Semester ?? '-'}</div> },
    { accessorKey: 'Regulation', header: 'Regulation', cell: ({ row }) => <div>{row?.original?.Regulation ?? '-'}</div> },
    { accessorKey: 'Sub_Type', header: 'Subject Type', cell: ({ row }) => <div>{row?.original?.Sub_Type ?? '-'}</div> },
    { accessorKey: 'Elective', header: 'Elective', cell: ({ row }) => <div>{row?.original?.Elective ?? '-'}</div> },
    { accessorKey: 'Elective_No', header: 'Elective No', cell: ({ row }) => <div>{row?.original?.Elective_No ?? '-'}</div> },
    { accessorKey: 'QPC', header: 'QPC', cell: ({ row }) => <div className="fw-semibold text-info">{row?.original?.QPC ?? '-'}</div> },
    { accessorKey: 'Regular_Count', header: 'Regular Count', cell: ({ row }) => <div className="badge bg-success">{row?.original?.Regular_Count ?? 0}</div> },
    { accessorKey: 'Arrear_Count', header: 'Arrear Count', cell: ({ row }) => <div className="badge bg-warning">{row?.original?.Arrear_Count ?? 0}</div> },
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
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Examination Timetable Management</h6>
            </div>

            <div className="mb-3 d-flex justify-content-between align-items-center">
              <div style={{ height: 40 }} />

            </div>

            <div className="card h-100 p-0 radius-12">
              {/* Tab Navigation */}
              <div className="card-header border-bottom-0 p-24 pb-0">
                <div className="nav-tabs-wrapper">
                  <nav className="nav nav-tabs flex-nowrap gap-3" role="tablist">
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'create' ? 'active' : ''}`}
                      onClick={() => setActiveTab('create')}
                      role="tab"
                      type="button"
                    >
                      <i className="fas fa-plus me-2"></i>
                      {isEditing ? 'Edit Timetable' : 'Create Timetable'}
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'view' ? 'active' : ''}`}
                      onClick={() => setActiveTab('view')}
                      role="tab"
                      type="button"
                    >
                      <i className="fas fa-table me-2"></i>
                      View Timetables
                    </button>
                  </nav>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                {/* TAB 1: Create/Edit Timetable */}
                {activeTab === 'create' && (
                  <div className="tab-content-section">
                    <div>
                      <h6 className="text-lg fw-semibold mb-2">{isEditing ? 'Edit Timetable' : 'Create Timetable'}</h6>
                      <span className="text-sm fw-medium text-secondary-light">{isEditing ? 'Update examination timetable entry' : 'Manage examination timetable entries'}</span>
                    </div>
                    <form onSubmit={handleSave}>
                      <div className="row g-20 mb-20">
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Exam Date</label>
                          <input type="date" name="Exam_Date" value={form.Exam_Date} onChange={handleChange} className="form-control radius-8" />
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Day Order</label>
                          <input name="Day_Order" value={form.Day_Order} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Session</label>
                          <select name="Session" value={form.Session} onChange={handleChange} className="form-select radius-8">
                            <option value="">Select</option>
                            <option value="FN">FN</option>
                            <option value="AN">AN</option>
                          </select>
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Regulation</label>
                          <select name="Regulation" value={form.Regulation} onChange={handleChange} className="form-select radius-8">
                            <option value="">Select</option>
                            {regulations.map((r, idx) => (
                              <option key={r.id || idx} value={r.Regulation}>{r.Regulation}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Semester</label>
                          <select name="Semester" value={form.Semester} onChange={handleChange} className="form-select radius-8">
                            <option value="">Select</option>
                            {semesters.map((s, idx) => (
                              <option key={s.id || idx} value={s.Semester}>{s.Semester}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Year</label>
                          <input name="Year" value={form.Year} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Department Name</label>
                          <select name="Dept_Name" value={form.Dept_Name} onChange={handleChange} className="form-select radius-8">
                            <option value="">Select</option>
                            {departments.map((d, idx) => (
                              <option key={d.Dept_Code || idx} value={d.Dept_Name}>{d.Dept_Name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Dept Code</label>
                          <input name="Dept_Code" value={form.Dept_Code} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Subject Name</label>
                          <select name="Sub_Name" value={form.Sub_Name} onChange={handleChange} className="form-select radius-8">
                            <option value="">Select</option>
                            {subjects.map((s, idx) => (
                              <option key={s.id || idx} value={s.Sub_Name}>{s.Sub_Name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Subject Code</label>
                          <input name="Sub_Code" value={form.Sub_Code} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Elective</label>
                          <input name="Elective" value={form.Elective || ''} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">Elective No</label>
                          <input name="Elective_No" value={form.Elective_No || ''} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>
                        <div className="col-12 col-lg-3">
                          <label className="form-label fw-semibold">QPC/EQC No</label>
                          <input name="QPC" value={form.QPC || ''} readOnly className="form-control radius-8 bg-neutral-50" />
                        </div>

                        {/* Start Time and End Time fields removed */}
                      </div>
                      <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                        <button type="submit" className={`btn btn-sm radius-8 ${isEditing ? 'btn-outline-primary' : 'btn-outline-success'}`}>
                          <i className={`fas ${isEditing ? 'fa-edit' : 'fa-save'} me-2`} />
                          {isEditing ? 'Update' : 'Save'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary radius-8"
                          onClick={() => {
                            resetForm();
                            setIsEditing(false);
                            toast.success('Form reset');
                          }}
                        >
                          <i className="fa fa-eraser me-1" aria-hidden="true"></i>
                          Reset
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger radius-8"
                            onClick={() => {
                              resetForm();
                              setIsEditing(false);
                              toast.info('Edit cancelled');
                            }}
                          >
                            <i className="fas fa-times me-1" />
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* QPC Matched Subject Preview Card */}
                      {form.QPC && matchingQPCSubjects.length > 0 && (
                        <div className="mt-24">
                          <DataTable
                            data={qpcSubjectsWithCounts}
                            columns={qpcMatchColumns}
                            loading={false}
                            error={null}
                            title={`Subjects with QPC: ${form.QPC}`}
                            subtitle="Preview of matching subjects with student counts (Read-only)"
                            enableExport={false}
                            enableSelection={false}
                            enableActions={false}
                            pageSize={10}
                          />
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* TAB 2: View Timetables */}
                {activeTab === 'view' && (
                  <div className="tab-content-section">
                    <div>
                      <h6 className="text-lg fw-semibold mb-2">Theory Timetable</h6>
                      <span className="text-sm fw-medium text-secondary-light">View all examination timetable entries</span>
                    </div>
                    <div className="mt-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex gap-2 align-items-center">
                          <input placeholder="Search..." className="form-control radius-8" style={{ minWidth: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                      </div>
                      <DataTable
                        data={filtered}
                        columns={dtColumns}
                        loading={false}
                        error={null}
                        title={'Theory Timetable'}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        enableExport={false}
                        enableSelection={false}
                        pageSize={10}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default TimeTable;
