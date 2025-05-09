import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { SavedTrip } from '../types';
import { MapPin, Calendar, Users, Check, ArrowRight, LogIn, UserPlus } from 'lucide-react';

export const TripSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) {
        setError('No trip ID provided');
        setIsLoading(false);
        return;
      }

      try {
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
  }, [id, isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-green-800">Loading your trip...</p>
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
          <Link to="/" className="select-night-button inline-flex items-center">
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
          <Link to="/" className="select-night-button inline-flex items-center">
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
              Your trip has been successfully booked. We've sent a confirmation email with your trip details.
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
                    {trip.selectedCampgrounds.map((campground, index) => (
                      <div key={campground.id} className="bg-beige/20 p-3 rounded-lg">
                        <p className="font-medium">{campground.name}</p>
                        <p className="text-sm text-gray-600">{campground.city}</p>
                        <p className="text-xs text-gray-500">
                          {index === 0 
                            ? `${formatDate(trip.trip_details.startDate)} - ` 
                            : ''
                          }
                          {(() => {
                            const startDay = index === 0 
                              ? new Date(trip.trip_details.startDate) 
                              : new Date(trip.trip_details.startDate);
                            
                            if (index > 0) {
                              let previousNights = 0;
                              for (let i = 0; i < index; i++) {
                                previousNights += trip.selectedCampgrounds[i].nights || 0;
                              }
                              startDay.setDate(startDay.getDate() + previousNights);
                            }
                            
                            const endDay = new Date(startDay);
                            endDay.setDate(endDay.getDate() + (campground.nights || 0));
                            
                            return `${formatDate(startDay)} - ${formatDate(endDay)}`;
                          })()}
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
                <Link to="/" className="text-primary-dark hover:text-primary-dark/80 font-medium">
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