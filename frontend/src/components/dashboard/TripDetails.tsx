import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, addDays, differenceInDays } from 'date-fns';
import { SavedTrip, Campground } from '../../types';
import { MapPin, Calendar, Users, ArrowLeft, ExternalLink, Clock } from 'lucide-react';
import { Map } from '../Map';

interface TripDetailsProps {
  trip: SavedTrip;
  onBack: () => void;
}

// Helper function to format destination ID to display name
const formatDestinationName = (destinationId: string): string => {
  return destinationId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const TripDetails: React.FC<TripDetailsProps> = ({ trip, onBack }) => {
  const [selectedCampground, setSelectedCampground] = useState<Campground | null>(
    trip.selectedCampgrounds?.[0] || null
  );

  // Format the destination name for display
  const destinationName = formatDestinationName(trip.trip_details.destination);
  
  // Calculate days until trip
  const daysUntilTrip = differenceInDays(trip.trip_details.startDate, new Date());
  
  // Group campgrounds by consecutive nights at the same place
  const groupedStays = trip.selectedCampgrounds.reduce<{
    campground: Campground;
    startNight: number;
    endNight: number;
    nights: number;
  }[]>((acc, campground, index) => {
    if (index === 0 || campground.id !== trip.selectedCampgrounds[index - 1].id) {
      // Start of a new campground stay
      acc.push({
        campground,
        startNight: index + 1,
        endNight: index + 1,
        nights: 1
      });
    } else {
      // Continuation of previous campground stay
      const lastStay = acc[acc.length - 1];
      lastStay.endNight = index + 1;
      lastStay.nights += 1;
    }
    return acc;
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-primary-dark">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Trip Details</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{destinationName}</h2>
            
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-primary-dark" />
                <div>
                  <div className="text-sm font-medium">Dates</div>
                  <div>
                    {format(trip.trip_details.startDate, 'MMM d')} - {' '}
                    {format(addDays(trip.trip_details.startDate, trip.trip_details.nights), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-primary-dark" />
                <div>
                  <div className="text-sm font-medium">Destination</div>
                  <p className="font-medium">{destinationName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5 text-primary-dark" />
                <div>
                  <div className="text-sm font-medium">Group Size</div>
                  <p className="font-medium">{trip.trip_details.guestCount} guests</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-primary-dark bg-beige/40 px-4 py-2 rounded-lg w-fit">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {daysUntilTrip > 0
                  ? `${daysUntilTrip} days until trip`
                  : daysUntilTrip === 0
                  ? "Trip starts today!"
                  : daysUntilTrip > -trip.trip_details.nights
                  ? "Trip in progress"
                  : "Trip completed"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Stays</h2>
            <div className="space-y-6">
              {groupedStays.map((stay, index) => (
                <div
                  key={`${stay.campground.id}-${stay.startNight}`}
                  className={`p-4 rounded-lg border ${
                    selectedCampground?.id === stay.campground.id
                      ? 'border-primary-dark bg-beige/10'
                      : 'border-gray-200 hover:border-primary-dark/30 hover:bg-beige/5'
                  } transition-colors cursor-pointer`}
                  onClick={() => setSelectedCampground(stay.campground)}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={stay.campground.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4'}
                        alt={stay.campground.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{stay.campground.name}</h3>
                          <p className="text-sm text-gray-600">{stay.campground.city || 'Unknown'}</p>
                        </div>
                        <span className="text-sm text-gray-600">
                          Night{stay.nights > 1 ? 's' : ''} {stay.startNight}
                          {stay.nights > 1 ? `-${stay.endNight}` : ''}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex justify-between">
                        <div className="text-sm text-gray-600">
                          {stay.nights} night{stay.nights > 1 ? 's' : ''}
                        </div>
                        
                        {stay.campground.bookingUrl && (
                          <a
                            href={stay.campground.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-primary-dark hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Book directly <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Trip Map</h2>
            <div className="h-80">
              <Map
                destination={{ 
                  id: trip.trip_details.destination, 
                  name: destinationName, 
                  region: 'Michigan' 
                }}
                selectedCampgrounds={trip.selectedCampgrounds}
              />
            </div>
          </div>
          
          {selectedCampground && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Selected Campground</h2>
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedCampground.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4'}
                    alt={selectedCampground.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <h3 className="font-medium text-lg">{selectedCampground.name}</h3>
                
                <p className="text-sm text-gray-600">{selectedCampground.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedCampground.amenities?.slice(0, 5).map((amenity) => (
                    <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {selectedCampground.amenities?.length > 5 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      +{selectedCampground.amenities.length - 5} more
                    </span>
                  )}
                </div>
                
                {selectedCampground.bookingUrl && (
                  <a
                    href={selectedCampground.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-4 bg-primary-dark text-white text-center py-2 rounded-lg hover:bg-primary-dark/90 transition-colors"
                  >
                    Book Directly
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};