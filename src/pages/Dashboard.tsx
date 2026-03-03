import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Navigate, Link } from 'react-router-dom';
import EventCard from '@/components/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, Plus, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { events } = useEvents();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const isAdmin = user.role === 'college_admin';
  const myEvents = isAdmin ? events.filter(e => e.collegeName === user.college) : events;

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          {isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.name} • {user.college}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-primary/10 p-3">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{isAdmin ? myEvents.length : events.length}</p>
              <p className="text-sm text-muted-foreground">{isAdmin ? 'Your Events' : 'Available Events'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-accent/10 p-3">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{isAdmin ? '128' : '3'}</p>
              <p className="text-sm text-muted-foreground">{isAdmin ? 'Registrations' : 'Registered'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-campus-green/10 p-3">
              <TrendingUp className="h-6 w-6 text-campus-green" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{isAdmin ? '5' : '2'}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        {isAdmin && (
          <Card className="gradient-campus text-primary-foreground">
            <CardContent className="flex items-center justify-center pt-6">
              <Link to="/create-event">
                <Button variant="secondary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">{isAdmin ? 'Your College Events' : 'Recent Events'}</h2>
          <Link to="/events">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(isAdmin ? myEvents : events).slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
