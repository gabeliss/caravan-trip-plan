import React, { useState } from 'react';
import { PaymentModal } from './PaymentModal';
import { TripConfirmation } from './TripConfirmation';
import { Destination, TripDuration, Campground } from '../types';
import { useTripPlan } from '../context/TripPlanContext';


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
  const { setFlowStage, clearSelectedCampgrounds } = useTripPlan();

  const handleNavigateAway = () => {
    clearSelectedCampgrounds();
    onClose();
  };

  const handlePaymentSuccess = (id: string) => {
    setTripId(id);
    setShowPaymentModal(false);
    setFlowStage('confirmation');
  };

  // If payment is successful (tripId exists), show the confirmation screen
  if (tripId) {
    return (
      <TripConfirmation
        tripId={tripId}
        destination={destination}
        duration={duration}
        selectedCampgrounds={selectedCampgrounds}
        onClose={handleNavigateAway}
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
      onClose={handleNavigateAway}
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