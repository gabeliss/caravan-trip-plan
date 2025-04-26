import { ItineraryPlan } from '../types';
import { formatDateForApi } from '../utils/tripPlanGenerator';
import { supabase } from './supabaseClient';
import { SavedTrip, TripDuration, Destination, Campground } from '../types';

// Get the API URL from environment variables or use default
const API_BASE_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:5001/api';

console.log('Trip service using API URL:', API_BASE_URL);

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
 * Generates a trip plan without pre-fetching availability for all campgrounds
 * @param destinationId ID of the destination
 * @param nights Total number of nights
 * @param startDate Starting date of the trip
 * @param numAdults Number of adults
 * @param numKids Number of kids
 * @returns Promise with trip plan structure
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
    
    // Return the plan and the raw data
    // Availability data is no longer pre-fetched by the backend
    return {
      plan,
      availability: tripPlanData.stops
    };
  } catch (error) {
    console.error('Error generating trip with availability:', error);
    throw error;
  }
};

export const tripService = {
  /**
   * Get trips for a specific user
   */
  async getUserTrips(userId: string): Promise<SavedTrip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data ? data.map(trip => ({
        id: trip.id,
        confirmationId: trip.confirmation_id,
        destination: trip.destination as Destination,
        duration: trip.duration as TripDuration,
        selectedCampgrounds: trip.campgrounds as Campground[],
        createdAt: trip.created_at,
        status: trip.status,
        guideUrl: trip.guide_url
      })) : [];
    } catch (error) {
      console.error('Error fetching user trips:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific trip by ID
   */
  async getTripById(tripId: string): Promise<SavedTrip | null> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        confirmationId: data.confirmation_id,
        destination: data.destination as Destination,
        duration: data.duration as TripDuration,
        selectedCampgrounds: data.campgrounds as Campground[],
        createdAt: data.created_at,
        status: data.status,
        guideUrl: data.guide_url
      };
    } catch (error) {
      console.error(`Error fetching trip ${tripId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new trip
   */
  async createTrip(
    userId: string,
    destination: Destination,
    duration: TripDuration,
    selectedCampgrounds: Campground[]
  ): Promise<SavedTrip> {
    try {
      const tripId = `TRIP-${Math.random().toString(36).substr(2, 9)}`;
      const confirmationId = `CONF-${Math.random().toString(36).substr(2, 9)}`;
      
      const tripData = {
        id: tripId,
        confirmation_id: confirmationId,
        user_id: userId,
        destination,
        duration,
        campgrounds: selectedCampgrounds,
        created_at: new Date().toISOString(),
        status: 'planned'
      };
      
      const { error } = await supabase
        .from('trips')
        .insert(tripData);
        
      if (error) throw error;
      
      return {
        id: tripId,
        confirmationId,
        destination,
        duration,
        selectedCampgrounds,
        createdAt: tripData.created_at,
        status: 'planned',
      };
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing trip
   */
  async updateTrip(trip: SavedTrip): Promise<SavedTrip> {
    try {
      const { error } = await supabase
        .from('trips')
        .update({
          destination: trip.destination,
          duration: trip.duration,
          campgrounds: trip.selectedCampgrounds,
          status: trip.status,
          guide_url: trip.guideUrl
        })
        .eq('id', trip.id);
        
      if (error) throw error;
      
      return trip;
    } catch (error) {
      console.error(`Error updating trip ${trip.id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a trip
   */
  async deleteTrip(tripId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);
        
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting trip ${tripId}:`, error);
      throw error;
    }
  }
};

export default {
  fetchCityAvailability,
  generateTripWithAvailability
}; 