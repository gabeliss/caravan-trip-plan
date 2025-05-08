import React from 'react';
import { Destination, TripDuration, ItineraryPlan, Campground } from '../types';
import { CampgroundList } from './CampgroundList';
import { getLocationStays } from '../utils/getLocationStays';

interface CampgroundsSectionProps {
  tripPlan: ItineraryPlan;
  destination: Destination;
  duration: TripDuration;
  selectedDay: number;
  campgrounds: Campground[];
  loading: boolean;
  guestCount: number;
  onSelect: (campground: Campground | null, accommodationType: string) => void;
}

const CampgroundsSection: React.FC<CampgroundsSectionProps> = ({
  tripPlan,
  destination,
  duration,
  selectedDay,
  campgrounds,
  loading,
  guestCount,
  onSelect,
}) => {
  // Find the current stay based on selected day
  const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
    selectedDay >= stay.startNight && selectedDay <= stay.endNight
  );
  
  if (!currentStay) {
    return <div>No stay found for the selected day</div>;
  }
  
  // Find the matching trip stop for the current stay location
  const tripStop = tripPlan.stops.find(stop => 
    stop.city.toLowerCase().replace(/\s+/g, '-') === currentStay.location.toLowerCase().replace(/\s+/g, '-')
  );
  
  if (!tripStop || !tripStop.startDate || !tripStop.endDate) {
    return <div>Trip stop or dates are missing for {currentStay.location}</div>;
  }
  
  const stayStartDate = tripStop.startDate;
  const stayEndDate = tripStop.endDate;
  
  return (
    <CampgroundList 
      campgrounds={campgrounds} 
      onSelect={onSelect} 
      loading={loading}
      tripStartDate={stayStartDate}
      tripEndDate={stayEndDate}
      guestCount={guestCount}
    />
  );
};

export default CampgroundsSection; 