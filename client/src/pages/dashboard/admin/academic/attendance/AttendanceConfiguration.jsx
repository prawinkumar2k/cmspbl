import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';
import axios from 'axios';

const AttendanceConfiguration = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    deptName: '',
    deptCode: '',
    semester: '',
    year: '',
    regulation: '',
    subName: '',
    subCode: '',
    subType: '',
    totalHours: ''
  });

  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [editId, setEditId] = useState(null);
  const [subjectCodeExists, setSubjectCodeExists] = useState(false);
  const [checkingSubjectCode, setCheckingSubjectCode] = useState(false);

  useEffect(() => {
    axios.get('/api/attendanceConfig/courses')
      .then(res => setCourses(res.data))
      .catch(() => toast.error('Failed to load courses'));
    axios.get('/api/attendanceConfig/regulations')
      .then(res => setRegulations(res.data))
      .catch(() => toast.error('Failed to load regulations'));
    axios.get('/api/attendanceConfig/semesters')
      .then(res => setSemesters(res.data))
      .catch(() => toast.error('Failed to load semesters'));
  }, []);

  useEffect(() => {
    if (formData.courseName) {
      fetch(`/api/attendanceConfig/departments?courseName=${formData.courseName}`)
        .then(res => res.json())
        .then(setDepartments);
    }
  }, [formData.courseName]);

  useEffect(() => {
    const dept = departments.find(d => d.Dept_Name === formData.deptName);
    setFormData(f => ({ ...f, deptCode: dept ? dept.Dept_Code : '' }));
  }, [formData.deptName, departments]);

  useEffect(() => {
    if (formData.semester) {
      fetch(`/api/attendanceConfig/year-regulation?semester=${formData.semester}`)
        .then(res => res.json())
        .then(data => {
          setFormData(f => ({
            ...f,
            year: data.Year || '',
            regulation: data.Regulation || ''
          }));
        });
    }
  }, [formData.semester]);

  useEffect(() => {
    const { deptCode, semester, regulation } = formData;
    if (deptCode && semester && regulation) {
      fetch(`/api/attendanceConfig/subjects-filtered?deptCode=${deptCode}&semester=${semester}&regulation=${regulation}`)
        .then(res => res.json())
        .then(data => setSubjects(Array.isArray(data) ? data : []))
        .catch(() => setSubjects([]));
    } else {
      setSubjects([]);
    }
  }, [formData.deptCode, formData.semester, formData.regulation]);

  useEffect(() => {
    const subject = subjects.find(s => s.Sub_Name === formData.subName);
    setFormData(f => ({
      ...f,
      subCode: subject ? subject.Sub_Code : '',
      subType: subject ? subject.Sub_Type : ''
    }));
  }, [formData.subName, subjects]);

  const validateSubjectCode = async (code) => {
    if (!code || !formData.courseName) {
      setSubjectCodeExists(false);
      return;
    }
    setCheckingSubjectCode(true);
    try {
      const params = new URLSearchParams({ subCode: code, deptCode: formData.deptCode });
      if (editId) params.append('excludeId', editId);
      const res = await axios.get(`/api/attendanceConfig/check-subject-code?${params.toString()}`);
      setSubjectCodeExists(res.data.exists);
      if (res.data.exists) {
        toast.error('This subject code is already configured for this course!');
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setCheckingSubjectCode(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'courseName') {
        const selectedCourse = courses.find(c => c.Course === value);
        newData.deptName = selectedCourse ? selectedCourse['Dept Name'] : '';
        newData.deptCode = selectedCourse ? selectedCourse['Dept_Code'] : '';
        setSubjectCodeExists(false);
      }
      if (name === 'semester') {
        const selectedSem = semesters.find(s => String(s.Semester) === String(value));
        newData.year = selectedSem ? selectedSem.Year : '';
      }
      if (name === 'subName') {
        const selectedSub = subjects.find(s => s.Sub_Name === value);
        newData.subCode = selectedSub ? selectedSub.Sub_Code : '';
        newData.subType = selectedSub ? selectedSub.Sub_Type : '';
        setSubjectCodeExists(false);
      }
      return newData;
    });
  };

  useEffect(() => {
    if (formData.subCode) {
      validateSubjectCode(formData.subCode);
    } else {
      setSubjectCodeExists(false);
    }
  }, [formData.subCode, editId]);

  const fetchConfigurations = useCallback(() => {
    setLoading(true);
    axios.get('/api/attendanceConfig/list')
      .then(res => {
        // Map backend columns to frontend keys and calculate year from semester
        const mapped = res.data.map((row, idx) => {
          const semData = semesters.find(s => String(s.Semester) === String(row.Semester));
          return {
            id: row.id || idx + 1,
            courseName: row.Course_Name,
            deptName: row.Dept_Name,
            deptCode: row.Dept_Code,
            semester: row.Semester,
            year: semData ? semData.Year : '',
            regulation: row.Regulation,
            subName: row.Sub_Name,
            subCode: row.Sub_Code,
            subType: row.Sub_Type,
            totalHours: row.TotalHours
          };
        });
        setConfigurations(mapped);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load configurations');
        toast.error('Failed to load configurations');
      })
      .finally(() => setLoading(false));
  }, [semesters]);

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjectCodeExists) {
      toast.error('This subject code is already configured for this course!', { autoClose: 2000 });
      return;
    }
    if (checkingSubjectCode) {
      toast.info('Checking subject code uniqueness, please wait...', { autoClose: 2000 });
      return;
    }
    if (!formData.semester || !formData.regulation ||
        !formData.courseName || !formData.totalHours) {
      toast.error('Please fill all required fields', { autoClose: 2000 });
      return;
    }
    const payload = {
      courseName: formData.courseName,
      deptName: formData.deptName,
      deptCode: formData.deptCode,
      semester: formData.semester,
      regulation: formData.regulation,
      subName: formData.subName,
      subCode: formData.subCode,
      subType: formData.subType,
      totalHours: formData.totalHours
    };
    try {
      if (editId) {
        await axios.put(`/api/attendanceConfig/${editId}`, payload);
        toast.success('Configuration updated successfully!', { autoClose: 2000 });
      } else {
        await axios.post('/api/attendanceConfig/save', payload);
        toast.success('Configuration added successfully!', { autoClose: 2000 });
      }
      fetchConfigurations();
      setFormData({
        courseName: '',
        deptName: '',
        deptCode: '',
        semester: '',
        year: '',
        regulation: '',
        subName: '',
        subCode: '',
        subType: '',
        totalHours: ''
      });
      setEditId(null);
      setSubjectCodeExists(false);
    } catch (err) {
      toast.error('Failed to save configuration', { autoClose: 2000 });
    }
  };

  const columns = [
    { accessorKey: 'sno', header: 'S.No', cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div> },
    { accessorKey: 'courseName', header: 'Course Name', cell: ({ row }) => <div className="fw-medium">{row.original.courseName}</div> },
    { accessorKey: 'deptName', header: 'Department Name', cell: ({ row }) => <div className="fw-medium">{row.original.deptName}</div> },
    { accessorKey: 'deptCode', header: 'Department Code', cell: ({ row }) => <div className="fw-medium">{row.original.deptCode}</div> },
    { accessorKey: 'semester', header: 'Semester', cell: ({ row }) => <div className="fw-medium">{row.original.semester}</div> },
    { accessorKey: 'regulation', header: 'Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.regulation}</div> },
    { accessorKey: 'subName', header: 'Subject Name', cell: ({ row }) => <div className="fw-medium">{row.original.subName}</div> },
    { accessorKey: 'subCode', header: 'Subject Code', cell: ({ row }) => <div className="fw-medium">{row.original.subCode}</div> },
    { accessorKey: 'subType', header: 'Subject Type', cell: ({ row }) => <div className="fw-medium">{row.original.subType}</div> },
    { accessorKey: 'totalHours', header: 'Total Hours', cell: ({ row }) => <div className="fw-medium">{row.original.totalHours}</div> }
  ];

  const handleEdit = async (config) => {
    setEditId(config.id);

    // Set form data first to avoid timing issues
    setFormData({
      courseName: config.courseName || '',
      deptName: config.deptName || '',
      deptCode: config.deptCode || '',
      semester: config.semester || '',
      year: config.year || '',
      regulation: config.regulation || '',
      subName: config.subName || '',
      subCode: config.subCode || '',
      subType: config.subType || '',
      totalHours: config.totalHours || ''
    });

    // Ensure regulations are loaded
    if (!regulations.length) {
      try {
        const regRes = await axios.get('/api/attendanceConfig/regulations');
        setRegulations(regRes.data);
      } catch (err) {
        console.error('Error fetching regulations:', err);
      }
    }

    // Fetch departments for selected course
    if (config.courseName) {
      try {
        const deptRes = await fetch(`/api/attendanceConfig/departments?courseName=${config.courseName}`);
        const deptData = await deptRes.json();
        setDepartments(deptData);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    }

    // Fetch subjects for selected dept, semester, regulation
    if (config.deptCode && config.semester && config.regulation) {
      try {
        const subRes = await fetch(`/api/attendanceConfig/subjects-filtered?deptCode=${config.deptCode}&semester=${config.semester}&regulation=${config.regulation}`);
        const subData = await subRes.json();
        setSubjects(Array.isArray(subData) ? subData : []);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    }

    toast.info('Configuration loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (config) => {
    toast.dismiss();
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={async () => {
                try {
                  await axios.delete(`/api/attendanceConfig/${config.id}`);
                  toast.success('Configuration deleted successfully', { autoClose: 2000 });
                  fetchConfigurations();
                } catch (err) {
                  toast.error('Failed to delete configuration');
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
              <h6 className="fw-semibold mb-0">Attendance Configuration</h6>
            </div>
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Course Name */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Course Name <span className="text-danger">*</span></label>
                      <select className="form-select" name="courseName" value={formData.courseName} onChange={handleInputChange} required>
                        <option value="">Select Course</option>
                        {courses.map((course, idx) => (
                          <option key={course.Course_Name + idx} value={course.Course_Name}>{course.Course_Name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Department Name */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Department Name <span className="text-danger">*</span></label>
                      <select className="form-select" name="deptName" value={formData.deptName} onChange={handleInputChange} required disabled={departments.length === 0}>
                        <option value="">Select Department</option>
                        {formData.deptName && !departments.find(d => d.Dept_Name === formData.deptName) && (
                          <option value={formData.deptName} disabled>{formData.deptName}</option>
                        )}
                        {departments.map((dept, idx) => (
                          <option key={dept.Dept_Code + idx} value={dept.Dept_Name}>{dept.Dept_Name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Department Code */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Department Code</label>
                      <input type="text" className="form-control" value={formData.deptCode} readOnly />
                    </div>
                    {/* Semester */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Semester <span className="text-danger">*</span></label>
                      <select className="form-select" name="semester" value={formData.semester} onChange={handleInputChange} required>
                        <option value="">Select Semester</option>
                        {semesters.map(sem => (
                          <option key={sem.Semester} value={sem.Semester}>{sem.Semester}</option>
                        ))}
                      </select>
                    </div>
                    {/* Year */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Year</label>
                      <input type="text" className="form-control" value={formData.year} readOnly />
                    </div>
                    {/* Regulation */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Regulation <span className="text-danger">*</span></label>
                      <select className="form-select" name="regulation" value={formData.regulation} onChange={handleInputChange} required>
                        <option value="">Select Regulation</option>
                        {formData.regulation && !regulations.includes(formData.regulation) && (
                          <option value={formData.regulation} disabled>{formData.regulation}</option>
                        )}
                        {regulations.map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>
                    {/* Subject Name */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className={`form-label fw-semibold${subjectCodeExists ? ' text-danger' : ''}`}>Subject Name <span className="text-danger">*</span></label>
                      <select className="form-select" name="subName" value={formData.subName} onChange={handleInputChange} required disabled={!Array.isArray(subjects) || subjects.length === 0}>
                        <option value="">Select Subject</option>
                        {formData.subName && !subjects.find(s => s.Sub_Name === formData.subName) && (
                          <option value={formData.subName} disabled>{formData.subName}</option>
                        )}
                        {(Array.isArray(subjects) ? subjects : []).map(sub => (
                          <option key={sub.Sub_Code} value={sub.Sub_Name}>{sub.Sub_Name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Subject Code */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className={`form-label fw-semibold${subjectCodeExists ? ' text-danger' : ''}`}>Subject Code <span className="text-danger">*</span></label>
                      <input type="text" className={`form-control${subjectCodeExists ? ' is-invalid' : ''}`} name="subCode" value={formData.subCode} readOnly />
                    </div>
                    {/* Subject Type */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Subject Type</label>
                      <input type="text" className="form-control" value={formData.subType} readOnly />
                    </div>
                    {/* Total Hours */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Total Hours <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" name="totalHours" value={formData.totalHours} onChange={handleInputChange} min="1" required />
                    </div>
                    {/* Submit Button */}
                    <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                      <button type="submit" className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                        title={subjectCodeExists ? 'Subject code already exists' : checkingSubjectCode ? 'Checking subject code...' : 'Save attendance configuration'}
                        disabled={subjectCodeExists || checkingSubjectCode}>
                        {checkingSubjectCode ? 'Checking...' : editId ? 'Update' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <DataTable
              data={configurations}
              columns={columns}
              loading={loading}
              error={error}
              title="Attendance Configurations"
              onEdit={handleEdit}
              onDelete={handleDelete}
              enableExport={false}
              enableSelection={true}
              pageSize={10}
            />
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default AttendanceConfiguration;
