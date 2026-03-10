import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Navigate, Link } from 'react-router-dom';
import EventCard from '@/components/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Plus, TrendingUp, Star, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { events } = useEvents();
  const { getUserRegistrations, getEventRegistrations, registrations } = useRegistrations();
  const { feedbacks } = useFeedback();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const isAdmin = user.role === 'college_admin';
  const myEvents = isAdmin ? events.filter(e => e.collegeName === user.college) : events;
  const myRegs = getUserRegistrations(user.id);

  // Admin stats
  const totalRegs = isAdmin ? myEvents.reduce((sum, e) => sum + getEventRegistrations(e.id).length, 0) : 0;
  const pendingRegs = isAdmin ? myEvents.reduce((sum, e) => sum + getEventRegistrations(e.id).filter(r => r.status === 'pending').length, 0) : 0;
  const eventFeedbacks = isAdmin ? feedbacks.filter(f => myEvents.some(e => e.id === f.eventId)) : [];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          {isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user.name} • {user.college}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-primary/10 p-3"><CalendarDays className="h-6 w-6 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold font-display">{isAdmin ? myEvents.length : events.length}</p>
              <p className="text-sm text-muted-foreground">{isAdmin ? 'Your Events' : 'Available Events'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-accent/10 p-3"><Users className="h-6 w-6 text-accent" /></div>
            <div>
              <p className="text-2xl font-bold font-display">{isAdmin ? totalRegs : myRegs.length}</p>
              <p className="text-sm text-muted-foreground">{isAdmin ? 'Total Registrations' : 'My Registrations'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-campus-green/10 p-3">
              {isAdmin ? <Clock className="h-6 w-6 text-campus-amber" /> : <TrendingUp className="h-6 w-6 text-campus-green" />}
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{isAdmin ? pendingRegs : myRegs.filter(r => r.status === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">{isAdmin ? 'Pending Approvals' : 'Approved'}</p>
            </div>
          </CardContent>
        </Card>
        {isAdmin ? (
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-xl bg-campus-amber/10 p-3"><Star className="h-6 w-6 text-campus-amber" /></div>
              <div>
                <p className="text-2xl font-bold font-display">{eventFeedbacks.length}</p>
                <p className="text-sm text-muted-foreground">Feedbacks Received</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="gradient-campus text-primary-foreground">
            <CardContent className="flex items-center justify-center pt-6">
              <Link to="/events"><Button variant="secondary" className="gap-2"><CalendarDays className="h-4 w-4" />Browse Events</Button></Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Student: My Registrations */}
      {!isAdmin && myRegs.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4">My Registrations</h2>
          <div className="space-y-2">
            {myRegs.map(reg => {
              const evt = events.find(e => e.id === reg.eventId);
              if (!evt) return null;
              const statusConfig: Record<string, string> = {
                pending: 'bg-yellow-100 text-yellow-800',
                approved: 'bg-green-100 text-green-800',
                rejected: 'bg-red-100 text-red-800',
              };
              return (
                <Card key={reg.id}>
                  <CardContent className="flex items-center justify-between py-3 px-4">
                    <div>
                      <Link to={`/events/${evt.id}`} className="font-medium text-foreground hover:text-primary">{evt.title}</Link>
                      <p className="text-xs text-muted-foreground">{evt.collegeName} • {format(new Date(evt.startDate), 'MMM d, yyyy')}</p>
                    </div>
                    <Badge className={statusConfig[reg.status]}>{reg.status}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin: Create button + Events */}
      {isAdmin && (
        <div className="flex gap-3">
          <Link to="/create-event"><Button className="gap-2"><Plus className="h-4 w-4" />Create Event</Button></Link>
        </div>
      )}

      {/* Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">{isAdmin ? 'Your College Events' : 'Recent Events'}</h2>
          <Link to="/events"><Button variant="outline" size="sm">View All</Button></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(isAdmin ? myEvents : events).slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} showManage={isAdmin} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
