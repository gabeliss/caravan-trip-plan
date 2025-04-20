import { Campground } from '../types';

// Cache for availability data
const availabilityCache = new Map<string, AvailabilityData>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface AvailabilityData {
  available: boolean;
  price: number;
  timestamp: number;
  lastUpdated: string;
}

interface BookingSite {
  name: string;
  baseUrl: string;
  searchParams: Record<string, string>;
}

const bookingSites: Record<string, BookingSite> = {
  recreationGov: {
    name: 'Recreation.gov',
    baseUrl: 'https://www.recreation.gov/camping/campgrounds',
    searchParams: {
      'northern-michigan': 'mi',
    }
  },
  hipcamp: {
    name: 'Hipcamp',
    baseUrl: 'https://www.hipcamp.com/michigan',
    searchParams: {
      'northern-michigan': 'traverse-city,mackinaw-city,pictured-rocks',
    }
  },
  theDyrt: {
    name: 'The Dyrt',
    baseUrl: 'https://thedyrt.com/camping/michigan',
    searchParams: {
      'northern-michigan': 'northern-michigan',
    }
  }
};

export const campgroundService = {
  /**
   * Check availability for a specific campground
   */
  async checkAvailability(
    campground: Campground,
    startDate: Date,
    nights: number
  ): Promise<AvailabilityData> {
    const cacheKey = `${campground.id}-${startDate.toISOString()}-${nights}`;
    const cached = availabilityCache.get(cacheKey);

    // Return cached data if it's still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }

    // In a real implementation, this would make API calls to the various booking platforms
    // For now, we'll simulate availability with random data
    const availability: AvailabilityData = {
      available: Math.random() > 0.3, // 70% chance of being available
      price: campground.price * (0.9 + Math.random() * 0.2), // Vary price by ±10%
      timestamp: Date.now(),
      lastUpdated: new Date().toISOString()
    };

    // Cache the result
    availabilityCache.set(cacheKey, availability);
    return availability;
  },

  /**
   * Get booking URL for a campground
   */
  getBookingUrl(campground: Campground): string {
    if (campground.bookingUrl) {
      return campground.bookingUrl;
    }

    // Return external booking URLs based on campground location
    const region = Object.keys(bookingSites).find(site => 
      campground.id.includes(site)
    );

    if (region && bookingSites[region]) {
      return `${bookingSites[region].baseUrl}/${campground.id}`;
    }

    return '';
  },

  /**
   * Subscribe to availability updates
   */
  subscribeToUpdates(
    campground: Campground,
    callback: (data: AvailabilityData) => void
  ): () => void {
    const intervalId = setInterval(async () => {
      const availability = await this.checkAvailability(
        campground,
        new Date(),
        1
      );
      callback(availability);
    }, CACHE_DURATION);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
};