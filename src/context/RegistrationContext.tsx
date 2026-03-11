import React, { createContext, useContext, useState, useCallback } from 'react';
import { Registration } from '@/types';
import { registrationsApi, BackendRegistration } from '@/lib/api';

const mapRegistration = (r: BackendRegistration): Registration => ({
  id: r._id,
  eventId: r.event_id,
  userId: typeof r.user_id === 'object' ? r.user_id._id : (r.user_id as string),
  userName: typeof r.user_id === 'object' ? r.user_id.name : '',
  userEmail: typeof r.user_id === 'object' ? r.user_id.email : '',
  userCollege: '',
  status: r.status,
  registeredAt: r.createdAt,
});

interface RegistrationContextType {
  registrations: Registration[];
  registerForEvent: (eventId: string) => Promise<{ ok: boolean; error?: string }>;
  updateStatus: (regId: string, status: Registration['status']) => Promise<{ ok: boolean; error?: string }>;
  loadEventRegistrations: (eventId: string) => Promise<void>;
  isRegistered: (eventId: string, userId: string) => boolean;
}

const RegistrationContext = createContext<RegistrationContextType | null>(null);

export const useRegistrations = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistrations must be used within RegistrationProvider');
  return ctx;
};

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const registerForEvent = useCallback(
    async (eventId: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const data = await registrationsApi.register(eventId);
        setRegistrations((prev) => [mapRegistration(data), ...prev]);
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Registration failed';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const loadEventRegistrations = useCallback(async (eventId: string) => {
    try {
      const data = await registrationsApi.getForEvent(eventId);
      const mapped = data.map(mapRegistration);
      setRegistrations((prev) => {
        // Merge: replace existing registrations for this event
        const others = prev.filter((r) => r.eventId !== eventId);
        return [...others, ...mapped];
      });
    } catch {
      // Admin-only endpoint: silently ignore if not authorized
    }
  }, []);

  const updateStatus = useCallback(
    async (regId: string, status: Registration['status']): Promise<{ ok: boolean; error?: string }> => {
      try {
        const data = await registrationsApi.updateStatus(regId, status);
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? mapRegistration(data) : r))
        );
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Update failed';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const isRegistered = useCallback(
    (eventId: string, userId: string) =>
      registrations.some((r) => r.eventId === eventId && r.userId === userId),
    [registrations]
  );

  return (
    <RegistrationContext.Provider
      value={{ registrations, registerForEvent, updateStatus, loadEventRegistrations, isRegistered }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
