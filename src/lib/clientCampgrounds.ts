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

// Client-side campground data
const campgroundData: { [location: string]: { tent: Campground[], lodging: Campground[] } } = {
  // Northern Michigan
  traverseCity: {
    tent: [
      {
        title: "Traverse City State Forest Campground",
        address: "4855 Supply Rd, Traverse City, MI 49696",
        cityAndState: "Traverse City, MI",
        content: "Nestled in the lush forests near Traverse City, this rustic campground offers a peaceful retreat with easy access to hiking trails, fishing spots, and the crystal-clear waters of nearby lakes. Perfect for nature lovers seeking a quiet northern Michigan experience.",
        estimatedPrice: "$20-30 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 25 Sites",
        distanceToTown: "15 minutes from downtown",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Vault toilets",
          "Hand pump water",
          "Hiking trails",
          "Fishing access"
        ],
        checkInTime: "3:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 6 people per site. Pets allowed on leash.",
        cancellationPolicy: "Full refund if cancelled 48 hours before arrival."
      }
    ],
    lodging: [
      {
        title: "Grand Traverse Bay Resort",
        address: "2550 US-31, Traverse City, MI 49686",
        cityAndState: "Traverse City, MI",
        content: "Experience the beauty of northern Michigan at this waterfront resort overlooking Grand Traverse Bay. Luxurious cabins with modern amenities provide the perfect base for exploring wineries, beaches, and the charming downtown of Traverse City.",
        estimatedPrice: "$150-250 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80"
        ],
        offerings: "Cabins, 15 Units",
        distanceToTown: "10 minutes from downtown",
        amenities: [
          "Full kitchen",
          "Fireplace",
          "Hot tub",
          "Private beach",
          "Boat rentals",
          "WiFi",
          "Air conditioning"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Some cabins are pet-friendly with additional fee.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival. 50% refund if cancelled 3 days before arrival."
      }
    ]
  },
  mackinacCity: {
    tent: [
      {
        title: "Straits State Park",
        address: "720 Church St, St Ignace, MI 49781",
        cityAndState: "Mackinac City, MI",
        content: "Camp with stunning views of the Mackinac Bridge and Straits of Mackinac at this popular state park. Located just minutes from ferries to Mackinac Island, this campground offers the perfect blend of natural beauty and access to northern Michigan attractions.",
        estimatedPrice: "$25-35 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 30 Sites",
        distanceToTown: "5 minutes from downtown",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Playground",
          "Beach access"
        ],
        checkInTime: "3:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 6 people per site. Pets allowed in designated areas.",
        cancellationPolicy: "Full refund if cancelled 72 hours before arrival."
      }
    ],
    lodging: [
      {
        title: "Mackinac Lakefront Cabins",
        address: "1120 S Huron Ave, Mackinaw City, MI 49701",
        cityAndState: "Mackinac City, MI",
        content: "Experience the charm of Mackinac in these cozy lakefront cabins with panoramic views of the Straits and Mackinac Bridge. Each cabin features a private deck where you can watch freighters pass and enjoy stunning sunsets over the water.",
        estimatedPrice: "$135-225 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Cabins, 10 Units",
        distanceToTown: "5 minutes from downtown",
        amenities: [
          "Kitchenette",
          "Private deck",
          "Fire pit",
          "BBQ grill",
          "Air conditioning",
          "WiFi",
          "Bicycle rentals"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival. 50% refund if cancelled 3 days before arrival."
      }
    ]
  },
  picturedRocks: {
    tent: [
      {
        title: "Twelvemile Beach Campground",
        address: "H-58, Grand Marais, MI 49839",
        cityAndState: "Pictured Rocks, MI",
        content: "Experience the breathtaking beauty of Lake Superior's shoreline at this rustic campground situated on a bluff overlooking the lake. Located within Pictured Rocks National Lakeshore, this campground offers easy access to stunning sandstone cliffs, pristine beaches, and miles of hiking trails.",
        estimatedPrice: "$20-25 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1604094170615-a9e9651dc4a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 36 Sites",
        distanceToTown: "25 minutes from Grand Marais",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Vault toilets",
          "Hand pump water",
          "Beach access",
          "Hiking trails"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 48 hours before arrival."
      }
    ],
    lodging: [
      {
        title: "Pictured Rocks Inn & Suites",
        address: "420 N Elm Ave, Munising, MI 49862",
        cityAndState: "Munising, MI",
        content: "Situated just minutes from Pictured Rocks National Lakeshore, this comfortable inn provides the perfect base for exploring the colorful cliffs, waterfalls, and beaches of Michigan's Upper Peninsula. After a day of adventure, relax in well-appointed rooms with all the comforts of home.",
        estimatedPrice: "$110-190 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Inn, 25 Rooms",
        distanceToTown: "5 minutes from downtown Munising",
        amenities: [
          "Free breakfast",
          "WiFi",
          "Air conditioning",
          "TV",
          "Mini-fridge",
          "Microwave",
          "Tour booking assistance"
        ],
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. Pet-friendly rooms available with additional fee.",
        cancellationPolicy: "Full refund if cancelled 72 hours before arrival. 50% refund if cancelled 24 hours before arrival."
      }
    ]
  },
  // Washington
  olympicNP: {
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
      }
    ],
    lodging: [
      {
        title: "Lake Crescent Lodge",
        address: "416 Lake Crescent Rd, Olympic National Park, WA 98363",
        cityAndState: "Olympic National Park, WA",
        content: "Historic lodge nestled on the shores of stunning Lake Crescent within Olympic National Park. Stay in charming cottages surrounded by ancient forests with easy access to hiking, kayaking, and exploring the diverse ecosystems of the park.",
        estimatedPrice: "$150-250 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1568624533962-8f93d8a4c359?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Lodge & Cottages, 55 Units",
        distanceToTown: "30 minutes from Port Angeles",
        amenities: [
          "Restaurant",
          "Bar",
          "Lake access",
          "Boat rentals",
          "Historic building",
          "Fireplaces",
          "Guided activities"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 7 days before arrival. 50% refund if cancelled 3 days before arrival."
      }
    ]
  },
  northCascades: {
    tent: [
      {
        title: "North Cascades Mountain View",
        address: "7280 Ranger Station Rd, Marblemount, WA 98267",
        cityAndState: "Marblemount, WA",
        content: "Surrounded by the towering peaks of the North Cascades, this campground offers a serene mountain retreat with stunning alpine views. Perfect for hikers and nature photographers looking to explore one of America's most dramatic mountain landscapes.",
        estimatedPrice: "$25-40 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 40 Sites",
        distanceToTown: "10 minutes from Marblemount",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Vault toilets",
          "Potable water",
          "River access",
          "Hiking trails",
          "Wildlife viewing"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 8 people per site. Pets allowed on leash.",
        cancellationPolicy: "Full refund if cancelled 72 hours before arrival."
      }
    ],
    lodging: [
      {
        title: "Cascades Wilderness Lodge",
        address: "51528 WA-20, Rockport, WA 98283",
        cityAndState: "Rockport, WA",
        content: "This rustic-luxe lodge offers a perfect blend of comfort and wilderness immersion in the heart of the North Cascades. Cozy cabins with mountain views provide the ideal base for hiking, fishing, wildlife watching, and exploring alpine lakes.",
        estimatedPrice: "$175-275 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1568624533962-8f93d8a4c359?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Lodge & Cabins, 20 Units",
        distanceToTown: "15 minutes from Rockport",
        amenities: [
          "Restaurant",
          "Fireplace",
          "Hot tub",
          "River access",
          "Guided excursions",
          "Fly fishing",
          "WiFi in common areas"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 14 days before arrival. 50% refund if cancelled 7 days before arrival."
      }
    ]
  },
  mountRainier: {
    tent: [
      {
        title: "Rainier Vista Campground",
        address: "52804 Paradise Rd E, Ashford, WA 98304",
        cityAndState: "Ashford, WA",
        content: "Camp in the shadow of magnificent Mount Rainier at this scenic campground. Surrounded by old-growth forests and alpine meadows, it's the perfect base for exploring the many trails, waterfalls, and wildflower displays of Mount Rainier National Park.",
        estimatedPrice: "$30-45 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Tent, 50 Sites",
        distanceToTown: "10 minutes from Ashford",
        amenities: [
          "Fire ring",
          "Picnic table",
          "Flush toilets",
          "Hot showers",
          "Amphitheater",
          "Ranger programs",
          "Hiking trails"
        ],
        checkInTime: "2:00 PM",
        checkOutTime: "12:00 PM",
        guidelines: "Maximum 6 people per site. Pets allowed in designated areas only.",
        cancellationPolicy: "Full refund if cancelled 72 hours before arrival."
      }
    ],
    lodging: [
      {
        title: "Paradise Inn at Mount Rainier",
        address: "52807 Paradise Rd E, Ashford, WA 98304",
        cityAndState: "Mount Rainier National Park, WA",
        content: "Historic mountain lodge located within Mount Rainier National Park, offering stunning views of the mountain and comfortable accommodations. Experience the park's beauty right from your doorstep with easy access to hiking trails and ranger programs.",
        estimatedPrice: "$200-350 per night",
        imageUrls: [
          "https://images.unsplash.com/photo-1568624533962-8f93d8a4c359?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        offerings: "Lodge, 80 Rooms",
        distanceToTown: "Inside the National Park",
        amenities: [
          "Restaurant",
          "Gift shop",
          "Historic building",
          "Mountain views",
          "Hiking trails",
          "Ranger programs",
          "Guided tours"
        ],
        checkInTime: "4:00 PM",
        checkOutTime: "11:00 AM",
        guidelines: "No smoking. No pets allowed.",
        cancellationPolicy: "Full refund if cancelled 21 days before arrival. 50% refund if cancelled 14 days before arrival."
      }
    ]
  }
};

// Function to get campgrounds for a specific location
export function getCampgroundsByLocation(location: string): { tent: Campground[], lodging: Campground[] } {
  if (!campgroundData[location]) {
    // Return empty arrays if location not found
    return { tent: [], lodging: [] };
  }
  
  return campgroundData[location];
}

// Function to get all available locations
export function getAllLocations(): string[] {
  return Object.keys(campgroundData);
} 