import React, { useState, useEffect, useMemo } from "react";
import DataTable from '../../../../../components/DataTable/DataTable';
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import { Edit, Trash2, Check, X } from 'lucide-react';


const AbsenteesEntry = () => {
  const [session, setSession] = useState("AN");
  const [date, setDate] = useState("");
  const [hallNo, setHallNo] = useState("");
  const [Subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [semester, setSemester] = useState("");
  const [regulation, setRegulation] = useState("");
  // Summary fields
  const [absentCount, setAbsentCount] = useState(0);
  const [malprcCount, setMalprcCount] = useState(0);
  const [hallAbsentCount, setHallAbsentCount] = useState(0);

  // DataTable state
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [editingRegNo, setEditingRegNo] = useState(null);
  const [prevAttendanceMap, setPrevAttendanceMap] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [halls, setHalls] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [staffDept, setStaffDept] = useState("");
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedHallName, setSelectedHallName] = useState("");
  const [selectedDeptName, setSelectedDeptName] = useState("");
  const columns = [
    { accessorKey: 'hallNo', header: 'Hall No' },
    { accessorKey: 'Subject', header: 'Subject' },
    { accessorKey: 'regNo', header: 'Reg No' },
    { accessorKey: 'studName', header: 'Stud Name' },
    {
      accessorKey: 'attendance',
      header: 'Attendance',
      cell: ({ row }) => {
        const rec = row.original || {};
        const reg = rec.regNo || rec.Register_Number || rec.register_number;
        const value = rec.attendance || '';
        if (editingRegNo && reg && editingRegNo === reg) {
          return (
            <select
              className="form-select form-select-sm"
              value={value}
              onChange={e => {
                const v = e.target.value;
                setTableData(prev => prev.map(r => {
                  const rreg = r.regNo || r.Register_Number || r.register_number;
                  if (rreg === reg) return { ...r, attendance: v };
                  return r;
                }));
              }}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>

            </select>
          );
        }

        return <span>{value}</span>;
      }
    }
    ,
    {
      accessorKey: 'markedBy',
      header: 'Marked By',
      cell: ({ row }) => {
        const rec = row.original || {};
        const name = rec.markedByName || rec.marked_by_name || rec.markedBy || '';
        const id = rec.markedById || rec.marked_by_id || rec.marked_by || '';
        return (
          <div>
            <table className="table table-borderless table-sm m-0">
              <tbody>
                <tr>
                  <td className="p-0">{name || '-'}</td>
                </tr>
                <tr>
                  <td className="p-0 small text-muted">{id || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => {
        const reg = row.original.regNo || row.original.Register_Number || row.original.register_number || row.original.id;
        const isEditing = editingRegNo === reg;

        return (
          <div className="d-flex gap-2">
            {!isEditing ? (
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => handleEdit(row.original)}
                title="Edit"
              >
                <Edit size={16} />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleSave(row.original)}
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleCancel(row.original)}
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            )}
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this record?')) {
                  // DELETE logic if needed, currently not used as per existing code
                  toast.info('Delete functionality not implemented for this module');
                }
              }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      }
    }
  ];

  const handleEdit = (row) => {
    const reg = row.regNo || row.Register_Number || row.register_number || row.id;
    if (!reg) return;
    setEditingRegNo(reg);
    // save previous attendance value so cancel can revert
    setPrevAttendanceMap(m => ({ ...m, [reg]: row.attendance || 'Present' }));
  };

  const handleSave = async (row) => {
    const reg = row.regNo || row.Register_Number || row.register_number || row.id;
    if (!reg) return toast.error('Cannot save: no reg id');

    // find the row in tableData
    const r = tableData.find(t => (t.regNo || t.Register_Number || t.register_number) === reg || t.id === row.id);
    if (!r) return toast.error('Row not found');

    try {
      const payload = {
        exam_date: date,
        session,
        subject_code: subjectCode,
        subject_name: Subject,
        dept_code: deptCode,
        dept_name: selectedDeptName || '',
        semester,
        regulation,
        hall_code: hallNo,
        hall_name: selectedHallName || '',
        hall_capacity: r.hall_capacity || null,
        seat_no: r.seatNo || r.seat_no || null,
        row: r.row || null,
        col: r.col || null,
        register_number: r.regNo,
        student_name: r.studName,
        attendance_status: r.attendance,
        marked_by_name: r.markedByName || staffName || '',
        marked_by_id: r.markedById || staffId || '',
        marked_by_dept: r.markedByDept || staffDept || ''
      };

      if (r.id) {
        const res = await fetch(`/api/examAttendance/attendance/${r.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/examAttendance/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Create failed');
        const js = await res.json();
        if (js && js.id) {
          setTableData(prev => prev.map(p => p === r ? { ...p, id: js.id } : p));
        }
      }

      toast.success('Row saved');
      setEditingRegNo(null);
    } catch (err) {
      console.error('Save row error', err);
      toast.error('Failed to save row');
    }
  };

  const handleCancel = (row) => {
    const reg = row.regNo || row.Register_Number || row.register_number || row.id;
    const prev = prevAttendanceMap[reg] || 'Present';
    setTableData(prevT => prevT.map(t => {
      const treg = t.regNo || t.Register_Number || t.register_number || t.id;
      if (String(treg) === String(reg)) return { ...t, attendance: prev };
      return t;
    }));
    setEditingRegNo(null);
    setPrevAttendanceMap(m => { const copy = { ...m }; delete copy[reg]; return copy; });
  };

  // QPCode DataTable state
  const [showQPTable, setShowQPTable] = useState(false);
  const [qpTableData, setQPTableData] = useState([]);
  const qpColumns = [
    { accessorKey: 'Subject', header: 'Subject' },
    { accessorKey: 'SubjectCode', header: 'Subject Code' },
    { accessorKey: 'qpCode', header: 'QPCode' },
  ];

  const handleAttendance = async () => {
    // Fetch students for selected exam/date/session/subject
    if (!date) return toast.error('Please select Date');
    if (!session) return toast.error('Please select Session');
    if (!subjectCode) return toast.error('Please select Subject');

    setLoadingStudents(true);
    const params = new URLSearchParams({
      examDate: date,
      session,
      subjectCode,
      deptCode,
      semester,
      regulation
    });

    try {
      const res = await fetch(`/api/examGeneration/students?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        console.error('Students fetch failed', res.status, text);
        toast.error(`Failed to load students: ${res.status}`);
        setTableData([]);
        setShowTable(false);
        setLoadingStudents(false);
        return;
      }

      const resp = await res.json();
      if (!resp || !resp.success) {
        console.error('Students API responded with error', resp);
        toast.error('Failed to fetch students');
        setTableData([]);
        setShowTable(false);
        setLoadingStudents(false);
        return;
      }

      const data = (resp.data || []).map(s => ({
        hallNo: hallNo || '',
        Subject: Subject || '',
        regNo: s.Register_Number || s.register_number,
        studName: s.Student_Name || s.student_name,
        attendance: 'Present',
        markedByName: staffName || '',
        markedById: staffId || '',
        markedByDept: staffDept || ''
      }));

      setTableData(data);
      setShowTable(true);
      toast.success('Students loaded');
      // Auto-save loaded attendance rows to DB
      (async function saveLoaded() {
        if (!data || data.length === 0) return;
        setSavingAll(true);
        let saved = 0;
        for (const row of data) {
          try {
            const payload = {
              exam_date: date,
              session,
              subject_code: subjectCode,
              subject_name: Subject,
              dept_code: deptCode,
              dept_name: selectedDeptName || '',
              semester,
              regulation,
              hall_code: hallNo,
              hall_name: selectedHallName || '',
              hall_capacity: row.hall_capacity || null,
              seat_no: row.seatNo || row.seat_no || null,
              row: row.row || null,
              col: row.col || null,
              register_number: row.regNo,
              student_name: row.studName,
              attendance_status: row.attendance,
              marked_by_name: row.markedByName || staffName || '',
              marked_by_id: row.markedById || staffId || '',
              marked_by_dept: row.markedByDept || staffDept || ''
            };

            const res = await fetch('/api/examAttendance/attendance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              const js = await res.json();
              if (js && js.id) {
                // update tableData with returned id
                setTableData(prev => prev.map(p => {
                  if ((p.regNo || p.Register_Number || p.register_number) === row.regNo) return { ...p, id: js.id };
                  return p;
                }));
                saved++;
              }
            } else {
              console.error('Create failed when auto-saving', await res.text());
            }
          } catch (err) {
            console.error('Auto-save error', err, row);
          }
        }
        setSavingAll(false);
        if (saved > 0) toast.success(`Auto-saved ${saved} records`);
      })();
    } catch (err) {
      console.error('Error fetching students', err);
      toast.error('Error fetching students (see console)');
    } finally {
      setLoadingStudents(false);
    }
  };

  const applySubjectFilter = (dept) => {
    const d = dept === undefined ? Subject : dept;
    if (!d || d === '' || d === 'ALL') {
      setSubjects([]);
      return;
    }

    // Filter assignments for selected hall (if any) and subject
    const filtered = assignments.filter(a => a.subject_name === d || a.subject_name === Subject);
    setSubjects(filtered.map(a => ({
      name: a.subject_name,
      code: a.subject_code,
      dept_code: a.dept_code,
      semester: a.semester,
      regulation: a.regulation
    })));
  };
  const handleQPCode = () => {
    toast.success("QP Code action");
    applySubjectFilter();
    setShowQPTable(true);
  };

  // Fetch staff master list for searchable staff selection
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/staff_master');
        if (!res.ok) return;
        const js = await res.json();
        let list = [];
        if (js) {
          if (js.success && Array.isArray(js.data)) list = js.data;
          else if (Array.isArray(js)) list = js;
        }
        setStaffList(list);
      } catch (err) {
        console.error('Failed to load staff list', err);
      }
    };

    fetchStaff();
  }, []);

  const handleStaffInput = (value) => {
    setStaffName(value);
    if (!value) {
      setStaffId('');
      setStaffDept('');
      return;
    }
    const found = staffList.find(s => {
      const names = [s.Staff_Name, s.Staff_Name && s.Staff_Name.trim(), s.staff_name, s.name, s.full_name, s.staffName, s.staff].filter(Boolean).map(x => String(x).trim());
      return names.includes(value.trim());
    });
    if (found) {
      const id = found.Staff_ID || found.staff_id || found.staffId || found.id || found.staff_no || found.code || found.emp_id || found.employee_id;
      const dept = found.Dept_Name || found.dept_name || found.department || found.dept || found.deptName || found.department_name || '';
      setStaffId(id || '');
      setStaffDept(dept || '');
    } else {
      setStaffId('');
      setStaffDept('');
    }
  };

  const handleSaveChanges = async () => {
    if (!tableData || tableData.length === 0) return toast.error('No data to save');
    if (!date) return toast.error('Select Date before saving');

    let saved = 0;
    for (const row of tableData) {
      try {
        const payload = {
          exam_date: date,
          session,
          subject_code: subjectCode,
          subject_name: Subject,
          dept_code: deptCode,
          dept_name: selectedDeptName || '',
          semester,
          regulation,
          hall_code: hallNo,
          hall_name: selectedHallName || '',
          hall_capacity: row.hall_capacity || null,
          seat_no: row.seatNo || row.seat_no || null,
          row: row.row || null,
          col: row.col || null,
          register_number: row.regNo,
          student_name: row.studName,
          attendance_status: row.attendance,
          marked_by_name: row.markedByName || staffName || '',
          marked_by_id: row.markedById || staffId || '',
          marked_by_dept: row.markedByDept || staffDept || ''
        };

        if (row.id) {
          const res = await fetch(`/api/examAttendance/attendance/${row.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error('Update failed');
        } else {
          const res = await fetch('/api/examAttendance/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error('Create failed');
          const js = await res.json();
          if (js && js.id) row.id = js.id;
        }

        saved++;
      } catch (err) {
        console.error('Save row error', err, row);
      }
    }

    toast.success(`Saved ${saved} records`);
  };

  // Fetch assignments when date/session change
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!date) return;
      setLoadingAssignments(true);
      try {
        const params = new URLSearchParams({ examDate: date, session });
        const res = await fetch(`/api/examGeneration?${params.toString()}`);
        if (!res.ok) {
          const text = await res.text();
          console.error('Assignments fetch failed', res.status, text);
          toast.error(`Failed to load assignments: ${res.status}`);
          setAssignments([]);
          setHalls([]);
          return;
        }
        const json = await res.json();
        if (!json || !json.success) {
          console.error('Assignments API responded with error', json);
          setAssignments([]);
          setHalls([]);
          return;
        }

        const data = json.data || [];
        setAssignments(data);

        // derive unique halls from assignments
        const uniqueHalls = [];
        const seen = new Set();
        data.forEach(item => {
          const code = item.hall_code || item.Hall_Code || item.hallNo || item.hallCode;
          const name = item.hall_name || item.Hall_Name || item.hallName || item.hall_name;
          if (code && !seen.has(code)) {
            seen.add(code);
            uniqueHalls.push({ code, name });
          }
        });
        setHalls(uniqueHalls);
      } catch (err) {
        console.error('Error fetching assignments', err);
        toast.error('Error fetching assignments (see console)');
        setAssignments([]);
        setHalls([]);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [date, session]);

  // When hall changes, populate available subjects for that hall
  useEffect(() => {
    if (!hallNo) { setSubjects([]); setSelectedHallName(''); return; }
    const hallObj = halls.find(h => h.code === hallNo);
    setSelectedHallName(hallObj ? (hallObj.name || '') : '');
    const filtered = assignments.filter(a => (a.hall_code || a.hallCode) === hallNo);
    const unique = [];
    const seen = new Set();
    filtered.forEach(a => {
      const name = a.subject_name || a.Subject || a.Sub_Name || a.sub_name || a.subject || a.subjectCode || a.subject_code || a.Sub_Code || a.subject_code || '';
      const code = a.subject_code || a.Sub_Code || a.subjectCode || a.subject_code || '';
      const dept_name = a.dept_name || a.Dept_Name || a.deptName || '';
      if (name && !seen.has(name)) {
        seen.add(name);
        unique.push({ name, code, dept_code: a.dept_code, dept_name, semester: a.semester, regulation: a.regulation });
      }
    });
    setSubjects(unique);
    // auto-select when only one subject in hall
    if (unique.length === 1) {
      const only = unique[0];
      setSubject(only.name);
      setSubjectCode(only.code || '');
      setDeptCode(only.dept_code || '');
      setSemester(only.semester || '');
      setRegulation(only.regulation || '');
      setSelectedDeptName(only.dept_name || '');
    }
  }, [hallNo, assignments, halls]);

  // When subject selection changes, set meta info
  useEffect(() => {
    if (!Subject) {
      setSubjectCode(''); setDeptCode(''); setSemester(''); setRegulation('');
      return;
    }
    const found = assignments.find(a => (a.subject_name === Subject || a.subject_name === Subject) && ((a.hall_code || a.hallCode) === hallNo || !hallNo));
    if (found) {
      setSubjectCode(found.subject_code || found.Sub_Code || '');
      setDeptCode(found.dept_code || '');
      setSemester(found.semester || '');
      setRegulation(found.regulation || '');
    }
  }, [Subject, assignments, hallNo]);
  const handleClose = () => {
    toast.success("Closing Absentees Entry");
    setTimeout(() => window.history.back(), 800);
  };


  return (
    <>
      <ToastContainer position="top-right" />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Absentees Entry</h6>
            </div>

            <div className="card p-0 radius-12 mb-4">
              <div className="card-header border-bottom-0 p-24 pb-0 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-semibold mb-0">Absentees Entry</h6>
                  <span className="text-sm text-secondary-light">Manage absentee entries and generate lists</span>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setShowTable(false); setShowQPTable(false); toast.info('View hidden'); }}>Hide</button>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAttendance}>Attendance</button>
                  <button type="button" className="btn btn-sm btn-success" onClick={handleSaveChanges} disabled={savingAll || loadingStudents}>
                    {savingAll ? 'Saving...' : 'Save All'}
                  </button>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                <form>
                  <div className="row g-20 mb-20">

                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold">Date</label>
                      <input type="date" id="dateSession" className="form-control radius-8" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold">Session</label>
                      <select className="form-select radius-8" id="sessionSelect" value={session} onChange={e => setSession(e.target.value)}>
                        <option value="FN">FN</option>
                        <option value="AN">AN</option>
                      </select>
                    </div>
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold">Hall No</label>
                      <select className="form-select radius-8" id="hallNo" value={hallNo} onChange={e => {
                        const code = e.target.value;
                        setHallNo(code);
                        // set selected hall name from available halls
                        const h = halls.find(x => x.code === code);
                        setSelectedHallName(h ? (h.name || '') : '');
                        // clear previous subject selection when hall changes
                        setSubject('');
                        setSubjectCode('');
                        setSubjects([]);
                      }}>
                        <option value="">Select Hall</option>
                        {halls && halls.length > 0 ? halls.map(h => (
                          <option key={h.code} value={h.code}>{h.name || h.code}</option>
                        )) : (
                          <option value="">No halls</option>
                        )}
                      </select>
                      {selectedHallName && (
                        <div className="text-muted small mt-1">Hall Name: {selectedHallName}</div>
                      )}
                    </div>
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold">Subject</label>
                      <select
                        className="form-select radius-8"
                        id="Subject"
                        value={Subject}
                        onChange={e => {
                          const val = e.target.value;
                          setSubject(val);
                          // find subject code and dept name if available
                          const found = subjects.find(s => s.name === val || s.code === val);
                          if (found) {
                            setSubjectCode(found.code || '');
                            setDeptCode(found.dept_code || '');
                            setSemester(found.semester || '');
                            setRegulation(found.regulation || '');
                            setSelectedDeptName(found.dept_name || '');
                          } else {
                            setSelectedDeptName('');
                          }
                          applySubjectFilter(val);
                        }}
                      >
                        <option value="">Select Subject</option>
                        {subjects && subjects.length > 0 ? subjects.map(s => (
                          <option key={s.code || s.name} value={s.name}>{s.name}{s.code ? ` (${s.code})` : ''}</option>
                        )) : (
                          <option value="">No subjects</option>
                        )}
                      </select>
                      {selectedDeptName && (
                        <div className="text-muted small mt-1">Department: {selectedDeptName}</div>
                      )}
                    </div>

                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold">Staff Name</label>
                      <Select
                        options={staffList.map(s => {
                          const name = s.Staff_Name || s.staff_name || s.name || s.full_name || s.staffName || s.staff || '';
                          const id = s.Staff_ID || s.staff_id || s.staffId || s.id || s.staff_no || s.code || s.emp_id || s.employee_id || '';
                          return { value: name, label: `${name}${id ? ` (${id})` : ''}`, staffData: s };
                        })}
                        value={staffName ? { value: staffName, label: staffName } : null}
                        onChange={(selected) => {
                          if (selected) {
                            const s = selected.staffData;
                            const name = s.Staff_Name || s.staff_name || s.name || s.full_name || s.staffName || s.staff || '';
                            const id = s.Staff_ID || s.staff_id || s.staffId || s.id || s.staff_no || s.code || s.emp_id || s.employee_id || '';
                            const dept = s.Dept_Name || s.dept_name || s.department || s.dept || s.deptName || s.department_name || '';
                            setStaffName(name);
                            setStaffId(id);
                            setStaffDept(dept);
                          } else {
                            setStaffName('');
                            setStaffId('');
                            setStaffDept('');
                          }
                        }}
                        isClearable
                        isSearchable
                        placeholder="Search Staff Name..."
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '8px',
                            minHeight: '40px'
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999
                          })
                        }}
                      />
                    </div>
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold">Staff ID</label>
                      <input type="text" className="form-control radius-8" value={staffId} onChange={e => setStaffId(e.target.value)} placeholder="Staff ID" />
                    </div>
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold">Department</label>
                      <input type="text" readOnly className="form-control radius-8" value={staffDept} placeholder="Department" />
                    </div>



                    {/* Close button moved to summary column (right side) */}
                  </div>


                </form>
              </div>
            </div>

            {/* DataTable Section - show only if showTable is true */}
            {showTable && (
              <div className="card p-3 mb-4 en-flex-card" style={{ borderRadius: 12 }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <label className="form-label mb-0 small">Search Student</label>
                  <input type="text" className="form-control form-control-sm w-50" placeholder="Type student name to filter" value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
                </div>
                <DataTable
                  data={
                    nameFilter && nameFilter.trim() ? tableData.filter(t => String(t.studName || '').toLowerCase().includes(nameFilter.trim().toLowerCase())) : tableData
                  }
                  columns={columns}
                  loading={loadingStudents}
                  error={null}
                  title="Attendance List"
                  pageSize={10}
                  enableActions={false}
                />
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default AbsenteesEntry;