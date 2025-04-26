import axios from 'axios';
import { Destination, Campground, CampgroundAvailability } from '../types';

// Get the API URL from environment variables or use default
const API_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:5001/api';

// Log the API URL for debugging
console.log('Using API URL:', API_URL);

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Queue system for availability requests
class RequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing = false;
  private concurrentLimit = 2; // Process 2 requests at a time
  private activeRequests = 0;

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.activeRequests >= this.concurrentLimit) return;
    
    this.processing = true;
    
    while (this.queue.length > 0 && this.activeRequests < this.concurrentLimit) {
      const request = this.queue.shift();
      if (!request) continue;
      
      this.activeRequests++;
      
      try {
        await request();
      } catch (error) {
        console.error("Error processing request in queue:", error);
      } finally {
        this.activeRequests--;
      }
    }
    
    this.processing = false;
    
    // If there are still items in the queue and we have capacity, process more
    if (this.queue.length > 0 && this.activeRequests < this.concurrentLimit) {
      this.processQueue();
    }
  }
}

// Create a request queue instance
const availabilityQueue = new RequestQueue();

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
   * Uses a queue system to prevent too many concurrent requests
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
    // Define the actual request function
    const makeRequest = async () => {
      try {
        console.log(`Checking availability for ${campgroundId}`);
        const response = await api.post('/availability', {
          campgroundId,
          startDate,
          endDate,
          numAdults,
          numKids,
          accommodationType
        });
        console.log(`Received availability for ${campgroundId}`);
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
    };

    // Add this request to the queue
    return availabilityQueue.add(makeRequest);
  }
};

export default apiService; 