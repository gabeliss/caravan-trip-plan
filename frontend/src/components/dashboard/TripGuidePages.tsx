import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map as MapIcon,
  Calendar,
  Utensils,
  Tent,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Mountain,
  Bike,
  Ship,
  Castle,
  PackageOpen,
  CookingPot,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Moon,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Book,
  ArrowLeft
} from 'lucide-react';
import { SavedTrip, Campground } from '../../types';
import { Map } from '../Map';
import { RestaurantCard } from './RestaurantCard';
import { ActivityCard } from './ActivityCard';
import { TrailCard } from './TrailCard';
import { format, addDays, differenceInDays } from 'date-fns';
import northernMichiganData from '../../info/campgrounds/northern-michigan-data.json';

interface TripGuidePagesProps {
  trip: SavedTrip;
  onBack?: () => void;
}

type Page = 'overview' | 'recommendations' | 'packing' | 'recipes';

interface NavItem {
  id: Page;
  label: string;
  icon: React.FC<{ className?: string }>;
}

interface ConsolidatedStay {
  campground: {
    id: string;
    name: string;
    imageUrl: string;
    location: string;
    bookingUrl?: string;
    city?: string;
  };
  nights: {
    start: number;
    end: number;
    dates?: {
      start: Date;
      end: Date;
    };
  };
  totalNights: number;
}

const navigation: NavItem[] = [
  { id: 'overview', label: 'Trip Overview', icon: MapIcon },
  { id: 'recommendations', label: 'Recommendations', icon: Book },
  { id: 'packing', label: 'Packing List', icon: PackageOpen },
  { id: 'recipes', label: 'Camp Recipes', icon: CookingPot }
];

const calculateClothingQuantities = (nights: number) => {
  return {
    tshirts: Math.min(nights + 1, 7), // One extra shirt, max 7
    longSleeves: Math.ceil(nights / 3), // 1 for every 3 nights
    shorts: Math.min(Math.ceil(nights / 2) + 1, 4), // 1 for every 2 nights plus 1, max 4
    pants: Math.min(Math.ceil(nights / 3) + 1, 3), // 1 for every 3 nights plus 1, max 3
    sweatshirts: Math.min(Math.ceil(nights / 3) + 1, 2), // 1 for every 3 nights plus 1, max 2
    sweatpants: 1, // Always 1
    underwearSocks: nights + 1 // One extra pair
  };
};

// Helper function to look up campground details from the JSON data
const getCampgroundDetails = (campgroundId: string, city?: string) => {
  // If we don't have city info, throw an error instead of returning null
  if (!city) {
    throw new Error(`Missing city information for campground: ${campgroundId}`);
  }
  
  // Convert city to a region key (camelCase) that matches our JSON structure
  // This will throw an error if the city can't be mapped to a region key
  const regionKey = convertCityToRegionKey(city);
  
  // Check if we have data for this region in our JSON
  if (!(regionKey in northernMichiganData)) {
    throw new Error(`Region key "${regionKey}" not found in northern Michigan data for city: ${city}`);
  }
  
  // Get all campgrounds in this region
  const regionData = (northernMichiganData as any)[regionKey];
  
  // Try different variations of the campground ID to find a match
  const possibleMatches = Object.keys(regionData).filter(key => {
    // Direct match
    if (key === campgroundId) return true;
    
    // Kebab-case to camelCase conversion
    const camelId = campgroundId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (key === camelId) return true;
    
    // Remove hyphens
    const noHyphens = campgroundId.replace(/-/g, '');
    if (key === noHyphens) return true;
    
    // Handle special cases
    if (campgroundId === 'teepee-campground' && key === 'teePeeCampground') return true;
    
    // Case-insensitive comparison
    if (key.toLowerCase() === campgroundId.toLowerCase()) return true;
    
    // Compare normalized versions (remove non-alphanumeric characters and make lowercase)
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedId = campgroundId.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedKey === normalizedId) return true;
    
    // Partial match - if one contains the other
    return key.toLowerCase().includes(campgroundId.toLowerCase()) || 
           campgroundId.toLowerCase().includes(key.toLowerCase());
  });
  
  // If we found a match, return the campground details
  if (possibleMatches.length > 0) {
    console.log(`Found campground match for ${campgroundId} in ${regionKey}:`, possibleMatches[0]);
    return regionData[possibleMatches[0]];
  }
  
  // If no match was found, throw an error with detailed information
  throw new Error(`No match found for campground ${campgroundId} in region ${regionKey} (city: ${city})`);
};

