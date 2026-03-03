import React, { createContext, useContext, useState, useCallback } from 'react';
import { CollegeEvent } from '@/types';
import { MOCK_EVENTS } from '@/data/mockData';

interface EventContextType {
  events: CollegeEvent[];
  addEvent: (event: Omit<CollegeEvent, 'id' | 'createdAt'>) => void;
}

const EventContext = createContext<EventContextType | null>(null);

export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CollegeEvent[]>(() => {
    const stored = localStorage.getItem('campus_events');
    return stored ? JSON.parse(stored) : MOCK_EVENTS;
  });

  const addEvent = useCallback((event: Omit<CollegeEvent, 'id' | 'createdAt'>) => {
    const newEvent: CollegeEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => {
      const updated = [newEvent, ...prev];
      localStorage.setItem('campus_events', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};
