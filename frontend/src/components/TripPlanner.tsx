import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Sun, 
  Tent, 
  Calendar,
  Navigation,
  Coffee,
  Mountain,
  Utensils,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Destination, TripDuration, DailyItinerary, Campground, ItineraryPlan } from '../types';
import { Map } from './Map';
import { WeatherForecast } from './WeatherForecast';
import { CampgroundList } from './CampgroundList';
import { TripSummary } from './TripSummary';
import { format, addDays } from 'date-fns';
import apiService from '../services/apiService';
import { useTripPlan } from '../context/TripPlanContext';
import { tripItineraries } from '../data/tripItineraries';
// Import northern Michigan campground data
import northernMichiganData from '../campground-info/northern-michigan-data.json';

interface TripPlannerProps {
  destination: Destination;
  duration: TripDuration;
  onClose: () => void;
  tripPlan?: ItineraryPlan | null;
  loading?: boolean;
}

interface LocationStay {
  location: string;
  startNight: number;
  endNight: number;
}

// Define a type for the campground data structure
interface CampgroundInfoData {
  [region: string]: {
    [campgroundId: string]: {
      title: string;
      address: string;
      cityAndState: string;
      content: string;
      taxRate: number;
      fixedFee: number;
      message: string;
      imageUrls: string[];
      offerings: string;
      distanceToTown: string;
      amenities: string[];
      checkInTime: string;
      checkOutTime: string;
      guidelines: string;
      cancellationPolicy: string;
    }
  }
}

