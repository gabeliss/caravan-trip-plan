import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Map, 
  FileText, 
  Calendar,
  Settings,
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TripList } from './TripList';
import { TripDetails } from './TripDetails';
import { UserSettings } from './UserSettings';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-beige-light">
      {/* Main Content */}
      <div className="p-8">
        <Routes>
          <Route path="/" element={<TripList />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>
      </div>
    </div>
  );
};