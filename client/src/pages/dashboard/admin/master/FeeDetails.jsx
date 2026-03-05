
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../../components/Sidebar';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/footer';
import FeeTable from './FeeTable';

const FeeDetails = () => {
  const [form, setForm] = useState({
    academicYear: '',
    modeOfJoin: '',
    type: '',
    course: '',
    department: '',
    departmentCode: '',
    feeSem: '',
    year: '',
    feeType: '',
    amount: ''
  });
  const [editId, setEditId] = useState(null);
  const [refreshTable, setRefreshTable] = useState(0);
  const [courses, setCourses] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // Fetch courses on component mount
  React.useEffect(() => {
    fetchAcademicYears();
    fetchCourses();
    fetchDepartments();
    fetchSemesters();
    fetchFeeTypes();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await fetch('/api/courseFees/academic-years');
      const data = await response.json();
      setAcademicYears(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching academic years:', error);
      setAcademicYears([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courseMaster');
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/courseFees/departments');
      const data = await response.json();
      setAllDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setAllDepartments([]);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await fetch('/api/courseFees/semesters');
      const data = await response.json();
      setSemesters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching semesters:', error);
      setSemesters([]);
    }
  };

  const fetchFeeTypes = async () => {
    try {
      const response = await fetch('/api/feeMaster');
      const data = await response.json();
      setFeeTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching fee types:', error);
      setFeeTypes([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'course') {
      // Filter departments based on selected course
      const filtered = Array.isArray(allDepartments)
        ? allDepartments.filter(dept => dept.Course_Name === value)
        : [];
      setFilteredDepartments(filtered);
      // Reset department and department code when course changes
      setForm(prev => ({
        ...prev,
        [name]: value,
        department: '',
        departmentCode: '',
        year: ''
      }));
    } else if (name === 'department') {
      // Auto-fill department code when department is selected
      const selectedDept = Array.isArray(filteredDepartments)
        ? filteredDepartments.find(dept => dept.Dept_Name === value)
        : null;
      setForm(prev => ({
        ...prev,
        [name]: value,
        departmentCode: selectedDept ? selectedDept.Dept_Code : ''
      }));
    } else if (name === 'feeSem') {
      // Auto-fill year when semester is selected from semester_master
      const selectedSemester = Array.isArray(semesters)
        ? semesters.find(sem => sem.Semester === parseInt(value))
        : null;
      setForm(prev => ({
        ...prev,
        [name]: value,
        year: selectedSemester ? selectedSemester.Year : ''
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sequential Validation
    const requiredFields = [
      { key: 'academicYear', label: 'Academic Year' },
      { key: 'modeOfJoin', label: 'Mode of Join' },
      { key: 'course', label: 'Course Name' },
      { key: 'department', label: 'Department Name' },
      { key: 'departmentCode', label: 'Department Code' },
      { key: 'feeSem', label: 'Semester' },
      { key: 'year', label: 'Year' },
      { key: 'type', label: 'Type' },
      { key: 'feeType', label: 'Fee Type' },
      { key: 'amount', label: 'Amount' }
    ];

    const firstMissing = requiredFields.find(field => {
      const value = form[field.key];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (firstMissing) {
      toast.error(`${firstMissing.label} is required.`);
      return;
    }

    try {
      const url = editId ? `/api/courseFees/${editId}` : '/api/courseFees';
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          academicYear: form.academicYear,
          modeOfJoin: form.modeOfJoin,
          type: form.type,
          course: form.course,
          department: form.department,
          departmentCode: form.departmentCode,
          feeSem: form.feeSem,
          year: form.year,
          feeType: form.feeType,
          amount: form.amount
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editId ? 'Fee details updated successfully!' : 'Fee details saved successfully!', { autoClose: 2000 });
        setRefreshTable(r => r + 1);
        handleReset();
      } else {
        toast.error('Error: ' + (data.error || (editId ? 'Failed to update fee details' : 'Failed to save fee details')));
      }
    } catch (error) {
      console.error('Error submitting fee details:', error);
      toast.error('Error: Failed to connect to server');
    }
  };

  const handleReset = () => {
    setForm({
      academicYear: '',
      modeOfJoin: '',
      type: '',
      course: '',
      department: '',
      departmentCode: '',
      feeSem: '',
      year: '',
      feeType: '',
      amount: ''
    });
    setFilteredDepartments([]);
    setEditId(null);
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
              <h6 className="fw-semibold mb-0">Fee Details</h6>
            </div>
            <div className="card h-100 p-0 radius-12">
              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                  <div className="row g-20">
                    {/* Academic Year */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Academic Year <span className="text-danger">*</span></label>
                      <select
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        className="form-select radius-8"
                        style={{ minWidth: '140px' }}
                      >
                        <option value="">Select Academic Year</option>
                        {academicYears.map((year, idx) => (
                          <option key={idx} value={year.Academic_Year}>{year.Academic_Year}</option>
                        ))}
                      </select>
                    </div>
                    {/* Mode of Join */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Mode of Join <span className="text-danger">*</span></label>
                      <select
                        name="modeOfJoin"
                        value={form.modeOfJoin}
                        onChange={handleChange}
                        className="form-select radius-8"
                      >
                        <option value="">Select Mode</option>
                        <option value="Both">Both</option>
                        <option value="Regular">Regular</option>
                        <option value="Lateral">Lateral</option>
                      </select>
                    </div>

                    {/* Course */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Course Name <span className="text-danger">*</span></label>
                      <select
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                        className="form-select radius-8"
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.Course_Name}>
                            {course.Course_Name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Department Name */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Department Name <span className="text-danger">*</span></label>
                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="form-select radius-8"
                        disabled={!form.course}
                      >
                        <option value="">Select Department</option>
                        {filteredDepartments.map((dept) => (
                          <option key={dept.id} value={dept.Dept_Name}>
                            {dept.Dept_Name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Department Code */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Department Code <span className="text-danger">*</span></label>
                      <input
                        name="departmentCode"
                        value={form.departmentCode}
                        onChange={handleChange}
                        className="form-control radius-8"
                        readOnly
                      />
                    </div>
                    {/* FeeSem */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Semester <span className="text-danger">*</span></label>
                      <select
                        name="feeSem"
                        value={form.feeSem}
                        onChange={handleChange}
                        className="form-select radius-8"
                      >
                        <option value="">Select Semester</option>
                        {semesters.map((sem) => (
                          <option key={sem.Semester} value={sem.Semester}>
                            {sem.Semester}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Year */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Year <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        className="form-control radius-8"
                        readOnly
                      />
                    </div>
                    {/* Type */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Type <span className="text-danger">*</span></label>
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="form-select radius-8"
                      >
                        <option value="">Select Type</option>
                        <option value="Academic">Academic</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Transport">Transport</option>
                      </select>
                    </div>
                    {/* Fee Type */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Fee Type <span className="text-danger">*</span></label>
                      <select
                        name="feeType"
                        value={form.feeType}
                        onChange={handleChange}
                        className="form-select radius-8"
                      >
                        <option value="">Select Fee Type</option>
                        {feeTypes.map((fee) => (
                          <option key={fee.id} value={fee.Fee_Type}>
                            {fee.Fee_Type}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Amount */}
                    <div className="col-12 col-lg-3">
                      <label className="form-label fw-semibold text-primary-light mb-8">Amount <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="form-control radius-8"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button type="submit" className="btn btn-outline-primary-600 radius-8 px-20 py-11">
                      {editId ? 'Update' : 'Save'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary px-20 py-11" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Fee Table Section */}
            <div className="card-body ">
              <FeeTable
                refreshTrigger={refreshTable}
                setForm={setForm}
                setEditId={setEditId}
                setFilteredDepartments={setFilteredDepartments}
              />
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default FeeDetails;
