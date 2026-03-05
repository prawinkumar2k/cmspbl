import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';

import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";

const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShift, setEditingShift] = useState(null);
    const [formData, setFormData] = useState({
        shift_name: '',
        start_time: '09:00',
        end_time: '17:00',
        grace_period_minutes: 15,
        is_active: true
    });

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/hr/shifts');
            if (response.data) {
                const data = response.data;
                setShifts(data);
            } else {
                // Default shifts for demo
                setShifts([
                    { id: 1, shift_name: 'Morning Shift', start_time: '08:00:00', end_time: '16:00:00', grace_period_minutes: 15, is_active: true },
                    { id: 2, shift_name: 'General Shift', start_time: '09:00:00', end_time: '17:00:00', grace_period_minutes: 15, is_active: true },
                    { id: 3, shift_name: 'Evening Shift', start_time: '14:00:00', end_time: '22:00:00', grace_period_minutes: 15, is_active: true },
                    { id: 4, shift_name: 'Night Shift', start_time: '22:00:00', end_time: '06:00:00', grace_period_minutes: 15, is_active: false },
                ]);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingShift) {
                response = await api.put(`/hr/shifts/${editingShift.id}`, formData);
            } else {
                response = await api.post('/hr/shifts', formData);
            }

            if (response.data) {
                toast.success(editingShift ? 'Shift updated successfully' : 'Shift created successfully');
                fetchShifts();
                handleCloseModal();
            } else {
                toast.error('Failed to save shift');
            }
        } catch (error) {
            toast.error('Error saving shift');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this shift?')) return;

        try {
            const response = await api.delete(`/hr/shifts/${id}`);
            if (response.data) {
                toast.success('Shift deleted successfully');
                fetchShifts();
            } else {
                toast.error('Failed to delete shift');
            }
        } catch (error) {
            toast.error('Error deleting shift');
        }
    };

    const handleEdit = (shift) => {
        setEditingShift(shift);
        setFormData({
            shift_name: shift.shift_name,
            start_time: shift.start_time.slice(0, 5),
            end_time: shift.end_time.slice(0, 5),
            grace_period_minutes: shift.grace_period_minutes,
            is_active: shift.is_active
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingShift(null);
        setFormData({
            shift_name: '',
            start_time: '09:00',
            end_time: '17:00',
            grace_period_minutes: 15,
            is_active: true
        });
    };

    const formatTime = (time) => {
        if (!time) return '-';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    };

    const calculateDuration = (start, end) => {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        let diff = (eh * 60 + em) - (sh * 60 + sm);
        if (diff < 0) diff += 24 * 60; // Next day
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
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
                                <Icon icon="mdi:calendar-clock" className="text-purple" style={{ fontSize: '28px' }} />
                                Shift Management
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Shift Management</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Action Bar */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <p className="text-muted mb-0">Manage work shifts and their timings</p>
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                <Icon icon="mdi:plus" className="me-1" /> Add New Shift
                            </button>
                        </div>

                        {/* Shifts Grid */}
                        <div className="row g-4">
                            {loading ? (
                                <div className="col-12 text-center py-5">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            ) : (
                                shifts.map(shift => (
                                    <div className="col-md-6 col-lg-4" key={shift.id}>
                                        <div className={`card border-0 shadow-sm h-100 ${!shift.is_active ? 'opacity-50' : ''}`}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="bg-purple-subtle rounded-circle p-2">
                                                            <Icon icon="mdi:clock-time-eight" className="text-purple" style={{ fontSize: '24px' }} />
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold mb-0">{shift.shift_name}</h6>
                                                            <small className={`badge ${shift.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                {shift.is_active ? 'Active' : 'Inactive'}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="dropdown">
                                                        <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
                                                            <Icon icon="mdi:dots-vertical" />
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <button className="dropdown-item" onClick={() => handleEdit(shift)}>
                                                                    <Icon icon="mdi:pencil" className="me-2" /> Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button className="dropdown-item text-danger" onClick={() => handleDelete(shift.id)}>
                                                                    <Icon icon="mdi:delete" className="me-2" /> Delete
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="row g-2 mt-2">
                                                    <div className="col-6">
                                                        <small className="text-muted">Start Time</small>
                                                        <p className="fw-semibold mb-0 text-success">
                                                            <Icon icon="mdi:clock-start" className="me-1" />
                                                            {formatTime(shift.start_time)}
                                                        </p>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">End Time</small>
                                                        <p className="fw-semibold mb-0 text-danger">
                                                            <Icon icon="mdi:clock-end" className="me-1" />
                                                            {formatTime(shift.end_time)}
                                                        </p>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Duration</small>
                                                        <p className="fw-semibold mb-0 text-primary">
                                                            <Icon icon="mdi:timer-outline" className="me-1" />
                                                            {calculateDuration(shift.start_time, shift.end_time)}
                                                        </p>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Grace Period</small>
                                                        <p className="fw-semibold mb-0 text-warning">
                                                            <Icon icon="mdi:timer-sand" className="me-1" />
                                                            {shift.grace_period_minutes} min
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal */}
                        {showModal && (
                            <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">{editingShift ? 'Edit Shift' : 'Add New Shift'}</h5>
                                            <button className="btn-close" onClick={handleCloseModal}></button>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="modal-body">
                                                <div className="mb-3">
                                                    <label className="form-label">Shift Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.shift_name}
                                                        onChange={(e) => setFormData({ ...formData, shift_name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="row g-3">
                                                    <div className="col-6">
                                                        <label className="form-label">Start Time *</label>
                                                        <input
                                                            type="time"
                                                            className="form-control"
                                                            value={formData.start_time}
                                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <label className="form-label">End Time *</label>
                                                        <input
                                                            type="time"
                                                            className="form-control"
                                                            value={formData.end_time}
                                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-3 mt-3">
                                                    <label className="form-label">Grace Period (minutes)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={formData.grace_period_minutes}
                                                        onChange={(e) => setFormData({ ...formData, grace_period_minutes: parseInt(e.target.value) || 0 })}
                                                        min="0"
                                                        max="60"
                                                    />
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="isActive"
                                                        checked={formData.is_active}
                                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    />
                                                    <label className="form-check-label" htmlFor="isActive">Active</label>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                                <button type="submit" className="btn btn-primary">
                                                    {editingShift ? 'Update Shift' : 'Create Shift'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
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

export default ShiftManagement;
