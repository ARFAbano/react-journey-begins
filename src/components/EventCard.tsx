import { Link } from 'react-router-dom';
import { CollegeEvent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Building2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const categoryConfig: Record<string, { bg: string; dot: string }> = {
  hackathon: { bg: 'bg-campus-sky/10 text-campus-sky border-campus-sky/20', dot: 'bg-campus-sky' },
  sports: { bg: 'bg-campus-green/10 text-campus-green border-campus-green/20', dot: 'bg-campus-green' },
  cultural: { bg: 'bg-campus-amber/10 text-campus-amber border-campus-amber/20', dot: 'bg-campus-amber' },
  workshop: { bg: 'bg-primary/10 text-primary border-primary/20', dot: 'bg-primary' },
  seminar: { bg: 'bg-campus-navy-light/10 text-campus-navy-light border-campus-navy-light/20', dot: 'bg-campus-navy-light' },
  other: { bg: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
};

const EventCard = ({ event, showManage }: { event: CollegeEvent; showManage?: boolean }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const cat = categoryConfig[event.category] || categoryConfig.other;

  return (
    <div className="glass-card-hover rounded-2xl overflow-hidden group">
      {/* Top accent */}
      <div className="h-1.5 gradient-campus" />
      
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {event.title}
          </h3>
          <Badge variant="outline" className={`shrink-0 text-[10px] font-bold uppercase tracking-wider border ${cat.bg}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${cat.dot}`} />
            {event.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="space-y-2">
          {[
            { icon: Building2, text: event.collegeName },
            { icon: CalendarDays, text: `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}` },
            { icon: MapPin, text: event.location },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <item.icon className="h-3.5 w-3.5 text-accent shrink-0" />
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full rounded-lg gap-1.5 group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              View Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
          {showManage && (
            <Link to={`/manage/${event.id}`}>
              <Button size="sm" className="rounded-lg gradient-amber border-0 text-primary-foreground hover:opacity-90">Manage</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;