// Helper function to convert city name to region key
const convertCityToRegionKey = (cityName: string): string => {
  // Normalize the city name by removing spaces and converting to lowercase
  const normalized = cityName.toLowerCase().replace(/\s+/g, '');
  
  // Map of known city names to region keys in the JSON data
  const cityToRegionMap: Record<string, string> = {
    'traversecity': 'traverseCity',
    'mackinaccity': 'mackinacCity',
    'mackinac': 'mackinacCity',
    'mackinaw': 'mackinacCity',
    'mackinawcity': 'mackinacCity',
    'picturedrocks': 'picturedRocks',
    'munising': 'picturedRocks',
    'autrain': 'picturedRocks',
    'indianriver': 'mackinacCity',
    'stignace': 'mackinacCity',
    'leelanau': 'traverseCity',
    'leelanaucounty': 'traverseCity',
    'cedar': 'traverseCity',
    'suttons': 'traverseCity',
    'suttonsbay': 'traverseCity',
    'leland': 'traverseCity'
  };
  
  // Try direct lookup first
  let regionKey = cityToRegionMap[normalized];
  
  // If not found, try to find a partial match
  if (!regionKey) {
    for (const [cityKey, regionValue] of Object.entries(cityToRegionMap)) {
      if (normalized.includes(cityKey) || cityKey.includes(normalized)) {
        regionKey = regionValue;
        break;
      }
    }
  }
  
  // If still not found, throw an error
  if (!regionKey) {
    console.error(`Unable to map city name "${cityName}" (normalized: "${normalized}") to a region key`);
    console.error('Available city keys:', Object.keys(cityToRegionMap));
    throw new Error(`Unable to map city name "${cityName}" to a region key. Add this mapping to the cityToRegionMap.`);
  }
  
  return regionKey;
};

