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
import { UserSettings } from './UserSettings';
import { tripService } from '../../services/tripService';
import { TripDetailsWrapper } from './TripDetailsWrapper';

export const Dashboard: React.FC = () => {
  const { user, logout, loading, updateUserTrips } = useAuth();
  const [refreshingTrips, setRefreshingTrips] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

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

  const refreshTrips = async () => {
    if (!user) return;
    
    setRefreshingTrips(true);
    try {
      const trips = await tripService.getUserTrips(user.id);
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
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login');
    }
  };

  if (loading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-pulse text-primary text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="p-8">
        <Routes>
          <Route path="/" element={<TripList refreshing={refreshingTrips} onRefresh={refreshTrips} trips={user?.trips || []} />} />
          <Route path="/trip/:id" element={<TripDetailsWrapper />} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>
      </div>
    </div>
  );
};