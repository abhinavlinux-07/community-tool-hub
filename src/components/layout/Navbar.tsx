import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { 
  Wrench, 
  LogOut, 
  User, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'architect':
        return '/b2b';
      case 'tool_doctor':
        return '/maintenance';
      default:
        return '/dashboard';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'architect':
        return 'B2B Professional';
      case 'tool_doctor':
        return 'Tool Doctor';
      default:
        return 'Community Member';
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              CTL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/browse" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Browse Tools
            </Link>
            <Link 
              to="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link 
              to="/impact" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Impact
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-secondary-foreground">
                    {getRoleLabel()}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={getDashboardLink()}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <nav className="flex flex-col gap-2">
              <Link 
                to="/browse" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Tools
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              {user ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    className="px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth" 
                    className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/auth?mode=signup" 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
