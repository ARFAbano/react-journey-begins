import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, CalendarDays, Users, Zap, ArrowRight, Sparkles, Globe, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const features = [
  { icon: CalendarDays, title: 'Discover Events', desc: 'Browse upcoming inter-college events filtered by category, date, or college.', color: 'bg-campus-sky/10 text-campus-sky' },
  { icon: Users, title: 'Easy Registration', desc: 'Register for events with a single click and track your participation status.', color: 'bg-campus-green/10 text-campus-green' },
  { icon: Zap, title: 'Admin Dashboard', desc: 'Create, manage and track events with powerful analytics and tools.', color: 'bg-accent/10 text-accent' },
  { icon: Globe, title: 'Inter-College', desc: 'Connect with students from top colleges across India for competitions.', color: 'bg-primary/10 text-primary' },
  { icon: Sparkles, title: 'Live Feedback', desc: 'Rate events and read reviews from other participants in real-time.', color: 'bg-campus-amber/10 text-campus-amber' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Secure system with student and admin roles for proper management.', color: 'bg-campus-green/10 text-campus-green' },
];

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-campus" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_hsl(200_75%_50%/0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(35_92%_55%/0.1)_0%,_transparent_40%)]" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-[15%] w-64 h-64 rounded-full bg-campus-sky/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-accent/8 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-4xl px-4 text-center space-y-8 section-fade">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 floating-glow">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.1]">
              Campus<span className="text-gradient-amber bg-clip-text" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, hsl(35, 92%, 55%), hsl(35, 85%, 75%))', WebkitBackgroundClip: 'text' }}>Event</span>Hub
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/70 leading-relaxed sm:text-xl">
              Your centralized platform for inter-college events. Discover hackathons, sports fests, cultural programs, and workshops from top colleges.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <>
                <Link to="/events">
                  <Button size="lg" className="gap-2 text-base font-semibold rounded-xl gradient-amber border-0 text-primary-foreground hover:opacity-90 px-8 h-12 shadow-lg shadow-accent/20">
                    <CalendarDays className="h-5 w-5" />Browse Events
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="gap-2 text-base font-semibold rounded-xl border-white/25 text-white hover:bg-white/10 px-8 h-12 backdrop-blur-sm">
                    Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="gap-2 text-base font-semibold rounded-xl gradient-amber border-0 text-primary-foreground hover:opacity-90 px-8 h-12 shadow-lg shadow-accent/20">
                    <Zap className="h-5 w-5" />Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="gap-2 text-base font-semibold rounded-xl border-white/25 text-white hover:bg-white/10 px-8 h-12 backdrop-blur-sm">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            {[
              { value: '500+', label: 'Events' },
              { value: '50+', label: 'Colleges' },
              { value: '10K+', label: 'Students' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold font-display text-white">{s.value}</p>
                <p className="text-sm text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <div className="text-center mb-16 section-fade">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-display text-4xl font-bold text-foreground">Why CampusEventHub?</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Everything you need to discover, manage, and participate in inter-college events.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-7 group">
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl gradient-campus p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(35_92%_55%/0.08)_0%,_transparent_60%)]" />
          <div className="relative z-10 space-y-5">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to explore campus events?</h2>
            <p className="text-white/70 max-w-lg mx-auto">Join thousands of students discovering inter-college events every day.</p>
            <Link to={isAuthenticated ? '/events' : '/register'}>
              <Button size="lg" className="gradient-amber border-0 text-primary-foreground rounded-xl px-8 h-12 hover:opacity-90 shadow-lg shadow-accent/20 mt-2">
                {isAuthenticated ? 'Browse Events' : 'Get Started Now'} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-10 text-center">
        <div className="container flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">CampusEventHub</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CampusEventHub. Built for inter-college event management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;