import React from 'react';
import { Navigation } from 'lucide-react';
import { Map } from './Map';
import { Destination, Campground } from '../types';

interface RouteMapProps {
  destination: Destination;
  selectedCampgrounds: Campground[];
}

const RouteMap: React.FC<RouteMapProps> = ({
  destination,
  selectedCampgrounds,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Navigation size={20} />
          Route Map
        </h3>
        <Map 
          destination={destination}
          selectedCampgrounds={selectedCampgrounds}
        />
      </div>
    </div>
  );
};

export default RouteMap; 