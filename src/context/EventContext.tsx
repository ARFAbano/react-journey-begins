import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CollegeEvent } from '@/types';
import { apiFetch } from '@/lib/api';

interface EventContextType {
  events: CollegeEvent[];
  addEvent: (event: Omit<CollegeEvent, 'id' | 'createdAt'>) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | null>(null);

export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CollegeEvent[]>([]);

  const refreshEvents = useCallback(async () => {
    try {
      const data = await apiFetch('/events');
      const mappedEvents: CollegeEvent[] = data.events.map((e: any) => ({
        id: e._id,
        collegeId: e.organizer?._id || 'unknown',
        collegeName: e.college || 'Unknown College',
        title: e.title,
        description: e.description,
        category: e.category,
        location: e.venue,
        startDate: e.startDate,
        endDate: e.endDate,
        createdAt: e.createdAt,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }, []);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const addEvent = useCallback(async (event: Omit<CollegeEvent, 'id' | 'createdAt'>) => {
    try {
      await apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          category: event.category,
          college: event.collegeName,
          startDate: event.startDate,
          endDate: event.endDate,
          venue: event.location,
        })
      });
      await refreshEvents();
      return true;
    } catch (error) {
      console.error("Failed to create event:", error);
      return false;
    }
  }, [refreshEvents]);

  return (
    <EventContext.Provider value={{ events, addEvent, refreshEvents }}>
      {children}
    </EventContext.Provider>
  );
};
