import React from 'react';
import { Clock, Mountain } from 'lucide-react';

interface TrailCardProps {
  name: string;
  distance: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  description?: string;
}

export const TrailCard: React.FC<TrailCardProps> = ({
  name,
  distance,
  duration,
  difficulty,
  description
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-beige/10 rounded-lg p-4 hover:bg-beige/20 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${getDifficultyColor()}`}></div>
        <div className="flex-1">
          <h4 className="font-medium text-primary-dark">{name}</h4>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mountain className="w-4 h-4" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <span 
              className="font-medium" 
              style={{ color: getDifficultyColor().replace('bg-', 'text-') }}
            >
              {difficulty}
            </span>
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailCard;