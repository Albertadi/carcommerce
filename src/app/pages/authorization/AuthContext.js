"use client"

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [access_token, setToken] = useState(null);
  const [permissions, setPermissions] = useState(null);

  // On component mount, check if there's a token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken); // Decode token
        setPermissions(decodedToken); // Store permissions from the token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('access_token', newToken);
    try {
      const decodedToken = jwtDecode(newToken); // Decode token
      setPermissions(decodedToken); // Set permissions based on the token
      localStorage.setItem('permissions', decodedToken)
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setPermissions(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('permissions');
  };

  return (
    <AuthContext.Provider value={{ access_token, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
