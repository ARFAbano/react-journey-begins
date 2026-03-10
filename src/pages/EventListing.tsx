import { useState, useMemo } from 'react';
import { useEvents } from '@/context/EventContext';
import EventCard from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { COLLEGES } from '@/data/mockData';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'hackathon', label: '💻 Hackathon' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'workshop', label: '🔧 Workshop' },
  { value: 'seminar', label: '📚 Seminar' },
  { value: 'other', label: '📌 Other' },
];

const EventListing = () => {
  const { events } = useEvents();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [college, setCollege] = useState('all');

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || e.category === category;
      const matchCollege = college === 'all' || e.collegeName === college;
      return matchSearch && matchCategory && matchCollege;
    });
  }, [events, search, category, college]);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="page-header section-fade">
        <h1 className="font-display text-3xl font-bold text-foreground">Browse Events</h1>
        <p className="text-muted-foreground mt-1">Discover inter-college events across India</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 section-fade-delay-1">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-52 h-11 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={college} onValueChange={setCollege}>
            <SelectTrigger className="w-full sm:w-52 h-11 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between section-fade-delay-2">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center section-fade-delay-2">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Search className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-semibold text-foreground">No events found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 section-fade-delay-2">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListing;