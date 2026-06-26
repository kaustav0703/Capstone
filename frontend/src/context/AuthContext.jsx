import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Audit client browser caches for existing token instances on initial page load
    const storedUser = localStorage.getItem('ytUserInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler updating hooks and storage registries synchronously
  const login = (userData) => {
    localStorage.setItem('ytUserInfo', JSON.stringify(userData));
    setUser(userData);
  };

  // Signout handler clearing user context records completely
  const logout = () => {
    localStorage.removeItem('ytUserInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
