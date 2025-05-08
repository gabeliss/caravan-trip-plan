import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Tent, Home, Sparkles, ChevronDown, ChevronUp, Calendar, MapPin, Loader } from 'lucide-react';
import { Campground } from '../types';
import { CampgroundCard } from './CampgroundCard';

interface CampgroundListProps {
  campgrounds: Campground[];
  onSelect: (campground: Campground | null, accommodationType: string) => void;
  loading: boolean;
  tripStartDate: Date;
  tripEndDate: Date;
  guestCount: number;
}

export const CampgroundList: React.FC<CampgroundListProps> = ({ 
  campgrounds,
  onSelect,
  loading,
  tripStartDate,
  tripEndDate,
  guestCount
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSiteTypes, setSelectedSiteTypes] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Get unique amenities from all campgrounds
  const allAmenities = Array.from(
    new Set(
      campgrounds
        .flatMap(campground => campground.amenities || [])
    )
  ).sort();

  const siteTypes = [
    { id: 'tent', label: 'Tent Sites', icon: Tent },
    { id: 'rv', label: 'RV Sites', icon: Home },
    { id: 'lodging', label: 'Lodging', icon: Sparkles },
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleSiteType = (type: string) => {
    setSelectedSiteTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleCampgroundSelect = (campground: Campground | null, accommodationType: string) => {
    onSelect(campground, accommodationType);
  };

  const filteredCampgrounds = campgrounds
    .filter(campground =>
      selectedAmenities.length === 0 ||
      selectedAmenities.every(amenity =>
        campground.amenities?.includes(amenity)
      )
    )
    .filter(campground =>
      selectedSiteTypes.length === 0 ||
      selectedSiteTypes.some(type =>
        campground.siteTypes?.[type as keyof typeof campground.siteTypes]
      )
    );

    console.log("Filtered Campgrounds", {
      filteredCampgrounds,
      loading,
      tripStartDate,
      tripEndDate,
      guestCount
    });
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <h2 className="text-lg font-semibold">
            Available Campgrounds
          </h2>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Filter size={18} />
            <span className="font-medium text-sm hidden sm:inline">Filters</span>
            {isFiltersOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Filters Panel */}
        <motion.div
          initial={false}
          animate={{ height: isFiltersOpen ? 'auto' : 0, opacity: isFiltersOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden border-t"
        >
          <div className="flex flex-col gap-3 p-3 sm:p-4">
            {/* Site Types */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium text-gray-700">Site Types</span>
              <div className="flex flex-wrap gap-2">
                {siteTypes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleSiteType(id)}
                    className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-colors ${
                      selectedSiteTypes.includes(id)
                        ? 'bg-primary-dark text-beige'
                        : 'bg-beige/40 text-primary-dark hover:bg-beige/60'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {allAmenities.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Amenities</span>
                <div className="flex flex-wrap gap-2">
                  {allAmenities.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-primary-dark text-beige'
                          : 'bg-beige/40 text-primary-dark hover:bg-beige/60'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Campground List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-primary-dark" />
            <span className="ml-3 text-gray-700">Loading campgrounds...</span>
          </div>
        ) : filteredCampgrounds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-500">No campgrounds match your filters.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-gray-600">
                Found {filteredCampgrounds.length} campground{filteredCampgrounds.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500 italic">
                <Calendar className="inline w-3 h-3 mr-1" /> 
                Checking availability for {tripStartDate.toLocaleDateString()} - {tripEndDate.toLocaleDateString()}
              </p>
            </div>
            {filteredCampgrounds.map(campground => (
              <CampgroundCard
                key={campground.id}
                campground={campground}
                onSelect={handleCampgroundSelect}
                tripStartDate={tripStartDate}
                tripEndDate={tripEndDate}
                guestCount={guestCount}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CampgroundList;