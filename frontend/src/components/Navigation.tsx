import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, BookMarked, User, ChevronDown, ChevronUp, Settings, LogOut, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTripPlan } from '../context/TripPlanContext';
import { destinations } from '../data/destinations';

interface NavigationProps {
  isPaid?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isPaid = false }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { clearSelectedCampgrounds } = useTripPlan();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const [showDesktopDestinations, setShowDesktopDestinations] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMobileMenu &&
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }

      if (
        showUserMenu &&
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target as Node) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu, showUserMenu]);

  // Check if we're in the dashboard section
  const isDashboard = location.pathname.startsWith('/dashboard');

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const handleNavigation = (path: string) => {
    clearSelectedCampgrounds();
    navigate(path);
    
    setTimeout(() => {
      setShowMobileMenu(false);
      setShowUserMenu(false);
      setShowDestinations(false);
      setShowDesktopDestinations(false);
    }, 0);
  };

  const handleLogout = async () => {
    clearSelectedCampgrounds();
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setShowDestinations(false);
    setShowDesktopDestinations(false);
    
    try {
      // Show some visual feedback that logout is in progress
      // by navigating to login first with a state param
      navigate('/login', { state: { loggingOut: true } });
      
      // Then complete the logout process in the background
      await logout();
      
      // After logout completes, redirect to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // If there's an error, still try to navigate home
      navigate('/', { replace: true });
    }
  };

  const handleLogoClick = () => {
    clearSelectedCampgrounds();
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setShowDestinations(false);
    setShowDesktopDestinations(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-beige shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-32 flex items-center justify-between">
          {/* Mobile Menu Button - Only visible on small screens */}
          <div className="md:hidden relative">
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-primary-dark p-2 hover:bg-beige-dark/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  ref={mobileMenuRef}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuVariants}
                  className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                >
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation('/')}
                      className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                    >
                      <span className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span>Book</span>
                      </span>
                    </button>

                    {/* Destinations Dropdown */}
                    <div>
                      <button
                        onClick={() => setShowDestinations(!showDestinations)}
                        className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                      >
                        <span className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Map className="w-4 h-4" />
                            <span>Destinations</span>
                          </span>
                          {showDestinations ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      <AnimatePresence>
                        {showDestinations && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-beige/20"
                          >
                            {destinations.map(destination => (
                              <button
                                key={destination.id}
                                onClick={() => handleNavigation(`/destinations/${destination.id}`)}
                                className="w-full flex items-center gap-2 px-8 py-2 text-left text-primary-dark/80 hover:bg-beige/50 transition-colors font-display"
                              >
                                <Map className="w-4 h-4" />
                                <span>{destination.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={() => handleNavigation('/about')}
                      className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                    >
                      <span className="flex items-center gap-2">
                        <BookMarked className="w-4 h-4" />
                        <span>About</span>
                      </span>
                    </button>

                    {isAuthenticated && (
                      <button
                        onClick={() => handleNavigation('/dashboard')}
                        className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>My Trips</span>
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation - Only visible on medium screens and up */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/')}
              className="text-primary-dark hover:text-primary-dark/80 font-display transition-colors"
            >
              Book
            </button>
            
            {/* Desktop Destinations Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDesktopDestinations(!showDesktopDestinations)}
                onMouseEnter={() => setShowDesktopDestinations(true)}
                onMouseLeave={() => setShowDesktopDestinations(false)}
                className="text-primary-dark hover:text-primary-dark/80 font-display transition-colors flex items-center gap-1"
              >
                Destinations
                {showDesktopDestinations ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              <AnimatePresence>
                {showDesktopDestinations && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={() => setShowDesktopDestinations(true)}
                    onMouseLeave={() => setShowDesktopDestinations(false)}
                    className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {destinations.map(destination => (
                      <button
                        key={destination.id}
                        onClick={() => handleNavigation(`/destinations/${destination.id}`)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-primary-dark/80 hover:bg-beige/50 transition-colors font-display"
                      >
                        <span>{destination.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              onClick={() => handleNavigation('/about')}
              className="text-primary-dark hover:text-primary-dark/80 font-display transition-colors"
            >
              About
            </button>
            
            {isAuthenticated && (
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="text-primary-dark hover:text-primary-dark/80 font-display transition-colors"
              >
                My Trips
              </button>
            )}
          </div>

          {/* Centered Logo */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer transform hover:scale-105 transition-transform duration-200" 
            onClick={handleLogoClick}
          >
            <img
              src="https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742417228/CaravanTripPlan_d6vaqk.png"
              alt="CaraVan Trip Plan"
              className="h-32 w-auto"
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  ref={userMenuButtonRef}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-primary-dark hover:text-primary-dark/80 flex items-center gap-2"
                >
                  <span className="hidden md:block font-display">{user?.name}</span>
                  <User className="w-6 h-6" />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      ref={userMenuRef}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={menuVariants}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                    >
                      <div className="px-4 py-2 border-b mb-2">
                        <div className="font-display text-lg text-primary-dark">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <button
                          onClick={() => handleNavigation('/dashboard')}
                          className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                        >
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>My Trips</span>
                          </span>
                        </button>
                        <button
                          onClick={() => handleNavigation('/dashboard/settings')}
                          className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                        >
                          <span className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                        >
                          <span className="flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="text-sm md:text-base text-primary-dark hover:text-primary-dark/80 font-display"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};