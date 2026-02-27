import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      try {
        const accessGranted = sessionStorage.getItem('access_granted');
        if (accessGranted === 'true') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        // CRITICAL: Always turn off loading, otherwise we get a white screen
        setLoading(false);
      }
    };

    checkAuth();

    // safe interval check that won't cause infinite re-renders or loops
    const interval = setInterval(() => {
      try {
        const accessGranted = sessionStorage.getItem('access_granted');
        // Only update if state mismatch to avoid unnecessary renders
        if (accessGranted !== 'true') {
          setIsAuthenticated(prev => (prev ? false : prev));
        }
      } catch (e) {
        console.error("Auth interval error", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once on mount

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
    // Optional: Force reload to clear any in-memory state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading ? children : <div style={{
        height: '100vh',
        width: '100vw',
        background: '#050510',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#cca43b',
        fontFamily: 'sans-serif'
      }}>Loading Prachi Verse...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
