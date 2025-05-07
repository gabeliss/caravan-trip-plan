import React from 'react';
import { useTripPlan } from '../context/TripPlanContext';

interface TripPlanSummaryProps {
  onContinue?: () => void;
}

export const TripPlanSummary: React.FC<TripPlanSummaryProps> = ({ onContinue }) => {
  const { tripPlan, availabilityData, loading, error } = useTripPlan();

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
          <p className="mt-4 text-lg text-primary-dark font-display">
            Generating your trip plan and checking availability...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center text-red-600 py-8">
          <h3 className="text-xl font-display mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!tripPlan || !availabilityData) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <h3 className="text-xl font-display mb-2">No Trip Plan</h3>
          <p>Please start by selecting a destination and dates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-display text-primary-dark mb-6">Your Trip Itinerary</h2>
      
      <div className="mb-8 bg-beige/30 rounded-lg p-4">
        <p className="text-lg font-display">
          Trip Overview: {tripPlan.stops.length} stops over {tripPlan.totalNights} nights
        </p>
        <p className="text-gray-600">
          Starting: {tripPlan.startDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="space-y-8">
        {tripPlan.stops.map((stop, index) => {
          // Find the matching availability data
          const stopAvailability = availabilityData.find(data => data.city === stop.scraperId);
          
          return (
            <div key={index} className="border-l-4 border-primary pl-4 pb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-xl font-display text-primary-dark">
                  Stop {index + 1}: {stop.city}
                </h3>
                <div className="text-sm text-gray-600">
                  {stop.startDate.toLocaleDateString()} - {stop.endDate.toLocaleDateString()} 
                  ({stop.nights} {stop.nights === 1 ? 'night' : 'nights'})
                </div>
              </div>
              
              {stopAvailability && stopAvailability.campgrounds && (
                <div className="mt-4">
                  <h4 className="text-lg font-display mb-2">Available Accommodations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stopAvailability.campgrounds.map((campground: any) => (
                      <div 
                        key={campground.id} 
                        className={`p-4 rounded-lg border ${
                          campground.availability && campground.availability.available 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <h5 className="font-display text-primary-dark">{campground.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">{campground.description.substring(0, 80)}...</p>
                        
                        {campground.availability && (
                          <div className="mt-3">
                            {campground.availability.available ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">Available</span>
                                <span className="font-bold text-primary-dark">
                                  ${campground.availability.price}
                                </span>
                              </div>
                            ) : (
                              <span className="text-red-600">Not Available</span>
                            )}
                            {campground.availability.message && (
                              <p className="text-xs text-gray-500 mt-1">{campground.availability.message}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onContinue && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={onContinue}
            className="bg-primary text-white font-display py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Continue to Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default TripPlanSummary; 