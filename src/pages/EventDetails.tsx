import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Building2, UserCircle2, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const EventDetails = () => {
    const { id } = useParams();
    const { events } = useEvents();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();

    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const event = events.find((e) => e.id === id);

    useEffect(() => {
        if (id) {
            // Fetch feedback for this event
            apiFetch(`/events/${id}/feedback`)
                .then(setFeedbacks)
                .catch(console.error);
        }
    }, [id]);

    if (!event) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold">Event not found</h2>
                <Link to="/events" className="text-primary hover:underline mt-4 inline-block">Back to events</Link>
            </div>
        );
    }

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            toast({ title: 'Please login', description: 'You must be logged in to register.', variant: 'destructive' });
            return;
        }
        setIsRegistering(true);
        try {
            await apiFetch(`/events/${id}/register`, { method: 'POST' });
            toast({ title: 'Registered successfully!', description: 'Your registration is pending approval.' });
        } catch (error: any) {
            toast({ title: 'Registration failed', description: error?.message || 'Failed to register', variant: 'destructive' });
        } finally {
            setIsRegistering(false);
        }
    };

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        setIsSubmittingFeedback(true);
        try {
            const newFeedback = await apiFetch(`/events/${id}/feedback`, {
                method: 'POST',
                body: JSON.stringify({ rating, comments }),
            });
            setFeedbacks([newFeedback, ...feedbacks]);
            setComments('');
            setRating(5);
            toast({ title: 'Feedback submitted', description: 'Thank you for your feedback!' });
        } catch (error: any) {
            toast({ title: 'Failed to submit feedback', description: error?.message || 'Error occurred', variant: 'destructive' });
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    return (
        <div className="container py-8 max-w-4xl space-y-8">
            <Link to="/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
            </Link>

            <div className="space-y-6">
                <div className="space-y-4">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{event.category.toUpperCase()}</Badge>
                    <h1 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">{event.title}</h1>
                    <p className="text-xl text-muted-foreground">{event.description}</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 bg-card p-6 rounded-xl border border-border">
                    <div className="space-y-4 flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary"><Building2 className="h-5 w-5" /></div>
                            <div>
                                <p className="text-sm font-medium leading-none">College</p>
                                <p className="text-sm text-muted-foreground mt-1">{event.collegeName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-campus-green/10 p-2 rounded-lg text-campus-green"><CalendarDays className="h-5 w-5" /></div>
                            <div>
                                <p className="text-sm font-medium leading-none">Date</p>
                                <p className="text-sm text-muted-foreground mt-1">{format(startDate, 'MMM d, yyyy')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-2 rounded-lg text-accent"><MapPin className="h-5 w-5" /></div>
                            <div>
                                <p className="text-sm font-medium leading-none">Location</p>
                                <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg space-y-4 text-center">
                        <h3 className="font-semibold text-lg">Interested in this event?</h3>
                        <p className="text-sm text-muted-foreground px-4">Secure your spot now and join other students.</p>
                        {user?.role === 'student' ? (
                            <Button size="lg" className="w-full sm:w-auto" onClick={handleRegister} disabled={isRegistering}>
                                {isRegistering ? 'Registering...' : 'Register Now'}
                            </Button>
                        ) : user ? (
                            <Button size="lg" className="w-full sm:w-auto" disabled>Admins cannot register</Button>
                        ) : (
                            <Link to="/login"><Button size="lg" className="w-full sm:w-auto">Login to Register</Button></Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-8 mt-12 space-y-8">
                <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Event Feedback
                </h2>

                {user && (
                    <form onSubmit={handleSubmitFeedback} className="space-y-4 bg-muted/30 p-6 rounded-xl border border-border/50">
                        <h3 className="font-semibold">Leave your review</h3>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Rating (1-5)</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <Button
                                        key={num}
                                        type="button"
                                        variant={rating >= num ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setRating(num)}
                                    >
                                        <Star className={`h-4 w-4 ${rating >= num ? 'fill-current' : ''}`} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Comments</label>
                            <Textarea
                                placeholder="Share your experience..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isSubmittingFeedback}>
                            {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                    </form>
                )}

                <div className="space-y-4">
                    {feedbacks.length > 0 ? feedbacks.map((fb, idx) => (
                        <div key={idx} className="bg-card p-4 rounded-lg border border-border space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{fb.user_id?.name || 'Anonymous Student'}</p>
                                        <div className="flex text-yellow-500">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < fb.rating ? 'fill-current' : 'text-muted/30'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {fb.createdAt ? format(new Date(fb.createdAt), 'MMM d, yyyy') : 'Recently'}
                                </span>
                            </div>
                            <p className="text-sm pl-10 text-foreground/80">{fb.comments}</p>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-center py-8 bg-muted/10 rounded-lg">No feedback yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
