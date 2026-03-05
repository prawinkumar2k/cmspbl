import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import DataTable from '../../../../../components/DataTable/DataTable';
import axios from 'axios';
import {
  PhoneCall,
  UserCheck,
  Search,
  RefreshCcw,
  CheckCircle2,
  Info,
  Users,
  LayoutGrid,
  PhoneForwarded,
  ChevronDown,
  XCircle,
  MapPin,
  School,
  BookOpen
} from 'lucide-react';

import '../../../../../components/css/AssignCall.css';

const AssignCall = () => {
  const [formState, setFormState] = useState({
    studentEnquiry: '',
    role: '',
    tenant_id: '',
    caller: '',
    staffName: '',
    staffId: '',
    tenantName: '',
    tenantNumber: '',
    tenantDepartment: ''
  });

  const [students, setStudents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tenantAssignments, setTenantAssignments] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(false);
  const [roleSearchInput, setRoleSearchInput] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Calculate selected students from rowSelection
  const selectedStudents = Object.keys(rowSelection)
    .filter(key => rowSelection[key])
    .map(index => students[parseInt(index)])
    .filter(Boolean);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [studentsResponse, rolesResponse] = await Promise.all([
        axios.get('/api/assignCall/students'),
        axios.get('/api/assignCall/roles')
      ]);

      if (studentsResponse.data.success) {
        setStudents(studentsResponse.data.data || []);
      }

      if (rolesResponse.data.success) {
        setRoles(rolesResponse.data.data || []);
      }

      try {
        const assignResp = await axios.get('/api/assignCall/assignments');
        if (assignResp.data && assignResp.data.success) {
          const rows = assignResp.data.data || [];
          const map = {};
          rows.forEach(r => {
            const key = String(r.tenant_id || r.role || 'unknown');
            if (!map[key]) map[key] = { tenant_id: r.tenant_id || r.role || key, role: r.role || '', students: [] };
            map[key].students.push({ id: r.id, student_reg_no: r.student_reg_no, student_name: r.student_name, student_mobile: r.student_mobile || r.student_mobile_no || r.student_mobile });
          });
          const grouped = Object.keys(map).map(k => map[k]);
          setTenantAssignments(grouped);

          const assignedSet = new Set();
          rows.forEach(r => {
            const k = `${r.student_reg_no || ''}::${(r.student_name || '').toLowerCase()}::${(r.student_mobile || '').toString()}`;
            assignedSet.add(k);
          });

          setStudents(prev => (prev || []).map(s => {
            const key = `${s.student_reg_no || ''}::${(s.student_name || '').toLowerCase()}::${(s.mobile_no || '').toString()}`;
            return { ...s, isAssigned: assignedSet.has(key) };
          }));
        }
      } catch (e) {
        console.warn('Could not fetch tenant assignments', e);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (selectedRole) => {
    let display = '';
    let tenantId = '';
    if (typeof selectedRole === 'string') {
      display = selectedRole;
      tenantId = selectedRole;
    } else if (selectedRole && typeof selectedRole === 'object') {
      display = selectedRole.role || selectedRole.tenant_name || selectedRole.name || '';
      tenantId = selectedRole.tenant_id ?? selectedRole.id ?? selectedRole.tenantId ?? display;
    }

    setFormState(prev => ({
      ...prev,
      role: display,
      tenant_id: tenantId,
      caller: '',
      staffName: '',
      staffId: '',
      tenantName: '',
      tenantNumber: '',
      tenantDepartment: ''
    }));
    setRoleSearchInput('');
    setShowRoleDropdown(false);

    try {
      const response = await axios.get(`/api/assignCall/staff-by-role?role=${encodeURIComponent(display)}`);
      if (response.data && response.data.success) {
        const staff = response.data.data || [];
        setStaffList(staff);
        if (staff.length === 1) {
          const s = staff[0];
          setSelectedStaff(s);
          setFormState(prev => ({
            ...prev,
            tenantName: s.staff_name,
            tenantNumber: s.Mobile,
            tenantDepartment: s.Dept_Name,
            staffId: s.Id,
            staffName: s.staff_name,
            caller: s.Id,
          }));
        } else {
          setSelectedStaff(null);
        }
      } else {
        setStaffList([]);
        setSelectedStaff(null);
      }
    } catch (e) {
      console.warn('Could not fetch staff for role', e);
      setStaffList([]);
      setSelectedStaff(null);
    }

    const queryTenant = tenantId || display;
    try {
      const stuResp = await axios.get(`/api/assignCall/students?tenant_id=${encodeURIComponent(queryTenant)}`);
      if (stuResp.data && stuResp.data.success) {
        setStudents(stuResp.data.data || []);
      }
      setRowSelection({});
    } catch (e) {
      console.warn('Could not load student enquiries for tenant role', e);
      setStudents([]);
      setRowSelection({});
    }
  };

  const filteredRoles = roles.filter(r => {
    const roleStr = typeof r === 'string' ? r : (r.role || '');
    return roleStr.toLowerCase().includes(roleSearchInput.toLowerCase());
  });

  const handleAssignCall = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    if (!formState.tenant_id) {
      toast.error('Please select a tenant/staff');
      return;
    }

    setLoading(true);
    try {
      const studentEnquiryIds = selectedStudents.map(s => s.id);
      const response = await axios.post('/api/assignCall/assign', {
        tenant_id: formState.tenant_id,
        studentEnquiryIds,
        callerId: formState.caller || null
      });

      if (response.data.success) {
        toast.success('Call assigned successfully!', { autoClose: 2000 });
        handleReset();
        fetchInitialData(); // Refresh to clear assigned students
      } else {
        toast.error(response.data.message || 'Failed to assign call');
      }
    } catch (error) {
      console.error('Error assigning call:', error);
      toast.error(error?.response?.data?.error || 'Failed to assign call');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormState({
      studentEnquiry: '',
      role: '',
      tenant_id: '',
      caller: '',
      staffName: '',
      staffId: '',
      tenantName: '',
      tenantNumber: '',
      tenantDepartment: ''
    });
    setRowSelection({});
    setRoleSearchInput('');
    setStaffList([]);
    setSelectedStaff(null);
  };

  const studentColumns = [
    {
      accessorKey: 'student_name',
      header: 'Student Name',
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-2">
          <div className="avatar-placeholder-sm">{row.original.student_name?.[0]}</div>
          <span className="fw-bold text-dark">{row.original.student_name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'mobile_no',
      header: 'Student Mobile',
      cell: ({ row }) => <span className="badge bg-light text-dark border"><PhoneCall size={12} className="me-1" /> {row.original.mobile_no}</span>,
    },
    {
      accessorKey: 'parent_name',
      header: 'Parent Info',
      cell: ({ row }) => (
        <div>
          <div className="fw-600 text-dark small">{row.original.parent_name || '-'}</div>
          <div className="text-secondary smaller"><PhoneCall size={10} className="me-1" />{row.original.parent_mobile || '-'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'student_reg_no',
      header: 'Reg No',
      cell: ({ row }) => <span className="fw-medium text-secondary">{row.original.student_reg_no || row.original.student_regno || '-'}</span>,
    },
    {
      accessorKey: 'standard',
      header: 'Standard',
      cell: ({ row }) => <span className="badge bg-info-subtle text-info border-info-subtle">{row.original.standard || '-'}</span>,
    },
    {
      accessorKey: 'school_name',
      header: 'School Details',
      cell: ({ row }) => (
        <div style={{ maxWidth: '200px' }}>
          <div className="fw-600 text-dark text-truncate small"><School size={12} className="me-1" />{row.original.school_name || '-'}</div>
          <div className="text-secondary smaller text-truncate">{row.original.school_address || '-'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-1 text-primary fw-600 small">
          <BookOpen size={14} />
          {row.original.department || row.original.dept_name || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <span className="text-muted small fw-500">{row.original.source || '-'}</span>,
    },
    {
      accessorKey: 'district',
      header: 'District',
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-1 text-secondary small">
          <MapPin size={14} />
          {row.original.district || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'community',
      header: 'Comm.',
      cell: ({ row }) => <span className="smaller fw-bold text-uppercase">{row.original.community || '-'}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status || 'New';
        let cls = 'bg-primary-subtle text-primary border-primary-subtle';
        if (status.includes('Confirmed')) cls = 'bg-success-subtle text-success border-success-subtle';
        if (status.includes('Follow')) cls = 'bg-warning-subtle text-warning border-warning-subtle';
        return <span className={`badge ${cls} border rounded-pill px-3`}>{status}</span>;
      },
    },
  ];

  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="assign-call-container animate-fade-up">
          <ToastContainer />

          {/* Header */}
          <div className="page-header d-flex justify-content-between align-items-center">
            <div>
              <h6 className="fw-bold mb-1 text-dark fs-4">Assign Call Management</h6>
              <p className="mb-0 text-secondary d-flex align-items-center gap-2 small">
                <PhoneForwarded size={16} /> Allocate enquiry leads to specific tenant roles and staff members.</p>
            </div>
            <button className="btn-premium-reset d-flex align-items-center gap-2" onClick={handleReset}>
              <RefreshCcw size={18} /> Reset Form
            </button>
          </div>

          <div className="row g-4">
            {/* Assignment Controls */}
            <div className="col-12" style={{ zIndex: 100 }}>
              <div className="premium-card">
                <div className="premium-card-header">
                  <h6 className="mb-0 d-flex align-items-center gap-2 fs-5">
                    <PhoneForwarded size={22} />
                    Assignment Configuration
                  </h6>
                </div>
                <div className="premium-card-body">
                  <div className="assign-form-row">
                    {/* Role Selection */}
                    <div className="form-group-custom">
                      <label>
                        <Users size={18} className="text-primary" />
                        Target Tenant Role
                      </label>
                      <div className="input-container-premium">
                        <Search className="input-icon-left" size={20} />
                        {!formState.tenant_id ? (
                          <div className="w-100 position-relative">
                            <input
                              type="text"
                              className="form-control-premium"
                              placeholder="Search department roles..."
                              value={roleSearchInput}
                              onChange={(e) => {
                                setRoleSearchInput(e.target.value);
                                setShowRoleDropdown(true);
                              }}
                              onFocus={() => setShowRoleDropdown(true)}
                            />
                            {roleSearchInput && (
                              <button 
                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent pe-3 text-secondary"
                                onClick={() => { setRoleSearchInput(''); setShowRoleDropdown(false); }}
                                type="button"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                            {showRoleDropdown && filteredRoles.length > 0 && (
                              <div className="role-dropdown-container">
                                {filteredRoles.map((role, idx) => {
                                  const roleStr = typeof role === 'string' ? role : (role.role || role.tenant_name || role.name || '');
                                  return (
                                    <button
                                      key={idx}
                                      className="role-item"
                                      onClick={() => handleRoleSelect(role)}
                                    >
                                      <span className="role-name">{roleStr}</span>
                                      <span className="role-tag">Staff Member</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="d-flex w-100 gap-2">
                            <input
                              type="text"
                              className="form-control-premium"
                              value={formState.role}
                              readOnly
                            />
                            <button
                              className="btn btn-dark radius-12 px-3 d-flex align-items-center gap-2"
                              onClick={handleReset}
                            >
                              <RefreshCcw size={16} /> Change
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Staff Selection if Multiple */}
                    {formState.tenant_id && staffList.length > 1 && (
                      <div className="form-group-custom">
                        <label>
                          <UserCheck size={18} className="text-primary" />
                          Select Staff Member
                        </label>
                        <div className="input-container-premium">
                          <ChevronDown className="input-icon-left" size={20} />
                          <select
                            className="form-control-premium ps-5"
                            value={selectedStaff?.Id || ''}
                            onChange={(e) => {
                              const staff = staffList.find(s => s.Id == e.target.value);
                              setSelectedStaff(staff);
                              setFormState(prev => ({
                                ...prev,
                                tenantName: staff.staff_name,
                                tenantNumber: staff.Mobile,
                                tenantDepartment: staff.Dept_Name,
                                staffId: staff.Id,
                                staffName: staff.staff_name,
                                caller: staff.Id,
                              }));
                            }}
                          >
                            <option value="">Select individual staff...</option>
                            {staffList.map(s => (
                              <option key={s.Id} value={s.Id}>{s.staff_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="ms-auto pt-4">
                      <button
                        className="btn-premium-assign d-flex align-items-center gap-2"
                        onClick={handleAssignCall}
                        disabled={loading || selectedStudents.length === 0 || !formState.tenant_id}
                      >
                        {loading ? <RefreshCcw className="animate-spin" /> : <CheckCircle2 size={20} />}
                        {loading ? 'Processing...' : `Assign ${selectedStudents.length} Students`}
                      </button>
                    </div>
                  </div>

                  {/* Tenant Info Box */}
                  {formState.tenant_id && (
                    <div className="tenant-info-box animate-fade-up">
                      <div className="tenant-details-grid">
                        <div>
                          <div className="detail-label">Assigned To</div>
                          <div className="detail-value text-primary">{formState.tenantName || formState.role}</div>
                        </div>
                        <div>
                          <div className="detail-label">Staff ID</div>
                          <div className="detail-value">{formState.staffId || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="detail-label">Department</div>
                          <div className="detail-value">{formState.tenantDepartment || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="detail-label">Phone Number</div>
                          <div className="detail-value">{formState.tenantNumber || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="selection-badge-container">
                        <div className="selection-count">{selectedStudents.length}</div>
                        <div className="selection-label">Students Selected</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="col-12">
              <div className="premium-card">
                <div className="premium-card-header">
                  <h6 className="mb-0 d-flex align-items-center gap-2 fs-5">
                    <Users size={22} />
                    Leads Availability List
                  </h6>
                </div>
                <div className="premium-card-body">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status" />
                      <p className="mt-3 text-secondary fw-medium">Fetching students data...</p>
                    </div>
                  ) : students.length > 0 ? (
                    <div className="table-wrapper-premium">
                      <DataTable
                        columns={studentColumns}
                        data={students}
                        enableRowSelection
                        rowSelection={rowSelection}
                        enableActions={false}
                        onRowSelectionChange={setRowSelection}
                        title="Select Students for Allocation"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-5 bg-light rounded-20">
                      <XCircle size={48} className="text-muted mb-3" />
                      <h6 className="text-dark">No Available Leads</h6>
                      <p className="text-secondary">All enquiry student calls have been assigned or none exist.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
                .avatar-placeholder-sm {
                    width: 32px;
                    height: 32px;
                    background: #eef2ff;
                    color: #4f46e5;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    border: 1px solid #e0e7ff;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
    </section>
  );
};

export default AssignCall;
