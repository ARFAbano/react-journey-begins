import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, CalendarDays, Users, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="gradient-campus relative flex min-h-[85vh] flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_50%,_hsl(220_60%_15%/0.6)_100%)]" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 backdrop-blur-sm">
            <GraduationCap className="h-10 w-10 text-accent" />
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-primary-foreground sm:text-6xl">
            Campus<span className="text-accent">Event</span>Hub
          </h1>
          <p className="mx-auto max-w-xl text-lg text-primary-foreground/80">
            Your centralized platform for inter-college events. Browse hackathons, sports, cultural fests, and workshops from top colleges across India.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/events"><Button size="lg" variant="secondary" className="gap-2 text-base font-semibold"><CalendarDays className="h-5 w-5" />Browse Events</Button></Link>
                <Link to="/dashboard"><Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10">Dashboard</Button></Link>
              </>
            ) : (
              <>
                <Link to="/register"><Button size="lg" variant="secondary" className="gap-2 text-base font-semibold"><Zap className="h-5 w-5" />Get Started</Button></Link>
                <Link to="/login"><Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10">Sign In</Button></Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <h2 className="mb-12 text-center font-display text-3xl font-bold">Why CampusEventHub?</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: CalendarDays, title: 'Discover Events', desc: 'Browse upcoming inter-college events filtered by category, date, or college.' },
            { icon: Users, title: 'Easy Registration', desc: 'Register for events with a single click and track your participation.' },
            { icon: Zap, title: 'College Admin Tools', desc: 'Create, manage and track events with powerful admin dashboards.' },
          ].map((f, i) => (
            <div key={i} className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 CampusEventHub. Built for inter-college event management.</p>
      </footer>
    </div>
  );
};

export default Index;
