import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tent, ArrowRight, Info, Clock, DollarSign } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Destination, TripDuration, Campground } from '../types';
import { Map } from './Map';
import { PaymentModal } from './PaymentModal';
import { useNavigate } from 'react-router-dom';

interface TripOverviewProps {
  destination: Destination;
  duration: TripDuration;
  selectedCampgrounds: Campground[];
  onClose: () => void;
}

export const TripOverview: React.FC<TripOverviewProps> = ({
  destination,
  duration,
  selectedCampgrounds,
  onClose
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePaymentSuccess = (id: string) => {
    setConfirmationId(id);
    setShowPaymentModal(false);
    navigate(`/confirmation/${id}`, { 
      state: { 
        destination, 
        duration, 
        selectedCampgrounds 
      }
    });
  };

  const allNightsBooked = selectedCampgrounds.length === duration.nights;
  const totalPrice = selectedCampgrounds.reduce((total, campground) => total + campground.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Trip Summary Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark mb-2">Trip Summary</h1>
            <p className="text-gray-600">Review your itinerary before completing your trip guide purchase</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-primary-dark" />
            <span>Prices and availability held for 15 minutes</span>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 text-primary-dark">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p className="font-medium">
                {duration.startDate && format(duration.startDate, 'MMM d')} - {' '}
                {duration.startDate && format(addDays(duration.startDate, duration.nights), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 text-primary-dark">
            <MapPin className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{destination.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 text-primary-dark">
            <Tent className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{duration.nights} nights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Notice */}
      <div className="bg-beige/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-primary-dark flex-shrink-0" />
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary-dark mb-2">How Booking Works</h3>
              <div className="grid md:grid-cols-3 gap-6 text-primary-dark/80">
                <div className="space-y-1">
                  <p className="font-medium">1. Secure Your Plan</p>
                  <p className="text-sm">Purchase your comprehensive trip guide and itinerary</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">2. Get Booking Links</p>
                  <p className="text-sm">Receive direct booking links for each campground</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">3. Complete Reservations</p>
                  <p className="text-sm">Book each stay through official campground platforms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map and Stays Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">Your Route</h2>
          <Map destination={destination} selectedCampgrounds={selectedCampgrounds} />
        </div>

        {/* Stays Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">Stay Overview</h2>
          <div className="space-y-3">
            {selectedCampgrounds.map((campground, index) => (
              <motion.div
                key={campground.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-beige/10 rounded-lg hover:bg-beige/20 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-primary-dark">{campground.name}</h3>
                      <p className="text-sm text-gray-600">{campground.address.split(',')[0]}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary-dark">Night {index + 1}</div>
                      <div className="text-sm text-gray-500">
                        {duration.startDate && format(addDays(duration.startDate, index), 'MMM d')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary-dark/60" />
                      <span className="text-sm font-medium">${campground.price}/night</span>
                    </div>
                    <div className="text-sm text-primary-dark/60">
                      {campground.distanceToTown}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Trip Guide and Payment */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary-dark">Complete Your Trip Guide</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600">Your comprehensive guide includes:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Detailed campground information and amenities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Direct booking links for each stay
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Local attractions and points of interest
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Recommended routes and travel tips
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                    Packing checklist and trip preparation guide
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-4 bg-beige/20 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Estimated camping fees</span>
                  <span className="font-medium">${totalPrice * duration.nights}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Trip guide package</span>
                  <span className="font-medium">$29.99</span>
                </div>
              </div>

              {!allNightsBooked ? (
                <div>
                  <p className="text-red-600 text-sm mb-2">
                    Please select campgrounds for all nights
                  </p>
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-primary-dark/50 text-white px-6 py-4 rounded-lg cursor-not-allowed font-medium"
                  >
                    Complete & Get Full Itinerary
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-dark text-white px-6 py-4 rounded-lg hover:bg-primary-dark/90 transition-colors font-medium"
                >
                  Complete & Get Full Itinerary
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
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