import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface ContinueButtonProps {
  disabled: boolean;
  onClick: () => void;
  tooltipText?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ 
  disabled, 
  onClick, 
  tooltipText = 'Please select a campground for this stay before continuing' 
}) => {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div className="relative">
      <div className="relative group/tooltip">
        <button
          onClick={onClick}
          className="w-full px-6 py-3 rounded-lg bg-primary-dark text-white font-semibold hover:bg-primary-dark/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={disabled}
          onMouseEnter={() => {
            if (disabled) {
              setShowWarning(false);
            }
          }}
        >
          Continue
        </button>
        
        {disabled && (
          <div className="opacity-0 group-hover/tooltip:opacity-100 pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200 shadow-md whitespace-nowrap z-50 transition-opacity duration-200">
            <div className="flex items-center">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              {tooltipText}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-amber-50"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinueButton; 