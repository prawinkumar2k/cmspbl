import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../../../../context/AuthContext';
import {
    Clock, AlertCircle, Loader2
} from 'lucide-react';
import "../components/css/studentDashboard.css";

const Timetable = () => {
    const { getAuthHeaders } = useAuth();
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await fetch('/api/student-portal/timetable', {
                    headers: getAuthHeaders()
                });
                const result = await response.json();
                if (result.success) {
                    setTimetableData(result);
                } else {
                    setError(result.error || 'Failed to load timetable');
                }
            } catch (err) {
                console.error('Error fetching timetable:', err);
                setError('A connection error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, []);

    if (loading) {
        return (
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body d-flex align-items-center justify-content-center">
                        <div className="text-center">
                            <Loader2 size={40} className="text-primary spin-animation mb-3" />
                            <h6 className="text-muted">Fetching your schedule...</h6>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const timetable = timetableData?.timetable || [];
    const maxPeriods = timetable.length > 0 ? timetable[0].periods.length : 0;

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">

                    <div className="dashboard-header">
                        <h5>Class Timetable</h5>
                        <p><Clock size={16} /> Organized view of your weekly academic schedule.</p>
                    </div>

                    {/* Timetable Table Container */}
                    <div className="row gy-4">
                        <div className="col-12">
                            <div className="premium-card p-0 overflow-hidden border-0 shadow-sm">
                                <div className="table-responsive">
                                    <table className="table mb-0 align-middle text-center timetable-table border-0">
                                        <thead>
                                            <tr className="bg-light bg-opacity-50">
                                                <th className="py-3 px-4 text-muted text-center uppercase text-xs fw-bold" style={{ width: '150px' }}>
                                                    Day Order
                                                </th>
                                                {[...Array(maxPeriods)].map((_, i) => (
                                                    <th key={i} className="py-3 text-muted text-center uppercase text-xs fw-bold">
                                                        Period {i + 1}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timetable.length > 0 ? (
                                                timetable.map((day, dayIdx) => (
                                                    <tr key={dayIdx} className="border-bottom border-light">
                                                        <td className="p-0 fw-extrabold text-blue-900 bg-light bg-opacity-25 border-end align-middle">
                                                            <div className="d-flex align-items-center justify-content-center p-3 h-100 text-center">
                                                                {day.dayOrder}
                                                            </div>
                                                        </td>
                                                        {day.periods.map((period, pIdx) => (
                                                            <td key={pIdx} className="p-0 border-end last-child-border-0">
                                                                <div
                                                                    className={`p-3 h-100 d-flex flex-column justify-content-center transition-all ${period.name === 'Free' ? 'bg-light bg-opacity-50' : 'hover-bg-soft-blue'}`}
                                                                    title={period.name !== 'Free' ? `${period.code} - ${period.name}` : 'Free Period'}
                                                                >
                                                                    {period.name !== 'Free' ? (
                                                                        <>
                                                                            <div className="fw-semibold text-sm mb-1">{period.code}</div>
                                                                            <div className="text-muted text-xs line-clamp-1">{period.name}</div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="text-xs text-muted opacity-50 italic">-- Free --</div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={maxPeriods + 1} className="py-5 text-center">
                                                        <AlertCircle size={32} className="text-muted mb-2" />
                                                        <p className="text-muted mb-0">No schedule found for your section.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </section>
    );
};

export default Timetable;
