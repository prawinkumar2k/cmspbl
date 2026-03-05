// EditTC.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { number } from "prop-types";
import Select from "react-select";


const EditTC = () => {
  const navigate = useNavigate();
  // TC Number prefix (institution codes)
  const TC_PREFIX = "58/786";

  const [students, setStudents] = useState([]);
  const [regOptions, setRegOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [form, setForm] = useState({
    dept: "",
    sem: "",
    regNo: "",
    tcNo: "",
    name: "",
    fatherName: "",
    guardianName: "",
    dob: "",
    caste: "",
    nationality: "",
    religion: "",
    sex: "",
    dateOfAdmission: "",
    dateLeft: "",
    dateOfTransfer: "",
    dateMade: "",
    dateIssue: "",
    issueDateTC: "",
    completed: "YES, PROMOTED",
    identification: "",
    course: "",
    courseOfStudy: "",
    qualifiedFor: "",
    reasonForLeaving: "",
    conduct: "",
    medium_of_instruction: "",
    year: "",
    yearOfDepartment: "",
    community: "",
  });

  const [previewData, setPreviewData] = useState(null);
  const [existingTCs, setExistingTCs] = useState([]);
  const [nextTcNo, setNextTcNo] = useState("01");
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [showFields, setShowFields] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Load students
  useEffect(() => {
    setLoadingStudents(true);

    const loadStudents = (url) =>
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`API Error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!Array.isArray(data) || data.length === 0) {
            console.warn('No array data returned from:', url);
            return [];
          }

          // Filter only confirmed/admitted students first
          const confirmedStudents = data.filter((s) => {
            const status = (s.Admission_Status || s.admission_status || s.status || '').toString().toLowerCase();
            const regNo = String(s.Register_Number || s.reg_no || '').trim();
            return (status === 'confirmed' || status === 'admitted' || status === 'admission confirmed' || status === 'yes') && regNo.length > 0;
          });

          const mapped = confirmedStudents
            .map((s) => ({
              regNo:
                s.Register_Number ||
                s.Register_No ||
                s.RegisterNumber ||
                s.Application_No ||
                s.Application ||
                s.reg_no ||
                s.RegNo ||
                s.ApplicationNo ||
                "",
              name:
                s.Student_Name ||
                s.StudentName ||
                s.Name ||
                s.student_name ||
                s.studentName ||
                "",
              dept:
                s.Dept_Name ||
                s.Dept ||
                s.Course_Name ||
                s.CourseName ||
                s.course_name ||
                s.course ||
                "",
              sem: s.Semester || s.semester || s.Sem || s.Sem_No || s.sem || "",
              fatherName: s.Father_Name || s.Father || s.FatherName || "",
              dob: s.DOB || s.Dob || s.dob || s.Date_of_Birth || s.date_of_birth || "",
              caste: s.Community || s.Caste || s.community || s.caste || "",
              nationality: s.Nationality || s.nationality || "",
              religion: s.Religion || s.religion || "",
              sex: s.Gender || s.gender || s.Sex || s.sex || "",
              dateOfAdmission:
                s.Admission_Date || s.admission_date || s.AdmissionDate || s.Admission || s.admission_date_display || "",
              identification:
                s.Identification_of_Student ||
                s.identification_of_student ||
                s.identification ||
                "",
              course:
                s.Course_Name || s.CourseName || s.Course || s.course || "",
              courseOfStudy:
                s.Year || s.Academic_Year || s.Year_Of_Study || s.year || "",
              address:
                s.Current_Address ||
                s.Permanent_Address ||
                s.Address ||
                s.current_address ||
                "",
            }))
            .filter((x) => x.regNo);
          if (mapped.length > 0) {
          }
          if (mapped.length === 0) {
            return [];
          }

          setStudents(mapped);
          setRegOptions(mapped.map((s) => s.regNo));

          // derive departments & semesters
          const deps = Array.from(new Set(mapped.map((m) => m.dept))).filter(
            Boolean
          );
          const sems = Array.from(new Set(mapped.map((m) => m.sem))).filter(
            Boolean
          );
          setDepartments(deps);
          setSemesters(sems);

          return mapped;
        })
        .catch((err) => {
          console.error("Failed to load", url, err);
          return [];
        });

    // Load students from API
    loadStudents("/api/studentMaster")
      .then((result) => {
        if (!result || result.length === 0) {
          console.warn('No students found');
          toast.error('No students found in database');
          return [];
        }
        return result;
      })
      .then((finalRes) => {
        if (!finalRes || finalRes.length === 0) {
          toast.error("No students found. Check studentMaster API");
        }
      })
      .finally(() => setLoadingStudents(false));

  }, []);

  // Autofill when regNo selected - Fetch full student data from student_master
  useEffect(() => {
    if (!form.regNo) return;

    // Helper to format date to YYYY-MM-DD
    const formatDateForInput = (dateStr) => {
      if (!dateStr) return "";
      try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split("T")[0];
        }
        return dateStr;
      } catch {
        return dateStr;
      }
    };

    // Fetch full student data from student_master
    fetch(`/api/tc/by-regno?regNo=${encodeURIComponent(form.regNo)}`)
      .then((r) => {
        if (!r.ok) {
          console.warn('Student not found for regNo:', form.regNo);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && data.reg_no) {
          // Populate form with all available student_master data
          setForm((prev) => ({
            ...prev,
            name: data.name || "",
            fatherName: data.father_name || "",
            dob: formatDateForInput(data.dob),
            sex: data.sex || "",
            community: data.community || "",
            caste: data.caste || "",
            nationality: data.nationality || "",
            religion: data.religion || "",
            dept: data.dept || "",
            sem: data.sem || "",
            course: data.course || "",
            year: data.year || "",
            yearOfDepartment: data.year_of_department || "",
            medium_of_instruction: data.medium_of_instruction || "",
            dateOfAdmission: formatDateForInput(data.date_of_admission),
            // Map backend fields correctly from student_master
            dateMade: formatDateForInput(data.date_of_transfer),
            dateIssue: formatDateForInput(data.issue_date_tc),
            // Keep legacy fields in sync
            dateOfTransfer: formatDateForInput(data.date_of_transfer),
            issueDateTC: formatDateForInput(data.issue_date_tc),
            tcNo: data.tc_no || prev.tcNo || nextTcNo,
            conduct: data.conduct || "",
            reasonForLeaving: data.reason_leaving || "",
            leaving_date: formatDateForInput(data.leaving_date),
            dateLeft: formatDateForInput(data.leaving_date),
            completed: data.completed || "YES, PROMOTED",
            qualifiedFor: data.completed || "YES, PROMOTED",
          }));
          setPreviewData({ ...data });
        }
      })
      .catch((err) => {
        console.error("Error fetching student TC data:", err);
      });
  }, [form.regNo, nextTcNo]);

  // Compute next TC no from existingTCs - Format: 58/786/001/2025, 58/786/002/2025, etc.
  useEffect(() => {
    fetch('/api/tc/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExistingTCs(data);
        }
      })
      .catch(err => console.error("Error fetching all TCs:", err));
  }, []);

  useEffect(() => {
    try {
      const currentYear = new Date().getFullYear();

      // Get all TCs for the current year
      const currentYearTCs = (existingTCs || []).filter((t) => {
        const tcNo = t.tc_no || t.tcNo || "";
        const parts = String(tcNo).split('/');
        const year = parts[parts.length - 1]; // Get last part (year)
        return parseInt(year) === currentYear;
      });

      // Extract sequence numbers from current year TCs
      const sequences = currentYearTCs
        .map((t) => {
          const v = t.tc_no || t.tcNo || "";
          const parts = String(v).split('/');
          const seqPart = parts[2]; // Get third part (sequence number)
          return parseInt(seqPart, 10);
        })
        .filter((n) => !isNaN(n));

      const max = sequences.length ? Math.max(...sequences) : 0;
      const nextSeq = max + 1;
      const formatted = `${TC_PREFIX}/${String(nextSeq).padStart(3, "0")}/${currentYear}`;
      setNextTcNo(formatted);
    } catch (e) {
      const currentYear = new Date().getFullYear();
      setNextTcNo(`${TC_PREFIX}/001/${currentYear}`);
    }
  }, [existingTCs]);

  // Keep form.tcNo in sync with nextTcNo when not editing an existing preview
  useEffect(() => {
    if (!previewData) {
      setForm((prev) => ({ ...prev, tcNo: nextTcNo }));
    }
  }, [nextTcNo, previewData]);

  const handleRegNoChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    const s = students.find((st) => st.regNo === value);
    if (s) {
      setForm((prev) => ({
        ...prev,
        regNo: value,
        name: s.name || prev.name,
        dept: s.dept || prev.dept,
        sem: s.sem || prev.sem,
        fatherName: s.fatherName || prev.fatherName,
        dob: s.dob || prev.dob,
      }));
    } else {
      setForm((prev) => ({ ...prev, regNo: value }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildPreviewPayload = (sourceForm) => {
    // Build preview payload: use form values; include fallback fields where relevant
    return {
      tcNo: sourceForm.tcNo || nextTcNo,
      regNo: sourceForm.regNo || "",
      name: sourceForm.name || "__________",
      fatherName: sourceForm.fatherName || "__________",
      dob: sourceForm.dob || "",
      course: sourceForm.course || sourceForm.dept || "",
      courseOfStudy: sourceForm.courseOfStudy || "",
      dateOfAdmission: sourceForm.dateOfAdmission || "",
      dateLeft: sourceForm.dateLeft || "",
      dateOfTransfer: sourceForm.dateOfTransfer || "",
      completed: sourceForm.completed || "YES, PROMOTED",
      identification: sourceForm.identification || "",
      qualifiedFor: sourceForm.qualifiedFor || "",
      conduct: sourceForm.conduct || "GOOD",
      dept: sourceForm.dept || "",
      date: new Date().toLocaleDateString("en-IN"),
    };
  };

  const handleView = (e) => {
    e && e.preventDefault();
    if (!form.regNo) return toast.error("Select Student");

    // Auto-populate dateOfTransfer with today's date if not set
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const updatedForm = {
      ...form,
      // Prefer populating specific fields used in save
      dateMade: form.dateMade || form.dateOfTransfer || today,
      dateIssue: form.dateIssue || today,
    };

    setForm(updatedForm);
    setShowFields(true);

    const data = buildPreviewPayload(updatedForm);
    setPreviewData(data);
  };

  const handleSave = async () => {
    try {
      if (!form.regNo) {
        toast.error("Select Student before saving");
        return;
      }
      const payload = {
        reg_no: form.regNo,
        tc_no: form.tcNo,
        tc_create_date: form.dateMade || form.dateOfTransfer,
        tc_issue_date: form.dateIssue || form.issueDateTC,
        conduct_character: form.conduct,
        reason_leaving: form.reasonForLeaving,
        leaving_date: form.dateLeft,
        whether_completed: form.completed || form.qualifiedFor,
        // Student fields
        Student_Name: form.name,
        Father_Name: form.fatherName,
        Guardian_Name: form.guardianName,
        DOB: form.dob,
        Gender: form.sex,
        Community: form.community,
        Caste: form.caste,
        Nationality: form.nationality,
        Religion: form.religion,
        Admission_Date: form.dateOfAdmission,
        Course_Name: form.course,
        Dept_Name: form.dept,
        Semester: form.sem,
        Year: form.year,
        Year_Of_Department: form.yearOfDepartment,
        Medium_of_Instruction: form.medium_of_instruction,
        Identification_of_Student: form.identification,
      };

      const res = await fetch(`/api/tc/update/${form.regNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get('content-type') || '';
      const json = contentType.includes('application/json') ? await res.json() : { error: await res.text() };
      if (!res.ok) {
        throw new Error(json.error || 'Save failed');
      }

      toast.success("Successfully saved");
      setPreviewData({ reg_no: form.regNo, ...payload });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Save failed");
    }
  };

  const handleClear = () => {
    setForm({
      dept: "",
      sem: "",
      regNo: "",
      tcNo: nextTcNo,
      name: "",
      fatherName: "",
      guardianName: "",
      dob: "",
      caste: "",
      nationality: "",
      religion: "",
      sex: "",
      dateOfAdmission: "",
      dateLeft: "",
      dateOfTransfer: "",
      dateMade: "",
      dateIssue: "",
      issueDateTC: "",
      completed: "YES, PROMOTED",
      identification: "",
      course: "",
      courseOfStudy: "",
      qualifiedFor: "",
      reasonForLeaving: "",
      conduct: "",
      medium_of_instruction: "",
      year: "",
      yearOfDepartment: "",
      community: "",
    });
    setPreviewData(null);
    setShowFields(false);
    // Navigate back to previous page
    try { navigate(-1); } catch { }
  };

  const handlePrintPreview = () => {
    // Print only the preview area
    const el = document.getElementById("tc-preview-area");
    if (!el) return toast.error("No preview to print");
    const html = el.innerHTML;
    const style = `
        @page { size: A4; margin: 12mm; }
        body { font-family: Arial, Helvetica, sans-serif; color: #000; }
      `;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Certificate</title><style>${style}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.onload = () => win.print();
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
              <h4 className="fw-semibold mb-0">Edit Transfer Certificate</h4>
              <button
                type="button"
                className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                onClick={() => setShowTable(!showTable)}
                title={showTable ? 'Hide TC Table' : 'View TC Table'}
              >
                <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                {showTable ? 'Hide Table' : 'View TC Table'}
              </button>
            </div>

            <div className="card p-3 mb-4">
              <div className="row g-24">
                <div className="col-12 col-lg-4">
                  <label className="form-label">Reg No</label>
                  {form.regNo ? (
                    <input
                      type="text"
                      className="form-control"
                      value={form.regNo}
                      readOnly
                    />
                  ) : (
                    <Select
                      options={students
                        .filter(
                          (s) =>
                            (!form.dept || s.dept === form.dept) &&
                            (!form.sem || s.sem === form.sem) &&
                            (!form.yearOfDepartment || Number(s.yearOfDepartment) === Number(form.yearOfDepartment)) &&
                            (!form.year || Number(s.year) === Number(form.year))
                        )
                        .map((s) => ({
                          value: s.regNo,
                          label: `${s.regNo} - ${s.name}`,
                        }))}
                      value={form.regNo ? { value: form.regNo, label: form.regNo } : null}
                      onChange={handleRegNoChange}
                      placeholder="Select Reg No"
                      isClearable
                      isLoading={loadingStudents}
                      isDisabled={loadingStudents}
                      classNamePrefix="react-select"
                    />
                  )}
                </div>

                <div className="col-12 col-lg-4">
                  <label className="form-label">Student Name</label>
                  <input className="form-control" value={form.name} readOnly />
                </div>

                <div className="col-12 col-lg-4">
                  <label className="form-label">Department</label>
                  <input className="form-control" value={form.dept} readOnly />
                </div>

                <div className="col-12 col-lg-4">
                  <label className="form-label">Year Of Department</label>
                  <input className="form-control" value={form.yearOfDepartment} readOnly />
                </div>

                <div className="col-12 col-lg-4">
                  <label className="form-label">Year</label>
                  <input className="form-control" value={form.year} readOnly />
                </div>

                <div className="col-12 col-lg-4">
                  <label className="form-label">Sem</label>
                  <input className="form-control" value={form.sem} readOnly />
                </div>



                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button className="btn btn-outline-primary radius-8 px-20 py-11" onClick={handleView}>
                    Update
                  </button>
                </div>

                {/* Form fields - hidden until Generate is clicked */}
                {showFields && (
                  <div className="row border-top border-neutral-200 g-3">
                    <div className="col-12 col-lg-4">
                      <label className="form-label">Certificate No</label>
                      <input
                        name="tcNo"
                        value={form.tcNo}
                        onChange={handleChange}
                        className="form-control"
                        readOnly
                      />
                    </div>

                    {/* Gender */}
                    <div className="col-12 col-lg-4">
                      <label className="form-label">Gender</label>
                      <select
                        name="sex"
                        value={form.sex}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">D.O.B</label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Father Name</label>
                      <input
                        name="fatherName"
                        value={form.fatherName}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Guardian Name</label>
                      <input
                        name="guardianName"
                        value={form.guardianName}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Nationality</label>
                      <input
                        name="nationality"
                        value={form.nationality}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Nationality"
                      />
                    </div>
                    <div className="col-12 col-lg-4">
                      <label className="form-label">Religion</label>
                      <input
                        name="religion"
                        value={form.religion}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Religion"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Community</label>
                      <input
                        name="community"
                        value={form.community}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Caste</label>
                      <input
                        name="caste"
                        value={form.caste}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Date Of Admission</label>
                      <input
                        type="date"
                        name="dateOfAdmission"
                        value={form.dateOfAdmission}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">
                        Whether the student has completed the course
                      </label>
                      <input
                        name="completed"
                        value={form.completed}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">
                        Reason for leaving the institution
                      </label>
                      <input
                        name="reasonForLeaving"
                        value={form.reasonForLeaving}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Date on which the student left the institution</label>
                      <input
                        type="date"
                        name="dateLeft"
                        value={form.dateLeft}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Date of Transfer Certificate was made</label>
                      <input
                        type="date"
                        name="dateMade"
                        value={form.dateMade}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Date of Transfer Certificate issued</label>
                      <input
                        type="date"
                        name="dateIssue"
                        value={form.dateIssue}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Medium of Study</label>
                      <input
                        type="text"
                        name="medium_of_instruction"
                        value={form.medium_of_instruction}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Identification of Student</label>
                      <input
                        type="text"
                        name="identification"
                        value={form.identification}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-lg-4">
                      <label className="form-label">Conduct & Character</label>
                      <input
                        name="conduct"
                        value={form.conduct}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                      <button className="btn btn-outline-primary-600 radius-8 px-20 py-11" onClick={handleSave}>
                        Save
                      </button>
                      <button className="btn btn-outline-secondary radius-8 px-20 py-11" onClick={handleClear}>
                        Close
                      </button>
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

export default EditTC;
