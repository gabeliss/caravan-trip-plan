import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface ActivityCardProps {
  name: string;
  duration?: string;
  location?: string;
  description?: string;
  tips?: string[];
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  name,
  duration,
  location,
  description,
  tips
}) => {
  return (
    <div className="bg-beige/10 rounded-lg p-4 hover:bg-beige/20 transition-colors">
      <h4 className="font-medium text-primary-dark">{name}</h4>
      
      <div className="mt-2 space-y-2">
        {(duration || location) && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>
        )}
        
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        
        {tips && tips.length > 0 && (
          <div className="mt-3 pt-3 border-t border-beige/20">
            <p className="text-sm font-medium text-primary-dark mb-2">Tips:</p>
            <ul className="space-y-1">
              {tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-dark/60 mt-2"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;