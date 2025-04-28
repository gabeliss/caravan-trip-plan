import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Wifi, 
  ShowerHead, 
  Power, 
  Car, 
  Utensils, 
  Tent, 
  Home, 
  Sparkles, 
  Hotel, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Dog,
  Droplets,
  Waves,
  ShieldAlert,
  SunIcon,
  ThermometerSun,
  RefreshCw
} from 'lucide-react';
import { Campground } from '../types';
import apiService from '../services/apiService';
import { format, addDays } from 'date-fns';

interface CampgroundCardProps {
  campground: Campground;
  onSelect: (campground: Campground, accommodationType: string) => void;
  tripStartDate?: Date;  // Add trip start date
  tripEndDate?: Date;    // Add trip end date
}

export const CampgroundCard: React.FC<CampgroundCardProps> = ({
  campground,
  onSelect,
  tripStartDate,
  tripEndDate
}) => {
  const [selectedAccommodationType, setSelectedAccommodationType] = useState<string>('tent');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [availability, setAvailability] = useState<{
    available: boolean;
    price: number | null;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Update the useEffect to make the component more eager to check availability
  React.useEffect(() => {
    // Always check availability when component mounts or when trip dates/campground changes
    console.log(`Checking availability for ${campground.name} when component mounts or trip dates change`);
    checkAvailability();
  }, [campground.id, tripStartDate, tripEndDate]);

  // When accommodation type changes, re-check availability
  React.useEffect(() => {
    if (!isInitialLoad) { // Skip on initial load as the first useEffect will handle it
      console.log(`Accommodation type changed to ${selectedAccommodationType}, re-checking availability`);
      checkAvailability();
    }
  }, [selectedAccommodationType]);

  const checkAvailability = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use trip dates if provided, otherwise use current date + 3 days
      let startDate: string;
      let endDate: string;
      
      if (tripStartDate && tripEndDate) {
        startDate = format(tripStartDate, 'MM/dd/yy');
        endDate = format(tripEndDate, 'MM/dd/yy');
      } else {
        // Fallback to default behavior
        const today = new Date();
        startDate = format(today, 'MM/dd/yy');
        endDate = format(addDays(today, 3), 'MM/dd/yy');
      }
      
      console.log(`Fetching availability for ${campground.name} from ${startDate} to ${endDate}`);
      
      // If the campground already has availability data and it's for the selected accommodation type,
      // use that instead of making an API call
      if (campground.availability && campground.availability.timestamp) {
        const availabilityTimestamp = new Date(campground.availability.timestamp);
        const now = new Date();
        const timeDiff = now.getTime() - availabilityTimestamp.getTime();
        const minutesDiff = Math.floor(timeDiff / 1000 / 60);
        
        // Only use cached availability if it's less than 5 minutes old
        if (minutesDiff < 5) {
          console.log(`Using cached availability for ${campground.name}`);
          setAvailability(campground.availability);
          setIsLoading(false);
          return;
        }
      }
      
      const result = await apiService.checkAvailability(
        campground.id,
        startDate,
        endDate,
        2, // Default adults
        0, // Default kids
        selectedAccommodationType // Pass the selected accommodation type
      );
      
      // Check for error response from the backend
      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log(`Received availability result for ${campground.name}:`, result);
      
      // For multi-accommodation responses, extract the data for the selected type
      // First, properly type the result to handle various return formats
      interface AvailabilityResult {
        available: boolean;
        price: number | null;
        message: string;
        timestamp: string;
        error?: string;
        [key: string]: any; // Allow for dynamic accommodation type keys
      }
      
      const typedResult = result as AvailabilityResult;
      let specificAvailability = typedResult;
      
      if (typedResult[selectedAccommodationType] && 
          typeof typedResult[selectedAccommodationType] === 'object') {
        // This is a multi-accommodation response, extract the specific type
        specificAvailability = typedResult[selectedAccommodationType] as AvailabilityResult;
        console.log(`Using ${selectedAccommodationType} specific availability:`, specificAvailability);
      }
      
      setAvailability(specificAvailability);
    } catch (error) {
      console.error(`Error checking availability for ${campground.name}:`, error);
      
      // Set the error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to check availability';
      setError(errorMessage);
      
      // Create a default unavailable state
      setAvailability({
        available: false,
        price: null,
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false); // No longer the initial load after first API call
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const normalizedAmenity = amenity.toLowerCase();
    
    if (normalizedAmenity.includes('wifi')) return <Wifi size={16} />;
    if (normalizedAmenity.includes('shower')) return <ShowerHead size={16} />;
    if (normalizedAmenity.includes('electric') || normalizedAmenity.includes('power')) return <Power size={16} />;
    if (normalizedAmenity.includes('store')) return <Car size={16} />;
    if (normalizedAmenity.includes('restaurant')) return <Utensils size={16} />;
    if (normalizedAmenity.includes('fire') || normalizedAmenity.includes('pit')) return <Flame size={16} />;
    if (normalizedAmenity.includes('pet') || normalizedAmenity.includes('dog')) return <Dog size={16} />;
    if (normalizedAmenity.includes('water')) return <Droplets size={16} />;
    if (normalizedAmenity.includes('lake') || normalizedAmenity.includes('beach')) return <Waves size={16} />;
    if (normalizedAmenity.includes('basketball') || normalizedAmenity.includes('court')) return <Tent size={16} />;
    if (normalizedAmenity.includes('pool') || normalizedAmenity.includes('swimming')) return <Droplets size={16} />;
    
    return <CheckCircle2 size={16} />;
  };

  const getAccommodationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tent':
        return <Tent size={16} />;
      case 'rv':
        return <Home size={16} />;
      case 'lodging':
        return <Hotel size={16} />;
      default:
        return <Tent size={16} />;
    }
  };

  const getAccommodationTypes = () => {
    if (!campground.siteTypes) {
      return [{ type: 'tent', label: 'Tent' }];
    }
    
    const types = [];

    if (campground.siteTypes.tent) {
      types.push({ type: 'tent', label: 'Tent' });
    }
    if (campground.siteTypes.rv) {
      types.push({ type: 'rv', label: 'RV' });
    }
    if (campground.siteTypes.lodging) {
      types.push({ type: 'lodging', label: 'Lodging' });
    }

    return types.length > 0 ? types : [{ type: 'tent', label: 'Tent' }];
  };

  const handleSelect = () => {
    onSelect(campground, selectedAccommodationType);
  };

  // Get cancellation policy details safely
  const getCancellationPolicyText = () => {
    if (!campground.cancellationPolicy) return '';
    
    if (campground.cancellationPolicy.details) {
      return campground.cancellationPolicy.details;
    }
    
    return `${campground.cancellationPolicy.fullRefund} for full refund. 
            ${campground.cancellationPolicy.partialRefund} for partial refund. 
            ${campground.cancellationPolicy.noRefund} for no refund.`;
  };

  const renderFooter = () => {
    const hasAvailability = availability && (availability.available !== undefined);
    const isUnavailable = hasAvailability && availability && availability.available === false;
    
    return (
      <div className="rounded-b-lg mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex items-center">
                <RefreshCw size={16} className="animate-spin text-primary-dark mr-2" />
                <span className="text-sm text-gray-600">Checking availability...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500 flex items-center">
                <AlertTriangle size={16} className="mr-1" />
                {error}
              </div>
            ) : hasAvailability ? (
              <>
                <div className="flex items-center">
                  {availability && availability.available ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-500 mr-1" />
                      <span className="text-sm font-medium text-emerald-600">Available</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="text-amber-500 mr-1" />
                      <span className="text-sm font-medium text-amber-600">Not Available</span>
                    </>
                  )}
                </div>
                <span className="text-sm text-gray-600 mt-1">
                  {availability?.message || ''}
                </span>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Select dates to check availability
              </div>
            )}
          </div>
          
          <button
            className={`py-2 px-4 rounded font-medium transition-colors duration-200 ${
              isLoading || isUnavailable 
                ? 'bg-gray-400 text-gray-100 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary-dark text-beige'
            }`}
            onClick={isLoading || isUnavailable ? undefined : handleSelect}
            type="button"
          >
            {isLoading ? 'Checking...' : isUnavailable ? 'Unavailable' : 'Select'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-all"
    >
      <div className="flex flex-col">
        {/* Image Gallery (if multiple images available) */}
        <div className="w-full h-60 relative bg-gray-200">
          {campground.images && campground.images.length > 0 ? (
            <div className="h-full overflow-hidden">
              <img 
                src={campground.images[0].url} 
                alt={campground.images[0].alt || campground.name} 
                className="w-full h-full object-cover"
              />
              {campground.images.length > 1 && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {campground.images.slice(0, 5).map((_, index) => (
                    <div 
                      key={index} 
                      className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/60'}`} 
                    />
                  ))}
                </div>
              )}
            </div>
          ) : campground.imageUrl ? (
            <img 
              src={campground.imageUrl || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"} 
              alt={campground.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Tent size={48} className="text-gray-400" />
            </div>
          )}
          
          {/* Rating bubble */}
          <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-md flex items-center">
            <Star size={14} className="text-primary-dark fill-current mr-1" />
            <span className="text-sm font-semibold">{campground.rating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-2">
            <h4 className="text-lg md:text-xl font-semibold">{campground.name}</h4>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{campground.address || "Traverse City, MI"}</span>
            </div>
            {campground.distanceToTown && (
              <div className="text-xs text-gray-500 mt-1">
                {campground.distanceToTown}
              </div>
            )}
          </div>

          {/* Description */}
          <p className={`text-sm text-gray-600 ${showDetails ? '' : 'line-clamp-2'} mb-3`}>
            {campground.description}
          </p>

          {/* Amenities */}
          {campground.amenities && campground.amenities.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {campground.amenities.slice(0, showDetails ? campground.amenities.length : 5).map(amenity => (
                  <div key={amenity} className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {getAmenityIcon(amenity)}
                    <span className="ml-1">{amenity}</span>
                  </div>
                ))}
                {!showDetails && campground.amenities.length > 5 && (
                  <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    <span>+{campground.amenities.length - 5} more</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Details (check-in, cancellation) */}
          {showDetails && (
            <div className="space-y-4 mt-4 border-t pt-4">
              {/* Check-in Details */}
              {campground.checkIn && (
                <div>
                  <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Clock size={16} />
                    Check-in/Check-out
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium">Check-in:</p>
                      <p>{campground.checkIn.time}</p>
                    </div>
                    <div>
                      <p className="font-medium">Check-out:</p>
                      <p>{campground.checkIn.checkout}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Cancellation Policy */}
              {campground.cancellationPolicy && (
                <div>
                  <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Calendar size={16} />
                    Cancellation Policy
                  </h5>
                  <p className="text-xs text-gray-600">
                    {getCancellationPolicyText()}
                  </p>
                </div>
              )}
              
              {/* Site Guidelines */}
              {campground.siteGuidelines && (
                <div>
                  <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <ShieldAlert size={16} />
                    Site Guidelines
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium">Max Guests:</p>
                      <p>{campground.siteGuidelines.maxGuests}</p>
                    </div>
                    <div>
                      <p className="font-medium">Pets:</p>
                      <p>{campground.siteGuidelines.petRules}</p>
                    </div>
                    <div>
                      <p className="font-medium">Quiet Hours:</p>
                      <p>{campground.siteGuidelines.quietHours}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Show More/Less Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-primary-dark mt-2 mb-3"
          >
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showDetails ? 'Show less' : 'Show more details'}
          </button>

          {/* Accommodation Types */}
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">Choose accommodation:</p>
            <div className="flex flex-wrap gap-2">
              {getAccommodationTypes().map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setSelectedAccommodationType(type)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                    selectedAccommodationType === type
                      ? 'bg-primary-dark text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getAccommodationIcon(type)}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price & Availability */}
          {renderFooter()}
        </div>
      </div>
    </motion.div>
  );
};

export default CampgroundCard;