import { ItineraryPlan, TripStop } from '../types';
import { tripItineraries } from '../data/tripItineraries';

/**
 * Adds days to a date
 * @param date The starting date
 * @param days Number of days to add
 * @returns A new date with the added days
 */
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Generates a trip plan based on destination, number of nights, and start date
 * @param destinationId The ID of the destination
 * @param nights Total number of nights for the trip
 * @param startDate Starting date of the trip
 * @param numAdults Number of adults
 * @param numKids Number of kids
 * @returns An itinerary plan with stops and dates
 */
export const generateTripPlan = (
  destinationId: string,
  nights: number,
  startDate: Date,
  numAdults: number = 2,
  numKids: number = 0
): ItineraryPlan | null => {
  // Ensure valid input
  if (!destinationId || !nights || !startDate) {
    console.error('Missing required parameters for trip plan generation');
    return null;
  }

  // Get the destination itinerary
  const itinerary = tripItineraries[destinationId];
  if (!itinerary) {
    console.error(`No itinerary found for destination: ${destinationId}`);
    return null;
  }

  // Get stops for the selected number of nights
  const stops = itinerary.stops[nights];
  if (!stops || stops.length === 0) {
    console.error(`No stops found for ${nights} nights in ${destinationId}`);
    return null;
  }

  // Initialize plan
  const plan: ItineraryPlan = {
    destination: destinationId,
    totalNights: nights,
    startDate: new Date(startDate),
    stops: []
  };

  // Calculate dates for each stop
  let currentDate = new Date(startDate);
  
  stops.forEach((stop: TripStop) => {
    const scraperId = itinerary.cityScraperIds[stop.city];
    if (!scraperId) {
      console.warn(`No scraper ID found for city: ${stop.city}`);
      return;
    }

    const stopStartDate = new Date(currentDate);
    const stopEndDate = addDays(currentDate, stop.nights);

    plan.stops.push({
      city: stop.city,
      scraperId,
      startDate: stopStartDate,
      endDate: stopEndDate,
      nights: stop.nights
    });

    // Update current date for next stop
    currentDate = new Date(stopEndDate);
  });

  return plan;
};

/**
 * Formats a date as MM/DD/YY for the API
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDateForApi = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().substr(-2);
  
  return `${month}/${day}/${year}`;
};

/**
 * Generates scraper request parameters for each stop in a trip plan
 * @param plan The itinerary plan
 * @param numAdults Number of adults
 * @param numKids Number of kids
 * @returns Array of request parameters for each stop
 */
export const generateScraperRequests = (
  plan: ItineraryPlan,
  numAdults: number = 2,
  numKids: number = 0
) => {
  if (!plan || !plan.stops || plan.stops.length === 0) {
    return [];
  }

  return plan.stops.map(stop => {
    return {
      cityId: stop.scraperId,
      startDate: formatDateForApi(stop.startDate),
      endDate: formatDateForApi(stop.endDate),
      numAdults,
      numKids,
      nights: stop.nights
    };
  });
}; 