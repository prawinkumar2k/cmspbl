import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/footer";
import DataTable from '../../../components/DataTable';
import axios from 'axios';
import '../admin/master/subject.css';

const LoginDetails = () => {
  const [loginData, setLoginData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [uniqueUsers, setUniqueUsers] = useState([]);

  useEffect(() => {
    fetchLoginDetails();
  }, []);

  const fetchLoginDetails = async (filters = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = '/api/logs';
      const params = new URLSearchParams();
      
      if (filters.username) {
        url = `/api/logs/user/${filters.username}`;
      } else if (filters.startDate && filters.endDate) {
        url = '/api/logs/date-range';
        params.append('startDate', filters.startDate);
        params.append('endDate', filters.endDate);
      }
      
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      const response = await axios.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Add serial numbers
      const dataWithSerial = response.data.data.map((item, index) => ({
        ...item,
        serial_no: index + 1,
        // Format the date for better display
        formatted_date: new Date(item.login_date).toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }));
      
      setLoginData(dataWithSerial);
      
      // Extract unique usernames for filter
      const users = [...new Set(dataWithSerial.map(item => item.username))];
      setUniqueUsers(users);
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error fetching login details:', err);
      toast.error('Failed to fetch login details');
    }
  };

  const handleFilter = () => {
    const filters = {};
    
    if (selectedUsername) {
      filters.username = selectedUsername;
    }
    
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }
    
    fetchLoginDetails(filters);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedUsername('');
    fetchLoginDetails();
  };

  const columns = [
    {
      header: 'S.No',
      accessorKey: 'serial_no',
      size: 60,
    },
    {
      header: 'User ID',
      accessorKey: 'username',
      size: 120,
    },
    {
      header: 'Role',
      accessorKey: 'role',
      size: 100,
    },
    {
      header: 'Login Date & Time',
      accessorKey: 'formatted_date',
      size: 180,
    },
    {
      header: 'Action',
      accessorKey: 'action',
      size: 100,
      cell: ({ row }) => (
        <span className={`badge ${row.original.action === 'Logged in' ? 'badge-success' : 'badge-danger'}`}>
          {row.original.action}
        </span>
      ),
    },
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
              <h6 className="fw-semibold mb-0">Login Details</h6>
            </div>

            {/* Filter Card */}
            <div className="card h-100 p-0 radius-12 mb-4">
              <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-lg fw-semibold mb-0">Filter Login Records</h6>
              </div>
              <div className="card-body p-24">
                <div className="row g-20">
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      User ID
                    </label>
                    <select
                      className="form-select radius-8"
                      value={selectedUsername}
                      onChange={(e) => setSelectedUsername(e.target.value)}
                    >
                      <option value="">All Users</option>
                      {uniqueUsers.map((user, index) => (
                        <option key={index} value={user}>
                          {user}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control radius-8"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control radius-8"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="col-12 col-md-3 d-flex align-items-end gap-2">
                    <button
                      className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                      onClick={handleFilter}
                    >
                      <iconify-icon icon="solar:filter-bold" className="icon text-xl line-height-1"></iconify-icon>
                      Apply Filter
                    </button>
                    <button
                      className="btn btn-outline-danger text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                      onClick={handleReset}
                    >
                      <iconify-icon icon="solar:restart-bold" className="icon text-xl line-height-1"></iconify-icon>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="card basic-data-table">
              <div className="card-header">
                <h5 className="card-title mb-0">Login Records</h5>
              </div>
              <div className="card-body">
                <DataTable
                  data={loginData}
                  columns={columns}
                  loading={loading}
                  error={null}
                  title="Login Records"
                  enableActions={false}
                  enableSelection={false}
                  enableExport={false}
                  pageSize={10}
                />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default LoginDetails;
