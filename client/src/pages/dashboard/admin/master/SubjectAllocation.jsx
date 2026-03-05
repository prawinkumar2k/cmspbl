import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../components/css/style.css";
import "./subject.css";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import SubjectAllTable from "./subjectAllTable";

const SubjectAllocation = () => {
  // Load an allocation record into the form for editing
  const loadAllocationIntoForm = (rec) => {
    setEditId(rec.id || rec.ID || rec.Id || null);
    setStaffId(rec.Staff_ID || rec.Staff_Id || '');
    setStaffName(rec.Staff_Name || '');
    setAcademicYear(rec.Academic_Year || '');
    setSemType(rec.Sem_Type || '');
    setCourseName(rec.Course_Name || '');

    // Global filters (load from Dept_Name, Dept_Code, Semester, Regulation columns)
    setMainDeptName(rec.Dept_Name || '');
    setMainDeptCode(rec.Dept_Code || '');
    setMainSemester(rec.Semester || '');
    setMainRegulation(rec.Regulation || '');

    // Subject 1
    setSub1Name(rec.Sub1_Name || '');
    setSub1Code(rec.Sub1_Code || '');
    setSub1DeptName(rec.Sub1_Dept_Name || '');
    setSub1DeptCode(rec.Sub1_Dept_Code || '');
    setSub1Semester(rec.Sub1_Semester || '');
    setSub1Regulation(rec.Sub1_Regulation || '');

    // Subject 2
    setSub2Name(rec.Sub2_Name || '');
    setSub2Code(rec.Sub2_Code || '');
    setSub2DeptName(rec.Sub2_Dept_Name || '');
    setSub2DeptCode(rec.Sub2_Dept_Code || '');
    setSub2Semester(rec.Sub2_Semester || '');
    setSub2Regulation(rec.Sub2_Regulation || '');

    // Subject 3
    setSub3Name(rec.Sub3_Name || '');
    setSub3Code(rec.Sub3_Code || '');
    setSub3DeptName(rec.Sub3_Dept_Name || '');
    setSub3DeptCode(rec.Sub3_Dept_Code || '');
    setSub3Semester(rec.Sub3_Semester || '');
    setSub3Regulation(rec.Sub3_Regulation || '');

    // Subject 4
    setSub4Name(rec.Sub4_Name || '');
    setSub4Code(rec.Sub4_Code || '');
    setSub4DeptName(rec.Sub4_Dept_Name || '');
    setSub4DeptCode(rec.Sub4_Dept_Code || '');
    setSub4Semester(rec.Sub4_Semester || '');
    setSub4Regulation(rec.Sub4_Regulation || '');

    // Subject 5
    setSub5Name(rec.Sub5_Name || '');
    setSub5Code(rec.Sub5_Code || '');
    setSub5DeptName(rec.Sub5_Dept_Name || '');
    setSub5DeptCode(rec.Sub5_Dept_Code || '');
    setSub5Semester(rec.Sub5_Semester || '');
    setSub5Regulation(rec.Sub5_Regulation || '');

    // Subject 6
    setSub6Name(rec.Sub6_Name || '');
    setSub6Code(rec.Sub6_Code || '');
    setSub6DeptName(rec.Sub6_Dept_Name || '');
    setSub6DeptCode(rec.Sub6_Dept_Code || '');
    setSub6Semester(rec.Sub6_Semester || '');
    setSub6Regulation(rec.Sub6_Regulation || '');

    // Subject 7
    setSub7Name(rec.Sub7_Name || '');
    setSub7Code(rec.Sub7_Code || '');
    setSub7DeptName(rec.Sub7_Dept_Name || '');
    setSub7DeptCode(rec.Sub7_Dept_Code || '');
    setSub7Semester(rec.Sub7_Semester || '');
    setSub7Regulation(rec.Sub7_Regulation || '');
  };
  const [staffs, setStaffs] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffSearchInput, setStaffSearchInput] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);

  const [academicYears, setAcademicYears] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const semTypes = ['Odd', 'Even'];
  const [semType, setSemType] = useState('');

  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');

  const [departments, setDepartments] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [regulationOptions, setRegulationOptions] = useState([]);

  // Global filters (for Sub1 by default)
  const [mainDeptName, setMainDeptName] = useState('');
  const [mainDeptCode, setMainDeptCode] = useState('');
  const [mainSemester, setMainSemester] = useState('');
  const [mainRegulation, setMainRegulation] = useState('');

  // Subject 1
  const [sub1Name, setSub1Name] = useState('');
  const [sub1Code, setSub1Code] = useState('');
  const [sub1DeptName, setSub1DeptName] = useState('');
  const [sub1DeptCode, setSub1DeptCode] = useState('');
  const [sub1Semester, setSub1Semester] = useState('');
  const [sub1Regulation, setSub1Regulation] = useState('');
  const [sub1Subjects, setSub1Subjects] = useState([]);

  // Subject 2
  const [sub2Name, setSub2Name] = useState('');
  const [sub2Code, setSub2Code] = useState('');
  const [sub2DeptName, setSub2DeptName] = useState('');
  const [sub2DeptCode, setSub2DeptCode] = useState('');
  const [sub2Semester, setSub2Semester] = useState('');
  const [sub2Regulation, setSub2Regulation] = useState('');
  const [sub2Subjects, setSub2Subjects] = useState([]);

  // Subject 3
  const [sub3Name, setSub3Name] = useState('');
  const [sub3Code, setSub3Code] = useState('');
  const [sub3DeptName, setSub3DeptName] = useState('');
  const [sub3DeptCode, setSub3DeptCode] = useState('');
  const [sub3Semester, setSub3Semester] = useState('');
  const [sub3Regulation, setSub3Regulation] = useState('');
  const [sub3Subjects, setSub3Subjects] = useState([]);

  // Subject 4
  const [sub4Name, setSub4Name] = useState('');
  const [sub4Code, setSub4Code] = useState('');
  const [sub4DeptName, setSub4DeptName] = useState('');
  const [sub4DeptCode, setSub4DeptCode] = useState('');
  const [sub4Semester, setSub4Semester] = useState('');
  const [sub4Regulation, setSub4Regulation] = useState('');
  const [sub4Subjects, setSub4Subjects] = useState([]);

  // Subject 5
  const [sub5Name, setSub5Name] = useState('');
  const [sub5Code, setSub5Code] = useState('');
  const [sub5DeptName, setSub5DeptName] = useState('');
  const [sub5DeptCode, setSub5DeptCode] = useState('');
  const [sub5Semester, setSub5Semester] = useState('');
  const [sub5Regulation, setSub5Regulation] = useState('');
  const [sub5Subjects, setSub5Subjects] = useState([]);

  // Subject 6
  const [sub6Name, setSub6Name] = useState('');
  const [sub6Code, setSub6Code] = useState('');
  const [sub6DeptName, setSub6DeptName] = useState('');
  const [sub6DeptCode, setSub6DeptCode] = useState('');
  const [sub6Semester, setSub6Semester] = useState('');
  const [sub6Regulation, setSub6Regulation] = useState('');
  const [sub6Subjects, setSub6Subjects] = useState([]);

  // Subject 7
  const [sub7Name, setSub7Name] = useState('');
  const [sub7Code, setSub7Code] = useState('');
  const [sub7DeptName, setSub7DeptName] = useState('');
  const [sub7DeptCode, setSub7DeptCode] = useState('');
  const [sub7Semester, setSub7Semester] = useState('');
  const [sub7Regulation, setSub7Regulation] = useState('');
  const [sub7Subjects, setSub7Subjects] = useState([]);

  const [refreshTable, setRefreshTable] = useState(0);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('staff');

  useEffect(() => {
    // fetch masters
    const fetchMasters = async () => {
      try {
        const [sRes, ayRes, cRes, semRes, regRes] = await Promise.all([
          fetch('/api/subject_allocation/master/staffs'),
          fetch('/api/subject_allocation/master/academic_year'),
          fetch('/api/subject_allocation/master/courses'),
          fetch('/api/subject_allocation/master/semester'),
          fetch('/api/subject_allocation/master/regulation'),
        ]);

        if (sRes.ok) setStaffs(await sRes.json());
        if (ayRes.ok) setAcademicYears(await ayRes.json());
        if (cRes.ok) setCourses(await cRes.json());
        if (semRes.ok) setSemesterOptions(await semRes.json());
        if (regRes.ok) setRegulationOptions(await regRes.json());
      } catch (err) {
        console.error('Failed to fetch master data', err);
      }
    };
    fetchMasters();
  }, []);

  // Fetch departments when course is selected
  useEffect(() => {
    if (!courseName) {
      setDepartments([]);
      setMainDeptName('');
      return;
    }
    const fetchDepts = async () => {
      try {
        const qs = new URLSearchParams();
        qs.append('course_name', courseName);
        const res = await fetch('/api/subject_allocation/master/departments?' + qs.toString());
        if (res.ok) {
          const data = await res.json();
          setDepartments(data);
        }
      } catch (err) {
        console.error('Failed to fetch departments', err);
        setDepartments([]);
      }
    };
    fetchDepts();
  }, [courseName]);

  // Load subjects for a specific subject slot
  const loadSubjectsForSlot = async (subjectIndex, deptCode, semester, regulation, setSubjectsFn) => {
    try {
      const qs = new URLSearchParams();
      if (deptCode) qs.append('dept_code', deptCode);
      if (semester) qs.append('semester', semester);
      if (regulation) qs.append('regulation', regulation);
      const res = await fetch('/api/subject_allocation/master/subjects?' + qs.toString());
      if (!res.ok) throw new Error('Failed to load subjects');
      const data = await res.json();
      setSubjectsFn(data);
    } catch (err) {
      console.error(err);
      setSubjectsFn([]);
    }
  };

  // Auto-fill main dept code when main dept name changes
  useEffect(() => {
    if (!mainDeptName) {
      setMainDeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === mainDeptName);
    if (match) setMainDeptCode(match.Dept_Code || '');
  }, [mainDeptName, departments]);

  // Sync Sub1 with main filters
  useEffect(() => {
    setSub1DeptName(mainDeptName);
    setSub1DeptCode(mainDeptCode);
    setSub1Semester(mainSemester);
    setSub1Regulation(mainRegulation);
  }, [mainDeptName, mainDeptCode, mainSemester, mainRegulation]);

  // Auto-fill dept code when dept name changes for each subject (Sub2-Sub5)
  useEffect(() => {
    if (!sub1DeptName) {
      setSub1DeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === sub1DeptName);
    if (match) setSub1DeptCode(match.Dept_Code || '');
  }, [sub1DeptName, departments]);

  useEffect(() => {
    if (!sub2DeptName) {
      setSub2DeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === sub2DeptName);
    if (match) setSub2DeptCode(match.Dept_Code || '');
  }, [sub2DeptName, departments]);

  useEffect(() => {
    if (!sub3DeptName) {
      setSub3DeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === sub3DeptName);
    if (match) setSub3DeptCode(match.Dept_Code || '');
  }, [sub3DeptName, departments]);

  useEffect(() => {
    if (!sub4DeptName) {
      setSub4DeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === sub4DeptName);
    if (match) setSub4DeptCode(match.Dept_Code || '');
  }, [sub4DeptName, departments]);

  useEffect(() => {
    if (!sub5DeptName) {
      setSub5DeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === sub5DeptName);
    if (match) setSub5DeptCode(match.Dept_Code || '');
  }, [sub5DeptName, departments]);

  useEffect(() => {
    if (!sub6DeptName) {
      setSub6DeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === sub6DeptName);
    if (match) setSub6DeptCode(match.Dept_Code || '');
  }, [sub6DeptName, departments]);

  useEffect(() => {
    if (!sub7DeptName) {
      setSub7DeptCode('');
      return;
    }
    const match = departments.find(d => d.Dept_Name === sub7DeptName);
    if (match) setSub7DeptCode(match.Dept_Code || '');
  }, [sub7DeptName, departments]);

  // Load subjects when filters change for each subject
  useEffect(() => {
    if (sub1DeptCode && sub1Semester && sub1Regulation) {
      loadSubjectsForSlot(1, sub1DeptCode, sub1Semester, sub1Regulation, setSub1Subjects);
    }
  }, [sub1DeptCode, sub1Semester, sub1Regulation]);

  useEffect(() => {
    if (sub2DeptCode && sub2Semester && sub2Regulation) {
      loadSubjectsForSlot(2, sub2DeptCode, sub2Semester, sub2Regulation, setSub2Subjects);
    }
  }, [sub2DeptCode, sub2Semester, sub2Regulation]);

  useEffect(() => {
    if (sub3DeptCode && sub3Semester && sub3Regulation) {
      loadSubjectsForSlot(3, sub3DeptCode, sub3Semester, sub3Regulation, setSub3Subjects);
    }
  }, [sub3DeptCode, sub3Semester, sub3Regulation]);

  useEffect(() => {
    if (sub4DeptCode && sub4Semester && sub4Regulation) {
      loadSubjectsForSlot(4, sub4DeptCode, sub4Semester, sub4Regulation, setSub4Subjects);
    }
  }, [sub4DeptCode, sub4Semester, sub4Regulation]);

  useEffect(() => {
    if (sub5DeptCode && sub5Semester && sub5Regulation) {
      loadSubjectsForSlot(5, sub5DeptCode, sub5Semester, sub5Regulation, setSub5Subjects);
    }
  }, [sub5DeptCode, sub5Semester, sub5Regulation]);

  useEffect(() => {
    if (sub6DeptCode && sub6Semester && sub6Regulation) {
      loadSubjectsForSlot(6, sub6DeptCode, sub6Semester, sub6Regulation, setSub6Subjects);
    }
  }, [sub6DeptCode, sub6Semester, sub6Regulation]);

  useEffect(() => {
    if (sub7DeptCode && sub7Semester && sub7Regulation) {
      loadSubjectsForSlot(7, sub7DeptCode, sub7Semester, sub7Regulation, setSub7Subjects);
    }
  }, [sub7DeptCode, sub7Semester, sub7Regulation]);

  // staff selection auto-fill name
  useEffect(() => {
    if (!staffId) return setStaffName('');
    const s = staffs.find(st => String(st.Staff_ID) === String(staffId));
    if (s) setStaffName(s.Staff_Name || '');
  }, [staffId, staffs]);

  const clearSubjects = () => {
    // Clear global filters
    setMainDeptName(''); setMainDeptCode('');
    setMainSemester(''); setMainRegulation('');

    // Subject 1
    setSub1Name(''); setSub1Code('');
    setSub1DeptName(''); setSub1DeptCode('');
    setSub1Semester(''); setSub1Regulation('');
    setSub1Subjects([]);

    // Subject 2
    setSub2Name(''); setSub2Code('');
    setSub2DeptName(''); setSub2DeptCode('');
    setSub2Semester(''); setSub2Regulation('');
    setSub2Subjects([]);

    // Subject 3
    setSub3Name(''); setSub3Code('');
    setSub3DeptName(''); setSub3DeptCode('');
    setSub3Semester(''); setSub3Regulation('');
    setSub3Subjects([]);

    // Subject 4
    setSub4Name(''); setSub4Code('');
    setSub4DeptName(''); setSub4DeptCode('');
    setSub4Semester(''); setSub4Regulation('');
    setSub4Subjects([]);

    // Subject 5
    setSub5Name(''); setSub5Code('');
    setSub5DeptName(''); setSub5DeptCode('');
    setSub5Semester(''); setSub5Regulation('');
    setSub5Subjects([]);

    // Subject 6
    setSub6Name(''); setSub6Code('');
    setSub6DeptName(''); setSub6DeptCode('');
    setSub6Semester(''); setSub6Regulation('');
    setSub6Subjects([]);

    // Subject 7
    setSub7Name(''); setSub7Code('');
    setSub7DeptName(''); setSub7DeptCode('');
    setSub7Semester(''); setSub7Regulation('');
    setSub7Subjects([]);
  };

  // Handle subject selection - auto-fill code
  const handleSubjectSelect = (index, name, subjectsArray) => {
    const match = subjectsArray.find(s => s.Sub_Name === name) || { Sub_Code: '' };
    const code = match.Sub_Code || '';

    switch (index) {
      case 1:
        setSub1Name(name);
        setSub1Code(code);
        break;
      case 2:
        setSub2Name(name);
        setSub2Code(code);
        break;
      case 3:
        setSub3Name(name);
        setSub3Code(code);
        break;
      case 4:
        setSub4Name(name);
        setSub4Code(code);
        break;
      case 5:
        setSub5Name(name);
        setSub5Code(code);
        break;
      case 6:
        setSub6Name(name);
        setSub6Code(code);
        break;
      case 7:
        setSub7Name(name);
        setSub7Code(code);
        break;
      default: break;
    }
  };

  // Get subject data by index
  const getSubjectData = (i) => {
    switch (i) {
      case 1: return {
        name: sub1Name, code: sub1Code,
        deptName: sub1DeptName, deptCode: sub1DeptCode,
        semester: sub1Semester, regulation: sub1Regulation,
        subjects: sub1Subjects,
        setName: setSub1Name, setDeptName: setSub1DeptName,
        setSemester: setSub1Semester, setRegulation: setSub1Regulation
      };
      case 2: return {
        name: sub2Name, code: sub2Code,
        deptName: sub2DeptName, deptCode: sub2DeptCode,
        semester: sub2Semester, regulation: sub2Regulation,
        subjects: sub2Subjects,
        setName: setSub2Name, setDeptName: setSub2DeptName,
        setSemester: setSub2Semester, setRegulation: setSub2Regulation
      };
      case 3: return {
        name: sub3Name, code: sub3Code,
        deptName: sub3DeptName, deptCode: sub3DeptCode,
        semester: sub3Semester, regulation: sub3Regulation,
        subjects: sub3Subjects,
        setName: setSub3Name, setDeptName: setSub3DeptName,
        setSemester: setSub3Semester, setRegulation: setSub3Regulation
      };
      case 4: return {
        name: sub4Name, code: sub4Code,
        deptName: sub4DeptName, deptCode: sub4DeptCode,
        semester: sub4Semester, regulation: sub4Regulation,
        subjects: sub4Subjects,
        setName: setSub4Name, setDeptName: setSub4DeptName,
        setSemester: setSub4Semester, setRegulation: setSub4Regulation
      };
      case 5: return {
        name: sub5Name, code: sub5Code,
        deptName: sub5DeptName, deptCode: sub5DeptCode,
        semester: sub5Semester, regulation: sub5Regulation,
        subjects: sub5Subjects,
        setName: setSub5Name, setDeptName: setSub5DeptName,
        setSemester: setSub5Semester, setRegulation: setSub5Regulation
      };
      case 6: return {
        name: sub6Name, code: sub6Code,
        deptName: sub6DeptName, deptCode: sub6DeptCode,
        semester: sub6Semester, regulation: sub6Regulation,
        subjects: sub6Subjects,
        setName: setSub6Name, setDeptName: setSub6DeptName,
        setSemester: setSub6Semester, setRegulation: setSub6Regulation
      };
      case 7: return {
        name: sub7Name, code: sub7Code,
        deptName: sub7DeptName, deptCode: sub7DeptCode,
        semester: sub7Semester, regulation: sub7Regulation,
        subjects: sub7Subjects,
        setName: setSub7Name, setDeptName: setSub7DeptName,
        setSemester: setSub7Semester, setRegulation: setSub7Regulation
      };
      default: return null;
    }
  };

  // submit allocation
  const handleSave = async (e) => {
    e.preventDefault();
    // Validation: required staff and academic fields
    const requiredFields = [
      { value: staffId, label: 'Staff ID' },
      { value: academicYear, label: 'Academic Year' },
      { value: semType, label: 'Sem Type' },
      { value: courseName, label: 'Course Name' },
    ];

    const firstMissing = requiredFields.find(f => !f.value || String(f.value).trim() === '');
    if (firstMissing) {
      toast.error(`${firstMissing.label} is required.`);
      return;
    }

    // At least one subject must be selected
    const anySubjectSelected = sub1Name || sub2Name || sub3Name || sub4Name || sub5Name || sub6Name || sub7Name;
    if (!anySubjectSelected) {
      toast.error('Select at least one subject');
      return;
    }

    // Helper to convert empty string to null
    const toNull = v => (v === '' || v === undefined) ? null : v;

    // Gather all subjects with their meta
    const payload = {
      Staff_Id: toNull(staffId),
      Staff_Name: toNull(staffName),
      Academic_Year: toNull(academicYear),
      Sem_Type: toNull(semType),
      Course_Name: toNull(courseName),

      // Global filters
      Dept_Name: toNull(mainDeptName),
      Dept_Code: toNull(mainDeptCode),
      Semester: toNull(mainSemester),
      Regulation: toNull(mainRegulation),

      // Subject 1
      Sub1_Name: toNull(sub1Name),
      Sub1_Code: toNull(sub1Code),
      Sub1_Dept_Code: toNull(sub1DeptCode),
      Sub1_Dept_Name: toNull(sub1DeptName),
      Sub1_Semester: toNull(sub1Semester),
      Sub1_Regulation: toNull(sub1Regulation),

      // Subject 2
      Sub2_Name: toNull(sub2Name),
      Sub2_Code: toNull(sub2Code),
      Sub2_Dept_Code: toNull(sub2DeptCode),
      Sub2_Dept_Name: toNull(sub2DeptName),
      Sub2_Semester: toNull(sub2Semester),
      Sub2_Regulation: toNull(sub2Regulation),

      // Subject 3
      Sub3_Name: toNull(sub3Name),
      Sub3_Code: toNull(sub3Code),
      Sub3_Dept_Code: toNull(sub3DeptCode),
      Sub3_Dept_Name: toNull(sub3DeptName),
      Sub3_Semester: toNull(sub3Semester),
      Sub3_Regulation: toNull(sub3Regulation),

      // Subject 4
      Sub4_Name: toNull(sub4Name),
      Sub4_Code: toNull(sub4Code),
      Sub4_Dept_Code: toNull(sub4DeptCode),
      Sub4_Dept_Name: toNull(sub4DeptName),
      Sub4_Semester: toNull(sub4Semester),
      Sub4_Regulation: toNull(sub4Regulation),

      // Subject 5
      Sub5_Name: toNull(sub5Name),
      Sub5_Code: toNull(sub5Code),
      Sub5_Dept_Code: toNull(sub5DeptCode),
      Sub5_Dept_Name: toNull(sub5DeptName),
      Sub5_Semester: toNull(sub5Semester),
      Sub5_Regulation: toNull(sub5Regulation),

      // Subject 6
      Sub6_Name: toNull(sub6Name),
      Sub6_Code: toNull(sub6Code),
      Sub6_Dept_Code: toNull(sub6DeptCode),
      Sub6_Dept_Name: toNull(sub6DeptName),
      Sub6_Semester: toNull(sub6Semester),
      Sub6_Regulation: toNull(sub6Regulation),

      // Subject 7
      Sub7_Name: toNull(sub7Name),
      Sub7_Code: toNull(sub7Code),
      Sub7_Dept_Code: toNull(sub7DeptCode),
      Sub7_Dept_Name: toNull(sub7DeptName),
      Sub7_Semester: toNull(sub7Semester),
      Sub7_Regulation: toNull(sub7Regulation),
    };

    // Send payload to server
    try {
      let res;
      if (editId) {
        // Edit mode: update existing record
        res = await fetch(`/api/subject_allocation/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Add mode: create new record
        res = await fetch('/api/subject_allocation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) {
        const err = await res.json();
        toast.error('Backend error: ' + (err.error || 'Unknown error'));
        return;
      }
      toast.success(editId ? 'Subject allocation updated!' : 'Subject allocation saved!', { autoClose: 2000 });
      setRefreshTable(r => r + 1);
      clearSubjects();
      setEditId(null);
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Subject Allocation</h6>
            </div>

            <div className="card h-100 p-0 radius-12">
              {/* Tab Navigation */}
              <div className="card-header border-bottom-0 p-24 pb-0">
                <div className="nav-tabs-wrapper">
                  <nav className="nav nav-tabs flex-nowrap gap-3" role="tablist">
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'staff' ? 'active' : ''}`}
                      onClick={() => setActiveTab('staff')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:account-outline" className="me-2"></iconify-icon>
                      Staff & Academic
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'subjects' ? 'active' : ''}`}
                      onClick={() => setActiveTab('subjects')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:book-outline" className="me-2"></iconify-icon>
                      Subject Details
                    </button>
                  </nav>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                <form onSubmit={handleSave}>
                  {/* TAB 1: Staff & Academic Details */}
                  {activeTab === 'staff' && (
                    <div className="row g-3">
                      <div className="col-12 mb-0"><h6>Staff Details</h6></div>
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Staff ID</label> <span className="text-danger">*</span>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Staff ID or Name"
                            value={staffSearchInput}
                            onChange={(e) => {
                              setStaffSearchInput(e.target.value);
                              setShowStaffDropdown(true);
                            }}
                            onFocus={() => setShowStaffDropdown(true)}
                            onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                          />
                          {staffId && (
                            <button
                              type="button"
                              className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y"
                              onClick={() => {
                                setStaffId('');
                                setStaffName('');
                                setStaffSearchInput('');
                              }}
                              title="Clear selection"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                          {showStaffDropdown && staffs.length > 0 && (
                            <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                              {staffs
                                .filter(staff =>
                                  staff.Staff_ID.toLowerCase().includes(staffSearchInput.toLowerCase()) ||
                                  staff.Staff_Name.toLowerCase().includes(staffSearchInput.toLowerCase())
                                )
                                .map((staff) => (
                                  <button
                                    key={staff.Staff_ID}
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                      setStaffId(staff.Staff_ID);
                                      setStaffName(staff.Staff_Name);
                                      setStaffSearchInput(staff.Staff_ID);
                                      setShowStaffDropdown(false);
                                    }}
                                  >
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <div className="fw-semibold">{staff.Staff_ID}</div>
                                        <div className="small text-muted">{staff.Staff_Name}</div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Staff Name</label> <span className="text-danger">*</span>
                        <input className="form-control" value={staffName} readOnly />
                      </div>

                      <div className="col-12 mt-3"><h6>Academic Details</h6></div>
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Academic Year</label> <span className="text-danger">*</span>
                        <select className="form-select" value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
                          <option value="">Select Year</option>
                          {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Sem Type</label> <span className="text-danger">*</span>
                        <select className="form-select" value={semType} onChange={e => setSemType(e.target.value)}>
                          <option value="">Select</option>
                          {semTypes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Course Name</label> <span className="text-danger">*</span>
                        <select className="form-select" value={courseName} onChange={e => setCourseName(e.target.value)}>
                          <option value="">Select Course</option>
                          {courses.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Dept Name</label> <span className="text-danger">*</span>
                        <select
                          className="form-select"
                          value={mainDeptName}
                          onChange={e => setMainDeptName(e.target.value)}
                          disabled={!courseName}
                        >
                          <option value="">Select Dept</option>
                          {departments.map(d => <option key={d.Dept_Code} value={d.Dept_Name}>{d.Dept_Name}</option>)}
                        </select>
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Dept Code</label>
                        <input className="form-control" value={mainDeptCode} readOnly />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Semester</label> <span className="text-danger">*</span>
                        <select
                          className="form-select"
                          value={mainSemester}
                          onChange={e => setMainSemester(e.target.value)}
                        >
                          <option value="">Select Semester</option>
                          {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label">Regulation</label> <span className="text-danger">*</span>
                        <select
                          className="form-select"
                          value={mainRegulation}
                          onChange={e => setMainRegulation(e.target.value)}
                        >
                          <option value="">Select Regulation</option>
                          {regulationOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Subject Details */}
                  {activeTab === 'subjects' && (
                    <div className="row g-3">
                      <div className="col-12 mt-3"><h6>Subject Details</h6> <span className="">(select atleast one subject)</span></div>
                      {[1, 2, 3, 4, 5, 6, 7].map(i => {
                        const subData = getSubjectData(i);
                        if (!subData) return null;

                        return (
                          <React.Fragment key={i}>
                            <div className="col-12 mt-3 mb-2">
                              <strong>Subject {i}</strong>
                              {i === 1 && <span className="text-muted ms-2">(Uses global filters above)</span>}
                            </div>

                            {/* For Sub1, show read-only fields as it uses global filters */}
                            {i === 1 ? (
                              <>
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Dept Name</label>
                                  <input className="form-control" value={subData.deptName} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                                </div>
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Dept Code</label>
                                  <input className="form-control" value={subData.deptCode} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                                </div>
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Semester</label>
                                  <input className="form-control" value={subData.semester} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                                </div>
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Regulation</label>
                                  <input className="form-control" value={subData.regulation} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                                </div>
                              </>
                            ) : (
                              <>
                                {/* For Sub2-Sub5, show editable dropdowns */}
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Dept Name</label>
                                  <select
                                    className="form-select"
                                    value={subData.deptName}
                                    onChange={e => subData.setDeptName(e.target.value)}
                                  >
                                    <option value="">Select Dept</option>
                                    {departments.map(d => <option key={d.Dept_Code} value={d.Dept_Name}>{d.Dept_Name}</option>)}
                                  </select>
                                </div>
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Dept Code</label>
                                  <input className="form-control" value={subData.deptCode} readOnly />
                                </div>
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Semester</label>
                                  <select
                                    className="form-select"
                                    value={subData.semester}
                                    onChange={e => subData.setSemester(e.target.value)}
                                  >
                                    <option value="">Select Semester</option>
                                    {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </div>
                                <div className="col-12 col-md-3">
                                  <label className="form-label">Regulation</label>
                                  <select
                                    className="form-select"
                                    value={subData.regulation}
                                    onChange={e => subData.setRegulation(e.target.value)}
                                  >
                                    <option value="">Select Regulation</option>
                                    {regulationOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                  </select>
                                </div>
                              </>
                            )}

                            {/* Subject Name */}
                            <div className="col-12 col-md-6">
                              <label className="form-label">Subject Name</label>
                              <select
                                className="form-select"
                                value={subData.name}
                                onChange={e => handleSubjectSelect(i, e.target.value, subData.subjects)}
                                disabled={!subData.deptCode || !subData.semester || !subData.regulation}
                              >
                                <option value="">Select Subject</option>
                                {subData.subjects.map(s => (
                                  <option key={s.Sub_Code} value={s.Sub_Name}>{s.Sub_Name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Subject Code (auto-filled) */}
                            <div className="col-12 col-md-6">
                              <label className="form-label">Subject Code</label>
                              <input className="form-control" value={subData.code} readOnly />
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-3 mt-24 mb-3 pt-24 border-top border-neutral-200">
                    <button type="submit" className="btn btn-outline-success">{editId ? 'Update Allocation' : 'Save Allocation'}</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => { clearSubjects(); setEditId(null); }}>Cancel Edit</button>
                    <button type="button" className="btn btn-outline-primary" onClick={clearSubjects}>Clear Subjects</button>
                  </div>
                </form>

                <>
                  <hr />
                  <SubjectAllTable refreshTrigger={refreshTable} onEditRecord={loadAllocationIntoForm} />
                </>

              </div>
            </div>

          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default SubjectAllocation;
