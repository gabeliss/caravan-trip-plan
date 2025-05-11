import { Campground } from '../types';

/**
 * Availability info for a single accommodation type (e.g., tent, rv, lodging)
 */
export interface AccommodationAvailability {
  available: boolean;
  price: number;
  message: string;
  timestamp?: string;
  error?: string;
  [key: string]: any; // Optional: allow extra fields like availableDates, etc.
}

/**
 * Full availability object: mapping accommodation type -> availability info
 */
export interface FullAvailability {
  [accommodationType: string]: AccommodationAvailability;
}

/**
 * Extended campground type that includes full availability for multiple accommodation types
 */
export interface CampgroundWithAvailability extends Omit<Campground, 'availability'> {
  availability?: FullAvailability;
}

/**
 * Selected campground with accommodation type
 */
export interface SelectedCampground {
  campground: Campground | null;
  accommodationType: string;
  price: number;
} 