const TripPlanner: React.FC<TripPlannerProps> = ({ 
  destination, 
  duration: initialDuration, 
  onClose,
  tripPlan: externalTripPlan,
  loading: externalLoading
}) => {
  const { tripPlan: contextTripPlan, loading: contextLoading, availabilityData } = useTripPlan();
  
  // Use external props if provided, otherwise use the context values
  const tripPlan = externalTripPlan !== undefined ? externalTripPlan : contextTripPlan;
  const isLoading = externalLoading !== undefined ? externalLoading : contextLoading;
  
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedCampgrounds, setSelectedCampgrounds] = useState<Array<{ campground: Campground; accommodationType: string }>>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [guestCount, setGuestCount] = useState(2);
  const [duration, setDuration] = useState<TripDuration>(initialDuration);
  const [scrollPosition, setScrollPosition] = useState(0);
  const staysContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [loading, setLoading] = useState(isLoading);
  const [itinerary, setItinerary] = useState<DailyItinerary[]>(
    Array.from({ length: duration.nights }, (_, i) => ({
      day: i + 1,
      date: duration.startDate ? addDays(duration.startDate, i) : new Date(),
      activities: [],
      route: []
    }))
  );

  // Helper function to get region key from city name
  const getRegionKey = (cityName: string): string => {
    // Convert from display name to camelCase region key used in JSON data
    const cityMappings: Record<string, string> = {
      'Traverse City': 'traverseCity',
      'Mackinac': 'mackinacCity',
      'Pictured Rocks': 'picturedRocks'
    };
    
    return cityMappings[cityName] || cityName.toLowerCase().replace(/\s+/g, '');
  };

  // Function to enhance campgrounds with data from the JSON file
  const enhanceCampgroundsWithData = (campgroundList: Campground[], cityName: string): Campground[] => {
    if (!cityName) return campgroundList;
    
    // Get the region data from our JSON
    const regionKey = getRegionKey(cityName);
    const regionData = (northernMichiganData as CampgroundInfoData)[regionKey];
    
    if (!regionData) {
      console.warn(`No data found for region: ${regionKey}`);
      return campgroundList;
    }
    
    return campgroundList.map(campground => {
      // Try to find matching campground data
      // First convert campground ID to a key suitable for our JSON structure
      const campIdParts = campground.id.split('-');
      const campIdKey = campIdParts[campIdParts.length - 1].charAt(0).toLowerCase() + 
                        campIdParts[campIdParts.length - 1].slice(1);
      
      // Try some common transformations of the ID to find a match
      const possibleKeys = [
        campIdKey,
        campground.id.replace(/-/g, ''),
        campground.name.toLowerCase().replace(/\s+/g, ''),
      ];
      
      // Find the first matching key in our data
      let matchingKey = '';
      for (const key of Object.keys(regionData)) {
        if (possibleKeys.some(possibleKey => key.toLowerCase().includes(possibleKey.toLowerCase()))) {
          matchingKey = key;
          break;
        }
      }
      
      // If we found matching detailed data, enhance the campground with it
      if (matchingKey && regionData[matchingKey]) {
        const detailedData = regionData[matchingKey];
        
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
          checkIn: {
            time: detailedData.checkInTime || '3:00 PM',
            lateArrival: 'Call ahead',
            checkout: detailedData.checkOutTime || '11:00 AM',
            lateFees: 'Varies by campground'
          },
          siteGuidelines: {
            maxGuests: parseInt(detailedData.guidelines?.match(/(\d+)\s+Guests/i)?.[1] || '6'),
            maxVehicles: 2,
            quietHours: '10:00 PM - 7:00 AM',
            petRules: detailedData.amenities?.some(a => a.toLowerCase().includes('pet')) 
              ? 'Pets allowed' : 'No pets allowed',
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
          maxGuests: parseInt(detailedData.guidelines?.match(/(\d+)\s+Guests/i)?.[1] || '6'),
          taxRate: detailedData.taxRate || campground.taxRate || 0.06
        };
      }
      
      // Otherwise, return the original campground with default enhancements
      return {
        ...campground,
        rating: campground.rating || 4 + Math.random(),
        amenities: campground.amenities || ['WiFi', 'Showers', 'Toilets', 'Fire pit'],
        images: campground.images || [
          { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', alt: 'Campsite' },
          { url: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a', alt: 'Campsite view' }
        ],
        imageUrl: campground.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
        address: campground.address || `${cityName}, MI`,
        distanceToTown: campground.distanceToTown || `5 miles to ${cityName}`,
        season: campground.season || {
          start: 'April',
          end: 'October'
        },
        checkIn: campground.checkIn || {
          time: '3:00 PM',
          lateArrival: 'Call ahead',
          checkout: '11:00 AM',
          lateFees: '$10 per hour'
        },
        siteGuidelines: campground.siteGuidelines || {
          maxGuests: 6,
          maxVehicles: 2,
          quietHours: '10:00 PM - 7:00 AM',
          petRules: 'Dogs allowed on leash',
          ageRestrictions: 'None'
        },
        cancellationPolicy: campground.cancellationPolicy || {
          fullRefund: '7+ days before arrival',
          partialRefund: '3-6 days before arrival',
          noRefund: 'Less than 3 days before arrival',
          modifications: 'Subject to availability',
          weatherPolicy: 'No refunds for weather'
        },
        maxGuests: campground.maxGuests || 6,
        taxRate: campground.taxRate || 0.06,
        providers: campground.providers || [
          {
            id: 'direct',
            name: 'Direct Booking',
            type: 'direct' as 'direct' | 'external'
          }
        ],
        nearbyAttractions: campground.nearbyAttractions || ['Downtown', 'Beach', 'Hiking trails'],
        siteTypes: campground.siteTypes || {
          tent: true,
          rv: true,
          glamping: false
        }
      };
    });
  };

  // Update loading state when the external loading state changes
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Instead of fetching campgrounds directly, use the availability data from the tripPlan
  useEffect(() => {
    if (availabilityData && availabilityData.length > 0) {
      // Use the first stop's campgrounds to initialize the campgrounds list
      const currentStay = getLocationStays().find(stay => 
        selectedDay >= stay.startNight && selectedDay <= stay.endNight
      );
      
      if (!currentStay) {
        console.warn('No stay found for selected day:', selectedDay);
        setCampgrounds([]);
        setLoading(false);
        return;
      }
      
      const cityName = currentStay.location;
      const cityId = cityName.toLowerCase().replace(/\s+/g, '-');
      
      const stopAvailability = availabilityData.find(stop => 
        stop.city === cityId || stop.cityId === cityId
      );
      
      if (stopAvailability && stopAvailability.campgrounds) {
        // Transform the campground data to match the expected format and enhance with detailed data
        const transformedCampgrounds = stopAvailability.campgrounds.map((campground: any) => {
          // If the campground already has availability data from the API, preserve it,
          // otherwise let each CampgroundCard component fetch its own data
          const campgroundData = {
            ...campground,
            rating: campground.rating || 4 + Math.random(),
            amenities: campground.amenities || ['WiFi', 'Showers', 'Toilets', 'Fire pit'],
            images: campground.images || [
              { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', alt: 'Campsite' },
              { url: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a', alt: 'Campsite view' }
            ],
            imageUrl: campground.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
            address: campground.address || `${currentStay.location}, MI`,
            providers: campground.providers || [
              {
                id: 'direct',
                name: 'Direct Booking',
                type: 'direct' as 'direct' | 'external'
              }
            ],
            siteTypes: campground.siteTypes || {
              tent: true,
              rv: true,
              glamping: false
            }
          };

          // If availability comes from a real API response (not default), preserve it
          if (campground.availability?.timestamp) {
            campgroundData.availability = campground.availability;
          }

          return campgroundData;
        });
        
        // Enhance campgrounds with detailed data from the JSON file
        const enhancedCampgrounds = enhanceCampgroundsWithData(transformedCampgrounds, cityName);
        
        setCampgrounds(enhancedCampgrounds);
        setLoading(false);
      } else {
        // Fallback to the API if no availability data is found
        fetchCampgrounds();
      }
    } else {
      // Fallback to the API if no availability data is available
      fetchCampgrounds();
    }
  }, [availabilityData, selectedDay]);

  // Update the fetchCampgrounds function - no initial availability checks are needed
  const fetchCampgrounds = async () => {
    if (!tripPlan) return;
    
    setLoading(true);
    
    try {
      const currentStop = tripPlan.stops[selectedDay - 1];
      if (!currentStop) {
        setCampgrounds([]);
        setLoading(false);
        return;
      }
      
      // Get campgrounds from the tripPlan if available
      const cityId = currentStop.scraperId || currentStop.city.toLowerCase().replace(/\s+/g, '-');
      const stopData = tripPlan.stops[selectedDay - 1];
      
      if (stopData && stopData.campgrounds && stopData.campgrounds.length > 0) {
        // Use the campgrounds from the trip plan
        console.log(`Using ${stopData.campgrounds.length} campgrounds from trip plan for ${cityId}`);
        
        // Enhance campgrounds with additional data
        const enhancedCampgrounds = enhanceCampgroundsWithData(
          stopData.campgrounds,
          currentStop.city
        );
        
        setCampgrounds(enhancedCampgrounds);
      } else {
        // Fetch campgrounds if not available in the trip plan
        console.log(`Fetching campgrounds for ${cityId}`);
        const fetchedCampgrounds = await apiService.getCampgrounds(cityId);
        
        // Enhance campgrounds with additional data
        const enhancedCampgrounds = enhanceCampgroundsWithData(
          fetchedCampgrounds,
          currentStop.city
        );
        
        setCampgrounds(enhancedCampgrounds);
      }
    } catch (error) {
      console.error('Error fetching campgrounds:', error);
      setCampgrounds([]);
    } finally {
      setLoading(false);
    }
  };

  // Use the trip plan data to generate location stays if available
  const getLocationStays = (): LocationStay[] => {
    // If we have a trip plan with stops, use that to create the location stays
    if (tripPlan && tripPlan.stops && tripPlan.stops.length > 0) {
      return tripPlan.stops.map((stop, index) => {
        const startNight = index === 0 ? 1 : 
          tripPlan.stops.slice(0, index).reduce((total, prev) => total + prev.nights, 1);
        const endNight = startNight + stop.nights - 1;
        
        return {
          location: stop.city,
          startNight,
          endNight
        };
      });
    }

    // Otherwise, use the trip itineraries data for this destination
    const destinationId = destination.id;
    const nights = duration.nights;
    const itinerary = tripItineraries[destinationId];
    
    if (itinerary && itinerary.stops[nights]) {
      // Convert the trip stops from the itinerary data to location stays
      const stays: LocationStay[] = [];
      let currentNight = 1;
      
      itinerary.stops[nights].forEach(stop => {
        const startNight = currentNight;
        const endNight = currentNight + stop.nights - 1;
        
        stays.push({
          location: stop.city,
          startNight,
          endNight
        });
        
        currentNight = endNight + 1;
      });
      
      return stays;
    }
    
    // Fallback for any other case
    return [{ 
      location: 'Default Location',
      startNight: 1, 
      endNight: duration.nights 
    }];
  };

  const handleCampgroundSelect = (campground: Campground, accommodationType: string) => {
    const currentStay = getLocationStays().find(stay => 
      selectedDay >= stay.startNight && selectedDay <= stay.endNight
    );

    if (currentStay) {
      setSelectedCampgrounds(prev => {
        const updated = [...prev];
        // Only update nights within the current stay and total duration
        for (let night = currentStay.startNight; night <= Math.min(currentStay.endNight, duration.nights); night++) {
          updated[night - 1] = { campground, accommodationType };
        }
        // Ensure array length matches duration.nights
        return updated.slice(0, duration.nights);
      });

      const nextStay = getLocationStays().find(stay => stay.startNight > currentStay.endNight);
      if (nextStay && nextStay.startNight <= duration.nights) {
        setSelectedDay(nextStay.startNight);
      } else {
        setShowSummary(true);
      }
    } else {
      setSelectedCampgrounds(prev => {
        const updated = [...prev];
        updated[selectedDay - 1] = { campground, accommodationType };
        return updated.slice(0, duration.nights);
      });

      if (selectedDay < duration.nights) {
        setSelectedDay(selectedDay + 1);
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleDurationChange = (newDuration: TripDuration) => {
    setDuration(newDuration);
    if (newDuration.nights !== duration.nights) {
      // Reset selected campgrounds to match new duration
      setSelectedCampgrounds(prev => prev.slice(0, newDuration.nights));
      setSelectedDay(1);
    }
    setItinerary(
      Array.from({ length: newDuration.nights }, (_, i) => ({
        day: i + 1,
        date: newDuration.startDate ? addDays(newDuration.startDate, i) : new Date(),
        activities: [],
        route: []
      }))
    );
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (staysContainerRef.current) {
      const container = staysContainerRef.current;
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Add scroll event listener to show/hide scroll arrows
  useEffect(() => {
    const container = staysContainerRef.current;
    if (!container) return;

    const handleScrollEvent = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 5
      );
    };

    // Initial check
    handleScrollEvent();

    // Add event listener
    container.addEventListener('scroll', handleScrollEvent);
    
    // Clean up
    return () => {
      container.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  if (showSummary) {
    return (
      <TripSummary
        destination={destination}
        duration={duration}
        selectedCampgrounds={selectedCampgrounds.filter(s => s?.campground).map(s => s.campground)}
        guestCount={guestCount}
        onClose={onClose}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-beige-light z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="select-night-button-light"
              >
                ←
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold truncate">{destination.name}</h2>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} />
                  <span className="truncate">{destination.region}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden md:inline">
                {duration.startDate && format(duration.startDate, 'MMM d')} - {' '}
                {duration.startDate && format(addDays(duration.startDate, duration.nights), 'MMM d, yyyy')}
              </span>
              {selectedCampgrounds.length > 0 && (
                <button
                  onClick={() => setShowSummary(true)}
                  className="flex items-center gap-2 text-primary-dark hover:text-primary-dark/80"
                >
                  Review Trip
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Select Your Stays
          </h3>
          <div className="relative group">
            {showLeftArrow && (
              <button
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary-dark rounded-full p-1 shadow-md transition-opacity md:opacity-0 md:group-hover:opacity-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            {showRightArrow && (
              <button
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary-dark rounded-full p-1 shadow-md transition-opacity md:opacity-0 md:group-hover:opacity-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <div 
              ref={staysContainerRef}
              className="hide-scrollbar overflow-x-auto -mx-4 px-4"
            >
              <div className="flex gap-2 min-w-min pb-4">
                {getLocationStays().map((stay) => {
                  const isSelected = selectedDay >= stay.startNight && selectedDay <= stay.endNight;
                  const hasCampground = selectedCampgrounds[stay.startNight - 1]?.campground;
                  const nightsText = stay.startNight === stay.endNight
                    ? `Night ${stay.startNight}`
                    : `Nights ${stay.startNight}-${stay.endNight}`;
                  
                  return (
                    <button
                      key={`${stay.location}-${stay.startNight}`}
                      onClick={() => setSelectedDay(stay.startNight)}
                      className={`flex-none px-4 py-2 rounded-lg border transition-colors relative ${
                        isSelected
                          ? 'border-primary-dark bg-primary-dark/10 text-primary-dark'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium whitespace-nowrap">{nightsText}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{stay.location}</div>
                      {hasCampground && (
                        <div className="absolute -top-2 -right-2 bg-primary-dark text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              {/* Get the current stay based on selected day */}
              {(() => {
                const currentStay = getLocationStays().find(stay => 
                  selectedDay >= stay.startNight && selectedDay <= stay.endNight
                );
                
                // Calculate the start and end dates for this stay
                let stayStartDate = undefined;
                let stayEndDate = undefined;
                
                if (currentStay && tripPlan) {
                  console.log("Current stay:", currentStay);
                  console.log("Trip plan:", tripPlan);
                  
                  const tripStop = tripPlan.stops.find(stop => 
                    stop.city.toLowerCase().replace(/\s+/g, '-') === currentStay.location.toLowerCase()
                  );
                  
                  if (tripStop) {
                    console.log("Found matching trip stop:", tripStop);
                    stayStartDate = tripStop.startDate;
                    stayEndDate = tripStop.endDate;
                    console.log("Using dates from trip stop:", stayStartDate, stayEndDate);
                  } else if (duration.startDate) {
                    // Fallback if we can't find the exact trip stop
                    console.log("No matching trip stop found, using fallback date calculation");
                    stayStartDate = new Date(duration.startDate);
                    stayStartDate.setDate(stayStartDate.getDate() + currentStay.startNight - 1);
                    
                    stayEndDate = new Date(stayStartDate);
                    stayEndDate.setDate(stayEndDate.getDate() + (currentStay.endNight - currentStay.startNight + 1));
                    console.log("Calculated fallback dates:", stayStartDate, stayEndDate);
                  }
                } else {
                  console.log("No current stay or trip plan found");
                  console.log("Current day:", selectedDay);
                  console.log("Location stays:", getLocationStays());
                }
                
                return (
                  <CampgroundList 
                    campgrounds={campgrounds} 
                    onSelect={handleCampgroundSelect} 
                    loading={loading}
                    tripStartDate={stayStartDate}
                    tripEndDate={stayEndDate}
                  />
                );
              })()}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Navigation size={20} />
                Route Map
              </h3>
              <Map 
                destination={destination}
                selectedCampgrounds={selectedCampgrounds.filter(s => s?.campground).map(s => s.campground)}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sun size={20} />
                Weather Forecast
              </h3>
              <WeatherForecast destination={destination} duration={duration} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripPlanner;

export { TripPlanner }