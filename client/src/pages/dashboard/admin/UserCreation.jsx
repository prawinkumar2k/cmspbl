import React, { useState, useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/footer";
import DataTable from '../../../components/DataTable';
import axios from 'axios';
import '../admin/master/subject.css';

const INITIAL_FORM_STATE = {
  userRole: '',
  staffName: '',
  staffId: '',
  userId: '',
  password: '',
  confirmPassword: '',
  accessModules: {}
};

const UserCreation = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [staffList, setStaffList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [groupedModules, setGroupedModules] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch staff list, roles, and modules from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Fetch staff list
    fetch('/api/staff')
      .then(res => res.json())
      .then(data => setStaffList(data))
      .catch(() => {
        setStaffList([]);
        toast.error('Failed to load staff list');
      });

    // Fetch existing roles
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => setRoleList(data))
      .catch(() => {
        setRoleList([]);
        toast.error('Failed to load roles');
      });

    // Fetch modules from database
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => {
        setModuleList(data);
        // Group modules by category
        const grouped = data.reduce((acc, module) => {
          const category = module.module_category || 'Others';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(module);
          return acc;
        }, {});
        setGroupedModules(grouped);
      })
      .catch(() => {
        setModuleList([]);
        setGroupedModules({});
        toast.error('Failed to load modules');
      });
  };

  // Fetch users for table
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add serial numbers
      const usersWithSerial = response.data.map((user, index) => ({
        ...user,
        serial_no: index + 1
      }));

      setUsers(usersWithSerial);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Toggle table view
  const handleToggleTable = () => {
    if (!showTable) {
      fetchUsers();
    }
    setShowTable(!showTable);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === 'staffName') {
      const selectedStaff = staffList.find(staff => staff.staff_name === value);
      if (selectedStaff) {
        setForm(prev => ({
          ...prev,
          staffName: value,
          staffId: selectedStaff.staff_id || '',
          userId: selectedStaff.staff_id || ''
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [staffList]);

  const handleModuleToggle = useCallback((moduleId) => {
    setForm(prev => {
      const newModules = { ...prev.accessModules };
      newModules[moduleId] = !newModules[moduleId];

      return {
        ...prev,
        accessModules: newModules
      };
    });
  }, []);

  const handleGlobalSelectAll = useCallback(() => {
    const allModules = {};
    moduleList.forEach(module => {
      allModules[module.module_key] = true;
    });
    setForm(prev => ({
      ...prev,
      accessModules: allModules
    }));
    toast.success('All modules selected globally');
  }, [moduleList]);

  const handleGlobalDeselectAll = useCallback(() => {
    setForm(prev => ({
      ...prev,
      accessModules: {}
    }));
    toast.success('All modules deselected globally');
  }, []);

  const handleCategorySelectAll = useCallback((category) => {
    const categoryModules = groupedModules[category] || [];
    setForm(prev => {
      const newModules = { ...prev.accessModules };
      categoryModules.forEach(module => {
        newModules[module.module_key] = true;
      });
      return {
        ...prev,
        accessModules: newModules
      };
    });
    toast.success(`Selected all ${category} modules`);
  }, [groupedModules]);

  const handleCategoryDeselectAll = useCallback((category) => {
    const categoryModules = groupedModules[category] || [];
    setForm(prev => {
      const newModules = { ...prev.accessModules };
      categoryModules.forEach(module => {
        // delete newModules[module.module_key]; // Or set to false if you prefer explicit false
        newModules[module.module_key] = false;
      });
      return {
        ...prev,
        accessModules: newModules
      };
    });
    toast.success(`Deselected all ${category} modules`);
  }, [groupedModules]);

  const handleCreateRole = useCallback(async () => {
    if (!newRole.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        const data = await res.json();
        setRoleList(prev => [...prev, data]);
        setForm(prev => ({ ...prev, userRole: newRole }));
        setNewRole('');
        setIsCreatingRole(false);
        toast.success('Role created successfully!');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to create role');
      }
    } catch (err) {
      console.error('Error creating role:', err);
      toast.error('Error creating role');
    }
  }, [newRole]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validation
    if (!form.userRole) {
      toast.error('Please select or create a role');
      return;
    }

    if (!form.staffName) {
      toast.error('Please select a staff member');
      return;
    }

    if (!form.userId) {
      toast.error('User ID is required');
      return;
    }

    if (!form.password) {
      toast.error('Password is required');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const selectedModules = Object.keys(form.accessModules).filter(
      key => form.accessModules[key]
    );

    if (selectedModules.length === 0) {
      toast.error('Please select at least one module');
      return;
    }

    const userData = {
      userRole: form.userRole,
      staffName: form.staffName,
      staffId: form.staffId,
      userId: form.userId,
      password: form.password,
      accessModules: form.accessModules
    };

    toast.loading(editId ? 'Updating user...' : 'Creating user...');

    try {
      const url = editId ? `/api/users/${editId}` : '/api/users';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      toast.dismiss();

      if (res.ok) {
        toast.success(editId ? 'User updated successfully!' : 'User created successfully!');
        setForm(INITIAL_FORM_STATE);
        setEditId(null);
        // Always show table after save and refresh data
        setShowTable(true);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save user');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Error saving user');
    }
  }, [form, editId, showTable]);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setIsCreatingRole(false);
    setNewRole('');
    setEditId(null);
    toast.success('Form reset successfully!');
  }, []);

  // Handle edit user
  const handleEdit = (user) => {
    // Parse module_access
    let modules = {};
    if (user.module_access) {
      const moduleKeys = user.module_access.split(',');
      moduleKeys.forEach(key => {
        modules[key.trim()] = true;
      });
    }

    setForm({
      userRole: user.role || '',
      staffName: user.staff_name || '',
      staffId: user.staff_id || '',
      userId: user.username || '',
      password: '', // Clear password for security - user must enter new password
      confirmPassword: '',
      accessModules: modules
    });
    setEditId(user.id);
    setShowTable(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`Editing user: ${user.username}`);
  };

  // Handle delete user
  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user: ${user.username}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast.success('User deleted successfully');
        if (editId === user.id) {
          setForm(INITIAL_FORM_STATE);
          setEditId(null);
        }
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        toast.error('Failed to delete user');
      }
    }
  };

  // Table columns
  const columns = [
    {
      accessorKey: 'serial_no',
      header: 'S.No',
      size: 60,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      size: 120,
      cell: ({ getValue }) => (
        <span className="badge bg-primary-600 text-white px-3 py-2">
          {getValue()}
        </span>
      )
    },
    {
      accessorKey: 'staff_name',
      header: 'Staff Name',
      size: 200,
    },
    {
      accessorKey: 'staff_id',
      header: 'Staff ID',
      size: 120,
    },
    {
      accessorKey: 'username',
      header: 'User Name',
      size: 150,
    },
    {
      accessorKey: 'module_access',
      header: 'Module Access',
      size: 150,
      cell: ({ getValue }) => {
        const access = getValue();
        if (!access) return 'N/A';
        const moduleKeys = access.split(',');
        const count = moduleKeys.length;

        // Get module names from keys
        const moduleNames = moduleKeys.map(key => {
          const module = moduleList.find(m => m.module_key === key.trim());
          return module ? module.module_name : key.trim();
        }).join(', ');

        return (
          <span className="badge bg-info-600 text-white" title={moduleNames}>
            {count} modules
          </span>
        );
      }
    }
  ];

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
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">User Creation</h6>
            </div>

            {/* Form Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">{editId ? 'Edit User' : 'Add User Details'}</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to {editId ? 'update' : 'add'} user information
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                  onClick={handleToggleTable}
                >
                  <iconify-icon icon="solar:list-bold" className="icon text-xl line-height-1"></iconify-icon>
                  {showTable ? 'Hide Users' : 'View Users'}
                </button>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* User Information Section */}
                    <div className="col-12">
                      <div className="mb-24">
                        <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">
                          User Information
                        </h6>
                        <div className="row g-20">
                          {/* Role Selection or Creation */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              User Role <span className="text-danger">*</span>
                            </label>
                            {!isCreatingRole ? (
                              <div className="d-flex gap-2">
                                <select
                                  name="userRole"
                                  value={form.userRole}
                                  onChange={handleChange}
                                  className="form-select radius-8"
                                  required
                                >
                                  <option value="">Select Role</option>
                                  {roleList.map((role, index) => (
                                    <option key={role.id || index} value={role.role}>{role.role}</option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  className="btn btn-outline-primary px-3"
                                  onClick={() => setIsCreatingRole(true)}
                                  title="Create New Role"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex gap-2">
                                <input
                                  type="text"
                                  value={newRole}
                                  onChange={(e) => setNewRole(e.target.value)}
                                  className="form-control radius-8"
                                  placeholder="Enter new role name"
                                />
                                <button
                                  type="button"
                                  className="btn btn-success px-3"
                                  onClick={handleCreateRole}
                                  title="Save Role"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger px-3"
                                  onClick={() => {
                                    setIsCreatingRole(false);
                                    setNewRole('');
                                  }}
                                  title="Cancel"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Staff Name Selection */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Staff Name <span className="text-danger">*</span>
                            </label>
                            <select
                              name="staffName"
                              value={form.staffName}
                              onChange={handleChange}
                              className="form-select radius-8"
                              required
                            >
                              <option value="">Select Staff</option>
                              {staffList.map(staff => (
                                <option key={staff.staff_id} value={staff.staff_name}>
                                  {staff.staff_name} ({staff.staff_id})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Staff ID (Auto-filled) */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Staff ID
                            </label>
                            <input
                              type="text"
                              name="staffId"
                              value={form.staffId}
                              readOnly
                              className="form-control radius-8 bg-neutral-50"
                              placeholder="Auto-filled from staff selection"
                            />
                          </div>

                          {/* User ID */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              User ID <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              name="userId"
                              value={form.userId}
                              onChange={handleChange}
                              className="form-control radius-8"
                              placeholder="Default: Staff ID"
                              required
                            />
                          </div>

                          {/* Password */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Password <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control radius-8"
                                placeholder="Enter password"
                                required
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ textDecoration: 'none' }}
                              >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold text-primary-light mb-8">
                              Confirm Password <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="form-control radius-8"
                                placeholder="Re-enter password"
                                required
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ textDecoration: 'none' }}
                              >
                                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Access Modules Section */}
                      <div className="mb-24">
                        <div className="d-flex align-items-center justify-content-between mb-20 pb-12 border-bottom border-neutral-200">
                          <div>
                            <h6 className="text-lg fw-bold mb-1" style={{ color: '#2c3e50' }}>
                              <i className="fas fa-shield-alt me-2 text-primary"></i>
                              Access Modules <span className="text-danger">*</span>
                            </h6>
                            <p className="text-sm text-secondary-light mb-0">Select modules to grant access permissions</p>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-success px-16 py-8 d-flex align-items-center gap-2"
                              onClick={handleGlobalSelectAll}
                              style={{
                                borderRadius: '8px',
                                fontWeight: '500',
                                fontSize: '13px'
                              }}
                            >
                              <i className="fas fa-check-circle"></i>
                              Select All
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger px-16 py-8 d-flex align-items-center gap-2"
                              onClick={handleGlobalDeselectAll}
                              style={{
                                borderRadius: '8px',
                                fontWeight: '500',
                                fontSize: '13px'
                              }}
                            >
                              <i className="fas fa-times-circle"></i>
                              Clear All
                            </button>
                          </div>
                        </div>

                        <div className="module-list" style={{
                          maxHeight: '600px',
                          overflowY: 'auto',
                          padding: '4px',
                          scrollbarWidth: 'thin'
                        }}>
                          {Object.keys(groupedModules).map((category, categoryIndex) => {
                            const categoryColors = {
                              'Common': { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'fa-home', bg: '#f0f4ff' },
                              'Admin': { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: 'fa-user-shield', bg: '#fff0f5' },
                              'Master': { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: 'fa-database', bg: '#f0faff' },
                              'Administrator': { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: 'fa-user-graduate', bg: '#f0fff4' },
                              'Academic': { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: 'fa-users', bg: '#fffbf0' },
                              'Library': { gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', icon: 'fa-book', bg: '#f0f9ff' },
                              'Examination': { gradient: 'linear-gradient(135deg, #86f3eeff 0%, #336deaff 100%)', icon: 'fa-clipboard-list', bg: '#f5fffa' },
                              'Admission': { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #f888d5ff 100%)', icon: 'fa-chart-bar', bg: '#fff5f8' }
                            };

                            const categoryStyle = categoryColors[category] || {
                              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              icon: 'fa-layer-group',
                              bg: '#f8f9fa'
                            };

                            return (
                              <div key={category} className="mb-4" style={{
                                backgroundColor: categoryStyle.bg,
                                borderRadius: '12px',
                                padding: '16px',
                                border: '1px solid rgba(0,0,0,0.05)'
                              }}>
                                {/* Category Header */}
                                <div className="d-flex align-items-center justify-content-between mb-3" style={{
                                  background: categoryStyle.gradient,
                                  borderRadius: '10px',
                                  padding: '12px 16px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                  <div className="d-flex align-items-center gap-3">
                                    <div style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '10px',
                                      backgroundColor: 'rgba(255,255,255,0.3)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backdropFilter: 'blur(10px)'
                                    }}>
                                      <i className={`fas ${categoryStyle.icon} text-white`} style={{ fontSize: '18px' }}></i>
                                    </div>
                                    <div>
                                      <h6 className="mb-0 text-white fw-bold" style={{
                                        fontSize: '16px',
                                        letterSpacing: '0.3px',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                      }}>
                                        {category} Modules
                                      </h6>
                                      <small className="text-white" style={{ opacity: 0.9, fontSize: '11px' }}>
                                        {groupedModules[category].length} module{groupedModules[category].length !== 1 ? 's' : ''} available
                                      </small>
                                    </div>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <button
                                      type="button"
                                      className="btn btn-sm px-3 py-2"
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        borderRadius: '6px',
                                        backgroundColor: 'rgba(255,255,255,0.25)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease'
                                      }}
                                      onClick={() => handleCategorySelectAll(category)}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.4)'}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                                      title={`Select all ${category} modules`}
                                    >
                                      <i className="fas fa-check-double me-1"></i>
                                      Select All
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-sm px-3 py-2"
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        borderRadius: '6px',
                                        backgroundColor: 'rgba(255,255,255,0.25)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease'
                                      }}
                                      onClick={() => handleCategoryDeselectAll(category)}
                                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.4)'}
                                      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                                      title={`Deselect all ${category} modules`}
                                    >
                                      <i className="fas fa-times me-1"></i>
                                      Clear
                                    </button>
                                  </div>
                                </div>

                                {/* Category Modules */}
                                <div className="row g-3">
                                  {groupedModules[category].map(module => (
                                    <div key={module.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div
                                        className={`module-card ${form.accessModules[module.module_key] ? 'selected' : ''}`}
                                        style={{
                                          cursor: 'pointer',
                                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                          borderRadius: '10px',
                                          padding: '14px',
                                          backgroundColor: form.accessModules[module.module_key]
                                            ? 'white'
                                            : 'rgba(255,255,255,0.7)',
                                          border: form.accessModules[module.module_key]
                                            ? '2px solid #0d6efd'
                                            : '2px solid rgba(0,0,0,0.08)',
                                          boxShadow: form.accessModules[module.module_key]
                                            ? '0 8px 20px rgba(13, 110, 253, 0.25), 0 0 0 4px rgba(13, 110, 253, 0.1)'
                                            : '0 2px 8px rgba(0,0,0,0.04)',
                                          transform: form.accessModules[module.module_key] ? 'translateY(-2px)' : 'translateY(0)',
                                          position: 'relative',
                                          overflow: 'hidden'
                                        }}
                                        onClick={() => handleModuleToggle(module.module_key)}
                                        onMouseEnter={(e) => {
                                          if (!form.accessModules[module.module_key]) {
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.borderColor = 'rgba(13, 110, 253, 0.3)';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!form.accessModules[module.module_key]) {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                                          }
                                        }}
                                      >
                                        {/* Selection indicator */}
                                        {form.accessModules[module.module_key] && (
                                          <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '0',
                                            height: '0',
                                            borderStyle: 'solid',
                                            borderWidth: '0 40px 40px 0',
                                            borderColor: 'transparent #0d6efd transparent transparent'
                                          }}>
                                            <i className="fas fa-check" style={{
                                              position: 'absolute',
                                              top: '4px',
                                              right: '-36px',
                                              color: 'white',
                                              fontSize: '10px'
                                            }}></i>
                                          </div>
                                        )}

                                        <div className="d-flex align-items-center justify-content-between">
                                          <div className="d-flex align-items-center gap-2 flex-grow-1">
                                            <div
                                              style={{
                                                width: '42px',
                                                height: '42px',
                                                minWidth: '42px',
                                                borderRadius: '10px',
                                                background: form.accessModules[module.module_key]
                                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                  : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease',
                                                boxShadow: form.accessModules[module.module_key]
                                                  ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                                                  : 'none'
                                              }}
                                            >
                                              <i className="fas fa-cube" style={{
                                                fontSize: '18px',
                                                color: form.accessModules[module.module_key] ? 'white' : '#6c757d'
                                              }}></i>
                                            </div>
                                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                              <label
                                                className="mb-0 d-block"
                                                style={{
                                                  cursor: 'pointer',
                                                  fontSize: '13px',
                                                  fontWeight: '600',
                                                  lineHeight: '1.4',
                                                  userSelect: 'none',
                                                  color: form.accessModules[module.module_key] ? '#0d6efd' : '#2c3e50',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                  whiteSpace: 'nowrap'
                                                }}
                                                title={module.module_name}
                                              >
                                                {module.module_name}
                                              </label>
                                              <small style={{
                                                fontSize: '10px',
                                                color: '#6c757d',
                                                fontWeight: '500'
                                              }}>
                                                {module.module_key}
                                              </small>
                                            </div>
                                          </div>
                                          <div className="form-check form-switch m-0" style={{ paddingLeft: 0 }}>
                                            <input
                                              type="checkbox"
                                              className="form-check-input m-0"
                                              checked={form.accessModules[module.module_key] || false}
                                              onChange={(e) => {
                                                e.stopPropagation();
                                                handleModuleToggle(module.module_key);
                                              }}
                                              style={{
                                                cursor: 'pointer',
                                                width: '40px',
                                                height: '20px',
                                                backgroundColor: form.accessModules[module.module_key] ? '#0d6efd' : '#dee2e6',
                                                borderColor: form.accessModules[module.module_key] ? '#0d6efd' : '#dee2e6'
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex justify-content-end gap-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-danger px-20 py-11"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-outline-success px-20 py-11"
                        >
                          {editId ? 'Update User' : 'Create User'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Users Table */}
            {showTable && (
              <div className="card basic-data-table mt-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">All Users</h5>
                </div>
                <div className="card-body">
                  <DataTable
                    data={users}
                    columns={columns}
                    loading={loading}
                    error={null}
                    title="Users List"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableExport={false}
                    enableSelection={true}
                    enableActions={true}
                    pageSize={10}
                  />
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default UserCreation;
