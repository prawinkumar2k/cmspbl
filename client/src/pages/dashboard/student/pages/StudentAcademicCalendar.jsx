import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Icon } from "@iconify/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../../components/css/style.css";
import "../../../../components/css/remixicon.css";
import '../../../../components/css/academicCalendar.css';
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import axios from 'axios';
import {
    Calendar
} from 'lucide-react';

const StudentAcademicCalendar = () => {
    const calendarRef = useRef(null);

    // State management
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isCalendarReady, setIsCalendarReady] = useState(false);
    const [events, setEvents] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Academic Year Date Range
    const [academicYearStart, setAcademicYearStart] = useState(null);
    const [academicYearEnd, setAcademicYearEnd] = useState(null);
    const [totalWeeks, setTotalWeeks] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const eventCategories = [
        { value: 'exam', label: 'Exam', color: '#10b981' },
        { value: 'function', label: 'Function', color: '#3b82f6' },
        { value: 'important', label: 'Important', color: '#f59e0b' },
        { value: 'holiday', label: 'Holiday', color: '#ef4444' }
    ];

    // Fetch academic year range from server
    const fetchAcademicYearRange = async () => {
        try {
            const res = await axios.get('/api/calendar/academic-year');
            if (res.data && res.data.startDate && res.data.endDate) {
                setAcademicYearStart(new Date(res.data.startDate));
                setAcademicYearEnd(new Date(res.data.endDate));
                setTotalWeeks(res.data.totalWeeks);
            }
        } catch (err) {
            console.error('Error fetching academic year range:', err);
        }
    };

    // Fetch events from server
    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/calendar');
            setEvents(res.data.map(event => {
                let start = event.start;
                let end = event.end;
                if (start !== end && end) {
                    const endDate = new Date(end);
                    endDate.setDate(endDate.getDate() + 1);
                    end = endDate.toISOString().slice(0, 10);
                }
                return {
                    ...event,
                    start,
                    end,
                    backgroundColor: eventCategories.find(cat => cat.value === event.category)?.color || '#3b82f6',
                    borderColor: eventCategories.find(cat => cat.value === event.category)?.color || '#3b82f6'
                };
            }));
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAcademicYearRange();
        fetchEvents();
    }, []);

    const handleEventClick = (clickInfo) => {
        const event = events.find(e => e.id === clickInfo.event.id);
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const renderEventContent = (eventInfo) => {
        const categoryColor = eventCategories.find(cat => cat.value === eventInfo.event.extendedProps.category)?.color || '#3b82f6';
        return (
            <div
                className="custom-event-content"
                style={{
                    backgroundColor: categoryColor,
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    width: '100%',
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {eventInfo.event.title}
            </div>
        );
    };

    const goToPrev = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.prev();
            setTimeout(() => setCurrentDate(calendarApi.getDate()), 0);
        }
    };

    const goToNext = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.next();
            setTimeout(() => setCurrentDate(calendarApi.getDate()), 0);
        }
    };

    const goToToday = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            const today = new Date();
            calendarApi.gotoDate(today);
            setTimeout(() => setCurrentDate(today), 0);
        }
    };

    const changeView = (view) => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(view);
            setCurrentView(view);
        }
    };

    const getViewTitle = () => {
        if (currentView === 'dayGridMonth') {
            return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else {
            return currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
    };

    useEffect(() => {
        if (calendarRef.current && !isCalendarReady && academicYearStart) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(academicYearStart);
            setCurrentDate(academicYearStart);
            setIsCalendarReady(true);
        }
    }, [isCalendarReady, academicYearStart]);

    if (isLoading) {
        return (
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">
                    <div className="dashboard-header" style={{ border: 'none', boxShadow: 'none' }}>
                        <h5>Academic Calendar</h5>
                        <p><Calendar size={16} /> Comprehensive overview of the academic calendar.</p>
                    </div>

                    <div className="row gy-4">
                        <div className="col-xxl-3 col-lg-4">
                            <div className="card h-100 p-0">
                                <div className="card-body p-24">
                                    {academicYearStart && (
                                        <div className="mb-24 p-3" style={{ backgroundColor: '#f0f7ff', border: '1px solid #3b82f6', borderRadius: '12px' }}>
                                            <h6 className="text-sm fw-bold text-primary mb-2">Academic Session</h6>
                                            <div className="text-xs text-secondary-light">
                                                <div><strong>Starts:</strong> {academicYearStart.toLocaleDateString('en-GB')}</div>
                                                <div><strong>Ends:</strong> {academicYearEnd?.toLocaleDateString('en-GB')}</div>
                                                <div className="mt-2 pt-2 border-top"><strong>Weeks:</strong> {totalWeeks}</div>
                                            </div>
                                        </div>
                                    )}

                                    <h6 className="text-lg fw-semibold mb-16">Legend</h6>
                                    <div className="d-flex flex-column gap-3">
                                        {eventCategories.map(cat => (
                                            <div key={cat.value} className="d-flex align-items-center gap-2">
                                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }}></span>
                                                <span className="text-sm fw-medium text-dark">{cat.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-40">
                                        <h6 className="text-lg fw-semibold mb-16">Upcoming Highlights</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {events
                                                .filter(e => new Date(e.start) >= new Date())
                                                .sort((a, b) => new Date(a.start) - new Date(b.start))
                                                .slice(0, 5)
                                                .map(event => (
                                                    <div key={event.id} className="p-3 bg-base border radius-12">
                                                        <h6 className="text-xs fw-bold mb-1 truncate-1">{event.title}</h6>
                                                        <span className="text-[10px] text-secondary-light">
                                                            {new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-9 col-lg-8">
                            <div className="card h-100">
                                <div className="card-body p-24">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                                        <div className="d-flex align-items-center gap-2">
                                            <button className="btn btn-light btn-sm" onClick={goToPrev}><Icon icon="heroicons:chevron-left" /></button>
                                            <button className="btn btn-light btn-sm" onClick={goToNext}><Icon icon="heroicons:chevron-right" /></button>
                                            <button className="btn btn-primary btn-sm ms-2" onClick={goToToday}>Today</button>
                                        </div>

                                        <h4 className="mb-0 fw-bold text-primary-light text-center flex-grow-1">{getViewTitle()}</h4>

                                        <div className="btn-group">
                                            <button className={`btn btn-sm ${currentView === 'dayGridMonth' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => changeView('dayGridMonth')}>Month</button>
                                            <button className={`btn btn-sm ${currentView === 'timeGridWeek' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => changeView('timeGridWeek')}>Week</button>
                                            <button className={`btn btn-sm ${currentView === 'listMonth' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => changeView('listMonth')}>List</button>
                                        </div>
                                    </div>

                                    <FullCalendar
                                        ref={calendarRef}
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                        headerToolbar={false}
                                        initialView="dayGridMonth"
                                        editable={false}
                                        selectable={false}
                                        events={events}
                                        eventClick={handleEventClick}
                                        eventContent={renderEventContent}
                                        height="auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {showViewModal && selectedEvent && (
                        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content radius-16 bg-base border-0 shadow-lg">
                                    <div className="modal-header py-16 px-24 border-bottom d-flex align-items-center justify-content-between bg-primary text-white" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                                        <h1 className="modal-title fs-5 fw-bold">Event Details</h1>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
                                    </div>
                                    <div className="modal-body p-24">
                                        <div className="mb-24">
                                            <label className="text-xs fw-bold text-muted text-uppercase mb-1 d-block">Title</label>
                                            <h5 className="fw-bold text-dark mb-0">{selectedEvent.title}</h5>
                                        </div>
                                        <div className="row mb-24">
                                            <div className="col-6">
                                                <label className="text-xs fw-bold text-muted text-uppercase mb-1 d-block">Date</label>
                                                <p className="fw-semibold text-dark mb-0">
                                                    {new Date(selectedEvent.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="col-6">
                                                <label className="text-xs fw-bold text-muted text-uppercase mb-1 d-block">Category</label>
                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                    <span style={{ backgroundColor: selectedEvent.backgroundColor, width: '10px', height: '10px', borderRadius: '50%' }}></span>
                                                    <span className="fw-semibold text-dark text-capitalize">{selectedEvent.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedEvent.description && (
                                            <div className="mb-0">
                                                <label className="text-xs fw-bold text-muted text-uppercase mb-1 d-block">Description</label>
                                                <p className="text-secondary-light mb-0" style={{ lineHeight: '1.6' }}>{selectedEvent.description}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer border-0 p-24 pt-0">
                                        <button className="btn btn-secondary w-100 radius-12 fw-bold" onClick={() => setShowViewModal(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </section>
    );
};

export default StudentAcademicCalendar;
