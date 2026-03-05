import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import {
    Bell, Newspaper, Info, Calendar,
    ArrowRight, MessageSquare, Share2, Heart,
    Bookmark, TrendingUp, Filter
} from 'lucide-react';
import "../components/css/studentDashboard.css";

const Noticeboard = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const notices = [
        {
            id: 1,
            title: 'Semester Results Announced',
            content: 'The results for the Nov-Dec 2025 examinations have been published online. Students can check their marks in the results section.',
            date: '30 Jan 2026',
            category: 'Academic',
            priority: 'High'
        },
        {
            id: 2,
            title: 'Inter-College Symposium',
            content: 'Registration is now open for the Annual Technical Symposium "TECHRON 2026". Interested teams should register by next week.',
            date: '28 Jan 2026',
            category: 'Events',
            priority: 'Med'
        },
        {
            id: 3,
            title: 'Library Maintenance Notice',
            content: 'The main library will be closed for maintenance on Sunday (01 Feb). Online resources will remain accessible.',
            date: '25 Jan 2026',
            category: 'Campus',
            priority: 'Low'
        }
    ];

    const newsItems = [
        {
            title: 'College Rank #1 in Zonal Sports',
            summary: 'Our college has secured the top position in the Inter-Zonal Sports Meet with 15 gold medals.',
            image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=400&auto=format&fit=crop',
            time: '2 hours ago',
            tags: ['Sports', 'Achievement']
        },
        {
            title: 'New AI Research Center Inaugurated',
            summary: 'Collaborative research center with tech giants to foster innovation in AI and Machine Learning.',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400&auto=format&fit=crop',
            time: '5 hours ago',
            tags: ['Research', 'Campus']
        }
    ];

    const categories = ['All', 'Academic', 'Events', 'Campus', 'Fees'];

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">

                    <div className="dashboard-header mb-4">
                        <h5>Noticeboard & News</h5>
                        <p><Bell size={16} /> Technical announcements and campus life updates in one place.</p>
                    </div>

                    <div className="row gy-4">
                        {/* Notices Column */}
                        <div className="col-12 col-xl-8">
                            <div className="premium-card mb-4 p-3 bg-light border-0">
                                <div className="d-flex gap-2 overflow-auto scrollbar-hide">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`btn btn-sm rounded-4 px-4 py-2 fw-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'btn-primary shadow-sm border-0' : 'btn-white border text-muted'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                    <button className="btn btn-sm btn-light border rounded-4 px-3 ms-auto d-flex align-items-center gap-2">
                                        <Filter size={14} /> Filter
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-4">
                                {notices.filter(n => activeCategory === 'All' || n.category === activeCategory).map(notice => (
                                    <div key={notice.id} className="premium-card hover-shadow transition-all border-hover-primary">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className={`badge bg-${notice.priority === 'High' ? 'danger' : notice.priority === 'Med' ? 'warning' : 'primary'}-subtle text-${notice.priority === 'High' ? 'danger' : notice.priority === 'Med' ? 'warning' : 'primary'}-emphasis rounded-pill px-3`}>
                                                    {notice.priority} Priority
                                                </span>
                                                <span className="text-xs text-muted fw-medium">• {notice.category}</span>
                                            </div>
                                            <span className="text-xs text-muted d-flex align-items-center gap-1"><Calendar size={12} /> {notice.date}</span>
                                        </div>
                                        <h5 className="fw-bold text-dark mb-2">{notice.title}</h5>
                                        <p className="text-muted text-sm mb-4 leading-relaxed">{notice.content}</p>
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                            <div className="d-flex gap-3">
                                                <button className="btn btn-icon-sm text-muted hover-text-primary p-0 d-flex align-items-center gap-1">
                                                    <MessageSquare size={16} /> <span className="text-xs">12</span>
                                                </button>
                                                <button className="btn btn-icon-sm text-muted hover-text-danger p-0 d-flex align-items-center gap-1">
                                                    <Heart size={16} /> <span className="text-xs">45</span>
                                                </button>
                                            </div>
                                            <button className="btn btn-link btn-sm text-decoration-none p-0 d-flex align-items-center gap-1 fw-bold">
                                                Read More <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* News Feed Column */}
                        <div className="col-12 col-xl-4">
                            <div className="premium-card h-100">
                                <div className="card-title-area mb-4">
                                    <h6>Campus News</h6>
                                    <h6 className="text-primary text-xs cursor-pointer d-flex align-items-center gap-1">
                                        View All <TrendingUp size={12} />
                                    </h6>
                                </div>
                                <div className="d-flex flex-column gap-4">
                                    {newsItems.map((item, i) => (
                                        <div key={i} className="news-card">
                                            <div className="rounded-4 overflow-hidden mb-3 position-relative" style={{ height: '160px' }}>
                                                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover transition-all hover-scale" />
                                                <div className="position-absolute bottom-0 start-0 p-3 w-100 bg-gradient-dark">
                                                    <div className="d-flex gap-2">
                                                        {item.tags.map(tag => (
                                                            <span key={tag} className="badge bg-primary text-xs rounded-pill">{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <h6 className="fw-bold mb-2 h-over-primary transition-all cursor-pointer">{item.title}</h6>
                                            <p className="text-muted text-xs line-clamp-2 mb-2">{item.summary}</p>
                                            <div className="d-flex justify-content-between align-items-center text-xs text-muted mb-4 border-bottom pb-3">
                                                <span>{item.time}</span>
                                                <div className="d-flex gap-2">
                                                    <Share2 size={13} className="cursor-pointer hover-text-primary" />
                                                    <Bookmark size={13} className="cursor-pointer hover-text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 rounded-4 bg-primary text-white text-center mt-2 shadow-sm">
                                    <Newspaper size={32} className="mb-3 opacity-75" />
                                    <h6 className="fw-bold mb-2">Subscribe to Press</h6>
                                    <p className="text-xs text-white text-opacity-75 mb-4">Get the latest campus magazine delivered weekly.</p>
                                    <button className="btn btn-white btn-sm w-100 rounded-3 fw-bold text-primary py-2 transition-all hover-translate-y">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
            <style>{`
                .bg-gradient-dark {
                    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
                }
                .hover-scale:hover {
                    transform: scale(1.1);
                }
                .h-over-primary:hover {
                    color: #3b82f6 !important;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .leading-relaxed {
                    line-height: 1.625;
                }
            `}</style>
        </section>
    );
};

export default Noticeboard;
