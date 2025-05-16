import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { SavedTrip, Campground } from '../types';
import { MapPin, Calendar, Users, Check, ArrowRight, LogIn, UserPlus, Lock, ExternalLink, ArrowLeft } from 'lucide-react';
import campgroundNamesMap from '../info/campground-ids-to-names.json';
import { useTripPlan } from '../context/TripPlanContext';
import { Map } from '../components/Map';
import { format, addDays } from 'date-fns';
import northernMichiganData from '../info/campgrounds/northern-michigan-data.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface StayGroup {
  nights: number[];
  campground: Campground;
  startDate: Date;
}

// Helper function to convert city name to region key similar to TripGuidePages.tsx
const convertCityToRegionKey = (cityName: string | undefined): string | null => {
  if (!cityName) return null;
  
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
  
  return regionKey || null;
};

// Helper function to get enhanced campground data
const getCampgroundDetails = (campgroundId: string, city?: string) => {
  if (!city) return null;
  
  const regionKey = convertCityToRegionKey(city);
  if (!regionKey || !(regionKey in northernMichiganData)) return null;
  
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
  
  if (possibleMatches.length > 0) {
    return regionData[possibleMatches[0]];
  }
  
  // Special case for teepee-campground
  if (campgroundId === 'teepee-campground' && city.toLowerCase().includes('mackinac')) {
    try {
      return (northernMichiganData as any)['mackinacCity']['teePeeCampground'];
    } catch (e) {
      return null;
    }
  }
  
  return null;
};

