import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { Users, Star, Phone } from 'react-feather';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../../../../components/css/CallerDetails.css';



/* ---------------- Arrow ---------------- */
function CarouselArrow({ direction, onClick }) {
  return (
    <button
      className={`carousel-arrow ${direction}`}
      onClick={onClick}
      aria-label={direction}
      type="button"
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

/* ---------------- MAIN ---------------- */

const CallerDetails = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [callers, setCallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCallers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/callers');
        if (!res.ok) throw new Error('Failed to fetch caller details');
        const data = await res.json();
        setCallers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCallers();
  }, []);

  // Map DB fields to UI fields
  const mappedCallers = callers.map((c, idx) => ({
    id: c.staff_id || idx,
    name: c.staff_name,
    role: c.staff_department || 'Caller',
    phone: c.staff_mobile,
    assignedLeads: c.total_students ?? 0,
    conversionRate: c.conversion_percentage ?? 0,
    totalCalls: c.total_calls ?? 0
  }));

  const filteredCallers = mappedCallers.filter(c =>
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm))
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3.2,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    arrows: true,
    prevArrow: <CarouselArrow direction="left" />,
    nextArrow: <CarouselArrow direction="right" />,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 3 } },
      { breakpoint: 1280, settings: { slidesToShow: 2.5 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1.1 } }
    ]
  };

  return (
    <section className="overlay">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-body">

          {/* Header */}
          <div className="dashboard-header mb-6">
            <h6 className="fw-semibold mb-1">Caller Team Management</h6>
            <p className="text-secondary flex items-center gap-2">
              <Users size={16} />
              Manage and monitor your calling team performance
            </p>
          </div>

          {/* Search */}
          <div className="chart-card mb-6">
            <div className="search-box">
              <Phone size={18} />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="search-count">
              {loading ? (
                'Loading...'
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <>
                  Showing <span>{filteredCallers.length}</span> of{' '}
                  <span>{mappedCallers.length}</span> callers
                </>
              )}
            </p>
          </div>
          {/* Carousel */}
          <div className="content-wrapper">
            <div className="carousel-wrapper">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <Slider {...sliderSettings}>
                  {filteredCallers.map(caller => (
                    <div key={caller.id} className="caller-slide">
                      <div className="caller-card">
                        <div className="caller-header">
                          <h6>{caller.name}</h6>
                          <p>
                            <Star size={14} className="gold-star" />
                            {caller.role}
                          </p>
                        </div>
                        <a href={`tel:${caller.phone}`} className="caller-phone">
                          <Phone size={12} />
                          {caller.phone}
                        </a>
                        <div className="caller-stats">
                          <div className="caller-stat-box stat-box-blue">
                            <label>Assigned Leads</label>
                            <strong>{caller.assignedLeads}</strong>
                          </div>
                          <div className="caller-stat-box stat-box-green">
                            <label>Conversion</label>
                            <strong>{caller.conversionRate}%</strong>
                          </div>
                        </div>
                        <div className="caller-stat-box stat-box-purple">
                          <label>Total Calls</label>
                          <strong>{caller.totalCalls}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </section>
  );
};

export default CallerDetails;
