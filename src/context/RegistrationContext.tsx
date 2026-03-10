import React, { createContext, useContext, useState, useCallback } from 'react';
import { Registration } from '@/types';

interface RegistrationContextType {
  registrations: Registration[];
  registerForEvent: (reg: Omit<Registration, 'id' | 'registeredAt' | 'status'>) => void;
  updateStatus: (regId: string, status: Registration['status']) => void;
  getEventRegistrations: (eventId: string) => Registration[];
  getUserRegistrations: (userId: string) => Registration[];
  isRegistered: (eventId: string, userId: string) => boolean;
}

const RegistrationContext = createContext<RegistrationContextType | null>(null);

export const useRegistrations = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistrations must be used within RegistrationProvider');
  return ctx;
};

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const stored = localStorage.getItem('campus_registrations');
    return stored ? JSON.parse(stored) : [];
  });

  const save = (regs: Registration[]) => {
    localStorage.setItem('campus_registrations', JSON.stringify(regs));
    return regs;
  };

  const registerForEvent = useCallback((reg: Omit<Registration, 'id' | 'registeredAt' | 'status'>) => {
    setRegistrations(prev => {
      if (prev.some(r => r.eventId === reg.eventId && r.userId === reg.userId)) return prev;
      const newReg: Registration = {
        ...reg,
        id: crypto.randomUUID(),
        status: 'pending',
        registeredAt: new Date().toISOString(),
      };
      return save([newReg, ...prev]);
    });
  }, []);

  const updateStatus = useCallback((regId: string, status: Registration['status']) => {
    setRegistrations(prev => save(prev.map(r => r.id === regId ? { ...r, status } : r)));
  }, []);

  const getEventRegistrations = useCallback((eventId: string) => {
    return registrations.filter(r => r.eventId === eventId);
  }, [registrations]);

  const getUserRegistrations = useCallback((userId: string) => {
    return registrations.filter(r => r.userId === userId);
  }, [registrations]);

  const isRegistered = useCallback((eventId: string, userId: string) => {
    return registrations.some(r => r.eventId === eventId && r.userId === userId);
  }, [registrations]);

  return (
    <RegistrationContext.Provider value={{ registrations, registerForEvent, updateStatus, getEventRegistrations, getUserRegistrations, isRegistered }}>
      {children}
    </RegistrationContext.Provider>
  );
};
