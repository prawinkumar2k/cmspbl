import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Icon } from '@iconify/react';
import {
  Edit, 
  Trash2
} from 'lucide-react';

const MarkedAttendance = () => {
  const [markedAttendance, setMarkedAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    deptCode: '',
    semester: '',
    regulation: '',
    fromDate: '',
    toDate: '',
    searchTerm: '',
    status: ''
  });
  
  // State for dropdown data
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [regulations, setRegulations] = useState([]);

  // State for inline editing
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');

  // Fetch initial dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [deptsRes, semsRes, regsRes] = await Promise.all([
          fetch('/api/dailyAttendance/departments'),
          fetch('/api/dailyAttendance/semesters'),
          fetch('/api/dailyAttendance/regulations')
        ]);

        const deptsData = await deptsRes.json();
        const semsData = await semsRes.json();
        const regsData = await regsRes.json();

        setDepartments(deptsData);
        setSemesters(semsData);
        setRegulations(regsData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Define table columns for marked attendance
  const columns = useMemo(() => [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Att_Date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="fw-medium">
          {new Date(row.original.Att_Date).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'Day_Order',
      header: 'Day Order',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Day_Order}</div>
      ),
    },
    {
      accessorKey: 'Dept_Name',
      header: 'Department',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Dept_Name}</div>
      ),
    },
    {
      accessorKey: 'Semester',
      header: 'Semester',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Semester}</div>
      ),
    },
    {
      accessorKey: 'Regulation',
      header: 'Regulation',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Regulation}</div>
      ),
    },
    {
      accessorKey: 'Class',
      header: 'Class',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Class}</div>
      ),
    },
    {
      accessorKey: 'Subject_Code',
      header: 'Subject',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Subject_Code}</div>
      ),
    },
    {
      accessorKey: 'Period',
      header: 'Period',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Period}</div>
      ),
    },
    {
      accessorKey: 'Register_Number',
      header: 'Register Number',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Register_Number}</div>
      ),
    },
    {
      accessorKey: 'Student_Name',
      header: 'Student Name',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Student_Name}</div>
      ),
    },
    {
      accessorKey: 'Att_Status',
      header: 'Attendance Status',
      cell: ({ row }) => {
        const isEditing = editingRowId === row.original.Id;
        const status = isEditing ? editedStatus : row.original.Att_Status;
        
        if (isEditing) {
          return (
            <select 
              className="form-select form-select-sm"
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="medicalLeave">Medical Leave</option>
              <option value="onDuty">On Duty</option>
            </select>
          );
        }
        
        const colorClass = 
          status === 'present' ? 'text-success' :
          status === 'absent' ? 'text-danger' :
          status === 'onDuty' ? 'text-info' :
          status === 'medicalLeave' ? 'text-warning' : '';
        
        return (
          <div className={`fw-medium ${colorClass}`}>
            {status === 'present' ? 'Present' :
             status === 'absent' ? 'Absent' :
             status === 'onDuty' ? 'On Duty' :
             status === 'medicalLeave' ? 'Medical Leave' : status}
          </div>
        );
      },
    },
    {
      accessorKey: 'Staff_Name',
      header: 'Marked By',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Staff_Name}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const isEditing = editingRowId === row.original.Id;
        
        if (isEditing) {
          return (
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleSaveEdit(row.original)}
                title="Save"
              >
                <Icon icon="mdi:content-save" width="16" />
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setEditingRowId(null);
                  setEditedStatus('');
                }}
                title="Cancel"
              >
                <Icon icon="mdi:close" width="16" />
              </button>
            </div>
          );
        }
        
        return (
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => handleEdit(row.original)}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(row.original)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
      enableSorting: false,
    }
  ], [editingRowId, editedStatus]);

  // Fetch marked attendance from API
  useEffect(() => {
    const fetchMarkedAttendance = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        if (filters.deptCode) queryParams.append('deptCode', filters.deptCode);
        if (filters.semester) queryParams.append('semester', filters.semester);
        if (filters.regulation) queryParams.append('regulation', filters.regulation);
        if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
        if (filters.toDate) queryParams.append('toDate', filters.toDate);
        if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
        if (filters.status) queryParams.append('status', filters.status);

        const response = await fetch(`/api/markedAttendance/marked?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }

        const data = await response.json();
        setMarkedAttendance(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching marked attendance:', err);
        setError('Failed to fetch marked attendance data');
        toast.error('Failed to fetch marked attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkedAttendance();
  }, [filters]);

  const handleView = (attendance) => {
    console.log('View attendance record:', attendance);
    toast.success(`Viewing attendance record for ${attendance.Student_Name}`);
  };

  const handleEdit = (attendance) => {
    setEditingRowId(attendance.Id);
    setEditedStatus(attendance.Att_Status);
  };

  const handleSaveEdit = async (attendance) => {
    if (!editedStatus || editedStatus === attendance.Att_Status) {
      setEditingRowId(null);
      setEditedStatus('');
      return;
    }

    try {
      const response = await fetch(`/api/markedAttendance/${attendance.Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attStatus: editedStatus })
      });

      if (response.ok) {
        toast.success('Attendance updated successfully');
        setEditingRowId(null);
        setEditedStatus('');
        // Refresh data
        setFilters(prev => ({ ...prev }));
      } else {
        toast.error('Failed to update attendance');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Error updating attendance');
    }
  };

  const handleDelete = async (attendance) => {
    toast.dismiss();
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete this attendance record for {attendance.Student_Name}?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={async () => {
                try {
                  const response = await fetch(`/api/markedAttendance/${attendance.Id}`, {
                    method: 'DELETE'
                  });

                  if (response.ok) {
                    setMarkedAttendance(prev => prev.filter(a => a.Id !== attendance.Id));
                    toast.success('Attendance record deleted successfully');
                  } else {
                    toast.error('Failed to delete attendance record');
                  }
                } catch (error) {
                  console.error('Error deleting attendance:', error);
                  toast.error('Error deleting attendance record');
                }
                toast.dismiss(toastId);
              }}
            >Delete</button>
            <button
              style={{ background: '#757575', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={() => toast.dismiss(toastId)}
            >Cancel</button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
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
              <h6 className="fw-semibold mb-0">Marked Attendance</h6>
            </div>

            {/* Filter Card */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  {/* Department Filter */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Department</label>
                    <select 
                      className="form-select"
                      value={filters.deptCode}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          deptCode: e.target.value
                        }));
                      }}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.Dept_Code} value={dept.Dept_Code}>{dept.Dept_Name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Filter */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Semester</label>
                    <select 
                      className="form-select"
                      value={filters.semester}
                      onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                    >
                      <option value="">All Semesters</option>
                      {semesters.map(sem => (
                        <option key={sem.id} value={sem.Semester}>{sem.Semester}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Regulation Filter */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Regulation</label>
                    <select 
                      className="form-select"
                      value={filters.regulation}
                      onChange={(e) => setFilters(prev => ({ ...prev, regulation: e.target.value }))}
                    >
                      <option value="">All Regulations</option>
                      {regulations.map(reg => (
                        <option key={reg.id} value={reg.Regulation}>{reg.Regulation}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filters */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">From Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={filters.fromDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                    />
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">To Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={filters.toDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Attendance Status</label>
                    <select 
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">All Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="onDuty">On Duty (OD)</option>
                      <option value="medicalLeave">Medical Leave (ML)</option>
                    </select>
                  </div>

                  {/* Search Box */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Search Student/Register Number</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Enter register number or student name..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    />
                  </div>

                  {/* Filter Actions */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button 
                      className="btn btn-outline-secondary radius-8 px-20 py-11"
                      onClick={() => setFilters({
                        deptCode: '',
                        semester: '',
                        regulation: '',
                        fromDate: '',
                        toDate: '',
                        searchTerm: '',
                        status: ''
                      })}
                    >
                      Reset Filters
                    </button>
                    {/* <button 
                      className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                    >
                      Get Report
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

              {/* Data Table */}
              <DataTable
                data={markedAttendance}
                columns={columns}
                loading={loading}
                error={error}
                title="Marked Attendance Records"
                enableExport={false}
                enableSelection={false}
                enableActions={false}
                pageSize={10}
              />
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default MarkedAttendance;
