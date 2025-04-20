import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onClick: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => onClick(destination)}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-xl">
        {/* Image */}
        <div className="aspect-[4/3] relative">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <MapPin size={16} />
            <span>{destination.region}</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
          <p className="text-sm text-gray-200 line-clamp-2 mb-4">{destination.description}</p>
        </div>
      </div>
    </motion.div>
  );
};