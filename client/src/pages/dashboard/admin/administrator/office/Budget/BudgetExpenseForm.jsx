import React, { useState, useCallback } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";

// ------------------- MOCK DATA -------------------
const ACADEMIC_YEARS = ["2024-2025", "2025-2026"];
const BUDGET_VERSIONS = ["Original", "Revised 1", "Revised 2"];
const BUDGET_HEADS = [
  "Infrastructure & Maintenance",
  "Staff Salary",
  "Lab & Equipment",
  "Library",
  "Transport",
  "Hostel",
  "Events",
  "Administration",
  "Miscellaneous",
];
const DEPARTMENTS = [
  "Engineering",
  "Science",
  "Commerce",
  "Admin",
  "Hostel",
  "Transport",
];

const INITIAL_APPROVAL = {
  createdBy: "",
  verifiedBy: "",
  approvedBy: "",
  approvalDate: "",
  remarks: "",
};


// Mock approved amounts for each budget head
const MOCK_APPROVED_AMOUNTS = {
  "Infrastructure & Maintenance": 500000,
  "Staff Salary": 1200000,
  "Lab & Equipment": 300000,
  "Library": 100000,
  "Transport": 200000,
  "Hostel": 250000,
  "Events": 50000,
  "Administration": 150000,
  "Miscellaneous": 40000,
};

const INITIAL_ROW = {
  budgetHead: "",
  description: "",
  department: "",
  proposed: "",
  approved: "",
  spent: "",
  balance: "",
  errors: {},
};

