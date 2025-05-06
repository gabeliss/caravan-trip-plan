// Add lodging types to the Campground interface
export interface LodgingOptions {
  cabins?: {
    available: boolean;
    description?: string;
    count?: number;
    maxOccupancy?: number;
  };
  yurts?: {
    available: boolean;
    description?: string;
    count?: number;
    maxOccupancy?: number;
  };
  other?: {
    type: string;
    available: boolean;
    description?: string;
    count?: number;
    maxOccupancy?: number;
  }[];
}

export interface Campground {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  amenities: string[];
  coordinates: [number, number];
  images: CampgroundImage[];
  imageUrl: string;
  address: string;
  distanceToTown: string;
  season: {
    start: string;
    end: string;
  };
  checkIn: CheckInInfo;
  siteGuidelines: SiteGuidelines;
  cancellationPolicy: CancellationPolicy;
  maxGuests: number | string;
  taxRate: number;
  providers: BookingProvider[];
  nearbyAttractions: string[];
  siteTypes: {
    tent: boolean;
    rv: boolean;
    lodging: boolean;
  };
  lodging?: LodgingOptions;
  bookingUrl?: string;
  bookingInstructions?: string;
  availability?: {
    available: boolean;
    price: number | null;
    message: string;
    timestamp?: string;
  };
  city?: string;
}

export interface CampgroundImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface CheckInInfo {
  time: string;
  lateArrival: string;
  checkout: string;
  lateFees: string;
}

export interface SiteGuidelines {
  maxGuests: number | string;
  maxVehicles: number;
  quietHours: string | null;
  petRules: string;
  ageRestrictions: string;
}

export interface CancellationPolicy {
  fullRefund: string;
  partialRefund: string;
  noRefund: string;
  modifications: string;
  weatherPolicy: string;
  details?: string | string[];
}

export interface BookingProvider {
  id: string;
  name: string;
  type: 'direct' | 'external';
  baseUrl?: string;
  logo?: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  description?: string;
  imageUrl?: string;
  highlights?: string[];
  coordinates?: [number, number];
}

export interface TripDuration {
  startDate?: Date;
  nights: number;
  guestCount: number;
}

export interface DailyItinerary {
  day: number;
  date: Date;
  activities: string[];
  route: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  trips: SavedTrip[];
}

export interface TripDetails {
  destination: string;
  nights: number;
  startDate: Date;
  guestCount: number;
}

export interface SavedTrip {
  id: string;
  confirmationId: string;
  trip_details: TripDetails;
  selectedCampgrounds: Campground[];
  createdAt: string;
  status: 'planned' | 'active' | 'completed';
  guideUrl?: string;
  payment?: TripPayment;
}

export interface TripPayment {
  tripId: string;
  status: {
    paid: boolean;
    transactionId: string;
    amount: number;
    date: string;
  };
  guideUrl?: string;
  bookingUrls: Record<string, string>;
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface Weather {
  date: Date;
  temperature: {
    high: number;
    low: number;
  };
  condition: string;
  icon: string;
}

export interface CampgroundAvailability {
  available: boolean;
  price: number;
  provider: BookingProvider;
  siteTypes: {
    id: string;
    name: string;
    description: string;
    maxGuests: number;
    price: number;
    amenities: string[];
    available: boolean;
  }[];
  lastUpdated: string;
}

export interface BookingDetails {
  campgroundId: string;
  siteTypeId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  provider: BookingProvider;
}

// New types for trip itineraries
export interface TripStop {
  city: string;
  nights: number;
}

export interface TripItinerary {
  id: string;
  name: string;
  description: string;
  stops: Record<number, TripStop[]>;
  cityScraperIds: Record<string, string>;
}

export interface ItineraryPlan {
  destination: string;
  totalNights: number;
  startDate: Date;
  guestCount: number;
  stops: {
    city: string;
    scraperId: string;
    startDate: Date;
    endDate: Date;
    nights: number;
    campgrounds?: Campground[];
  }[];
}