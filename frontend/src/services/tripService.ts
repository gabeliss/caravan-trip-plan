import { ItineraryPlan } from '../types';
import { supabase } from './supabaseClient';
import { SavedTrip, TripDuration, Destination, Campground, TripDetails } from '../types';
import { enhanceCampgroundsWithData } from '../utils/enhanceCampgrounds';
import destinationsData from '../info/destinations.json';

// Get the API URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

console.log('Trip service using API URL:', API_BASE_URL);

// Define a type for the optimized trip data we store in Supabase
interface OptimizedTripData {
  id: string;
  confirmation_id: string;
  user_id: string;
  trip_details: {
    destination: string;
    nights: number;
    startDate: string;
    guestCount: number;
  };
  campgrounds: {
    id: string;
    price: number;
    city: string;
  }[];
  created_at: string;
  status: 'planned' | 'active' | 'completed';
  guide_url?: string;
}

// Define type for the stored campground data
interface StoredCampground {
  id: string;
  price: number;
  city: string;
}

const formatDateForApi = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().substr(-2);
  
  return `${month}/${day}/${year}`;
};

// Utility function to get destination data from ID
export const getDestinationData = (destinationId: string): Destination => {
  // Get destination from our static JSON file
  const destination = (destinationsData as Record<string, { id: string, name: string, region: string }>)[destinationId];
  
  if (!destination) {
    throw new Error(`Destination with ID '${destinationId}' not found. Please add it to destinations.json.`);
  }
  
  // Only return the fields we actually need
  return {
    id: destination.id,
    name: destination.name,
    region: destination.region
  };
};

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
export const generateTripWithoutAvailability = async (
  destinationId: string,
  nights: number,
  startDate: Date,
  numAdults: number,
  numKids: number
) => {
  try {
    // Validate that all required parameters are present
    if (numAdults === undefined) {
      throw new Error('Number of adults is required for trip planning');
    }

    if (numKids === undefined) {
      throw new Error('Number of kids is required for trip planning');
    }
    
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
      guestCount: numAdults + numKids,
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
      plan
    };
  } catch (error) {
    console.error('Error generating trip with availability:', error);
    throw error;
  }
};

