import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import { SavedTrip } from '../../types';
import { TripGuidePages } from './TripGuidePages';

export const TripDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const tripData = await tripService.getTripById(id);
        
        if (tripData) {
          setTrip(tripData);
        } else {
          console.error('Trip not found');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrip();
  }, [id, navigate]);
  
  const handleBackToTrips = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return <div className="animate-pulse text-primary text-lg p-8">Loading trip details...</div>;
  }
  
  if (!trip) {
    return <div className="text-primary text-lg p-8">Trip not found</div>;
  }
  
  return <TripGuidePages trip={trip} onBack={handleBackToTrips} />;
}; 