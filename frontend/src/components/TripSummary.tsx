import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  BookOpen,
  Tent,
  Clock,
  ArrowLeft,
  Lock,
  Unlock
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Destination, TripDuration, Campground } from '../types';
import { Map } from './Map';
import { PaymentModal } from './PaymentModal';
import { TripConfirmation } from './TripConfirmation';
import { priceScrapingService } from '../services/priceScrapingService';

interface TripSummaryProps {
  destination: Destination;
  duration: TripDuration;
  selectedCampgrounds: Campground[];
  guestCount: number;
  onClose: () => void;
}

interface MergedStay {
  campground: Campground;
  startNight: number;
  endNight: number;
  totalNights: number;
}

const TripSummary: React.FC<TripSummaryProps> = ({
  destination,
  duration,
  selectedCampgrounds,
  guestCount,
  onClose,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handlePaymentSuccess = (id: string) => {
    setConfirmationId(id);
    setShowPaymentModal(false);
  };

  const handleViewGuide = () => {
    if (confirmationId) {
      navigate(`/dashboard/trip/${confirmationId}`);
    }
  };

  const handleBack = () => {
    onClose();
  };

  if (confirmationId) {
    return (
      <TripConfirmation
        confirmationId={confirmationId}
        destination={destination}
        duration={duration}
        selectedCampgrounds={selectedCampgrounds}
        onClose={onClose}
      />
    );
  }

  const getMergedStays = (): MergedStay[] => {
    const stays: MergedStay[] = [];
    let currentStay: MergedStay | null = null;

    selectedCampgrounds.forEach((campground, index) => {
      if (!campground) return; // Skip null/undefined campgrounds
      
      // Ensure campground has all required properties
      const validCampground = {
        ...campground,
        id: campground.id || `temp-id-${index}`,
        name: campground.name || 'Campground',
        imageUrl: campground.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
        // Ensure distanceToTown is defined for TripConfirmation
        distanceToTown: campground.distanceToTown || `5 miles to ${destination.name || 'destination'}`
      };
      
      if (!currentStay || currentStay.campground.id !== validCampground.id) {
        if (currentStay) {
          stays.push(currentStay);
        }
        currentStay = {
          campground: validCampground,
          startNight: index + 1,
          endNight: index + 1,
          totalNights: 1
        };
      } else {
        currentStay.endNight = index + 1;
        currentStay.totalNights++;
      }
    });

    if (currentStay) {
      stays.push(currentStay);
    }

    return stays;
  };

  const mergedStays = getMergedStays();
  
  const allNightsBooked = mergedStays.reduce((total, stay) => total + stay.totalNights, 0) === duration.nights;

  const totalPrice = mergedStays.reduce((total, stay) => {
    const priceInfo = priceScrapingService.getBasePrice(stay.campground, 'standard');
    return total + ((priceInfo.price ?? 0) * stay.totalNights);
  }, 0);

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
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
            {duration.startDate && (
              <div className="flex items-center gap-2 text-primary-dark bg-beige/40 px-4 py-2 rounded-lg text-sm sm:text-base">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {Math.ceil((duration.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until trip
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
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
                {mergedStays.map((stay) => {
                  const priceInfo = priceScrapingService.getBasePrice(stay.campground, 'standard');
                  const nightsText = stay.totalNights === 1 
                    ? `Night ${stay.startNight}`
                    : `Nights ${stay.startNight}-${stay.endNight}`;
                  
                  return (
                    <div key={`${stay.campground.id}-${stay.startNight}`} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="text-base sm:text-lg font-semibold text-primary-dark">{nightsText}</h3>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {duration.startDate && format(addDays(duration.startDate, stay.startNight - 1), 'MMM d')}
                          {stay.totalNights > 1 && ` - ${format(addDays(duration.startDate!, stay.endNight - 1), 'MMM d')}`}
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
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-primary-dark line-clamp-2">{stay.campground.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">Standard Site</p>
                              </div>
                              <button
                                disabled={!confirmationId}
                                className={`ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                                  !confirmationId
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary-dark text-beige hover:bg-primary-dark/90'
                                }`}
                              >
                                {!confirmationId ? (
                                  <>
                                    <Lock className="w-4 h-4" />
                                    <span>Locked</span>
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Book Now</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                              <div className="text-xs sm:text-sm">
                                <span className="font-medium">${priceInfo.price ?? 0}/night × {stay.totalNights}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <div className="text-xs sm:text-sm font-medium">
                                Total: ${(priceInfo.price ?? 0) * stay.totalNights}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">Total Cost</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Includes trip guide and camping fees</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold">${(totalPrice + 29.99).toFixed(2)}</div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      ${totalPrice.toFixed(2)} camping + $29.99 guide
                    </div>
                  </div>
                </div>

                {!allNightsBooked ? (
                  <div>
                    <p className="text-red-600 text-xs sm:text-sm mb-2">Please select all nights</p>
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-primary-dark/50 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg cursor-not-allowed text-sm sm:text-base font-medium"
                    >
                      Complete & Get Full Itinerary
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-primary-dark text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg hover:bg-primary-dark/90 transition-colors text-sm sm:text-base font-medium"
                  >
                    Complete & Get Full Itinerary
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}

                {!confirmationId && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span>Booking links will be unlocked after payment</span>
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
                <button
                  onClick={handleViewGuide}
                  disabled={!confirmationId}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors w-full justify-center ${
                    !confirmationId
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-dark text-beige hover:bg-primary-dark/90'
                  }`}
                >
                  {!confirmationId ? (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>View Trip Guide</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5" />
                      <span>View Trip Guide</span>
                    </>
                  )}
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

      {showPaymentModal && (
        <PaymentModal
          destination={destination}
          duration={duration}
          selectedCampgrounds={selectedCampgrounds}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export { TripSummary };