import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../../../../utils/api';

const seatStyles = `
  @keyframes seatPulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 20, 147, 0.7); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); box-shadow: 0 0 0 8px rgba(255, 20, 147, 0); }
  }
  
  @keyframes seatBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  
  @keyframes colorShift {
    0% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    50% { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  }
  
  .seat-item {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .seat-item:hover:not(.seat-assigned) {
    animation: seatPulse 0.6s infinite;
  }
  
  .seat-selected {
    animation: seatBounce 0.4s ease-in-out;
  }
`;

const ExamGeneration = () => {
  const navigate = useNavigate();

  // State Management
  const [timetable, setTimetable] = useState([]);
  const [halls, setHalls] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableStudentsCount, setAvailableStudentsCount] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSession, setSelectedSession] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [selectedHallId, setSelectedHallId] = useState(null);

  const [seats, setSeats] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [globalAssignedIds, setGlobalAssignedIds] = useState(new Set());
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedAutoRule, setSelectedAutoRule] = useState('horizontal');
  const [draggedStudent, setDraggedStudent] = useState(null);

  const autoAssignRules = [
    { value: 'horizontal', label: 'Horizontal', description: 'Fill row by row, left to right', color: '#4CAF50' },
    { value: 'vertical', label: 'Vertical', description: 'Fill column by column, top to bottom', color: '#2196F3' },
    { value: 'zigzag', label: 'Zigzag', description: 'Alternate direction each row', color: '#FF9800' },
    { value: 'wave', label: 'Wave', description: 'Up-down-up pattern by columns', color: '#9C27B0' },
    { value: 'odd', label: 'Odd Columns', description: 'Fill odd columns only', color: '#F44336' },
    { value: 'even', label: 'Even Columns', description: 'Fill even columns only', color: '#00BCD4' },
    { value: 'custom', label: 'Custom (Manual)', description: 'Select seats manually with pointer', color: '#FF1493' }
  ];

  const normalizeId = (v) => (v == null ? null : String(v).trim());

  // ==================== DERIVED STATES ====================
  const sessions = useMemo(() => {
    if (!Array.isArray(timetable)) return [];
    const unique = [...new Set(timetable.map(t => t.session))].filter(Boolean);
    return unique;
  }, [timetable]);

  const dates = useMemo(() => {
    if (!Array.isArray(timetable)) return [];
    const unique = [...new Set(timetable.map(t => t.exam_date))].filter(Boolean);
    return unique;
  }, [timetable]);

  const subjects = useMemo(() => {
    if (!selectedSession || !selectedDate || !Array.isArray(timetable)) return [];
    const filtered = timetable.filter(
      t => t.session === selectedSession && t.exam_date === selectedDate
    );
    return filtered;
  }, [timetable, selectedSession, selectedDate]);

  const selectedSubject = useMemo(() => {
    return subjects.find(s => s.subject_code === selectedSubjectCode) || null;
  }, [subjects, selectedSubjectCode]);

  const selectedHall = useMemo(() => halls.find(h => h.id === selectedHallId), [halls, selectedHallId]);

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTimetable(), fetchHalls()]);
    } catch (err) {
      toast.error('Failed to load initial data');
      console.error('Initial data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FETCH TIMETABLE ====================
  const fetchTimetable = async () => {
    try {
      const response = await api.get('/timetable');
      const data = response.data;

      let ttArray = [];
      if (Array.isArray(data)) ttArray = data;
      else if (data && typeof data === 'object') {
        ttArray = data.timetable || data.data || data.result || [];
      }

      const mapped = (ttArray || []).map(item => ({
        exam_date: item.exam_date || item.Exam_Date || item.date || item.examDate,
        session: item.session || item.Session || item.shift || item.time,
        subject_code: item.subject_code || item.Sub_Code || item.code,
        subject_name: item.subject_name || item.Sub_Name || item.name,
        dept_code: item.dept_code || item.Dept_Code || item.deptCode || '',
        dept_name: item.dept_name || item.Dept_Name || item.department || item.DeptName || item.deptName || '',
        semester: item.semester || item.Semester || '',
        regulation: item.regulation || item.Regulation || '',
        qpc: item.qpc || item.QPC || null,
        student_count: item.student_count || item.count || item.total_students || null
      }));

      setTimetable(mapped);
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setTimetable([]);
    }
  };

  // ==================== FETCH HALLS ====================
  const fetchHalls = async () => {
    try {
      let response;
      try {
        response = await api.get('/hall');
        console.log('Fetched halls from /hall');
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.warn('/hall returned 404 — trying /halls fallback');
          response = await api.get('/halls');
          console.log('Fetched halls from /halls fallback');
        } else {
          throw err;
        }
      }

      const data = response.data;
      let hallsArray = [];
      if (Array.isArray(data)) hallsArray = data;
      else if (data && typeof data === 'object') {
        hallsArray = data.halls || data.data || data.result || data.hallList || data.hall || [];
      }

      if (Array.isArray(hallsArray) && hallsArray.length > 0) {
        const mappedHalls = hallsArray.map(hall => ({
          id: hall.id || hall.Hall_Code || hall.hall_id || hall.Id,
          hall_code: hall.Hall_Code || hall.hall_code || hall.Hall_Code,
          name: hall.Hall_Name || hall.name || hall.hall_name,
          rows: hall.Total_Rows || hall.rows || hall.total_rows || hall.RowCount,
          columns: hall.Total_Columns || hall.columns || hall.total_columns || hall.ColCount,
          capacity: hall.Seating_Capacity || (hall.rows * hall.columns) || hall.capacity,
          location: hall.Block_Name || hall.location || '',
          building: hall.Floor_Number || hall.building || '',
          type: hall.Hall_Type || '',
          status: hall.Status || 'active'
        }));

        console.log('Halls fetched and mapped:', mappedHalls);
        setHalls(mappedHalls);
      } else {
        console.warn('No halls found in response:', data);
        setHalls([]);
      }
    } catch (err) {
      console.error('Error fetching halls:', err);
      setHalls([]);
    }
  };

  // ==================== FETCH STUDENTS ====================
  const fetchStudents = async (filters) => {
    try {
      if (!filters) return;
      const { examDate, session, subjectCode, deptCode, semester, regulation } = filters;
      
      if (!examDate || !session || !subjectCode || !deptCode || !semester || !regulation) {
        setStudents([]);
        setAvailableStudentsCount(0);
        return;
      }
      // Try the consolidated exam timetable endpoint first for richer student data
      let studentsArray = [];
      try {
        // server exposes this route at /api/examtimetable/exam-timetable-students
        const resp = await api.get('/examtimetable/exam-timetable-students');
        const d = resp.data;
        if (Array.isArray(d)) studentsArray = d;
        else if (d && Array.isArray(d.data)) studentsArray = d.data;
        else if (d && d.success && Array.isArray(d.data)) studentsArray = d.data;
        else studentsArray = [];
        // Filter server-side view locally by provided params
        studentsArray = studentsArray.filter(s => {
          const matchDate = (s.Exam_Date || s.exam_date || s.ExamDate || '') == examDate;
          const matchSession = (s.Session || s.session || '') == session;
          const matchSub = (s.Sub_Code || s.sub_code || s.subCode || s.subject_code || '') == subjectCode;
          const matchDept = (s.Dept_Code || s.dept_code || '') == deptCode;
          const matchSem = (s.Semester || s.semester || '') == semester;
          const matchReg = (s.Regulation || s.regulation || '') == regulation;
          return matchDate && matchSession && matchSub && matchDept && matchSem && matchReg;
        });
      } catch (err) {
        // Fallback to older /students endpoint if /examtimetable not available
        const response = await api.get('/students', {
          params: { examDate, session, subjectCode, deptCode, semester, regulation }
        });
        const data = response.data;
        studentsArray = Array.isArray(data) ? data : [];
      }
      
      // Normalize different possible property names from backend
      const mappedStudents = studentsArray.map(student => ({
        id: normalizeId(student.Register_Number || student.register_number || student.registerNo || student.register || student.Register || student.register || ''),
        name: (student.Student_Name || student.student_name || student.name || student.Student || '').trim(),
        register_number: normalizeId(student.Register_Number || student.register_number || student.registerNo || student.register || student.Register || student.register || ''),
        department: student.Dept_Code || student.dept_code || student.department || '',
        qpc: student.QPC || student.qpc || null,
        regulation: student.Regulation || student.regulation || '',
        semester: student.Semester || student.semester || '',
        subject_code: student.Sub_Code || student.sub_code || student.subject_code || '',
        exam_date: student.Exam_Date || student.exam_date || examDate,
        session: student.Session || student.session || session,
        full: student
      }));
      
      setStudents(mappedStudents);
      setAvailableStudentsCount(mappedStudents.length);
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
      setAvailableStudentsCount(0);
    }
  };

  // Fetch students when all filters are selected
  useEffect(() => {
    if (
      selectedDate &&
      selectedSession &&
      selectedSubjectCode &&
      selectedSubject &&
      selectedSubject.dept_code &&
      selectedSubject.semester &&
      selectedSubject.regulation
    ) {
      fetchStudents({
        examDate: selectedDate,
        session: selectedSession,
        subjectCode: selectedSubjectCode,
        deptCode: selectedSubject.dept_code,
        semester: selectedSubject.semester,
        regulation: selectedSubject.regulation,
      });
    } else {
      setStudents([]);
      setAvailableStudentsCount(0);
    }
  }, [
    selectedDate,
    selectedSession,
    selectedSubjectCode,
    selectedSubject?.dept_code,
    selectedSubject?.semester,
    selectedSubject?.regulation,
  ]);

  // ==================== FETCH ASSIGNMENTS ====================
  const fetchAssignments = async (subjectCode, hallId) => {
    try {
      if (!selectedDate || !selectedSession) {
        console.warn('Skipping fetchAssignments: missing selectedDate or selectedSession');
        setAssignments([]);
        return;
      }
      const response = await api.get(window.location.origin + '/api/examSeatAllocation', {
        params: {
          exam_date: selectedDate,
          session: selectedSession,
          subject_code: subjectCode,
          dept_code: selectedSubject?.dept_code,
          semester: selectedSubject?.semester,
          hall_id: hallId,
          hall_code: (halls.find(h=>h.id===hallId) || {}).hall_code || selectedHall?.hall_code
        }
      });
      
      // Support multiple response shapes: array, or { data: [...] }, or wrapper
      let assignmentList = [];
      if (Array.isArray(response.data)) {
        assignmentList = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        assignmentList = response.data.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        assignmentList = response.data.results;
      } else if (response.data && Array.isArray(response.data.assignments)) {
        assignmentList = response.data.assignments;
      } else {
        // fallback: if it's an object containing rows under any key, try to find the first array
        if (response.data && typeof response.data === 'object') {
          const arr = Object.values(response.data).find(v => Array.isArray(v));
          if (Array.isArray(arr)) assignmentList = arr;
        }
      }

      console.log('fetchAssignments response for hallId', hallId, assignmentList);

      // Also fetch globally assigned student ids for this exam date/session (across halls)
      try {
        const assignedResp = await api.get(window.location.origin + '/api/examSeatAllocation/assigned', {
          params: {
            exam_date: selectedDate,
            session: selectedSession,
            subject_code: subjectCode,
            dept_code: selectedSubject?.dept_code,
            semester: selectedSubject?.semester
          }
        });
        const ids = assignedResp.data?.assignedStudentIds || [];
        const norm = ids.map(id => normalizeId(id)).filter(Boolean);
        console.log('global assigned ids for date/session:', norm);
        setGlobalAssignedIds(new Set(norm));
      } catch (gaErr) {
        console.warn('Failed to fetch global assigned ids:', gaErr);
        setGlobalAssignedIds(new Set());
      }

      // Build seat map using the provided hallId (not relying on selectedHall which may not be updated yet)
      const hall = halls.find(h => h.id === hallId) || selectedHall;
      if (hall) {
        const rows = Number(hall.rows) || 0;
        const cols = Number(hall.columns) || 0;
        const seatMap = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));

        assignmentList.forEach(a => {
          const ar = Number(a.row);
          const ac = Number(a.col);
          if (!Number.isNaN(ar) && !Number.isNaN(ac) && ar >= 0 && ar < rows && ac >= 0 && ac < cols) {
            seatMap[ar][ac] = normalizeId(a.student_id || a.studentId || a.Register_Number || a.register_number);
          }
        });

        const normalizedSeatMap = seatMap.map(row => row.map(v => v == null ? null : normalizeId(v)));
        console.log('computed seatMap:', normalizedSeatMap);
        setSeats(normalizedSeatMap);
      }
      
      setAssignments(assignmentList);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setAssignments([]);
    }
  };

  // ==================== SAVE ASSIGNMENT ====================
  const saveAssignment = async (row, col, studentId) => {
    if (!selectedSubject || !selectedHall) {
      toast.error('Select subject and hall first');
      return;
    }
    // Local-only assignment: update frontend state only. Persist happens on explicit Save.
    const student = students.find(s => s.id === normalizeId(studentId));
    const hallCapacity = selectedHall.rows * selectedHall.columns;
    const payload = {
      exam_date: selectedDate,
      session: selectedSession,
      subject_code: selectedSubject.subject_code,
      subject_name: selectedSubject.subject_name || '',
      dept_code: selectedSubject.dept_code,
      dept_name: selectedSubject.dept_name || '',
      semester: selectedSubject.semester,
      regulation: selectedSubject.regulation,
      hall_id: selectedHall.id,
      hall_code: selectedHall.hall_code,
      hall_capacity: hallCapacity,
      row,
      col,
      student_id: studentId,
      register_number: student?.register_number || studentId,
      _pending: true
    };

    setSeats(prev => {
      const copy = prev.map(r => r.slice());
      copy[row][col] = normalizeId(studentId);
      return copy;
    });

    setAssignments(prev => {
      // remove any existing assignment for this seat and add the pending one
      const filtered = (prev || []).filter(a => !(Number(a.row) === Number(row) && Number(a.col) === Number(col)));
      return [...filtered, payload];
    });

    toast.success('Seat updated locally (click Save to persist)');
  };

  // ==================== DELETE ASSIGNMENT ====================
  // Local-only deletion: remove assignment from frontend only. Persist happens on explicit Save.
  const deleteAssignment = async (row, col) => {
    setSeats(prev => {
      const copy = prev.map(r => r.slice());
      if (copy[row]) copy[row][col] = null;
      return copy;
    });

    setAssignments(prev => (prev || []).filter(a => !(Number(a.row) === Number(row) && Number(a.col) === Number(col))));
    toast.success('Seat removed locally (click Save to persist)');
    return Promise.resolve();
  };

  // ==================== SAVE ALL ASSIGNMENTS ====================
  const saveAllAssignments = async () => {
    if (!selectedSubject || !selectedHall) {
      toast.error('Select subject and hall first');
      return;
    }
    
    try {
      // Build payload from current frontend seats
      const payload = [];
      let seatNumber = 1;
      seats.forEach((row, r) => {
        row.forEach((studentId, c) => {
          if (studentId) {
            const student = students.find(s => s.id === studentId);
            
            // Validate required student data before adding to payload
            if (!student) {
              console.warn(`Student with ID ${studentId} not found in students list`);
              return; // Skip this assignment
            }
            
            if (!student.register_number) {
              console.warn(`Student ${studentId} missing register_number`);
              return; // Skip this assignment
            }
            
            if (!student.name) {
              console.warn(`Student ${studentId} missing name`);
              return; // Skip this assignment
            }
            
            const hallCapacity = selectedHall.rows * selectedHall.columns;
            payload.push({
              exam_date: selectedDate,
              session: selectedSession,
              subject_code: selectedSubject.subject_code,
              subject_name: selectedSubject.subject_name || '',
              dept_code: selectedSubject.dept_code,
              dept_name: selectedSubject.dept_name || '',
              semester: selectedSubject.semester,
              regulation: selectedSubject.regulation,
              hall_code: selectedHall.hall_code,
              hall_name: selectedHall.name,
              hall_capacity: hallCapacity,
              row: r,
              col: c,
              register_number: student.register_number,
              student_name: student.name,
              seat_no: String(seatNumber)
            });
            seatNumber++;
          }
        });
      });
      
      // Debug: log first assignment to verify payload structure
      if (payload.length > 0) {
        console.log('First assignment payload:', JSON.stringify(payload[0], null, 2));
        console.log('Total assignments to save:', payload.length);
      } else {
        toast.error('No valid assignments to save. Check student data.');
        return;
      }

      // Pre-check conflicts: fetch assigned student ids once for this date/session
      try {
        const assignedResp = await api.get(window.location.origin + '/api/examSeatAllocation/assigned', {
          params: { exam_date: selectedDate, session: selectedSession }
        });
        const assignedIds = new Set((assignedResp.data?.assignedStudentIds || []).map(id => normalizeId(id)).filter(Boolean));
        for (const p of payload) {
          if (assignedIds.has(normalizeId(p.student_id))) {
            // If a student is already assigned, check whether it's in this same hall; if not, abort
            // We could fetch the existing assignment details if necessary; for now, abort to avoid overwrite
            toast.error(`Student ${p.student_id} already assigned for this date/session`);
            return;
          }
        }
      } catch (chkErr) {
        console.warn('Bulk assigned-students fetch failed, falling back to per-student checks', chkErr);
        // fallback to existing per-student checks
        for (const p of payload) {
          try {
            const checkResp = await api.get(window.location.origin + '/api/examSeatAllocation/check', {
              params: { exam_date: p.exam_date, session: p.session, student_id: p.student_id }
            });
            if (checkResp.data && checkResp.data.assigned) {
              const assignedHall = checkResp.data.assignment?.hall_id;
              if (String(assignedHall) !== String(selectedHall.id)) {
                toast.error(`Student ${p.student_id} already assigned in hall ${assignedHall}`);
                return;
              }
            }
          } catch (e) {
            console.warn('Per-student check failed for', p.student_id, e);
          }
        }
      }

      // Clear backend for this subject+hall+date+session, then re-insert current frontend payload
      await api.delete(window.location.origin + '/api/examSeatAllocation/clear', {
        params: {
          subjectCode: selectedSubject.subject_code,
          hallId: selectedHall.id,
          examDate: selectedDate,
          session: selectedSession,
          deptCode: selectedSubject.dept_code,
          semester: selectedSubject.semester,
          regulation: selectedSubject.regulation
        }
      });

      if (payload.length > 0) {
        await api.post(window.location.origin + '/api/examSeatAllocation', { assignments: payload });
      }

      toast.success('All assignments saved successfully');
      // Refresh assignments from server to sync ids and state
      await fetchAssignments(selectedSubject.subject_code, selectedHall.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save assignments');
    }
  };

  // ==================== HANDLERS ====================
  const handleSelectHall = async (hallId) => {
    setSelectedHallId(hallId);
    setSelectedSeat(null);
    setSelectedStudentId(null);

    const hall = halls.find(h => h.id === hallId);
    if (hall) {
      setSeats(Array.from({ length: hall.rows }, () =>
        Array.from({ length: hall.columns }, () => null)
      ));

      if (selectedSubject && selectedDate && selectedSession) {
        await fetchAssignments(selectedSubject.subject_code, hallId);
      }
      
      toast.success(`Selected ${hall.name}`);
    }
  };

  const handleAddHallClick = () => {
    navigate('/admin/examination/datasubmission/HallDetails');
  };

  const handleSeatClick = (r, c) => {
    setSelectedSeat({ r, c });
  };

  const handleAssignManual = async () => {
    if (!selectedStudentId) {
      toast.error('Select a student');
      return;
    }
    
    if (!selectedSeat) {
      toast.error('Click a seat to select');
      return;
    }
    
    const { r, c } = selectedSeat;

    if (!seats[r] || seats[r][c]) {
      toast.error('Seat already assigned');
      return;
    }

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) {
      toast.error('Student not found');
      return;
    }

    const alreadyAssigned = seats.some((row, rIdx) =>
      row.some((sid, cIdx) => normalizeId(sid) === normalizeId(selectedStudentId))
    );
    
    const alreadyGloballyAssigned = globalAssignedIds && typeof globalAssignedIds.has === 'function' ? globalAssignedIds.has(normalizeId(selectedStudentId)) : false;

    if (alreadyAssigned || alreadyGloballyAssigned) {
      toast.error('Student already assigned to another seat');
      return;
    }

    await saveAssignment(r, c, selectedStudentId);
    setSelectedStudentId(null);
    setSelectedSeat(null);
  };

  // ==================== DRAG AND DROP HANDLERS ====================
  // Use dataTransfer so elements can be dragged from student list or from seats
  const handleDragStart = (e, studentId) => {
    try {
      if (e && e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(studentId));
      }
    } catch (err) {
      // ignore
    }
    setDraggedStudent(studentId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (row, col, e) => {
    if (e) e.preventDefault();
    const idFromEvent = e?.dataTransfer?.getData && e.dataTransfer.getData('text/plain');
    const toAssignId = idFromEvent || draggedStudent || selectedStudentId;
    if (!toAssignId) return;
    handleDropOnSeat(row, col, toAssignId);
  };

  // ==================== AUTO ASSIGN HANDLER ====================
  const handleAutoAssign = async (rule) => {
    if (!selectedSubject || !selectedHall) {
      toast.error('Select subject and hall first');
      return;
    }

    const localAssigned = seats.flat().filter(s => s !== null && s !== undefined);
    const assignedIds = new Set([...(localAssigned || []), ...(Array.from(globalAssignedIds || []) || [])]);
    
    const unassigned = students.filter(s => !assignedIds.has(s.id));

    if (unassigned.length === 0) {
      toast.error('No unassigned students');
      return;
    }

    let newSeats = seats.map(r => r.slice());
    let studentIdx = 0;
    const rows = selectedHall.rows;
    const cols = selectedHall.columns;

    switch (rule) {
      case 'vertical':
        for (let c = 0; c < cols && studentIdx < unassigned.length; c++) {
          for (let r = 0; r < rows && studentIdx < unassigned.length; r++) {
            if (!newSeats[r][c]) {
              newSeats[r][c] = unassigned[studentIdx].id;
              studentIdx++;
            }
          }
        }
        break;
        
      case 'horizontal':
        for (let r = 0; r < rows && studentIdx < unassigned.length; r++) {
          for (let c = 0; c < cols && studentIdx < unassigned.length; c++) {
            if (!newSeats[r][c]) {
              newSeats[r][c] = unassigned[studentIdx].id;
              studentIdx++;
            }
          }
        }
        break;
        
      case 'zigzag':
        for (let r = 0; r < rows && studentIdx < unassigned.length; r++) {
          if (r % 2 === 0) {
            for (let c = 0; c < cols && studentIdx < unassigned.length; c++) {
              if (!newSeats[r][c]) {
                newSeats[r][c] = unassigned[studentIdx].id;
                studentIdx++;
              }
            }
          } else {
            for (let c = cols - 1; c >= 0 && studentIdx < unassigned.length; c--) {
              if (!newSeats[r][c]) {
                newSeats[r][c] = unassigned[studentIdx].id;
                studentIdx++;
              }
            }
          }
        }
        break;
        
      case 'wave':
        for (let c = 0; c < cols && studentIdx < unassigned.length; c++) {
          if (c % 2 === 0) {
            for (let r = 0; r < rows && studentIdx < unassigned.length; r++) {
              if (!newSeats[r][c]) {
                newSeats[r][c] = unassigned[studentIdx].id;
                studentIdx++;
              }
            }
          } else {
            for (let r = rows - 1; r >= 0 && studentIdx < unassigned.length; r--) {
              if (!newSeats[r][c]) {
                newSeats[r][c] = unassigned[studentIdx].id;
                studentIdx++;
              }
            }
          }
        }
        break;
        
      case 'odd':
        for (let r = 0; r < rows && studentIdx < unassigned.length; r++) {
          for (let c = 0; c < cols && studentIdx < unassigned.length; c++) {
            if ((c + 1) % 2 === 1 && !newSeats[r][c]) {
              newSeats[r][c] = unassigned[studentIdx].id;
              studentIdx++;
            }
          }
        }
        break;
        
      case 'even':
        for (let r = 0; r < rows && studentIdx < unassigned.length; r++) {
          for (let c = 0; c < cols && studentIdx < unassigned.length; c++) {
            if ((c + 1) % 2 === 0 && !newSeats[r][c]) {
              newSeats[r][c] = unassigned[studentIdx].id;
              studentIdx++;
            }
          }
        }
        break;
        
      default:
        break;
    }

    setSeats(newSeats);
    toast.success(`Auto-assigned ${studentIdx} students using ${rule} pattern`);
  };

  // ==================== CLEAR ASSIGNMENTS ====================
  const handleClearAssignments = async () => {
    try {
      if (selectedSubject && selectedHall && selectedDate && selectedSession) {
        await api.delete(window.location.origin + '/api/examSeatAllocation/clear', {
          params: {
            subjectCode: selectedSubject.subject_code,
            hallId: selectedHall.id,
            examDate: selectedDate,
            session: selectedSession
          }
        });
        }

      setSeats(prev => prev.map(row => Array(row.length).fill(null)));
      setAssignments([]);
      setSelectedStudentId(null);
      setSelectedSeat(null);
      setDraggedStudent(null);
      
      toast.success('All assignments cleared');
    } catch (err) {
      console.error('Error clearing assignments:', err);
      toast.error('Failed to clear assignments');
    }
  };

  // ==================== HELPER FUNCTIONS ====================
  const getAssignedCount = () => seats.flat().filter(s => s !== null && s !== undefined).length;
  const getTotalCapacity = () => selectedHall ? (selectedHall.rows * selectedHall.columns) : 0;
  const getAvailableSeats = () => getTotalCapacity() - getAssignedCount();

  const getSubjectColor = (code) => {
    const palette = [
      { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800' },
      { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800' },
      { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-800' },
      { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800' },
      { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800' }
    ];
    
    if (!code) return palette[0];
    const idx = Math.abs(code.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % palette.length;
    return palette[idx];
  };

  // Drop handler used by renderHallLayout
  const handleDropOnSeat = (r, c, toAssignIdParam) => {
    const toAssignId = toAssignIdParam || draggedStudent || selectedStudentId;
    if (!toAssignId) return;

    if (seats[r] && seats[r][c]) {
      toast.error('Seat already assigned');
      return;
    }

    setSeats(prev => {
      const copy = prev.map(row => row.slice());
      for (let rr = 0; rr < copy.length; rr++) {
        for (let cc = 0; cc < copy[rr].length; cc++) {
          if (normalizeId(copy[rr][cc]) === normalizeId(toAssignId)) copy[rr][cc] = null;
        }
      }
      copy[r][c] = normalizeId(toAssignId);
      return copy;
    });

    saveAssignment(r, c, toAssignId).catch(() => {});
    setDraggedStudent(null);
    setSelectedStudentId(null);
  };

  const handleClearSeat = (seatNumber, e) => {
    if (e) e.stopPropagation();
    if (!selectedHall) return;
    const cols = selectedHall.columns;
    const r = Math.floor((seatNumber - 1) / cols);
    const c = (seatNumber - 1) % cols;
    deleteAssignment(r, c).catch(() => {});
  };

  const handleClearAll = async () => {
    setSeats(prev => prev.map(row => Array(row.length).fill(null)));
    setAssignments([]);
    setSelectedStudentId(null);
    setSelectedSeat(null);
    setDraggedStudent(null);
    await handleClearAssignments();
  };

  // ==================== STUDENT FILTERING ====================
  const getEligibleStudents = () => {
    if (!selectedSubject) return [];
    const subjectDept = selectedSubject.dept_code;
    if (!subjectDept) return students;

    const filtered = students.filter(s => {
      const studentDept = s.department;
      return studentDept && String(studentDept).toLowerCase() === String(subjectDept).toLowerCase();
    });

    const uniqueStudents = [];
    const seen = new Set();

    filtered.forEach(student => {
      const key = student.register_number || student.id;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueStudents.push(student);
      }
    });

    return uniqueStudents;
  };

  // ==================== RENDER HALL LAYOUT ====================
  const renderHallLayout = () => {
    if (!selectedHall) return null;
    const rows = selectedHall.rows || 0;
    const cols = selectedHall.columns || 0;

    const seatBoxes = [];
    for (let r = 0; r < rows; r++) {
      const rowBoxes = [];
      for (let c = 0; c < cols; c++) {
        const seatNumber = r * cols + c + 1;
        const studentId = seats?.[r]?.[c];
        const student = students.find(s => String(s.id) === String(studentId));
        const assigned = !!studentId;
        const isCustomClickable = selectedAutoRule === 'custom';

        rowBoxes.push(
          <div
            key={`seat-${r}-${c}`}
            draggable={assigned}
            onDragStart={(e) => studentId && handleDragStart(e, studentId)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(r, c, e)}
            onClick={() => {
              if (isCustomClickable && selectedStudentId && !assigned) {
                setSeats(prev => {
                  const copy = prev.map(rr => rr.slice());
                  copy[r][c] = selectedStudentId;
                  return copy;
                });
                saveAssignment(r, c, selectedStudentId).catch(() => {});
                setSelectedStudentId(null);
              } else {
                setSelectedSeat({ r, c });
              }
            }}
            className={`p-3 rounded-lg flex flex-col items-center justify-center text-sm font-semibold cursor-pointer border ${
              assigned ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
            title={assigned ? `${student?.register_number || studentId}` : `Seat ${seatNumber}`}
          >
            <div className="text-xs text-gray-500">#{seatNumber}</div>
            {assigned ? (
              <>
                <div className="text-[12px] text-gray-800 mt-1 truncate">
                  {student?.register_number || studentId}
                </div>
                <button 
                  onClick={(e) => handleClearSeat(seatNumber, e)} 
                  className="mt-2 text-xs text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </>
            ) : (
              <div className="text-xs text-gray-300 mt-1">Empty</div>
            )}
          </div>
        );
      }
      seatBoxes.push(
        <div key={`row-${r}`} className="flex gap-3 justify-center">
          {rowBoxes}
        </div>
      );
    }

    return (
      <div className="space-y-6 select-none" onMouseLeave={() => { if (draggedStudent) setDraggedStudent(null); }}>
        <div className="relative flex justify-center mb-4">
          <div className="w-2/3 h-12 bg-gray-800 rounded-b-3xl shadow-lg flex items-center justify-center text-gray-300 font-medium tracking-widest text-sm uppercase">
            Front / Board
          </div>
        </div>
        
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          {seatBoxes}
        </div>

        {subjects && subjects.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">Assignment Summary</h3>
              <button 
                onClick={handleClearAll} 
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(sub => {
                const assignedCount = seats.flat().filter(sid => !!sid).length;
                if (assignedCount === 0) return null;
                
                const color = getSubjectColor(sub.subject_code);
                const percentage = sub.student_count ? Math.round((assignedCount / sub.student_count) * 100) : 0;
                
                return (
                  <div 
                    key={sub.subject_code} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${color.bg} ${color.border} border-2`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sub.subject_name}</div>
                        <div className="text-xs text-gray-500">{sub.subject_code}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">{assignedCount}</div>
                      <div className="text-xs text-gray-500">{percentage}% filled</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER FUNCTION ====================
  return (
    <>
    <ToastContainer />
      <style>{seatStyles}</style>
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body p-24">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Exam Seating Management</h6>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={fetchAllData} 
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* Session, Date, Subject Selection Card */}
            <div className="card h-100 p-0 radius-12 mb-4">
              <div className="card-header border-bottom-0 p-24 pb-0">
                <h6 className="mb-0">Select Exam Details</h6>
              </div>
              
              <div className="card-body p-24 pt-20">
                <div className="row g-3">
                  {/* Exam Date Dropdown FIRST */}
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Exam Date</label>
                    <select
                      className="form-select"
                      value={selectedDate}
                      onChange={e => {
                        setSelectedDate(e.target.value);
                        setSelectedSession('');
                        setSelectedSubjectCode('');
                      }}
                    >
                      <option value="">Select Exam Date</option>
                      {dates.map(date => (
                        <option key={date} value={date}>{date}</option>
                      ))}
                    </select>
                  </div>

                  {/* Session Dropdown SECOND, enabled after date */}
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Session</label>
                    <select
                      className="form-select"
                      value={selectedSession}
                      onChange={e => {
                        setSelectedSession(e.target.value);
                        setSelectedSubjectCode('');
                      }}
                      disabled={!selectedDate}
                    >
                      <option value="">Select Session</option>
                      {sessions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Dropdown THIRD, enabled after session */}
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Subject</label>
                    <select
                      className="form-select"
                      value={selectedSubjectCode}
                      onChange={e => setSelectedSubjectCode(e.target.value)}
                      disabled={!selectedSession}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s.subject_code} value={s.subject_code}>
                          {s.subject_name} ({s.subject_code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Subject Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={selectedSubject ? selectedSubject.subject_code : ''} 
                      readOnly 
                    />
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Dept Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={selectedSubject ? selectedSubject.dept_code : ''} 
                      readOnly 
                    />
                  </div>

                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Dept Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedSubject ? selectedSubject.dept_name : ''}
                      readOnly
                    />
                  </div>
                  
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">QPC</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={selectedSubject ? selectedSubject.qpc : ''} 
                      readOnly 
                    />
                  </div>
                  
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Semester</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedSubject ? selectedSubject.semester : ''}
                      readOnly
                    />
                  </div>
                  
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Regulation</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={selectedSubject ? selectedSubject.regulation : ''} 
                      readOnly 
                    />
                  </div>

                  {/* Available students count */}
                  <div className="col-12 col-lg-3">
                    <label className="form-label fw-semibold">Available Students</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={availableStudentsCount} 
                      readOnly 
                    />
                  </div>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                <div className="row g-3">
                  {/* Hall Selection & Details */}
                  {selectedSubject && (
                    <div className="mt-4">
                      <h6 className="mb-0">Select Exam Hall</h6>
                      <div className="row g-3 align-items-end mb-4">
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold">Select Hall</label>
                          <div className="d-flex gap-2">
                            <select
                              className="form-select"
                              value={selectedHallId || ''}
                              onChange={e => handleSelectHall(Number(e.target.value))}
                            >
                              <option value="">Select Hall</option>
                              {halls.map(hall => (
                                <option key={hall.id} value={hall.id}>
                                  {hall.name} ({hall.rows}×{hall.columns})
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={handleAddHallClick}
                              style={{ whiteSpace: 'nowrap', minWidth: '40px' }}
                              title="Add new hall"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Hall Number */}
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold">Hall No</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedHall ? selectedHall.hall_code : ''}
                            readOnly
                          />
                        </div>

                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold">Select Pattern</label>
                          <select
                            className="form-select"
                            value={selectedAutoRule}
                            onChange={e => setSelectedAutoRule(e.target.value)}
                            style={{
                              borderColor: autoAssignRules.find(r => r.value === selectedAutoRule)?.color || '#4CAF50',
                              borderWidth: '2px',
                              color: autoAssignRules.find(r => r.value === selectedAutoRule)?.color || '#4CAF50',
                              fontWeight: '600'
                            }}
                          >
                            {autoAssignRules.map(rule => (
                              <option key={rule.value} value={rule.value}>
                                {rule.label} - {rule.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                        <button 
                          className="btn btn-outline-success"
                          onClick={() => handleAutoAssign(selectedAutoRule)}
                        >
                          Apply Pattern
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          onClick={handleClearAssignments}
                        >
                          Reset Assignments
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hall Layout Section */}
            {selectedSubject && selectedHall && (
              <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom-0 p-24 pb-0">
                  <h6 className="mb-0">Hall Plans - {selectedHall.name}</h6>
                  <small className="text-muted">
                    Subject: {selectedSubject.subject_name} | 
                    Capacity: {getTotalCapacity()} | 
                    Assigned: {getAssignedCount()} | 
                    Available: {getAvailableSeats()}
                  </small>
                </div>
                
                <div className="card-body p-24">
                  <div className="row g-3">
                    {/* Students Panel */}
                    <div className="col-12 col-lg-3">
                      <div className="card p-3 bg-light">
                        <h6 className="fw-semibold mb-3">Students ({getEligibleStudents().length})</h6>
                        <small className="text-muted d-block mb-2">
                          {selectedSubject.dept_code || '—'}
                        </small>
                        
                        <input 
                          type="text" 
                          className="form-control form-control-sm mb-3" 
                          placeholder="Search..." 
                        />
                        
                        <div style={{ maxHeight: 500, overflow: 'auto' }}>
                          {getEligibleStudents().map(s => {
                            const assignedLocal = seats.flat().includes(s.id);
                            const assignedGlobal = globalAssignedIds && typeof globalAssignedIds.has === 'function' ? globalAssignedIds.has(s.id) : false;
                            const assigned = assignedLocal || assignedGlobal;
                            // Allow dragging from the student list even if the student is already assigned
                            const draggableAllowed = true;
                            
                            return (
                              <div
                                key={s.id}
                                draggable={draggableAllowed}
                                onDragStart={(e) => handleDragStart(e, s.id)}
                                className={`p-2 border-bottom cursor-pointer ${
                                  selectedStudentId === s.id ? 'bg-primary bg-opacity-10' : ''
                                } ${assigned ? 'opacity-50 bg-success bg-opacity-10' : ''}`}
                                onClick={() => !assigned && setSelectedStudentId(s.id)}
                                style={{ 
                                  cursor: draggableAllowed ? 'grab' : 'default', 
                                  userSelect: 'none' 
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="fw-600 small">{s.register_number}</div>
                                    <div className="text-muted xsmall">{s.name?.substring(0, 15)}</div>
                                  </div>
                                  <small className={assigned ? 'badge bg-success' : 'badge bg-secondary'}>
                                    {assigned ? 'assigned' : 'unassigned'}
                                  </small>
                                </div>
                              </div>
                            );
                          })}
                          
                          {getEligibleStudents().length === 0 && (
                            <div className="text-center text-muted py-4">
                              <small>No students found for this subject's department</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Seat Grid - Card Layout */}
                    <div className="col-12 col-lg-9">
                      <div className="card p-3">
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${selectedHall.columns}, 1fr)`,
                            gap: '12px',
                            padding: '24px',
                            background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
                            borderRadius: '16px',
                            border: '2px solid #667eea',
                            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
                          }}
                        >
                          {seats.map((row, r) =>
                            row.map((studentId, c) => {
                              const colors = [
                                '#FF6B6B', '#1f6863ff', '#2c6572ff', '#864930ff', '#1c4138ff', 
                                '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52C4A1'
                              ];
                              const seatColor = colors[c % colors.length];
                              const seatLabel = (r * selectedHall.columns) + (c + 1);
                              const student = students.find(s => s.id === studentId);
                              const assigned = !!studentId;
                              const isSelected = selectedSeat?.r === r && selectedSeat?.c === c;
                              
                              return (
                                <div
                                  key={`${r}-${c}`}
                                  draggable={assigned}
                                  className="seat-item"
                                  onDragStart={(e) => studentId && handleDragStart(e, studentId)}
                                  onDragEnd={() => setDraggedStudent(null)}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(r, c, e)}
                                  onClick={() => {
                                    if (selectedAutoRule === 'custom' && selectedStudentId && !assigned) {
                                      setSeats(prev => {
                                        const copy = prev.map(row => row.slice());
                                        copy[r][c] = selectedStudentId;
                                        return copy;
                                      });
                                      saveAssignment(r, c, selectedStudentId).catch(() => {});
                                      setSelectedStudentId(null);
                                      setSelectedSeat(null);
                                      toast.success('Seat assigned');
                                    } else {
                                      handleSeatClick(r, c);
                                    }
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    const seatNumber = r * selectedHall.columns + (c + 1);
                                    handleClearSeat(seatNumber, e);
                                  }}
                                  style={{
                                    padding: '8px 10px',
                                    border: isSelected ? `3px solid #ff86a6` : `2px solid ${assigned ? '#1b6fe0' : '#ffb6c1'}`,
                                    borderRadius: '18px',
                                    textAlign: 'center',
                                    background: assigned
                                      ? `linear-gradient(135deg, #1e90ff 0%, #005fbe 100%)`
                                      : isSelected
                                        ? `linear-gradient(135deg, #821c37ff 0%, #ff6b9a 100%)`
                                        : `linear-gradient(135deg, rgba(255,182,193,0.12) 0%, rgba(255,182,193,0.04) 100%)`,
                                    cursor: selectedAutoRule === 'custom' && selectedStudentId && !assigned 
                                      ? 'pointer' 
                                      : (assigned ? 'move' : 'pointer'),
                                    opacity: draggedStudent === studentId ? 0.45 : 1,
                                    transition: 'all 0.18s ease',
                                    boxShadow: isSelected
                                      ? '0 8px 24px rgba(255,134,166,0.22)'
                                        : assigned
                                        ? '0 6px 16px rgba(30,144,255,0.18)'
                                        : '0 6px 18px rgba(255,182,193,0.06)',
                                    minHeight: '44px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backdropFilter: 'blur(6px)',
                                    position: 'relative',
                                    color: assigned ? '#fff' : '#f02241ff'
                                  }}
                                  onMouseEnter={e => {
                                    if (!assigned && !isSelected) {
                                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                                      e.currentTarget.style.boxShadow = `0 8px 24px ${seatColor}60`;
                                    }
                                  }}
                                  onMouseLeave={e => {
                                    if (!assigned && !isSelected) {
                                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                      e.currentTarget.style.boxShadow = `0 4px 12px ${seatColor}40`;
                                    }
                                  }}
                                  title={
                                    assigned 
                                      ? `${student?.register_number}\n(${student?.name})\n\nDrag to move | Right-click to remove`
                                      : selectedAutoRule === 'custom' 
                                        ? `Seat ${seatLabel}\n(Click to assign)`
                                        : `Seat ${seatLabel}\n(Drop student here)`
                                  }
                                >
                                  <div style={{ 
                                    fontSize: '11px', 
                                    fontWeight: 'bold', 
                                    color: assigned ? '#fff' : seatColor, 
                                    letterSpacing: '0.5px' 
                                  }}>
                                    {seatLabel}
                                  </div>
                                  
                                  {assigned && (
                                    <>
                                      <div style={{ 
                                        fontSize: '8px', 
                                        fontWeight: '600', 
                                        color: '#fff', 
                                        marginTop: '2px', 
                                        maxWidth: '100%', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis' 
                                      }}>
                                        {student?.register_number || studentId}
                                      </div>
                                      <div style={{ 
                                        fontSize: '7px', 
                                        color: '#f0f0f0', 
                                        maxWidth: '100%', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis' 
                                      }}>
                                        {student?.name?.substring(0, 6)}
                                      </div>
                                    </>
                                  )}
                                  
                                  {selectedAutoRule === 'custom' && selectedStudentId && !assigned && (
                                    <span style={{ 
                                      position: 'absolute', 
                                      top: '2px', 
                                      right: '2px', 
                                      fontSize: '12px' 
                                    }}>
                                      ✓
                                    </span>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                        
                        <div className="mt-3 pt-3 border-top">
                          <small className="text-muted">
                            <strong>Drag</strong> students to move | <strong>Right-click</strong> to remove | <strong>Click</strong> to select
                          </small>
                        </div>
                        
                        <div className="mt-3 text-end">
                          <button 
                            className="btn btn-success" 
                            onClick={saveAllAssignments}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!selectedSubject && (
              <div className="card p-5 text-center">
                <h6 className="text-muted mb-2">Select exam details to begin</h6>
                <p className="text-muted small">
                  Choose session → date → subject to view available halls and allocate students
                </p>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default ExamGeneration;