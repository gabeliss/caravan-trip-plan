import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Destination, TripDuration } from '../types';
import { format, addDays } from 'date-fns';
import { SelectedCampground } from '../types/campground';

interface TripPlannerHeaderProps {
  destination: Destination;
  duration: TripDuration;
  selectedCampgrounds: SelectedCampground[];
  onReviewTrip: () => void;
  onClose: () => void;
}

const TripPlannerHeader: React.FC<TripPlannerHeaderProps> = ({
  destination,
  duration,
  selectedCampgrounds,
  onReviewTrip,
  onClose,
}) => {
  return (
    <div className="sticky top-0 bg-white border-b z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="select-night-button-light"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold truncate">{destination.name}</h2>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} />
                <span className="truncate">{destination.region}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:inline">
              {format(duration.startDate as Date, 'MMM d')} - {' '}
              {format(addDays(duration.startDate as Date, duration.nights), 'MMM d, yyyy')}
            </span>
            {selectedCampgrounds.length > 0 && (
              <button
                onClick={onReviewTrip}
                className="flex items-center gap-2 text-primary-dark hover:text-primary-dark/80"
              >
                Review Trip
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlannerHeader; 