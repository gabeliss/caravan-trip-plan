import { Destination, TripDuration, ItineraryPlan } from '../types';
import { tripItineraries } from '../data/tripItineraries';

export interface LocationStay {
  location: string;
  startNight: number;
  endNight: number;
}

/**
 * Gets the location stays based on trip plan data or itinerary data
 * @param tripPlan Optional trip plan with stops
 * @param destination Destination information
 * @param duration Trip duration information
 * @returns Array of location stays with start and end nights
 */
export const getLocationStays = (
  tripPlan: ItineraryPlan | null | undefined,
  destination: Destination,
  duration: TripDuration
): LocationStay[] => {
  // If we have a trip plan with stops, use that to create the location stays
  if (tripPlan && tripPlan.stops && tripPlan.stops.length > 0) {
    return tripPlan.stops.map((stop, index) => {
      const startNight = index === 0 ? 1 : 
        tripPlan.stops.slice(0, index).reduce((total, prev) => total + prev.nights, 1);
      const endNight = startNight + stop.nights - 1;
      
      return {
        location: stop.city,
        startNight,
        endNight
      };
    });
  }

  // Otherwise, use the trip itineraries data for this destination
  const destinationId = destination.id;
  const nights = duration.nights;
  const itinerary = tripItineraries[destinationId];
  
  if (itinerary && itinerary.stops[nights]) {
    // Convert the trip stops from the itinerary data to location stays
    const stays: LocationStay[] = [];
    let currentNight = 1;
    
    itinerary.stops[nights].forEach(stop => {
      const startNight = currentNight;
      const endNight = currentNight + stop.nights - 1;
      
      stays.push({
        location: stop.city,
        startNight,
        endNight
      });
      
      currentNight = endNight + 1;
    });
    
    return stays;
  }
  
  // Fallback for any other case
  return [{ 
    location: 'Default Location',
    startNight: 1, 
    endNight: duration.nights 
  }];
}; 