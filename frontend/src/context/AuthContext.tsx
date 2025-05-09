import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, SavedTrip } from '../types';
import { authService } from '../services/authService';
import { tripService } from '../services/tripService';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUserTrips: (trips: SavedTrip[]) => void;
  loading: boolean;
  confirmationError: string | null;
  authCheckComplete: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

const formatDestinationName = (destinationId: string): string =>
  destinationId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

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
    } catch (err) {
      console.error('Session check error:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setAuthCheckComplete(true);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && isAuthenticated) {
        return;
      }
  
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        try {
          if (!session?.user) {
            setTimeout(() => checkSession(), 1000); // retry after 1s
          } else if (!isAuthenticated) {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setIsAuthenticated(true);
            }
          }
      
          // Always try to claim trips (harmless if 0)
          if (session?.user?.email && session?.user?.id && !isAuthenticated) {
            await tripService.claimGuestTrips(session.user.id, session.user.email);
          }
      
        } catch (err) {
          console.error('AuthContext: Error during session refresh:', err);
        } finally {
          setAuthCheckComplete(true);
          setLoading(false);
        }
      }
      
  
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        setAuthCheckComplete(true); // ✅ also mark complete here
      }
    });
  
    // ✅ Always check once immediately on mount
    checkSession();
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkSession]);
  

  const updateUserTrips = async (trips: SavedTrip[]) => {
    if (!user) return;
    setUser({ ...user, trips });

    for (const trip of trips) {
      try {
        const existingTrip = await tripService.getTripById(trip.id);
        if (!existingTrip) {
          await tripService.createTrip(user.id, {
            id: trip.trip_details.destination,
            name: formatDestinationName(trip.trip_details.destination),
            region: 'Michigan'
          }, {
            nights: trip.trip_details.nights,
            startDate: trip.trip_details.startDate,
            guestCount: trip.trip_details.guestCount
          }, trip.selectedCampgrounds);
        } else if (JSON.stringify(existingTrip) !== JSON.stringify(trip)) {
          await tripService.updateTrip(trip);
        }
      } catch (err) {
        console.error(`Error syncing trip ${trip.id}:`, err);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setConfirmationError(null);
      const loggedInUser = await authService.login(email, password);


      try {
        const claimedTrips = await tripService.claimGuestTrips(loggedInUser.id, email);
        if (claimedTrips.length > 0) {
          loggedInUser.trips = [...(loggedInUser.trips || []), ...claimedTrips];
        }
      } catch (err) {
        console.error('Error claiming guest trips during login:', err);
      }

      setUser(loggedInUser);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('confirm your email')) {
        setConfirmationError(err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setConfirmationError(null);
      const newUser = await authService.register(email, password, name);

      if (newUser?.id) {
        try {
          const claimedTrips = await tripService.claimGuestTrips(newUser.id, email);
          if (claimedTrips.length > 0) {
            newUser.trips = [...(newUser.trips || []), ...claimedTrips];
          }
        } catch (err) {
          console.error('Error claiming guest trips during registration:', err);
        }

        setUser(newUser);
        setIsAuthenticated(true);
      }

      return {
        success: true,
        message: 'Registration successful! Please check your email to confirm your account before logging in.'
      };
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message?.includes('confirm your account')) {
        setConfirmationError(err.message);
        return { success: true, message: err.message };
      }
      return { success: false, message: err.message || 'Failed to create account' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      setIsAuthenticated(false);
      await authService.logout();
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
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
