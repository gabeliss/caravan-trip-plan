import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, X, ExternalLink } from 'lucide-react';
import { Campground, CampgroundAvailability as AvailabilityType } from '../types';
import { bookingService } from '../services/bookingService';
import { BookingModal } from './BookingModal';

interface CampgroundAvailabilityProps {
  campground: Campground;
  startDate?: Date;
  nights: number;
}

export const CampgroundAvailability: React.FC<CampgroundAvailabilityProps> = ({
  campground,
  startDate = new Date(),
  nights
}) => {
  const [availability, setAvailability] = useState<AvailabilityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const checkOut = new Date(startDate);
    checkOut.setDate(checkOut.getDate() + nights);

    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        const results = await bookingService.checkAvailability(
          campground,
          startDate,
          checkOut,
          2 // Default guests
        );
        setAvailability(results);
      } catch (error) {
        console.error('Error checking availability:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [campground, startDate, nights]);

  const hasAvailability = availability.some(a => a.available);
  const lowestPrice = Math.min(...availability.map(a => a.price));

  return (
    <div className="mt-4 space-y-2">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Checking availability...</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              {hasAvailability ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className={hasAvailability ? 'text-green-700' : 'text-red-700'}>
                {hasAvailability ? 'Available' : 'Not available'}
              </span>
            </div>

            {hasAvailability && (
              <>
                <div className="text-sm text-gray-600">
                  From ${lowestPrice.toFixed(2)}/night
                </div>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Book Now
                </button>
              </>
            )}

            <div className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showBookingModal && (
        <BookingModal
          campground={campground}
          startDate={startDate}
          nights={nights}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};