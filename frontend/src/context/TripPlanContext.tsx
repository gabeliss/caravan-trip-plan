import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ItineraryPlan } from '../types';
import tripService from '../services/tripService';
import { SelectedCampground } from '../types/campground';
type FlowStage = 
  | 'destination'
  | 'campgrounds'
  | 'trip-summary'
  | 'confirmation'
  | 'completed';


interface TripPlanContextType {
  tripPlan: ItineraryPlan | null;
  availabilityData: any[] | null;
  loading: boolean;
  error: string | null;
  selectedDestination: string | null;
  setSelectedDestination: (destination: string | null) => void;
  selectedCampgrounds: SelectedCampground[];
  setSelectedCampgrounds: (campgrounds: SelectedCampground[]) => void;
  clearSelectedCampgrounds: () => void;
  flowStage: FlowStage;
  setFlowStage: (stage: FlowStage) => void;
  generatePlan: (
    destinationId: string,
    nights: number,
    startDate: Date,
    numAdults: number,
    numKids: number
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
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [flowStage, setFlowStage] = useState<FlowStage>('destination');
  const [selectedCampgrounds, setSelectedCampgrounds] = useState<SelectedCampground[]>([]);

  const generatePlan = async (
    destinationId: string,
    nights: number,
    startDate: Date,
    numAdults: number,
    numKids: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate required parameters
      if (numAdults === undefined) {
        throw new Error('Number of adults is required for trip planning');
      }
      
      console.log(`Generating plan for destination: ${destinationId}, nights: ${nights} (type: ${typeof nights})`);
      
      // Generate trip plan - availability will be fetched lazily by individual components
      const result = await tripService.generateTripWithoutAvailability(
        destinationId,
        nights,
        startDate,
        numAdults,
        numKids
      );

      console.log('generatePlan() result', result);
      setTripPlan(result.plan);
      
      console.log('Trip plan generated successfully - availability will be fetched by campground cards as needed');
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

  const clearSelectedCampgrounds = () => {
    setSelectedCampgrounds([]);
  };

  const value = {
    tripPlan,
    availabilityData,
    loading,
    error,
    selectedDestination,
    setSelectedDestination,
    flowStage,
    setFlowStage,
    selectedCampgrounds,
    setSelectedCampgrounds,
    clearSelectedCampgrounds,
    generatePlan,
    clearPlan
  };

  return <TripPlanContext.Provider value={value}>{children}</TripPlanContext.Provider>;
};

export default TripPlanProvider; 