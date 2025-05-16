import { Campground } from '../types';
import northernMichiganData from '../info/campgrounds/northern-michigan-data.json';

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
      coordinates?: [number, number];
    }
  }
}

const getRegionKey = (cityName: string): string => {
  const cityMappings: Record<string, string> = {
    'Traverse City': 'traverseCity',
    'Mackinac City': 'mackinacCity',
    'Pictured Rocks': 'picturedRocks'
  };
  
  return cityMappings[cityName] || cityName.toLowerCase().replace(/\s+/g, '');
};

export const enhanceCampgroundsWithData = (campgroundList: Campground[], cityName: string): Campground[] => {
  if (!cityName) return campgroundList;
  
  const regionKey = getRegionKey(cityName);
  const regionData = (northernMichiganData as unknown as CampgroundInfoData)[regionKey];
  
  if (!regionData) {
    console.warn(`No data found for region: ${regionKey}`);
    return campgroundList;
  }
  
  return campgroundList.map(campground => {
    const campgroundId = campground.id;
    
    const baseNameParts = campgroundId.split('-');
    
    const possibleKeys = [
      campgroundId.replace(/-/g, ''),
      baseNameParts[baseNameParts.length - 1],
      campgroundId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
      baseNameParts[baseNameParts.length - 1].toLowerCase(),
      campgroundId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    ];

    let matchingKey = '';
    
    for (const key of Object.keys(regionData)) {
      if (possibleKeys.includes(key)) {
        matchingKey = key;
        break;
      }
    }
    
    if (!matchingKey) {
      for (const key of Object.keys(regionData)) {
        for (const possibleKey of possibleKeys) {
          if (key.toLowerCase().includes(possibleKey.toLowerCase()) || 
              possibleKey.toLowerCase().includes(key.toLowerCase())) {
            matchingKey = key;
            break;
          }
        }
        if (matchingKey) break;
      }
    }
    
    if (matchingKey && regionData[matchingKey]) {
      const detailedData = regionData[matchingKey];
      
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
        coordinates: detailedData.coordinates || campground.coordinates,
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

    return campground;
  });
}; 