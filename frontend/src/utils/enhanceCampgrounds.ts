import { Campground } from '../types';
import northernMichiganData from '../info/campgrounds/northern-michigan-data.json';

// Define a type for the campground data structure from JSON
interface CampgroundInfoData {
  [region: string]: {
    [campgroundId: string]: {
      title: string;
      address: string;
      cityAndState: string;
      content: string;
      imageUrls: string[];
      offerings: string;
      distanceToTown: string;
      amenities: string[];
      checkInTime: string;
      checkOutTime: string;
      guidelines: string;
      cancellationPolicy: string | string[];
      accomodationType?: string[];
      bookingUrl?: string;
      maxGuests?: number | string;
      petRules?: string;
      quietHours?: string | null;
    }
  }
}

// Helper function to get region key from city name
const getRegionKey = (cityName: string): string => {
  // Convert from display name to camelCase region key used in JSON data
  const cityMappings: Record<string, string> = {
    'Traverse City': 'traverseCity',
    'Mackinac City': 'mackinacCity',
    'Pictured Rocks': 'picturedRocks'
  };
  
  return cityMappings[cityName] || cityName.toLowerCase().replace(/\s+/g, '');
};

// Function to enhance campgrounds with data from the JSON file
export const enhanceCampgroundsWithData = (campgroundList: Campground[], cityName: string): Campground[] => {
  if (!cityName) return campgroundList;
  
  // Get the region data from our JSON
  const regionKey = getRegionKey(cityName);
  const regionData = (northernMichiganData as unknown as CampgroundInfoData)[regionKey];
  
  if (!regionData) {
    console.warn(`No data found for region: ${regionKey}`);
    return campgroundList;
  }
  
  // Debug: Log all campground IDs and their booking URLs in the JSON data
  console.log("All campgrounds in JSON data for region", regionKey);
  Object.entries(regionData).forEach(([key, data]) => {
    console.log(`JSON data: ${key} bookingUrl:`, data.bookingUrl);
  });
  
  return campgroundList.map(campground => {
    // Create a more comprehensive set of possible keys to match between API and JSON data
    const campgroundId = campground.id;
    
    // Debug: Log the campground ID we're trying to match
    console.log(`Enhancing campground: ${campgroundId}`);
    
    // Extract the base name without the region prefix
    const baseNameParts = campgroundId.split('-');
    const baseName = baseNameParts.slice(Math.max(0, baseNameParts.length - 2)).join('');
    
    // Create different variations of the ID to try matching
    const possibleKeys = [
      // Direct transformations
      campgroundId.replace(/-/g, ''),                         // Remove all hyphens
      baseNameParts[baseNameParts.length - 1],                // Just the last part
      
      // CamelCase variations 
      // Convert kebab-case to camelCase (e.g., "traverse-city-state-park" to "traverseCityStatePark")
      campgroundId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
      
      // Specific case for single-word campgrounds with region prefixes
      baseNameParts[baseNameParts.length - 1].toLowerCase(),  // Last part lowercase
      
      // Try more aggressive transformations for complex cases
      campgroundId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() // Remove all non-alphanumeric
    ];
    
    // Debug: Log the possible keys we're trying
    console.log(`Possible keys for ${campgroundId}:`, possibleKeys);
    
    // Find the matching key in our JSON data
    let matchingKey = '';
    
    // First try exact matches
    for (const key of Object.keys(regionData)) {
      if (possibleKeys.includes(key)) {
        matchingKey = key;
        break;
      }
    }
    
    // If no exact match, try partial matches
    if (!matchingKey) {
      for (const key of Object.keys(regionData)) {
        for (const possibleKey of possibleKeys) {
          // Check if the key contains the possible key or vice versa
          if (key.toLowerCase().includes(possibleKey.toLowerCase()) || 
              possibleKey.toLowerCase().includes(key.toLowerCase())) {
            matchingKey = key;
            break;
          }
        }
        if (matchingKey) break;
      }
    }
    
    // Debug: Log the matching key (if any)
    console.log(`Matched ${campgroundId} to key: ${matchingKey || 'No match'}`);
    
    // If we found matching detailed data, enhance the campground with it
    if (matchingKey && regionData[matchingKey]) {
      const detailedData = regionData[matchingKey];
      
      // Debug: Log the bookingUrl we found
      console.log(`bookingUrl for ${campgroundId} from JSON:`, detailedData.bookingUrl);
      
      // Create site types based on the accommodationType array in the JSON data
      const siteTypes = {
        tent: detailedData.accomodationType?.includes('tent') || false,
        rv: detailedData.accomodationType?.includes('rv') || false,
        lodging: detailedData.accomodationType?.includes('lodging') || false
      };

      return {
        ...campground,
        name: detailedData.title || campground.name,
        description: detailedData.content || campground.description,
        address: detailedData.address || campground.address,
        rating: campground.rating || 4 + Math.random(),
        amenities: detailedData.amenities || campground.amenities || ['WiFi', 'Showers', 'Toilets', 'Fire pit'],
        images: detailedData.imageUrls?.map(url => ({ url, alt: detailedData.title })) || campground.images || [
          { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', alt: 'Campsite' },
          { url: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a', alt: 'Campsite view' }
        ],
        imageUrl: detailedData.imageUrls?.[0] || campground.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
        distanceToTown: detailedData.distanceToTown || campground.distanceToTown || `5 miles to ${cityName}`,
        bookingUrl: detailedData.bookingUrl || campground.bookingUrl,
        city: campground.city || cityName,
        checkIn: {
          time: detailedData.checkInTime || '3:00 PM',
          lateArrival: 'Call ahead',
          checkout: detailedData.checkOutTime || '11:00 AM',
          lateFees: 'Varies by campground'
        },
        siteGuidelines: {
          maxGuests: detailedData.maxGuests || parseInt(detailedData.guidelines?.match(/(\d+)\s+Guests/i)?.[1] || '6'),
          maxVehicles: 2,
          quietHours: detailedData.quietHours !== undefined ? detailedData.quietHours : 
                     (detailedData.guidelines?.match(/Quiet Hours:\s*(.*?)(?:$|,)/i)?.[1] || '10:00 PM - 7:00 AM'),
          petRules: detailedData.petRules || 
            (detailedData.guidelines?.match(/Pet Friendly[^,]*(?:,|$)/i)?.[0] || 
             (detailedData.amenities?.some(a => a.toLowerCase().includes('pet')) ? 'Pet friendly' : 'No pets allowed')),
          ageRestrictions: 'None'
        },
        cancellationPolicy: {
          fullRefund: 'See policy details',
          partialRefund: 'See policy details',
          noRefund: 'See policy details',
          modifications: 'Subject to availability',
          weatherPolicy: 'No refunds for weather',
          details: detailedData.cancellationPolicy
        },
        maxGuests: detailedData.maxGuests || parseInt(detailedData.guidelines?.match(/(\d+)\s+Guests/i)?.[1] || '6'),
        siteTypes: siteTypes,
      };
    }

    // Debug: Log if we didn't find a match
    console.log(`No match found for ${campgroundId} - no enhancement applied`);
    
    return campground;
  });
}; 