import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, UserCircle2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ParticipantManagement = () => {
    const { id } = useParams();
    const { events } = useEvents();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();

    const [registrations, setRegistrations] = useState<any[]>([]);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const event = events.find(e => e.id === id);

    useEffect(() => {
        if (id && user?.role === 'college_admin') {
            const fetchData = async () => {
                try {
                    const [regsRes, fbRes] = await Promise.all([
                        apiFetch(`/admin/events/${id}/registrations`),
                        apiFetch(`/admin/events/${id}/feedback`)
                    ]);
                    setRegistrations(regsRes || []);
                    setFeedbacks(fbRes || []);
                } catch (error) {
                    console.error("Failed to fetch admin data", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setLoading(false);
        }
    }, [id, user]);

    if (!isAuthenticated || user?.role !== 'college_admin') return <Navigate to="/" replace />;
    if (!event) return <div className="container py-20 text-center"><h2 className="text-2xl font-bold">Event not found</h2></div>;

    const handleStatusUpdate = async (regId: string, status: 'approved' | 'rejected') => {
        try {
            const updated = await apiFetch(`/admin/registrations/${regId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            setRegistrations(registrations.map(r => r._id === regId ? { ...r, status: updated.status } : r));
            toast({ title: `Registration ${status}` });
        } catch (error: any) {
            toast({ title: 'Failed to update status', description: error?.message || 'Error occurred', variant: 'destructive' });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-campus-green text-primary-foreground">Approved</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
            default: return <Badge variant="secondary">Pending</Badge>;
        }
    };

    const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 'No ratings';

    return (
        <div className="container py-8 max-w-5xl space-y-8">
            <Link to={`/events/${id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Event Details
            </Link>

            <div>
                <h1 className="font-display text-3xl font-bold">Manage Participants & Feedback</h1>
                <p className="text-muted-foreground text-lg">{event.title}</p>
            </div>

            {loading ? (
                <div className="py-20 text-center">Loading management dashboard...</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Registrations ({registrations.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {registrations.length > 0 ? registrations.map((reg) => (
                                <div key={reg._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted/30 rounded-lg border border-border gap-4">
                                    <div>
                                        <h4 className="font-medium">{reg.user_id?.name || 'Unknown Student'}</h4>
                                        <p className="text-sm text-muted-foreground">{reg.user_id?.email || 'No email'}</p>
                                        <div className="mt-1">{getStatusBadge(reg.status)}</div>
                                    </div>
                                    {reg.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="text-campus-green border-campus-green hover:bg-campus-green/10" onClick={() => handleStatusUpdate(reg._id, 'approved')}>
                                                <Check className="h-4 w-4 mr-1" /> Approve
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleStatusUpdate(reg._id, 'rejected')}>
                                                <X className="h-4 w-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-4">No registrations yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Feedback Analysis</CardTitle>
                                <div className="text-right">
                                    <span className="text-2xl font-bold">{avgRating}</span>
                                    {avgRating !== 'No ratings' && <span className="text-muted-foreground text-sm"> / 5</span>}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {feedbacks.length > 0 ? feedbacks.map((fb) => (
                                <div key={fb._id} className="p-4 bg-muted/30 rounded-lg border border-border space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <UserCircle2 className="h-6 w-6 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{fb.user_id?.name || 'Anonymous'}</p>
                                                <div className="flex text-yellow-500">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className={`h-3 w-3 ${i < fb.rating ? 'fill-current' : 'text-muted/30'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {fb.createdAt ? format(new Date(fb.createdAt), 'MMM d, yyyy') : ''}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/80">{fb.comments}</p>
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-4">No feedback received yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ParticipantManagement;
