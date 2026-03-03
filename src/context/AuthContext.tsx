import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, college: string, role: UserRole) => boolean;
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

  const login = useCallback((email: string, _password: string) => {
    // Get registered users from localStorage
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem('campus_users') || '[]');
    const found = users.find(u => u.email === email);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('campus_user', JSON.stringify(userData));
      return true;
    }
    // Demo accounts
    if (email === 'student@demo.com') {
      const u: User = { id: 'demo-s', name: 'Demo Student', email, college: 'IIT Bombay', role: 'student' };
      setUser(u);
      localStorage.setItem('campus_user', JSON.stringify(u));
      return true;
    }
    if (email === 'admin@demo.com') {
      const u: User = { id: 'demo-a', name: 'Demo Admin', email, college: 'IIT Bombay', role: 'college_admin' };
      setUser(u);
      localStorage.setItem('campus_user', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, password: string, college: string, role: UserRole) => {
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem('campus_users') || '[]');
    if (users.some(u => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), name, email, password, college, role };
    users.push(newUser);
    localStorage.setItem('campus_users', JSON.stringify(users));
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('campus_user', JSON.stringify(userData));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('campus_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
