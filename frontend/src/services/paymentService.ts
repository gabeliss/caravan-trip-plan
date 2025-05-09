import { loadStripe } from '@stripe/stripe-js';
import { TripPayment, UserDetails, TripDraft } from '../types';

export const paymentService = {
  async initializePayment(trip: TripDraft, userDetails: UserDetails): Promise<{ sessionUrl: string }> {
    try {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      if (!stripeKey) {
        throw new Error('Stripe public key is missing');
      }

      const stripe = await loadStripe(stripeKey);
      if (!stripe) throw new Error('Failed to load payment processor');

      // TODO: Replace this with a POST to your backend API: /api/create-checkout-session
      // Pass trip details + userDetails as metadata or line items.

      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        sessionUrl: `https://checkout.stripe.com/demo-session/${trip.trip_details.destination}`
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