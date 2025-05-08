import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { LocationStay } from '../utils/getLocationStays';
import Tooltip from './Tooltip';

interface StayButtonProps {
  stay: LocationStay;
  isSelected: boolean;
  hasCampground: boolean;
  isPreviousStaysSelected: boolean;
  onSelect: (stay: LocationStay) => void;
}

const StayButton: React.FC<StayButtonProps> = ({
  stay,
  isSelected,
  hasCampground,
  isPreviousStaysSelected,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const nightsText = stay.startNight === stay.endNight
    ? `Night ${stay.startNight}`
    : `Nights ${stay.startNight}-${stay.endNight}`;

  const isDisabled = !isPreviousStaysSelected;

  return (
    <div
      className="relative hover:bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onSelect(stay)}
        className={`flex-none px-4 py-2 rounded-lg border transition-colors relative ${
          isSelected
            ? 'border-primary-dark bg-primary-dark/10 text-primary-dark'
            : isPreviousStaysSelected 
              ? 'border-gray-200 hover:border-gray-300'
              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        disabled={isDisabled}
      >
        <div className="text-sm font-medium whitespace-nowrap">{nightsText}</div>
        <div className="text-xs text-gray-500 whitespace-nowrap">{stay.location}</div>
        {hasCampground && (
          <div className="absolute -top-2 -right-2 bg-primary-dark text-white p-1 rounded-full">
            <Check className="w-3 h-3" />
          </div>
        )}
      </button>

      <Tooltip
        show={isDisabled && isHovered}
        message="Select a campground for previous nights first"
        position="top"
        type="warning"
      />
    </div>
  );
};

export default StayButton;
