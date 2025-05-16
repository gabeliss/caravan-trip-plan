import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { SavedTrip } from '../types';
import { MapPin, Calendar, Users, Check, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import campgroundNamesMap from '../info/campground-ids-to-names.json';
import nightMappings from '../info/num-night-mappings.json';
import { useTripPlan } from '../context/TripPlanContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  const getCampgroundName = (campgroundId: string) => {
    const mapping = campgroundNamesMap as Record<string, { name: string }>;
    return mapping[campgroundId]?.name || campgroundId;
  };

  const getStayDatePeriods = () => {
    const { destination, nights, startDate } = trip.trip_details;
    const nightMapping = nightMappings[destination as keyof typeof nightMappings];
    
    if (!nightMapping || !nightMapping[nights.toString() as keyof typeof nightMapping]) {
      return [];
    }
    
    const cityStays = nightMapping[nights.toString() as keyof typeof nightMapping];
    const tripStartDate = new Date(startDate);
    
    let currentDate = new Date(tripStartDate);
    const stayPeriods = cityStays.map((cityStay: { city: string; nights: number }) => {
      const stayStartDate = new Date(currentDate);
      const stayEndDate = new Date(currentDate);
      stayEndDate.setDate(stayEndDate.getDate() + cityStay.nights);
      
      const period = {
        city: cityStay.city,
        startDate: new Date(stayStartDate),
        endDate: new Date(stayEndDate),
        nights: cityStay.nights
      };
      
      // Set current date to the start of the next stay
      currentDate = new Date(stayEndDate);
      
      return period;
    });
    
    return stayPeriods;
  };

  const getCampgroundStayPeriod = (campgroundId: string, campgroundCity: string | undefined) => {
    if (!campgroundCity) return null;
    
    // Try to normalize potential city formats to match what's in the night mappings
    const normalizedCampgroundCity = campgroundCity.toLowerCase().trim();
    
    // Get city mappings based on campground ID
    const cityMappings: Record<string, string> = {
      'anchor-inn': 'traverse-city',
      'leelanau-pines': 'traverse-city',
      'timber-ridge': 'traverse-city',
      'indian-river': 'mackinac-city',
      'cabins-of-mackinaw': 'mackinac-city',
      'teepee-campground': 'mackinac-city',
      'pictured-rocks': 'pictured-rocks',
      'tourist-park': 'pictured-rocks',
      'munising-koa': 'pictured-rocks',
      'uncle-duckys-au-train': 'pictured-rocks',
      'uncle-duckys-paddlers-village': 'pictured-rocks',
      'fort-superior': 'pictured-rocks',
      'au-train-lake': 'pictured-rocks'
    };
    
    const mappedCity = cityMappings[campgroundId] || normalizedCampgroundCity;
    
    // Find the matching stay period for this city
    return stayPeriods.find((period: { city: string; startDate: Date; endDate: Date; nights: number }) => 
      period.city === mappedCity
    );
  };
  
  const getUniqueCampgrounds = () => {
    // First, extract campground IDs from the selected campgrounds
    const campgroundIds = trip.selectedCampgrounds.map(campground => campground.id);
    
    // Remove duplicates from the ID list while preserving order
    const uniqueIds = [...new Set(campgroundIds)];
    
    // Map unique IDs to their corresponding campgrounds
    return uniqueIds.map(id => {
      const campground = trip.selectedCampgrounds.find(c => c.id === id);
      return campground!;
    }).filter(campground => {
      // Make sure we have a valid campground and can map it to a stay period
      return campground && getCampgroundStayPeriod(campground.id, campground.city);
    });
  };

  const stayPeriods = getStayDatePeriods();
  const uniqueCampgrounds = getUniqueCampgrounds();

  // Prepare the display data with proper names and formatted dates
  const campgroundDisplayData = uniqueCampgrounds.map(campground => {
    const stayPeriod = getCampgroundStayPeriod(campground.id, campground.city);
    if (!stayPeriod) return null;
    
    const cityName = campground.city?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    return {
      id: campground.id,
      name: getCampgroundName(campground.id),
      city: cityName,
      startDate: stayPeriod.startDate,
      endDate: stayPeriod.endDate
    };
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-beige-light py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-green-50 p-6 border-b border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="text-white h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-green-800">Trip Confirmed!</h1>
            </div>
            <p className="text-green-700">
              Your trip has been successfully booked. We've sent a confirmation email with your trip details (check your spam / junk folder if you don't see it show up).
            </p>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Trip Details</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary-dark mt-1" />
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
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary-dark mt-1" />
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
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary-dark mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Group Size</p>
                      <p className="font-medium">{trip.trip_details.guestCount} travelers</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Campgrounds</h3>
                  <div className="space-y-3">
                    {campgroundDisplayData.map((campground) => (
                      <div key={campground!.id} className="bg-beige/20 p-3 rounded-lg">
                        <p className="font-medium">{campground!.name}</p>
                        <p className="text-sm text-gray-600">{campground!.city}</p>
                        <p className="text-xs text-gray-500">
                          {formatShortDate(campground!.startDate)} - {formatShortDate(campground!.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isAuthenticated && !isOwner && trip.email === user?.email && !trip.user_id && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Claim This Trip</h3>
                  <p className="text-blue-700 mb-4">
                    This trip was booked using your email. Would you like to add it to your account?
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        await tripService.claimGuestTrips(user?.id || '', user?.email || '');
                        const updatedTrip = await tripService.getTripById(trip.id);
                        if (updatedTrip) {
                          setTrip(updatedTrip);
                          setIsOwner(true);
                        }
                        navigate('/dashboard');
                      } catch (err) {
                        console.error('Error claiming trip:', err);
                        setError('Failed to claim trip');
                      }
                    }}
                    className="select-night-button"
                  >
                    Claim Trip
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mt-6 p-6 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Save Your Trip</h3>
                  <p className="text-blue-700 mb-4">
                    Create an account or log in to save this trip to your dashboard. You'll be able to access your trip details anytime.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
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

              <div className="mt-8 text-center">
                <Link 
                  to="/" 
                  className="text-primary-dark hover:text-primary-dark/80 font-medium"
                  onClick={handleReturnHome}
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 