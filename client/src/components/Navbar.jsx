import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/style.css"; // custom styles

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
          // console.log('Profile API response:', result);
          setUserProfile(result.data);
        } else {
          const errorData = await response.json();
          console.error('Profile API error:', errorData);

          // Fallback: Use data from AuthContext if API fails
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserProfile({
              staff_name: userData.staff_name,
              role_name: userData.role_name,
              staff_id: userData.staff_id,
              photo: null // No photo available from stored data
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);

        // Fallback: Use data from AuthContext if API fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserProfile({
            staff_name: userData.staff_name,
            role_name: userData.role_name,
            staff_id: userData.staff_id,
            photo: null // No photo available from stored data
          });
        }
      }
    };

    const fetchSidebarModules = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/sidebar', {
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
            {/* Hamburger icon - shows when sidebar is OPEN (normal state) */}
            <Icon
              icon="heroicons:bars-3-solid"
              className="icon text-xl non-active"
            />
            {/* Arrow icon - shows when sidebar is CLOSED (active/collapsed state) */}
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

          {/* Search Bar - Hidden below 992px */}
          <div className="navbar-search d-none d-lg-flex align-items-center bg-light rounded px-3 position-relative" style={{ minWidth: '350px' }}>
            <Icon icon="ion:search-outline" className="icon text-muted" />
            <input
              type="text"
              name="search"
              placeholder="Search modules, pages..."
              className="form-control border-0 bg-transparent shadow-none"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-sm p-0 border-0 bg-transparent"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                style={{ marginLeft: '5px' }}
              >
                <Icon icon="iconamoon:close-circle-1-fill" className="text-muted" width="20" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div
                className="position-absolute start-0 bg-white shadow-lg rounded-3 border border-light-subtle"
                style={{
                  top: 'calc(100% + 5px)',
                  width: '100%',
                  minWidth: '350px',
                  maxHeight: '380px',
                  zIndex: 1050,
                  overflow: 'hidden'
                }}
              >
                <div className="scroll-area p-1 custom-scrollbar" style={{ overflowY: 'auto', maxHeight: '375px' }}>
                  {searchResults.map((module, index) => {
                    const isDisabled = module.module_path === '#';
                    return (
                      <button
                        key={index}
                        className={`search-item d-flex align-items-center gap-3 px-3 py-2 rounded-2 border-0 w-100 text-start transition-all ${isDisabled ? 'disabled-item' : ''}`}
                        onClick={() => !isDisabled && handleSearchResultClick(module)}
                        style={{
                          background: 'transparent',
                          cursor: isDisabled ? 'default' : 'pointer',
                        }}
                      >
                        <div className="search-icon-minimal d-flex align-items-center justify-content-center flex-shrink-0">
                          <Icon icon="solar:document-text-linear" width="18" className="text-muted opacity-50" />
                        </div>

                        <div className="flex-grow-1 d-flex align-items-center justify-content-between min-w-0">
                          <span className="search-title fw-medium text-dark text-truncate" style={{ fontSize: '13px' }}>
                            {module.module_name}
                          </span>
                          <span className="search-category text-muted text-truncate ms-2" style={{ fontSize: '11px', fontWeight: '400' }}>
                            {isDisabled ? 'Coming Soon' : module.module_category}
                          </span>
                        </div>

                        {!isDisabled && (
                          <div className="search-enter-icon opacity-0 flex-shrink-0 ms-2">
                            <Icon icon="solar:arrow-right-up-linear" width="14" className="text-primary" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {searchResults.length > 0 && (
                  <div className="px-3 py-1.5 border-top bg-light-subtle d-flex align-items-center justify-content-between">
                    <span className="text-muted" style={{ fontSize: '10px' }}>
                      {searchResults.length} results found
                    </span>
                    <span className="text-muted" style={{ fontSize: '10px' }}>
                      Press Enter to select
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* No Results Section */}
            {showSearchResults && searchQuery && searchResults.length === 0 && (
              <div
                className="position-absolute start-0 bg-white shadow-lg rounded-3 border border-light-subtle overflow-hidden"
                style={{
                  top: 'calc(100% + 5px)',
                  width: '100%',
                  zIndex: 1050,
                  animation: 'searchFadeIn 0.15s ease-out'
                }}
              >
                <div className="p-4 text-center">
                  <Icon icon="solar:magnifer-linear" width="24" className="text-muted mb-2 opacity-30" />
                  <p className="text-muted small mb-0">No modules found for <span className="text-dark fw-medium">"{searchQuery}"</span></p>
                </div>
              </div>
            )}
          </div>
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
                      {userProfile?.staff_name || 'Loading...'}
                    </h6>
                    <span className="text-secondary-light text-xs">{userProfile?.role_name || ''}</span>
                  </div>
                </div>
                <button type="button" className="btn btn-sm text-secondary" data-bs-toggle="dropdown">
                  <Icon icon="radix-icons:cross-1" />
                </button>
              </div>

              <ul className="list-unstyled mb-0">
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes searchDropdownFade {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-item {
  transition: all 0.1s ease;
  border: 1px solid transparent !important;
}

.search-item:hover:not(.disabled-item) {
  background-color: #f1f5f9 !important;
}

.search-item:hover .search-title {
  color: #2563eb !important;
}

.search-item:hover .search-icon-minimal {
  transform: scale(1.1);
}

.search-item:hover .search-icon-minimal svg {
  color: #2563eb !important;
  opacity: 1 !important;
}

.search-item:hover .search-category {
  color: #64748b !important;
}

.search-item:hover .search-enter-icon {
  opacity: 0.6 !important;
  transform: translateX(2px);
}

.disabled-item {
  opacity: 0.4;
  pointer-events: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04) !important;
}

.bg-light-subtle {
  background-color: #f8fafc !important;
}
    `,
        }}
      />
    </div>
  );
};

export default Navbar;
