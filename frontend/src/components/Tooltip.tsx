import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TooltipProps {
  show: boolean;
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  type?: 'warning' | 'info' | 'error';
  icon?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  show,
  message,
  position = 'top',
  type = 'warning',
  icon = <AlertCircle size={16} />
}) => {
  if (!show) return null;

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const typeClasses = {
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className={`absolute ${positionClasses[position]} px-3 py-2 
                    ${typeClasses[type]} text-sm rounded-lg border
                    shadow-md whitespace-nowrap z-50 transition-opacity duration-200`}>
      <div className="flex items-center">
        <span className="mr-2 flex-shrink-0">{icon}</span>
        {message}
      </div>
      <div className={`absolute ${position === 'top' ? 'top-full' : 'bottom-full'} 
                       left-1/2 transform -translate-x-1/2 
                       border-8 border-transparent ${type === 'warning' ? 'border-t-amber-50' : ''}`} />
    </div>
  );
};

export default Tooltip;
