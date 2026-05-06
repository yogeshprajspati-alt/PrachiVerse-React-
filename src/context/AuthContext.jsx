import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessGranted = sessionStorage.getItem('access_granted');
        setIsAuthenticated(accessGranted === 'true');
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Cross-tab logout detection
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = (username, password) => {
    try {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      if ((u === 'prachiii' && p === 'billu') || (u === 'deepak' && p === 'admin')) {
        sessionStorage.setItem('access_granted', 'true');
        sessionStorage.setItem('login_time', Date.now().toString());
        sessionStorage.setItem('username', u);
        if (u === 'deepak') {
          sessionStorage.setItem('role', 'admin');
        }
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    // ProtectedRoute will redirect to /login automatically
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
