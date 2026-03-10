import { useParams, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, MapPin, Building2, Users, Star, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  approved: { icon: CheckCircle2, label: 'Approved', className: 'bg-green-100 text-green-800' },
  rejected: { icon: XCircle, label: 'Rejected', className: 'bg-red-100 text-red-800' },
};

const EventDetail = () => {
  const { id } = useParams();
  const { events } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { registerForEvent, isRegistered, getEventRegistrations } = useRegistrations();
  const { addFeedback, getEventFeedbacks, hasUserFeedback } = useFeedback();
  const { toast } = useToast();

  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const event = events.find(e => e.id === id);
  if (!event) return <Navigate to="/events" replace />;

  const registered = user ? isRegistered(event.id, user.id) : false;
  const userReg = user ? getEventRegistrations(event.id).find(r => r.userId === user.id) : null;
  const feedbacks = getEventFeedbacks(event.id);
  const alreadyFeedback = user ? hasUserFeedback(event.id, user.id) : false;
  const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : null;
  const regCount = getEventRegistrations(event.id).length;

  const handleRegister = () => {
    if (!user) return;
    registerForEvent({ eventId: event.id, userId: user.id, userName: user.name, userEmail: user.email, userCollege: user.college });
    toast({ title: 'Registered!', description: 'Your registration is pending approval.' });
  };

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addFeedback({ eventId: event.id, userId: user.id, userName: user.name, rating, comments });
    toast({ title: 'Feedback submitted!', description: 'Thank you for your feedback.' });
    setComments('');
  };

  const categoryColors: Record<string, string> = {
    hackathon: 'bg-campus-sky text-primary-foreground',
    sports: 'bg-campus-green text-primary-foreground',
    cultural: 'bg-campus-amber text-primary-foreground',
    workshop: 'bg-primary text-primary-foreground',
    seminar: 'bg-campus-navy-light text-primary-foreground',
    other: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Event Header */}
      <div>
        <Link to="/events" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">← Back to Events</Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{event.title}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge className={categoryColors[event.category] || categoryColors.other}>{event.category}</Badge>
              {avgRating && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-campus-amber text-campus-amber" /> {avgRating} ({feedbacks.length} reviews)
                </span>
              )}
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" /> {regCount} registered
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-foreground leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Feedback & Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAuthenticated && user?.role === 'student' && !alreadyFeedback && (
                <form onSubmit={handleFeedback} className="space-y-3 border-b border-border pb-4">
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} type="button" onClick={() => setRating(s)} className="focus:outline-none">
                          <Star className={`h-6 w-6 transition-colors ${s <= rating ? 'fill-campus-amber text-campus-amber' : 'text-muted-foreground/30'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Comments</Label>
                    <Textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Share your experience..." rows={3} required />
                  </div>
                  <Button type="submit" size="sm">Submit Feedback</Button>
                </form>
              )}
              {alreadyFeedback && (
                <p className="text-sm text-muted-foreground italic">You have already submitted feedback for this event.</p>
              )}
              {feedbacks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No feedback yet. Be the first to share your thoughts!</p>
              ) : (
                <div className="space-y-3">
                  {feedbacks.map(fb => (
                    <div key={fb.id} className="rounded-lg border border-border p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{fb.userName}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`h-3.5 w-3.5 ${s <= fb.rating ? 'fill-campus-amber text-campus-amber' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{fb.comments}</p>
                      <p className="text-xs text-muted-foreground/60">{format(new Date(fb.timestamp), 'MMM d, yyyy')}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-accent" />
                <span>{event.collegeName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-accent" />
                <span>{format(new Date(event.startDate), 'MMM d, yyyy h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-accent" />
                <span>to {format(new Date(event.endDate), 'MMM d, yyyy h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{event.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Registration */}
          {isAuthenticated && user?.role === 'student' && (
            <Card>
              <CardContent className="pt-6">
                {registered && userReg ? (
                  <div className="space-y-2 text-center">
                    <Badge className={statusConfig[userReg.status].className}>
                      {React.createElement(statusConfig[userReg.status].icon, { className: 'h-3.5 w-3.5 mr-1 inline' })}
                      {statusConfig[userReg.status].label}
                    </Badge>
                    <p className="text-sm text-muted-foreground">You registered on {format(new Date(userReg.registeredAt), 'MMM d, yyyy')}</p>
                  </div>
                ) : (
                  <Button onClick={handleRegister} className="w-full gap-2">
                    <Users className="h-4 w-4" /> Register for Event
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {!isAuthenticated && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Login to register for this event</p>
                <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
