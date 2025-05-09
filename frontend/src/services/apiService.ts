import axios from 'axios';
import { Destination, Campground } from '../types';
import { FullAvailability, AccommodationAvailability } from '../types/campground';


// Get the API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Log the API URL for debugging
console.log('Using API URL:', API_URL);

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  /**
   * Check the health of the API
   */
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('API health check failed:', error);
      throw error;
    }
  },

  /**
   * Get list of available cities
   */
  async getCities(): Promise<Destination[]> {
    try {
      const response = await api.get('/cities');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      return [];
    }
  },

  /**
   * Get campgrounds for a specific city
   */
  async getCampgrounds(cityId: string): Promise<Campground[]> {
    try {
      const response = await api.get(`/campgrounds/${cityId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch campgrounds for city ${cityId}:`, error);
      return [];
    }
  },

  /**
   * Check availability for a specific campground and date range
   */
  async checkAvailability(
    campgroundId: string,
    startDate: string, // Format: MM/DD/YY
    endDate: string,   // Format: MM/DD/YY
    numAdults: number,
    numKids: number
  ): Promise<FullAvailability> {
    try {
      const response = await api.post('/availability', {
        campgroundId,
        startDate,
        endDate,
        numAdults,
        numKids
      });
      console.log(`Received availability for ${campgroundId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to check availability for campground ${campgroundId}:`, error);

      let errorMessage = 'Failed to check availability';
      if (error.response && error.response.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }
};

export default apiService;
