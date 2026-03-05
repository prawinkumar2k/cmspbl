import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@iconify/react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [roleList, setRoleList] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Fetch roles on component mount
  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/auth/roles');
        if (!response.ok) {
          throw new Error(`Failed to fetch roles: ${response.status}`);
        }
        const data = await response.json();
        setRoleList(data);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load roles');
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate role selection
    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    try {
      // Call the backend authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      login(data.token, data.user);

      // Conditional redirection based on role
      if (formData.role.toLowerCase() === 'student') {
        navigate('/student/dashboard');
      } else {
        // Navigate staff/admin roles to admin dashboard
        navigate('/admin/adminDashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      {/* Animated Background */}
      <div className="login-gradient-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      <div className="login-grid"></div>

      {/* Floating Particles */}
      <div className="floating-particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Main Container */}
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          <div className="col-12">
            <div className="row g-0 login-content-wrapper min-vh-100">
              {/* Left Side - Illustration */}
              <div className="col-lg-6 d-none d-lg-flex">
                <div className="login-illustration-side">
                  <div className="illustration-content">
                    <div className="brand-section mb-5">
                      <Link to="/" className="d-flex align-items-center text-decoration-none">
                        <Icon icon="solar:book-bold-duotone" className="brand-icon" />
                        <span className="brand-text">SF CMS</span>
                      </Link>
                    </div>

                    <h2 className="illustration-title mb-4">
                      Welcome to<br />
                      <span className="gradient-text">SF CMS System</span>
                    </h2>
                    <p className="illustration-desc mb-5">
                      Complete campus management system for educational institutions
                    </p>

                    {/* Feature Cards */}
                    <div className="feature-items">
                      <div className="feature-item">
                        <div className="feature-icon-wrapper">
                          <Icon icon="solar:shield-check-bold-duotone" />
                        </div>
                        <div>
                          <h6 className="feature-title">Secure & Reliable</h6>
                          <p className="feature-text">Enterprise-grade security</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon-wrapper">
                          <Icon icon="solar:chart-2-bold-duotone" />
                        </div>
                        <div>
                          <h6 className="feature-title">Real-Time Analytics</h6>
                          <p className="feature-text">Powerful insights dashboard</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon-wrapper">
                          <Icon icon="solar:cloud-bold-duotone" />
                        </div>
                        <div>
                          <h6 className="feature-title">Cloud-Based</h6>
                          <p className="feature-text">Access anywhere, anytime</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="col-lg-6">
                <div className="login-form-side">
                  <div className="login-form-content">
                    {/* Mobile Brand */}
                    <div className="d-lg-none mb-4">
                      <Link to="/" className="d-flex align-items-center text-decoration-none justify-content-center">
                        <Icon icon="solar:book-bold-duotone" className="brand-icon-mobile" />
                        <span className="brand-text-mobile">SF ERP</span>
                      </Link>
                    </div>

                    <div className="text-center mb-4">
                      <div className="login-icon-wrapper mb-3">
                        <Icon icon="solar:user-circle-bold-duotone" className="login-main-icon" />
                      </div>
                      <h3 className="login-title">Sign In to Account</h3>
                      <p className="login-subtitle">Welcome back! Please enter your details</p>
                    </div>

                    {error && (
                      <div className="error-alert">
                        <Icon icon="solar:danger-circle-bold" className="me-2" />
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="form-group-custom mb-3">
                        <label className="form-label-custom">Role</label>
                        <div className="input-wrapper">
                          <Icon icon="solar:shield-user-bold-duotone" className="input-icon" />
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="form-control-custom"
                            required
                            disabled={isLoadingRoles}
                          >
                            <option value="">Select your role</option>
                            {roleList.map((role, index) => (
                              <option key={role.id || role.role || index} value={role.role}>
                                {role.role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group-custom mb-3">
                        <label className="form-label-custom">Username</label>
                        <div className="input-wrapper">
                          <Icon icon="solar:user-bold-duotone" className="input-icon" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-control-custom"
                            placeholder="Enter your username"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group-custom mb-4">
                        <label className="form-label-custom">Password</label>
                        <div className="input-wrapper">
                          <Icon icon="solar:lock-password-bold-duotone" className="input-icon" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control-custom"
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                          >
                            <Icon icon={showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* <div className="form-check-custom">
                          <input type="checkbox" id="remember" />
                          <label htmlFor="remember">Remember me</label>
                        </div> */}
                        {/* <Link to="#" className="forgot-link">Forgot Password?</Link> */}
                      </div>

                      <button type="submit" className="btn-login">
                        <span>Sign In</span>
                        <Icon icon="solar:arrow-right-bold" className="ms-2" />
                        <div className="btn-shine"></div>
                      </button>

                      {/* <div className="divider-custom">
                        <span>Or continue with</span>
                      </div> */}

                      {/* <div className="social-login-buttons">
                        <button type="button" className="social-btn">
                          <Icon icon="logos:google-icon" />
                          <span>Google</span>
                        </button>
                        <button type="button" className="social-btn">
                          <Icon icon="logos:microsoft-icon" />
                          <span>Microsoft</span>
                        </button>
                      </div> */}

                      <div className="text-center mt-4">
                        <p className="signup-text">
                          Don't have an account? <Link to="/" className="signup-link">Go to Home</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          overflow: hidden;
          background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 50%, #f0f4ff 100%);
          position: relative;
        }

        /* Animated Background */
        .login-gradient-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
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
          background: radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation-delay: 14s;
        }

        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-50px, 50px) scale(0.9); }
        }

        .login-grid {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(102, 126, 234, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
        }

        /* Floating Particles */
        .floating-particles {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
          pointer-events: none;
        }

        .floating-particles span {
          position: absolute;
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #667eea, #f093fb);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
          animation: particle-float 15s ease-in-out infinite;
        }

        .floating-particles span:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; }
        .floating-particles span:nth-child(2) { top: 20%; right: 20%; animation-delay: 2s; }
        .floating-particles span:nth-child(3) { top: 60%; left: 10%; animation-delay: 4s; }
        .floating-particles span:nth-child(4) { top: 70%; right: 15%; animation-delay: 6s; }
        .floating-particles span:nth-child(5) { top: 40%; left: 25%; animation-delay: 8s; }
        .floating-particles span:nth-child(6) { top: 80%; right: 30%; animation-delay: 10s; }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translateY(-80px) translateX(40px); }
        }

        .container {
          position: relative;
          z-index: 2;
        }

        /* Main Content Card */
        .login-content-wrapper {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(40px) saturate(180%);
          border: none;
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Left Side - Illustration */
        .login-illustration-side {
          padding: 4rem 3rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(248, 249, 255, 0.6) 100%);
          backdrop-filter: blur(20px);
          position: relative;
          display: flex;
          align-items: center;
          min-height: 100vh;
        }

        .illustration-content {
          width: 100%;
        }

        .brand-section .d-flex {
          transition: all 0.3s ease;
        }

        .brand-section .d-flex:hover {
          transform: translateX(5px);
        }

        .brand-icon {
          font-size: 3rem;
          color: #667eea;
          margin-right: 1rem;
        }

        .brand-text {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .illustration-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a202c;
          line-height: 1.2;
          animation: fadeInUp 0.6s ease 0.2s backwards;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 8s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .illustration-desc {
          color: #4a5568;
          font-size: 1.1rem;
          animation: fadeInUp 0.6s ease 0.3s backwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Feature Items */
        .feature-items {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: white;
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: fadeInUp 0.6s ease backwards;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
        }

        .feature-item:nth-child(1) { animation-delay: 0.4s; }
        .feature-item:nth-child(2) { animation-delay: 0.5s; }
        .feature-item:nth-child(3) { animation-delay: 0.6s; }

        .feature-item:hover {
          transform: translateX(10px);
          border-color: #667eea;
          box-shadow: 0 10px 35px rgba(102, 126, 234, 0.2);
        }

        .feature-icon-wrapper {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 0.25rem 0;
        }

        .feature-text {
          font-size: 0.875rem;
          color: #718096;
          margin: 0;
        }

        /* Right Side - Login Form */
        .login-form-side {
          padding: 4rem 3rem;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .login-form-content {
          width: 100%;
          max-width: 420px;
          animation: fadeInUp 0.6s ease 0.3s backwards;
        }

        .brand-icon-mobile {
          font-size: 2.5rem;
          color: #667eea;
          margin-right: 0.75rem;
        }

        .brand-text-mobile {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.4); }
          50% { box-shadow: 0 0 50px rgba(102, 126, 234, 0.7); }
        }

        .login-main-icon {
          font-size: 3rem;
          color: white;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: #718096;
          font-size: 1rem;
          margin: 0;
        }

        /* Error Alert */
        .error-alert {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
          border: 2px solid rgba(239, 68, 68, 0.2);
          color: #dc2626;
          padding: 1rem 1.25rem;
          border-radius: 15px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          font-weight: 600;
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        /* Form Styling */
        .form-group-custom {
          margin-bottom: 1.5rem;
        }

        .form-label-custom {
          display: block;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.25rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          pointer-events: none;
          z-index: 1;
        }

        .form-control-custom {
          width: 100%;
          padding: 1rem 1.25rem 1rem 3.5rem;
          border: 2px solid rgba(102, 126, 234, 0.15);
          border-radius: 15px;
          background: white;
          font-size: 1rem;
          color: #2d3748;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-control-custom:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-control-custom::placeholder {
          color: #a0aec0;
        }

        .form-control-custom:disabled {
          background: #f7fafc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        select.form-control-custom {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23667eea' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.5rem;
          padding-right: 3rem;
        }

        select.form-control-custom option {
          padding: 0.75rem;
          background: white;
          color: #2d3748;
        }

        select.form-control-custom option:hover {
          background: #f7fafc;
        }

        .password-toggle {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #718096;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0.25rem;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        /* Remember Me & Forgot Password */
        .form-check-custom {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-check-custom input {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(102, 126, 234, 0.3);
          border-radius: 5px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .form-check-custom label {
          color: #4a5568;
          font-size: 0.95rem;
          cursor: pointer;
          user-select: none;
        }

        .forgot-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .forgot-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        /* Login Button */
        .btn-login {
          width: 100%;
          padding: 1.15rem 2rem;
          border: none;
          border-radius: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-login:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
        }

        .btn-login span {
          position: relative;
          z-index: 1;
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
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }

        /* Divider */
        .divider-custom {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 2rem 0 1.5rem;
          color: #718096;
          font-size: 0.95rem;
        }

        .divider-custom::before,
        .divider-custom::after {
          content: '';
          flex: 1;
          border-bottom: 2px solid rgba(102, 126, 234, 0.1);
        }

        .divider-custom span {
          padding: 0 1rem;
        }

        /* Social Buttons */
        .social-login-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .social-btn {
          padding: 0.875rem 1rem;
          border: 2px solid rgba(102, 126, 234, 0.15);
          border-radius: 12px;
          background: white;
          color: #2d3748;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .social-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
        }

        .social-btn svg {
          font-size: 1.25rem;
        }

        /* Signup Text */
        .signup-text {
          color: #718096;
          font-size: 0.95rem;
          margin: 0;
        }

        .signup-link {
          color: #667eea;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .signup-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .login-form-side {
            padding: 3rem 2rem;
          }

          .illustration-title {
            font-size: 2rem;
          }

          .login-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 767px) {
          .login-form-side {
            padding: 2rem 1.5rem;
          }

          .login-icon-wrapper {
            width: 70px;
            height: 70px;
          }

          .login-main-icon {
            font-size: 2.5rem;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .social-login-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
