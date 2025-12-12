import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../utils/storage';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = storage.getToken();
      const storedUser = storage.getUser();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        storage.setToken(response.token);
        storage.setUser(response.user);
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      // Better error handling
      let errorMessage = 'Login failed';
      
      if (!error.response) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.response.status === 404) {
        errorMessage = 'API endpoint not found. Please check the backend configuration.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.response?.data?.message || error.message || 'Login failed';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    storage.clear();
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



