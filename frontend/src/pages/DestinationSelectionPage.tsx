import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { destinations } from '../data/destinations';
import { useTripPlan } from '../context/TripPlanContext';
import { TripPlanner } from '../components/TripPlanner';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle } from 'lucide-react';

export const DestinationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { generatePlan, tripPlan, loading } = useTripPlan();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  // Get trip parameters from location state (passed from the homepage)
  const { startDate, nights, guests } = location.state || {};
  const numNights = nights ? Number(nights) : 0; // Ensure nights is a number
  const numAdults = guests?.adults ? Number(guests.adults) : 2;
  const numKids = guests?.children ? Number(guests.children) : 0;

  useEffect(() => {
    // Redirect to homepage if no trip parameters are provided
    if (!startDate || !numNights) {
      navigate('/');
    }
  }, [startDate, numNights, navigate]);

  const handleDestinationSelect = (destinationId: string) => {
    // Only allow selection of Northern Michigan
    if (destinationId === 'northern-michigan') {
      setSelectedDestination(destinationId);
      
      // Generate trip plan with availability data
      console.log('Generating trip plan with params:', {
        destinationId,
        numNights,
        startDate,
        numAdults,
        numKids
      });
      generatePlan(
        destinationId,
        numNights,
        new Date(startDate),
        numAdults,
        numKids
      );
    }
  };

  const handleClose = () => {
    setSelectedDestination(null);
  };

  // Find the selected destination object
  const selectedDestinationObject = selectedDestination 
    ? destinations.find(dest => dest.id === selectedDestination) 
    : null;

  return (
    <section className="py-20 px-4 bg-[#FFF6ED]">
      <div className="max-w-7xl mx-auto">
        {!selectedDestination ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-primary-dark">Choose Your Destination</h2>
              <p className="text-lg text-primary-dark/80">
                Select from our carefully curated collection of iconic road trips
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination, index) => {
                const isAvailable = destination.id === 'northern-michigan';
                
                return (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={isAvailable ? () => handleDestinationSelect(destination.id) : undefined}
                    className={isAvailable ? "" : "cursor-not-allowed"}
                  >
                    {/* DestinationCard-style component */}
                    <motion.div
                      whileHover={{ y: -10 }}
                      className={`group ${isAvailable ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        {/* Image */}
                        <div className="aspect-[4/3] relative">
                          <img
                            src={destination.imageUrl}
                            alt={destination.name}
                            className={`object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500 ${!isAvailable ? "opacity-80" : ""}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Coming Soon Overlay for unavailable destinations */}
                          {!isAvailable && (
                            <div className="absolute inset-0 bg-[#194027]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                              <span className="text-beige font-display text-xl font-bold">Coming Soon</span>
                              <div className="flex items-center mt-2 bg-white/20 px-3 py-1 rounded-full">
                                <AlertCircle size={16} className="text-beige mr-1" />
                                <span className="text-beige text-sm">Not yet available</span>
                              </div>
                            </div>
                          )}
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
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : selectedDestinationObject ? (
          <TripPlanner 
            destination={selectedDestinationObject}
            duration={{
              startDate: new Date(startDate),
              nights: numNights
            }}
            onClose={handleClose}
          />
        ) : (
          <div className="text-center">Loading destination details...</div>
        )}
      </div>
    </section>
  );
};

export default DestinationSelectionPage; 