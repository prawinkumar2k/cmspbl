import React, { useState, useEffect } from "react";
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";

const CheckList = () => {
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [type, setType] = useState("regular");
  const [data, setData] = useState([]);
  const [viewOnly, setViewOnly] = useState(false);

  useEffect(() => {
    fetch("/api/checklist/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data));
  }, []);

  const fetchChecklist = async () => {
    const res = await fetch(
      `/api/checklist/report?department=${department}&type=${type}`
    );
    const json = await res.json();
    setData(json);
  };

  const handleView = () => {
    setViewOnly(true);
    fetchChecklist();
  };

  const handleDepartmentChange = (e) => {
    const code = e.target.value;
    setDepartment(code);
    const dept = departments.find((d) => d.Dept_Code === code);
    setDepartmentName(dept ? dept.Dept_Name : "");
  };

  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-main-body p-20">

          {/* FILTER */}
          <div className="card mb-3 print-hide">
            <div className="card-body row g-3">
              <div className="col-12 col-lg-4">
                <label>Department</label>
                <select
                  className="form-select"
                  value={department}
                  onChange={handleDepartmentChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.Dept_Code} value={dept.Dept_Code}>
                      {dept.Dept_Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dept Code */}
              <div className="col-12 col-lg-4">
                <label>Dept Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={department}
                  readOnly
                />
              </div>

              <div className="col-12 col-lg-4">
                <label>Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="regular">Regular</option>
                  <option value="arrear">Arrear</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="col-lg-4 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={handleView}>
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* REPORT */}
          {viewOnly && (
            <div className="card p-4 print-area">
              <h4 className="text-center fw-bold">
                EIT POLYTECHNIC INSTITUTION
              </h4>
              <p className="text-center">
                CHECK LIST – {departmentName}
              </p>

              <table className="table table-bordered" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Sub Code</th>
                    <th>Sub Name</th>
                    {type === "regular" && <th>Regular Register Numbers</th>}
                    {type === "arrear" && <th>Arrear Register Numbers</th>}
                    {type === "both" && <>
                      <th>Regular Register Numbers</th>
                      <th>Arrear Register Numbers</th>
                    </>}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.length > 0 ? data.map((row, idx) => {
                    const total = (row.Regular_Count || 0) + (row.Arrear_Count || 0);
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{row.Sub_Code}</td>
                        <td>{row.Sub_Name}</td>
                        {type === "regular" && <td>{row.Regular_Registers || '-'}</td>}
                        {type === "arrear" && <td>{row.Arrear_Registers || '-'}</td>}
                        {type === "both" && <>
                          <td>{row.Regular_Registers || '-'}</td>
                          <td>{row.Arrear_Registers || '-'}</td>
                        </>}
                        <td>{total}</td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={type === "both" ? 6 : 5} className="text-center">No data found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </section>
  );
};

export default CheckList;
