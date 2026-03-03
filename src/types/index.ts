export type UserRole = 'student' | 'college_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  role: UserRole;
}

export type EventCategory = 'sports' | 'hackathon' | 'cultural' | 'workshop' | 'seminar' | 'other';

export interface CollegeEvent {
  id: string;
  collegeId: string;
  collegeName: string;
  title: string;
  description: string;
  category: EventCategory;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  image?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}
