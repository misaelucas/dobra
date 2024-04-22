import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          setIsAuthenticated(true);
          setUserRole(decoded.role);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to decode JWT:', error);
        logout();
      }
    }
    setLoading(false); // Set loading to false after checking token
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);
      setUserRole(decoded.role);
    } catch (error) {
      console.error('Error decoding token on login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AppContext.Provider value={{ isAuthenticated, userRole, loading, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}
