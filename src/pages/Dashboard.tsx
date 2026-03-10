import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Navigate, Link } from 'react-router-dom';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Plus, TrendingUp, Star, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, value, label, color }: { icon: any; value: string | number; label: string; color: string }) => (
  <div className="stat-card">
    <div className="relative z-10 flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold font-display text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { events } = useEvents();
  const { getUserRegistrations, getEventRegistrations } = useRegistrations();
  const { feedbacks } = useFeedback();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const isAdmin = user.role === 'college_admin';
  const myEvents = isAdmin ? events.filter(e => e.collegeName === user.college) : events;
  const myRegs = getUserRegistrations(user.id);
  const totalRegs = isAdmin ? myEvents.reduce((sum, e) => sum + getEventRegistrations(e.id).length, 0) : 0;
  const pendingRegs = isAdmin ? myEvents.reduce((sum, e) => sum + getEventRegistrations(e.id).filter(r => r.status === 'pending').length, 0) : 0;
  const eventFeedbacks = isAdmin ? feedbacks.filter(f => myEvents.some(e => e.id === f.eventId)) : [];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="page-header section-fade">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, <span className="font-medium text-foreground">{user.name}</span> • {user.college}</p>
          </div>
          {isAdmin && (
            <Link to="/create-event">
              <Button className="gap-2 rounded-xl gradient-amber border-0 text-primary-foreground hover:opacity-90 shadow-md shadow-accent/15">
                <Plus className="h-4 w-4" />Create Event
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 section-fade-delay-1">
        <StatCard icon={CalendarDays} value={isAdmin ? myEvents.length : events.length} label={isAdmin ? 'Your Events' : 'Available Events'} color="bg-primary/10 text-primary" />
        <StatCard icon={Users} value={isAdmin ? totalRegs : myRegs.length} label={isAdmin ? 'Total Registrations' : 'My Registrations'} color="bg-accent/10 text-accent" />
        <StatCard icon={isAdmin ? Clock : CheckCircle2} value={isAdmin ? pendingRegs : myRegs.filter(r => r.status === 'approved').length} label={isAdmin ? 'Pending Approvals' : 'Approved'} color={isAdmin ? 'bg-campus-amber/10 text-campus-amber' : 'bg-campus-green/10 text-campus-green'} />
        {isAdmin ? (
          <StatCard icon={Star} value={eventFeedbacks.length} label="Feedbacks" color="bg-campus-amber/10 text-campus-amber" />
        ) : (
          <div className="stat-card gradient-campus text-primary-foreground flex items-center justify-center">
            <Link to="/events">
              <Button variant="secondary" className="gap-2 rounded-xl font-semibold">
                <CalendarDays className="h-4 w-4" />Browse Events
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Student: My Registrations */}
      {!isAdmin && myRegs.length > 0 && (
        <div className="section-fade-delay-2">
          <h2 className="font-display text-xl font-bold mb-4">My Registrations</h2>
          <div className="space-y-2">
            {myRegs.map(reg => {
              const evt = events.find(e => e.id === reg.eventId);
              if (!evt) return null;
              const statusStyles: Record<string, string> = {
                pending: 'bg-campus-amber/10 text-campus-amber border-campus-amber/20',
                approved: 'bg-campus-green/10 text-campus-green border-campus-green/20',
                rejected: 'bg-destructive/10 text-destructive border-destructive/20',
              };
              return (
                <div key={reg.id} className="glass-card rounded-xl flex items-center justify-between py-3 px-5 hover:shadow-md transition-all">
                  <div>
                    <Link to={`/events/${evt.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{evt.title}</Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{evt.collegeName} • {format(new Date(evt.startDate), 'MMM d, yyyy')}</p>
                  </div>
                  <Badge variant="outline" className={`border ${statusStyles[reg.status]} font-semibold text-xs uppercase tracking-wider`}>{reg.status}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Events */}
      <div className="section-fade-delay-3">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold">{isAdmin ? 'Your College Events' : 'Recent Events'}</h2>
          <Link to="/events">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(isAdmin ? myEvents : events).slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} showManage={isAdmin} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;