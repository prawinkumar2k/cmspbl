import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import axios from 'axios';
import api from '../../../../utils/api';
import DataTable from '../../../../components/DataTable/DataTable';

const StaffAttendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [staffList, setStaffList] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [department, setDepartment] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceData, setAttendanceData] = useState({});

    // Mock departments
    const departments = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Administration'];

    // Fetch staff
    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await api.get('/staff_master');
            const data = Array.isArray(response.data) ? response.data : [];
            setStaffList(data);
            setFilteredStaff(data);

            // Initialize attendance data
            const initialAttendance = {};
            data.forEach(staff => {
                initialAttendance[staff.Staff_ID] = {
                    status: 'Present',
                    inTime: '09:00',
                    outTime: '18:00',
                    remarks: ''
                };
            });
            setAttendanceData(initialAttendance);
        } catch (error) {
            console.error('Error fetching staff:', error);
            setStaffList([]);
            setFilteredStaff([]);
            toast.error('Failed to load staff');
        } finally {
            setLoading(false);
        }
    };

    // Filter staff
    useEffect(() => {
        let filtered = staffList;
        if (department !== 'All') {
            filtered = filtered.filter(s => s.Dept_Name === department);
        }
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.Staff_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.Staff_ID?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredStaff(filtered);
    }, [department, searchTerm, staffList]);

    const handleStatusChange = (staffId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [staffId]: { ...prev[staffId], status }
        }));
    };

    const handleTimeChange = (staffId, field, value) => {
        setAttendanceData(prev => ({
            ...prev,
            [staffId]: { ...prev[staffId], [field]: value }
        }));
    };

    const handleSaveAttendance = () => {
        toast.success(`Attendance saved for ${selectedDate}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Present': return 'bg-success';
            case 'Absent': return 'bg-danger';
            case 'Half Day': return 'bg-warning';
            case 'On Leave': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const summary = {
        total: filteredStaff.length,
        present: Object.values(attendanceData).filter(a => a.status === 'Present').length,
        absent: Object.values(attendanceData).filter(a => a.status === 'Absent').length,
        halfDay: Object.values(attendanceData).filter(a => a.status === 'Half Day').length,
        onLeave: Object.values(attendanceData).filter(a => a.status === 'On Leave').length,
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        {/* Page Header */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                            <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                <Icon icon="mdi:clipboard-check" className="text-purple" style={{ fontSize: '28px' }} />
                                Staff Attendance
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Staff Attendance</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Filters */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <div className="row g-3 align-items-end">
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Select Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Department</label>
                                        <select
                                            className="form-select"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        >
                                            {departments.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Search Staff</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <Icon icon="mdi:magnify" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search by name or ID..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <button className="btn btn-primary w-100" onClick={handleSaveAttendance}>
                                            <Icon icon="mdi:content-save" className="me-1" />
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md">
                                <div className="card border-0 shadow-sm bg-primary-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-primary mb-0">{summary.total}</h4>
                                        <small>Total Staff</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md">
                                <div className="card border-0 shadow-sm bg-success-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-success mb-0">{summary.present}</h4>
                                        <small>Present</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md">
                                <div className="card border-0 shadow-sm bg-danger-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-danger mb-0">{summary.absent}</h4>
                                        <small>Absent</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md">
                                <div className="card border-0 shadow-sm bg-warning-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-warning mb-0">{summary.halfDay}</h4>
                                        <small>Half Day</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md">
                                <div className="card border-0 shadow-sm bg-info-subtle">
                                    <div className="card-body text-center py-3">
                                        <h4 className="fw-bold text-info mb-0">{summary.onLeave}</h4>
                                        <small>On Leave</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3">
                                <h6 className="mb-0 fw-semibold">
                                    <Icon icon="mdi:account-multiple-check" className="me-2" />
                                    Mark Attendance - {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                                </h6>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : (
                                    <DataTable
                                        data={filteredStaff}
                                        columns={[
                                            {
                                                accessorKey: 'Staff_ID',
                                                header: 'Staff ID',
                                                cell: ({ row }) => (
                                                    <span className="badge bg-light text-dark">{row.original.Staff_ID}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'Staff_Name',
                                                header: 'Name',
                                                cell: ({ row }) => (
                                                    <span className="fw-medium">{row.original.Staff_Name}</span>
                                                )
                                            },
                                            {
                                                accessorKey: 'Dept_Name',
                                                header: 'Department',
                                                cell: ({ row }) => row.original.Dept_Name || 'N/A'
                                            },
                                            {
                                                id: 'status',
                                                header: 'Status',
                                                cell: ({ row }) => (
                                                    <select
                                                        className={`form-select form-select-sm ${getStatusBadge(attendanceData[row.original.Staff_ID]?.status)} text-white`}
                                                        value={attendanceData[row.original.Staff_ID]?.status || 'Present'}
                                                        onChange={(e) => handleStatusChange(row.original.Staff_ID, e.target.value)}
                                                        style={{ minWidth: '120px' }}
                                                    >
                                                        <option value="Present" className="bg-white text-dark">Present</option>
                                                        <option value="Absent" className="bg-white text-dark">Absent</option>
                                                        <option value="Half Day" className="bg-white text-dark">Half Day</option>
                                                        <option value="On Leave" className="bg-white text-dark">On Leave</option>
                                                    </select>
                                                ),
                                                enableSorting: false
                                            },
                                            {
                                                id: 'inTime',
                                                header: 'In Time',
                                                cell: ({ row }) => (
                                                    <input
                                                        type="time"
                                                        className="form-control form-control-sm"
                                                        value={attendanceData[row.original.Staff_ID]?.inTime || '09:00'}
                                                        onChange={(e) => handleTimeChange(row.original.Staff_ID, 'inTime', e.target.value)}
                                                        disabled={attendanceData[row.original.Staff_ID]?.status === 'Absent' || attendanceData[row.original.Staff_ID]?.status === 'On Leave'}
                                                    />
                                                ),
                                                enableSorting: false
                                            },
                                            {
                                                id: 'outTime',
                                                header: 'Out Time',
                                                cell: ({ row }) => (
                                                    <input
                                                        type="time"
                                                        className="form-control form-control-sm"
                                                        value={attendanceData[row.original.Staff_ID]?.outTime || '18:00'}
                                                        onChange={(e) => handleTimeChange(row.original.Staff_ID, 'outTime', e.target.value)}
                                                        disabled={attendanceData[row.original.Staff_ID]?.status === 'Absent' || attendanceData[row.original.Staff_ID]?.status === 'On Leave'}
                                                    />
                                                ),
                                                enableSorting: false
                                            },
                                            {
                                                id: 'remarks',
                                                header: 'Remarks',
                                                cell: ({ row }) => (
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Remarks..."
                                                        value={attendanceData[row.original.Staff_ID]?.remarks || ''}
                                                        onChange={(e) => handleTimeChange(row.original.Staff_ID, 'remarks', e.target.value)}
                                                    />
                                                ),
                                                enableSorting: false
                                            }
                                        ]}
                                        loading={loading}
                                        title={`Mark Attendance - ${new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}`}
                                        enableActions={false}
                                        enableSelection={false}
                                        enableExport={true}
                                        pageSize={10}
                                    />
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

export default StaffAttendance;
