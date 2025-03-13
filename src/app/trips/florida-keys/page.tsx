import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Florida Keys Adventure | Caravan Trip Plan",
  description: "Journey through the tropical paradise of the Florida Keys, with crystal-clear waters, vibrant coral reefs, and laid-back island vibes on this unforgettable camping adventure.",
};

export default function FloridaKeysPage() {
  // Get mock campground data for Florida Keys
  const floridaData = mockCampgroundData["florida-keys"];

  const locations = [
    {
      name: "Key Largo",
      tent: [floridaData.tent[0]],
      lodging: [],
    },
    {
      name: "Marathon",
      tent: [floridaData.tent[1]],
      lodging: [],
    },
    {
      name: "Key West",
      tent: [],
      lodging: [floridaData.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Florida Keys Adventure takes you along the iconic Overseas Highway (US-1) from Key Largo to Key West, spanning 113 miles across 42 bridges that connect the islands of the Florida Keys.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 110 miles one-way, which we recommend spreading over 7-10 days to fully enjoy each key and the many water activities available along the way.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-3: Key Largo</h4>
            <p className="mt-2">
              Begin your journey in Key Largo, the northernmost and largest of the Florida Keys. Spend 2-3 days exploring John Pennekamp Coral Reef State Park, the first underwater park in the U.S., and enjoying the area's excellent snorkeling and diving opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 4-6: Marathon</h4>
            <p className="mt-2">
              Drive approximately 50 miles southwest to Marathon (about 1 hour). Spend 2-3 days exploring this family-friendly area in the Middle Keys, visiting the Turtle Hospital, enjoying water activities at Sombrero Beach, and experiencing the unique Dolphin Research Center.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 7-10: Key West</h4>
            <p className="mt-2">
              Continue about 50 miles southwest to Key West (approximately 1 hour), crossing the famous Seven Mile Bridge along the way. Spend your final 3-4 days exploring this colorful island city with its rich history, vibrant nightlife, and beautiful sunsets at Mallory Square.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best time to visit the Florida Keys is from November to May when temperatures are pleasant and humidity is lower.</li>
          <li>Summer months (June-September) are hot and humid with occasional afternoon thunderstorms.</li>
          <li>Hurricane season runs from June to November - check weather forecasts if traveling during this time.</li>
          <li>Traffic on the Overseas Highway can be heavy, especially on weekends and holidays - plan accordingly.</li>
          <li>Accommodations in the Keys are limited and can be expensive - book well in advance, especially during high season (December-April).</li>
          <li>Bring reef-safe sunscreen to protect both your skin and the fragile coral reef ecosystem.</li>
          <li>No-see-ums (tiny biting insects) can be present, especially at dawn and dusk - bring insect repellent.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Key Largo</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">John Pennekamp Coral Reef State Park</h4>
            <p className="text-muted-foreground mt-1">
              Explore America's first underwater park with glass-bottom boat tours, snorkeling, or scuba diving to see the vibrant coral reefs and marine life.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Dagny Johnson Key Largo Hammock Botanical State Park</h4>
            <p className="text-muted-foreground mt-1">
              Hike through one of the largest tracts of West Indian tropical hardwood hammock in the United States, home to 84 protected species of plants and animals.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">African Queen Canal Cruise</h4>
            <p className="text-muted-foreground mt-1">
              Take a ride on the original steamboat from the classic 1951 Humphrey Bogart and Katharine Hepburn film "The African Queen."
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Kayaking in the Mangroves</h4>
            <p className="text-muted-foreground mt-1">
              Paddle through the peaceful mangrove forests that line the shores of Key Largo, observing birds, fish, and other wildlife in their natural habitat.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Marathon</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">The Turtle Hospital</h4>
            <p className="text-muted-foreground mt-1">
              Visit this working turtle rehabilitation facility that rescues, rehabilitates, and releases injured sea turtles. Educational tours are offered daily.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Sombrero Beach</h4>
            <p className="text-muted-foreground mt-1">
              Relax at one of the Keys' best public beaches, with soft white sand, clear waters, and excellent facilities including picnic areas and volleyball courts.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Dolphin Research Center</h4>
            <p className="text-muted-foreground mt-1">
              Interact with and learn about dolphins and sea lions at this not-for-profit research and education facility.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Seven Mile Bridge</h4>
            <p className="text-muted-foreground mt-1">
              Walk, bike, or fish on the original Seven Mile Bridge, which runs parallel to the new bridge and offers spectacular views of the surrounding waters.
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Key West</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Duval Street</h4>
            <p className="text-muted-foreground mt-1">
              Explore this famous mile-long street running from the Atlantic Ocean to the Gulf of Mexico, lined with restaurants, bars, shops, and historic buildings.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Sunset at Mallory Square</h4>
            <p className="text-muted-foreground mt-1">
              Join the nightly sunset celebration at Mallory Square, where street performers, artists, and food vendors create a festive atmosphere as the sun dips below the horizon.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Ernest Hemingway Home and Museum</h4>
            <p className="text-muted-foreground mt-1">
              Tour the Spanish Colonial-style house where Ernest Hemingway lived and wrote for more than 10 years, now home to about 60 polydactyl (six-toed) cats.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Dry Tortugas National Park</h4>
            <p className="text-muted-foreground mt-1">
              Take a day trip by ferry or seaplane to this remote national park, home to historic Fort Jefferson and some of the best snorkeling in the Keys.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Key West Butterfly and Nature Conservatory</h4>
            <p className="text-muted-foreground mt-1">
              Walk through a glass-enclosed habitat filled with hundreds of live butterflies, exotic birds, and lush tropical plants.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );

  // Restaurants content
  const restaurants = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Where to Eat</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Key Largo</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Mrs. Mac's Kitchen</h4>
              <p className="text-sm text-muted-foreground">99336 Overseas Hwy, Key Largo</p>
              <p className="text-sm text-muted-foreground">$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Local institution serving Keys-style comfort food since 1976. Known for their homemade Key lime pie and conch fritters.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">The Fish House</h4>
              <p className="text-sm text-muted-foreground">102401 Overseas Hwy, Key Largo</p>
              <p className="text-sm text-muted-foreground">$$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Fresh seafood restaurant specializing in Matecumbe-style fish (topped with fresh tomatoes, shallots, capers, basil, and olive oil) and a casual Keys atmosphere.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Sundowners</h4>
              <p className="text-sm text-muted-foreground">103900 Overseas Hwy, Key Largo</p>
              <p className="text-sm text-muted-foreground">$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Waterfront restaurant offering spectacular sunset views over Florida Bay. Enjoy fresh seafood and tropical drinks on their outdoor deck.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Marathon</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Keys Fisheries Market & Marina</h4>
              <p className="text-sm text-muted-foreground">3502 Gulfview Ave, Marathon</p>
              <p className="text-sm text-muted-foreground">$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Casual waterfront spot where you order at the counter and pick up when your name is called. Famous for their lobster Reuben sandwich and fresh stone crab claws (in season).
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Burdines Waterfront</h4>
              <p className="text-sm text-muted-foreground">1200 Oceanview Ave, Marathon</p>
              <p className="text-sm text-muted-foreground">$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Casual marina restaurant with an upper deck offering great views. Known for their fish sandwiches, cheeseburgers, and famous "Burdines sauce."
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Castaway Waterfront Restaurant</h4>
              <p className="text-sm text-muted-foreground">1406 Oceanview Ave, Marathon</p>
              <p className="text-sm text-muted-foreground">$$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Waterfront restaurant with its own commercial fishing boats, ensuring the freshest seafood possible. Try their lionfish, a delicious invasive species that local fishermen are helping to control.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Key West</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Blue Heaven</h4>
              <p className="text-sm text-muted-foreground">729 Thomas St, Key West</p>
              <p className="text-sm text-muted-foreground">$$$ • Caribbean</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Quirky restaurant in Bahama Village known for its outdoor seating with roaming chickens, live music, and excellent breakfast and brunch. Their Key lime pie with mile-high meringue is legendary.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Eaton Street Seafood Market</h4>
              <p className="text-sm text-muted-foreground">801 Eaton St, Key West</p>
              <p className="text-sm text-muted-foreground">$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Fresh seafood market with a small outdoor seating area. Their lobster roll and conch ceviche are local favorites.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Santiago's Bodega</h4>
              <p className="text-sm text-muted-foreground">207 Petronia St, Key West</p>
              <p className="text-sm text-muted-foreground">$$$ • Tapas</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Popular tapas restaurant with a charming atmosphere. Their small plates are perfect for sharing, and the sangria is a must-try.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Florida Keys Adventure"
      description="Journey through the tropical paradise of the Florida Keys, with crystal-clear waters, vibrant coral reefs, and laid-back island vibes."
      heroImage="https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
      restaurants={restaurants}
    />
  );
} 