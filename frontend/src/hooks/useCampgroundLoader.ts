import { useState, useEffect } from 'react';
import { Destination, TripDuration, Campground, ItineraryPlan } from '../types';
import { getLocationStays } from '../utils/getLocationStays';
import { enhanceCampgroundsWithData } from '../utils/enhanceCampgrounds';
import apiService from '../services/apiService';

interface UseCampgroundLoaderProps {
  availabilityData: any[] | null;
  tripPlan: ItineraryPlan | null;
  destination: Destination;
  duration: TripDuration;
}

export function useCampgroundLoader({
  availabilityData,
  tripPlan,
  destination,
  duration,
}: UseCampgroundLoaderProps) {
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCampgroundsForDay = async (selectedDay: number) => {
    if (!tripPlan) return;
    
    setLoading(true);
    
    try {
      // Get availability data from context if available
      if (availabilityData && availabilityData.length > 0) {
        const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
          selectedDay >= stay.startNight && selectedDay <= stay.endNight
        );
        
        if (!currentStay) {
          console.warn('No stay found for selected day:', selectedDay);
          setCampgrounds([]);
          setLoading(false);
          return;
        }
        
        const cityName = currentStay.location;
        const cityId = cityName.toLowerCase().replace(/\s+/g, '-');
        
        const stopAvailability = availabilityData.find(stop => 
          stop.city === cityId || stop.cityId === cityId
        );
        
        if (stopAvailability && stopAvailability.campgrounds) {
          // Transform the campground data to match the expected format and enhance with detailed data
          const transformedCampgrounds = stopAvailability.campgrounds.map((campground: any) => {
            const campgroundData = {
              ...campground,
              rating: campground.rating || 4 + Math.random(),
              amenities: campground.amenities || ['WiFi', 'Showers', 'Toilets', 'Fire pit'],
              images: campground.images || [
                { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', alt: 'Campsite' },
                { url: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a', alt: 'Campsite view' }
              ],
              imageUrl: campground.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
              address: campground.address || `${currentStay.location}, MI`,
              providers: campground.providers || [
                {
                  id: 'direct',
                  name: 'Direct Booking',
                  type: 'direct' as 'direct' | 'external'
                }
              ],
              siteTypes: campground.siteTypes || {
                tent: true,
                rv: true,
                lodging: false
              }
            };

            // If availability comes from a real API response (not default), preserve it
            if (campground.availability?.timestamp) {
              campgroundData.availability = campground.availability;
            }

            return campgroundData;
          });
          
          // Enhance campgrounds with detailed data from the JSON file
          const enhancedCampgrounds = enhanceCampgroundsWithData(transformedCampgrounds, cityName);
          
          setCampgrounds(enhancedCampgrounds);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to API if no availability data is found
      const currentStay = getLocationStays(tripPlan, destination, duration).find(stay => 
        selectedDay >= stay.startNight && selectedDay <= stay.endNight
      );
      
      if (!currentStay) {
        setCampgrounds([]);
        setLoading(false);
        return;
      }
      
      const currentStop = tripPlan.stops.find(stop => 
        stop.city.toLowerCase().replace(/\s+/g, '-') === currentStay.location.toLowerCase().replace(/\s+/g, '-')
      );
      
      if (!currentStop) {
        setCampgrounds([]);
        setLoading(false);
        return;
      }
      
      const cityId = currentStop.scraperId || currentStop.city.toLowerCase().replace(/\s+/g, '-');
      
      if (currentStop.campgrounds && currentStop.campgrounds.length > 0) {
        const enhancedCampgrounds = enhanceCampgroundsWithData(
          currentStop.campgrounds,
          currentStop.city
        );
        
        setCampgrounds(enhancedCampgrounds);
      } else {
        const fetchedCampgrounds = await apiService.getCampgrounds(cityId);
        
        const enhancedCampgrounds = enhanceCampgroundsWithData(
          fetchedCampgrounds,
          currentStop.city
        );
        
        setCampgrounds(enhancedCampgrounds);
      }
    } catch (error) {
      console.error('Error fetching campgrounds:', error);
      setCampgrounds([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    campgrounds,
    loading,
    loadCampgroundsForDay
  };
} 