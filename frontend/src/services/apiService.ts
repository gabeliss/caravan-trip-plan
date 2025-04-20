import axios from 'axios';
import { Destination, Campground, CampgroundAvailability } from '../types';

// Get the API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
    numAdults: number = 2,
    numKids: number = 0,
    accommodationType: string = 'tent'
  ): Promise<{
    available: boolean;
    price: number | null;
    message: string;
    timestamp: string;
    error?: string;
  }> {
    try {
      const response = await api.post('/availability', {
        campgroundId,
        startDate,
        endDate,
        numAdults,
        numKids,
        accommodationType
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to check availability for campground ${campgroundId}:`, error);
      return {
        available: false,
        price: null,
        message: 'Failed to check availability',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

export default apiService; 