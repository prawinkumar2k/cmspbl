import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import {
    Book, FileText, Download, ExternalLink,
    Search, Filter, Plus, Clock,
    CheckCircle2, AlertCircle, Bookmark
} from 'lucide-react';
import "../components/css/studentDashboard.css";

const LearningResources = () => {
    const [activeTab, setActiveTab] = useState('notes');

    const notes = [
        { title: 'Unit 2: Fourier Transforms', subject: 'Maths', date: '28 Jan 2026', type: 'PDF', staff: 'Dr. Sarah Wilson' },
        { title: 'Semiconductor Physics Notes', subject: 'Physics', date: '25 Jan 2026', type: 'PPTX', staff: 'Prof. John Doe' },
        { title: 'C Programming Lab Manual', subject: 'CS', date: '20 Jan 2026', type: 'DOCX', staff: 'Mr. Robert Fox' },
        { title: 'Thermodynamics Formulas', subject: 'Physics', date: '18 Jan 2026', type: 'PDF', staff: 'Prof. John Doe' },
    ];

    const assignments = [
        { title: 'Analysis of Algorithms', subject: 'CS', due: '05 Feb', status: 'Pending', priority: 'High' },
        { title: 'Linear Algebra Problems', subject: 'Maths', due: '08 Feb', status: 'Pending', priority: 'Med' },
        { title: 'Optics Assignment', subject: 'Physics', due: '30 Jan', status: 'Completed', priority: 'High' },
    ];

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">

                    <div className="dashboard-header d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5>Learning Resources</h5>
                            <p><Book size={16} /> Access prescribed study materials and manage your active tasks.</p>
                        </div>
                        <div className="d-flex bg-white rounded-4 p-1 shadow-sm border">
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`btn btn-sm px-4 py-2 rounded-3 fw-bold transition-all ${activeTab === 'notes' ? 'btn-primary shadow-sm' : 'text-muted'}`}
                            >
                                Teacher Notes
                            </button>
                            <button
                                onClick={() => setActiveTab('homework')}
                                className={`btn btn-sm px-4 py-2 rounded-3 fw-bold transition-all ${activeTab === 'homework' ? 'btn-primary shadow-sm' : 'text-muted'}`}
                            >
                                Homework
                            </button>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        {/* Search & Filter Bar */}
                        <div className="col-12">
                            <div className="premium-card p-3">
                                <div className="row g-3">
                                    <div className="col-12 col-md-8 col-xl-6">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0"><Search size={18} className="text-muted" /></span>
                                            <input type="text" className="form-control border-start-0 ps-0" placeholder={`Search ${activeTab === 'notes' ? 'notes' : 'assignments'}...`} />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4 col-xl-2 ms-auto">
                                        <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-3">
                                            <Filter size={18} /> Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {activeTab === 'notes' ? (
                            <div className="col-12">
                                <div className="row g-4">
                                    {notes.map((note, i) => (
                                        <div key={i} className="col-12 col-md-6 col-xl-4">
                                            <div className="premium-card h-100 hover-translate-y">
                                                <div className="d-flex justify-content-between align-items-start mb-4">
                                                    <div className={`p-3 rounded-4 bg-${note.type === 'PDF' ? 'danger' : note.type === 'PPTX' ? 'warning' : 'primary'}-subtle text-${note.type === 'PDF' ? 'danger' : note.type === 'PPTX' ? 'warning' : 'primary'}`}>
                                                        <FileText size={28} />
                                                    </div>
                                                    <button className="btn btn-sm btn-icon rounded-circle hover-bg-light">
                                                        <Bookmark size={18} className="text-muted" />
                                                    </button>
                                                </div>
                                                <h6 className="fw-bold mb-2 line-clamp-2">{note.title}</h6>
                                                <div className="d-flex align-items-center gap-2 mb-4">
                                                    <span className="badge bg-light text-dark border px-2 py-1">{note.subject}</span>
                                                    <span className="text-xs text-muted fw-medium">{note.staff}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                                                    <span className="text-xs text-muted">{note.date}</span>
                                                    <button className="btn btn-primary btn-sm rounded-3 d-flex align-items-center gap-2 px-3">
                                                        <Download size={14} /> Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="col-12">
                                <div className="row g-4">
                                    {assignments.map((task, i) => (
                                        <div key={i} className="col-12 col-lg-6">
                                            <div className="premium-card h-100 border-start-0" style={{ borderLeft: `5px solid ${task.status === 'Completed' ? '#10b981' : task.priority === 'High' ? '#ef4444' : '#f59e0b'}` }}>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="d-flex align-items-center gap-2 mb-2">
                                                            <span className="badge bg-light text-muted border">{task.subject}</span>
                                                            <span className={`text-xs fw-bold text-${task.status === 'Completed' ? 'success' : 'warning'}`}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                        <h5 className="fw-bold mb-1">{task.title}</h5>
                                                        <p className="text-muted text-sm mb-0 d-flex align-items-center gap-2">
                                                            <Clock size={14} /> Due by: <span className="fw-bold text-dark">{task.due} Feb, 11:59 PM</span>
                                                        </p>
                                                    </div>
                                                    {task.status === 'Completed' ? (
                                                        <CheckCircle2 size={32} className="text-success" />
                                                    ) : (
                                                        <div className="text-end">
                                                            <span className={`badge bg-${task.priority === 'High' ? 'danger' : 'warning'}-subtle text-${task.priority === 'High' ? 'danger' : 'warning'}-emphasis rounded-pill px-3`}>
                                                                {task.priority} Priority
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="d-flex gap-2 mt-4">
                                                    {task.status === 'Pending' ? (
                                                        <>
                                                            <button className="btn btn-primary rounded-3 flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                                                                <Plus size={18} /> Submit Now
                                                            </button>
                                                            <button className="btn btn-outline-primary rounded-3 py-2 px-3 fw-bold">
                                                                Details
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="btn btn-success-subtle text-success w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0">
                                                            <ExternalLink size={18} /> View Submission
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="col-12 mt-4 text-center">
                                        <div className="p-4 bg-light rounded-4 border border-dashed text-muted">
                                            <AlertCircle size={24} className="mb-2" />
                                            <p className="mb-0">Finished with your work? Great job! Keep it up.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <Footer />
            </div>
        </section>
    );
};

export default LearningResources;
