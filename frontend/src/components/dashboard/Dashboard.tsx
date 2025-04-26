import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Map, 
  FileText, 
  Calendar,
  Settings,
  Download,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TripList } from './TripList';
import { TripDetails } from './TripDetails';
import { UserSettings } from './UserSettings';
import { tripService } from '../../services/tripService';

export const Dashboard: React.FC = () => {
  const { user, logout, loading, updateUserTrips } = useAuth();
  const [refreshingTrips, setRefreshingTrips] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  // Show loading only after a delay to prevent flashing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, 400);
    } else {
      setShowLoading(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  // Function to refresh trips data from the server
  const refreshTrips = async () => {
    if (!user) return;
    
    setRefreshingTrips(true);
    try {
      const trips = await tripService.getUserTrips(user.id);
      // Update the trips in the auth context
      if (trips) {
        updateUserTrips(trips);
      }
    } catch (error) {
      console.error('Error refreshing trips:', error);
    } finally {
      setRefreshingTrips(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Wait for the logout process to complete before navigating
      await logout();
      
      // Once logout is fully complete, navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Only navigate on error if it makes sense to do so
      navigate('/login');
    }
  };

  // Show loading state while auth is being checked, but only after a delay
  if (loading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-pulse text-primary text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      {/* Main Content */}
      <div className="p-8">
        <Routes>
          <Route path="/" element={<TripList refreshing={refreshingTrips} onRefresh={refreshTrips} />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>
      </div>
    </div>
  );
};