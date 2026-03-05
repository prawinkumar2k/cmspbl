import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";


// Dummy data for dropdowns
const DAYS_OPTIONS = [
  { label: "Mon–Fri", value: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  { label: "Mon–Sat", value: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
];

// TimetableInputForm Component (fix dropdown resets)
function TimetableInputForm({ onSubmit }) {
  // Form states
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selected values
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDeptCode, setSelectedDeptCode] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRegulation, setSelectedRegulation] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectHours, setSubjectHours] = useState({}); // {subjectCode: hoursPerWeek}
  const [days, setDays] = useState(DAYS_OPTIONS[0].value);
  const periods = 6; // Default periods per day
  const [isCountValid, setIsCountValid] = useState(false);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [coursesRes, deptRes, semRes, yearsRes, regRes] = await Promise.all([
          fetch(`/api/classTimeTable/courses`),
          fetch(`/api/classTimeTable/departments`),
          fetch(`/api/classTimeTable/semesters`),
          fetch(`/api/classTimeTable/years`),
          fetch(`/api/classTimeTable/regulations`)
        ]);

        const coursesData = await coursesRes.json();
        const deptData = await deptRes.json();
        const semData = await semRes.json();
        const yearsData = await yearsRes.json();
        const regData = await regRes.json();

        setCourses(coursesData);
        setDepartments(deptData);
        setSemesters(semData);
        setYears(yearsData);
        setRegulations(regData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        alert("Failed to load dropdown data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle department selection to set dept code
  useEffect(() => {
    const depObj = departments.find(dep => dep.Dept_Name === selectedDepartment);
    setSelectedDeptCode(depObj ? depObj.Dept_Code : "");
  }, [selectedDepartment, departments]);

  // Auto-populate Year based on selected Semester
  useEffect(() => {
    if (selectedSemester && semesters.length > 0) {
      const semObj = semesters.find(sem => sem.Semester == selectedSemester);
      if (semObj && semObj.Year) {
        setSelectedYear(semObj.Year.toString());
      }
    } else {
      setSelectedYear("");
    }
  }, [selectedSemester, semesters]);

  // Fetch classes when course, department, semester, year, and regulation are selected
  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedCourse && selectedDepartment && selectedDeptCode && selectedSemester && selectedYear && selectedRegulation) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/classTimeTable/classes?courseName=${encodeURIComponent(selectedCourse)}&deptName=${encodeURIComponent(selectedDepartment)}&deptCode=${selectedDeptCode}&semester=${selectedSemester}&year=${selectedYear}&regulation=${selectedRegulation}`
          );
          const data = await response.json();
          setClasses(data.map(item => item.class));
          // Reset selected class if it's not in the new list
          setSelectedClass(prev => data.some(item => item.class === prev) ? prev : "");
        } catch (error) {
          console.error("Error fetching classes:", error);
          setClasses([]);
        } finally {
          setLoading(false);
        }
      } else {
        setClasses([]);
        setSelectedClass("");
      }
    };

    fetchClasses();
  }, [selectedCourse, selectedDepartment, selectedDeptCode, selectedSemester, selectedYear, selectedRegulation]);

  // Fetch subjects when all required selections are made
  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedDeptCode && selectedSemester && selectedRegulation) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/classTimeTable/subjects?deptCode=${selectedDeptCode}&semester=${selectedSemester}&regulation=${selectedRegulation}`
          );
          const data = await response.json();
          setSubjects(data);
        } catch (error) {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSubjects([]);
        setSelectedSubjects([]);
      }
    };

    fetchSubjects();
  }, [selectedDeptCode, selectedSemester, selectedRegulation]);

  // Handle subject checkbox change
  const handleSubjectCheckbox = (code) => {
    setSelectedSubjects(prev => {
      if (prev.includes(code)) {
        // Remove subject and its hours
        const newSubjects = prev.filter(s => s !== code);
        setSubjectHours(prevHours => {
          const newHours = { ...prevHours };
          delete newHours[code];
          return newHours;
        });
        return newSubjects;
      } else {
        // Add subject with default 3 hours
        setSubjectHours(prevHours => ({ ...prevHours, [code]: 3 }));
        return [...prev, code];
      }
    });
  };

  // Handle hours per week change for a subject
  const handleHoursChange = (code, hours) => {
    setSubjectHours(prev => ({ ...prev, [code]: parseInt(hours) || 0 }));
  };

  // Validate if total hours match available timetable slots
  useEffect(() => {
    if (selectedSubjects.length === 0) {
      setIsCountValid(false);
      return;
    }

    const totalHours = selectedSubjects.reduce((sum, code) => {
      return sum + (subjectHours[code] || 0);
    }, 0);

    const totalSlots = days.length * periods;
    
    if (totalHours !== totalSlots) {
      setIsCountValid(false);
    } else {
      setIsCountValid(true);
    }
  }, [subjectHours, selectedSubjects, days, periods]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !selectedCourse ||
      !selectedDepartment ||
      !selectedDeptCode ||
      !selectedSemester ||
      !selectedYear ||
      !selectedRegulation ||
      !selectedClass ||
      selectedSubjects.length === 0 ||
      !days.length ||
      !periods
    ) return;
    
    // Check if all selected subjects have hours defined
    const missingHours = selectedSubjects.filter(code => !subjectHours[code] || subjectHours[code] === 0);
    if (missingHours.length > 0) {
      toast.error("Please specify hours per week for all selected subjects.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate total hours match total slots
    const totalHours = selectedSubjects.reduce((sum, code) => sum + (subjectHours[code] || 0), 0);
    const totalSlots = days.length * periods;
    
    if (totalHours !== totalSlots) {
      const difference = totalSlots - totalHours;
      if (difference > 0) {
        toast.warning(`Hours not tallied! You need ${difference} more hours to fill the timetable (Total: ${totalSlots} slots)`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Hours exceed available slots! You have ${Math.abs(difference)} extra hours (Total: ${totalSlots} slots)`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      return;
    }
    
    // Pass subject objects for timetable generation (map to code/name/hours for display)
    const selectedSubjectObjs = subjects
      .filter(sub => selectedSubjects.includes(sub.Sub_Code))
      .map(sub => ({
        code: sub.Sub_Code,
        name: sub.Sub_Name,
        hoursPerWeek: subjectHours[sub.Sub_Code] || 0
      }));
    onSubmit({
      course: selectedCourse,
      department: selectedDepartment,
      deptCode: selectedDeptCode,
      semester: selectedSemester,
      year: selectedYear,
      regulation: selectedRegulation,
      classSection: selectedClass,
      subjects: selectedSubjectObjs,
      days,
      periods
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="mb-24">
          <div className="row g-20">
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Course <span className="text-danger">*</span>
              </label>
              <select
                className="form-select radius-8"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.Course_Name}>
                    {course.Course_Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Department Name <span className="text-danger">*</span>
              </label>
              <select
                className="form-select radius-8"
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dep => (
                  <option key={dep.Dept_Code} value={dep.Dept_Name}>
                    {dep.Dept_Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Dept Code
              </label>
              <input
                type="text"
                className="form-control radius-8"
                value={selectedDeptCode}
                readOnly
                placeholder="Auto"
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Semester <span className="text-danger">*</span>
              </label>
              <select
                className="form-select radius-8"
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.Semester}>
                    {sem.Semester}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Year <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control radius-8"
                value={selectedYear}
                readOnly
                placeholder="Auto"
                required
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Regulation <span className="text-danger">*</span>
              </label>
              <select
                className="form-select radius-8"
                value={selectedRegulation}
                onChange={e => setSelectedRegulation(e.target.value)}
                required
              >
                <option value="">Select Regulation</option>
                {regulations.map(reg => (
                  <option key={reg.id} value={reg.Regulation}>
                    {reg.Regulation}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Class Section <span className="text-danger">*</span>
              </label>
              <select
                className="form-select radius-8"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-12">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Subjects <span className="text-danger">*</span>
              </label>
              {subjects.length === 0 ? (
                <div style={{
                  padding: "24px",
                  backgroundColor: "#F9FAFB",
                  border: "2px dashed #D1D5DB",
                  borderRadius: "12px",
                  textAlign: "center",
                  color: "#6B7280",
                  fontSize: "14px"
                }}>
                  <iconify-icon icon="solar:book-outline" style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.5 }}></iconify-icon>
                  <div>Select department, semester, regulation, and class to view subjects.</div>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "12px"
                }}>
                  {subjects.map(sub => {
                    const subCode = sub.Sub_Code || sub.code;
                    const subName = sub.Sub_Name || sub.name;
                    const isChecked = selectedSubjects.includes(subCode);
                    return (
                      <label
                        key={subCode}
                        htmlFor={`subject-${subCode}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "14px 16px",
                          backgroundColor: isChecked ? "#EFF6FF" : "#FFFFFF",
                          border: isChecked ? "2px solid #3B82F6" : "2px solid #E5E7EB",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: isChecked ? "0 4px 12px rgba(59, 130, 246, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                          position: "relative",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          if (!isChecked) {
                            e.currentTarget.style.borderColor = "#3B82F6";
                            e.currentTarget.style.backgroundColor = "#F9FAFB";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isChecked) {
                            e.currentTarget.style.borderColor = "#E5E7EB";
                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                          }
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`subject-${subCode}`}
                          checked={isChecked}
                          onChange={() => handleSubjectCheckbox(subCode)}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "12px",
                            cursor: "pointer",
                            accentColor: "#3B82F6",
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: isChecked ? "#1E40AF" : "#1F2937",
                            marginBottom: "2px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              backgroundColor: isChecked ? "#DBEAFE" : "#F3F4F6",
                              color: isChecked ? "#1E40AF" : "#6B7280",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "700",
                              letterSpacing: "0.5px"
                            }}>
                              {subCode}
                            </span>
                          </div>
                          <div style={{
                            fontSize: "13px",
                            color: isChecked ? "#3B82F6" : "#6B7280",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {subName}
                          </div>
                        </div>
                        {isChecked && (
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginLeft: "12px",
                            gap: "4px"
                          }}>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={subjectHours[subCode] || 3}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleHoursChange(subCode, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="form-control"
                              style={{
                                width: "70px",
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "4px 8px",
                                border: "1px solid #3B82F6",
                                borderRadius: "6px"
                              }}
                              placeholder="Hours"
                            />
                            <div style={{
                              fontSize: "10px",
                              color: "#6B7280",
                              whiteSpace: "nowrap",
                              fontWeight: "500"
                            }}>
                              hrs/week
                            </div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Timetable Summary
              </label>
              <div style={{
                padding: "12px 16px",
                backgroundColor: isCountValid ? "#D1FAE5" : "#FEE2E2",
                border: `2px solid ${isCountValid ? "#10B981" : "#EF4444"}`,
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600"
              }}>
                <div style={{ color: isCountValid ? "#065F46" : "#991B1B", marginBottom: "4px" }}>
                  Total Hours: {selectedSubjects.reduce((sum, code) => sum + (subjectHours[code] || 0), 0)} / {days.length * periods} slots
                </div>
                <div style={{ 
                  color: isCountValid ? "#059669" : "#DC2626",
                  fontSize: "11px",
                  fontWeight: "500"
                }}>
                  {isCountValid ? "✓ Ready to generate" : "✗ Hours don't match slots"}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold text-primary-light mb-8">
                Day Order <span className="text-danger">*</span>
              </label>
              <select
                className="form-select radius-8"
                onChange={e => setDays(DAYS_OPTIONS[e.target.value].value)}
                defaultValue={0}
              >
                {DAYS_OPTIONS.map((opt, idx) => (
                  <option key={opt.label} value={idx}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
        <button
          type="submit"
          className="btn btn-outline-primary-600 radius-8 px-20 py-11"
          disabled={!isCountValid}
          style={{
            opacity: isCountValid ? 1 : 0.5,
            cursor: isCountValid ? "pointer" : "not-allowed"
          }}
        >
          Generate Timetable
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary px-20 py-11"
          onClick={() => {
            setSelectedCourse("");
            setSelectedDepartment("");
            setSelectedDeptCode("");
            setSelectedSemester("");
            setSelectedYear("");
            setSelectedRegulation("");
            setSelectedClass("");
            setSelectedSubjects([]);
            setSubjectHours({});
            setDays(DAYS_OPTIONS[0].value);
            setSubjects([]);
            setIsCountValid(false);
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

// TimetableTable Component (double-click to edit, highlight selected cells)
function TimetableTable({ timetable, days, periods, subjects, onCellDoubleClick, selectedCells, editingCell, onSubjectChange, onCloseEdit }) {
  // Color palette for subjects (hex codes for reliability)
  const subjectColors = [
    { bg: "#e0e7ff", color: "#3730a3" },
    { bg: "#d1fae5", color: "#065f46" },
    { bg: "#fef3c7", color: "#92400e" },
    { bg: "#ede9fe", color: "#6d28d9" },
    { bg: "#fce7f3", color: "#be185d" },
    { bg: "#ffedd5", color: "#c2410c" },
    { bg: "#ccfbf1", color: "#134e4a" },
  ];

  // Map subject code to color for consistency
  const getSubjectColor = (code) => {
    if (!code) return { bg: "#f3f4f6", color: "#6b7280" };
    
    // If code contains " / ", it's a combined subject - use the first subject's color
    const firstCode = code.includes(' / ') ? code.split(' / ')[0] : code;
    
    const idx = subjects.findIndex(sub => sub.code === firstCode);
    
    // If subject not found, return default color
    if (idx === -1) return { bg: "#f3f4f6", color: "#6b7280" };
    
    return subjectColors[idx % subjectColors.length];
  };

  return (
    <div className="overflow-x-auto mt-4">
      <div className="rounded-xl shadow-lg border border-neutral-200 bg-white">
        <table className="min-w-full rounded-xl overflow-hidden">
          <thead>
            <tr>
              <th className="border px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 font-bold text-center sticky left-0 z-10">
                Day / Period
              </th>
              {[...Array(periods)].map((_, idx) => (
                <th
                  key={idx}
                  className="border px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-900 font-semibold text-center"
                >
                  Period {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIdx) => (
              <tr key={day} className={dayIdx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border px-4 py-3 font-semibold text-blue-700 bg-blue-50 sticky left-0 z-10">
                  {day}
                </td>
                {[...Array(periods)].map((_, periodIdx) => {
                  const cell = timetable[dayIdx][periodIdx];
                  const colorObj = cell ? getSubjectColor(cell.code) : { bg: "#f3f4f6", color: "#6b7280" };
                  const isSelected = selectedCells.some(
                    c => c.dayIdx === dayIdx && c.periodIdx === periodIdx
                  );
                  const isEditing = editingCell && editingCell.dayIdx === dayIdx && editingCell.periodIdx === periodIdx;
                  
                  return (
                    <td
                      key={periodIdx}
                      style={{
                        minWidth: "140px",
                        position: "relative"
                      }}
                    >
                      <div
                        className={`border px-4 py-3 cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-lg rounded-lg text-center ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                        onDoubleClick={() => onCellDoubleClick(dayIdx, periodIdx)}
                        style={{
                          fontWeight: "500",
                          borderRadius: "8px",
                          background: colorObj.bg,
                          color: colorObj.color,
                          boxShadow: cell ? "0 2px 8px rgba(0,0,0,0.04)" : undefined,
                          transition: "background 0.2s"
                        }}
                      >
                        {cell
                          ? (
                            <span>
                              <span className="font-bold">{cell.code}</span>
                              <span className="block text-xs font-medium">{cell.name}</span>
                            </span>
                          )
                          : <span className="text-gray-400">--</span>
                        }
                      </div>
                      {isEditing && (
                        <>
                          {/* Backdrop overlay */}
                          <div 
                            onClick={onCloseEdit}
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              zIndex: 999,
                              animation: "fadeIn 0.2s ease-out",
                              backdropFilter: "blur(4px)"
                            }}
                          />
                          
                          {/* Slide-in panel from right */}
                          <div style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: "min(450px, 90vw)",
                            backgroundColor: "#FFFFFF",
                            zIndex: 1000,
                            boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
                            display: "flex",
                            flexDirection: "column",
                            animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                          }}>
                            {/* Header with gradient */}
                            <div style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              padding: "24px",
                              color: "white",
                              position: "relative",
                              overflow: "hidden"
                            }}>
                              <div style={{
                                position: "absolute",
                                top: "-50%",
                                right: "-10%",
                                width: "200px",
                                height: "200px",
                                background: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "50%",
                                filter: "blur(40px)"
                              }}></div>
                              
                              <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "flex-start",
                                position: "relative",
                                zIndex: 1
                              }}>
                                <div>
                                  <div style={{
                                    fontSize: "12px",
                                    opacity: 0.9,
                                    marginBottom: "4px",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    fontWeight: "500"
                                  }}>
                                    Configure Period
                                  </div>
                                  <h3 style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    margin: 0,
                                    letterSpacing: "0.5px"
                                  }}>
                                    Edit Subjects
                                  </h3>
                                  <div style={{
                                    marginTop: "8px",
                                    fontSize: "14px",
                                    opacity: 0.95,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                  }}>
                                    <iconify-icon icon="solar:calendar-bold" style={{ fontSize: "16px" }}></iconify-icon>
                                    <span>{days[dayIdx]} - Period {periodIdx + 1}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={onCloseEdit}
                                  style={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    border: "none",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.2s",
                                    color: "white",
                                    fontSize: "20px",
                                    fontWeight: "bold"
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                                    e.currentTarget.style.transform = "rotate(90deg)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                                    e.currentTarget.style.transform = "rotate(0deg)";
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            </div>

                            {/* Scrollable content */}
                            <div style={{ 
                              flex: 1, 
                              overflowY: "auto", 
                              padding: "24px",
                              backgroundColor: "#F9FAFB"
                            }}>
                              <div style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#6B7280",
                                marginBottom: "16px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                              }}>
                                <iconify-icon icon="solar:book-2-bold" style={{ fontSize: "16px" }}></iconify-icon>
                                Available Subjects ({subjects.length})
                              </div>
                              
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {subjects.map((sub) => {
                                  const isChecked = cell?.code?.includes(sub.code) || false;
                                  const subjectColor = getSubjectColor(sub.code);
                                  
                                  return (
                                    <label 
                                      key={sub.code} 
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "16px",
                                        cursor: "pointer",
                                        borderRadius: "12px",
                                        backgroundColor: isChecked ? subjectColor.bg : "#FFFFFF",
                                        border: isChecked ? `2px solid ${subjectColor.color}` : "2px solid #E5E7EB",
                                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                        boxShadow: isChecked ? `0 4px 16px ${subjectColor.color}30` : "0 2px 4px rgba(0,0,0,0.04)",
                                        transform: isChecked ? "translateX(4px)" : "translateX(0)",
                                        position: "relative",
                                        overflow: "hidden"
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isChecked) {
                                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                                          e.currentTarget.style.borderColor = subjectColor.color + "80";
                                          e.currentTarget.style.transform = "translateX(4px)";
                                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isChecked) {
                                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                                          e.currentTarget.style.borderColor = "#E5E7EB";
                                          e.currentTarget.style.transform = "translateX(0)";
                                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.04)";
                                        }
                                      }}
                                    >
                                      {isChecked && (
                                        <div style={{
                                          position: "absolute",
                                          left: 0,
                                          top: 0,
                                          bottom: 0,
                                          width: "4px",
                                          background: `linear-gradient(180deg, ${subjectColor.color} 0%, ${subjectColor.color}99 100%)`
                                        }}></div>
                                      )}
                                      
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => onSubjectChange(dayIdx, periodIdx, sub, e.target.checked)}
                                        style={{ 
                                          marginRight: "14px", 
                                          width: "20px", 
                                          height: "20px",
                                          cursor: "pointer",
                                          accentColor: subjectColor.color,
                                          flexShrink: 0
                                        }}
                                      />
                                      <div style={{ flex: 1 }}>
                                        <div style={{ 
                                          fontSize: "15px", 
                                          fontWeight: "700",
                                          color: isChecked ? subjectColor.color : "#1F2937",
                                          marginBottom: "4px",
                                          letterSpacing: "0.3px"
                                        }}>
                                          {sub.code}
                                        </div>
                                        <div style={{ 
                                          fontSize: "13px",
                                          color: isChecked ? subjectColor.color + "CC" : "#6B7280",
                                          fontWeight: "500"
                                        }}>
                                          {sub.name}
                                        </div>
                                      </div>
                                      {isChecked && (
                                        <div style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          width: "28px",
                                          height: "28px",
                                          backgroundColor: subjectColor.color,
                                          color: "white",
                                          borderRadius: "8px",
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          flexShrink: 0,
                                          boxShadow: `0 2px 8px ${subjectColor.color}40`
                                        }}>
                                          ✓
                                        </div>
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Footer with action buttons */}
                            <div style={{
                              padding: "20px 24px",
                              borderTop: "1px solid #E5E7EB",
                              backgroundColor: "#FFFFFF",
                              display: "flex",
                              gap: "12px"
                            }}>
                              <button
                                onClick={onCloseEdit}
                                style={{
                                  flex: 1,
                                  padding: "14px 24px",
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  transition: "all 0.2s",
                                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                                  letterSpacing: "0.3px"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "translateY(0)";
                                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                                }}
                              >
                                Apply Changes
                              </button>
                            </div>
                          </div>
                          
                          <style>
                            {`
                              @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                              }
                              @keyframes slideInRight {
                                from { 
                                  transform: translateX(100%);
                                  opacity: 0;
                                }
                                to { 
                                  transform: translateX(0);
                                  opacity: 1;
                                }
                              }
                            `}
                          </style>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <span className="inline-block mr-2">Tip: Double-click any cell to select for editing. You can select multiple cells before updating.</span>
      </div>
    </div>
  );
}



// Main ClassTimeTable Component (multi-cell select/edit logic)
export default function ClassTimeTable() {
  const [meta, setMeta] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]); // [{dayIdx, periodIdx}]
  const [editingCell, setEditingCell] = useState(null); // {dayIdx, periodIdx}
  const [isSaving, setIsSaving] = useState(false);

  // Generate timetable logic with hours per week distribution
  const handleGenerate = (formData) => {
    console.log('🟢 [handleGenerate] Called with formData:', formData);
    const { subjects, days, periods } = formData;
    
    // Create a pool of subject slots based on hours per week
    const subjectPool = [];
    subjects.forEach(subject => {
      const hoursNeeded = subject.hoursPerWeek || 0;
      for (let i = 0; i < hoursNeeded; i++) {
        subjectPool.push({ code: subject.code, name: subject.name });
      }
    });
    
    // Shuffle the pool for random distribution
    for (let i = subjectPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [subjectPool[i], subjectPool[j]] = [subjectPool[j], subjectPool[i]];
    }
    
    // Fill the timetable grid
    const table = [];
    let poolIndex = 0;
    const totalSlots = days.length * periods;
    
    for (let d = 0; d < days.length; d++) {
      const row = [];
      for (let p = 0; p < periods; p++) {
        if (poolIndex < subjectPool.length) {
          row.push(subjectPool[poolIndex]);
          poolIndex++;
        } else {
          // If we run out of subjects, fill with random subjects
          const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
          row.push({ code: randomSubject.code, name: randomSubject.name });
        }
      }
      table.push(row);
    }
    
    console.log('🟢 [handleGenerate] Generated table:', table);
    setMeta(formData);
    setTimetable(table);
    setSelectedCells([]);
    console.log('🟢 [handleGenerate] State updated');
  };

  // Double-click cell to select for editing
  const handleCellDoubleClick = (dayIdx, periodIdx) => {
    console.log('🔵 [handleCellDoubleClick] Cell double-clicked:', { dayIdx, periodIdx });
    setEditingCell({ dayIdx, periodIdx });
    console.log('🔵 [handleCellDoubleClick] Editing cell set');
  };

  // Handle subject change in dropdown
  const handleSubjectChange = (dayIdx, periodIdx, subject, isChecked) => {
    console.log('🟡 [handleSubjectChange] Subject change:', { dayIdx, periodIdx, subject, isChecked });
    
    const newTable = timetable.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === dayIdx && cIdx === periodIdx) {
          if (!cell || !cell.code) {
            // Empty cell - add subject
            return isChecked ? subject : null;
          }
          
          // Get current subject codes
          const currentCodes = cell.code.split(' / ');
          const currentNames = cell.name.split(' / ');
          
          if (isChecked) {
            // Add subject if not already present
            if (!currentCodes.includes(subject.code)) {
              return {
                code: [...currentCodes, subject.code].join(' / '),
                name: [...currentNames, subject.name].join(' / ')
              };
            }
          } else {
            // Remove subject
            const newCodes = currentCodes.filter(c => c !== subject.code);
            const newNames = currentNames.filter((n, idx) => currentCodes[idx] !== subject.code);
            
            if (newCodes.length === 0) {
              return null; // No subjects left
            }
            
            return {
              code: newCodes.join(' / '),
              name: newNames.join(' / ')
            };
          }
        }
        return cell;
      })
    );
    
    setTimetable(newTable);
    console.log('✅ [handleSubjectChange] Timetable updated');
  };

  // Close edit dropdown
  const handleCloseEdit = () => {
    setEditingCell(null);
  };



  const handleSave = async () => {
    if (!meta || timetable.length === 0) return;
    
    setIsSaving(true);
    try {
      // Prepare timetable data for database
      const timetableData = [];
      meta.days.forEach((day, dayIdx) => {
        timetable[dayIdx].forEach((cell, periodIdx) => {
          if (cell && cell.code) {
            timetableData.push({
              day: day,
              period: periodIdx + 1,
              subjectCode: cell.code,
              subjectName: cell.name
            });
          }
        });
      });

      const payload = {
        course: meta.course,
        deptCode: meta.deptCode,
        deptName: meta.department,
        semester: meta.semester,
        year: meta.year,
        regulation: meta.regulation,
        className: meta.classSection,
        timetableData: timetableData
      };

      const response = await fetch(`/api/classTimeTable/timetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Timetable saved successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Error saving timetable: ' + (result.error || 'Unknown error'), {
          position: 'top-right',
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error('Failed to save timetable. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Class Timetable Generator</h6>
            </div>
            {/* Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-body p-24">
                <TimetableInputForm onSubmit={handleGenerate} />
                {meta && timetable.length > 0 && (
                  <div className="mb-6 border-top border-neutral-200 mt-20">
                    <div className="flex justify-end items-center mb-2 mt-8">
                      <button
                        className="btn btn-outline-success-600 radius-8 px-24 py-11"
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                          opacity: isSaving ? 0.6 : 1,
                          cursor: isSaving ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {isSaving ? (
                          <>
                            <iconify-icon icon="line-md:loading-loop" style={{ fontSize: '18px' }}></iconify-icon>
                            Saving...
                          </>
                        ) : (
                          <>
                            <iconify-icon icon="solar:diskette-bold" style={{ fontSize: '18px' }}></iconify-icon>
                            Save Timetable
                          </>
                        )}
                      </button>
                    </div>
                    <TimetableTable
                      timetable={timetable}
                      days={meta.days}
                      periods={meta.periods}
                      subjects={meta.subjects}
                      onCellDoubleClick={handleCellDoubleClick}
                      selectedCells={selectedCells}
                      editingCell={editingCell}
                      onSubjectChange={handleSubjectChange}
                      onCloseEdit={handleCloseEdit}
                    />
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
}
