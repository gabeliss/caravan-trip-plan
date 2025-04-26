import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Lock, 
  FileText, 
  Map as MapIcon,
  CheckCircle,
  X
} from 'lucide-react';
import { Destination, TripDuration, Campground } from '../types';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';

interface PaymentModalProps {
  destination: Destination;
  duration: TripDuration;
  selectedCampgrounds: Campground[];
  onClose: () => void;
  onSuccess: (tripId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  destination,
  duration,
  selectedCampgrounds,
  onClose,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUserTrips } = useAuth();

  const tripGuidePrice = 29.99;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const tripId = `TRIP-${Math.random().toString(36).substr(2, 9)}`;
      const { sessionUrl } = await paymentService.initializePayment(
        {
          id: tripId,
          confirmationId: tripId,
          destination,
          duration,
          selectedCampgrounds,
          createdAt: new Date().toISOString(),
          status: 'planned'
        },
        {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        }
      );

      // Create a new trip object
      const newTrip = {
        id: tripId,
        confirmationId: tripId,
        destination,
        duration,
        selectedCampgrounds,
        createdAt: new Date().toISOString(),
        status: 'planned' as const
      };
      
      // Save trip to Supabase
      if (user) {
        try {
          console.log('Saving trip to Supabase:', tripId);
          // Create the trip in Supabase first
          const savedTrip = await tripService.createTrip(
            user.id,
            destination,
            duration,
            selectedCampgrounds
          );
          
          // Then update local state with the saved trip
          // This will avoid triggering another create operation in updateUserTrips
          // since the trip is already in Supabase
          updateUserTrips([...user.trips, savedTrip]);
        } catch (err) {
          console.error('Error saving trip to Supabase:', err);
          // Continue with the flow even if saving to Supabase fails
        }
      }

      // Simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess(tripId);
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
      >
        <div className="border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Complete Your Trip Purchase</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-beige/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Trip Package Includes:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary-dark mt-1" />
                    <div>
                      <p className="font-medium">Interactive Trip Guide</p>
                      <p className="text-sm text-gray-600">Access your complete itinerary anytime</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapIcon className="w-5 h-5 text-primary-dark mt-1" />
                    <div>
                      <p className="font-medium">Curated Travel Routes</p>
                      <p className="text-sm text-gray-600">Optimized driving directions and stops</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-dark mt-1" />
                    <div>
                      <p className="font-medium">Instant Booking Access</p>
                      <p className="text-sm text-gray-600">Direct links to complete your reservations</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-beige/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Trip Summary</h4>
                <p className="text-sm text-gray-600">{destination.name}</p>
                <p className="text-sm text-gray-600">{duration.nights} nights</p>
                <p className="text-sm text-gray-600">{selectedCampgrounds.length} campgrounds</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-beige/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Trip Guide Package</span>
                  <span className="font-bold">${tripGuidePrice}</span>
                </div>
                <p className="text-sm text-gray-600">
                  One-time purchase, unlimited access
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full flex items-center justify-center gap-2 bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors ${
                    isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>

                <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>Secure payment processing</span>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                By completing this purchase, you'll receive immediate access to your
                trip guide and booking instructions.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};