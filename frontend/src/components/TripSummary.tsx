import React, { useState } from 'react';
import { PaymentModal } from './PaymentModal';
import { TripConfirmation } from './TripConfirmation';
import { Destination, TripDuration, Campground } from '../types';

interface TripSummaryProps {
  destination: Destination;
  duration: TripDuration;
  selectedCampgrounds: Campground[];
  guestCount: number;
  onClose: () => void;
}

const TripSummary: React.FC<TripSummaryProps> = ({
  destination,
  duration,
  selectedCampgrounds,
  guestCount,
  onClose,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);

  const handlePaymentSuccess = (id: string) => {
    setTripId(id);
    setShowPaymentModal(false);
  };

  // If payment is successful (tripId exists), show the confirmation screen
  if (tripId) {
    return (
      <TripConfirmation
        tripId={tripId}
        destination={destination}
        duration={duration}
        selectedCampgrounds={selectedCampgrounds}
        onClose={onClose}
        isPaid={true}
      />
    );
  }

  // Otherwise, show the pre-payment screen
  return (
    <TripConfirmation
      isPaid={false}
      destination={destination}
      duration={duration}
      selectedCampgrounds={selectedCampgrounds}
      onClose={onClose}
      onBookTrip={() => setShowPaymentModal(true)}
    >
      {showPaymentModal && (
        <PaymentModal
          destination={destination}
          duration={duration}
          selectedCampgrounds={selectedCampgrounds}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </TripConfirmation>
  );
};

export { TripSummary };