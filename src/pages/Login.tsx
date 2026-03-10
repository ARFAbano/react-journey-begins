import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Login failed', description: 'Invalid credentials. Try demo accounts.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-campus relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_hsl(200_75%_50%/0.15)_0%,_transparent_50%)]" />
        <div className="absolute top-16 left-16 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-16 right-16 w-64 h-64 rounded-full bg-campus-sky/10 blur-3xl" />
        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white">CampusEventHub</h2>
          <p className="text-white/60 text-lg leading-relaxed">Your gateway to inter-college events, hackathons, sports fests, and more.</p>
          <div className="flex justify-center gap-6 pt-4">
            {['500+ Events', '50+ Colleges', '10K+ Students'].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-sm font-semibold text-white/80">{s.split(' ')[0]}</p>
                <p className="text-xs text-white/40">{s.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8 section-fade">
          <div className="lg:hidden flex flex-col items-center gap-2 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">CampusEventHub</h1>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-1.5">Sign in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.com" className="pl-10 h-11 rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 h-11 rounded-xl" required />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl gradient-campus border-0 text-primary-foreground font-semibold text-base hover:opacity-90 gap-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-background p-2.5 border border-border/50">
                <p className="font-medium text-foreground">Student</p>
                <p className="text-muted-foreground font-mono">student@demo.com</p>
              </div>
              <div className="rounded-lg bg-background p-2.5 border border-border/50">
                <p className="font-medium text-foreground">Admin</p>
                <p className="text-muted-foreground font-mono">admin@demo.com</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center pt-1">Use any password to login</p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;