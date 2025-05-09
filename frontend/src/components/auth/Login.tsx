import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tripService } from '../../services/tripService';
import { authService } from '../../services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, confirmationError } = useAuth();
  
  // Check if we are in the process of logging out or have a tripId to claim
  const isLoggingOut = location.state && (location.state as any).loggingOut;
  const tripIdToClaim = location.state && (location.state as any).tripId;

  // Add timeout to redirect if stuck on logout screen
  useEffect(() => {
    // If we're in the logging out state, set a timeout to redirect to home
    if (isLoggingOut) {
      const redirectTimeout = setTimeout(() => {
        console.log('🔍 Login: Logout redirect timeout triggered, navigating to home');
        // Use replace to prevent browser back button from returning to the logout screen
        navigate('/', { replace: true });
      }, 3000); // 3 seconds timeout
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [isLoggingOut, navigate]);

  // Redirect if already authenticated - check this in the background
  // This is now handled by the AuthAwareLoginRoute in App.tsx
  // Keeping only the console logs for debugging
  useEffect(() => {
    console.log('🔍 Login: Auth state check - isAuthenticated:', isAuthenticated, 'isLoggingOut:', isLoggingOut);
  }, [isAuthenticated, isLoggingOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('🔍 Login: Submit button clicked, attempting login...');

    const loginTimeout = setTimeout(() => {
      console.log('⚠️ Login is taking longer than expected...');
      // Optionally, you could show a toast or inline spinner enhancement
    }, 8000); // just warn, don’t trigger failure

    try {
      console.log('🔍 Login: Calling login function from AuthContext...');
      await login(email, password);
      console.log('✅ Login: Login function completed successfully');
      clearTimeout(loginTimeout);

      // Check if there's a trip to claim
      if (tripIdToClaim) {
        try {
          console.log('🔍 Login: Checking trip to claim:', tripIdToClaim);
          const trip = await tripService.getTripById(tripIdToClaim);
          
          if (trip && trip.email === email && !trip.user_id) {
            console.log('✅ Login: Found matching trip to claim');
            // Update the trip with the user's ID
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              await tripService.updateTrip({
                ...trip,
                user_id: currentUser.id
              });
            }
          }
          // Navigate to dashboard after claim attempt (whether successful or not)
          navigate('/');
        } catch (claimErr) {
          console.error('❌ Login: Error claiming trip:', claimErr);
          // Still navigate to dashboard even if claim fails
          navigate('/');
        }
      } else {
        // Standard login flow without trip claiming
        navigate('/');
      }
    } catch (err: any) {
      console.error('❌ Login: Error during login:', err);
      clearTimeout(loginTimeout);
      if (err.message && err.message.includes('confirm your email')) {
        setError('Please check your email and confirm your account before logging in.');
      } else {
        setError('Invalid email or password');
      }
    } finally {
      console.log('🔍 Login: Setting isLoading to false...');
      clearTimeout(loginTimeout);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-light py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-primary">
            {isLoggingOut ? 'Signing out...' : 'Sign in to your account'}
          </h2>
          {!isLoggingOut && (
            <p className="mt-2 text-center text-sm text-primary">
              Or{' '}
              <Link to="/register" className="font-medium text-accent hover:text-accent/90">
                create a new account
              </Link>
            </p>
          )}
        </div>

        {/* Don't show error or form while logging out */}
        {!isLoggingOut && (
          <>
            {(error || confirmationError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error || confirmationError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-secondary-light/30 placeholder-gray-500 text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-secondary-light/30 placeholder-gray-500 text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="select-night-button w-full flex justify-center items-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </>
        )}
        
        {/* Show loading indicator while logging out */}
        {isLoggingOut && (
          <div className="flex justify-center mt-8">
            <div className="animate-pulse text-primary text-lg">Signing you out...</div>
          </div>
        )}
      </motion.div>
    </div>
  );
};