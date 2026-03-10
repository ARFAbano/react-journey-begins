import React, { createContext, useContext, useState, useCallback } from 'react';
import { Feedback } from '@/types';

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (fb: Omit<Feedback, 'id' | 'timestamp'>) => void;
  getEventFeedbacks: (eventId: string) => Feedback[];
  hasUserFeedback: (eventId: string, userId: string) => boolean;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const stored = localStorage.getItem('campus_feedbacks');
    return stored ? JSON.parse(stored) : [];
  });

  const save = (fbs: Feedback[]) => {
    localStorage.setItem('campus_feedbacks', JSON.stringify(fbs));
    return fbs;
  };

  const addFeedback = useCallback((fb: Omit<Feedback, 'id' | 'timestamp'>) => {
    setFeedbacks(prev => {
      if (prev.some(f => f.eventId === fb.eventId && f.userId === fb.userId)) return prev;
      const newFb: Feedback = { ...fb, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
      return save([newFb, ...prev]);
    });
  }, []);

  const getEventFeedbacks = useCallback((eventId: string) => {
    return feedbacks.filter(f => f.eventId === eventId);
  }, [feedbacks]);

  const hasUserFeedback = useCallback((eventId: string, userId: string) => {
    return feedbacks.some(f => f.eventId === eventId && f.userId === userId);
  }, [feedbacks]);

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, getEventFeedbacks, hasUserFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};
