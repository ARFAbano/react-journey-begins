import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, LayoutDashboard, CalendarDays, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <GraduationCap className="h-7 w-7 text-accent" />
          CampusEventHub
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/events">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Events
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              {user?.role === 'college_admin' && (
                <Link to="/create-event">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Button>
                </Link>
              )}
              <div className="ml-2 flex items-center gap-3 rounded-full border border-border bg-muted px-3 py-1.5">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {user?.role === 'college_admin' ? 'Admin' : 'Student'}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
