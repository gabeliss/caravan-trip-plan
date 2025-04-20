import { BookingDetails, UserDetails, CampgroundAvailability, Campground, BookingProvider } from '../types';

const BOOKING_PROVIDERS: BookingProvider[] = [
  {
    id: 'direct',
    name: 'Book Direct',
    type: 'direct',
    logo: 'https://example.com/direct-logo.png'
  },
  {
    id: 'recreation-gov',
    name: 'Recreation.gov',
    type: 'external',
    baseUrl: 'https://www.recreation.gov/camping/campgrounds',
    logo: 'https://example.com/recreation-gov-logo.png'
  },
  {
    id: 'hipcamp',
    name: 'Hipcamp',
    type: 'external',
    baseUrl: 'https://www.hipcamp.com',
    logo: 'https://example.com/hipcamp-logo.png'
  },
  {
    id: 'the-dyrt',
    name: 'The Dyrt',
    type: 'external',
    baseUrl: 'https://thedyrt.com/camping',
    logo: 'https://example.com/the-dyrt-logo.png'
  }
];

export const bookingService = {
  /**
   * Get available booking providers for a campground
   */
  getProviders(campground: Campground): BookingProvider[] {
    return BOOKING_PROVIDERS.filter(provider => 
      campground.providers.some(p => p.id === provider.id)
    );
  },

  /**
   * Check real-time availability across all providers
   */
  async checkAvailability(
    campground: Campground,
    checkIn: Date,
    checkOut: Date,
    guests: number
  ): Promise<CampgroundAvailability[]> {
    const providers = this.getProviders(campground);
    
    // Parallel requests to all providers
    const availabilityPromises = providers.map(async provider => {
      try {
        // In a real implementation, this would make API calls to the booking platforms
        // For now, we'll simulate availability with the campground's base data
        return {
          available: Math.random() > 0.3,
          price: campground.price * (0.9 + Math.random() * 0.2),
          provider,
          siteTypes: [
            {
              id: 'standard',
              name: 'Standard Site',
              description: 'Standard camping site with basic amenities',
              maxGuests: campground.maxGuests,
              price: campground.price,
              amenities: campground.amenities,
              available: Math.random() > 0.3
            }
          ],
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error checking availability for ${provider.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(availabilityPromises);
    return results.filter((result): result is CampgroundAvailability => result !== null);
  },

  /**
   * Generate a booking URL with pre-filled details
   */
  generateBookingUrl(
    provider: BookingProvider,
    campground: Campground,
    details: BookingDetails,
    userDetails?: UserDetails
  ): string {
    if (!provider.baseUrl) return '';

    const params = new URLSearchParams({
      campground: campground.id,
      checkIn: details.checkIn.toISOString(),
      checkOut: details.checkOut.toISOString(),
      guests: details.guests.toString()
    });

    if (userDetails) {
      params.append('firstName', userDetails.firstName);
      params.append('lastName', userDetails.lastName);
      params.append('email', userDetails.email);
    }

    return `${provider.baseUrl}/${campground.id}?${params.toString()}`;
  },

  /**
   * Initialize a booking session
   */
  async initializeBooking(
    details: BookingDetails,
    userDetails: UserDetails
  ): Promise<{ sessionUrl: string }> {
    // In a real implementation, this would:
    // 1. Validate availability
    // 2. Create a booking session with the provider
    // 3. Return the session URL or booking token
    
    const mockSessionUrl = this.generateBookingUrl(
      details.provider,
      { id: details.campgroundId } as Campground,
      details,
      userDetails
    );

    return { sessionUrl: mockSessionUrl };
  },

  /**
   * Store booking confirmation in user's trip itinerary
   */
  async storeBookingConfirmation(
    bookingDetails: BookingDetails,
    confirmationNumber: string
  ): Promise<void> {
    // In a real implementation, this would:
    // 1. Store the booking details in the database
    // 2. Update the user's trip itinerary
    // 3. Send confirmation email
    console.log('Storing booking confirmation:', { bookingDetails, confirmationNumber });
  }
};