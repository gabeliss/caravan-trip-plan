import { loadStripe } from '@stripe/stripe-js';
import { TripPayment, UserDetails, TripDraft } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const paymentService = {
  async initializePayment(trip: TripDraft, userDetails: UserDetails): Promise<{ sessionUrl: string }> {
    try {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        throw new Error('Stripe publishable key is missing');
      }

      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userDetails.email,
          guest_name: `${userDetails.firstName} ${userDetails.lastName}`.trim(),
          trip_details: trip.trip_details,
          campgrounds: trip.selectedCampgrounds.map(cg => ({
            id: cg.id,
            price: cg.price,
            city: cg.city || ''
          })),
          success_url: `${window.location.origin}/trip-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: window.location.href
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      const sessionId = data.id;
      
      const stripe = await loadStripe(stripeKey);
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }

      return {
        sessionUrl: `${window.location.origin}/trip-success?session_id=${sessionId}`
      };
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  },

  async verifyPayment(tripId: string): Promise<TripPayment> {
    // Simulate payment verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      tripId,
      status: {
        paid: true,
        transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
        amount: 29.99,
        date: new Date().toISOString()
      },
      guideUrl: '/trip-guide.pdf',
      bookingUrls: {}
    };
  },

  async getPaymentStatus(tripId: string): Promise<TripPayment | null> {
    // In a real implementation, this would check the payment status from the backend
    const stored = localStorage.getItem(`payment_${tripId}`);
    return stored ? JSON.parse(stored) : null;
  },

  async storePaymentStatus(payment: TripPayment): Promise<void> {
    localStorage.setItem(`payment_${payment.tripId}`, JSON.stringify(payment));
  }
};