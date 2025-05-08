import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { destinations } from '../data/destinations';
import { useTripPlan } from '../context/TripPlanContext';
import { TripPlanner } from '../components/TripPlanner';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle } from 'lucide-react';
import { TripSummary } from '../components/TripSummary';
import { TripConfirmation } from '../components/TripConfirmation';
import { DestinationCards } from '../components/DestinationCards';
import { Campground } from '../types';

export const DestinationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    generatePlan, 
    tripPlan, 
    loading, 
    selectedDestination, 
    setSelectedDestination,
    selectedCampgrounds,
    setSelectedCampgrounds, 
    flowStage, 
    setFlowStage,
    clearPlan
  } = useTripPlan();

  // Get trip parameters from location state (passed from the homepage)
  const { startDate, nights, guests } = location.state || {};
  const numNights = nights ? Number(nights) : 0; // Ensure nights is a number
  const numAdults = guests?.adults ? Number(guests.adults) : 2;
  const numKids = guests?.children ? Number(guests.children) : 0;

  useEffect(() => {
    // Redirect to homepage if no trip parameters are provided
    if (!startDate || !numNights) {
      navigate('/');
    }
  }, [startDate, numNights, navigate]);

  const handleDestinationSelect = (destinationId: string) => {
    // Only allow selection of Northern Michigan
    if (destinationId === 'northern-michigan') {
      setSelectedDestination(destinationId);
      setFlowStage('campgrounds');
      
      // Generate trip plan with availability data
      console.log('Generating trip plan with params:', {
        destinationId,
        numNights,
        startDate,
        numAdults,
        numKids
      });
      generatePlan(
        destinationId,
        numNights,
        new Date(startDate),
        numAdults,
        numKids
      );
    }
  };

  const handleClose = () => {
    setFlowStage('campgrounds');
  };

  const getFilteredSelectedCampgrounds = () => {
    return selectedCampgrounds
      .filter(s => s?.campground !== null)
      .map(s => s?.campground)
      .filter((campground): campground is Campground => campground !== null);
  };

  // Find the selected destination object
  const selectedDestinationObject = selectedDestination 
    ? destinations.find(dest => dest.id === selectedDestination) 
    : null;

  return (
    <section className="py-20 px-4 bg-[#FFF6ED]">
      <div className="max-w-7xl mx-auto">
      {flowStage === 'destination' && (
        <DestinationCards onSelect={handleDestinationSelect} />
      )}

        {flowStage === 'campgrounds' && selectedDestinationObject && (
        <TripPlanner 
          destination={selectedDestinationObject}
          duration={{
            startDate: new Date(startDate),
            nights: numNights,
            guestCount: numAdults + numKids
          }}
          onClose={() => setFlowStage('destination')}
        />
      )}

      {flowStage === 'trip-summary' && selectedDestinationObject && (
        <TripSummary
          destination={selectedDestinationObject}
          duration={{
            startDate: new Date(startDate),
            nights: numNights,
            guestCount: numAdults + numKids
          }}
          selectedCampgrounds={getFilteredSelectedCampgrounds()}
          guestCount={numAdults + numKids}
          onClose={() => setFlowStage('campgrounds')}
        />
      )}

      {flowStage === 'confirmation' && selectedDestinationObject && (
        <TripConfirmation
          destination={selectedDestinationObject}
          duration={{
            startDate: new Date(startDate),
            nights: numNights,
            guestCount: numAdults + numKids
          }}
          selectedCampgrounds={getFilteredSelectedCampgrounds()}
          onClose={() => setFlowStage('trip-summary')}
        />
      )}

      {flowStage === 'completed' && (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Trip Complete!</h2>
          <p className="text-lg">You can now view your trip guide from your dashboard.</p>
          <button 
            onClick={() => {
              setFlowStage('destination');
              clearPlan();
              setSelectedDestination(null);
              setSelectedCampgrounds([]);
            }}
            className="mt-6 bg-primary-dark text-white px-6 py-3 rounded-lg"
          >
            Plan a New Trip
          </button>
        </div>
      )}


      </div>
    </section>
  );
};

export default DestinationSelectionPage; 