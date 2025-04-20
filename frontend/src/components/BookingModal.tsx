import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Lock, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Campground } from '../types';
import { bookingService } from '../services/bookingService';

interface BookingModalProps {
  campground: Campground;
  startDate: Date;
  nights: number;
  guestCount: number;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  campground,
  startDate,
  nights,
  guestCount,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkOut = new Date(startDate);
  checkOut.setDate(checkOut.getDate() + nights);

  const handleBooking = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const provider = campground.providers[0];
      const bookingDetails = {
        campgroundId: campground.id,
        siteTypeId: 'standard',
        checkIn: startDate,
        checkOut,
        guests: guestCount,
        totalPrice: campground.price * nights,
        provider
      };

      const { sessionUrl } = await bookingService.initializeBooking(
        bookingDetails,
        {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        }
      );

      window.open(sessionUrl, '_blank');
      onClose();
    } catch (err) {
      setError('Failed to initialize booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{campground.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Details */}
          <div className="bg-beige/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-dark" />
              <div>
                <p className="text-sm text-gray-500">Dates</p>
                <p className="font-medium">
                  {format(startDate, 'MMM d')} - {format(checkOut, 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-dark" />
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">{guestCount} guests</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-b py-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">
                ${campground.price} x {nights} nights
              </span>
              <span>${campground.price * nights}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & fees</span>
              <span>${(campground.price * nights * campground.taxRate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span>
                ${(campground.price * nights * (1 + campground.taxRate)).toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleBooking}
              disabled={isProcessing}
              className="w-full select-night-button flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {isProcessing ? 'Redirecting...' : 'Continue to Booking'}
            </button>

            <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Secure booking process</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            By proceeding, you agree to the campground's booking policies and cancellation terms.
            {campground.cancellationPolicy && (
              <span className="block mt-1">{campground.cancellationPolicy}</span>
            )}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};