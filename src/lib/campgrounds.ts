import fs from 'fs';
import path from 'path';

// Define the structure of our campground data
export interface Campground {
  title: string;
  address: string;
  cityAndState: string;
  content: string;
  estimatedPrice: string;
  imageUrls: string[];
  offerings: string;
  distanceToTown: string;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  guidelines: string;
  cancellationPolicy: string;
}

export interface CampgroundData {
  [location: string]: {
    tent: {
      [campgroundId: string]: Campground;
    };
    lodging: {
      [campgroundId: string]: Campground;
    };
  };
}

// Function to load campground data from our JSON file
export function getCampgroundData(): CampgroundData {
  try {
    const filePath = path.join(process.cwd(), 'data.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: CampgroundData = JSON.parse(fileContents);
    return data;
  } catch (error) {
    console.error('Error loading campground data:', error);
    return {} as CampgroundData;
  }
}

// Function to get campgrounds for a specific location
export function getCampgroundsByLocation(location: string): { tent: Campground[], lodging: Campground[] } {
  const data = getCampgroundData();
  
  if (!data[location]) {
    return { tent: [], lodging: [] };
  }
  
  const tent = Object.values(data[location].tent || {});
  const lodging = Object.values(data[location].lodging || {});
  
  return { tent, lodging };
}

// Function to get all available locations
export function getAllLocations(): string[] {
  const data = getCampgroundData();
  return Object.keys(data);
}

// Mock data for locations that don't have data in our JSON
export const mockCampgroundData: { [location: string]: { tent: Campground[], lodging: Campground[] } } = {
  washington: {
    tent: [
      {
        title: "Olympic National Park Campground",
        address: "3002 Mt Angeles Rd, Port Angeles, WA 98362",
        cityAndState: "Port Angeles, WA",
        content: "Experience the diverse ecosystems of Olympic National Park at this stunning campground. Nestled between ancient forests and rugged coastlines, this campground offers a true wilderness experience with easy access to hiking trails, wildlife viewing, and breathtaking vistas.",
        estimatedPrice: "$30-45 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 80 Sites",
        distanceToTown: "15 minutes from Port Angeles",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Potable water",
          "Bear-proof food storage",
          "Ranger programs",
          "Hiking trails"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. Pets allowed on leash.",
        cancellationPolicy: "Cancellations made 7 days or more before arrival date receive a full refund minus a $10 service fee."
      },
      {
        title: "North Cascades Mountain View",
        address: "7280 Ranger Station Rd, Marblemount, WA 98267",
        cityAndState: "Marblemount, WA",
        content: "Surrounded by the towering peaks of the North Cascades, this campground offers a serene mountain retreat with stunning alpine views. Perfect for hikers and nature photographers looking to explore one of America's most dramatic mountain landscapes.",
        estimatedPrice: "$25-40 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 50 Sites",
        distanceToTown: "10 minutes from Marblemount",
        amenities: [
          "Fire pit",
          "Picnic table",
          "Vault toilets",
          "Drinking water",
          "River access",
          "Hiking trails nearby"
        ],
        checkInTime: "1:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 14 days before arrival. 50% refund if cancelled 7 days before arrival."
      }
    ],
    lodging: [
      {
        title: "Rainier View Lodge",
        address: "35707 SR 706 E, Ashford, WA 98304",
        cityAndState: "Ashford, WA",
        content: "This cozy lodge offers comfortable accommodations with stunning views of Mount Rainier. Located just minutes from the national park entrance, it's the perfect base for exploring the area's natural wonders while enjoying modern amenities.",
        estimatedPrice: "$150-200 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Cabin, 12 Units",
        distanceToTown: "5 minutes from Ashford, 10 minutes to Mt. Rainier National Park entrance",
        amenities: [
          "Private bathroom",
          "Kitchenette",
          "Heating",
          "Free WiFi",
          "Parking",
          "Mountain views",
          "Outdoor seating area"
        ],
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Pet-friendly rooms available with $25 fee.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  },
  arizona: {
    tent: [
      {
        title: "Grand Canyon South Rim Campground",
        address: "Grand Canyon Village, AZ 86023",
        cityAndState: "Grand Canyon Village, AZ",
        content: "Camp under the stars just minutes from the awe-inspiring South Rim of the Grand Canyon. This campground offers the perfect base for exploring one of the world's most spectacular natural wonders, with easy access to hiking trails, ranger programs, and breathtaking viewpoints.",
        estimatedPrice: "$35-50 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1533632359083-0185df1be85d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 70 Sites",
        distanceToTown: "5 minutes from Grand Canyon Village",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Drinking water",
          "Coin-operated showers",
          "Ranger programs",
          "Shuttle service"
        ],
        checkInTime: "12:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. Pets allowed in campground but not on trails.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival, minus a $10 transaction fee."
      },
      {
        title: "Sedona Red Rock Campground",
        address: "525 Posse Ground Rd, Sedona, AZ 86336",
        cityAndState: "Sedona, AZ",
        content: "Surrounded by Sedona's famous red rock formations, this campground offers a magical desert experience with stunning views and starry nights. Perfect for hikers, photographers, and spiritual seekers looking to connect with the unique energy of this special place.",
        estimatedPrice: "$30-45 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80"
        ],
        offerings: "Tent, 40 Sites",
        distanceToTown: "10 minutes from downtown Sedona",
        amenities: [
          "Fire pit",
          "Picnic table",
          "Vault toilets",
          "Potable water",
          "Hiking trails nearby",
          "Mountain biking trails"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. Quiet hours 10 PM to 6 AM.",
        cancellationPolicy: "72-hour cancellation policy for full refund minus $5 service fee."
      }
    ],
    lodging: [
      {
        title: "Desert Oasis Resort",
        address: "6302 E Cave Creek Rd, Cave Creek, AZ 85331",
        cityAndState: "Cave Creek, AZ",
        content: "This luxurious desert resort offers comfortable accommodations with stunning views of the Sonoran Desert. Featuring a pool, spa, and restaurant, it's the perfect place to relax after a day of exploring Arizona's natural wonders.",
        estimatedPrice: "$180-250 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
        ],
        offerings: "Resort, 30 Units",
        distanceToTown: "5 minutes from Cave Creek",
        amenities: [
          "Swimming pool",
          "Hot tub",
          "Restaurant",
          "Bar",
          "Air conditioning",
          "Free WiFi",
          "Desert views",
          "Guided tours available"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Adults-only resort.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  },
  "smoky-mountains": {
    tent: [
      {
        title: "Smoky Mountain Riverside Campground",
        address: "8555 Soco Rd, Maggie Valley, NC 28751",
        cityAndState: "Maggie Valley, NC",
        content: "Nestled along a pristine mountain stream, this campground offers a peaceful retreat in the heart of the Smoky Mountains. Fall asleep to the sound of rushing water and wake up to misty mountain views at this family-friendly campground.",
        estimatedPrice: "$30-45 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 60 Sites",
        distanceToTown: "10 minutes from Maggie Valley, 20 minutes from Cherokee",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "River access",
          "Fishing spots",
          "Playground",
          "Camp store"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. Pets allowed on leash.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival, minus a $10 transaction fee."
      },
      {
        title: "Cades Cove Campground",
        address: "Cades Cove Loop Rd, Townsend, TN 37882",
        cityAndState: "Townsend, TN",
        content: "Located in one of the most popular areas of Great Smoky Mountains National Park, this campground offers a chance to experience the park's rich history and abundant wildlife. Deer, black bears, and wild turkeys are frequent visitors to this scenic valley.",
        estimatedPrice: "$25-35 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 80 Sites",
        distanceToTown: "25 minutes from Townsend",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Drinking water",
          "Ranger programs",
          "Historic buildings nearby",
          "Wildlife viewing"
        ],
        checkInTime: "12:00 PM",
        checkOutTime: "10:00 AM",
        guidelines: "Maximum 6 people per site. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 14 days before arrival. 50% refund if cancelled 7 days before arrival."
      }
    ],
    lodging: [
      {
        title: "Mountain View Cabin Resort",
        address: "2740 Florence Dr, Pigeon Forge, TN 37863",
        cityAndState: "Pigeon Forge, TN",
        content: "These charming log cabins offer a perfect blend of rustic charm and modern comfort, with stunning views of the Smoky Mountains. Each cabin features a private hot tub, fireplace, and fully equipped kitchen.",
        estimatedPrice: "$150-250 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Cabin, 20 Units",
        distanceToTown: "10 minutes from Pigeon Forge, 15 minutes from Gatlinburg",
        amenities: [
          "Private hot tub",
          "Fireplace",
          "Full kitchen",
          "WiFi",
          "Mountain views",
          "Grill",
          "Deck with seating",
          "Access to pool and fitness center"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Some cabins are pet-friendly with $50 fee.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  },
  "southern-california": {
    tent: [
      {
        title: "Joshua Tree Desert Campground",
        address: "74485 National Park Dr, Twentynine Palms, CA 92277",
        cityAndState: "Twentynine Palms, CA",
        content: "Experience the magic of the desert at this campground located in the heart of Joshua Tree National Park. With its unique rock formations, iconic Joshua trees, and spectacular night skies, this is a must-visit destination for nature lovers and stargazers.",
        estimatedPrice: "$25-35 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80"
        ],
        offerings: "Tent, 50 Sites",
        distanceToTown: "15 minutes from Twentynine Palms",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Vault toilets",
          "No water (bring your own)",
          "Stargazing",
          "Rock climbing nearby",
          "Hiking trails"
        ],
        checkInTime: "12:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. No pets allowed on trails.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival."
      },
      {
        title: "San Diego Coastal Campground",
        address: "2211 S Coast Hwy, Oceanside, CA 92054",
        cityAndState: "Oceanside, CA",
        content: "Fall asleep to the sound of crashing waves at this beautiful beachfront campground. With direct access to the beach and stunning ocean views, this is the perfect spot for surfing, swimming, and soaking up the Southern California sunshine.",
        estimatedPrice: "$45-65 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 40 Sites",
        distanceToTown: "5 minutes from Oceanside, 30 minutes from San Diego",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Beach access",
          "Surfing",
          "Bike rentals",
          "Camp store"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. Pets allowed on leash.",
        cancellationPolicy: "Full refund if cancelled 14 days before arrival. 50% refund if cancelled 7 days before arrival."
      }
    ],
    lodging: [
      {
        title: "Palm Springs Desert Oasis",
        address: "1600 E Palm Canyon Dr, Palm Springs, CA 92264",
        cityAndState: "Palm Springs, CA",
        content: "This stylish mid-century modern resort offers a luxurious desert retreat with mountain views, multiple pools, and spa services. Located in the heart of Palm Springs, it's the perfect base for exploring the area's attractions, shopping, and dining.",
        estimatedPrice: "$200-350 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
        ],
        offerings: "Resort, 40 Units",
        distanceToTown: "5 minutes from downtown Palm Springs",
        amenities: [
          "Multiple pools",
          "Hot tub",
          "Spa services",
          "Restaurant",
          "Bar",
          "Air conditioning",
          "Free WiFi",
          "Mountain views",
          "Fitness center"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Adults-only resort.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  },
  "colorado-rockies": {
    tent: [
      {
        title: "Rocky Mountain National Park Campground",
        address: "1000 US-36, Estes Park, CO 80517",
        cityAndState: "Estes Park, CO",
        content: "Experience the majestic beauty of the Rocky Mountains at this high-altitude campground. Surrounded by towering peaks, alpine meadows, and abundant wildlife, this campground offers a true wilderness experience with easy access to hiking trails, fishing spots, and scenic drives.",
        estimatedPrice: "$30-45 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 70 Sites",
        distanceToTown: "15 minutes from Estes Park",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Vault toilets",
          "Potable water",
          "Bear-proof food storage",
          "Ranger programs",
          "Hiking trails"
        ],
        checkInTime: "1:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. Pets allowed in campground but not on most trails.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival, minus a $10 transaction fee."
      },
      {
        title: "Aspen Grove Campground",
        address: "123 Maroon Creek Rd, Aspen, CO 81611",
        cityAndState: "Aspen, CO",
        content: "Nestled in a grove of aspen trees with stunning mountain views, this campground offers a peaceful retreat in one of Colorado's most beautiful areas. Perfect for hikers, mountain bikers, and outdoor enthusiasts looking to explore the natural beauty of Aspen.",
        estimatedPrice: "$35-50 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 40 Sites",
        distanceToTown: "10 minutes from downtown Aspen",
        amenities: [
          "Fire pit",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Drinking water",
          "Mountain biking trails",
          "Fishing spots"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. No pets allowed.",
        cancellationPolicy: "72-hour cancellation policy for full refund minus $5 service fee."
      }
    ],
    lodging: [
      {
        title: "Telluride Mountain Lodge",
        address: "567 Mountain Village Blvd, Telluride, CO 81435",
        cityAndState: "Telluride, CO",
        content: "This luxurious mountain lodge offers comfortable accommodations with breathtaking views of the San Juan Mountains. Located in the heart of Telluride, it's the perfect base for exploring the area's outdoor activities, festivals, and dining scene.",
        estimatedPrice: "$200-350 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Lodge, 25 Units",
        distanceToTown: "5 minutes from downtown Telluride",
        amenities: [
          "Fireplace",
          "Hot tub",
          "Restaurant",
          "Bar",
          "Free WiFi",
          "Mountain views",
          "Ski storage",
          "Shuttle service"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Pet-friendly rooms available with $50 fee.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  },
  "maine-coastline": {
    tent: [
      {
        title: "Acadia National Park Campground",
        address: "Blackwoods Campground, Bar Harbor, ME 04609",
        cityAndState: "Bar Harbor, ME",
        content: "Experience the rugged beauty of Maine's coastline at this campground located in Acadia National Park. With easy access to hiking trails, rocky beaches, and stunning ocean views, this campground offers a perfect base for exploring one of America's most beautiful national parks.",
        estimatedPrice: "$30-40 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1582488719899-a2a54cb479fe?q=80&w=1572&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 60 Sites",
        distanceToTown: "10 minutes from Bar Harbor",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Drinking water",
          "Ranger programs",
          "Hiking trails",
          "Ocean views"
        ],
        checkInTime: "1:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival, minus a $10 transaction fee."
      },
      {
        title: "Portland Harbor Campground",
        address: "123 Casco Bay Rd, Portland, ME 04101",
        cityAndState: "Portland, ME",
        content: "Located just minutes from downtown Portland, this waterfront campground offers stunning views of Casco Bay and easy access to the city's renowned food scene, breweries, and cultural attractions. Fall asleep to the sound of harbor bells and wake up to ocean breezes.",
        estimatedPrice: "$40-55 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 35 Sites",
        distanceToTown: "5 minutes from downtown Portland",
        amenities: [
          "Fire pit",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Harbor views",
          "Kayak rentals",
          "Bike path access",
          "Camp store"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. Pets allowed on leash.",
        cancellationPolicy: "Full refund if cancelled 14 days before arrival. 50% refund if cancelled 7 days before arrival."
      }
    ],
    lodging: [
      {
        title: "Camden Seaside Cottages",
        address: "456 Bay View St, Camden, ME 04843",
        cityAndState: "Camden, ME",
        content: "These charming seaside cottages offer comfortable accommodations with stunning views of Camden Harbor and Penobscot Bay. Each cottage features a private deck, fully equipped kitchen, and coastal-inspired decor, perfect for a relaxing Maine getaway.",
        estimatedPrice: "$175-250 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Cottage, 15 Units",
        distanceToTown: "5 minutes from downtown Camden",
        amenities: [
          "Private deck",
          "Full kitchen",
          "Fireplace",
          "Free WiFi",
          "Ocean views",
          "Beach access",
          "Lobster dinners available",
          "Sailing excursions"
        ],
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Some cottages are pet-friendly with $35 fee.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  },
  "utah-national-parks": {
    tent: [
      {
        title: "Zion Canyon Campground",
        address: "479 Zion Park Blvd, Springdale, UT 84767",
        cityAndState: "Springdale, UT",
        content: "Located just minutes from the entrance to Zion National Park, this campground offers stunning views of the park's towering red cliffs and easy access to hiking trails, scenic drives, and ranger programs. Perfect for outdoor enthusiasts looking to explore one of Utah's most spectacular national parks.",
        estimatedPrice: "$35-50 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1533632359083-0185df1be85d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 65 Sites",
        distanceToTown: "5 minutes from Springdale, 2 minutes to Zion National Park entrance",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Drinking water",
          "Shuttle stop",
          "Camp store",
          "River access"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. Pets allowed in campground but not on most trails.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival, minus a $10 transaction fee."
      },
      {
        title: "Bryce Canyon Rim Campground",
        address: "Bryce Canyon National Park, UT 84764",
        cityAndState: "Bryce, UT",
        content: "Camp along the rim of Bryce Canyon with stunning views of the park's famous hoodoos and spires. This high-elevation campground offers cool temperatures in summer and easy access to hiking trails, stargazing programs, and scenic viewpoints.",
        estimatedPrice: "$30-45 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 50 Sites",
        distanceToTown: "15 minutes from Bryce Canyon City",
        amenities: [
          "Fire pit",
          "Picnic table",
          "Flush toilets",
          "Drinking water",
          "Ranger programs",
          "Hiking trails",
          "Stargazing"
        ],
        checkInTime: "12:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 8 people per site. No pets allowed on trails.",
        cancellationPolicy: "Full refund if cancelled 14 days before arrival. 50% refund if cancelled 7 days before arrival."
      }
    ],
    lodging: [
      {
        title: "Arches Desert Resort",
        address: "1551 N Hwy 191, Moab, UT 84532",
        cityAndState: "Moab, UT",
        content: "This comfortable desert resort offers modern accommodations with stunning views of the red rock landscape surrounding Moab. Located just minutes from Arches National Park, it's the perfect base for exploring the area's natural wonders, hiking trails, and outdoor activities.",
        estimatedPrice: "$150-225 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
        ],
        offerings: "Resort, 35 Units",
        distanceToTown: "5 minutes from downtown Moab, 10 minutes to Arches National Park entrance",
        amenities: [
          "Swimming pool",
          "Hot tub",
          "Restaurant",
          "Free WiFi",
          "Air conditioning",
          "Desert views",
          "Bike storage",
          "Adventure tours available"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Pet-friendly rooms available with $30 fee.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  },
  "florida-keys": {
    tent: [
      {
        title: "Key Largo Oceanside Campground",
        address: "101551 Overseas Hwy, Key Largo, FL 33037",
        cityAndState: "Key Largo, FL",
        content: "Experience the tropical paradise of the Florida Keys at this oceanfront campground. With direct access to the crystal-clear waters of the Atlantic Ocean, this campground offers opportunities for snorkeling, kayaking, and fishing right from your campsite.",
        estimatedPrice: "$45-65 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 40 Sites",
        distanceToTown: "10 minutes from downtown Key Largo",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Beach access",
          "Kayak rentals",
          "Snorkeling gear",
          "Fishing dock"
        ],
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "Maximum 6 people per site. Pets allowed on leash.",
        cancellationPolicy: "Full refund if cancelled 14 days before arrival. 50% refund if cancelled 7 days before arrival."
      },
      {
        title: "Marathon Waterfront Campground",
        address: "6099 Overseas Hwy, Marathon, FL 33050",
        cityAndState: "Marathon, FL",
        content: "Located in the heart of the Florida Keys, this waterfront campground offers stunning sunset views and easy access to both the Gulf of Mexico and Atlantic Ocean. Perfect for boating, fishing, and exploring the unique ecosystem of the Keys.",
        estimatedPrice: "$50-70 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 30 Sites",
        distanceToTown: "5 minutes from Marathon",
        amenities: [
          "Fire pit",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Boat ramp",
          "Fishing pier",
          "Tiki huts",
          "Camp store"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. Pets allowed in designated areas only.",
        cancellationPolicy: "72-hour cancellation policy for full refund minus $10 service fee."
      }
    ],
    lodging: [
      {
        title: "Key West Island Resort",
        address: "3841 N Roosevelt Blvd, Key West, FL 33040",
        cityAndState: "Key West, FL",
        content: "This tropical resort offers luxurious accommodations with ocean views, lush gardens, and a laid-back island vibe. Located just minutes from downtown Key West, it's the perfect base for exploring the island's attractions, beaches, and vibrant nightlife.",
        estimatedPrice: "$225-400 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
        ],
        offerings: "Resort, 45 Units",
        distanceToTown: "10 minutes from downtown Key West",
        amenities: [
          "Swimming pool",
          "Private beach",
          "Restaurant",
          "Bar",
          "Spa services",
          "Free WiFi",
          "Air conditioning",
          "Water sports rentals",
          "Sunset cruises"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Adults-only resort.",
        cancellationPolicy: "Full refund if cancelled 30 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  }
}; 