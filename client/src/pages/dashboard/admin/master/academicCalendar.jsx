import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../../components/css/style.css";
import "../../../../components/css/remixicon.css";
import '../../../../components/css/academicCalendar.css';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import axios from 'axios';

const AcademicCalendar = () => {
  const calendarRef = useRef(null);

  // State management
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCalendarReady, setIsCalendarReady] = useState(false);
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  
  // Academic Year Date Range
  const [academicYearStart, setAcademicYearStart] = useState(null);
  const [academicYearEnd, setAcademicYearEnd] = useState(null);
  const [totalWeeks, setTotalWeeks] = useState(0);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [isLoadingDateRange, setIsLoadingDateRange] = useState(true);
  const [isSavingDateRange, setIsSavingDateRange] = useState(false);

  // Form state for event creation/editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'exam',
    startDate: new Date(),
    endDate: new Date(),
    allDay: false
  });

  const eventCategories = [
    { value: 'exam', label: 'Exam', color: '#10b981' },
    { value: 'function', label: 'Function', color: '#3b82f6' },
    { value: 'important', label: 'Important', color: '#f59e0b' },
    { value: 'holiday', label: 'Holiday', color: '#ef4444' }
  ];

  // Fetch academic year range from server
  const fetchAcademicYearRange = async () => {
    try {
      setIsLoadingDateRange(true);
      const res = await axios.get('/api/calendar/academic-year');
      if (res.data && res.data.startDate && res.data.endDate) {
        setAcademicYearStart(new Date(res.data.startDate));
        setAcademicYearEnd(new Date(res.data.endDate));
        setTotalWeeks(res.data.totalWeeks);
        setShowDateRangeModal(false);
      } else {
        // No data exists, show modal
        setShowDateRangeModal(true);
      }
    } catch (err) {
      console.error('Error fetching academic year range:', err);
      setShowDateRangeModal(true);
    } finally {
      setIsLoadingDateRange(false);
    }
  };

  // Fetch events from server
  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/calendar');
      setEvents(res.data.map(event => {
        let start = event.start;
        let end = event.end;
        // If multi-day, add one day to end (FullCalendar expects exclusive end)
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
      // handle error
    }
  };

  useEffect(() => {
    fetchAcademicYearRange();
    fetchEvents();
  }, []);

  // Event handlers
  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo);
    setFormData({
      ...formData,
      startDate: selectInfo.start,
      endDate: selectInfo.end,
      allDay: selectInfo.allDay
    });
    setShowAddModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEventDrop = (dropInfo) => {
    const eventId = dropInfo.event.id;
    setEvents(events.map(event =>
      event.id === eventId
        ? {
          ...event,
          start: dropInfo.event.start.toISOString().slice(0, 10),
          end: dropInfo.event.end ? dropInfo.event.end.toISOString().slice(0, 10) : null
        }
        : event
    ));
  };

  const handleEventResize = (resizeInfo) => {
    const eventId = resizeInfo.event.id;
    setEvents(events.map(event =>
      event.id === eventId
        ? {
          ...event,
          start: resizeInfo.event.start.toISOString().slice(0, 10),
          end: resizeInfo.event.end ? resizeInfo.event.end.toISOString().slice(0, 10) : null
        }
        : event
    ));
  };

  // Add event (POST to server)
  const handleAddEvent = async () => {
    // Validate dates are within academic year range
    if (academicYearStart && academicYearEnd) {
      if (formData.startDate < academicYearStart || formData.endDate > academicYearEnd) {
        alert(`Event dates must be within the academic year range (${academicYearStart.toLocaleDateString('en-GB')} to ${academicYearEnd.toLocaleDateString('en-GB')})`);
        return;
      }
    }
    
    try {
      await axios.post('/api/calendar', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.startDate.toISOString().slice(0, 10),
        endDate: formData.endDate.toISOString().slice(0, 10)
      });
      setShowAddModal(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      // handle error
    }
  };

  // Edit event (PUT to server)
  const handleEditEvent = async () => {
    try {
      await axios.put(`/api/calendar/${selectedEvent.id}`, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.startDate.toISOString().slice(0, 10),
        endDate: formData.endDate.toISOString().slice(0, 10)
      });
      setShowEditModal(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      // handle error
    }
  };

  // Delete event (DELETE to server)
  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`/api/calendar/${selectedEvent.id}`);
      setShowDeleteModal(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      // handle error
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'exam',
      startDate: new Date(),
      endDate: new Date(),
      allDay: false
    });
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      category: event.category || 'exam',
      startDate: new Date(event.start),
      endDate: event.end ? new Date(event.end) : new Date(event.start),
      allDay: false
    });
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowViewModal(false);
    setShowDeleteModal(true);
  };

  // Custom event content renderer
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
          fontSize: '12px',
          fontWeight: '500',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <div className="event-title" style={{ fontSize: '11px' }}>
          {eventInfo.event.title}
        </div>
      </div>
    );
  };

  // Get upcoming events for sidebar
  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5);
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Dropdown toggle function
  const toggleDropdown = (eventId, e) => {
    if (openDropdown === eventId) {
      setOpenDropdown(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
      setOpenDropdown(eventId);
    }
  };

  // Navigation functions
  const goToPrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      // Use setTimeout to get the updated date after the view changes
      setTimeout(() => {
        setCurrentDate(calendarApi.getDate());
      }, 0);
    }
  };

  const goToNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setTimeout(() => {
        setCurrentDate(calendarApi.getDate());
      }, 0);
    }
  };

  const goToToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const today = academicYearStart && new Date() < academicYearStart ? academicYearStart : new Date();
      calendarApi.gotoDate(today);
      setTimeout(() => {
        setCurrentDate(today);
      }, 0);
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
    } else if (currentView === 'timeGridWeek') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  // Calculate total weeks between two dates
  const calculateWeeks = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    return Math.ceil(diffDays / 7);
  };

  // Handle Academic Year date range submission
  const handleDateRangeSubmit = async () => {
    if (academicYearStart && academicYearEnd) {
      if (academicYearEnd < academicYearStart) {
        toast.error('End date must be after start date');
        return;
      }
      const weeks = calculateWeeks(academicYearStart, academicYearEnd);
      setTotalWeeks(weeks);
      
      // Save to database
      setIsSavingDateRange(true);
      toast.loading('Inserting dates into calendar table...');
      
      try {
        await axios.post('/api/calendar/academic-year', {
          startDate: academicYearStart.toISOString().slice(0, 10),
          endDate: academicYearEnd.toISOString().slice(0, 10),
          totalWeeks: weeks
        });
        
        toast.dismiss();
        toast.success('Academic year dates inserted successfully!');
        setShowDateRangeModal(false);
        setIsSavingDateRange(false);
        
        // Navigate calendar to start date
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.gotoDate(academicYearStart);
          setCurrentDate(academicYearStart);
        }
      } catch (err) {
        console.error('Error saving academic year range:', err);
        toast.dismiss();
        toast.error('Failed to insert dates into calendar table');
        setIsSavingDateRange(false);
      }
    } else {
      toast.error('Please select both start and end dates');
    }
  };

  // Initialize calendar to current month on first load
  useEffect(() => {
    if (calendarRef.current && !isCalendarReady && academicYearStart) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(academicYearStart);
      setCurrentDate(academicYearStart);
      setIsCalendarReady(true);
    }
  }, [isCalendarReady, academicYearStart]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.btn-sm')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="overlay">
        <Sidebar />

        <div className="dashboard-main">
          <Navbar />

          <div className="dashboard-main-body">
            {/* Breadcrumb */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
              <h6 className="fw-semibold mb-0">Academic Calendar</h6>
            </div>

            <div className="row gy-4">
              {/* Sidebar */}
              <div className="col-xxl-3 col-lg-4">
                <div className="card h-100 p-0">
                  <div className="card-body p-24">
                    {/* Academic Year Info */}
                    {academicYearStart && academicYearEnd && (
                      <div className="mb-24 p-3" style={{
                        backgroundColor: '#EFF6FF',
                        border: '2px solid #3B82F6',
                        borderRadius: '8px'
                      }}>
                        <h6 className="text-sm fw-semibold mb-2" style={{ color: '#1E40AF' }}>Academic Year</h6>
                        <div style={{ fontSize: '12px', color: '#1E40AF', marginBottom: '8px' }}>
                          <div><strong>Start:</strong> {academicYearStart.toLocaleDateString('en-GB')}</div>
                          <div><strong>End:</strong> {academicYearEnd.toLocaleDateString('en-GB')}</div>
                          <div className="mt-2 pt-2" style={{ borderTop: '1px solid #93C5FD' }}>
                            <strong>Total Weeks:</strong> {totalWeeks}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm w-100"
                          style={{ 
                            backgroundColor: '#3B82F6', 
                            color: 'white',
                            fontSize: '11px',
                            padding: '4px 8px'
                          }}
                          onClick={() => setShowDateRangeModal(true)}
                        >
                          Change Academic Year
                        </button>
                      </div>
                    )}

                    {/* Add Event Button */}
                    <button
                      type="button"
                      className="btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-32"
                      onClick={() => setShowAddModal(true)}
                      disabled={!academicYearStart || !academicYearEnd}
                    >
                      <Icon icon="material-symbols:add-ad-outline" width="24" height="24" />
                      Add New Event
                    </button>

                    {/* Event Categories */}
                    <div className="mb-24">
                      <h6 className="text-lg fw-semibold mb-16">Event Categories</h6>
                      <div className="d-flex flex-column gap-2">
                        {eventCategories.map(category => (
                          <label key={category.value} className="form-check form-check-custom">
                            <span className="checkmark" style={{ backgroundColor: category.color }}></span>
                            <span className="text-black fw-medium">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="mt-32">
                      <h6 className="text-lg fw-semibold mb-16">Upcoming Events</h6>
                      <div className="event-list-container">
                        {getUpcomingEvents().map(event => {
                          const categoryColor = eventCategories.find(cat => cat.value === event.category)?.color || '#3b82f6';
                          return (
                            <div key={event.id} className="event-sidebar-item d-flex align-items-start gap-3 p-3 mb-2 position-relative">
                              <div
                                className="event-category-dot mt-1"
                                style={{ backgroundColor: categoryColor }}
                              ></div>
                              <div className="flex-grow-1">
                                <h6 className="text-sm fw-medium mb-1">{event.title}</h6>
                                <span className="text-xs text-secondary-light d-block mb-2">{formatEventDate(event.start)}</span>
                              </div>
                              <div className="dropdown position-relative">
                                <button
                                  className="btn btn-sm p-1"
                                  type="button"
                                  onClick={(e) => toggleDropdown(event.id, e)}
                                  style={{ border: 'none', background: 'none', outline: 'none' }}
                                >
                                  <Icon icon="bi:three-dots-vertical" width="16" height="16" />
                                </button>
                              </div>
                              {openDropdown === event.id && ReactDOM.createPortal(
                                <div
                                  className="dropdown-menu show"
                                  style={{
                                    position: 'absolute',
                                    top: dropdownCoords.top,
                                    left: dropdownCoords.left,
                                    zIndex: 9999,
                                    minWidth: '160px',
                                    display: 'block',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                                    borderRadius: '16px',
                                    background: '#fff',
                                    padding: '12px 0'
                                  }}
                                >
                                  <button
                                    className="dropdown-item d-flex align-items-center gap-2"
                                    type="button"
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setShowViewModal(true);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <Icon icon="lets-icons:eye-light" width="22" height="22" />
                                    View
                                  </button>
                                  <button
                                    className="dropdown-item d-flex align-items-center gap-2"
                                    type="button"
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setShowEditModal(true);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <Icon icon="basil:edit-outline" width="20" height="20" />
                                    Edit
                                  </button>
                                  <button
                                    className="dropdown-item d-flex align-items-center gap-2"
                                    type="button"
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setShowDeleteModal(true);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <Icon icon="hugeicons:delete-02" className="text-danger" width="20" height="20" />
                                    <div className="text-danger">Delete</div>
                                  </button>
                                </div>,
                                document.body
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="col-xxl-9 col-lg-8">
                <div className="card h-100">
                  <div className="card-body p-24">
                    {/* Navigation Bar */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                      <div className="d-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-light btn-icon-only btn-sm"
                          onClick={goToPrev}
                        >
                          <Icon icon="heroicons:chevron-left" className="text-lg" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-light btn-icon-only btn-sm"
                          onClick={goToNext}
                        >
                          <Icon icon="heroicons:chevron-right" className="text-lg" />
                        </button>
                      </div>

                      {/* Month/Year Title */}
                      <div className="calendar-title">
                        <h4 className="mb-0 fw-semibold text-primary-light">{getViewTitle()}</h4>
                      </div>

                      {/* View Toggle Buttons */}
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn btn-sm ${currentView === 'timeGridDay' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => changeView('timeGridDay')}
                        >
                          day
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${currentView === 'timeGridWeek' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => changeView('timeGridWeek')}
                        >
                          week
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${currentView === 'dayGridMonth' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => changeView('dayGridMonth')}
                        >
                          month
                        </button>
                      </div>

                      {/* Today Button */}
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={goToToday}
                      >
                        today
                      </button>
                    </div>

                    <FullCalendar
                      ref={calendarRef}
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                      headerToolbar={false}
                      initialView="dayGridMonth"
                      initialDate={academicYearStart || new Date()}
                      editable={true}
                      selectable={true}
                      selectMirror={true}
                      dayMaxEvents={true}
                      weekends={true}
                      events={events}
                      select={handleDateSelect}
                      eventClick={handleEventClick}
                      eventDrop={handleEventDrop}
                      eventResize={handleEventResize}
                      eventContent={renderEventContent}
                      height="auto"
                      validRange={academicYearStart && academicYearEnd ? {
                        start: academicYearStart,
                        end: new Date(academicYearEnd.getTime() + 24 * 60 * 60 * 1000) // Add 1 day to include end date
                      } : undefined}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Year Date Range Modal */}
            {!isLoadingDateRange && showDateRangeModal && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                      <h1 className="modal-title fs-5">Set Academic Year Range</h1>
                      {academicYearStart && academicYearEnd && (
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowDateRangeModal(false)}
                        ></button>
                      )}
                    </div>
                    <div className="modal-body p-24">
                      <div className="alert alert-info mb-3" style={{ fontSize: '13px' }}>
                        <Icon icon="mdi:information-outline" width="20" height="20" className="me-2" />
                        Select the start and end dates for your academic year. The calendar will only display dates within this range.
                      </div>
                      <div className="row gy-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Start Date <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control radius-8"
                            value={academicYearStart ? academicYearStart.toISOString().slice(0, 10) : ''}
                            onChange={(e) => setAcademicYearStart(new Date(e.target.value))}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            End Date <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control radius-8"
                            value={academicYearEnd ? academicYearEnd.toISOString().slice(0, 10) : ''}
                            onChange={(e) => setAcademicYearEnd(new Date(e.target.value))}
                            min={academicYearStart ? academicYearStart.toISOString().slice(0, 10) : ''}
                          />
                        </div>
                        {academicYearStart && academicYearEnd && academicYearEnd >= academicYearStart && (
                          <div className="col-12">
                            <div className="alert alert-success mb-0" style={{ fontSize: '13px' }}>
                              <Icon icon="mdi:check-circle-outline" width="20" height="20" className="me-2" />
                              Total Duration: {calculateWeeks(academicYearStart, academicYearEnd)} weeks
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer px-24 py-16 border border-bottom-0 border-start-0 border-end-0">
                      <button
                        type="button"
                        className="btn btn-primary text-sm btn-sm px-20 py-11"
                        onClick={handleDateRangeSubmit}
                        disabled={isSavingDateRange}
                      >
                        {isSavingDateRange ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Inserting Dates...
                          </>
                        ) : (
                          'Confirm & Set Range'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Event Modal */}
            {showAddModal && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                      <h1 className="modal-title fs-5">Add New Event</h1>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowAddModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body p-24">
                      <div className="row gy-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Event Title <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control radius-8"
                            placeholder="Enter Event Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="form-control radius-8"
                            value={formData.startDate.toISOString().slice(0, 10)}
                            onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                            min={academicYearStart ? academicYearStart.toISOString().slice(0, 10) : ''}
                            max={academicYearEnd ? academicYearEnd.toISOString().slice(0, 10) : ''}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="form-control radius-8"
                            value={formData.endDate.toISOString().slice(0, 10)}
                            onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                            min={academicYearStart ? academicYearStart.toISOString().slice(0, 10) : ''}
                            max={academicYearEnd ? academicYearEnd.toISOString().slice(0, 10) : ''}
                          />
                        </div>


                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Label
                          </label>
                          <div className="d-flex flex-wrap gap-3">
                            {eventCategories.map(category => (
                              <div key={category.value} className="form-check d-flex align-items-center">
                                <input
                                  className="form-check-input me-0"
                                  type="radio"
                                  name="eventLabel"
                                  id={category.value}
                                  value={category.value}
                                  checked={formData.category === category.value}
                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                  style={{ display: 'none' }}
                                />
                                <label className="form-check-label d-flex align-items-center gap-2 cursor-pointer" htmlFor={category.value}>
                                  <span
                                    className="radio-dot"
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      backgroundColor: category.color,
                                      border: formData.category === category.value ? `3px solid ${category.color}` : '2px solid #e5e7eb',
                                      boxShadow: formData.category === category.value ? `0 0 0 2px white, 0 0 0 4px ${category.color}30` : 'none'
                                    }}
                                  ></span>
                                  <span className="fw-medium text-dark">{category.label}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Description
                          </label>
                          <textarea
                            className="form-control radius-8"
                            rows="4"
                            placeholder="Write some text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          ></textarea>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                        <button
                          type="button"
                          className="btn btn-outline-secondary radius-8 px-20 py-11"
                          onClick={() => setShowAddModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary radius-8 px-20 py-11"
                          onClick={handleAddEvent}
                          disabled={!formData.title.trim()}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Event Modal */}
            {showViewModal && selectedEvent && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0 d-flex align-items-center justify-content-between">
                      <h1 className="modal-title fs-5 fw-semibold">View Details</h1>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowViewModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body p-24">
                      <div className="mb-20">
                        <h6 className="text-md fw-normal mb-2 text-secondary-light">Title</h6>
                        <h5 className="fw-semibold text-primary-light mb-0">{selectedEvent.title}</h5>
                      </div>

                      <div className="mb-20">
                        <h6 className="text-md fw-normal mb-2 text-secondary-light">Start Date</h6>
                        <p className="text-primary-light fw-medium mb-0">
                          {new Date(selectedEvent.start).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="mb-20">
                        <h6 className="text-md fw-normal mb-2 text-secondary-light">End Date</h6>
                        <p className="text-primary-light fw-medium mb-0">
                          {selectedEvent.end ? (
                            <>
                              {new Date(selectedEvent.end).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </>
                          ) : 'N/A'}
                        </p>
                      </div>

                      <div className="mb-20">
                        <h6 className="text-md fw-normal mb-2 text-secondary-light">Description</h6>
                        <p className="text-primary-light fw-medium mb-0">
                          {selectedEvent.description || 'N/A'}
                        </p>
                      </div>

                      <div className="mb-20">
                        <h6 className="text-md fw-normal mb-2 text-secondary-light">Label</h6>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="badge rounded-circle p-0 d-inline-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: selectedEvent.backgroundColor,
                              width: '8px',
                              height: '8px'
                            }}
                          ></span>
                          <span className="fw-semibold text-primary-light">
                            {eventCategories.find(cat => cat.value === selectedEvent.category)?.label || 'Business'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Event Modal */}
            {showEditModal && selectedEvent && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                      <h1 className="modal-title fs-5">Edit Event</h1>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowEditModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body p-24">
                      <div className="row gy-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Event Title <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control radius-8"
                            placeholder="Enter Event Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="form-control radius-8"
                            value={formData.startDate.toISOString().slice(0, 10)}
                            onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                            min={academicYearStart ? academicYearStart.toISOString().slice(0, 10) : ''}
                            max={academicYearEnd ? academicYearEnd.toISOString().slice(0, 10) : ''}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="form-control radius-8"
                            value={formData.endDate.toISOString().slice(0, 10)}
                            onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                            min={academicYearStart ? academicYearStart.toISOString().slice(0, 10) : ''}
                            max={academicYearEnd ? academicYearEnd.toISOString().slice(0, 10) : ''}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Label
                          </label>
                          <div className="d-flex flex-wrap gap-3">
                            {eventCategories.map(category => (
                              <div key={category.value} className="form-check d-flex align-items-center">
                                <input
                                  className="form-check-input me-0"
                                  type="radio"
                                  name="eventLabelEdit"
                                  id={`${category.value}Edit`}
                                  value={category.value}
                                  checked={formData.category === category.value}
                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                  style={{ display: 'none' }}
                                />
                                <label className="form-check-label d-flex align-items-center gap-2 cursor-pointer" htmlFor={`${category.value}Edit`}>
                                  <span
                                    className="radio-dot"
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      backgroundColor: category.color,
                                      border: formData.category === category.value ? `3px solid ${category.color}` : '2px solid #e5e7eb',
                                      boxShadow: formData.category === category.value ? `0 0 0 2px white, 0 0 0 4px ${category.color}30` : 'none'
                                    }}
                                  ></span>
                                  <span className="fw-medium text-dark">{category.label}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Description
                          </label>
                          <textarea
                            className="form-control radius-8"
                            rows="4"
                            placeholder="Write some text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          ></textarea>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                        <button
                          type="button"
                          className="btn btn-outline-secondary radius-8 px-20 py-11"
                          onClick={() => setShowEditModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary radius-8 px-20 py-11"
                          onClick={handleEditEvent}
                          disabled={!formData.title.trim()}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedEvent && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-sm modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-body p-24 text-center">
                      <div className="mb-3">
                        <Icon icon="hugeicons:delete-02" className="text-danger" width="30" height="30" />
                      </div>
                      <h5 className="fw-semibold text-primary-light mb-3">Are you sure you want to delete this event</h5>
                      <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-secondary radius-8 px-20 py-11"
                          onClick={() => setShowDeleteModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger radius-8 px-20 py-11"
                          onClick={handleDeleteEvent}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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

export default AcademicCalendar;
