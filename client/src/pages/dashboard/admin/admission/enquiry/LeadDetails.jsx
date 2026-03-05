import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { StatusBadge } from "../../../../../components/StatusBadge";
import { WhatsAppButton } from "../../../../../components/WhatsAppButton";
import { Button } from "../../../../../components/ui/button.jsx";
import { toast, ToastContainer } from 'react-toastify';
import {
  ArrowLeft,
  Phone,
  Plus,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  User,
  MapPin,
  Home,
  GraduationCap,
  BookOpen,
  Users,
  Building,
  Car,
  Bed,
  Hash,
  FileText,
  Tag,
  UserCheck,
  PhoneCall,
  Mail,
} from "lucide-react";
import { Clipboard } from "react-feather";
import "../../../../../components/css/LeadDetails.css";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddNote, setShowAddNote] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [callNote, setCallNote] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0],
    callerName: "",
    outcome: "",
    notes: "",
    nextFollowUp: "",
  });

  // Fetch lead data from API
  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leadManagement/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lead details');
        }
        const data = await response.json();
        setLead(data);
        setNewStatus(data.status);
        setError(null);
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLead();
    }
  }, [id]);

  // Update lead function
  const updateLead = async (id, updatedLead) => {
    try {
      const response = await fetch(`/api/leadManagement/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLead),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead on server');
      }

      // Update local state
      setLead(prev => ({ ...prev, ...updatedLead }));
    } catch (err) {
      console.error('Error updating lead:', err);
      throw err;
    }
  };

  // Add call note function (now posts to backend)
  const addCallNote = async (leadId, callNote) => {
    try {
      const response = await fetch(`/api/leadManagement/${leadId}/call-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff_id: lead.staff_id,
          staff_name: lead.staff_name,
          tenant_id: lead.tenant_id,
          student_eqid: lead.student_eqid,
          student_name: lead.student_name,
          outcome: callNote.outcome,
          call_notes: callNote.notes,
          next_follow_up: callNote.nextFollowUp,
          call_note_date: callNote.date,
          call_note_time: callNote.time,
          role: lead.role || '',
        }),
      });
      if (!response.ok) {
        toast.error('Failed to save call note');
        throw new Error('Failed to save call note');
      }
      // Refetch lead to get updated callHistory
      const leadRes = await fetch(`/api/leadManagement/${leadId}`);
      if (leadRes.ok) {
        const updatedLead = await leadRes.json();
        setLead(updatedLead);
        toast.success('Call note saved successfully!');
      }
    } catch (err) {
      toast.error('Failed to save call note: ' + err.message);
    }
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-content">
            <div className="loading-state">
              <h3>Loading lead details...</h3>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  if (error || !lead) {
    return (
      <>
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-content">
            <div className="empty-state">
              <h3>{error ? `Error: ${error}` : 'Lead Not Found'}</h3>
              <Link to="/admin/admission/enquiry/LeadManagement">
                <Button>Back to Leads</Button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!callNote.callerName || !callNote.outcome) return;
    await addCallNote(lead.student_eqid, callNote);
    setCallNote({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0],
      callerName: "",
      outcome: "",
      notes: "",
      nextFollowUp: "",
    });
    setShowAddNote(false);
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setCallNote(prev => ({
      ...prev,
      [name]: value
    }));
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

            {/* HEADER */}
            <div className="d-flex align-items-start gap-3 mb-4">

              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="
      d-flex align-items-center justify-content-center
      rounded-3 border-0 bg-white
      shadow-sm
      hover:bg-primary-subtle
      transition
    "
                style={{ width: 36, height: 36 }}
              >
                <ArrowLeft size={16} className="text-primary" />
              </button>

              {/* Title + Subtitle */}
              <div>
                <h6 className="fw-bold mb-1 text-dark fs-4">
                  Lead Details
                </h6>
                <p className="mb-0 text-secondary d-flex align-items-center gap-2 small">
                  <TrendingUp size={16} className="text-primary" />
                  Comprehensive lead information and call history
                </p>
              </div>
            </div>

            <div className="lead-details-container">
              {/* Hero Section */}
              <div className="raj-section">
                <div className="raj-content">
                  <div className="raj-header">
                    <div className="raj-avatar">
                      <User size={32} />
                    </div>
                    <div className="raj-info">
                      <h6 className="raj-name" style={{ fontSize: 32, fontWeight: 600, margin: 0 }}>{lead.student_name}</h6>
                      <div className="raj-meta" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="raj-id">EQID: {lead.student_eqid}</span>
                        <span className="raj-separator" style={{ fontSize: 18, color: '#c7d2fe', opacity: 0.7, margin: '0 8px' }}>•</span>
                        <span className="raj-reg">Reg: {lead.student_reg_no}</span>
                      </div>
                      <div className="raj-meta" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#e0e7ff', opacity: 0.95 }}>
                        <span className="raj-id">Tenant Role: <span>{lead.tenant_id || '-'}</span></span>
                        <span className="raj-separator" >•</span>
                        <span className="raj-reg">Tenant Name: <span>{lead.staff_name || '-'}</span></span>
                        <span className="raj-separator" >•</span>
                        <span className="raj-reg">ID: <span>{lead.staff_id || '-'}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="raj-actions">
                    <StatusBadge status={lead.status} />
                    <div className="action-buttons">
                      <WhatsAppButton phone={lead.student_mobile} studentName={lead.student_name} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Cards Grid */}
              <div className="info-cards-grid mt-24">
                {/* Personal Information Card */}
                <div className="info-card">
                  <div className="cards-header">
                    <span className="card-icon"><User size={22} /></span>
                    <span className="cards-header-title">Personal Information</span>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <div className="info-item">
                        <label>Full Name</label>
                        <span>{lead.student_name || '-'}</span>
                      </div>
                      <div className="info-item">
                        <label>Mobile Number</label>
                        <span>{lead.student_mobile || '-'}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-item">
                        <label>Address</label>
                        <span>{lead.student_address || '-'}</span>
                      </div>
                      <div className="info-item">
                        <label>District</label>
                        <span>{lead.student_district || '-'}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-item">
                        <label>Community</label>
                        <span>{lead.student_community || '-'}</span>
                      </div>
                      <div className="info-item">
                        <label>Registration No</label>
                        <span>{lead.student_reg_no || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Information Card */}
                <div className="info-card">
                  <div className="cards-header">
                    <span className="card-icon"><Users size={22} /></span>
                    <span className="cards-header-title">Parent Information</span>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <div className="info-item">
                        <label>Parent Name</label>
                        <span>{lead.parent_name || '-'}</span>
                      </div>
                      <div className="info-item">
                        <label>Parent Mobile</label>
                        <span>{lead.parent_mobile || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information Card */}
                <div className="info-card">
                  <div className="cards-header">
                    <span className="card-icon"><BookOpen size={22} /></span>
                    <span className="cards-header-title">Academic Information</span>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <div className="info-item">
                        <label>School Type</label>
                        <span>{lead.school_type || '-'}</span>
                      </div>
                      <div className="info-item">
                        <label>Standard</label>
                        <span>{lead.standard || '-'}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-item full-width">
                        <label>School Address</label>
                        <span>{lead.school_address || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admission Preferences Card */}
                <div className="info-card">
                  <div className="cards-header">
                    <span className="card-icon"><Clipboard size={22} /></span>
                    <span className="cards-header-title">Admission Preferences</span>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <div className="info-item">
                        <label>Requested Department</label>
                        <span>{lead.department || '-'}</span>
                      </div>
                      <div className="info-item">
                        <label>Source</label>
                        <span>{lead.source || '-'}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-item">
                        <label>Transport Required</label>
                        <span>{lead.transport || '-'}</span>
                      </div>
                      <div className="info-item">
                        <label>Hostel Required</label>
                        <span>{lead.hostel || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call History and Quick Stats Row */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="call-card">
                    <div className="call-header">
                      <h6 className="fw-bold text-dark fs-6">Call History</h6>
                      <Button
                        onClick={() => setShowAddNote(!showAddNote)}
                      >
                        <Plus size={16} />
                        Add Call Note
                      </Button>
                    </div>

                    {/* Add Call Note Form */}
                    {showAddNote && (
                      <div className="add-callnote-wrapper">

                        <h6 className="fw-bold text-dark fs-6">Add Call Note</h6>

                        <form onSubmit={handleAddNote}>

                          {/* DATE & TIME */}
                          <div className="row g-4 mb-3">
                            <div className="col-12 col-lg-6">
                              <div className="input-group-custom">
                                <label>Date <span className="text-danger">*</span></label>
                                <input
                                  type="date"
                                  name="date"
                                  value={callNote.date}
                                  onChange={handleNoteChange}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-lg-6">
                              <div className="input-group-custom">
                                <label>Time <span className="text-danger">*</span></label>
                                <input
                                  type="time"
                                  name="time"
                                  value={callNote.time}
                                  onChange={handleNoteChange}
                                />
                              </div>
                            </div>
                          </div>

                          {/* CALLER & OUTCOME */}
                          <div className="row g-4 mb-3">
                            <div className="col-12 col-lg-6">
                              <div className="input-group-custom">
                                <label>Caller Name <span className="text-danger">*</span></label>
                                <input
                                  type="text"
                                  name="callerName"
                                  placeholder="Your name"
                                  value={callNote.callerName}
                                  onChange={handleNoteChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="col-12 col-lg-6">
                              <div className="input-group-custom">
                                <label>Outcome <span className="text-danger">*</span></label>
                                <select
                                  name="outcome"
                                  value={callNote.outcome}
                                  onChange={handleNoteChange}
                                  required
                                >
                                  <option value="">Select outcome</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Interested">Interested</option>
                                  <option value="Closed">Closed</option>
                                  <option value="Forwarded">Forwarded</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* NOTES */}
                          <div className="input-group-custom mb-3">
                            <label>Notes <span className="text-danger">*</span></label>
                            <textarea
                              rows="4"
                              name="notes"
                              placeholder="Call notes..."
                              value={callNote.notes}
                              onChange={handleNoteChange}
                            />
                          </div>

                          {/* FOLLOW UP */}
                          <div className="row g-4 mb-4">
                            <div className="col-12">
                              <div className="input-group-custom">
                                <label>Next Follow-up Date</label>
                                <input
                                  type="date"
                                  name="nextFollowUp"
                                  value={callNote.nextFollowUp}
                                  onChange={handleNoteChange}
                                />
                              </div>
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="form-actions">
                            <button type="submit" className="save-btn">
                              Save Note
                            </button>

                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() => setShowAddNote(false)}
                            >
                              Cancel
                            </button>
                          </div>

                        </form>
                      </div>
                    )}


                    {lead.callHistory.map((call, i) => (
                      <div className="timeline-item" key={i}>
                        <div>
                          <div className="timeline-dot">{i + 1}</div>
                          {i !== lead.callHistory.length - 1 && (
                            <div className="timeline-line" />
                          )}
                        </div>
                        <div className="call-note">
                          <div className="call-note-header">
                            <span className="call-note-name">
                              {call.callerName}
                            </span>
                            <span className="call-note-date">
                              <Calendar size={12} /> {call.date}
                            </span>
                          </div>
                          <p>{call.notes}</p>
                          {call.nextFollowUp && (
                            <div className="followup">
                              <Clock size={14} /> Next: {call.nextFollowUp}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}
