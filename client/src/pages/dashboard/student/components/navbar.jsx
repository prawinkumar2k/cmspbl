import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../../components/css/style.css"; // custom styles

const Navbar = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [sidebarModules, setSidebarModules] = useState([]);
    const { getAuthHeaders, logout } = useAuth();
    const navigate = useNavigate();

    // Fetch user profile and sidebar modules on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('/api/auth/profile', {
                    headers: getAuthHeaders()
                });

                if (response.ok) {
                    const result = await response.json();
                    setUserProfile(result.data);
                } else {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUserProfile(JSON.parse(storedUser));
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUserProfile(JSON.parse(storedUser));
                }
            }
        };

        const fetchSidebarModules = async () => {
            try {
                const response = await fetch('/api/auth/sidebar', {
                    headers: getAuthHeaders()
                });

                if (response.ok) {
                    const result = await response.json();
                    setSidebarModules(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching sidebar modules:', error);
            }
        };

        fetchUserProfile();
        fetchSidebarModules();
    }, [getAuthHeaders]);

    // Handle search input
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        // Filter modules based on search query
        const filtered = sidebarModules.filter(module =>
            module.module_name.toLowerCase().includes(query.toLowerCase()) ||
            module.module_category.toLowerCase().includes(query.toLowerCase()) ||
            module.module_key.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filtered);
        setShowSearchResults(true);
    };

    // Handle search result click
    const handleSearchResultClick = (module) => {
        if (module.module_path && module.module_path !== '#') {
            navigate(module.module_path);
            setSearchQuery('');
            setShowSearchResults(false);
            setSearchResults([]);
        }
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.navbar-search')) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDesktopToggle = () => {
        const sidebar = document.querySelector(".sidebar");
        const dashboardMain = document.querySelector(".dashboard-main");

        if (sidebar && dashboardMain) {
            sidebar.classList.toggle("active");
            dashboardMain.classList.toggle("active");
            setIsSidebarClosed(sidebar.classList.contains("active"));
        }
    };

    const handleMobileToggle = () => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
            sidebar.classList.add("sidebar-open");
            document.body.classList.add("overlay-active");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="navbar-header bg-white shadow-sm">
            <div className="d-flex align-items-center justify-content-between px-4 py-2">
                {/* Left side - Menu and Search */}
                <div className="d-flex align-items-center gap-3">
                    {/* Desktop Hamburger Menu Toggle */}
                    <button
                        type="button"
                        className={`sidebar-toggle btn ${isSidebarClosed ? "active" : ""}`}
                        onClick={handleDesktopToggle}
                    >
                        <Icon
                            icon="heroicons:bars-3-solid"
                            className="icon text-xl non-active"
                        />
                        <Icon
                            icon="iconoir:arrow-right"
                            className="icon text-xl active"
                        />
                    </button>

                    {/* Mobile Hamburger Menu Toggle */}
                    <button
                        type="button"
                        className="sidebar-mobile-toggle btn"
                        onClick={handleMobileToggle}
                    >
                        <Icon icon="heroicons:bars-3-solid" className="icon text-xl" />
                    </button>
                </div>

                <div className="d-flex align-items-center gap-3">
                    {/* User Profile Dropdown */}
                    <div className="dropdown">
                        <button
                            className="d-flex justify-content-center align-items-center rounded-circle border-0 bg-neutral-200"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            <Icon icon="solar:user-circle-bold-duotone" width="40" height="40" className="text-primary-600" />
                        </button>

                        <div className="dropdown-menu to-top dropdown-menu-sm p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="w-44-px h-44-px bg-primary-50 rounded-circle d-flex align-items-center justify-content-center">
                                        <Icon icon="solar:user-bold-duotone" width="24" height="24" className="text-primary-600" />
                                    </div>
                                    <div>
                                        <h6 className="text-md fw-semibold mb-0">
                                            {userProfile?.studentName || userProfile?.staff_name || 'Loading...'}
                                        </h6>
                                        <span className="text-secondary-light text-xs">{userProfile?.role_name || userProfile?.regNo || ''}</span>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-sm text-secondary" data-bs-toggle="dropdown">
                                    <Icon icon="radix-icons:cross-1" />
                                </button>
                            </div>

                            <ul className="list-unstyled mb-0">
                                <li>
                                    <button onClick={() => navigate('/student/profile')} className="dropdown-item d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start">
                                        <Icon icon="solar:user-linear" /> My Profile
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item text-danger border-0 bg-transparent w-100 text-start">
                                        <Icon icon="lucide:power" className="me-2" /> Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
