import React from 'react';
import { motion } from 'framer-motion';
import { DestinationCard } from './DestinationCard';
import { destinations } from '../data/destinations';
import { Destination } from '../types';

interface DestinationGridProps {
  onDestinationSelect: (destination: Destination) => void;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({ onDestinationSelect }) => {
  const handleDestinationClick = (destination: Destination) => {
    onDestinationSelect(destination);
  };

  return (
    <section className="py-20 px-4 bg-[#FFF6ED]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-large font-bold mb-4 text-primary-dark">Choose Your Destination</h2>
          <p className="text-large text-primary-dark/80">
            Select from our carefully curated collection of iconic road trips
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <DestinationCard
                destination={destination}
                onClick={handleDestinationClick}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};