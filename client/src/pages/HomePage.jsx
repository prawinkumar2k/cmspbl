import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const modules = [
    {
      icon: 'solar:document-text-bold-duotone',
      title: 'Master Management',
      description: 'Comprehensive master data management for branches, courses, subjects, staff, and academic calendars.',
      features: ['Branch Management', 'Course & Subject Allocation', 'Staff Details', 'Academic Calendar', 'Fee Master'],
      color: 'bg-primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: 'solar:user-id-bold-duotone',
      title: 'Student Management',
      description: 'End-to-end student lifecycle management from enquiry to alumni with comprehensive tracking.',
      features: ['Student Enquiry', 'Admission Process', 'Student Records', 'Photo Management', 'Transfer Certificate'],
      color: 'bg-success',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: 'solar:calendar-mark-bold-duotone',
      title: 'Academic Module',
      description: 'Complete academic operations including attendance tracking, assessments, and performance monitoring.',
      features: ['Daily Attendance', 'Assignment Management', 'Unit Test Marks', 'Practical Assessment', 'Attendance Reports'],
      color: 'bg-info',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: 'solar:document-add-bold-duotone',
      title: 'Examination',
      description: 'Streamlined examination management with data submission, strength lists, and hall allocation.',
      features: ['College Strength', 'Time Table', 'QP Requirement', 'Nominal Roll', 'Checklist'],
      color: 'bg-warning',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: 'solar:wallet-money-bold-duotone',
      title: 'Fee Management',
      description: 'Complete fee collection and accounting system with challan generation and ledger management.',
      features: ['Fee Collection', 'Challan Generation', 'Fee Ledger', 'Course Fees', 'Exam Fees'],
      color: 'bg-danger',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    {
      icon: 'solar:box-bold-duotone',
      title: 'Office Administration',
      description: 'Comprehensive office management including stock, assets, letters, and cash book.',
      features: ['Stock Management', 'Asset Tracking', 'Letter Management', 'Cash Book', 'Purchase Entry'],
      color: 'bg-purple',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      icon: 'solar:wallet-bold-duotone',
      title: 'Payroll System',
      description: 'Automated payroll processing with comprehensive salary management and reporting.',
      features: ['Staff Payroll', 'Salary Reports', 'Deductions', 'Allowances', 'Pay Slips'],
      color: 'bg-cyan',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      icon: 'solar:chart-2-bold-duotone',
      title: 'Reports & Analytics',
      description: 'Powerful reporting and analytics dashboard for data-driven decision making.',
      features: ['Performance Reports', 'Attendance Analytics', 'Financial Reports', 'Custom Reports', 'Export Options'],
      color: 'bg-dark',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ];

  const features = [
    {
      icon: 'solar:shield-check-bold-duotone',
      title: 'Secure & Reliable',
      description: 'College-grade security with role-based access control and data encryption.'
    },
    {
      icon: 'solar:cloud-bold-duotone',
      title: 'Cloud-Based',
      description: 'Access your CMS system anywhere, anytime with cloud infrastructure.'
    },
    {
      icon: 'solar:smartphone-bold-duotone',
      title: 'Mobile Responsive',
      description: 'Fully responsive design that works seamlessly on all devices.'
    },
    {
      icon: 'solar:chart-2-bold-duotone',
      title: 'Real-Time Analytics',
      description: 'Get instant insights with powerful dashboards and reports.'
    },
    {
      icon: 'solar:users-group-rounded-bold-duotone',
      title: 'Multi-User Support',
      description: 'Collaborative platform supporting multiple users and roles.'
    },
    {
      icon: 'solar:settings-bold-duotone',
      title: 'Customizable',
      description: 'Flexible system that adapts to your institution\'s specific needs.'
    }
  ];

  return (
    <div className="homepage-wrapper">
      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <Icon icon="solar:book-bold-duotone" className="text-2xl me-2" style={{ color: '#667eea' }} />
            <span className="fw-bold fs-4">SF CMS</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <Icon icon="solar:hamburger-menu-bold" className="text-2xl" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#modules">Modules</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#benefits">Benefits</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item ms-lg-3">
                <Link to="/login" className="btn btn-primary btn-sm px-4">
                  <Icon icon="solar:login-3-bold" className="me-2" />
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-gradient-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-grid"></div>
        <div className="container">
          <div className="row align-items-center hero-row">
            <div className="col-lg-6 hero-content">
              <div className="badge-glow mb-4">
                <Icon icon="solar:star-bold" className="me-2" />
                Complete CMS Solution
              </div>
              <h1 className="hero-title mb-4">
                Transform Your <br />
                <span className="text-gradient-animated">Educational</span><br />
                Institution
              </h1>
              <p className="hero-description mb-5">
                Comprehensive Campus Management System designed specifically for educational institutions.
                Manage students, staff, academics, examinations, and finances all in one powerful platform.
              </p>
              <div className="d-flex gap-3 flex-wrap mb-5">
                <Link to="/login" className="btn-gradient btn-lg">
                  <Icon icon="solar:rocket-2-bold" className="me-2" />
                  Get Started
                  <div className="btn-shine"></div>
                </Link>
                <a href="#modules" className="btn-glass btn-lg">
                  <Icon icon="solar:eye-bold" className="me-2 text-xl" />
                  Explore Modules
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-illustration-wrapper">
                <div className="glow-effect"></div>
                <div className="floating-card card-1">
                  <div className="card-glow"></div>
                  <Icon icon="solar:user-id-bold-duotone" className="card-icon" />
                  <p className="card-text">Student Management</p>
                </div>
                <div className="floating-card card-2">
                  <div className="card-glow"></div>
                  <Icon icon="solar:calendar-mark-bold-duotone" className="card-icon" />
                  <p className="card-text">Attendance Tracking</p>
                </div>
                <div className="floating-card card-3">
                  <div className="card-glow"></div>
                  <Icon icon="solar:wallet-money-bold-duotone" className="card-icon" />
                  <p className="card-text">Fee Management</p>
                </div>
                <div className="hero-main-card">
                  <div className="main-card-glow"></div>
                  <div className="particles">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <Icon icon="solar:chart-2-bold-duotone" className="main-card-icon" />
                  <h4 className="main-card-title">Complete CMS System</h4>
                  <p className="main-card-subtitle">All-in-one solution for your institution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-gradient py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="badge badge-primary mb-3">Features</div>
            <h2 className="display-5 fw-bold mb-3">Why Choose SF CMS?</h2>
            <p className="lead text-muted">Powerful features designed for modern educational institutions</p>
          </div>
          <div className="row g-4">
            {features.map((feature, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className="feature-card h-100">
                  <div className="feature-icon mb-3">
                    <Icon icon={feature.icon} className="text-2xl" />
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="section-dark py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="badge badge-success mb-3">Comprehensive Modules</div>
            <h2 className="display-5 fw-bold mb-3">Complete System Modules</h2>
            <p className="lead text-muted">Everything you need to manage your institution efficiently</p>
          </div>
          <div className="row g-4">
            {modules.map((module, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div
                  className="module-card h-100"
                  style={{ '--module-gradient': module.gradient }}
                  onMouseEnter={() => setActiveModule(idx)}
                >
                  <div className="module-icon mb-3">
                    <Icon icon={module.icon} className="text-2xl" />
                  </div>
                  <h4 className="fw-bold mb-3">{module.title}</h4>
                  <p className="text-muted mb-3">{module.description}</p>
                  <ul className="module-features">
                    {module.features.map((feature, fidx) => (
                      <li key={fidx}>
                        <Icon icon="solar:check-circle-bold" className="me-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section-gradient py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="badge badge-warning mb-3">Benefits</div>
              <h2 className="display-5 fw-bold mb-4">Streamline Your Institution's Operations</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Icon icon="solar:clock-circle-bold-duotone" className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Save Time</h5>
                    <p className="text-muted mb-0">Automate repetitive tasks and reduce manual work by up to 70%</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Icon icon="solar:money-bag-bold-duotone" className="text-2xl text-success" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Reduce Costs</h5>
                    <p className="text-muted mb-0">Eliminate paperwork and optimize resource allocation</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Icon icon="solar:chart-square-bold-duotone" className="text-2xl text-info" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Better Insights</h5>
                    <p className="text-muted mb-0">Make data-driven decisions with real-time analytics</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Icon icon="solar:shield-check-bold-duotone" className="text-2xl text-warning" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Enhanced Security</h5>
                    <p className="text-muted mb-0">Protect sensitive data with college-grade security</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="benefits-illustration">
                <div className="stats-grid">
                  <div className="stat-box">
                    <Icon icon="solar:user-check-rounded-bold-duotone" className="text-2xl text-primary mb-2" />
                    <h3 className="fw-bold mb-1">98%</h3>
                    <p className="text-muted small mb-0">User Satisfaction</p>
                  </div>
                  <div className="stat-box">
                    <Icon icon="solar:clock-circle-bold-duotone" className="text-2xl text-success mb-2" />
                    <h3 className="fw-bold mb-1">70%</h3>
                    <p className="text-muted small mb-0">Time Saved</p>
                  </div>
                  <div className="stat-box">
                    <Icon icon="solar:chart-square-bold-duotone" className="text-2xl text-info mb-2" />
                    <h3 className="fw-bold mb-1">50%</h3>
                    <p className="text-muted small mb-0">Cost Reduction</p>
                  </div>
                  <div className="stat-box">
                    <Icon icon="solar:shield-star-bold-duotone" className="text-2xl text-warning mb-2" />
                    <h3 className="fw-bold mb-1">100%</h3>
                    <p className="text-muted small mb-0">Data Security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <Icon icon="solar:rocket-2-bold-duotone" className="text-2xl mb-4" style={{ color: 'white' }} />
              <h2 className="display-4 fw-bold mb-4 text-white">Ready to Transform Your Institution?</h2>
              <p className="lead mb-4 text-white-50">
                Join hundreds of institutions already using SF CMS to streamline their operations
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/login" className="btn btn-light btn-lg px-5 py-3">
                  <Icon icon="solar:login-3-bold" className="me-2 text-xl" />
                  Start Now
                </Link>
                <a href="#contact" className="btn btn-outline-light btn-lg px-5 py-3">
                  <Icon icon="solar:letter-bold" className="me-2 text-xl" />
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-dark py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <div className="badge badge-info mb-3">Contact Us</div>
                <h2 className="display-5 fw-bold mb-3">Get in Touch</h2>
                <p className="lead text-muted">Have questions? We'd love to hear from you</p>
              </div>
              <div className="row g-4">
                <div className="col-md-4 text-center">
                  <div className="contact-card">
                    <Icon icon="solar:letter-bold-duotone" className="text-2xl text-primary mb-3" />
                    <h5 className="fw-bold mb-2">Email</h5>
                    <p className="text-muted mb-0">info@sfcms.com</p>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="contact-card">
                    <Icon icon="solar:phone-bold-duotone" className="text-2xl text-success mb-3" />
                    <h5 className="fw-bold mb-2">Phone</h5>
                    <p className="text-muted mb-0">+91 1234567890</p>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="contact-card">
                    <Icon icon="solar:map-point-bold-duotone" className="text-2xl text-warning mb-3" />
                    <h5 className="fw-bold mb-2">Erode</h5>
                    <p className="text-muted mb-0">Erode, Tamil Nadu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="d-flex align-items-center mb-3">
                <Icon icon="solar:book-bold-duotone" className="text-2xl me-2" style={{ color: '#667eea' }} />
                <span className="fw-bold fs-4">SF CMS</span>
              </div>
              <p className="text-muted">
                Complete College Management Software for educational institutions.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="social-icon">
                  <Icon icon="tabler-brand-facebook" />
                </a>
                <a href="#" className="social-icon">
                  <Icon icon="tabler-brand-twitter" />
                </a>
                <a href="#" className="social-icon">
                  <Icon icon="tabler-brand-linkedin" />
                </a>
                <a href="#" className="social-icon">
                  <Icon icon="tabler-brand-instagram" />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-4 mb-lg-0">
              <h6 className="fw-bold mb-3">Product</h6>
              <ul className="list-unstyled footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#modules">Modules</a></li>
                <li><a href="#benefits">Benefits</a></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-4 mb-lg-0">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-4 mb-lg-0">
              <h6 className="fw-bold mb-3">Resources</h6>
              <ul className="list-unstyled footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="fw-bold mb-3">Legal</h6>
              <ul className="list-unstyled footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">License</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-muted small mb-0">
                © 2025 SF CMS. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="text-muted small mb-0">
                Made with <Icon icon="solar:heart-bold" className="text-danger text-xl" /> for Education
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .homepage-wrapper {
          overflow-x: hidden;
          background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 50%, #f0f4ff 100%);
        }

        /* Navbar Styles */
        .navbar {
          transition: all 0.3s ease;
          padding: 1.5rem 0;
          z-index: 1000;
        }

        .navbar-transparent {
          background: transparent;
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(102, 126, 234, 0.15);
          border-bottom: 1px solid rgba(102, 126, 234, 0.1);
        }

        .navbar-brand {
          color: #2d3748 !important;
        }

        .nav-link {
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          transition: all 0.3s ease;
          color: #4a5568 !important;
        }

        .nav-link:hover {
          color: #667eea !important;
          transform: translateY(-2px);
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding-top: 120px;
          background: transparent;
        }

        .hero-gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float-orb 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(245, 87, 108, 0.2) 0%, transparent 70%);
          bottom: -150px;
          left: -100px;
          animation-delay: 7s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation-delay: 14s;
        }

        @keyframes float-orb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-50px, 50px) scale(0.9);
          }
        }

        .hero-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(102, 126, 234, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
        }

        .hero-row {
          min-height: calc(100vh - 120px);
          padding: 3rem 0;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          animation: fadeInUp 1s ease;
        }

        .badge-glow {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
          border: 1px solid rgba(102, 126, 234, 0.3);
          color: #667eea;
          font-weight: 600;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
          }
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          line-height: 1.1;
          color: #1a202c;
          animation: fadeInUp 1s ease 0.2s backwards;
        }

        .text-gradient-animated {
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #667eea);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 5s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .hero-description {
          font-size: 1.25rem;
          color: #4a5568;
          line-height: 1.8;
          max-width: 600px;
          animation: fadeInUp 1s ease 0.4s backwards;
        }

        .btn-gradient {
          position: relative;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease 0.6s backwards;
        }

        .btn-gradient:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 100%;
          }
        }

        .btn-glass {
          padding: 1rem 2.5rem;
          border: 2px solid #667eea;
          border-radius: 50px;
          background: white;
          backdrop-filter: blur(10px);
          color: #667eea;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease 0.6s backwards;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
        }

        .btn-glass:hover {
          background: #667eea;
          border-color: #667eea;
          transform: translateY(-3px);
          color: white;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .stats-wrapper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          animation: fadeInUp 1s ease 0.8s backwards;
        }

        .stat-card {
          background: white;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: fadeInScale 0.6s ease backwards;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .stat-card:hover {
          transform: translateY(-10px) scale(1.05);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          box-shadow: 0 20px 50px rgba(102, 126, 234, 0.35);
        }

        .stat-card:hover .stat-icon-wrapper {
          background: white;
          transform: scale(1.1);
        }

        .stat-card:hover .stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-card:hover .stat-value {
          -webkit-text-fill-color: white;
          color: white;
        }

        .stat-card:hover .stat-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .stat-icon-wrapper {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .stat-icon {
          font-size: 2rem;
          color: white;
          transition: all 0.3s ease;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #718096;
          margin: 0;
          transition: all 0.3s ease;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Hero Illustration */
        .hero-illustration-wrapper {
          position: relative;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeInUp 1s ease 0.4s backwards;
        }

        .glow-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.35) 0%, rgba(240, 147, 251, 0.25) 30%, rgba(79, 172, 254, 0.15) 50%, transparent 70%);
          filter: blur(100px);
          animation: pulse 5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .hero-main-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 249, 255, 0.5) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border: 3px solid rgba(255, 255, 255, 0.5);
          border-radius: 40px;
          padding: 4.5rem 4rem;
          text-align: center;
          position: relative;
          z-index: 2;
          animation: float 6s ease-in-out infinite;
          box-shadow: 0 50px 120px rgba(102, 126, 234, 0.4), 
                      0 0 80px rgba(118, 75, 162, 0.2),
                      inset 0 0 80px rgba(255, 255, 255, 0.1);
        }

        .main-card-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #4facfe, #667eea);
          background-size: 300% 300%;
          border-radius: 40px;
          filter: blur(40px);
          opacity: 0.7;
          z-index: -1;
          animation: rotate-glow 10s linear infinite, gradient-shift 8s ease infinite;
        }

        @keyframes rotate-glow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .particles span {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #667eea, #f093fb);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(102, 126, 234, 0.8), 0 0 30px rgba(240, 147, 251, 0.4);
          animation: particle-float 3s ease-in-out infinite;
        }

        .particles span:nth-child(1) {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }

        .particles span:nth-child(2) {
          top: 60%;
          right: 20%;
          animation-delay: 1s;
        }

        .particles span:nth-child(3) {
          bottom: 20%;
          left: 30%;
          animation-delay: 2s;
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            transform: translateY(-30px) scale(1.5);
            opacity: 1;
          }
        }

        .main-card-icon {
          font-size: 6.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #4facfe 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 2rem;
          animation: bounce-subtle 2s ease-in-out infinite, gradient-shift 6s ease infinite;
          filter: drop-shadow(0 8px 20px rgba(102, 126, 234, 0.5));
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .main-card-title {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #4facfe 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -1px;
          animation: gradient-shift 8s ease infinite;
          text-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .main-card-subtitle {
          color: #5a67d8;
          margin: 0;
          font-size: 1.15rem;
          font-weight: 600;
          opacity: 0.9;
          text-shadow: 0 2px 10px rgba(102, 126, 234, 0.2);
        }

        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(30px) saturate(180%);
          border: 2.5px solid rgba(255, 255, 255, 0.6);
          border-radius: 24px;
          padding: 2rem 2.5rem;
          text-align: center;
          animation: float 4s ease-in-out infinite;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 25px 60px rgba(102, 126, 234, 0.3), 
                      0 0 40px rgba(118, 75, 162, 0.15),
                      inset 0 0 40px rgba(255, 255, 255, 0.15);
        }

        .floating-card:hover {
          transform: scale(1.12) translateY(-5px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 35px 90px rgba(102, 126, 234, 0.5), 
                      0 0 60px rgba(240, 147, 251, 0.3),
                      inset 0 0 60px rgba(255, 255, 255, 0.2);
          border-color: rgba(102, 126, 234, 0.8);
        }

        .card-glow {
          position: absolute;
          inset: -3px;
          border-radius: 24px;
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #4facfe);
          background-size: 300% 300%;
          filter: blur(25px);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.4s ease;
          animation: gradient-shift 6s ease infinite;
        }

        .floating-card:hover .card-glow {
          opacity: 0.8;
        }

        .card-icon {
          font-size: 4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 70%, #4facfe 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.4));
          animation: gradient-shift 8s ease infinite;
        }

        .card-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          margin: 1.25rem 0 0;
          font-size: 1.1rem;
          letter-spacing: -0.3px;
          animation: gradient-shift 8s ease infinite;
        }

        .card-1 {
          top: 5%;
          left: 0%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 15%;
          right: 5%;
          animation-delay: 1.3s;
        }

        .card-3 {
          bottom: 10%;
          left: 5%;
          animation-delay: 2.6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Feature Cards */
        .feature-card {
          background: white;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.12);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-card:hover {
          transform: translateY(-15px) scale(1.03);
          box-shadow: 0 30px 70px rgba(102, 126, 234, 0.3);
          border-color: #667eea;
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          z-index: 1;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .feature-card h4 {
          color: #2d3748;
          position: relative;
          z-index: 1;
        }

        .feature-card p {
          color: #4a5568;
          position: relative;
          z-index: 1;
        }

        /* Module Cards */
        .module-card {
          background: white;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 25px;
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.12);
        }

        .module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: var(--module-gradient);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 0;
        }

        .module-card:hover::before {
          opacity: 0.1;
        }

        .module-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--module-gradient);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .module-card:hover::after {
          transform: scaleX(1);
        }

        .module-card:hover {
          transform: translateY(-15px) scale(1.03);
          box-shadow: 0 35px 80px rgba(102, 126, 234, 0.35);
          border-color: transparent;
          border-width: 3px;
        }

        .module-icon {
          width: 90px;
          height: 90px;
          background: var(--module-gradient);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          z-index: 1;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          animation: rotate-slow 20s linear infinite;
        }

        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .module-card h4 {
          color: #2d3748;
          position: relative;
          z-index: 1;
        }

        .module-card p {
          color: #4a5568;
          position: relative;
          z-index: 1;
        }

        .module-features {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .module-features li {
          padding: 0.75rem 0;
          color: #4a5568;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .module-features li:hover {
          color: #2d3748;
          transform: translateX(5px);
        }

        /* Benefits Section */
        .benefit-item {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.12);
        }

        .benefit-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scaleY(0);
          transition: transform 0.4s ease;
        }

        .benefit-item:hover::before {
          transform: scaleY(1);
        }

        .benefit-item:hover {
          transform: translateX(15px) scale(1.02);
          box-shadow: 0 25px 60px rgba(102, 126, 234, 0.3);
          background: white;
          border-color: #667eea;
        }

        .benefit-item h5 {
          color: #2d3748;
        }

        .benefit-item p {
          color: #4a5568;
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 18px;
          transition: all 0.3s ease;
        }

        .benefit-item:hover .benefit-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scale(1.1) rotate(5deg);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .stat-box {
          background: white;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(102, 126, 234, 0.1);
          padding: 2.5rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 35px rgba(102, 126, 234, 0.15);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .stat-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .stat-box:hover::before {
          opacity: 0.1;
        }

        .stat-box:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 30px 70px rgba(102, 126, 234, 0.4);
          border-color: #667eea;
        }

        .stat-box h3 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 1;
        }

        .stat-box p {
          color: #718096;
          position: relative;
          z-index: 1;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% 200%;
          animation: gradient-slide 15s ease infinite;
          position: relative;
          overflow: hidden;
        }

        @keyframes gradient-slide {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .cta-section::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: -200px;
          right: -200px;
          animation: float-orb 20s ease-in-out infinite;
        }

        .cta-section::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          bottom: -150px;
          left: -150px;
          animation: float-orb 15s ease-in-out infinite reverse;
        }

        /* Contact Cards */
        .contact-card {
          background: white;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(102, 126, 234, 0.1);
          padding: 2.5rem;
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.12);
        }

        .contact-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .contact-card:hover::before {
          opacity: 0.1;
        }

        .contact-card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 30px 70px rgba(102, 126, 234, 0.35);
          border-color: #667eea;
        }

        .contact-card h5 {
          color: #2d3748;
          position: relative;
          z-index: 1;
        }

        .contact-card p {
          color: #4a5568;
          position: relative;
          z-index: 1;
        }

        /* Footer */
        .footer {
          background: linear-gradient(180deg, #f8f9ff 0%, #e8ecff 100%);
          color: #4a5568;
          border-top: 1px solid rgba(102, 126, 234, 0.2);
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #4a5568;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .footer-links a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .footer-links a:hover {
          color: #667eea;
        }

        .footer-links a:hover::after {
          width: 100%;
        }

        .social-icon {
          width: 45px;
          height: 45px;
          background: white;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-size: 1.3rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
        }

        .social-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .social-icon:hover::before {
          opacity: 1;
        }

        .social-icon:hover {
          transform: translateY(-5px) scale(1.15);
          border-color: transparent;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          color: #ffffff !important;
        }

        /* Section Backgrounds */
        .section-gradient {
          background: linear-gradient(180deg, #ffffff 0%, #f0f4ff 100%);
          position: relative;
        }

        .section-dark {
          background: linear-gradient(180deg, #f8f9ff 0%, #e8ecff 100%);
          position: relative;
        }

        /* Badge Styles */
        .badge-primary, .badge-success, .badge-warning, .badge-info {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.875rem;
          background: rgba(102, 126, 234, 0.15);
          border: 1px solid rgba(102, 126, 234, 0.3);
          color: #667eea;
        }

        .badge-success {
          background: rgba(40, 199, 111, 0.15);
          border-color: rgba(40, 199, 111, 0.3);
          color: #28c76f;
        }

        .badge-warning {
          background: rgba(255, 159, 67, 0.15);
          border-color: rgba(255, 159, 67, 0.3);
          color: #ff9f43;
        }

        .badge-info {
          background: rgba(0, 207, 232, 0.15);
          border-color: rgba(0, 207, 232, 0.3);
          color: #00cfe8;
        }

        /* Heading Styles */
        .display-5 {
          background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lead {
          color: #4a5568;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .hero-illustration-wrapper {
            height: 400px;
            margin-top: 3rem;
          }

          .floating-card {
            display: none;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 3rem;
          }

          .navbar-scrolled .navbar-brand,
          .navbar-scrolled .nav-link {
            color: #2d3748 !important;
          }
        }

        @media (max-width: 767px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .display-4 {
            font-size: 2rem;
          }

          .hero-main-card {
            padding: 2rem;
          }

          .btn-gradient, .btn-glass {
            padding: 0.875rem 2rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
