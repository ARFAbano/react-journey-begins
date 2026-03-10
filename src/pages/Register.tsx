import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, User, Mail, Lock, Building2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(name, email, password, college, role)) {
      toast({ title: 'Account created!', description: 'Welcome to CampusEventHub.' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Registration failed', description: 'Email already exists.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-campus relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_hsl(35_92%_55%/0.1)_0%,_transparent_50%)]" />
        <div className="absolute top-20 right-20 w-56 h-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white">Join the Community</h2>
          <p className="text-white/60 text-lg leading-relaxed">Create your account and start discovering amazing inter-college events today.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8 section-fade">
          <div className="lg:hidden flex flex-col items-center gap-2 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">CampusEventHub</h1>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-1.5">Join the inter-college event community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="pl-10 h-11 rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.com" className="pl-10 h-11 rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 h-11 rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>College</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input type="text" placeholder="Enter your college name" value={college} onChange={e => setCollege(e.target.value)} className="pl-10 h-11 rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">🎓 Student</SelectItem>
                  <SelectItem value="college_admin">🛡️ College Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl gradient-campus border-0 text-primary-foreground font-semibold text-base hover:opacity-90 gap-2 mt-2">
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;