import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, LayoutDashboard, CalendarDays, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link to={to}>
    <Button
      variant="ghost"
      size="sm"
      className={`gap-1.5 rounded-lg transition-all duration-200 ${active ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            Campus<span className="text-accent">Event</span>Hub
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <NavItem to="/events" icon={CalendarDays} label="Events" active={location.pathname === '/events'} />
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} />
              {user?.role === 'college_admin' && (
                <NavItem to="/create-event" icon={Plus} label="Create" active={location.pathname === '/create-event'} />
              )}
              <div className="ml-3 flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5">
                  <div className="h-6 w-6 rounded-full gradient-campus flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="rounded-full bg-accent/15 text-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {user?.role === 'college_admin' ? 'Admin' : 'Student'}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-destructive/10 hover:text-destructive rounded-lg">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-lg">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-lg gradient-campus border-0 text-primary-foreground hover:opacity-90">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl animate-fade-in p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link to="/events" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2"><CalendarDays className="h-4 w-4" />Events</Button>
              </Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2"><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
              </Link>
              {user?.role === 'college_admin' && (
                <Link to="/create-event" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2"><Plus className="h-4 w-4" />Create Event</Button>
                </Link>
              )}
              <div className="border-t border-border/50 pt-2 mt-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive gap-1">
                    <LogOut className="h-3.5 w-3.5" />Logout
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;