export const TripSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { isAuthenticated, user } = useAuth();
  const { clearSelectedCampgrounds, clearPlan } = useTripPlan();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(!!sessionId);
  const [sessionProcessed, setSessionProcessed] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const hasProcessed = useRef(false);

  const handleReturnHome = () => {
    clearSelectedCampgrounds();
    clearPlan();
  };

  useEffect(() => {
    const processCheckoutSession = async () => {
      if (!sessionId || hasProcessed.current) return;
  
      hasProcessed.current = true;
  
      try {
        setIsLoading(true);
        setProcessingPayment(true);
  
        const response = await fetch(`${API_BASE_URL}/redeem-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ session_id: sessionId })
        });
  
        const responseData = await response.json();
  
        if (!response.ok) {
          setSessionProcessed(true);
          setIsLoading(false);
          throw new Error(responseData.error || 'Failed to process payment');
        }
  
        const { tripId } = responseData;
  
        setSessionProcessed(true);
        setProcessingPayment(false);
        setIsLoading(false);
        navigate(`/trip-success/${tripId}`, { replace: true });
  
      } catch (err) {
        console.error('Error processing checkout session:', err);
        setError(`Payment verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setProcessingPayment(false);
        setIsLoading(false);
        setSessionProcessed(true);
      }
    };
  
    processCheckoutSession();
  }, [sessionId, navigate]);
  


  useEffect(() => {
    const fetchTrip = async () => {
      if ((!id) || (sessionId && !sessionProcessed)) {
        return;
      }

      try {
        setIsLoading(true);
        const fetchedTrip = await tripService.getTripById(id);
        
        if (!fetchedTrip) {
          setError('Trip not found');
          setIsLoading(false);
          return;
        }

        setTrip(fetchedTrip);
        
        if (isAuthenticated && user && fetchedTrip.user_id) {
          setIsOwner(fetchedTrip.user_id === user!.id);
        }
        
        setIsLoading(false);
        
        // Trigger the unlock animation after fetching the trip
        setTimeout(() => {
          setShowUnlockAnimation(true);
        }, 1000);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip data');
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [id, isAuthenticated, user, processingPayment, sessionId, sessionProcessed]);

  if (isLoading || processingPayment) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-green-800">
            {processingPayment ? 'Processing your payment...' : 'Loading your trip...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="mb-6">{error}</p>
          <Link 
            to="/" 
            className="select-night-button inline-flex items-center"
            onClick={handleReturnHome}
          >
            Return Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Trip Not Found</h2>
          <p className="mb-6">We couldn't find the trip you're looking for.</p>
          <Link 
            to="/" 
            className="select-night-button inline-flex items-center"
            onClick={handleReturnHome}
          >
            Return Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  };

  const formatShortDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM d');
  };

  const getCampgroundName = (campgroundId: string) => {
    const mapping = campgroundNamesMap as Record<string, { name: string }>;
    return mapping[campgroundId]?.name || campgroundId;
  };

  const getStayGroups = (): StayGroup[] => {
    const groups: StayGroup[] = [];
    let currentGroup: StayGroup | null = null;

    trip.selectedCampgrounds.forEach((campground, index) => {
      const date = trip.trip_details.startDate && addDays(new Date(trip.trip_details.startDate), index);

      if (!currentGroup || currentGroup.campground.id !== campground.id) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          nights: [index + 1],
          campground: campground,
          startDate: date
        };
      } else {
        currentGroup.nights.push(index + 1);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-dark mb-1 flex items-center gap-2">
                Trip Confirmed
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="text-white h-4 w-4" />
                  </div>
                </motion.div>
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Your trip has been successfully booked! Check your email for a confirmation.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-lg p-4 sm:p-6 sticky top-24">
              <div className="bg-beige/10 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary-dark" />
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">
                        {trip.trip_details.destination
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary-dark" />
                    <div>
                      <p className="text-sm text-gray-500">Travel Dates</p>
                      <p className="font-medium">
                        {formatDate(trip.trip_details.startDate)} - 
                        {(() => {
                          const endDate = new Date(trip.trip_details.startDate);
                          endDate.setDate(endDate.getDate() + trip.trip_details.nights);
                          return formatDate(endDate);
                        })()}
                      </p>
                      <p className="text-sm text-gray-500">{trip.trip_details.nights} nights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary-dark" />
                    <div>
                      <p className="text-sm text-gray-500">Group Size</p>
                      <p className="font-medium">{trip.trip_details.guestCount} travelers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Your Stays</h2>
                <div className="text-sm text-gray-500">
                  {trip.trip_details.nights} {trip.trip_details.nights === 1 ? 'night' : 'nights'}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {getStayGroups().map((stay, stayIndex) => {
                  const nightsText = stay.nights.length === 1 
                    ? `Night ${stay.nights[0]}`
                    : `Nights ${stay.nights[0]}-${stay.nights[stay.nights.length - 1]}`;
                  
                  const startDate = format(stay.startDate, 'MMM d');
                  const endDate = format(addDays(stay.startDate, stay.nights.length), 'MMM d');
                  
                  // Try to get enhanced data for this campground
                  const enhancedData = getCampgroundDetails(stay.campground.id, stay.campground.city);
                  
                  // Get the best image to display
                  const displayImage = enhancedData?.imageUrls?.[0] || stay.campground.imageUrl;
                  
                  // Get the best booking URL
                  const bookingUrl = stay.campground.bookingUrl || (enhancedData?.bookingUrl);
                  
                  return (
                    <div key={`${stay.campground.id}-${stay.nights[0]}`} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="text-base sm:text-lg font-semibold text-primary-dark">{nightsText}</h3>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {startDate} - {endDate}
                        </div>
                      </div>
                      <div className="bg-beige/10 rounded-lg p-3 sm:p-4">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={displayImage}
                              alt={stay.campground.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-medium text-primary-dark truncate">{enhancedData?.title || stay.campground.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">Standard Site</p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  ${stay.campground.price?.toFixed(2) || '0.00'} per night
                                </p>
                              </div>
                              {/* Animated button transition from locked to unlocked */}
                              <AnimatePresence mode="wait">
                                {!showUnlockAnimation ? (
                                  <motion.div
                                    key="locked"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0 inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm"
                                  >
                                    <Lock className="w-4 h-4" />
                                    <span>Locked</span>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="unlocked"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                      duration: 0.3, 
                                      delay: 0.2 + (stayIndex * 0.1), 
                                      type: "spring",
                                      stiffness: 300
                                    }}
                                  >
                                    {bookingUrl ? (
                                      <a
                                        href={bookingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 inline-flex items-center gap-2 bg-primary-dark text-beige px-3 py-1.5 rounded-lg hover:bg-primary-dark/90 transition-colors text-sm"
                                      >
                                        Book Now
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    ) : (
                                      <button
                                        className="flex-shrink-0 inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-3 py-1.5 rounded-lg cursor-not-allowed text-sm"
                                        disabled
                                        title="Booking link not available"
                                      >
                                        Book Now
                                        <ExternalLink className="w-4 h-4" />
                                      </button>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t mt-6 pt-6 text-center">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="text-primary-dark hover:text-primary-dark/80 font-medium"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Save Your Trip</h3>
                    <p className="text-blue-700 mb-4">
                      Create an account or log in to save this trip to your dashboard. You'll be able to access your trip details anytime.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        to="/register"
                        state={{ tripId: id }}
                        className="select-night-button inline-flex items-center justify-center"
                      >
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Account
                      </Link>
                      <Link
                        to="/login"
                        state={{ tripId: id }}
                        className="inverse-select-night-button inline-flex items-center justify-center"
                      >
                        <LogIn className="mr-2 h-5 w-5" />
                        Log In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Your Virtual Trip Guide</h2>
                <p className="text-gray-600 mb-6">
                  Access your comprehensive guide with everything you need for your trip
                </p>
                
                <motion.button
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => navigate(`/dashboard/trip/${trip.id}`)}
                  className="inline-flex items-center gap-2 bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors w-full justify-center"
                >
                  View Trip Guide
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Guide Includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Detailed campground information
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Direct booking links
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Local attractions guide
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Travel tips & route details
                  </li>
                </ul>
              </div>

              <h2 className="text-xl font-bold mb-4">Your Route</h2>
              <Map 
                destination={{ 
                  id: trip.trip_details.destination, 
                  name: trip.trip_details.destination
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                  region: '' 
                }} 
                selectedCampgrounds={trip.selectedCampgrounds} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 