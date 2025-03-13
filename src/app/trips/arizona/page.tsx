import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Arizona Camping Trip | Caravan Trip Plan",
  description: "Explore the best campgrounds in Arizona with our personally vetted recommendations for Grand Canyon, Sedona, and Cave Creek.",
};

export default function ArizonaPage() {
  // Get mock campground data for Arizona
  const arizonaData = mockCampgroundData.arizona;

  const locations = [
    {
      name: "Grand Canyon",
      tent: [arizonaData.tent[0]],
      lodging: [],
    },
    {
      name: "Sedona",
      tent: [arizonaData.tent[1]],
      lodging: [],
    },
    {
      name: "Cave Creek",
      tent: [],
      lodging: [arizonaData.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Arizona road trip takes you through some of the most stunning desert landscapes in the American Southwest, from the majestic Grand Canyon to the red rock formations of Sedona to the Sonoran Desert near Phoenix.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 350 miles, which we recommend spreading over 7-10 days to fully enjoy each location.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-3: Grand Canyon National Park</h4>
            <p className="mt-2">
              Begin your journey at the Grand Canyon, one of the world's most spectacular natural wonders. Spend 2-3 days exploring the South Rim, hiking along the rim trails, taking in the breathtaking views, and perhaps venturing a short distance down into the canyon on the Bright Angel or South Kaibab trails.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 4-6: Sedona</h4>
            <p className="mt-2">
              Drive approximately 110 miles south to Sedona (about 2 hours). Spend 2-3 days exploring the stunning red rock formations, hiking the numerous trails, visiting vortex sites, and enjoying the charming town with its art galleries, shops, and restaurants.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 7-9: Cave Creek/Phoenix Area</h4>
            <p className="mt-2">
              Continue your journey about 120 miles south to the Cave Creek area near Phoenix (approximately 2 hours). Spend 2-3 days exploring the Sonoran Desert, hiking in the nearby mountains, visiting Desert Botanical Garden, and enjoying the amenities of the greater Phoenix area.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best time to visit Arizona is from October to April when temperatures are more moderate. Summer months can be extremely hot, especially in the Phoenix area.</li>
          <li>Make campground reservations well in advance, especially for the Grand Canyon which can book up months ahead.</li>
          <li>Carry plenty of water and sun protection, even in cooler months, as the desert climate is very dry.</li>
          <li>Be aware of flash flood dangers if hiking in slot canyons or washes, especially during monsoon season (July-September).</li>
          <li>Respect wildlife and be cautious of snakes, scorpions, and other desert creatures.</li>
          <li>Consider visiting the Grand Canyon at sunrise or sunset for the most spectacular views and photography opportunities.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Grand Canyon</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Rim Trail Hike</h4>
            <p className="text-muted-foreground mt-1">
              Walk along the paved trail that follows the canyon rim, offering spectacular views and numerous photo opportunities. The trail is accessible and suitable for all fitness levels.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Bright Angel Trail</h4>
            <p className="text-muted-foreground mt-1">
              For a more adventurous experience, hike partway down this well-maintained trail into the canyon. Remember that hiking down is optional, but hiking back up is mandatory!
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Desert View Drive</h4>
            <p className="text-muted-foreground mt-1">
              Take this scenic 25-mile drive along the canyon rim, stopping at various viewpoints including Desert View Watchtower for panoramic views.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Ranger Programs</h4>
            <p className="text-muted-foreground mt-1">
              Attend free ranger-led talks and walks to learn about the canyon's geology, wildlife, and human history.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Sedona</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Red Rock Hiking</h4>
            <p className="text-muted-foreground mt-1">
              Explore the numerous trails around Sedona, such as Cathedral Rock, Bell Rock, and Devil's Bridge, offering stunning views of the famous red rock formations.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Jeep Tours</h4>
            <p className="text-muted-foreground mt-1">
              Take a guided jeep tour to access remote areas and learn about the geology, flora, and fauna of the region.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Vortex Sites</h4>
            <p className="text-muted-foreground mt-1">
              Visit Sedona's famous energy vortexes, believed to be centers of energy conducive to healing, meditation, and self-exploration.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Tlaquepaque Arts & Shopping Village</h4>
            <p className="text-muted-foreground mt-1">
              Explore this charming outdoor shopping area designed to resemble a traditional Mexican village, featuring art galleries, shops, and restaurants.
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Cave Creek/Phoenix Area</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Desert Botanical Garden</h4>
            <p className="text-muted-foreground mt-1">
              Explore this 140-acre garden featuring thousands of species of cacti, trees, and flowers from desert environments around the world.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Cave Creek Regional Park</h4>
            <p className="text-muted-foreground mt-1">
              Hike the trails in this 2,922-acre park that showcases the beauty of the Sonoran Desert, with opportunities to see wildlife and desert plants.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Horseback Riding</h4>
            <p className="text-muted-foreground mt-1">
              Take a guided horseback ride through the desert landscape, a traditional way to experience the American Southwest.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Old Town Scottsdale</h4>
            <p className="text-muted-foreground mt-1">
              Visit this historic area featuring art galleries, Western-wear shops, restaurants, and the Scottsdale Museum of Contemporary Art.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Arizona Desert Adventure"
      description="Experience the breathtaking landscapes of Arizona, from the majestic Grand Canyon to the red rocks of Sedona to the Sonoran Desert."
      heroImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
    />
  );
} 