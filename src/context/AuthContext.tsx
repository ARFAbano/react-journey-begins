import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { apiFetch } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean, role?: UserRole }>;
  register: (name: string, email: string, password: string, college: string, role: UserRole) => Promise<{ success: boolean, role?: UserRole }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('campus_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const u = data.user;
      const userData: User = {
        id: u._id,
        name: u.name,
        email: u.email,
        college: u.college || 'IIT Bombay', // Default if missing from backend temporarily
        role: u.role as UserRole,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('campus_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, college: string, role: UserRole) => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }), // Note: backend schema not fully checked for college, passing just in case
      });

      const u = data.user;
      const userData: User = {
        id: u._id,
        name: u.name,
        email: u.email,
        college: college, // Fallback if backend doesn't store this yet
        role: u.role as UserRole,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('campus_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('campus_user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
