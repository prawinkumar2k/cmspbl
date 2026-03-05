import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';

const SPELL_NUMBERS = ['1', '2', '3', '4', '5'];

const COURSES = [
  { name: 'B.Tech Computer Science', code: 'BCS' },
  { name: 'M.Tech Computer Science', code: 'MCS' },
  { name: 'BCA', code: 'BCA' },
  { name: 'MCA', code: 'MCA' }
];

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const SECTIONS = ['A', 'B', 'C', 'D'];

const SpellAttendance = () => {
  const [filters, setFilters] = useState({
    spellNo: '',
    course: '',
    courseCode: '',
    semester: '',
    section: ''
  });

  const [showTable, setShowTable] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample attendance data
  const sampleAttendanceData = [
    {
      id: 1,
      rollNumber: '001',
      registerNumber: 'CS20001',
      studentName: 'John Doe',
      presentHours: 45,
      totalHours: 50,
      average: '90%',
      cumPresent: 180,
      cumTotal: 200,
      cumAverage: '90%'
    },
    {
      id: 2,
      rollNumber: '002',
      registerNumber: 'CS20002',
      studentName: 'Jane Smith',
      presentHours: 48,
      totalHours: 50,
      average: '96%',
      cumPresent: 190,
      cumTotal: 200,
      cumAverage: '95%'
    },
    {
      id: 3,
      rollNumber: '003',
      registerNumber: 'CS20003',
      studentName: 'Mike Johnson',
      presentHours: 42,
      totalHours: 50,
      average: '84%',
      cumPresent: 170,
      cumTotal: 200,
      cumAverage: '85%'
    }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      
      // Auto-fill course code when course is selected
      if (name === 'course') {
        const selectedCourse = COURSES.find(c => c.name === value);
        newFilters.courseCode = selectedCourse ? selectedCourse.code : '';
      }
      
      return newFilters;
    });
  };

  // Handle view button click
  const handleView = () => {
    if (!filters.spellNo || !filters.course || !filters.semester || !filters.section) {
      toast.error('Please fill all filter fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAttendanceData(sampleAttendanceData);
      setShowTable(true);
      setLoading(false);
      toast.success('Attendance data loaded successfully');
    }, 1000);
  };

  // Define table columns
  const columns = [
    {
      accessorKey: 'rollNumber',
      header: 'Roll Number',
      cell: ({ row }) => <div className="fw-medium">{row.original.rollNumber}</div>,
    },
    {
      accessorKey: 'registerNumber',
      header: 'Register Number',
      cell: ({ row }) => <div className="fw-medium">{row.original.registerNumber}</div>,
    },
    {
      accessorKey: 'studentName',
      header: 'Student',
      cell: ({ row }) => <div className="fw-medium">{row.original.studentName}</div>,
    },
    {
      accessorKey: 'presentHours',
      header: 'Present Hours',
      cell: ({ row }) => <div className="fw-medium">{row.original.presentHours}</div>,
    },
    {
      accessorKey: 'totalHours',
      header: 'Total Hours',
      cell: ({ row }) => <div className="fw-medium">{row.original.totalHours}</div>,
    },
    {
      accessorKey: 'average',
      header: 'Average',
      cell: ({ row }) => <div className="fw-medium">{row.original.average}</div>,
    },
    {
      accessorKey: 'cumPresent',
      header: 'Cum Present',
      cell: ({ row }) => <div className="fw-medium">{row.original.cumPresent}</div>,
    },
    {
      accessorKey: 'cumTotal',
      header: 'Cum Total',
      cell: ({ row }) => <div className="fw-medium">{row.original.cumTotal}</div>,
    },
    {
      accessorKey: 'cumAverage',
      header: 'Cum Average',
      cell: ({ row }) => <div className="fw-medium">{row.original.cumAverage}</div>,
    }
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
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Spell Attendance</h6>
            </div>

            {/* Filter Card */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  {/* Spell Number */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Spell No <span className="text-danger">*</span></label>
                    <select 
                      className="form-select"
                      name="spellNo"
                      value={filters.spellNo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Spell</option>
                      {SPELL_NUMBERS.map(spell => (
                        <option key={spell} value={spell}>Spell {spell}</option>
                      ))}
                    </select>
                  </div>

                  {/* Course Selection */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Course <span className="text-danger">*</span></label>
                    <select 
                      className="form-select"
                      name="course"
                      value={filters.course}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Course</option>
                      {COURSES.map(course => (
                        <option key={course.code} value={course.name}>{course.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Course Code (Read-only) */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Course Code</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={filters.courseCode}
                      readOnly
                    />
                  </div>

                  {/* Semester */}
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="form-label fw-semibold">Semester <span className="text-danger">*</span></label>
                    <select 
                      className="form-select"
                      name="semester"
                      value={filters.semester}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Semester</option>
                      {SEMESTERS.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>

                  {/* Section */}
                  <div className="col-12 col-md-6 col-lg-6">
                    <label className="form-label fw-semibold">Section <span className="text-danger">*</span></label>
                    <select 
                      className="form-select"
                      name="section"
                      value={filters.section}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Section</option>
                      {SECTIONS.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  {/* View Button */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                      <button 
                        className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                        onClick={handleView}
                      >
                        VIEW
                      </button>
                       <button 
                        className="btn btn-outline-success-600 radius-8 px-20 py-11"
                      >
                        Get Report
                      </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            {showTable && (
              <DataTable
                data={attendanceData}
                columns={columns}
                loading={loading}
                error={error}
                title="Spell Attendance Records"
                enableExport={false}
                enableSelection={true}
                pageSize={10}
              />
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default SpellAttendance;
