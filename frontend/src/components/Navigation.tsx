import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, BookMarked, User, ChevronDown, ChevronUp, Settings, LogOut, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { destinations } from '../data/destinations';

interface NavigationProps {
  isPaid?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isPaid = false }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);

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
    // Close menus first
    setShowMenu(false);
    setShowDestinations(false);
    // Then navigate
    setTimeout(() => {
      navigate(path);
    }, 0);
  };

  const handleLogout = () => {
    setShowMenu(false);
    setShowDestinations(false);
    logout();
    setTimeout(() => {
      navigate('/login');
    }, 0);
  };

  const handleLogoClick = () => {
    setShowMenu(false);
    setShowDestinations(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-beige shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-32 flex items-center justify-between">
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-primary-dark p-2 hover:bg-beige-dark/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuVariants}
                  className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                >
                  {isAuthenticated && (
                    <>
                      <div className="px-4 py-2 border-b mb-2">
                        <div className="font-display text-lg text-primary-dark">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation('/')}
                      className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                    >
                      <span className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
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

                    <div className="border-t my-2"></div>

                    {isAuthenticated ? (
                      <>
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
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavigation('/login')}
                        className="w-full text-left px-4 py-2 text-primary-dark hover:bg-beige/50 transition-colors font-display"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Sign In</span>
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-primary-dark hover:text-primary-dark/80"
              >
                <User className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="text-sm text-primary-dark hover:text-primary-dark/80 font-display"
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