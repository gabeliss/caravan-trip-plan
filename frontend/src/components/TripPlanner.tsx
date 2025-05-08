import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Destination, TripDuration, ItineraryPlan, Campground } from '../types';
import { TripSummary } from './TripSummary';
import { useTripPlan } from '../context/TripPlanContext';
import { TripDetailsEditor } from './TripDetailsEditor';
import { useCampgroundLoader } from '../hooks/useCampgroundLoader';
import StaysSelector from './StaysSelector';
import ContinueButton from './ContinueButton';
import TripPlannerHeader from './TripPlannerHeader';
import BackButton from './BackButton';
import CampgroundsSection from './CampgroundsSection';
import RouteMap from './RouteMap';

import { getLocationStays } from '../utils/getLocationStays';

interface TripPlannerProps {
  destination: Destination;
  duration: TripDuration;
  onClose: () => void;
  tripPlan?: ItineraryPlan | null;
  loading?: boolean;
}

const TripPlanner: React.FC<TripPlannerProps> = ({ 
  destination, 
  duration: initialDuration, 
  onClose,
  tripPlan: externalTripPlan,
  loading: externalLoading
}) => {
  const { 
    tripPlan: contextTripPlan, 
    loading: contextLoading, 
    availabilityData, 
    generatePlan, 
    setFlowStage,
    selectedCampgrounds,
    setSelectedCampgrounds,
    clearSelectedCampgrounds
  } = useTripPlan();
  
  const tripPlan = externalTripPlan !== undefined ? externalTripPlan : contextTripPlan;

  const [selectedDay, setSelectedDay] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [guestCount, setGuestCount] = useState(() => {
    if (tripPlan) {
      if (!tripPlan.guestCount) {
        console.error('Trip plan is missing guest count information');
        throw new Error('Trip plan missing required guest count information');
      }
      return tripPlan.guestCount;
    }
    if (!initialDuration.guestCount) {
      throw new Error('Initial duration is missing required guest count information');
    }
    return initialDuration.guestCount;
  });
  const [duration, setDuration] = useState<TripDuration>(initialDuration);


  const { campgrounds, loading, loadCampgroundsForDay } = useCampgroundLoader({
    availabilityData,
    tripPlan,
    destination,
    duration
  });

  useEffect(() => {
    if (tripPlan) {
      loadCampgroundsForDay(selectedDay);
    }
  }, [selectedDay, tripPlan, duration]);

  useEffect(() => {
    if (tripPlan) {
      if (!tripPlan.guestCount) {
        console.error('Trip plan update missing guest count information');
        throw new Error('Trip plan is missing required guest count information');
      }
      setGuestCount(tripPlan.guestCount);
    }
  }, [tripPlan]);

  const handleNavigateAway = () => {
    clearSelectedCampgrounds();
    onClose();
  };

  if (!tripPlan) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen text-gray-600 text-lg"
      >
        Loading your trip...
      </motion.div>
    );
  }

  const handleCampgroundSelect = (campground: Campground | null, accommodationType: string) => {
    const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
      selectedDay >= stay.startNight && selectedDay <= stay.endNight
    );
  
    const updated = [...selectedCampgrounds];
  
    if (campground === null) {
      if (currentStay) {
        for (let night = currentStay.startNight; night <= Math.min(currentStay.endNight, duration.nights); night++) {
          updated[night - 1] = { campground: null, accommodationType: '' };
        }
      } else {
        updated[selectedDay - 1] = { campground: null, accommodationType: '' };
      }
    } else {
      const currentCity = currentStay?.location || 'Unknown';
      const campgroundWithCity = {
        ...campground,
        city: campground.city || currentCity
      };
  
      if (currentStay) {
        for (let night = currentStay.startNight; night <= Math.min(currentStay.endNight, duration.nights); night++) {
          updated[night - 1] = { campground: campgroundWithCity, accommodationType };
        }
      } else {
        updated[selectedDay - 1] = { campground: campgroundWithCity, accommodationType };
      }
    }
  
    setSelectedCampgrounds(updated);
  };

  const handleTripDetailsUpdate = (newDetails: {
    startDate: Date;
    nights: number;
    adults: number;
    children: number;
  }) => {
    const newGuestCount = newDetails.adults + newDetails.children;
    
    setGuestCount(newGuestCount);
    
    if (generatePlan) {
      generatePlan(
        destination.id,
        newDetails.nights,
        newDetails.startDate,
        newDetails.adults,
        newDetails.children
      );
    }
    
    setDuration({
      nights: newDetails.nights,
      startDate: newDetails.startDate,
      guestCount: newGuestCount
    });
  };

  const getFilteredSelectedCampgrounds = () => {
    return selectedCampgrounds
      .filter(s => s?.campground !== null)
      .map(s => s?.campground)
      .filter((campground): campground is Campground => campground !== null);
  };

  const handleContinue = () => {
    const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
      selectedDay >= stay.startNight && selectedDay <= stay.endNight
    );

    const nextStay = getLocationStays(tripPlan, destination, duration).find(stay => 
      stay.startNight > (currentStay?.endNight || selectedDay)
    );

    if (nextStay && nextStay.startNight <= duration.nights) {
      setSelectedDay(nextStay.startNight);
    } else {
      setFlowStage('trip-summary');
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  if (showSummary) {
    return (
      <TripSummary
        destination={destination}
        duration={duration}
        selectedCampgrounds={getFilteredSelectedCampgrounds()}
        guestCount={guestCount}
        onClose={handleNavigateAway}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-beige-light z-50 overflow-y-auto"
    >
      <TripPlannerHeader
        destination={destination}
        duration={duration}
        selectedCampgrounds={selectedCampgrounds}
        onReviewTrip={() => setShowSummary(true)}
        onClose={handleNavigateAway}
      />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-6">
          <BackButton onClick={handleNavigateAway} />
        </div>

        <div className="px-4">
          <TripDetailsEditor
            startDate={duration.startDate as Date}
            nights={duration.nights}
            adultCount={guestCount}
            childCount={0}
            destinationId={destination.id}
            onUpdate={handleTripDetailsUpdate}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <StaysSelector
            tripPlan={tripPlan}
            destination={destination}
            duration={duration}
            selectedDay={selectedDay}
            selectedCampgrounds={selectedCampgrounds}
            onDaySelect={handleDaySelect}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <CampgroundsSection
                tripPlan={tripPlan}
                destination={destination}
                duration={duration}
                selectedDay={selectedDay}
                campgrounds={campgrounds}
                loading={loading}
                guestCount={guestCount}
                onSelect={handleCampgroundSelect}
              />
              
              <div className="p-4 rounded-t-lg">
                <ContinueButton
                  disabled={!selectedCampgrounds[selectedDay - 1]?.campground}
                  onClick={handleContinue}
                />
              </div>
            </div>

            <RouteMap 
              destination={destination}
              selectedCampgrounds={getFilteredSelectedCampgrounds()}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripPlanner;

export { TripPlanner }