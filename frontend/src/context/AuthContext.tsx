import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SavedTrip } from '../types';
import { destinations } from '../data/destinations';
import { michiganCampgrounds } from '../data/campgrounds';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserTrips: (trips: SavedTrip[]) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Mock trip data
const mockTrip: SavedTrip = {
  id: 'TRIP-55spqpj25',
  confirmationId: 'CONF-123',
  destination: destinations[0], // Northern Michigan
  duration: {
    startDate: new Date('2024-07-15'),
    nights: 6
  },
  selectedCampgrounds: [
    // Traverse City (Nights 1-2)
    michiganCampgrounds['traverse-city'].campgrounds[0], // Timber Ridge
    michiganCampgrounds['traverse-city'].campgrounds[0], // Timber Ridge
    // Mackinac Island (Nights 3-4)
    michiganCampgrounds['mackinac-city'].campgrounds[2], // Mackinaw Mill Creek
    michiganCampgrounds['mackinac-city'].campgrounds[2], // Mackinaw Mill Creek
    // Pictured Rocks (Nights 5-6)
    michiganCampgrounds['munising'].campgrounds[0], // Uncle Ducky's
    michiganCampgrounds['munising'].campgrounds[0]  // Uncle Ducky's
  ],
  createdAt: new Date().toISOString(),
  status: 'planned',
  guideUrl: '/trip-guide.pdf'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const updateUserTrips = (trips: SavedTrip[]) => {
    if (user) {
      const updatedUser = { ...user, trips };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      const mockUser: User = {
        id: '1',
        email,
        name: 'Demo User',
        trips: [mockTrip] // Add the mock trip to the user's trips
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call
      const mockUser: User = {
        id: '1',
        email,
        name,
        trips: [mockTrip] // Add the mock trip to the user's trips
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateUserTrips 
    }}>
      {children}
    </AuthContext.Provider>
  );
};