import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';

const ASSESSMENT_TYPES = [
  'Assignment',
  'Practical',
  'Unit Test'
];

const AssesmentConfiguration = () => {
  // Form state
  const [formData, setFormData] = useState({
    deptId: '',
    branch: '',
    branchCode: '',
    semesterId: '',
    semester: '',
    regulationId: '',
    regulation: '',
    courseId: '',
    courseName: '',
    section: '',
    subjectId: '',
    subjectName: '',
    subjectCode: '',
    assessmentType: '',
    assessmentDate: '',
    maxMarks: '',
    testNo: '',
    experimentCount: ''
  });

  // Master data state
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Search and dropdown state
  const [subjectSearchInput, setSubjectSearchInput] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  // Table state
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, semRes, regRes, courseRes] = await Promise.all([
          fetch('/api/assConfig/departments'),
          fetch('/api/assConfig/semesters'),
          fetch('/api/assConfig/regulations'),
          fetch('/api/assConfig/courses')
        ]);

        const [deptData, semData, regData, courseData] = await Promise.all([
          deptRes.json(),
          semRes.json(),
          regRes.json(),
          courseRes.json()
        ]);

        setDepartments(deptData);
        setSemesters(semData);
        setRegulations(regData);
        setCourses(courseData);
        
        // Set default course to Pharmacy
        const pharmacyCourse = courseData.find(c => c.name === 'Pharmacy');
        if (pharmacyCourse) {
          setFormData(prev => ({ ...prev, courseId: pharmacyCourse.id, courseName: 'Pharmacy' }));
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
        toast.error('Failed to load master data');
      }
    };

    fetchMasterData();
  }, []);

  // Fetch subjects when dept, semester, regulation, and assessment type are selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.branchCode || !formData.semester || !formData.regulation) {
        setSubjects([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          deptCode: formData.branchCode,
          semester: formData.semester,
          regulation: formData.regulation
        });
        
        if (formData.assessmentType) {
          params.append('assessmentType', formData.assessmentType);
        }
        
        const response = await fetch(`/api/assConfig/subjects?${params.toString()}`);
        const data = await response.json();
        setSubjects(data);
        setSubjectSearchInput('');
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to load subjects');
      }
    };

    fetchSubjects();
  }, [formData.branchCode, formData.semester, formData.regulation, formData.assessmentType]);

  // Fetch sections when dept, semester, and regulation are selected
  useEffect(() => {
    const fetchSections = async () => {
      if (formData.deptId && formData.semesterId && formData.regulationId) {
        try {
          const response = await fetch(
            `/api/assConfig/sections?deptId=${formData.deptId}&semesterId=${formData.semesterId}&regulationId=${formData.regulationId}`
          );
          const data = await response.json();
          setSections(data);
          
          // Reset section if current selection is not in new list
          if (formData.section && !data.find(s => s.section === formData.section)) {
            setFormData(prev => ({ ...prev, section: '' }));
          }
        } catch (error) {
          console.error('Error fetching sections:', error);
          setSections([]);
        }
      } else {
        setSections([]);
        setFormData(prev => ({ ...prev, section: '' }));
      }
    };

    fetchSections();
  }, [formData.deptId, formData.semesterId, formData.regulationId]);

  // Auto-fetch next test number when all required fields are selected
  useEffect(() => {
    const fetchNextTestNumber = async () => {
      // Only fetch if not in edit mode and all required fields are filled
      if (editMode || !formData.branchCode || !formData.semester || !formData.regulation || 
          !formData.section || !formData.subjectCode || !formData.assessmentType) {
        return;
      }

      try {
        const response = await fetch(
          `/api/assConfig/next-test-number?deptCode=${formData.branchCode}&semester=${formData.semester}&regulation=${formData.regulation}&section=${formData.section}&subjectCode=${formData.subjectCode}&assessmentType=${formData.assessmentType}`
        );
        const data = await response.json();
        
        if (data.nextTestNo) {
          setFormData(prev => ({ ...prev, testNo: data.nextTestNo.toString() }));
        }
      } catch (error) {
        console.error('Error fetching next test number:', error);
      }
    };

    fetchNextTestNumber();
  }, [formData.branchCode, formData.semester, formData.regulation, formData.section, formData.subjectCode, formData.assessmentType, editMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Handle subject selection
      if (name === 'subjectId') {
        const selectedSubject = subjects.find(sub => sub.id === parseInt(value));
        return {
          ...prev,
          subjectId: value,
          subjectName: selectedSubject ? selectedSubject.subjectName : '',
          subjectCode: selectedSubject ? selectedSubject.subjectCode : ''
        };
      }
      
      const newData = { ...prev, [name]: value };
      
      // Auto-fill department details
      if (name === 'deptId') {
        const selectedDept = departments.find(d => d.id == value);
        if (selectedDept) {
          newData.branch = selectedDept.name;
          newData.branchCode = selectedDept.code;
        }
      }
      
      // Auto-fill semester details
      if (name === 'semesterId') {
        const selectedSem = semesters.find(s => s.id == value);
        if (selectedSem) {
          newData.semester = selectedSem.semester;
        }
      }
      
      // Auto-fill regulation details
      if (name === 'regulationId') {
        const selectedReg = regulations.find(r => r.id == value);
        if (selectedReg) {
          newData.regulation = selectedReg.regulation;
        }
      }
      
      // Auto-fill course details
      if (name === 'courseId') {
        const selectedCourse = courses.find(c => c.id == value);
        if (selectedCourse) {
          newData.courseName = selectedCourse.name;
        }
      }
      
      return newData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.deptId || !formData.semesterId || !formData.regulationId || 
        !formData.courseId || !formData.section || !formData.subjectId ||
        !formData.assessmentType || !formData.assessmentDate || !formData.maxMarks || 
        !formData.testNo || (formData.assessmentType === 'Practical' && !formData.experimentCount)) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const url = editMode 
        ? `/api/assConfig/configs/${editId}` 
        : '/api/assConfig/configs';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deptId: formData.deptId,
          semesterId: formData.semesterId,
          regulationId: formData.regulationId,
          courseId: formData.courseId,
          section: formData.section,
          subjectId: formData.subjectId,
          subjectName: formData.subjectName,
          subjectCode: formData.subjectCode,
          assessmentType: formData.assessmentType,
          assessmentDate: formData.assessmentDate,
          maxMarks: formData.maxMarks,
          testNo: formData.testNo,
          experimentCount: formData.assessmentType === 'Practical' ? formData.experimentCount : null
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editMode ? 'update' : 'create'} assessment configuration`);
      }

      toast.success(`Assessment configuration ${editMode ? 'updated' : 'added'} successfully`);
      
      // Reload configurations
      fetchConfigurations();

      // Reset form
      setFormData({
        deptId: '',
        branch: '',
        branchCode: '',
        semesterId: '',
        semester: '',
        regulationId: '',
        regulation: '',
        courseId: '',
        courseName: '',
        section: '',
        subjectId: '',
        subjectName: '',
        subjectCode: '',
        assessmentType: '',
        assessmentDate: '',
        maxMarks: '',
        testNo: '',
        experimentCount: ''
      });
      
      // Reset edit mode
      setEditMode(false);
      setEditId(null);
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} assessment configuration:`, error);
      toast.error(`Failed to ${editMode ? 'update' : 'create'} assessment configuration`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch configurations from API
  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assConfig/configs');
      if (!response.ok) {
        throw new Error('Failed to fetch configurations');
      }
      const data = await response.json();
      setConfigurations(data);
    } catch (error) {
      console.error('Error fetching configurations:', error);
      toast.error('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'courseName',
      header: 'Course Name',
      cell: ({ row }) => <div className="fw-medium">{row.original.courseName}</div>,
    },
    {
      accessorKey: 'branch',
      header: 'Department',
      cell: ({ row }) => <div className="fw-medium">{row.original.branch}</div>,
    },
    {
      accessorKey: 'branchCode',
      header: 'Department Code',
      cell: ({ row }) => <div className="fw-medium">{row.original.branchCode}</div>,
    },
    {
      accessorKey: 'semester',
      header: 'Semester',
      cell: ({ row }) => <div className="fw-medium">{row.original.semester}</div>,
    },
    {
      accessorKey: 'regulation',
      header: 'Regulation',
      cell: ({ row }) => <div className="fw-medium">{row.original.regulation}</div>,
    },
    {
      accessorKey: 'section',
      header: 'Section',
      cell: ({ row }) => <div className="fw-medium">{row.original.section}</div>,
    },
    {
      accessorKey: 'subjectName',
      header: 'Subject Name',
      cell: ({ row }) => <div className="fw-medium">{row.original.subjectName}</div>,
    },
    {
      accessorKey: 'subjectCode',
      header: 'Subject Code',
      cell: ({ row }) => <div className="fw-medium">{row.original.subjectCode}</div>,
    },
    {
      accessorKey: 'assessmentType',
      header: 'Assessment Type',
      cell: ({ row }) => <div className="fw-medium">{row.original.assessmentType}</div>,
    },
    {
      accessorKey: 'assessmentDate',
      header: 'Assessment Date',
      cell: ({ row }) => <div className="fw-medium">{new Date(row.original.assessmentDate).toLocaleDateString()}</div>,
    },
    {
      accessorKey: 'maxMarks',
      header: 'Max Marks',
      cell: ({ row }) => <div className="fw-medium">{row.original.maxMarks}</div>,
    },
    {
      accessorKey: 'testNo',
      header: 'Test No',
      cell: ({ row }) => <div className="fw-medium">{row.original.testNo}</div>,
    },
    {
      accessorKey: 'experimentCount',
      header: 'Experiment Count',
      cell: ({ row }) => (
        <div className="fw-medium">
          {row.original.assessmentType === 'Practical' ? row.original.experimentCount : '-'}
        </div>
      ),
    }
  ];

  // Load initial configurations
  useEffect(() => {
    fetchConfigurations();
  }, []);

  // Handle row actions
  const handleView = (config) => {
    toast.success(`Viewing assessment configuration for ${config.courseName}`);
  };

  const handleEdit = async (config) => {
    try {
      // Find the IDs from master data based on the config values
      const course = courses.find(c => c.name === config.courseName);
      const dept = departments.find(d => d.name === config.branch);
      const semester = semesters.find(s => s.semester === config.semester);
      const regulation = regulations.find(r => r.regulation === config.regulation);
      
      // Fetch subjects for this specific combination
      let subjectId = '';
      if (config.branchCode && config.semester && config.regulation) {
        try {
          const subjectsResponse = await fetch(
            `/api/assConfig/subjects?deptCode=${config.branchCode}&semester=${config.semester}&regulation=${config.regulation}`
          );
          if (subjectsResponse.ok) {
            const fetchedSubjects = await subjectsResponse.json();
            setSubjects(fetchedSubjects);
            
            // Find the matching subject by subject code
            const matchingSubject = fetchedSubjects.find(
              sub => sub.subjectCode === config.subjectCode
            );
            subjectId = matchingSubject?.id || '';
          }
        } catch (error) {
          console.error('Error fetching subjects for edit:', error);
        }
      }
      
      // Fetch sections for this specific combination
      if (dept?.id && semester?.id && regulation?.id) {
        try {
          const sectionsResponse = await fetch(
            `/api/assConfig/sections?deptId=${dept.id}&semesterId=${semester.id}&regulationId=${regulation.id}`
          );
          if (sectionsResponse.ok) {
            const fetchedSections = await sectionsResponse.json();
            setSections(fetchedSections);
          }
        } catch (error) {
          console.error('Error fetching sections for edit:', error);
        }
      }
      
      // Set form data with the config values
      setFormData({
        deptId: dept?.id || '',
        branch: config.branch,
        branchCode: config.branchCode,
        semesterId: semester?.id || '',
        semester: config.semester,
        regulationId: regulation?.id || '',
        regulation: config.regulation,
        courseId: course?.id || '',
        courseName: config.courseName,
        section: config.section,
        subjectId: subjectId,
        subjectName: config.subjectName,
        subjectCode: config.subjectCode,
        assessmentType: config.assessmentType,
        assessmentDate: config.assessmentDate ? config.assessmentDate.split('T')[0] : '',
        maxMarks: config.maxMarks,
        testNo: config.testNo,
        experimentCount: config.experimentCount || ''
      });
      
      setEditMode(true);
      setEditId(config.id);
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      toast.success(`Editing assessment configuration for ${config.courseName}`);
    } catch (error) {
      console.error('Error setting edit mode:', error);
      toast.error('Failed to load configuration for editing');
    }
  };

  const handleDelete = (config) => {
    toast((t) => (
      <div>
        <p className="mb-2">Delete assessment configuration for {config.courseName}?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={async () => {
              try {
                const response = await fetch(`/api/assConfig/configs/${config.id}`, {
                  method: 'DELETE'
                });
                
                if (!response.ok) {
                  throw new Error('Failed to delete configuration');
                }

                toast.success(`Deleted assessment configuration for ${config.courseName}`, { autoClose: 2000 });
                toast.dismiss(t.id);
                fetchConfigurations();
              } catch (error) {
                console.error('Error deleting configuration:', error);
                toast.error('Failed to delete configuration');
                toast.dismiss(t.id);
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
    ), {
      duration: Infinity,
    });
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
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Assessment Configuration</h6>
            </div>

            {/* Configuration Form Card */}
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Course Name - Default to Pharmacy (Read-only) */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Course Name <span className="text-danger">*</span></label>
                      <input 
                        type="text"
                        className="form-control bg-light"
                        value="Pharmacy"
                        readOnly
                        title="Default course is Pharmacy"
                      />
                    </div>

                    {/* Department Name */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Department Name <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        name="deptId"
                        value={formData.deptId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Department Code (Read-only) */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Department Code</label>
                      <input 
                        type="text"
                        className="form-control bg-light"
                        value={formData.branchCode}
                        readOnly
                      />
                    </div>

                    {/* Semester */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Semester <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        name="semesterId"
                        value={formData.semesterId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Semester</option>
                        {semesters.map(sem => (
                          <option key={sem.id} value={sem.id}>{sem.semester}</option>
                        ))}
                      </select>
                    </div>

                    {/* Regulation */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <label className="form-label fw-semibold">Regulation <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        name="regulationId"
                        value={formData.regulationId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Regulation</option>
                        {regulations.map(reg => (
                          <option key={reg.id} value={reg.id}>{reg.regulation}</option>
                        ))}
                      </select>
                    </div>

                    {/* Section */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <label className="form-label fw-semibold">Section <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.deptId || !formData.semesterId || !formData.regulationId}
                      >
                        <option value="">
                          {!formData.deptId || !formData.semesterId || !formData.regulationId 
                            ? 'Select Dept, Semester & Regulation first' 
                            : sections.length === 0 
                            ? 'No sections available' 
                            : 'Select Section'}
                        </option>
                        {sections.map(sec => (
                          <option key={sec.section} value={sec.section}>{sec.section}</option>
                        ))}
                      </select>
                    </div>

                    {/* Assessment Type */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <label className="form-label fw-semibold">Assessment Type <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        name="assessmentType"
                        value={formData.assessmentType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Assessment Type</option>
                        {ASSESSMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Name - Searchable with filter by Assessment Type */}
                    <div className="col-12 col-md-6 col-lg-6">
                      <label className="form-label fw-semibold">Subject Name <span className="text-danger">*</span></label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Subject"
                          value={subjectSearchInput}
                          onChange={(e) => {
                            setSubjectSearchInput(e.target.value);
                            setShowSubjectDropdown(true);
                          }}
                          onFocus={() => setShowSubjectDropdown(true)}
                          onBlur={() => setTimeout(() => setShowSubjectDropdown(false), 200)}
                          disabled={!formData.branchCode || !formData.semester || !formData.regulation || !formData.assessmentType}
                          required
                        />
                        {formData.subjectName && (
                          <button
                            type="button"
                            className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, subjectName: '', subjectCode: '', subjectId: '' }));
                              setSubjectSearchInput('');
                            }}
                            title="Clear selection"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                        {showSubjectDropdown && subjects.length > 0 && (
                          <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1000 }}>
                            {subjects
                              .filter(subject =>
                                subject.subjectName.toLowerCase().includes(subjectSearchInput.toLowerCase()) ||
                                subject.subjectCode.toLowerCase().includes(subjectSearchInput.toLowerCase())
                              )
                              .map((subject) => (
                                <button
                                  key={subject.id}
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      subjectName: subject.subjectName,
                                      subjectCode: subject.subjectCode,
                                      subjectId: subject.id
                                    }));
                                    setSubjectSearchInput(subject.subjectName);
                                    setShowSubjectDropdown(false);
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                      <div className="fw-semibold">{subject.subjectName}</div>
                                      <div className="small text-muted">{subject.subjectCode}</div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subject Code (Read-only) */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Subject Code</label>
                      <input 
                        type="text"
                        className="form-control bg-light"
                        value={formData.subjectCode}
                        readOnly
                      />
                    </div>

                    {/* Assessment Date */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Assessment Date <span className="text-danger">*</span></label>
                      <input 
                        type="date"
                        className="form-control"
                        name="assessmentDate"
                        value={formData.assessmentDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Max Marks - Dynamic label based on Assessment Type */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">
                        Max Marks {formData.assessmentType && `(${formData.assessmentType})`} <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="number"
                        className="form-control"
                        name="maxMarks"
                        value={formData.maxMarks}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>

                    {/* Test No - Auto-increment (Read-only) */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label fw-semibold">Test No <span className="text-danger">*</span></label>
                      <input 
                        type="number"
                        className="form-control bg-light"
                        name="testNo"
                        value={formData.testNo}
                        onChange={handleInputChange}
                        min="1"
                        required
                        readOnly
                        title="Test number is auto-generated"
                      />
                    </div>

                    {/* Experiment Count - Only shown for Practical assessment type */}
                    {formData.assessmentType === 'Practical' && (
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold">Experiment Count <span className="text-danger">*</span></label>
                        <input 
                          type="number"
                          className="form-control"
                          name="experimentCount"
                          value={formData.experimentCount}
                          onChange={handleInputChange}
                          min="1"
                          required={formData.assessmentType === 'Practical'}
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                      {editMode && (
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary radius-8 px-20 py-11"
                          onClick={() => {
                            setFormData({
                              deptId: '',
                              branch: '',
                              branchCode: '',
                              semesterId: '',
                              semester: '',
                              regulationId: '',
                              regulation: '',
                              courseId: '',
                              courseName: '',
                              section: '',
                              subjectId: '',
                              subjectName: '',
                              subjectCode: '',
                              assessmentType: '',
                              assessmentDate: '',
                              maxMarks: '',
                              testNo: '',
                              experimentCount: ''
                            });
                            setEditMode(false);
                            setEditId(null);
                            toast.success('Edit cancelled');
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn btn-outline-primary-600 radius-8 px-20 py-11">
                        {editMode ? 'Update' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Configurations Table */}
            <DataTable
              data={configurations}
              columns={columns}
              loading={loading}
              error={error}
              title="Assessment Configurations"
              onView={handleView}
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

export default AssesmentConfiguration;
