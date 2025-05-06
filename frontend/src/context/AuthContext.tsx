import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, SavedTrip } from '../types';
import { authService } from '../services/authService';
import { tripService } from '../services/tripService';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{success: boolean, message: string}>;
  logout: () => Promise<void>;
  updateUserTrips: (trips: SavedTrip[]) => void;
  loading: boolean;
  confirmationError: string | null;
  authCheckComplete: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Helper function to format destination ID to display name
const formatDestinationName = (destinationId: string): string => {
  return destinationId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Optimized function to check user session
  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setAuthCheckComplete(true);
    }
  }, []);

  useEffect(() => {
    // Check for existing auth session
    // Use a faster lightweight check first then do a full refresh
    const initialCheck = async () => {
      try {
        // Quick check if there's a session using Supabase directly
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session, we can stop loading immediately
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          setAuthCheckComplete(true);
          return;
        }
        
        // If there is a session, do the full user data fetch
        await checkSession();
      } catch (error) {
        console.error('Initial auth check error:', error);
        setLoading(false);
        setAuthCheckComplete(true);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // We'll handle this ourselves in the login method
          // But we still want to update state if session exists
          // to handle cases like refresh or direct URL navigation
          if (!isAuthenticated) {
            console.log('🔍 AuthContext: Auth state change detected, refreshing user data');
            await checkSession();
          }
        } catch (error) {
          console.error('❌ AuthContext: Error during auth state change handling:', error);
          // Don't throw - we want to handle this gracefully
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    initialCheck();

    // Clean up subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkSession, isAuthenticated]);

  const updateUserTrips = async (trips: SavedTrip[]) => {
    if (!user) return;
    
    try {
      // Update user state locally
      setUser({ ...user, trips });
      
      // For each trip, make sure it's in the database
      for (const trip of trips) {
        try {
          // First check if this trip already exists in Supabase
          const existingTrip = await tripService.getTripById(trip.id);
          
          if (!existingTrip) {
            // Trip doesn't exist in Supabase yet, create it
            console.log('Creating new trip in Supabase:', trip.id);
            await tripService.createTrip(
              user.id,
              {
                id: trip.trip_details.destination,
                name: formatDestinationName(trip.trip_details.destination),
                region: 'Michigan'
              },
              {
                nights: trip.trip_details.nights,
                startDate: trip.trip_details.startDate,
                guestCount: trip.trip_details.guestCount
              },
              trip.selectedCampgrounds
            );
          } else if (JSON.stringify(existingTrip) !== JSON.stringify(trip)) {
            // Trip exists but has changes, update it
            console.log('Updating existing trip in Supabase:', trip.id);
            await tripService.updateTrip(trip);
          } else {
            // Trip exists and is unchanged
            console.log('Trip already exists and is up to date in Supabase:', trip.id);
          }
        } catch (error) {
          console.error(`Error handling trip ${trip.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error updating trips:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔍 AuthContext: Starting login process...');
      setLoading(true);
      setConfirmationError(null);
      
      console.log('🔍 AuthContext: Calling authService.login...');
      const loggedInUser = await authService.login(email, password);
      console.log('✅ AuthContext: authService.login successful, user:', loggedInUser);
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      console.log('✅ AuthContext: User state updated, isAuthenticated set to true');
      
      // Return early to avoid any problems with the onAuthStateChange listener
      return;
    } catch (error: any) {
      console.error('❌ AuthContext: Login error:', error);
      
      // Check if it's an email confirmation message
      if (error.message && error.message.includes('confirm your email')) {
        setConfirmationError(error.message);
        console.log('⚠️ AuthContext: Email confirmation required');
      }
      
      throw error;
    } finally {
      console.log('🔍 AuthContext: Setting loading to false');
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{success: boolean, message: string}> => {
    try {
      setLoading(true);
      setConfirmationError(null);
      
      await authService.register(email, password, name);
      
      // If we get here, registration was technically successful but email needs confirmation
      return {
        success: true,
        message: 'Registration successful! Please check your email to confirm your account before logging in.'
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Check if it's an email confirmation message
      if (error.message && error.message.includes('confirm your account')) {
        setConfirmationError(error.message);
        return {
          success: true,
          message: error.message
        };
      }
      
      // Otherwise it's an actual error
      return {
        success: false,
        message: error.message || 'Failed to create account'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔍 AuthContext: Starting logout process...');
      setLoading(true);
      
      // First, immediately clear user data and auth state
      // This makes the UI update faster
      setUser(null);
      setIsAuthenticated(false);
      
      // Then call the logout service to complete the backend process
      await authService.logout();
      console.log('✅ AuthContext: Logout completed successfully');
      
      // Short delay to ensure everything is cleaned up
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setLoading(false);
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      setLoading(false);
      // Still resolve the promise even on error
      // This ensures navigation continues even if there's an issue with Supabase
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateUserTrips,
      loading,
      confirmationError,
      authCheckComplete
    }}>
      {children}
    </AuthContext.Provider>
  );
};