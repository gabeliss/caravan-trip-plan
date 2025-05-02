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
import { TripDetailsEditor } from './TripDetailsEditor';

// Import utility functions
import { enhanceCampgroundsWithData } from '../utils/enhanceCampgrounds';
import { getLocationStays, LocationStay } from '../utils/getLocationStays';
import { SelectedCampground } from '../types/campground';

interface TripPlannerProps {
  destination: Destination;
  duration: TripDuration;
  onClose: () => void;
  tripPlan?: ItineraryPlan | null;
  loading?: boolean;
}

const TripPlanner: React.FC<TripPlannerProps> = ({ 
  destination, 
  duration: initialDuration, 
  onClose,
  tripPlan: externalTripPlan,
  loading: externalLoading
}) => {
  const { tripPlan: contextTripPlan, loading: contextLoading, availabilityData, generatePlan } = useTripPlan();
  
  // Use external props if provided, otherwise use the context values
  const tripPlan = externalTripPlan !== undefined ? externalTripPlan : contextTripPlan;
  const isLoading = externalLoading !== undefined ? externalLoading : contextLoading;

  // All hook declarations moved before conditional returns
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedCampgrounds, setSelectedCampgrounds] = useState<SelectedCampground[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [guestCount, setGuestCount] = useState(() => {
    // If we have a trip plan, it should include guest count
    if (tripPlan) {
      if (!tripPlan.guestCount) {
        console.error('Trip plan is missing guest count information');
        // We'll use a fallback value for now to prevent app crashes
        return 2;
      }
      return tripPlan.guestCount;
    }
    // Default when no trip plan exists yet
    return 2;
  });
  const [duration, setDuration] = useState<TripDuration>(initialDuration);
  const [scrollPosition, setScrollPosition] = useState(0);
  const staysContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [loading, setLoading] = useState(isLoading);
  const [itinerary, setItinerary] = useState<DailyItinerary[]>(() => {
    if (initialDuration.startDate) {
      return Array.from({ length: initialDuration.nights }, (_, i) => ({
        day: i + 1,
        date: addDays(initialDuration.startDate as Date, i),
        activities: [],
        route: []
      }));
    }
    return [];
  });

  // Update loading state when the external loading state changes
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Update guest count when trip plan changes
  useEffect(() => {
    if (tripPlan) {
      if (!tripPlan.guestCount) {
        console.error('Trip plan update missing guest count information');
        return;
      }
      setGuestCount(tripPlan.guestCount);
    }
  }, [tripPlan]);

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

  // Fetch campgrounds effect - must be defined before any conditional returns
  useEffect(() => {
    if (!tripPlan) return;
    
    if (availabilityData && availabilityData.length > 0) {
      // Use the first stop's campgrounds to initialize the campgrounds list
      const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
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
              lodging: false
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
  }, [availabilityData, selectedDay, tripPlan, destination, duration]);

  // Define fetchCampgrounds function
  const fetchCampgrounds = async () => {
    if (!tripPlan) return;
    
    setLoading(true);
    
    try {
      // Find the current stay based on selected day (instead of using selectedDay - 1 as an index)
      const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
        selectedDay >= stay.startNight && selectedDay <= stay.endNight
      );
      
      if (!currentStay) {
        setCampgrounds([]);
        setLoading(false);
        return;
      }
      
      // Find the matching trip stop for the current stay location
      const currentStop = tripPlan.stops.find(stop => 
        stop.city.toLowerCase().replace(/\s+/g, '-') === currentStay.location.toLowerCase().replace(/\s+/g, '-')
      );
      
      if (!currentStop) {
        setCampgrounds([]);
        setLoading(false);
        return;
      }
      
      // Get campgrounds from the tripPlan if available
      const cityId = currentStop.scraperId || currentStop.city.toLowerCase().replace(/\s+/g, '-');
      
      if (currentStop.campgrounds && currentStop.campgrounds.length > 0) {
        
        // Enhance campgrounds with additional data
        const enhancedCampgrounds = enhanceCampgroundsWithData(
          currentStop.campgrounds,
          currentStop.city
        );
        
        setCampgrounds(enhancedCampgrounds);
      } else {
        // Fetch campgrounds if not available in the trip plan
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

  // Now we can have conditional returns
  if (!tripPlan) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen text-gray-600 text-lg"
      >
        Loading your trip...
      </motion.div>
    );
  }

  const handleCampgroundSelect = (campground: Campground, accommodationType: string) => {
    const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
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

      const nextStay = getLocationStays(tripPlan, destination, duration).find(stay => stay.startNight > currentStay.endNight);
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
    if (!newDuration.startDate) {
      throw new Error("Start date is required for trip duration");
    }
    
    setDuration(newDuration);
    if (newDuration.nights !== duration.nights) {
      // Reset selected campgrounds to match new duration
      setSelectedCampgrounds(prev => prev.slice(0, newDuration.nights));
      setSelectedDay(1);
    }
    
    // We've validated that startDate exists above
    const startDate = newDuration.startDate as Date;
    
    setItinerary(
      Array.from({ length: newDuration.nights }, (_, i) => ({
        day: i + 1,
        date: addDays(startDate, i),
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

  // Add a handler for trip details update
  const handleTripDetailsUpdate = (newDetails: {
    startDate: Date;
    nights: number;
    adults: number;
    children: number;
  }) => {
    // Calculate total guests
    const newGuestCount = newDetails.adults + newDetails.children;
    console.log(`Trip details updated from ${guestCount} to ${newGuestCount} guests, changing from ${duration.nights} to ${newDetails.nights} nights`);
    
    // Update the guest count state immediately
    setGuestCount(newGuestCount);
    
    if (generatePlan) {
      console.log('Generating new trip plan with:', {
        destinationId: destination.id,
        nights: newDetails.nights,
        startDate: newDetails.startDate,
        adults: newDetails.adults,
        children: newDetails.children,
        totalGuests: newGuestCount
      });
      
      generatePlan(
        destination.id,
        newDetails.nights,
        newDetails.startDate,
        newDetails.adults,
        newDetails.children
      );
    }
    
    // Update duration
    setDuration({
      nights: newDetails.nights,
      startDate: newDetails.startDate
    });
  };

  // Render
  // ======

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
                {format(duration.startDate as Date, 'MMM d')} - {' '}
                {format(addDays(duration.startDate as Date, duration.nights), 'MMM d, yyyy')}
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

      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="px-4 py-6">
          <button onClick={onClose} className="flex items-center text-primary-dark">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to destinations</span>
          </button>
        </div>

        {/* Trip Details Editor */}
        <div className="px-4">
          <TripDetailsEditor
            startDate={duration.startDate as Date}
            nights={duration.nights}
            adultCount={guestCount}
            childCount={0}
            destinationId={destination.id}
            onUpdate={handleTripDetailsUpdate}
          />
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
                  {getLocationStays(tripPlan, destination, duration).map((stay) => {
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
                  const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
                    selectedDay >= stay.startNight && selectedDay <= stay.endNight
                  );
                  
                  // Calculate the start and end dates for this stay
                  let stayStartDate: Date;
                  let stayEndDate: Date;
                  
                  if (!currentStay) {
                    throw new Error("Current stay is missing for selected day");
                  }
                  
                  const tripStop = tripPlan.stops.find(stop => 
                    stop.city.toLowerCase().replace(/\s+/g, '-') === currentStay.location.toLowerCase().replace(/\s+/g, '-')
                  );
                  
                  if (!tripStop || !tripStop.startDate || !tripStop.endDate) {
                    throw new Error(`Trip stop or dates are missing for ${currentStay.location}`);
                  }
                  
                  
                  stayStartDate = tripStop.startDate;
                  stayEndDate = tripStop.endDate;
                  
                  return (
                    <CampgroundList 
                      campgrounds={campgrounds} 
                      onSelect={handleCampgroundSelect} 
                      loading={loading}
                      tripStartDate={stayStartDate}
                      tripEndDate={stayEndDate}
                      guestCount={guestCount}
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
      </div>
    </motion.div>
  );
};

export default TripPlanner;

export { TripPlanner }