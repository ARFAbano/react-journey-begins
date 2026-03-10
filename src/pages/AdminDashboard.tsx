import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Navigate, Link } from 'react-router-dom';
import EventCard from '@/components/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, TrendingUp, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const { events } = useEvents();

    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    if (user.role !== 'college_admin') return <Navigate to="/" replace />; // basic guard

    const myEvents = events.filter(e => e.collegeName === user.college);

    return (
        <div className="container py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                    College Admin Dashboard
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
                            <p className="text-2xl font-bold font-display">{myEvents.length}</p>
                            <p className="text-sm text-muted-foreground">Your Events</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="rounded-xl bg-accent/10 p-3">
                            <Users className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold font-display">128</p>
                            <p className="text-sm text-muted-foreground">Registrations</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="rounded-xl bg-campus-green/10 p-3">
                            <TrendingUp className="h-6 w-6 text-campus-green" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold font-display">5</p>
                            <p className="text-sm text-muted-foreground">Upcoming</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="gradient-campus text-primary-foreground">
                    <CardContent className="flex items-center justify-center pt-6 h-full">
                        <Link to="/create-event">
                            <Button variant="secondary" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Event
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Events */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold">Your College Events</h2>
                    <Link to="/events">
                        <Button variant="outline" size="sm">View All</Button>
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {myEvents.slice(0, 6).map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
