import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Campground } from '../types';
import { FullAvailability, AccommodationAvailability } from '../types/campground';
import apiService from '../services/apiService';
import { useTripPlan } from '../context/TripPlanContext';
import { format } from 'date-fns';
import {
  Tent, Home, Hotel, Wifi, ShowerHead, Power, Car, Utensils, Flame, Dog, Droplets, Waves, CheckCircle2, AlertTriangle, Clock, Calendar, ShieldAlert, RefreshCw, MapPin, Star, ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';

interface CampgroundCardProps {
  campground: Campground;
  onSelect: (campground: Campground | null, accommodationType: string) => void;
  tripStartDate: Date;  // Required trip start date
  tripEndDate: Date;    // Required trip end date
  guestCount: number;   // Number of guests
}

export const CampgroundCard: React.FC<CampgroundCardProps> = ({
  campground,
  onSelect,
  tripStartDate,
  tripEndDate,
  guestCount
}) => {
  const { selectedCampgrounds } = useTripPlan();
  const [selectedAccommodationType, setSelectedAccommodationType] = useState<string>(
    Object.entries(campground.siteTypes || {}).find(([_, isAvailable]) => isAvailable)?.[0] || 'tent'
  );
  const [availability, setAvailability] = useState<FullAvailability | null>(null);
  const [displayedAvailability, setDisplayedAvailability] = useState<AccommodationAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch availability on mount or when trip/campground changes
  useEffect(() => {
    checkAvailability();
  }, [campground.id, tripStartDate, tripEndDate, guestCount]);

  // Update displayed availability when selectedAccommodationType changes
  useEffect(() => {
    if (!availability) return;

    if (availability[selectedAccommodationType]) {
      setDisplayedAvailability(availability[selectedAccommodationType]);
    } else {
      setDisplayedAvailability(null); // fallback
    }
  }, [selectedAccommodationType, availability]);

  const checkAvailability = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const startDate = format(tripStartDate, 'MM/dd/yy');
      const endDate = format(tripEndDate, 'MM/dd/yy');

      const result = await apiService.checkAvailability(
        campground.id,
        startDate,
        endDate,
        guestCount,
        0
      );

      setAvailability(result);
      if (result[selectedAccommodationType]) {
        setDisplayedAvailability(result[selectedAccommodationType]);
      } else {
        setDisplayedAvailability(null);
      }
    } catch (error: any) {
      console.error(`Error checking availability for ${campground.name}:`, error);
      setError(error.message || 'Failed to check availability');
      setAvailability(null);
      setDisplayedAvailability(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = () => {
    if (!displayedAvailability?.available) return;
  
    if (isSelected) {
      // If already selected, unselect
      const currentStay = selectedCampgrounds.find(sel => 
        sel?.campground?.id === campground.id && sel.accommodationType === selectedAccommodationType
      );
  
      if (currentStay) {
        // Remove the selected campground for this accommodation type
        // (you can't directly update TripPlanner context here, so we'll send a special value)
        onSelect(null as any, selectedAccommodationType);  // We'll handle this in TripPlanner
      }
  
    } else {
      // Select the campground
      onSelect(
        {
          ...campground,
          price: displayedAvailability.price
        },
        selectedAccommodationType
      );
    }
  };

  const isSelected = selectedCampgrounds.some(
    (sel) => sel?.campground?.id === campground.id && sel.accommodationType === selectedAccommodationType
  );  
  

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
    const types = [];
    if (campground.siteTypes?.tent) types.push({ type: 'tent', label: 'Tent' });
    if (campground.siteTypes?.rv) types.push({ type: 'rv', label: 'RV' });
    if (campground.siteTypes?.lodging) types.push({ type: 'lodging', label: 'Lodging' });
    return types.length > 0 ? types : [{ type: 'tent', label: 'Tent' }];
  };

  const getCancellationPolicyText = () => {
    if (!campground.cancellationPolicy) return '';
    if (campground.cancellationPolicy.details) {
      if (Array.isArray(campground.cancellationPolicy.details)) {
        return campground.cancellationPolicy.details.join('\n');
      }
      return campground.cancellationPolicy.details;
    }
    return `${campground.cancellationPolicy.fullRefund} for full refund. ${campground.cancellationPolicy.partialRefund} for partial refund. ${campground.cancellationPolicy.noRefund} for no refund.`;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (campground.images && campground.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? campground.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (campground.images && campground.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === campground.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToImage = (index: number) => {
    if (campground.images && index >= 0 && index < campground.images.length) {
      setCurrentImageIndex(index);
    }
  };

  const renderCheckInDetails = () => {
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="font-medium">Check-in:</p>
          <p className="whitespace-pre-line">{campground.checkIn.time}</p>
        </div>
        <div>
          <p className="font-medium">Check-out:</p>
          <p className="whitespace-pre-line">{campground.checkIn.checkout}</p>
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    const isUnavailable = displayedAvailability && displayedAvailability.available === false;

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
            ) : displayedAvailability ? (
              <>
                <div className="flex items-center">
                  {displayedAvailability.available ? (
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
                  {displayedAvailability?.message || ''}
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
              isSelected
                ? 'bg-emerald-600 text-white'
                : isLoading || isUnavailable
                  ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-beige'
            }`}
            onClick={isLoading || isUnavailable ? undefined : handleSelect}
            type="button"
          >
            {isSelected ? 'Selected' : isLoading ? 'Checking...' : isUnavailable ? 'Unavailable' : 'Select'}
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
                src={campground.images[currentImageIndex].url} 
                alt={campground.images[currentImageIndex].alt || campground.name} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Navigation buttons for image gallery */}
              {campground.images.length > 1 && (
                <>
                  {/* Left navigation button */}
                  <button 
                    onClick={handlePrevImage}
                    className="absolute top-1/2 left-2 -mt-5 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full text-white flex items-center justify-center transition-colors duration-200 focus:outline-none"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {/* Right navigation button */}
                  <button 
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-2 -mt-5 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full text-white flex items-center justify-center transition-colors duration-200 focus:outline-none"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Image indicators/dots */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {campground.images.slice(0, 5).map((_, index) => (
                      <button 
                        key={index} 
                        onClick={(e) => {
                          e.stopPropagation();
                          goToImage(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-white w-3' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`} 
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
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
                  {renderCheckInDetails()}
                </div>
              )}
              
              {/* Cancellation Policy */}
              {campground.cancellationPolicy && (
                <div>
                  <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Calendar size={16} />
                    Cancellation Policy
                  </h5>
                  {Array.isArray(campground.cancellationPolicy.details) ? (
                    <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                      {campground.cancellationPolicy.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-600 whitespace-pre-line">
                      {getCancellationPolicyText()}
                    </p>
                  )}
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
                      <p className="whitespace-pre-line">{campground.siteGuidelines.maxGuests}</p>
                    </div>
                    <div>
                      <p className="font-medium">Pets:</p>
                      <p className="whitespace-pre-line">{campground.siteGuidelines.petRules}</p>
                    </div>
                    {campground.siteGuidelines.quietHours && (
                      <div>
                        <p className="font-medium">Quiet Hours:</p>
                        <p className="whitespace-pre-line">{campground.siteGuidelines.quietHours}</p>
                      </div>
                    )}
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