import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Lock, 
  FileText, 
  Map as MapIcon,
  CheckCircle,
  X,
  UserCircle,
  Mail
} from 'lucide-react';
import { Destination, TripDuration, Campground, SavedTrip, TripDetails } from '../types';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { emailService } from '../services/emailService';
import { loadStripe } from '@stripe/stripe-js';
import { TermsAndConditionsCheckbox } from './TermsAndConditionsCheckbox';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUserTrips } = useAuth();
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const tripGuidePrice = 8.99;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    setEmailError(null);

    try {
      if (!user && (!guestEmail || !validateEmail(guestEmail))) {
        setEmailError('Please enter a valid email address');
        setIsProcessing(false);
        return;
      }

      const tripDetails: TripDetails = {
        destination: destination.id,
        nights: duration.nights,
        startDate: duration.startDate,
        guestCount: duration.guestCount
      };

      await paymentService.initializePayment(
        {
          trip_details: tripDetails,
          selectedCampgrounds,
          createdAt: new Date().toISOString(),
          status: 'planned'
        },
        {
          firstName: user ? user.name.split(' ')[0] : guestName || 'Guest',
          lastName: user ? user.name.split(' ')[1] || '' : '',
          email: user ? user.email : guestEmail,
          phone: ''
        }
      );

      // The user will be redirected to Stripe, so we don't need to navigate or handle success here
    } catch (err) {
      setError('Payment initialization failed. Please try again.');
      console.error('Payment error:', err);
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

              {!user && (
                <div className="bg-beige/20 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm mb-1">Guest Checkout</h4>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-primary-dark" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        setEmailError(null);
                      }}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary-dark focus:border-primary-dark"
                      required
                    />
                    {emailError && (
                      <p className="text-red-600 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-1">
                      <UserCircle className="w-4 h-4 text-primary-dark" />
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary-dark focus:border-primary-dark"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    * Required for trip confirmation email
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <TermsAndConditionsCheckbox 
                  isChecked={termsAccepted}
                  onCheckChange={setTermsAccepted}
                />
                
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !termsAccepted}
                  className={`w-full flex items-center justify-center gap-2 bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors ${
                    (isProcessing || !termsAccepted) ? 'opacity-75 cursor-not-allowed' : ''
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
