import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (fullName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial demo user for local exploration, can be switched to real API token
const DEFAULT_USER: User = {
  id: 'usr-admin-1',
  email: 'admin@translateml.edu',
  fullName: 'Prof. Translation Admin',
  role: 'admin',
  isActive: true,
  createdAt: '2026-10-10',
  translationsCount: 142
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('translateml_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('translateml_token') || 'demo-jwt-token-active';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('translateml_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('translateml_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('translateml_token', token);
    } else {
      localStorage.removeItem('translateml_token');
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    // Connects to FastAPI /api/v1/auth/token or graceful fallback
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.access_token);
        return { success: true };
      }
    } catch {
      // Backend not yet running in Phase 2
    }

    // Role detection based on email for initial development mode
    const isAdmin = email.toLowerCase().includes('admin');
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      role: isAdmin ? 'admin' : 'user',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      translationsCount: 0
    };
    setUser(newUser);
    setToken(`jwt-${Date.now()}`);
    return { success: true };
  };

  const register = async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!fullName || !email || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.access_token);
        return { success: true };
      }
    } catch {
      // Fallback
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      translationsCount: 0
    };
    setUser(newUser);
    setToken(`jwt-${Date.now()}`);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('translateml_user');
    localStorage.removeItem('translateml_token');
  };

  const updateProfile = (fullName: string) => {
    if (user) {
      setUser({ ...user, fullName });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
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
