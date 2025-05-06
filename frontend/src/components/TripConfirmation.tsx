import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  MapPin,
  Tent,
  Clock,
  ExternalLink,
  ArrowRight,
  Map as MapIcon,
  Lock,
  ChevronDown,
  ChevronUp,
  Moon,
  ArrowLeft
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Destination, TripDuration, Campground } from '../types';
import { Map } from './Map';

interface TripConfirmationProps {
  confirmationId: string;
  destination: Destination;
  duration: TripDuration;
  selectedCampgrounds: Campground[];
  onClose: () => void;
}

interface StayGroup {
  location: string;
  nights: number[];
  campground: {
    id: string;
    name: string;
    imageUrl: string;
  };
  startDate?: Date;
}

export const TripConfirmation: React.FC<TripConfirmationProps> = ({
  confirmationId,
  destination,
  duration,
  selectedCampgrounds,
  onClose
}) => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  // Debug: Log all campgrounds and their booking URLs
  console.log("TripConfirmation - All campgrounds:");
  selectedCampgrounds.forEach((campground, index) => {
    console.log(`Campground ${index} (${campground.id}):`, {
      name: campground.name,
      bookingUrl: campground.bookingUrl
    });
  });

  const getStayGroups = (): StayGroup[] => {
    const groups: StayGroup[] = [];
    let currentGroup: StayGroup | null = null;

    selectedCampgrounds.forEach((campground, index) => {
      // Default location value in case distanceToTown is undefined
      let location = destination?.name || 'Unknown location';
      
      // Safely extract location from distanceToTown if it exists
      if (campground.distanceToTown) {
        const parts = campground.distanceToTown.split(' to ');
        if (parts.length > 1) {
          location = parts[1];
        }
      }

      const date = duration.startDate && addDays(duration.startDate, index);

      if (!currentGroup || currentGroup.campground.id !== campground.id) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          location,
          nights: [index + 1],
          campground: {
            id: campground.id,
            name: campground.name,
            imageUrl: campground.imageUrl
          },
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

  const daysUntilTrip = duration.startDate 
    ? Math.ceil((duration.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-primary-dark hover:text-primary-dark/80 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only sm:not-sr-only">Back</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary-dark mb-1">Trip Summary</h1>
              <p className="text-sm sm:text-base text-gray-600">Review your selections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-lg p-4 sm:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Your Stays</h2>
                <div className="text-sm text-gray-500">
                  {duration.nights} {duration.nights === 1 ? 'night' : 'nights'}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {getStayGroups().map((stay) => {
                  const nightsText = stay.nights.length === 1 
                    ? `Night ${stay.nights[0]}`
                    : `Nights ${stay.nights[0]}-${stay.nights[stay.nights.length - 1]}`;
                  
                  return (
                    <div key={`${stay.campground.id}-${stay.nights[0]}`} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="text-base sm:text-lg font-semibold text-primary-dark">{nightsText}</h3>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {duration.startDate && format(addDays(duration.startDate, stay.nights[0] - 1), 'MMM d')}
                          {stay.nights.length > 1 && ` - ${format(addDays(duration.startDate!, stay.nights[stay.nights.length - 1] - 1), 'MMM d')}`}
                        </div>
                      </div>
                      <div className="bg-beige/10 rounded-lg p-3 sm:p-4">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={stay.campground.imageUrl}
                              alt={stay.campground.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-medium text-primary-dark truncate">{stay.campground.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">Standard Site</p>
                              </div>
                              {(() => {
                                const campground = selectedCampgrounds.find(c => c.id === stay.campground.id);
                                console.log(`TripConfirmation: campground ${stay.campground.id} bookingUrl:`, campground?.bookingUrl);
                                return campground?.bookingUrl ? (
                                  <a
                                    href={campground.bookingUrl}
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
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t mt-6 pt-6 text-center">
                <Link
                  to="/dashboard"
                  className="text-primary-dark hover:text-primary-dark/80 font-medium"
                >
                  Go to Dashboard
                </Link>
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
                <button
                  onClick={() => navigate(`/dashboard/trip/${confirmationId}`)}
                  className="inline-flex items-center gap-2 bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors w-full justify-center"
                >
                  View Trip Guide
                  <ArrowRight className="w-5 h-5" />
                </button>
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
              <Map destination={destination} selectedCampgrounds={selectedCampgrounds} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};