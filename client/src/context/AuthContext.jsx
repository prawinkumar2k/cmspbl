import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarModules, setSidebarModules] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Helper function to get token for API calls
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Fetch shared data (sidebar and profile) when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchGlobalData = async () => {
        try {
          const headers = getAuthHeaders();
          
          // Fetch Sidebar Modules
          const sidebarRes = await fetch('/api/auth/sidebar', { headers });
          if (sidebarRes.ok) {
            const sidebarData = await sidebarRes.json();
            setSidebarModules(Array.isArray(sidebarData?.data) ? sidebarData.data : []);
          }

          // Fetch User Profile if not already detailed
          const profileRes = await fetch('/api/auth/profile', { headers });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUserProfile(profileData.data);
          }
        } catch (error) {
          console.error('Error fetching global auth data:', error);
        }
      };

      fetchGlobalData();
    } else {
      setSidebarModules([]);
      setUserProfile(null);
    }
  }, [isAuthenticated]);

  const login = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSidebarModules([]);
    setUserProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      userProfile,
      sidebarModules,
      login, 
      logout, 
      loading,
      getToken,
      getAuthHeaders,
      setSidebarModules,
      setUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