// Define the tripService object with all trip-related methods
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
      
      if (!data) return [];
      
      // Transform DB data into full SavedTrip objects
      return data.map(trip => {
        // Validate trip_details and startDate exist
        if (!trip.trip_details || !trip.trip_details.startDate) {
          console.error(`Trip ${trip.id} is missing required trip_details or startDate`);
          throw new Error(`Trip ${trip.id} is missing required data`);
        }
        
        const trip_details: TripDetails = {
          destination: trip.trip_details.destination,
          nights: trip.trip_details.nights,
          startDate: new Date(trip.trip_details.startDate),
          guestCount: trip.trip_details.guestCount
        };
        
        // Get destination data for enhancing campgrounds
        const destinationData = getDestinationData(trip_details.destination);
        const cityName = destinationData.name;
        
        // Convert minimal campground data to fully enhanced campgrounds
        let campgrounds = trip.campgrounds.map((cg: StoredCampground) => {
          // Verify city information is present
          if (!cg.city) {
            console.error(`Missing city information for campground ${cg.id} in trip ${trip.id}`);
            throw new Error(`Campground ${cg.id} is missing required city information`);
          }
          
          return {
            id: cg.id,
            name: cg.id,
            price: cg.price || 0,
            description: '',
            rating: 0,
            amenities: [],
            coordinates: [0, 0],
            images: [],
            imageUrl: '',
            address: '',
            distanceToTown: '',
            season: {
              start: '',
              end: ''
            },
            checkIn: {
              time: '',
              lateArrival: '',
              checkout: '',
              lateFees: ''
            },
            siteGuidelines: {
              maxGuests: 0,
              maxVehicles: 0,
              quietHours: null,
              petRules: '',
              ageRestrictions: ''
            },
            cancellationPolicy: {
              fullRefund: '',
              partialRefund: '',
              noRefund: '',
              modifications: '',
              weatherPolicy: ''
            },
            maxGuests: 0,
            taxRate: 0,
            providers: [],
            nearbyAttractions: [],
            siteTypes: {
              tent: false,
              rv: false,
              lodging: false
            },
            // Add the city from the stored campground data
            city: cg.city
          };
        });
        
        // Enhance campgrounds with data from our static JSON files
        campgrounds = enhanceCampgroundsWithData(campgrounds, cityName);
        
        return {
          id: trip.id,
          confirmationId: trip.confirmation_id,
          trip_details,
          selectedCampgrounds: campgrounds,
          createdAt: trip.created_at,
          status: trip.status,
          guideUrl: trip.guide_url
        };
      });
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
      
      // Validate trip_details and startDate exist
      if (!data.trip_details || !data.trip_details.startDate) {
        console.error(`Trip ${data.id} is missing required trip_details or startDate`);
        throw new Error(`Trip ${data.id} is missing required data`);
      }
      
      const trip_details: TripDetails = {
        destination: data.trip_details.destination,
        nights: data.trip_details.nights,
        startDate: new Date(data.trip_details.startDate),
        guestCount: data.trip_details.guestCount
      };
      
      // Get destination data for enhancing campgrounds
      const destinationData = getDestinationData(trip_details.destination);
      const cityName = destinationData.name;
      
      // Convert minimal campground data to fully enhanced campgrounds
      let campgrounds = data.campgrounds.map((cg: StoredCampground) => {
        // Verify city information is present
        if (!cg.city) {
          console.error(`Missing city information for campground ${cg.id} in trip ${data.id}`);
          throw new Error(`Campground ${cg.id} is missing required city information`);
        }
        
        return {
          id: cg.id,
          name: cg.id,
          price: cg.price || 0,
          description: '',
          rating: 0,
          amenities: [],
          coordinates: [0, 0],
          images: [],
          imageUrl: '',
          address: '',
          distanceToTown: '',
          season: {
            start: '',
            end: ''
          },
          checkIn: {
            time: '',
            lateArrival: '',
            checkout: '',
            lateFees: ''
          },
          siteGuidelines: {
            maxGuests: 0,
            maxVehicles: 0,
            quietHours: null,
            petRules: '',
            ageRestrictions: ''
          },
          cancellationPolicy: {
            fullRefund: '',
            partialRefund: '',
            noRefund: '',
            modifications: '',
            weatherPolicy: ''
          },
          maxGuests: 0,
          taxRate: 0,
          providers: [],
          nearbyAttractions: [],
          siteTypes: {
            tent: false,
            rv: false,
            lodging: false
          },
          // Add the city from the stored campground data
          city: cg.city
        };
      });
      
      // Enhance campgrounds with data from our static JSON files
      campgrounds = enhanceCampgroundsWithData(campgrounds, cityName);
      
      return {
        id: data.id,
        confirmationId: data.confirmation_id,
        trip_details,
        selectedCampgrounds: campgrounds,
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
      console.log('Creating trip with data:', {
        userId,
        destination,
        duration,
        campgroundCount: selectedCampgrounds.length
      });
      
      // Validate destination has required fields
      if (!destination || !destination.id || !destination.name || !destination.region) {
        console.error('Invalid destination object:', destination);
        throw new Error('Destination is missing required fields');
      }
      
      // Validate startDate exists
      if (!duration.startDate) {
        console.error('Missing required startDate for trip creation');
        throw new Error('Start date is required for trip creation');
      }
      
      // Validate guestCount exists
      if (duration.guestCount === undefined) {
        console.error('Missing required guestCount for trip creation');
        throw new Error('Guest count is required for trip creation');
      }
      
      const tripId = 'T' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
      const confirmationId = 'C' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
      
      // Create trip_details object from destination and duration
      const trip_details: TripDetails = {
        destination: destination.id,
        nights: duration.nights,
        startDate: duration.startDate,
        guestCount: duration.guestCount
      };
      
      // Store only essential data for Supabase
      const tripData: OptimizedTripData = {
        id: tripId,
        confirmation_id: confirmationId,
        user_id: userId,
        trip_details: {
          destination: destination.id,
          nights: duration.nights,
          startDate: duration.startDate.toISOString(),
          guestCount: duration.guestCount
        },
        campgrounds: selectedCampgrounds.map(cg => {
          // Use the city property directly from the campground object
          // This is set during trip planning and should be available
          if (!cg.city) {
            throw new Error(`Missing city information for campground: ${cg.id}. City information is required for all campgrounds.`);
          }
          
          return {
            id: cg.id,
            price: cg.price || 0,
            city: cg.city
          };
        }),
        created_at: new Date().toISOString(),
        status: 'planned'
      };
      
      console.log('Preparing to insert trip data into Supabase:', JSON.stringify(tripData, null, 2));
      
      const { data, error } = await supabase
        .from('trips')
        .insert(tripData)
        .select();
      
      if (error) {
        console.error('Supabase insert error details:', error);
        throw error;
      }
      
      // Return the SavedTrip object constructed from our input data
      // We don't rely on the response data since Supabase may not return it completely
      return {
        id: tripId,
        confirmationId,
        trip_details,
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
      // Validate startDate exists
      if (!trip.trip_details.startDate) {
        console.error(`Trip ${trip.id} is missing required startDate for update`);
        throw new Error(`Start date is required for trip update`);
      }
      
      // Store only essential data for Supabase
      const tripData = {
        trip_details: {
          destination: trip.trip_details.destination,
          nights: trip.trip_details.nights,
          startDate: trip.trip_details.startDate.toISOString(),
          guestCount: trip.trip_details.guestCount
        },
        campgrounds: trip.selectedCampgrounds.map(cg => {
          // Ensure city information is included
          if (!cg.city) {
            throw new Error(`Missing city information for campground: ${cg.id}. City information is required for all campgrounds.`);
          }

          return {
            id: cg.id,
            price: cg.price || 0,
            city: cg.city
          };
        }),
        status: trip.status,
        guide_url: trip.guideUrl
      };
      
      const { error } = await supabase
        .from('trips')
        .update(tripData)
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

// Export default object with the functions needed by TripPlanContext
export default {
  generateTripWithoutAvailability,
  fetchCityAvailability
};