import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Audit client browser caches for existing token instances on initial page load
    const storedUser = localStorage.getItem("ytUserInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Ensure this specific function block matches inside frontend/src/context/AuthContext.jsx
  const login = (userData) => {
    localStorage.setItem("ytUserInfo", JSON.stringify(userData)); // <-- Key name must match this exactly
    setUser(userData);
  };

  // Signout handler clearing user context records completely
  const logout = () => {
    localStorage.removeItem("ytUserInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
