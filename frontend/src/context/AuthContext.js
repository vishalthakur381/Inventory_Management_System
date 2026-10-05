import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('inventory_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && !parsed.name?.includes('Alexander')) {
          return parsed;
        }
      } catch {
        // pass
      }
    }
    return null;
  });

  const [dbStatus, setDbStatus] = useState({ online: true, database: 'Connected' });

  useEffect(() => {
    const check = async () => {
      const status = await api.checkHealth();
      setDbStatus(status);
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const login = async (identifier, password) => {
    const res = await api.login(identifier, password);
    if (res && res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('inventory_user', JSON.stringify(res.data));
      localStorage.setItem('inventory_token', res.data.token || 'jwt-token-active');
      return { success: true };
    }
    return {
      success: false,
      message: res?.message || 'Invalid login details. Please check your credentials.',
    };
  };

  const register = async (name, email, password, role) => {
    const res = await api.register(name, email, password, role);
    if (res && res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('inventory_user', JSON.stringify(res.data));
      localStorage.setItem('inventory_token', res.data.token || 'jwt-token-active');
      return { success: true };
    }
    return {
      success: false,
      message: res?.message || 'Registration could not be completed.',
    };
  };

  const switchRole = (newRole) => {
    const updated = {
      ...user,
      role: newRole,
      name: newRole === 'admin' ? 'Rajesh Sharma (Owner)' : 'Amit Verma (Floor Staff)',
    };
    setUser(updated);
    localStorage.setItem('inventory_user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventory_user');
    localStorage.removeItem('inventory_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        switchRole,
        logout,
        dbStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
