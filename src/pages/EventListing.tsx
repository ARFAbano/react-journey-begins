import { useState, useMemo } from 'react';
import { useEvents } from '@/context/EventContext';
import EventCard from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, Frown } from 'lucide-react';
import { COLLEGES } from '@/data/mockData';
import { motion } from 'framer-motion';

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
  // const [college, setCollege] = useState('all');

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || e.category === category;
      // const matchCollege = college === 'all' || e.collegeName === college;
      return matchSearch && matchCategory ;
    });
  }, [events, search, category]);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
          Browse Events<span className="text-primary">.</span>
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">Discover inter-college events across India</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">
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
              className="pl-10 h-12 rounded-xl border-2 font-medium focus:border-primary"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-52 h-12 rounded-xl border-2 font-medium"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          
        </div>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-2xl bg-muted border-2 border-border flex items-center justify-center mb-4">
            <Frown className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-xl font-display font-extrabold text-foreground">No events found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListing;
