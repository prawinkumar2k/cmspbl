import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DataTable from "../../../../../components/DataTable/DataTable";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";

import {
  fetchStudentPhotos,
  createStudentPhoto,
  updateStudentPhoto,
  deleteStudentPhoto,
} from "../../../../../utils/studentPhotoApi";

const PhotoPath = () => {
  // -------------------------------
  // States
  // -------------------------------
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [rollNumbers, setRollNumbers] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});

  const [photoRecords, setPhotoRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // FORM DATA (required)
  const [formData, setFormData] = useState({
    department: "",
    departmentCode: "",
    year: "",
    studentRegNo: "",
    studentName: "",
    photoPath: "",
    photoFile: "",
    photoPreview: "",
    id: null, // for edit mode
  });

  // -------------------------------
  // Load dropdown options from student_master
  // -------------------------------
  useEffect(() => {
    fetch("/api/studentMaster/all")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const deptSet = new Set();
        const yearSet = new Set();
        const rollSet = new Set();
        const map = {};

        data.forEach((s) => {
          if (s.Dept_Name) deptSet.add(s.Dept_Name);
          if (s.Year) yearSet.add(s.Year);
          if (s.Register_Number) {
            rollSet.add(s.Register_Number);
            map[s.Register_Number] = s;
          }
        });

        setDepartments(Array.from(deptSet));
        setYears(Array.from(yearSet));
        setRollNumbers(Array.from(rollSet));
        setStudentsMap(map);
      })
      .catch(() => {
        setDepartments([]);
        setYears([]);
        setRollNumbers([]);
        setStudentsMap({});
      });
  }, []);

  // -------------------------------
  // Handle Changes
  // -------------------------------
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Autofill based on register no (dropdown)
    if (name === "studentRegNo") {
      const found = studentsMap[value];
      if (found) {
        setFormData((prev) => ({
          ...prev,
          studentRegNo: value,
          studentName: found.Student_Name || "",
          department: found.Dept_Name || "",
          departmentCode: found.Dept_Code || "",
          year: found.Year || "",
        }));
        return;
      }
    }

    // Department selected → autofill code from student_master list
    if (name === "department") {
      const deptValue = value;
      let deptCode = "";

      // try to find dept code from loaded students
      const sample = photoRecords.find(
        (r) => r.department === deptValue || r.Dept_Name === deptValue
      );
      if (sample) {
        deptCode = sample.departmentCode || sample.Dept_Code || "";
      }

      setFormData((prev) => ({
        ...prev,
        department: deptValue,
        departmentCode: deptCode,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------
  // Browse Photo
  // -------------------------------
  const handleBrowseClick = () => {
    document.getElementById("photoFileInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!formData.studentRegNo) {
      toast.error("Enter Roll No before selecting photo");
      return;
    }

    const ext = file.name.split(".").pop();
    const photoPath = `${formData.studentRegNo}.${ext}`;

    setFormData((prev) => ({
      ...prev,
      photoFile: file,
      photoPreview: URL.createObjectURL(file),
      photoPath,
    }));
  };

  // -------------------------------
  // Upload (dummy)
  // -------------------------------
  const handleUpload = () => {
    if (!formData.photoFile) return toast.error("Please select a photo");
    toast.success("Photo ready to upload");
  };

  // -------------------------------
  // Save
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define required fields in order
    const REQUIRED_FIELDS = {
      studentRegNo: 'Roll No',
      studentName: 'Student Name',
      department: 'Department',
      year: 'Year',
      photoPath: 'Photo'
    };

    // Check each required field in order and show only the first missing field error
    let firstMissingField = null;
    let firstMissingError = null;

    for (const [fieldName, fieldLabel] of Object.entries(REQUIRED_FIELDS)) {
      const value = formData[fieldName];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        firstMissingField = fieldName;
        firstMissingError = `${fieldLabel} is required`;
        break; // Stop at the first missing field
      }
    }

    // If there's a missing required field, show only that error
    if (firstMissingField && firstMissingError) {
      if (firstMissingField === 'photoPath') {
        toast.error('Upload / choose a photo first');
      } else {
        toast.error(firstMissingError);
      }
      return;
    }

    setLoading(true);

    try {
      let saved;
      if (formData.id) {
        // update existing
        saved = await updateStudentPhoto(formData.id, formData);

        setPhotoRecords((prev) =>
          prev.map((r) => (r.id === saved.id ? saved : r))
        );
        toast.success("Record updated");
      } else {
        // create new
        saved = await createStudentPhoto(formData);
        setPhotoRecords((prev) => [...prev, saved]);
        toast.success("Saved");
      }

      handleClear();
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Clear
  // -------------------------------
  const handleClear = () => {
    setFormData({
      department: "",
      departmentCode: "",
      year: "",
      studentRegNo: "",
      studentName: "",
      photoPath: "",
      photoFile: "",
      photoPreview: "",
      id: null,
    });

    const file = document.getElementById("photoFileInput");
    if (file) file.value = "";
  };

  // -------------------------------
  // BULK UPLOAD
  // -------------------------------
  const handleBulkUpload = async () => {
    toast("Select photos (RegNo.ext)");

    try {
      const fileHandles = await window.showOpenFilePicker({ multiple: true });

      for (const handle of fileHandles) {
        const file = await handle.getFile();
        const base = file.name.split(".")[0]; // RegNo
        const ext = file.name.split(".").pop();

        if (!base) continue;

        const newRecord = {
          studentRegNo: base,
          studentName: "",
          department: "",
          departmentCode: "",
          year: "",
          photoPath: `${base}.${ext}`,
        };

        const saved = await createStudentPhoto(newRecord);
        setPhotoRecords((prev) => [...prev, saved]);
      }

      toast.success("Bulk upload completed");
    } catch (err) {
      toast.error("Cancelled");
    }
  };

  // -------------------------------
  // Load Photo Records
  // -------------------------------
  useEffect(() => {
    setLoading(true);
    fetchStudentPhotos()
      .then((data) => {
        if (Array.isArray(data)) setPhotoRecords(data);
      })
      .catch(() => toast.error("Failed to load records"))
      .finally(() => setLoading(false));
  }, []);

  // -------------------------------
  // Edit
  // -------------------------------
  const handleEdit = (record) => {
    setFormData({
      id: record.id,
      studentRegNo: record.studentRegNo,
      studentName: record.studentName,
      department: record.department,
      departmentCode: record.departmentCode,
      year: record.year,
      photoPath: record.photoPath,
      photoFile: "",
      photoPreview: record.photo_path
        ? `/uploads/photos/${record.photo_path}`
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------
  // Delete
  // -------------------------------
  const handleDelete = (record) => {
    toast(
      (t) => (
        <div>
          <p className="mb-2">Delete this photo record?</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-danger btn-sm"
              onClick={async () => {
                try {
                  await deleteStudentPhoto(record.id);
                  setPhotoRecords((prev) =>
                    prev.filter((r) => r.id !== record.id)
                  );
                  toast.success("Deleted");
                } catch (err) {
                  toast.error("Failed to delete");
                }
                toast.dismiss(t.id);
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
      ),
      { duration: Infinity }
    );
  };

  // -------------------------------
  // Table Columns
  // -------------------------------
  const columns = [
    { accessorKey: "studentRegNo", header: "Roll No" },
    { accessorKey: "studentName", header: "Name" },
    { accessorKey: "departmentCode", header: "Dept Code" },
    { accessorKey: "year", header: "Year" },
    {
      accessorKey: "photoPath",
      header: "Photo Path",
    },
  ];

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <section className="overlay">
        <Sidebar />

        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body">

            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-semibold mb-0">Student Photo Path Management</h6>

              <button
                type="button"
                className={`btn btn-sm ${showTable ? "btn-success" : "btn-outline-info"
                  }`}
                onClick={() => setShowTable(!showTable)}
              >
                {showTable ? "Hide Table" : "View Records"}
              </button>
            </div>

            {/* FORM */}
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">

                    {/* Roll No Dropdown */}
                    <div className="col-md-3">
                      <label className="form-label">Roll No <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="studentRegNo"
                        value={formData.studentRegNo}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        {rollNumbers.map((roll) => (
                          <option key={roll} value={roll}>{roll}</option>
                        ))}
                      </select>
                    </div>

                    {/* Department */}
                    <div className="col-md-3">
                      <label className="form-label">Department <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Department Code */}
                    <div className="col-md-3">
                      <label className="form-label">Dept Code</label>
                      <input
                        className="form-control"
                        readOnly
                        value={formData.departmentCode}
                      />
                    </div>

                    {/* Year */}
                    <div className="col-md-3">
                      <label className="form-label">Year <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Student Name */}
                    <div className="col-md-6">
                      <label className="form-label">Student Name <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Photo Path */}
                    <div className="col-md-6">
                      <label className="form-label">Photo Path</label>
                      <input
                        className="form-control"
                        readOnly
                        value={formData.photoPath}
                      />
                    </div>

                    {/* Upload + Preview */}
                    <div className="col-md-12 d-flex align-items-center gap-3">
                      <input
                        type="file"
                        id="photoFileInput"
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleBrowseClick}
                      >
                        Browse Photo
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={handleUpload}
                      >
                        Upload
                      </button>

                      {formData.photoPreview && (
                        <img
                          src={formData.photoPreview}
                          alt="preview"
                          style={{
                            height: 120,
                            width: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/images/default-photo.png";
                          }}
                        />
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end gap-3 mt-3">
                      <button className="btn btn-outline-primary" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleClear}
                      >
                        Clear
                      </button>
                    </div>

                    {/* Bulk Upload */}
                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-info"
                        onClick={handleBulkUpload}
                      >
                        Bulk Upload
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* TABLE */}
            {showTable && (
              <DataTable
                data={photoRecords}
                columns={columns}
                loading={loading}
                title="Photo Path Records"
                onEdit={handleEdit}
                onDelete={handleDelete}
                enableExport
                enableSelection
              />
            )}
          </div>

          <Footer />
        </div>
      </section>
    </>
  );
};

export default PhotoPath;
