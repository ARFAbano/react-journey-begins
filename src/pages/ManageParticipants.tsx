import { useParams, Navigate, Link } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, Star, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const ManageParticipants = () => {
  const { id } = useParams();
  const { events } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { getEventRegistrations, updateStatus } = useRegistrations();
  const { getEventFeedbacks } = useFeedback();
  const { toast } = useToast();

  if (!isAuthenticated || !user || user.role !== 'college_admin') return <Navigate to="/dashboard" replace />;

  const event = events.find(e => e.id === id);
  if (!event) return <Navigate to="/dashboard" replace />;
  if (event.collegeName !== user.college) return <Navigate to="/dashboard" replace />;

  const registrations = getEventRegistrations(event.id);
  const feedbacks = getEventFeedbacks(event.id);
  const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 'N/A';
  const approved = registrations.filter(r => r.status === 'approved').length;
  const pending = registrations.filter(r => r.status === 'pending').length;

  const handleStatus = (regId: string, status: 'approved' | 'rejected') => {
    updateStatus(regId, status);
    toast({ title: `Registration ${status}`, description: `Participant has been ${status}.` });
  };

  const statusBadge = (status: string) => {
    const config: Record<string, { className: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800' },
      approved: { className: 'bg-green-100 text-green-800' },
      rejected: { className: 'bg-red-100 text-red-800' },
    };
    return <Badge className={config[status]?.className || ''}>{status}</Badge>;
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">← Back to Dashboard</Link>
        <h1 className="font-display text-3xl font-bold text-foreground">Manage: {event.title}</h1>
        <p className="text-muted-foreground mt-1">View registrations and feedback</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold font-display">{registrations.length}</p>
              <p className="text-xs text-muted-foreground">Total Registrations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <CheckCircle2 className="h-5 w-5 text-campus-green" />
            <div>
              <p className="text-2xl font-bold font-display">{approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Clock className="h-5 w-5 text-campus-amber" />
            <div>
              <p className="text-2xl font-bold font-display">{pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Star className="h-5 w-5 text-campus-amber" />
            <div>
              <p className="text-2xl font-bold font-display">{avgRating}</p>
              <p className="text-xs text-muted-foreground">Avg Rating ({feedbacks.length})</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations">Registrations ({registrations.length})</TabsTrigger>
          <TabsTrigger value="feedback">Feedback ({feedbacks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {registrations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No registrations yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map(reg => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.userName}</TableCell>
                        <TableCell>{reg.userEmail}</TableCell>
                        <TableCell>{reg.userCollege}</TableCell>
                        <TableCell>{format(new Date(reg.registeredAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{statusBadge(reg.status)}</TableCell>
                        <TableCell>
                          {reg.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleStatus(reg.id, 'approved')}>
                                <CheckCircle2 className="h-3 w-3" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive" onClick={() => handleStatus(reg.id, 'rejected')}>
                                <XCircle className="h-3 w-3" /> Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {feedbacks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No feedback yet.</p>
              ) : (
                <div className="space-y-3">
                  {/* Rating Distribution */}
                  <div className="grid gap-2 sm:grid-cols-5 mb-4">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = feedbacks.filter(f => f.rating === star).length;
                      const pct = Math.round((count / feedbacks.length) * 100);
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="flex items-center gap-0.5 w-8">
                            {star}<Star className="h-3 w-3 fill-campus-amber text-campus-amber" />
                          </span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-campus-amber rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-6">{count}</span>
                        </div>
                      );
                    })}
                  </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageParticipants;
