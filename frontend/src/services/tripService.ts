import { ItineraryPlan } from '../types';
import { formatDateForApi } from '../utils/tripPlanGenerator';

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Fetches availability for a specific city and date range
 * @param cityId ID of the city
 * @param startDate Start date in MM/DD/YY format
 * @param endDate End date in MM/DD/YY format
 * @param numAdults Number of adults
 * @param numKids Number of kids
 * @returns Promise with availability data
 */
export const fetchCityAvailability = async (
  cityId: string,
  startDate: string,
  endDate: string,
  numAdults: number = 2,
  numKids: number = 0
) => {
  try {
    // First get all campgrounds for this city
    const response = await fetch(`${API_BASE_URL}/campgrounds/${cityId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch campgrounds for ${cityId}`);
    }
    
    const campgrounds = await response.json();
    
    // For each campground, fetch availability
    const availabilityPromises = campgrounds.map(async (campground: any) => {
      const availabilityResponse = await fetch(`${API_BASE_URL}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campgroundId: campground.id,
          startDate,
          endDate,
          numAdults,
          numKids
        }),
      });
      
      if (!availabilityResponse.ok) {
        console.warn(`Failed to fetch availability for ${campground.id}`);
        return {
          ...campground,
          availability: {
            available: false,
            message: 'Failed to fetch availability',
          }
        };
      }
      
      const availabilityData = await availabilityResponse.json();
      
      return {
        ...campground,
        availability: availabilityData
      };
    });
    
    const campgroundsWithAvailability = await Promise.all(availabilityPromises);
    
    return {
      cityId,
      startDate,
      endDate,
      campgrounds: campgroundsWithAvailability
    };
  } catch (error) {
    console.error('Error fetching city availability:', error);
    throw error;
  }
};

/**
 * Generates a trip plan and fetches availability for all stops
 * @param destinationId ID of the destination
 * @param nights Total number of nights
 * @param startDate Starting date of the trip
 * @param numAdults Number of adults
 * @param numKids Number of kids
 * @returns Promise with trip plan and availability data
 */
export const generateTripWithAvailability = async (
  destinationId: string,
  nights: number,
  startDate: Date,
  numAdults: number = 2,
  numKids: number = 0
) => {
  try {
    // Use the backend API to generate the trip plan
    const response = await fetch(`${API_BASE_URL}/trip-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destinationId,
        nights: Number(nights),
        startDate: formatDateForApi(startDate),
        numAdults: Number(numAdults),
        numKids: Number(numKids)
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate trip plan');
    }
    
    const tripPlanData = await response.json();
    
    // Convert the backend response to our frontend ItineraryPlan format
    const plan: ItineraryPlan = {
      destination: destinationId,
      totalNights: nights,
      startDate: new Date(startDate),
      stops: tripPlanData.stops.map((stop: any) => {
        // Parse dates from MM/DD/YY format
        const [startMonth, startDay, startYear] = stop.startDate.split('/').map(Number);
        const [endMonth, endDay, endYear] = stop.endDate.split('/').map(Number);
        
        return {
          city: stop.city.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), // Convert "traverse-city" to "Traverse City"
          scraperId: stop.city,
          startDate: new Date(2000 + startYear, startMonth - 1, startDay),
          endDate: new Date(2000 + endYear, endMonth - 1, endDay),
          nights: stop.nights
        };
      })
    };
    
    return {
      plan,
      availability: tripPlanData.stops
    };
  } catch (error) {
    console.error('Error generating trip with availability:', error);
    throw error;
  }
};

export default {
  fetchCityAvailability,
  generateTripWithAvailability
}; 