export default function CollegeBudgetForm() {
  // ------------------- STATE -------------------
  const [academicYear, setAcademicYear] = useState("");
  const [budgetVersion, setBudgetVersion] = useState("");
  const [rows, setRows] = useState([]);
  const [approval, setApproval] = useState(INITIAL_APPROVAL);
  const [formErrors, setFormErrors] = useState({});

  // ------------------- HANDLERS -------------------
  // Academic year change resets form
  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value);
    setBudgetVersion("");
    setRows([]);
    setApproval(INITIAL_APPROVAL);
    setFormErrors({});
  };

  // Budget version change
  const handleBudgetVersionChange = (e) => {
    setBudgetVersion(e.target.value);
  };

  // Add new row
  const handleAddRow = () => {
    setRows((prev) => [...prev, { ...INITIAL_ROW }]);
  };

  // Delete row
  const handleDeleteRow = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  // Row field change
  const handleRowChange = (idx, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      // If budgetHead is changed, auto-fill approved amount from mock data
      if (field === "budgetHead") {
        updated[idx][field] = value;
        updated[idx].approved = value ? MOCK_APPROVED_AMOUNTS[value] || "" : "";
      } else {
        updated[idx][field] = value;
      }
      // Auto-calculate balance
      const approved = Number(updated[idx].approved) || 0;
      const spent = Number(updated[idx].spent) || 0;
      updated[idx].balance = approved - spent;
      // Clear error for field
      if (updated[idx].errors[field]) updated[idx].errors[field] = "";
      return updated;
    });
  };

  // Approval details change
  const handleApprovalChange = (e) => {
    const { name, value } = e.target;
    setApproval((prev) => ({ ...prev, [name]: value }));
  };

  // Validation logic
  const validateRows = () => {
    let valid = true;
    const heads = new Set();
    const updatedRows = rows.map((row) => {
      const errors = {};
      if (!row.budgetHead) {
        errors.budgetHead = "Budget Head is required.";
        valid = false;
      } else if (heads.has(row.budgetHead)) {
        errors.budgetHead = "Duplicate Budget Head.";
        valid = false;
      } else {
        heads.add(row.budgetHead);
      }
      if (!row.proposed || isNaN(row.proposed) || Number(row.proposed) < 0) {
        errors.proposed = "Proposed Amount must be non-negative number.";
        valid = false;
      }
      if (!row.approved || isNaN(row.approved) || Number(row.approved) < 0) {
        errors.approved = "Approved Amount must be non-negative number.";
        valid = false;
      }
      row.errors = errors;
      return row;
    });
    setRows(updatedRows);
    return valid;
  };

  // Save handler
  const handleSave = (e) => {
    e.preventDefault();
    const errors = {};
    if (!academicYear) errors.academicYear = "Academic Year is required.";
    if (!budgetVersion) errors.budgetVersion = "Budget Version is required.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    if (!validateRows()) return;
    // Log all data
    console.log({
      academicYear,
      budgetVersion,
      rows,
      approval,
    });
    alert("Budget data logged to console.");
  };

  // Reset handler
  const handleReset = () => {
    setAcademicYear("");
    setBudgetVersion("");
    setRows([]);
    setApproval(INITIAL_APPROVAL);
    setFormErrors({});
  };

  // Print/Download handler
  const handlePrintDownload = () => {
    window.print();
    // Or: console.log("Print/Download triggered");
  };

  // ------------------- RENDER -------------------
  return (
    <>
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Budget Expense Entry</h6>
          </div>
          <div className="card h-100 p-0 radius-12 mb-4">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg fw-semibold mb-2">Academic Year & Budget Version</h6>
            </div>
            <div className="card-body p-24">
              <form className="row g-3 align-items-end mb-3" onSubmit={handleSave}>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Academic Year *</label>
                  <select
                    className="form-select"
                    value={academicYear}
                    onChange={handleAcademicYearChange}
                  >
                    <option value="">Select</option>
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {formErrors.academicYear && (
                    <span className="text-danger">{formErrors.academicYear}</span>
                  )}
                </div>
                
              </form>
            </div>
          </div>

          {/* Budget Items Table */}
          <div className="card h-100 p-0 radius-12 mb-4">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <h6 className="text-lg fw-semibold mb-2">Budget Items</h6>
              <button type="button" className="btn btn-sm btn-primary" onClick={handleAddRow}>
                Add Row
              </button>
            </div>
            <div className="card-body p-24">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Budget Head *</th>
                      <th>Description / Purpose</th>
                      <th>Department</th>
                      <th>Proposed Amount *</th>
                      <th>Approved Amount *</th>
                      <th>Spent Amount</th>
                      <th>Balance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <select
                            className="form-select"
                            value={row.budgetHead}
                            onChange={(e) => handleRowChange(idx, "budgetHead", e.target.value)}
                          >
                            <option value="">Select</option>
                            {BUDGET_HEADS.map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          {row.errors.budgetHead && (
                            <span className="text-danger">{row.errors.budgetHead}</span>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={row.description}
                            onChange={(e) => handleRowChange(idx, "description", e.target.value)}
                            placeholder="Purpose"
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={row.department}
                            onChange={(e) => handleRowChange(idx, "department", e.target.value)}
                          >
                            <option value="">Select</option>
                            {DEPARTMENTS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={row.proposed}
                            onChange={(e) => handleRowChange(idx, "proposed", e.target.value)}
                            min="0"
                          />
                          {row.errors.proposed && (
                            <span className="text-danger">{row.errors.proposed}</span>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={row.approved}
                            onChange={(e) => handleRowChange(idx, "approved", e.target.value)}
                            min="0"
                          />
                          {row.errors.approved && (
                            <span className="text-danger">{row.errors.approved}</span>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={row.spent}
                            onChange={(e) => handleRowChange(idx, "spent", e.target.value)}
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control bg-light" value={row.balance} readOnly />
                        </td>
                        <td>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteRow(idx)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center text-muted">No budget items added.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Approval Details Section */}
          <div className="card h-100 p-0 radius-12 mb-4">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg fw-semibold mb-2">Approval Details</h6>
            </div>
            <div className="card-body p-24">
              <form className="row g-3 align-items-end mb-3">
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Created By</label>
                  <input
                    type="text"
                    className="form-control"
                    name="createdBy"
                    value={approval.createdBy}
                    onChange={handleApprovalChange}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Verified By</label>
                  <input
                    type="text"
                    className="form-control"
                    name="verifiedBy"
                    value={approval.verifiedBy}
                    onChange={handleApprovalChange}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Approved By</label>
                  <input
                    type="text"
                    className="form-control"
                    name="approvedBy"
                    value={approval.approvedBy}
                    onChange={handleApprovalChange}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Approval Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="approvalDate"
                    value={approval.approvalDate}
                    onChange={handleApprovalChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    name="remarks"
                    value={approval.remarks}
                    onChange={handleApprovalChange}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mb-4">
            <button className="btn btn-success px-32" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary px-32" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-outline-primary px-32" onClick={handlePrintDownload}>
              Print / Download
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
