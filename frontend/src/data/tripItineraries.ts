import { TripItinerary, TripStop } from '../types';

// Define trip stops for different destinations
const northernMichiganStops: Record<number, TripStop[]> = {
  1: [{ city: 'Traverse City', nights: 1 }],
  2: [{ city: 'Traverse City', nights: 2 }],
  3: [
    { city: 'Traverse City', nights: 2 },
    { city: 'Mackinac', nights: 1 }
  ],
  4: [
    { city: 'Traverse City', nights: 2 },
    { city: 'Mackinac', nights: 2 }
  ],
  5: [
    { city: 'Traverse City', nights: 2 },
    { city: 'Mackinac', nights: 1 },
    { city: 'Pictured Rocks', nights: 2 }
  ],
  6: [
    { city: 'Traverse City', nights: 2 },
    { city: 'Mackinac', nights: 2 },
    { city: 'Pictured Rocks', nights: 2 }
  ],
  7: [
    { city: 'Traverse City', nights: 2 },
    { city: 'Mackinac', nights: 2 },
    { city: 'Pictured Rocks', nights: 3 }
  ],
  8: [
    { city: 'Traverse City', nights: 3 },
    { city: 'Mackinac', nights: 2 },
    { city: 'Pictured Rocks', nights: 3 }
  ],
  9: [
    { city: 'Traverse City', nights: 3 },
    { city: 'Mackinac', nights: 3 },
    { city: 'Pictured Rocks', nights: 3 }
  ]
};

// Define the trip itineraries for each destination
export const tripItineraries: Record<string, TripItinerary> = {
  'northern-michigan': {
    id: 'northern-michigan',
    name: 'Northern Michigan',
    description: 'Explore the scenic beauty of Northern Michigan',
    stops: northernMichiganStops,
    cityScraperIds: {
      'Traverse City': 'traverse-city',
      'Mackinac': 'mackinac-city',
      'Pictured Rocks': 'pictured-rocks'
    }
  },
  'arizona': {
    id: 'arizona',
    name: 'Arizona Adventure',
    description: 'Experience the natural wonders of Arizona',
    stops: {}, // To be populated with Arizona specific itinerary
    cityScraperIds: {
      'Phoenix': 'phoenix',
      'Sedona': 'sedona',
      'Grand Canyon': 'grand-canyon',
      'Page': 'page'
    }
  },
  'washington': {
    id: 'washington',
    name: 'Washington Expedition',
    description: 'Discover the diverse landscapes of Washington state',
    stops: {}, // To be populated with Washington specific itinerary
    cityScraperIds: {
      'Seattle': 'seattle',
      'Olympic': 'olympic',
      'Mount Rainier': 'mount-rainier',
      'North Cascades': 'north-cascades'
    }
  },
  'utah': {
    id: 'utah',
    name: 'Utah Parks Tour',
    description: 'Visit the magnificent national parks of Utah',
    stops: {}, // To be populated with Utah specific itinerary
    cityScraperIds: {
      'Zion': 'zion',
      'Bryce Canyon': 'bryce-canyon',
      'Arches': 'arches',
      'Canyonlands': 'canyonlands'
    }
  },
  'smoky-mountains': {
    id: 'smoky-mountains',
    name: 'Smoky Mountains Journey',
    description: 'Journey through the beautiful Smoky Mountains',
    stops: {}, // To be populated with Smoky Mountains specific itinerary
    cityScraperIds: {
      'Gatlinburg': 'gatlinburg',
      'Cherokee': 'cherokee',
      'Pigeon Forge': 'pigeon-forge',
      'Asheville': 'asheville'
    }
  }
}; 