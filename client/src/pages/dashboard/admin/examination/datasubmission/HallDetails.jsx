import React, { useState, useEffect, useRef } from "react";
import api from '../../../../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";
import HallTable from "./HallTable";


const HallDetails = () => {
  // Custom modal state (must be inside component)

  // Removed print preview logic
  const [viewModal, setViewModal] = useState({ show: false, hall: null });
  // Removed update/edit state
  const [editMode, setEditMode] = useState(false);
  // Fix: loading and success state for runAction and button feedback
  const [loading, setLoading] = useState({});
  const [success, setSuccess] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [hallData, setHallData] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [newHall, setNewHall] = useState({
    hall_name: "",
    capacity: "",
    rows: "",
    columns: "",
    preference: ""
  });
  // Add this state for editing hall id
  const [editingHallId, setEditingHallId] = useState(null);
  // Inline editing state
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  // Validation error state
  const [hallNameError, setHallNameError] = useState('');
  const [errors, setErrors] = useState({});

  // Add Hall Modal State
  const [showNewHallCard, setShowNewHallCard] = useState(false);
  const [newHallFormModal, setNewHallFormModal] = useState({
    hall_code: '',
    hall_name: '',
    rows: '',
    columns: '',
    capacity: '',
    type: 'Theory Hall',
    building: '',
    floor: '',
    location_note: '',
    status: 'Active',
    facilities: '',
    preference: ''
  });

  // Toast helpers using react-toastify (same as TimeTable)
  const showInfoLoading = (id, message) => {
    toast.info(message, { toastId: id, autoClose: false, position: 'top-right' });
  };
  const showError = (msg) => toast.error(msg, { position: 'top-right' });
  const showSuccess = (msg) => toast.success(msg, { position: 'top-right' });

  // Normalize server row to report row shape
  const normalizeRowForReport = (r) => {
    if (!r) return { id: null, hall_name: '', rows: '', columns: '', capacity: 0, preference: '' };
    const toNumber = (v) => {
      if (v === undefined || v === null || v === '') return 0;
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? 0 : n;
    };
    return {
      id: r.id ?? r.ID ?? r.Id ?? null,
      hall_name: r.hall_name ?? r.Hall_Name ?? r.hallName ?? r.name ?? '',
      rows: r.rows ?? r.Total_Rows ?? r.total_rows ?? r.TotalRows ?? '',
      columns: r.columns ?? r.Total_Columns ?? r.total_columns ?? r.TotalColumns ?? '',
      capacity: toNumber(r.capacity ?? r.Seating_Capacity ?? r.seating_capacity ?? r.SeatingCapacity ?? 0),
      preference: r.preference ?? r.Preference_Order ?? r.preference_order ?? r.PreferenceOrder ?? ''
    };
  };

  const handleReportClick = async () => {
    try {
      const response = await api.get('/hall');
      const raw = response.data || [];
      const mapped = Array.isArray(raw) ? raw.map(normalizeRowForReport) : [normalizeRowForReport(raw)];
      generateHallReport(mapped);
    } catch (err) {
      console.error('Error fetching halls for report:', err);
      showError('Failed to fetch hall data for report');
    }
  };

  // Use a hardcoded error color for invalid input styling
  const ERROR_COLOR = '#e74c3c';
  const invalidInputStyle = {
    background: '#fff5f5',
    borderColor: ERROR_COLOR,
    boxShadow: `inset 0 0 0 1px ${ERROR_COLOR}`,
  };

  const invalidIconStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '18px',
    height: '18px',
    pointerEvents: 'none',
    color: ERROR_COLOR,
  };


  const runAction = (key, ms = 700) => {
    setLoading((s) => ({ ...s, [key]: true }));
    setSuccess((s) => ({ ...s, [key]: false }));
    setTimeout(() => {
      setLoading((s) => ({ ...s, [key]: false }));
      setSuccess((s) => ({ ...s, [key]: true }));
      setTimeout(() => setSuccess((s) => ({ ...s, [key]: false })), 1200);
    }, ms);
  };

  const handleSave = () => {
    const savingId = 'saving-hall';
    showInfoLoading(savingId, 'Saving hall details...');
    runAction('save');
    setTimeout(() => {
      toast.dismiss(savingId);
      showSuccess('Hall details saved successfully!');
    }, 1200);
  };


  const handleAddClick = async () => {
    // Fetch existing halls to calculate next preference
    try {
      const response = await api.get('/hall');
      const existingHalls = response.data || [];
      let nextPreference = 1;
      if (existingHalls.length > 0) {
        const maxPreference = Math.max(...existingHalls.map(hall => parseInt(hall.preference || hall.Preference_Order || hall.Preference_Order || 0) || 0));
        nextPreference = maxPreference + 1;
      }
      setNewHall({
        hall_name: "",
        capacity: "",
        rows: "",
        columns: "",
        preference: String(nextPreference)
      });
    } catch (err) {
      console.error('Error fetching halls for preference:', err);
      setNewHall({ hall_name: "", capacity: "", rows: "", columns: "", preference: "1" });
    }
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    setNewHall(prev => {
      let updated = { ...prev, [name]: value };
      // Auto-calculate capacity if rows or columns changes
      if (name === "rows" || name === "columns") {
        const rows = name === "rows" ? parseInt(value) || 0 : parseInt(prev.rows) || 0;
        const columns = name === "columns" ? parseInt(value) || 0 : parseInt(prev.columns) || 0;
        updated.capacity = rows * columns ? String(rows * columns) : "";
      }
      return updated;
    });

    // Clear field-level error when user types
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Validate hall name for duplicates using API
    if (name === "hall_name" && value.trim()) {
      try {
        const response = await api.get('/hall');
        const existingHalls = response.data || [];
        const isDuplicate = existingHalls.some(hall => {
          const name = (hall.hall_name || hall.Hall_Name || hall.hallName || '').toString().toLowerCase();
          return name === value.toLowerCase();
        });
        if (isDuplicate) setHallNameError('Hall name already exists');
        else setHallNameError('');
      } catch (err) {
        console.error('Error checking for duplicates:', err);
        setHallNameError('');
      }
    } else if (name === 'hall_name') {
      setHallNameError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newHall.hall_name || !newHall.hall_name.trim()) newErrors.hall_name = 'Hall name is required';
    if (!newHall.rows || !String(newHall.rows).trim()) newErrors.rows = 'Row is required';
    if (!newHall.columns || !String(newHall.columns).trim()) newErrors.columns = 'Column is required';
    if (!newHall.preference || !String(newHall.preference).trim()) newErrors.preference = 'Preference is required';
    if (hallNameError) newErrors.hall_name = hallNameError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // show first error as toast and focus not implemented here
      showError(Object.values(newErrors)[0]);
      return;
    }

    try {
      const payload = {
        Hall_Name: newHall.hall_name,
        Total_Rows: parseInt(newHall.rows) || 0,
        Total_Columns: parseInt(newHall.columns) || 0,
        Seating_Capacity: parseInt(newHall.capacity) || 0,
        Preference: newHall.preference,
        Hall_Type: newHall.hall_type || null,
        Floor_Number: newHall.floor_number || null,
        Block_Name: newHall.block_name || null,
        Status: newHall.status || undefined
      };

      if (editMode && editingHallId) {
        // Update existing hall
        await api.put(`/hall/${editingHallId}`, payload);
        showSuccess('Hall details updated successfully!');
      } else {
        // Add new hall
        await api.post('/hall', payload);
        showSuccess('Hall details added successfully!');
      }
      setRefreshTable(!refreshTable);
      setNewHall({ hall_name: "", capacity: "", rows: "", columns: "", preference: "" });
      setShowForm(false);
      setEditMode(false);
    } catch (err) {
      console.error('Error adding hall:', err.response ? err.response.data : err.message);
      showError('Failed to add hall');
    }
  };

  const handleCancel = () => {
    setNewHall({ hall_name: "", capacity: "", rows: "", columns: "", preference: "" });
    setHallNameError('');
    setShowForm(false);
    setEditMode(false);
  };

  const handleAddHallModalClick = () => {
    // Calculate next preference order before showing modal
    (async () => {
      try {
        const response = await api.get('/hall');
        const existingHalls = response.data || [];
        let nextPreference = 1;
        if (existingHalls.length > 0) {
          const maxPreference = Math.max(...existingHalls.map(hall => parseInt(hall.preference || hall.Preference_Order || hall.preference_order || 0) || 0));
          nextPreference = maxPreference + 1;
        }
        setNewHallFormModal(prev => ({ ...prev, preference: String(nextPreference) }));
      } catch (err) {
        console.error('Error fetching halls for modal preference:', err);
        setNewHallFormModal(prev => ({ ...prev, preference: '1' }));
      } finally {
        setShowNewHallCard(true);
      }
    })();
  };

  const handleHallFormModalChange = (e) => {
    const { name, value } = e.target;
    setNewHallFormModal(prev => {
      let updated = { ...prev, [name]: value };
      // Auto-calculate capacity if rows or columns change
      if (name === 'rows' || name === 'columns') {
        const rows = name === 'rows' ? parseInt(value) || 0 : parseInt(prev.rows) || 0;
        const cols = name === 'columns' ? parseInt(value) || 0 : parseInt(prev.columns) || 0;
        updated.capacity = rows * cols ? String(rows * cols) : '';
      }
      return updated;
    });
  };

  const handleCreateHallModal = async (e) => {
    e.preventDefault();
    if (!newHallFormModal.hall_name || !newHallFormModal.rows || !newHallFormModal.columns) {
      showError('Please fill in required fields');
      return;
    }

    try {
      const payload = {
        Hall_Code: newHallFormModal.hall_code || '',
        Hall_Name: newHallFormModal.hall_name,
        Total_Rows: parseInt(newHallFormModal.rows),
        Total_Columns: parseInt(newHallFormModal.columns),
        Seating_Capacity: parseInt(newHallFormModal.capacity),
        Hall_Type: newHallFormModal.type,
        Block_Name: newHallFormModal.building,
        Floor_Number: newHallFormModal.floor,
        Location_Note: newHallFormModal.location_note || '',
        Facilities: newHallFormModal.facilities || '',
        Status: newHallFormModal.status,
        Preference: newHallFormModal.preference || ''
      };

      if (editMode && editingHallId) {
        await api.put(`/hall/${editingHallId}`, payload);
        showSuccess('Hall updated successfully');
      } else {
        await api.post('/hall', payload);
        showSuccess('Hall created successfully');
      }

      // Reset form
      setNewHallFormModal({
        hall_code: '',
        hall_name: '',
        rows: '',
        columns: '',
        capacity: '',
        type: 'Theory Hall',
        building: '',
        floor: '',
        location_note: '',
        status: 'Active',
        facilities: '',
        preference: ''
      });
      setEditMode(false);
      setEditingHallId(null);
      setShowNewHallCard(false);
      setRefreshTable(!refreshTable);
    } catch (err) {
      console.error('Error creating/updating hall:', err);
      showError(err.response?.data?.error || 'Failed to save hall');
    }
  };

  const handleCloseHallModal = () => {
    setShowNewHallCard(false);
    setNewHallFormModal({
      hall_code: '',
      hall_name: '',
      rows: '',
      columns: '',
      capacity: '',
      type: 'Theory Hall',
      building: '',
      floor: '',
      location_note: '',
      status: 'Active',
      facilities: ''
    });
  };

  const getHallPreviewSeats = () => {
    const rows = parseInt(newHallFormModal.rows) || 0;
    const cols = parseInt(newHallFormModal.columns) || 0;
    const seats = [];
    for (let i = 1; i <= rows * cols; i++) {
      seats.push(i);
    }
    return seats;
  };

  // Non-destructive handlers for actions column (mirrors ExamFee behavior)
  const handleView = (item) => {
    setViewModal({ show: true, hall: item });
  };

  // Handle edit - enable inline editing
  const handleEdit = (item) => {
    setNewHall({
      hall_name: item.hall_name || item.Hall_Name || "",
      capacity: item.capacity || item.Seating_Capacity || "",
      rows: item.rows || item.Total_Rows || "",
      columns: item.columns || item.Total_Columns || "",
      preference: item.preference || item.Preference || ""
    });
    setNewHallFormModal({
      hall_code: item.hall_code || item.Hall_Code || '',
      hall_name: item.hall_name || item.Hall_Name || '',
      rows: item.rows || item.Total_Rows || '',
      columns: item.columns || item.Total_Columns || '',
      capacity: item.capacity || item.Seating_Capacity || '',
      type: item.type || item.Hall_Type || 'Theory Hall',
      building: item.building || item.Block_Name || '',
      floor: item.floor || item.Floor_Number || '',
      location_note: item.location_note || item.Location_Note || '',
      status: item.status || item.Status || 'Active',
      facilities: item.facilities || item.Facilities || '',
      preference: item.preference || item.Preference || ''
    });
    setEditingHallId(item.id);
    setEditMode(true);
    setShowNewHallCard(true);
    showSuccess('Edit mode enabled. You can now update the record.');
  };

  // Delete action: remove from tableData
  const handleDelete = async (item) => {
    try {
      await api.delete(`/hall/${item.id}`);
      setHallData(prev => prev.filter(h => h.id !== item.id));
      showSuccess('Hall deleted');
      setRefreshTable(!refreshTable);
    } catch (err) {
      console.error('Error deleting hall:', err.response ? err.response.data : err.message);
      showError('Failed to delete hall');
    }
  };

  // Click outside to close inline edit
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!editingRowId) return;

      // Check if click is on a table cell, input, or the UPDATE button
      const isTableCell = event.target.closest('td');
      const isInput = event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT';
      const isUpdateButton = event.target.closest('button')?.textContent?.includes('UPDATE');

      if (!isTableCell && !isInput && !isUpdateButton) {
        setEditingRowId(null);
        setEditedData({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingRowId]);

  // Standardized Hall Report Generation (following CurrentBorrower pattern)
  const generateHallReport = (dataToPrint) => {
    if (!dataToPrint || dataToPrint.length === 0) {
      showError('No records to print');
      return;
    }

    const rowsPerPage = 10;
    const totalPages = Math.ceil(dataToPrint.length / rowsPerPage);
    const totalCapacityAll = dataToPrint.reduce((sum, row) => sum + (parseInt(row.capacity) || 0), 0);
    let fullHtml = '';

    for (let i = 0; i < totalPages; i++) {
      const pageData = dataToPrint.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
      let tableRows = '';

      pageData.forEach((row, idx) => {
        const globalIdx = i * rowsPerPage + idx + 1;
        tableRows += `
          <tr style="height: 34px;">
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${globalIdx}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.preference || ''}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: left; font-size: 11px;">${row.hall_name || ''}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.rows || ''}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.columns || ''}</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${row.capacity || 0}</td>
          </tr>
        `;
      });

      // Fill empty rows to make exactly 10 rows per page
      const emptyRowsCount = rowsPerPage - pageData.length;
      for (let j = 0; j < emptyRowsCount; j++) {
        tableRows += `
          <tr style="height: 34px;">
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
            <td style="border: 1.5px solid #000; padding: 4px;">&nbsp;</td>
          </tr>
        `;
      }

      // Add total row on the last page
      if (i === totalPages - 1) {
        tableRows += `
          <tr style="height: 34px; font-weight: bold; background-color: #f2f2f2;">
            <td colspan="5" style="border: 1.5px solid #000; padding: 4px; text-align: right; padding-right: 15px; font-size: 11px;">Total Capacity:</td>
            <td style="border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px;">${totalCapacityAll}</td>
          </tr>
        `;
      }

      fullHtml += `
        <div class="page-container" style="page-break-after: always; width: 210mm; height: 297mm; padding: 10mm; box-sizing: border-box; background: white; overflow: hidden; margin: 0 auto;">
          <div style="border: 2px solid #000; padding: 12px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; gap: 10px;">
              <div style="width: 80px; text-align: center; flex-shrink: 0;">
                <img src="/public/assets/images/GRT.png" alt="logo" style="width: 80px; height: 80px; object-fit: contain;" />
              </div>
              <div style="flex: 1; text-align: center;">
                <div style="font-size: 18px; font-weight: 900; letter-spacing: 0.5px; color: #000; line-height: 1.1;">
                  GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                </div>
                <div style="font-size: 11px; font-weight: 500; color: #000; line-height: 1.2; margin-top: 2px;">
                  GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                </div>
                <div style="font-size: 10px; color: #000; line-height: 1.2;">
                  Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                </div>
              </div>
            </div>

            <div style="text-align: center; margin: 15px 0; font-weight: 900; font-size: 15px; letter-spacing: 0.8px;">
              HALL DETAILS REPORT
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; table-layout: fixed;">
              <thead>
                <tr style="background-color: #f2f2f2; height: 32px;">
                  <th style="border: 1.5px solid #000; width: 10%; font-size: 10px; text-align: center;">Sl.No</th>
                  <th style="border: 1.5px solid #000; width: 15%; font-size: 10px; text-align: center;">Preference</th>
                  <th style="border: 1.5px solid #000; width: 35%; font-size: 10px; text-align: center;">Hall Name</th>
                  <th style="border: 1.5px solid #000; width: 13%; font-size: 10px; text-align: center;">Row</th>
                  <th style="border: 1.5px solid #000; width: 13%; font-size: 10px; text-align: center;">Column</th>
                  <th style="border: 1.5px solid #000; width: 14%; font-size: 10px; text-align: center;">Capacity</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>

            <div style="margin-top: auto; padding-top: 20px; text-align: right; font-size: 11px; padding-right: 20px;">
              <div><b>Principal</b></div>
            </div>
          </div>
        </div>
      `;
    }

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Hall Details Report</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; background: #fff; }
            .page-container { box-sizing: border-box; }
            .page-container:last-child { page-break-after: auto !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>${fullHtml}</body>
      </html>
    `);
    win.document.close();
    win.onload = () => {
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);
    };
  };

  return (
    <>
      {viewModal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 8, minWidth: 320, maxWidth: 400, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button style={{ position: 'absolute', top: 8, right: 12, border: 'none', background: 'none', fontSize: 22, cursor: 'pointer' }} onClick={() => setViewModal({ show: false, hall: null })}>&times;</button>
            <h5 style={{ marginBottom: 18 }}>Hall Details</h5>
            {viewModal.hall && (
              <div style={{ lineHeight: 2 }}>
                <div><b>Hall No:</b> {viewModal.hall.hallno}</div>
                <div><b>Capacity:</b> {viewModal.hall.capacity}</div>
                <div><b>H Row:</b> {viewModal.hall.hrow}</div>
                <div><b>H Column:</b> {viewModal.hall.hcolumn}</div>
                <div><b>Hall Prefer:</b> {viewModal.hall.hallPrefer}</div>
                <div><b>Commit:</b> {viewModal.hall.commit ? 'Yes' : 'No'}</div>
              </div>
            )}
            <div style={{ textAlign: 'right', marginTop: 18 }}>
              <button className="btn btn-outline-primary-600" onClick={() => setViewModal({ show: false, hall: null })}>Close</button>
            </div>
          </div>
        </div>
      )}
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
              <h6 className="fw-semibold mb-0">Hall Details</h6>
            </div>
            <div className="cd-table-container" style={{ marginTop: 16 }}>
              <div className="cd-action-buttons mt-3 d-flex align-items-center gap-2">
                {!showNewHallCard && (
                  <>
                    <button className="btn btn-outline-primary radius-8 px-20 py-11 me-2" style={{ position: 'relative' }} onClick={handleAddHallModalClick}>+ New Hall</button>
                    <button
                      className="btn btn-outline-primary radius-8 px-20 py-11 me-2"
                      style={{ position: 'relative' }}
                      onClick={handleReportClick}
                    >
                      Report
                    </button>
                  </>
                )}
                {showNewHallCard && <button className="btn btn-outline-secondary btn-sm me-2" onClick={handleCloseHallModal}>HIDE</button>}
              </div>
              {showNewHallCard && (
                <div className="card mt-3 mb-3" style={{ backgroundColor: '#f8f9fc', padding: '20px', borderRadius: '8px' }}>
                  <fieldset style={{ border: '1px solid #e3e6f0', padding: '15px', borderRadius: '4px', position: 'relative' }}>
                    <legend style={{ width: 'auto', padding: '0 10px', fontSize: '14px', fontWeight: 'bold', marginBottom: 0 }}>Create New Hall</legend>
                    <form onSubmit={handleCreateHallModal}>
                      <div className="row g-3">
                        {/* Hall Code */}
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Hall Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="hall_code"
                            value={newHallFormModal.hall_code}
                            onChange={handleHallFormModalChange}
                            placeholder="e.g., H001"
                          />
                        </div>

                        {/* Hall Name */}
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Hall Name <span style={{ color: 'red' }}>*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            name="hall_name"
                            value={newHallFormModal.hall_name}
                            onChange={handleHallFormModalChange}
                            placeholder="e.g., Payee"
                            required
                          />
                        </div>

                        {/* Rows */}
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Rows <span style={{ color: 'red' }}>*</span></label>
                          <input
                            type="number"
                            className="form-control"
                            name="rows"
                            value={newHallFormModal.rows}
                            onChange={handleHallFormModalChange}
                            placeholder="8"
                            min="1"
                            required
                          />
                        </div>

                        {/* Columns */}
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Columns <span style={{ color: 'red' }}>*</span></label>
                          <input
                            type="number"
                            className="form-control"
                            name="columns"
                            value={newHallFormModal.columns}
                            onChange={handleHallFormModalChange}
                            placeholder="5"
                            min="1"
                            required
                          />
                        </div>

                        {/* Capacity */}
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Capacity</label>
                          <input
                            type="text"
                            className="form-control"
                            name="capacity"
                            value={newHallFormModal.capacity}
                            readOnly
                            placeholder="Auto-calculated"
                          />
                        </div>

                        {/* Type */}
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Type</label>
                          <select
                            className="form-select"
                            name="type"
                            value={newHallFormModal.type}
                            onChange={handleHallFormModalChange}
                          >
                            <option>Theory Hall</option>
                            <option>Lab Hall</option>
                            <option>Practical Hall</option>
                            <option>Seminar Hall</option>
                          </select>
                        </div>

                        {/* Location Details */}
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Building</label>
                          <input
                            type="text"
                            className="form-control"
                            name="building"
                            value={newHallFormModal.building}
                            onChange={handleHallFormModalChange}
                            placeholder="Block A"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Floor</label>
                          <input
                            type="text"
                            className="form-control"
                            name="floor"
                            value={newHallFormModal.floor}
                            onChange={handleHallFormModalChange}
                            placeholder="1st Floor"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-semibold">Status</label>
                          <select
                            className="form-select"
                            name="status"
                            value={newHallFormModal.status}
                            onChange={handleHallFormModalChange}
                          >
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </div>

                        {/* Location Note */}
                        <div className="col-3">
                          <label className="form-label fw-semibold">Location Note</label>
                          <input
                            type="text"
                            className="form-control"
                            name="location_note"
                            value={newHallFormModal.location_note}
                            onChange={handleHallFormModalChange}
                            placeholder="Near Library"
                          />
                        </div>

                        {/* Facilities */}
                        <div className="col-3">
                          <label className="form-label fw-semibold">Facilities</label>
                          <input
                            type="text"
                            className="form-control"
                            name="facilities"
                            value={newHallFormModal.facilities}
                            onChange={handleHallFormModalChange}
                            placeholder="Projector, AC, CCTV..."
                          />
                        </div>

                        {/* Preference */}
                        <div className="col-3">
                          <label className="form-label fw-semibold">Preference</label>
                          <input
                            type="text"
                            className="form-control"
                            name="preference"
                            value={newHallFormModal.preference}
                            onChange={handleHallFormModalChange}
                            placeholder="e.g., 1"
                          />
                        </div>

                        {/* Live Preview */}
                        {newHallFormModal.rows && newHallFormModal.columns && (
                          <div className="col-12">
                            <h6 style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              marginBottom: '16px'
                            }}>
                              ✨ Live Preview
                            </h6>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: `repeat(${parseInt(newHallFormModal.columns) || 1}, 1fr)`,
                              gap: '12px',
                              padding: '24px',
                              background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
                              borderRadius: '16px',
                              border: '2px solid #667eea',
                              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
                              overflow: 'auto',
                              transition: 'all 0.3s ease'
                            }}>
                              {getHallPreviewSeats().map((seatNum, idx) => {
                                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52C4A1'];
                                const cols = parseInt(newHallFormModal.columns) || 1;
                                const colIndex = idx % cols;
                                const seatColor = colors[colIndex % colors.length];
                                return (
                                  <div
                                    key={seatNum}
                                    style={{
                                      padding: '10px 6px',
                                      border: `2px solid ${seatColor}`,
                                      borderRadius: '12px',
                                      textAlign: 'center',
                                      background: `linear-gradient(135deg, ${seatColor}33 0%, ${seatColor}99 100%)`,
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      color: seatColor,
                                      minHeight: '50px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: `0 4px 12px ${seatColor}40`,
                                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                      backdropFilter: 'blur(10px)',
                                      cursor: 'default'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                                      e.currentTarget.style.boxShadow = `0 8px 24px ${seatColor}60`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                      e.currentTarget.style.boxShadow = `0 4px 12px ${seatColor}40`;
                                    }}
                                  >
                                    {seatNum}
                                  </div>
                                );
                              })}
                            </div>
                            <small style={{
                              display: 'block',
                              marginTop: '12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#667eea'
                            }}>
                              📊 Capacity: <span style={{ fontWeight: '700' }}>{newHallFormModal.capacity} seats</span>
                            </small>
                          </div>
                        )}

                        <div className="col-12 mt-3">
                          <div className="d-flex justify-content-end gap-3">
                            <button type="submit" className="btn btn-outline-success-600 radius-8 px-20 py-11" style={{ minWidth: '100px' }}>Submit</button>
                            <button type="button" className="btn btn-outline-danger-600 radius-8 px-20 py-11" style={{ minWidth: '100px' }} onClick={handleCloseHallModal}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </fieldset>
                </div>
              )}
              {/* Removed edit form UI */}
              <div className="card mt-3">
                <div className="card-body">
                  <HallTable
                    refreshTable={refreshTable}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default HallDetails;
