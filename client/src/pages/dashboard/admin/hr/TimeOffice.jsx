import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";

const TimeOffice = () => {
    const [activeTab, setActiveTab] = useState('attendance');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [shifts, setShifts] = useState([]);

    // Mock attendance logs
    const mockLogs = [
        { id: 1, emp_id: 'EMP001', name: 'Rajesh Kumar', punch_in: '08:55', punch_out: '18:10', status: 'Present', shift: 'Day', hours: '9h 15m' },
        { id: 2, emp_id: 'EMP002', name: 'Priya Sharma', punch_in: '09:05', punch_out: '17:50', status: 'Present', shift: 'Day', hours: '8h 45m' },
        { id: 3, emp_id: 'EMP003', name: 'Amit Singh', punch_in: '09:30', punch_out: '18:00', status: 'Late', shift: 'Day', hours: '8h 30m' },
        { id: 4, emp_id: 'EMP004', name: 'Sneha Patel', punch_in: '--:--', punch_out: '--:--', status: 'Absent', shift: 'Day', hours: '0h' },
        { id: 5, emp_id: 'EMP005', name: 'Rahul Verma', punch_in: '08:45', punch_out: '13:00', status: 'Half Day', shift: 'Day', hours: '4h 15m' },
    ];

    // Mock shifts
    const mockShifts = [
        { id: 1, name: 'Day Shift', start: '09:00', end: '18:00', break: '1 hour', is_active: true },
        { id: 2, name: 'Night Shift', start: '21:00', end: '06:00', break: '1 hour', is_active: true },
        { id: 3, name: 'Morning Shift', start: '06:00', end: '14:00', break: '30 mins', is_active: true },
        { id: 4, name: 'Afternoon Shift', start: '14:00', end: '22:00', break: '30 mins', is_active: false },
    ];

    useEffect(() => {
        setAttendanceLogs(mockLogs);
        setShifts(mockShifts);
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Present': return 'bg-success';
            case 'Absent': return 'bg-danger';
            case 'Late': return 'bg-warning text-dark';
            case 'Half Day': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const summary = {
        present: attendanceLogs.filter(l => l.status === 'Present').length,
        absent: attendanceLogs.filter(l => l.status === 'Absent').length,
        late: attendanceLogs.filter(l => l.status === 'Late').length,
        halfDay: attendanceLogs.filter(l => l.status === 'Half Day').length,
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
                                <Icon icon="mdi:clock-time-eight" className="text-info" style={{ fontSize: '28px' }} />
                                Time Office
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Time Office</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Tabs */}
                        <ul className="nav nav-tabs mb-4">
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
                                    <Icon icon="mdi:clipboard-clock" className="me-1" /> Daily Attendance Log
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'shifts' ? 'active' : ''}`} onClick={() => setActiveTab('shifts')}>
                                    <Icon icon="mdi:calendar-clock" className="me-1" /> Shift Configuration
                                </button>
                            </li>
                        </ul>

                        {activeTab === 'attendance' && (
                            <>
                                {/* Summary Cards */}
                                <div className="row g-3 mb-4">
                                    <div className="col-6 col-md-3">
                                        <div className="card border-0 shadow-sm bg-success-subtle">
                                            <div className="card-body text-center py-3">
                                                <h4 className="fw-bold text-success mb-0">{summary.present}</h4>
                                                <small>Present</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="card border-0 shadow-sm bg-danger-subtle">
                                            <div className="card-body text-center py-3">
                                                <h4 className="fw-bold text-danger mb-0">{summary.absent}</h4>
                                                <small>Absent</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="card border-0 shadow-sm bg-warning-subtle">
                                            <div className="card-body text-center py-3">
                                                <h4 className="fw-bold text-warning mb-0">{summary.late}</h4>
                                                <small>Late</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="card border-0 shadow-sm bg-info-subtle">
                                            <div className="card-body text-center py-3">
                                                <h4 className="fw-bold text-info mb-0">{summary.halfDay}</h4>
                                                <small>Half Day</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body py-3">
                                        <div className="row align-items-center">
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold mb-1">Select Date</label>
                                                <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold mb-1">Shift</label>
                                                <select className="form-select">
                                                    <option>All Shifts</option>
                                                    {shifts.filter(s => s.is_active).map(s => (
                                                        <option key={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold mb-1">Search</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light"><Icon icon="mdi:magnify" /></span>
                                                    <input type="text" className="form-control" placeholder="Search employee..." />
                                                </div>
                                            </div>
                                            <div className="col-md-2 d-flex align-items-end">
                                                <button className="btn btn-outline-primary w-100">
                                                    <Icon icon="mdi:download" className="me-1" /> Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Attendance Table */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold">
                                            Attendance Log - {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                                        </h6>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="ps-3">#</th>
                                                        <th>Employee ID</th>
                                                        <th>Name</th>
                                                        <th>Shift</th>
                                                        <th className="text-center">Punch In</th>
                                                        <th className="text-center">Punch Out</th>
                                                        <th className="text-center">Hours</th>
                                                        <th className="text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attendanceLogs.map((log, idx) => (
                                                        <tr key={log.id}>
                                                            <td className="ps-3">{idx + 1}</td>
                                                            <td><span className="badge bg-light text-dark">{log.emp_id}</span></td>
                                                            <td className="fw-medium">{log.name}</td>
                                                            <td>{log.shift}</td>
                                                            <td className="text-center fw-semibold text-success">{log.punch_in}</td>
                                                            <td className="text-center fw-semibold text-danger">{log.punch_out}</td>
                                                            <td className="text-center">{log.hours}</td>
                                                            <td className="text-center">
                                                                <span className={`badge ${getStatusBadge(log.status)}`}>{log.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'shifts' && (
                            <>
                                {/* Shift Cards */}
                                <div className="row g-4">
                                    {shifts.map(shift => (
                                        <div className="col-md-6 col-lg-3" key={shift.id}>
                                            <div className={`card border-0 shadow-sm h-100 ${shift.is_active ? '' : 'opacity-50'}`}>
                                                <div className="card-body text-center py-4">
                                                    <div className="rounded-circle bg-primary-subtle p-3 d-inline-block mb-3">
                                                        <Icon icon="mdi:clock-outline" className="text-primary" style={{ fontSize: '32px' }} />
                                                    </div>
                                                    <h6 className="fw-bold mb-2">{shift.name}</h6>
                                                    <p className="mb-1 text-muted">
                                                        <Icon icon="mdi:clock-start" className="me-1" />{shift.start} - <Icon icon="mdi:clock-end" className="me-1" />{shift.end}
                                                    </p>
                                                    <small className="text-muted">Break: {shift.break}</small>
                                                    <div className="mt-3">
                                                        <span className={`badge ${shift.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                            {shift.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="card-footer bg-white border-0 text-center pb-3">
                                                    <button className="btn btn-sm btn-outline-primary me-1"><Icon icon="mdi:pencil" /></button>
                                                    <button className="btn btn-sm btn-outline-danger"><Icon icon="mdi:delete" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Shift Card */}
                                    <div className="col-md-6 col-lg-3">
                                        <div className="card border-0 shadow-sm h-100 border-dashed d-flex align-items-center justify-content-center" style={{ minHeight: '220px', border: '2px dashed #dee2e6', cursor: 'pointer' }}>
                                            <div className="text-center text-muted">
                                                <Icon icon="mdi:plus-circle-outline" style={{ fontSize: '48px' }} />
                                                <p className="mt-2 mb-0">Add New Shift</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <Footer />
                </div>
            </section>
        </>
    );
};

export default TimeOffice;
