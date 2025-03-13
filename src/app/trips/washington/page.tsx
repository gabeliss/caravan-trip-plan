import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Washington Camping Trip | Caravan Trip Plan",
  description: "Explore the best campgrounds in Washington with our personally vetted recommendations for Olympic National Park, North Cascades, and Mount Rainier.",
};

export default function WashingtonPage() {
  // Get mock campground data for Washington
  const washingtonData = mockCampgroundData.washington;

  const locations = [
    {
      name: "Olympic National Park",
      tent: [washingtonData.tent[0]],
      lodging: [],
    },
    {
      name: "North Cascades",
      tent: [washingtonData.tent[1]],
      lodging: [],
    },
    {
      name: "Mount Rainier",
      tent: [],
      lodging: [washingtonData.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Washington road trip takes you through three of the state's most spectacular national parks: Olympic National Park, North Cascades National Park, and Mount Rainier National Park. Experience diverse landscapes from rainforests to alpine meadows to volcanic peaks.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 450 miles, which we recommend spreading over 10-14 days to fully enjoy each location.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-4: Olympic National Park</h4>
            <p className="mt-2">
              Begin your journey in Olympic National Park, exploring the diverse ecosystems from the rugged coastline to the temperate rainforest to the alpine meadows. Spend 3-4 days hiking, wildlife watching, and visiting the Hoh Rainforest, Hurricane Ridge, and the coastal beaches.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 5-8: North Cascades National Park</h4>
            <p className="mt-2">
              Drive approximately 200 miles to North Cascades National Park (about 4-5 hours). Spend 3-4 days exploring the jagged peaks, alpine lakes, and over 300 glaciers. Don't miss Diablo Lake, the Cascade Pass Trail, and the charming town of Winthrop.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 9-12: Mount Rainier National Park</h4>
            <p className="mt-2">
              Continue your journey about 250 miles south to Mount Rainier National Park (approximately 5 hours). Spend 3-4 days exploring the trails around the iconic 14,410-foot active volcano, visiting Paradise and Sunrise visitor areas, and enjoying the spectacular wildflower meadows (if visiting in summer).
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best time to visit Washington's national parks is from July to September when the weather is most reliable and all roads and facilities are open.</li>
          <li>Make campground reservations well in advance, especially for summer months.</li>
          <li>Be prepared for rain, even in summer, especially in Olympic National Park's rainforest areas.</li>
          <li>Check road conditions before traveling, as mountain passes can close due to snow even in early summer or fall.</li>
          <li>Bring layers as weather can change quickly in mountain environments.</li>
          <li>Get an America the Beautiful Pass if you're visiting all three national parks to save on entrance fees.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Washington Camping Trip"
      description="Explore the diverse landscapes of Washington state, from rainforests to mountain peaks to volcanic wonders."
      heroImage="https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      locations={locations}
      routeInfo={routeInfo}
    />
  );
} 