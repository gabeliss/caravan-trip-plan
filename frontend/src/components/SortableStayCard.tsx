import React from 'react';
import { motion } from 'framer-motion';
import { Moon, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Campground } from '../types';

interface SortableStayCardProps {
  campground: Campground;
  nightStart: number;
  nightEnd: number;
  startDate?: Date;
  onBookNow?: () => void;
}

export const SortableStayCard: React.FC<SortableStayCardProps> = ({
  campground,
  nightStart,
  nightEnd,
  startDate,
  onBookNow
}) => {
  const totalNights = nightEnd - nightStart + 1;
  const nightsText = nightStart === nightEnd 
    ? `Night ${nightStart}`
    : `Nights ${nightStart}-${nightEnd}`;

  return (
    <div className="bg-white rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={campground.imageUrl}
            alt={campground.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-lg text-primary-dark">{nightsText}</h3>
              <p className="text-sm text-gray-600">{campground.distanceToTown.split(' to ')[1]}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Moon className="w-4 h-4 text-primary-dark" />
              <span className="font-medium">{totalNights}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm text-gray-600">{campground.name}</p>
            {startDate && (
              <p className="text-sm text-gray-500 mt-1">
                {format(startDate, 'MMM d')} - {format(startDate, 'MMM d, yyyy')}
              </p>
            )}
          </div>

          <div className="mt-3">
            <button
              onClick={onBookNow}
              className="text-sm text-primary-dark hover:text-primary-dark/80 flex items-center gap-1"
            >
              Book Now
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};