import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, FileText, Book, ArrowRight, Clock, Moon, RefreshCw, Check, Map, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { SavedTrip } from '../../types';

// Helper function to format destination ID to display name
const formatDestinationName = (destinationId: string): string => {
  return destinationId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface TripListProps {
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  trips: SavedTrip[];
}

export const TripList: React.FC<TripListProps> = ({ refreshing = false, onRefresh, trips }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!trips || trips.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">No trips found</h3>
        <p className="text-gray-600">
          Start planning your next adventure by creating a new trip.
        </p>
      </div>
    );
  }

  // Sort trips by creation date, most recent first
  const sortedTrips = [...trips].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-beige-light pb-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-primary-dark mb-2">My Trips</h1>
            <p className="text-gray-600">Manage and view your upcoming adventures</p>
          </div>
          <div className="flex items-center gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 bg-beige/80 hover:bg-beige text-primary-dark px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              Plan New Trip
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sortedTrips.map((trip) => {
            // Format the destination name from ID if needed
            const destinationName = formatDestinationName(trip.trip_details.destination);
            
            // Set a default region (this could be fetched from a lookup based on destination ID)
            const region = 'Michigan';
            
            // Calculate days until trip
            const daysUntilTrip = Math.ceil(
              (trip.trip_details.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            const isActiveTrip = daysUntilTrip <= 0 && daysUntilTrip > -trip.trip_details.nights;
            const isPastTrip = daysUntilTrip <= -trip.trip_details.nights;
            
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border overflow-hidden"
              >
                <Link to={`/dashboard/trip/${trip.id}`} className="block h-full">
                  <div className="relative">
                    {isActiveTrip && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <Check size={12} className="mr-1" />
                        Active Trip
                      </div>
                    )}
                    {!isPastTrip && !isActiveTrip && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <Clock size={12} className="mr-1" />
                        {daysUntilTrip} days to go
                      </div>
                    )}
                    {isPastTrip && (
                      <div className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Completed
                      </div>
                    )}
                    <img
                      src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                      alt={destinationName}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{destinationName}</h3>
                        <p className="text-sm text-gray-600">Northern {region}</p>
                      </div>
                      <div className="bg-primary-dark/10 text-primary-dark rounded-full px-2 py-1 text-xs font-medium">
                        #{trip.confirmationId}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>
                          {format(trip.trip_details.startDate, 'MMM d')} - {' '}
                          {format(addDays(trip.trip_details.startDate, trip.trip_details.nights), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Map className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{trip.trip_details.nights} nights</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{trip.trip_details.guestCount} guests</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {isPastTrip ? 'Trip completed' : isActiveTrip ? 'Trip in progress' : 'Upcoming trip'}
                        </div>
                        <div className="text-sm font-medium text-primary-dark">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripList;