import React, { useState } from "react";
import api from "../../../../../utils/api";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../../../components/css/style.css";
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";
import DataTable from "../../../../../components/DataTable/DataTable";
// import "./CourseDetails.css";
// import FeeViewReport from "./reports/FeeViewReport";
// import FeesSlipReport from "./reports/FeesSlipReport";
// import FeesReceiptReport from "./reports/FeesReceiptReport";

const ExamFee = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  // Cellular editing states
  const [editedRows, setEditedRows] = useState({});
  const [editingCell, setEditingCell] = useState({ rowId: null, colKey: null });
  const [filters, setFilters] = useState({ department: "All", sem: "All" });
  const [loading, setLoading] = useState({});
  const [success, setSuccess] = useState({});
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [newExamFee, setNewExamFee] = useState({
    RegNo: "Reg No",
    StudName: "New Student",
    Department: filters.department,
    Sem: filters.sem,
    Fine: 0,
    Fee: 0,
    TotFee: 0,
    Sem_1: 0,
    Sem_2: 0,
    Sem_3: 0,
    Sem_4: 0,
    Sem_5: 0,
    Sem_6: 0,
    Sem_7: 0,
    Sem_8: 0,
  });
  const [hoveredRegno, setHoveredRegno] = useState("");

  const getCurrentDate = () =>
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const runAction = (key, ms = 700) => {
    setLoading((s) => ({ ...s, [key]: true }));
    setSuccess((s) => ({ ...s, [key]: false }));
    setTimeout(() => {
      setLoading((s) => ({ ...s, [key]: false }));
      setSuccess((s) => ({ ...s, [key]: true }));
      setTimeout(() => setSuccess((s) => ({ ...s, [key]: false })), 1200);
    }, ms);
  };
  // Generate fees receipt report for selected or first filtered row
  const handleFeesReceipt = () => {
    const row = filteredTableData[0];
    if (!row) return toast.error("No student selected");
    // Only call FeesReceiptReport and use its return value
    const html = FeesReceiptReport({ row });
    setPreviewHtml(html);
    setShowPreview(true);
  };

  // Show receipt preview for a row
  const handleShowReceipt = (row) => {
    const html = FeesReceiptReport({ row });
    setPreviewHtml(html);
    setShowPreview(true);
  };

  // Existing print view logic (table report)
  const handlePrintView = () => {
    runAction("printView");
    try {
      // Only call FeeViewReport and use its return value
      const html = FeeViewReport({ filteredTableData, filters });
      setPreviewHtml(html);
      setShowPreview(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintPreviewNow = () => {
    if (!previewHtml) return;
    // Print the inline preview using a hidden iframe so we don't navigate away or open a new tab
    printPreviewInIframe(previewHtml);
  };

  // Helper: print given HTML by writing it into a hidden iframe and calling print()
  const printPreviewInIframe = (html) => {
    if (!html) return;
    try {
      const iframe = document.createElement("iframe");
      // keep it invisible and non-intrusive
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.style.visibility = "hidden";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      // give the iframe a short moment to render
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (err) {
          console.warn("Print failed", err);
        }
        // cleanup after printing (delay to allow print dialog to open)
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (e) {
            /* ignore */
          }
        }, 800);
      }, 300);
    } catch (err) {
      console.error("printPreviewInIframe error", err);
    }
  };

  const handleFeesSlip = () => {
    // For demo, use the first filtered row. You can change to selected row logic if needed.
    const row = filteredTableData[0];
    if (!row) return toast.error("No student selected");
    // Only call FeesSlipReport and use its return value
    const html = FeesSlipReport({ row });
    setPreviewHtml(html);
    setShowPreview(true);
  };

  const handleGenerate = async (rowId) => {
    setShowAddForm(true);
  };

  const handleClose = () => {
    toast.success("Closing exam fee");
    runAction("close");
    setTimeout(() => window.history.back(), 1000);
  };

  // DataTable columns to match StudentTable-style UI
  const columns = [
    {
      accessorKey: "regno",
      header: "Regno",
      cell: ({ row }) => {
        const isEditing =
          editingCell.rowId === row.original.id &&
          editingCell.colKey === "regno";
        const value = editedRows[row.original.id]?.regno ?? row.original.regno;
        return isEditing ? (
          <input
            type="text"
            value={value}
            autoFocus
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  regno: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            className="fw-medium"
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: "regno" })
            }
          >
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "studName",
      header: "StudName",
      cell: ({ row }) => {
        const isEditing =
          editingCell.rowId === row.original.id &&
          editingCell.colKey === "studName";
        const value =
          editedRows[row.original.id]?.studName ?? row.original.studName;
        return isEditing ? (
          <input
            type="text"
            value={value}
            autoFocus
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  studName: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            className="fw-medium"
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: "studName" })
            }
          >
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const isEditing =
          editingCell.rowId === row.original.id &&
          editingCell.colKey === "department";
        const value =
          editedRows[row.original.id]?.department ?? row.original.department;
        return isEditing ? (
          <input
            type="text"
            value={value}
            autoFocus
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  department: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: "department" })
            }
          >
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "sem",
      header: "Sem",
      cell: ({ row }) => {
        const isEditing =
          editingCell.rowId === row.original.id && editingCell.colKey === "sem";
        const value = editedRows[row.original.id]?.sem ?? row.original.sem;
        return isEditing ? (
          <input
            type="number"
            value={value}
            min={1}
            max={8}
            step={1}
            autoFocus
            style={{ width: 80 }}
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  sem: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            className="text-center"
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: "sem" })
            }
          >
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "fine",
      header: "Fine",
      cell: ({ row }) => {
        const isEditing =
          editingCell.rowId === row.original.id &&
          editingCell.colKey === "fine";
        const value = editedRows[row.original.id]?.fine ?? row.original.fine;
        return isEditing ? (
          <input
            type="number"
            value={value}
            min={0}
            step={1}
            autoFocus
            style={{ width: 80 }}
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  fine: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            className="text-end"
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: "fine" })
            }
          >
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: ({ row }) => {
        const isEditing =
          editingCell.rowId === row.original.id && editingCell.colKey === "fee";
        const value = editedRows[row.original.id]?.fee ?? row.original.fee;
        return isEditing ? (
          <input
            type="number"
            value={value}
            min={0}
            step={1}
            autoFocus
            style={{ width: 80 }}
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  fee: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            className="text-end"
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: "fee" })
            }
          >
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "totFee",
      header: "Tot Fee",
      cell: ({ row }) => {
        const isEditing =
          editingCell.rowId === row.original.id &&
          editingCell.colKey === "totFee";
        const value =
          editedRows[row.original.id]?.totFee ?? row.original.totFee;
        return isEditing ? (
          <input
            type="number"
            value={value}
            min={0}
            step={1}
            autoFocus
            style={{ width: 80 }}
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  totFee: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            className="text-end"
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: "totFee" })
            }
          >
            {value}
          </div>
        );
      },
    },
    ...[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => ({
      accessorKey: `Sem_${idx}`,
      header: `Sem_${idx}`,
      cell: ({ row }) => {
        const key = `Sem_${idx}`;
        const isEditing =
          editingCell.rowId === row.original.id && editingCell.colKey === key;
        const value = editedRows[row.original.id]?.[key] ?? row.original[key];
        return isEditing ? (
          <input
            type="number"
            value={value}
            min={0}
            step={1}
            autoFocus
            style={{ width: 80 }}
            onBlur={() => setEditingCell({ rowId: null, colKey: null })}
            onChange={(e) =>
              setEditedRows((r) => ({
                ...r,
                [row.original.id]: {
                  ...r[row.original.id],
                  [key]: e.target.value,
                },
              }))
            }
          />
        ) : (
          <div
            className="text-end"
            onClick={() =>
              setEditingCell({ rowId: row.original.id, colKey: key })
            }
          >
            {value}
          </div>
        );
      },
      enableSorting: false,
    })),
  ];
  // Batch update all edited rows to backend
  const handleUpdateAll = async () => {
    const updates = Object.entries(editedRows);
    for (const [rowId, rowData] of updates) {
      let payload = { ...rowData };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined || payload[k] === null) delete payload[k];
      });
      try {
        await api.put(`/exam-fee/${rowId}`, payload);
        setTableData((tableData) =>
          tableData.map((r) =>
            r.id === Number(rowId) ? { ...r, ...payload } : r
          )
        );
      } catch (err) {
        toast.error(`Failed to update row ${rowId}`);
      }
    }
    setEditedRows({});
    toast.success("Change has been updated");
  };

  // Modal and row expansion state
  const [viewModal, setViewModal] = useState({ show: false, student: null });
  const [editingRowId, setEditingRowId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [tableData, setTableData] = useState([]);

  React.useEffect(() => {
    api
      .get("/exam-fee")
      .then((res) => setTableData(res.data))
      .catch(() => toast.error("Failed to fetch exam fee data"));
  }, []);

  // View action: show modal with all fields
  const handleView = (item) => setViewModal({ show: true, student: item });

  // Edit action: open inline form with pre-filled data
  const handleEdit = (item) => {
    setEditingRowId(item.id);
    setEditFormData({ ...item });
  };

  // Delete action: remove from tableData
  const handleDelete = async (item) => {
    try {
      await api.delete(`/exam-fee/${item.id}`);
      setTableData((prev) => prev.filter((s) => s.id !== item.id));
      toast.success(`Deleted: ${item.studName || item.regno}`);
    } catch (err) {
      toast.error("Failed to delete exam fee row");
    }
  };

  // Inline field change for edit form
  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit edit form
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData) return;
    try {
      const payload = { ...editFormData };
      await api.put(`/exam-fee/${editingRowId}`, payload);
      setTableData((prev) =>
        prev.map((s) => (s.id === editingRowId ? { ...s, ...payload } : s))
      );
      setEditingRowId(null);
      setEditFormData(null);
      toast.success("Row updated successfully");
    } catch (err) {
      toast.error("Failed to update row");
    }
  };

  // Filter table data based on dropdowns
  const filteredTableData = tableData.filter((row) => {
    const departmentMatch =
      filters.department === "All" || row.department === filters.department;
    const semMatch = filters.sem === "All" || row.sem === filters.sem;
    return departmentMatch && semMatch;
  });

  return (
    <section className="overlay">
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
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          {/* Breadcrumb Header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Exam Fee</h6>
          </div>

          <div className="cd-table-container" style={{ marginTop: 16 }}>
            {/* Top controls: dropdowns and buttons (aligned like TimeTable.jsx) */}
            <div
              className="d-flex align-items-center justify-content-between mb-3"
              style={{ gap: 16 }}
            >
              <div className="d-flex align-items-center" style={{ gap: 24 }}>
                <div>
                  <div className="fw-semibold mb-1">Department</div>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 160 }}
                    value={filters.department}
                    onChange={(e) =>
                      setFilters({ ...filters, department: e.target.value })
                    }
                  >
                    <option>All</option>
                    <option>CIVIL</option>
                    <option>CS</option>
                    <option>MECH</option>
                  </select>
                </div>
                <div>
                  <div className="fw-semibold mb-1">Sem</div>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 80 }}
                    value={filters.sem}
                    onChange={(e) =>
                      setFilters({ ...filters, sem: e.target.value })
                    }
                  >
                    <option>All</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                  </select>
                </div>
                <div className="text-sm fw-medium">
                  Student : <span className="fw-bold">{tableData.length}</span>
                </div>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 12 }}>
                <button
                  className="btn btn-outline-primary-600 radius-8 px-20 py-11 me-2"
                  style={{ position: "relative" }}
                  onClick={handlePrintView}
                >
                  {loading.printView && (
                    <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" />
                  )}
                  PRINT VIEW
                </button>
                <input
                  className="form-control form-control-sm me-2"
                  style={{ width: 160 }}
                  placeholder="Regno"
                  value={hoveredRegno || ""}
                  readOnly
                />
                <button
                  className="btn btn-outline-primary-600 radius-8 px-20 py-11 me-2"
                  style={{ position: "relative" }}
                  onClick={handleFeesSlip}
                >
                  {loading.feesSlip && (
                    <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" />
                  )}
                  FEES SLIP
                </button>
                {/* <button className="btn btn-outline-primary-600 radius-8 px-20 py-11 me-2" style={{ position: 'relative' }} onClick={handleFeesTally}>
                  {loading.feesTally && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" />}
                  FEES TALLY
                </button> */}
                <button
                  className="btn btn-outline-primary-600 radius-8 px-20 py-11 me-2"
                  style={{ position: "relative" }}
                  onClick={handleFeesReceipt}
                >
                  {loading.feesReceipt && (
                    <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" />
                  )}
                  FEES RECEIPT
                </button>
                <button
                  className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                  style={{ position: "relative" }}
                  onClick={handleUpdateAll}
                >
                  {loading.generate && (
                    <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" />
                  )}
                  UPDATE
                </button>
                <button
                  className="btn btn-outline-danger-600 radius-8 px-20 py-11 me-2"
                  style={{ position: "relative" }}
                  onClick={handleClose}
                >
                  {loading.close && (
                    <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" />
                  )}
                  CLOSE
                </button>
              </div>
            </div>

            {/* DataTable-based UI (matches StudentTable style) */}
            {showAddForm && (
              <div
                className="card mt-3 mb-3"
                style={{
                  backgroundColor: "#f8f9fc",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <fieldset
                  style={{
                    border: "1px solid #e3e6f0",
                    padding: "15px",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <legend
                    style={{
                      width: "auto",
                      padding: "0 10px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginBottom: 0,
                    }}
                  >
                    Add New Exam Fee
                  </legend>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      // Validate required fields
                      if (
                        !newExamFee.RegNo ||
                        !newExamFee.StudName ||
                        !newExamFee.Department ||
                        !newExamFee.Sem
                      ) {
                        toast.error("Please fill in all required fields");
                        return;
                      }
                      try {
                        const payload = { ...newExamFee };
                        const res = await api.post("/exam-fee", payload);
                        toast.success("Exam Fee row added!");
                        setTableData((prev) => [...prev, res.data]);
                        setNewExamFee({
                          RegNo: "Reg No",
                          StudName: "New Student",
                          Department: filters.department,
                          Sem: filters.sem,
                          Fine: 0,
                          Fee: 0,
                          TotFee: 0,
                          Sem_1: 0,
                          Sem_2: 0,
                          Sem_3: 0,
                          Sem_4: 0,
                          Sem_5: 0,
                          Sem_6: 0,
                          Sem_7: 0,
                          Sem_8: 0,
                        });
                        setShowAddForm(false);
                      } catch (err) {
                        console.error(err.response?.data || err.message);
                        toast.error("Failed to add Exam Fee row");
                      }
                    }}
                  >
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <label className="form-label mb-0">RegNo</label>
                          </div>
                          <div className="col-8">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={newExamFee.RegNo}
                              onChange={(e) =>
                                setNewExamFee((prev) => ({
                                  ...prev,
                                  RegNo: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <label className="form-label mb-0">StudName</label>
                          </div>
                          <div className="col-8">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={newExamFee.StudName}
                              onChange={(e) =>
                                setNewExamFee((prev) => ({
                                  ...prev,
                                  StudName: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <label className="form-label mb-0">
                              Department
                            </label>
                          </div>
                          <div className="col-8">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={newExamFee.Department}
                              onChange={(e) =>
                                setNewExamFee((prev) => ({
                                  ...prev,
                                  Department: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <label className="form-label mb-0">Sem</label>
                          </div>
                          <div className="col-8">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={newExamFee.Sem}
                              onChange={(e) =>
                                setNewExamFee((prev) => ({
                                  ...prev,
                                  Sem: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <label className="form-label mb-0">Fine</label>
                          </div>
                          <div className="col-8">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={newExamFee.Fine}
                              onChange={(e) =>
                                setNewExamFee((prev) => ({
                                  ...prev,
                                  Fine: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <label className="form-label mb-0">Fee</label>
                          </div>
                          <div className="col-8">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={newExamFee.Fee}
                              onChange={(e) =>
                                setNewExamFee((prev) => ({
                                  ...prev,
                                  Fee: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-4">
                            <label className="form-label mb-0">Tot Fee</label>
                          </div>
                          <div className="col-8">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={newExamFee.TotFee}
                              onChange={(e) =>
                                setNewExamFee((prev) => ({
                                  ...prev,
                                  TotFee: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                        <div className="col-md-6" key={idx}>
                          <div className="row align-items-center">
                            <div className="col-4">
                              <label className="form-label mb-0">
                                Sem_{idx}
                              </label>
                            </div>
                            <div className="col-8">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={newExamFee[`Sem_${idx}`]}
                                onChange={(e) =>
                                  setNewExamFee((prev) => ({
                                    ...prev,
                                    [`Sem_${idx}`]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="col-12 mt-3">
                        <div className="d-flex justify-content-center gap-3">
                          <button
                            type="submit"
                            className="btn btn-outline-success-600 radius-8 px-20 py-11"
                            style={{ minWidth: "100px" }}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger-600 radius-8 px-20 py-11"
                            style={{ minWidth: "100px" }}
                            onClick={() => setShowAddForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </fieldset>
              </div>
            )}

            <div className="card-body p-0">
              <div className="p-3">
                {showPreview ? (
                  // Inline printable preview - hide interactive table while preview is visible
                  <div>
                    <div
                      className="d-flex justify-content-end mb-3"
                      style={{ gap: 8 }}
                    >
                      <button
                        className="btn btn-outline-danger-600 radius-8 px-20 py-11"
                        onClick={() => {
                          setShowPreview(false);
                        }}
                      >
                        CLOSE PREVIEW
                      </button>
                    </div>
                    <div
                      className="preview-container"
                      style={{ overflowX: "auto" }}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                ) : (
                  <>
                    <DataTable
                      data={filteredTableData}
                      columns={columns.map((col) =>
                        col.accessorKey === "regno"
                          ? {
                            ...col,
                            cell: ({ row }) => (
                              <div
                                onMouseEnter={() =>
                                  setHoveredRegno(row.original.regno)
                                }
                                onMouseLeave={() => setHoveredRegno("")}
                              >
                                <div className="fw-medium">
                                  {row.original.regno}
                                </div>
                              </div>
                            ),
                          }
                          : col
                      )}
                      loading={false}
                      title={"Exam Fee Management"}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      enableExport={true}
                      enableSelection={false}
                      showControls={false}
                      showHeader={false}
                      pageSize={10}
                    />
                    {/* Inline edit form below the row, matching TimeTable.jsx */}
                    {editingRowId && editFormData && (
                      <div
                        className="card mt-3 mb-3"
                        style={{
                          backgroundColor: "#f8f9fc",
                          padding: "20px",
                          borderRadius: "8px",
                        }}
                      >
                        <fieldset
                          style={{
                            border: "1px solid #e3e6f0",
                            padding: "15px",
                            borderRadius: "4px",
                            position: "relative",
                          }}
                        >
                          <legend
                            style={{
                              width: "auto",
                              padding: "0 10px",
                              fontSize: "14px",
                              fontWeight: "bold",
                              marginBottom: 0,
                            }}
                          >
                            Edit Row
                          </legend>
                          <form onSubmit={handleEditFormSubmit}>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <div className="row align-items-center">
                                  <div className="col-4">
                                    <label className="form-label mb-0">
                                      RegNo
                                    </label>
                                  </div>
                                  <div className="col-8">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editFormData.regno}
                                      onChange={(e) =>
                                        handleEditFormChange(
                                          "regno",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row align-items-center">
                                  <div className="col-4">
                                    <label className="form-label mb-0">
                                      StudName
                                    </label>
                                  </div>
                                  <div className="col-8">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editFormData.studName}
                                      onChange={(e) =>
                                        handleEditFormChange(
                                          "studName",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row align-items-center">
                                  <div className="col-4">
                                    <label className="form-label mb-0">
                                      Department
                                    </label>
                                  </div>
                                  <div className="col-8">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editFormData.department}
                                      onChange={(e) =>
                                        handleEditFormChange(
                                          "department",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row align-items-center">
                                  <div className="col-4">
                                    <label className="form-label mb-0">
                                      Sem
                                    </label>
                                  </div>
                                  <div className="col-8">
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      value={editFormData.sem}
                                      min={1}
                                      max={8}
                                      step={1}
                                      onChange={(e) =>
                                        handleEditFormChange(
                                          "sem",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row align-items-center">
                                  <div className="col-4">
                                    <label className="form-label mb-0">
                                      Fine
                                    </label>
                                  </div>
                                  <div className="col-8">
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      value={editFormData.fine}
                                      min={0}
                                      step={1}
                                      onChange={(e) =>
                                        handleEditFormChange(
                                          "fine",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row align-items-center">
                                  <div className="col-4">
                                    <label className="form-label mb-0">
                                      Fee
                                    </label>
                                  </div>
                                  <div className="col-8">
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      value={editFormData.fee}
                                      min={0}
                                      step={1}
                                      onChange={(e) =>
                                        handleEditFormChange(
                                          "fee",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row align-items-center">
                                  <div className="col-4">
                                    <label className="form-label mb-0">
                                      Tot Fee
                                    </label>
                                  </div>
                                  <div className="col-8">
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      value={editFormData.totFee}
                                      min={0}
                                      step={1}
                                      onChange={(e) =>
                                        handleEditFormChange(
                                          "totFee",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                                <div className="col-md-6" key={idx}>
                                  <div className="row align-items-center">
                                    <div className="col-4">
                                      <label className="form-label mb-0">
                                        Sem_{idx}
                                      </label>
                                    </div>
                                    <div className="col-8">
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={editFormData[`Sem_${idx}`]}
                                        min={0}
                                        step={1}
                                        onChange={(e) =>
                                          handleEditFormChange(
                                            `Sem_${idx}`,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div className="col-12 mt-3">
                                <div className="d-flex justify-content-center gap-3">
                                  <button
                                    type="submit"
                                    className="btn btn-outline-success-600 radius-8 px-20 py-11"
                                    style={{ minWidth: "100px" }}
                                  >
                                    Update
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger-600 radius-8 px-20 py-11"
                                    style={{ minWidth: "100px" }}
                                    onClick={() => {
                                      setEditingRowId(null);
                                      setEditFormData(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </fieldset>
                      </div>
                    )}
                    {/* View Modal for student details */}
                    {viewModal.show && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100vw",
                          height: "100vh",
                          background: "rgba(0,0,0,0.3)",
                          zIndex: 9999,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 8,
                            minWidth: 320,
                            maxWidth: 400,
                            padding: 24,
                            boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
                            position: "relative",
                          }}
                        >
                          <button
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 12,
                              border: "none",
                              background: "none",
                              fontSize: 22,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setViewModal({ show: false, student: null })
                            }
                          >
                            &times;
                          </button>
                          <h5 style={{ marginBottom: 18 }}>Student Details</h5>
                          {viewModal.student && (
                            <div style={{ lineHeight: 2 }}>
                              <div>
                                <b>Regno:</b> {viewModal.student.regno}
                              </div>
                              <div>
                                <b>StudName:</b> {viewModal.student.studName}
                              </div>
                              <div>
                                <b>Department:</b>{" "}
                                {viewModal.student.department}
                              </div>
                              <div>
                                <b>Sem:</b> {viewModal.student.sem}
                              </div>
                              <div>
                                <b>Fine:</b> {viewModal.student.fine}
                              </div>
                              <div>
                                <b>Fee:</b> {viewModal.student.fee}
                              </div>
                              <div>
                                <b>Tot Fee:</b> {viewModal.student.totFee}
                              </div>
                              <div>
                                <b>Sem_1:</b> {viewModal.student.Sem_1}
                              </div>
                              <div>
                                <b>Sem_2:</b> {viewModal.student.Sem_2}
                              </div>
                              <div>
                                <b>Sem_3:</b> {viewModal.student.Sem_3}
                              </div>
                              <div>
                                <b>Sem_4:</b> {viewModal.student.Sem_4}
                              </div>
                              <div>
                                <b>Sem_5:</b> {viewModal.student.Sem_5}
                              </div>
                              <div>
                                <b>Sem_6:</b> {viewModal.student.Sem_6}
                              </div>
                              <div>
                                <b>Sem_7:</b> {viewModal.student.Sem_7}
                              </div>
                              <div>
                                <b>Sem_8:</b> {viewModal.student.Sem_8}
                              </div>
                            </div>
                          )}
                          <div style={{ textAlign: "right", marginTop: 18 }}>
                            <button
                              className="btn btn-outline-primary-600"
                              onClick={() =>
                                setViewModal({ show: false, student: null })
                              }
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default ExamFee;
