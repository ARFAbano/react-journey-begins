import { Link } from 'react-router-dom';
import { CollegeEvent } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Building2 } from 'lucide-react';
import { format } from 'date-fns';

const categoryColors: Record<string, string> = {
  hackathon: 'bg-campus-sky text-primary-foreground',
  sports: 'bg-campus-green text-primary-foreground',
  cultural: 'bg-campus-amber text-primary-foreground',
  workshop: 'bg-primary text-primary-foreground',
  seminar: 'bg-campus-navy-light text-primary-foreground',
  other: 'bg-muted text-muted-foreground',
};

const EventCard = ({ event, showManage }: { event: CollegeEvent; showManage?: boolean }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/60">
      <div className="gradient-campus h-2" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <Badge className={`shrink-0 ${categoryColors[event.category] || categoryColors.other}`}>
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-accent" />
            {event.collegeName}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-accent" />
            {format(startDate, 'MMM d')} – {format(endDate, 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {event.location}
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">View Details</Button>
          </Link>
          {showManage && (
            <Link to={`/manage/${event.id}`}>
              <Button size="sm" variant="secondary">Manage</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