// Helper function to format destination ID to display name
const formatDestinationName = (destinationId: string): string => {
  return destinationId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const TripGuidePages: React.FC<TripGuidePagesProps> = ({ trip, onBack }) => {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'packlist' | 'activities'>('itinerary');
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});
  
  // Verify required trip properties are present
  if (!trip.trip_details.guestCount) {
    throw new Error('Trip is missing required guest count information');
  }
  
  // Format the destination name for display
  const destinationName = formatDestinationName(trip.trip_details.destination);
  
  // Calculate days until trip
  const daysUntilTrip = differenceInDays(trip.trip_details.startDate, new Date());
  
  // Group nights at same location
  const groupedNights = Array.from({ length: trip.trip_details.nights }).reduce<{
    campground: Campground;
    nights: number[];
    startDate?: Date;
    endDate?: Date;
  }[]>((groups, _, index) => {
    const nightIndex = index;
    const campground = trip.selectedCampgrounds[nightIndex];
    
    // Calculate the date for this night
    const date = trip.trip_details.startDate && addDays(trip.trip_details.startDate, index);
    
    // If this is the same campground as the last one, add to that group
    const lastGroup = groups.length > 0 ? groups[groups.length - 1] : null;
    
    if (lastGroup && lastGroup.campground.id === campground.id) {
      lastGroup.nights.push(nightIndex + 1);
      
      // Update end date
      if (date) {
        lastGroup.endDate = date;
      }
      
      return groups;
    }
    
    // Otherwise, start a new group
    const newGroup = {
      campground,
      nights: [nightIndex + 1],
      startDate: date,
      endDate: date
    };
    
    groups.push(newGroup);
    return groups;
  }, []);
  
  // Format trip dates
  const dateRangeText = trip.trip_details.startDate
    ? `${format(trip.trip_details.startDate, 'MMM d')} - ${format(
        addDays(trip.trip_details.startDate, trip.trip_details.nights - 1),
        'MMM d, yyyy'
      )}`
    : `${trip.trip_details.nights} Nights`;
  
  console.log("Formatted destination name:", destinationName);

  const getConsolidatedStays = (): ConsolidatedStay[] => {
    const stays: ConsolidatedStay[] = [];
    let currentStay: ConsolidatedStay | null = null;

    trip.selectedCampgrounds.forEach((campground, index) => {
      console.log(`Processing campground ${index}:`, campground.id, "bookingUrl:", campground.bookingUrl);
      
      // Verify that the campground has city information, throw an error if missing
      if (!campground.city) {
        throw new Error(`Missing city information for campground: ${campground.id} at index ${index}`);
      }
      
      // Get city from the campground data
      const city = campground.city;
      
      // Determine location from city for display
      const location = city;
      
      const date = trip.trip_details.startDate && addDays(trip.trip_details.startDate, index);
      
      if (!currentStay || currentStay.campground.id !== campground.id) {
        if (currentStay) {
          stays.push(currentStay);
        }
        currentStay = {
          campground: {
            id: campground.id,
            name: campground.name,
            imageUrl: campground.imageUrl,
            location: location,
            bookingUrl: campground.bookingUrl,
            city: city // Store the city for reference
          },
          nights: {
            start: index + 1,
            end: index + 1,
            dates: trip.trip_details.startDate ? {
              start: date!,
              end: date!
            } : undefined
          },
          totalNights: 1
        };
      } else {
        currentStay.nights.end = index + 1;
        currentStay.totalNights++;
        if (currentStay.nights.dates) {
          currentStay.nights.dates.end = date!;
        }
      }
    });

    if (currentStay) {
      stays.push(currentStay);
    }

    // Add debug logging for all stays
    stays.forEach((stay, index) => {
      console.log(`Stay ${index}:`, stay.campground.id, "bookingUrl:", stay.campground.bookingUrl, "city:", stay.campground.city);
    });

    return stays;
  };

  const renderStayCard = (stay: ConsolidatedStay) => {
    const nightsText = stay.totalNights === 1 
      ? `Night ${stay.nights.start}`
      : `Nights ${stay.nights.start}-${stay.nights.end}`;
    
    // Enhanced debugging
    console.log("Rendering stay card for", stay.campground.id);
    console.log("Direct bookingUrl from stay:", stay.campground.bookingUrl);
    console.log("City information:", stay.campground.city);
    
    // Try to find the campground in the trip data as a fallback for booking URL
    const campgroundInTrip = trip.selectedCampgrounds.find(c => c.id === stay.campground.id);
    console.log("Campground in trip data:", campgroundInTrip?.id, "bookingUrl:", campgroundInTrip?.bookingUrl);
    
    // Attempt to get enhanced campground details from our JSON data
    let enhancedData = null;
    try {
      if (stay.campground.city) {
        enhancedData = getCampgroundDetails(stay.campground.id, stay.campground.city);
        console.log("Enhanced data found for campground:", enhancedData);
      }
    } catch (error) {
      console.error("Could not get enhanced data:", error);
      
      // Even if we couldn't get enhanced data due to ID mismatch, try a direct lookup for special cases
      if (stay.campground.id === 'teepee-campground' && stay.campground.city && stay.campground.city.toLowerCase().includes('mackinac')) {
        try {
          enhancedData = (northernMichiganData as any)['mackinacCity']['teePeeCampground'];
          console.log("Found data for teepee-campground using direct lookup:", enhancedData);
        } catch (directLookupError) {
          console.error("Direct lookup also failed:", directLookupError);
        }
      }
    }
    
    // Use either the stay's bookingUrl, enhanced data bookingUrl, or fallback to the one from trip data
    const finalBookingUrl = stay.campground.bookingUrl || (enhancedData?.bookingUrl) || campgroundInTrip?.bookingUrl;
    console.log("Final bookingUrl to use:", finalBookingUrl);

    return (
      <div className="bg-white rounded-lg border p-3">
        <div className="flex items-start gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={enhancedData?.imageUrls?.[0] || stay.campground.imageUrl}
              alt={stay.campground.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg text-primary-dark">{nightsText}</h3>
                <p className="text-sm text-gray-600">{enhancedData?.cityAndState || stay.campground.location}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Moon className="w-4 h-4 text-primary-dark" />
                <span className="font-medium">{stay.totalNights}</span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">{enhancedData?.title || stay.campground.name}</p>
              {stay.nights.dates && (
                <p className="text-sm text-gray-500 mt-1">
                  {format(stay.nights.dates.start, 'MMM d')} - {format(stay.nights.dates.end, 'MMM d, yyyy')}
                </p>
              )}
            </div>

            <div className="mt-3">
              {finalBookingUrl ? (
                <a
                  href={finalBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-dark hover:text-primary-dark/80 flex items-center gap-1"
                >
                  Book Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-sm text-gray-400 flex items-center gap-1 cursor-not-allowed" title="Booking link not available">
                  Book Now (Unavailable)
                  <ExternalLink className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Column - Recommendations */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-lg border">
          <div className="p-3 border-b">
            <h2 className="text-xl font-semibold">Your Stays</h2>
          </div>
          <div className="divide-y">
            {getConsolidatedStays().map((stay, index) => (
              <div key={`${stay.campground.id}-${stay.nights.start}`} className="p-3">
                {renderStayCard(stay)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Map */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-3">Trip Route</h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <Map 
              destination={typeof trip.trip_details.destination === 'string' 
                ? { id: trip.trip_details.destination, name: destinationName, region: 'Michigan' } 
                : trip.trip_details.destination
              } 
              selectedCampgrounds={trip.selectedCampgrounds} 
            />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>Your journey through {destinationName} includes {getConsolidatedStays().length} unique campgrounds.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendationsPage = () => (
    <div className="space-y-4">
      {getConsolidatedStays().map((stay, index) => {
        // Try to get enhanced data for this campground
        let enhancedData = null;
        try {
          if (stay.campground.city) {
            enhancedData = getCampgroundDetails(stay.campground.id, stay.campground.city);
          }
        } catch (error) {
          console.error(`Could not get enhanced data for ${stay.campground.id}:`, error);
        }
        
        return (
          <div key={`${stay.campground.id}-${stay.nights.start}`} className="bg-white rounded-lg border">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">
                    {stay.nights.start === stay.nights.end 
                      ? `Night ${stay.nights.start}` 
                      : `Nights ${stay.nights.start}-${stay.nights.end}`}
                  </h3>
                  <p className="text-sm text-gray-600">{enhancedData?.cityAndState || stay.campground.location}</p>
                </div>
                <button
                  onClick={() => setExpandedLocation(expandedLocation === stay.campground.location ? null : stay.campground.location)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {expandedLocation === stay.campground.location ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedLocation === stay.campground.location && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 space-y-4">
                    {/* Campground Details */}
                    {enhancedData && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Tent className="w-5 h-5 text-primary-dark" />
                          <h4 className="font-medium">About {enhancedData.title}</h4>
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          {enhancedData.content}
                        </div>
                        {enhancedData.amenities && enhancedData.amenities.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium mb-2">Amenities:</h5>
                            <div className="flex flex-wrap gap-2">
                              {enhancedData.amenities.map((amenity: string, i: number) => (
                                <div key={i} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                                  {amenity}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  
                    {/* Coffee & Breakfast */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Coffee className="w-5 h-5 text-primary-dark" />
                        <h4 className="font-medium">Coffee & Breakfast</h4>
                      </div>
                      <div className="space-y-3">
                        <RestaurantCard
                          name="Java Joe's Cafe ($)"
                          description="A quirky and colorful diner known for its delicious breakfast and lively atmosphere."
                          price="$"
                          isFavorite
                        />
                        <RestaurantCard
                          name="Lucky Bean Coffeehouse ($)"
                          description="Cafe serving handcrafted espresso drinks, fresh pastries, and light breakfast options."
                          price="$"
                        />
                      </div>
                    </div>

                    {/* Lunch & Dinner */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Utensils className="w-5 h-5 text-primary-dark" />
                        <h4 className="font-medium">Restaurants</h4>
                      </div>
                      <div className="space-y-3">
                        <RestaurantCard
                          name="Millie's on Main ($$)"
                          description="Charming eatery offering classic American dishes in a cozy setting."
                          price="$$"
                        />
                        <RestaurantCard
                          name="Gateway City Garage ($)"
                          description="Popular food truck serving gourmet street food and creative daily specials."
                          price="$"
                        />
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Mountain className="w-5 h-5 text-primary-dark" />
                        <h4 className="font-medium">Activities</h4>
                      </div>
                      <div className="space-y-3">
                        <ActivityCard
                          name="Biking Around the Island"
                          duration="2-3 hours"
                          description="Explore the 8.2-mile M-185 loop, offering scenic views of Lake Huron."
                          tips={[
                            "Best times are early morning or late afternoon",
                            "Rent bikes at Mackinac Wheels",
                            "Pack water and snacks"
                          ]}
                        />
                        <ActivityCard
                          name="Kayak Tours"
                          duration="3-4 hours"
                          description="Paddle along the shoreline with guided tours available."
                          tips={[
                            "Morning tours have calmer waters",
                            "All skill levels welcome",
                            "Waterproof cameras recommended"
                          ]}
                        />
                      </div>
                    </div>

                    {/* Hiking Trails */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Mountain className="w-5 h-5 text-primary-dark" />
                        <h4 className="font-medium">Hiking Trails</h4>
                      </div>
                      <div className="space-y-3">
                        <TrailCard
                          name="Arch Rock Trail"
                          distance="2.1 miles"
                          duration="50 minutes"
                          difficulty="Easy"
                          description="A short out-and-back trail leading to the iconic Arch Rock."
                        />
                        <TrailCard
                          name="Fort Holmes Loop"
                          distance="3.4 miles"
                          duration="1.5 hours"
                          difficulty="Moderate"
                          description="Scenic hike offering historical landmarks and panoramic views."
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  const renderPackingPage = () => {
    const clothingQuantities = calculateClothingQuantities(trip.trip_details.nights);

    return (
      <div className="space-y-6">
        {/* Gear Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Gear</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Tent</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sleeping Mat</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sleeping Bag</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Day Hike Bag</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Towel</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Bug Spray</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sunscreen</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Duct Tape</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>First Aid Kit</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Garbage Bags</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Paper Towel</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Zip Lock Bags (Packing Lunches)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cooking Necessities Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Cooking Necessities</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Camping Stove / Gas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Lighter</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Pot</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Pan</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Camping Bowl</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Utensils</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sharp Knife</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Cutting Board</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Spatula</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Spork (Spoon, Fork, Knife)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Cooking Spray or Olive Oil</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Salt and Pepper</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clothing Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Clothing</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.tshirts}) T-Shirts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.longSleeves}) Long Sleeve</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.shorts}) Shorts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.pants}) Pants</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.sweatshirts}) Sweatshirts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.sweatpants}) Sweatpant</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Nicer Outfit (Depending on Dinner Plans)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Rain Jacket</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Light Jacket</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Bathing Suit</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.underwearSocks}) Underwear / Socks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Shoes Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Shoes</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Hiking Boots</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Gym Shoes</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Water Shoes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Accessories Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Accessories</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Baseball Hat</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sunglasses</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Hat and Light Gloves (Depending on Weather)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Portable Charger</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Camera</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderRecipesPage = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-3">Breakfast Recipes</h2>
        <div className="grid gap-4">
          <div className="bg-beige/10 rounded-lg p-3">
            <h3 className="font-medium mb-2">Campfire Breakfast Burritos</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Eggs</li>
                  <li>• Tortillas</li>
                  <li>• Cheese</li>
                  <li>• Bell peppers</li>
                  <li>• Onions</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Instructions:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Scramble eggs in a pan</li>
                  <li>Sauté vegetables</li>
                  <li>Warm tortillas</li>
                  <li>Assemble burritos</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Dinner Recipes</h2>
        <div className="grid gap-4">
          <div className="bg-beige/10 rounded-lg p-3">
            <h3 className="font-medium mb-2">Foil Packet Fajitas</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Chicken or beef strips</li>
                  <li>• Bell peppers</li>
                  <li>• Onions</li>
                  <li>• Fajita seasoning</li>
                  <li>• Tortillas</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Instructions:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Slice vegetables and meat</li>
                  <li>Season ingredients</li>
                  <li>Create foil packets</li>
                  <li>Cook over campfire for 20-25 minutes</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {onBack && (
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-primary-dark flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Trips
          </button>
        </div>
      )}

      {/* Trip Overview Header - Combined into one container */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-8 relative">
        {daysUntilTrip > 0 && (
          <div className="absolute top-8 right-8">
            <div className="bg-beige/60 text-primary-dark px-4 py-2 rounded-full flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{daysUntilTrip} days until trip</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary-dark mb-2">{destinationName}</h1>
          <div>
            <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
              {trip.status || "planned"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex items-center gap-4">
            <div className="text-gray-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Dates</div>
              <div className="font-medium">
                {format(trip.trip_details.startDate, 'MMM d')} - {format(addDays(trip.trip_details.startDate, trip.trip_details.nights - 1), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Duration</div>
              <div className="font-medium">{trip.trip_details.nights} nights</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-gray-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Location</div>
              <div className="font-medium">{destinationName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF6ED] rounded-lg">
        {/* Navigation */}
        <div className="bg-[#194027]">
          <nav className="flex overflow-x-auto hide-scrollbar">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  currentPage === item.id
                    ? 'border-beige text-beige'
                    : 'border-transparent text-beige/60 hover:text-beige/80'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentPage === 'overview' && renderOverviewPage()}
          {currentPage === 'recommendations' && renderRecommendationsPage()}
          {currentPage === 'packing' && renderPackingPage()}
          {currentPage === 'recipes' && renderRecipesPage()}
        </div>
      </div>
    </div>
  );
};