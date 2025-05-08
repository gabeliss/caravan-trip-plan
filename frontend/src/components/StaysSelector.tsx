import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import StayButton from './StayButton';
import { LocationStay, getLocationStays } from '../utils/getLocationStays';
import { Destination, TripDuration, ItineraryPlan } from '../types';
import { SelectedCampground } from '../types/campground';

interface StaysSelectorProps {
  tripPlan: ItineraryPlan;
  destination: Destination;
  duration: TripDuration;
  selectedDay: number;
  selectedCampgrounds: SelectedCampground[];
  onDaySelect: (day: number) => void;
}

const StaysSelector: React.FC<StaysSelectorProps> = ({
  tripPlan,
  destination,
  duration,
  selectedDay,
  selectedCampgrounds,
  onDaySelect
}) => {
  const staysContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  useEffect(() => {
    const container = staysContainerRef.current;
    if (!container) return;

    const handleScrollEvent = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 5
      );
    };

    handleScrollEvent();
    container.addEventListener('scroll', handleScrollEvent);
    
    return () => {
      container.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (staysContainerRef.current) {
      staysContainerRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const handleNightSelection = (stay: LocationStay) => {
    const staysInOrder = getLocationStays(tripPlan, destination, duration);
    const stayIndex = staysInOrder.findIndex(s => s.startNight === stay.startNight);
    
    if (stayIndex === 0) {
      onDaySelect(stay.startNight);
      return;
    }
    
    const previousStay = staysInOrder[stayIndex - 1];
    const hasPreviousSelection = selectedCampgrounds[previousStay.startNight - 1]?.campground;
    
    if (hasPreviousSelection) {
      onDaySelect(stay.startNight);
    }
  };

  const hasPreviousStaySelected = (stay: LocationStay) => {
    const staysInOrder = getLocationStays(tripPlan, destination, duration);
    const stayIndex = staysInOrder.findIndex(s => s.startNight === stay.startNight);
    if (stayIndex === 0) return true;
    const previousStay = staysInOrder[stayIndex - 1];
    return !!selectedCampgrounds[previousStay.startNight - 1]?.campground;
  };
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar size={20} />
        Select Your Stays
      </h3>
      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary-dark rounded-full p-1 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary-dark rounded-full p-1 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div ref={staysContainerRef} className="hide-scrollbar overflow-x-visible -mx-4 px-4">
          <div className="flex gap-2 min-w-min pt-2 pb-4">
            {getLocationStays(tripPlan, destination, duration).map((stay) => {
              const isSelected = selectedDay >= stay.startNight && selectedDay <= stay.endNight;
              const hasCampground = selectedCampgrounds[stay.startNight - 1]?.campground;
              const isPreviousStaysSelected = hasPreviousStaySelected(stay);

              return (
                <StayButton
                  key={`${stay.location}-${stay.startNight}`}
                  stay={stay}
                  isSelected={isSelected}
                  hasCampground={!!hasCampground}
                  isPreviousStaysSelected={isPreviousStaysSelected}
                  onSelect={handleNightSelection}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaysSelector;
