import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ItineraryPlan } from '../types';
import { generateTripPlan } from '../utils/tripPlanGenerator';
import tripService from '../services/tripService';

interface TripPlanContextType {
  tripPlan: ItineraryPlan | null;
  availabilityData: any[] | null;
  loading: boolean;
  error: string | null;
  generatePlan: (
    destinationId: string,
    nights: number,
    startDate: Date,
    numAdults?: number,
    numKids?: number
  ) => Promise<void>;
  clearPlan: () => void;
}

const TripPlanContext = createContext<TripPlanContextType | undefined>(undefined);

export const useTripPlan = () => {
  const context = useContext(TripPlanContext);
  if (context === undefined) {
    throw new Error('useTripPlan must be used within a TripPlanProvider');
  }
  return context;
};

interface TripPlanProviderProps {
  children: ReactNode;
}

export const TripPlanProvider: React.FC<TripPlanProviderProps> = ({ children }) => {
  const [tripPlan, setTripPlan] = useState<ItineraryPlan | null>(null);
  const [availabilityData, setAvailabilityData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (
    destinationId: string,
    nights: number,
    startDate: Date,
    numAdults = 2,
    numKids = 0
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Generating plan for destination: ${destinationId}, nights: ${nights} (type: ${typeof nights})`);
      
      // Generate trip plan with availability data
      const result = await tripService.generateTripWithAvailability(
        destinationId,
        nights,
        startDate,
        numAdults,
        numKids
      );
      
      setTripPlan(result.plan);
      setAvailabilityData(result.availability);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to generate trip plan. Please try again.';
      setError(errorMessage);
      console.error('Trip plan generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearPlan = () => {
    setTripPlan(null);
    setAvailabilityData(null);
    setError(null);
  };

  const value = {
    tripPlan,
    availabilityData,
    loading,
    error,
    generatePlan,
    clearPlan
  };

  return <TripPlanContext.Provider value={value}>{children}</TripPlanContext.Provider>;
};

export default TripPlanProvider; 