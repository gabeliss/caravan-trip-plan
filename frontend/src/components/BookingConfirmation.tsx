import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { BookingDetails, UserDetails } from '../types';

interface BookingConfirmationProps {
  bookingDetails: BookingDetails;
  userDetails: UserDetails;
  confirmationNumber: string;
  onClose: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingDetails,
  userDetails,
  confirmationNumber,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-center mb-6">
            Your reservation has been successfully processed
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium">{format(bookingDetails.checkIn, 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium">{format(bookingDetails.checkOut, 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">{bookingDetails.guests} guests</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Confirmation Number</p>
            <p className="font-mono text-lg">{confirmationNumber}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
            {bookingDetails.provider.type === 'external' && (
              <a
                href={bookingDetails.provider.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
              >
                View on {bookingDetails.provider.name}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};