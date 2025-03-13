import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Maine Coastal Journey | Caravan Trip Plan",
  description: "Experience the rugged beauty of Maine's coastline with its picturesque lighthouses, charming fishing villages, and pristine beaches on this unforgettable camping journey.",
};

export default function MaineCoastlinePage() {
  // Get mock campground data for Maine Coastline
  const maineData = mockCampgroundData["maine-coastline"];

  const locations = [
    {
      name: "Acadia National Park",
      tent: [maineData.tent[0]],
      lodging: [],
    },
    {
      name: "Portland",
      tent: [maineData.tent[1]],
      lodging: [],
    },
    {
      name: "Camden",
      tent: [],
      lodging: [maineData.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Maine Coastal Journey takes you along the stunning Atlantic coastline, from the vibrant city of Portland to the charming town of Camden and the rugged beauty of Acadia National Park.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 175 miles, which we recommend spreading over 7-10 days to fully enjoy each location and the scenic coastal drives between them.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-3: Portland</h4>
            <p className="mt-2">
              Begin your journey in Portland, Maine's largest city. Spend 2-3 days exploring the historic Old Port district, sampling the renowned food scene, and visiting nearby lighthouses. Take a ferry to the nearby Calendar Islands for a day trip.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 4-5: Camden</h4>
            <p className="mt-2">
              Drive approximately 80 miles northeast along Route 1 to Camden (about 2 hours). Spend 2 days enjoying this picturesque harbor town, hiking in Camden Hills State Park, and sailing on Penobscot Bay.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 6-10: Acadia National Park</h4>
            <p className="mt-2">
              Continue about 75 miles northeast to Mount Desert Island and Acadia National Park (approximately 2 hours). Spend your final 4-5 days exploring the park's scenic loop road, hiking trails, carriage roads, and the charming town of Bar Harbor.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best time to visit coastal Maine is from late June to early October when the weather is most pleasant.</li>
          <li>July and August are peak tourist season - expect crowds and book accommodations well in advance.</li>
          <li>September and early October offer fewer crowds and beautiful fall foliage.</li>
          <li>Fog is common along the coast, especially in the morning - be flexible with your outdoor activities.</li>
          <li>Bring layers as coastal temperatures can be cool even in summer, especially in the evenings.</li>
          <li>Maine's seafood is world-famous - don't miss trying fresh lobster, clams, and blueberry pie.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Portland</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Old Port District</h4>
            <p className="text-muted-foreground mt-1">
              Explore the cobblestone streets of this historic waterfront district with its boutique shops, art galleries, and excellent restaurants.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Portland Head Light</h4>
            <p className="text-muted-foreground mt-1">
              Visit Maine's oldest lighthouse, dating back to 1791, located in Fort Williams Park with stunning ocean views and coastal trails.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Casco Bay Islands Ferry</h4>
            <p className="text-muted-foreground mt-1">
              Take a ferry to explore the Calendar Islands of Casco Bay, each with its own unique character and charm.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Portland Museum of Art</h4>
            <p className="text-muted-foreground mt-1">
              Discover an impressive collection of American, European, and contemporary art, including works by Maine artists like Winslow Homer and Andrew Wyeth.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Camden</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Camden Hills State Park</h4>
            <p className="text-muted-foreground mt-1">
              Hike to the top of Mount Battie for panoramic views of Camden Harbor, Penobscot Bay, and the surrounding islands.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Sailing on Penobscot Bay</h4>
            <p className="text-muted-foreground mt-1">
              Take a sailing tour on a historic windjammer or charter a smaller boat to explore the bay and its islands.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Camden Harbor</h4>
            <p className="text-muted-foreground mt-1">
              Stroll along the picturesque harbor, watch the boats come and go, and explore the charming downtown shops and restaurants.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Merryspring Nature Center</h4>
            <p className="text-muted-foreground mt-1">
              Visit this 66-acre park and education center with gardens, nature trails, and wildlife habitats.
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Acadia National Park</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Park Loop Road</h4>
            <p className="text-muted-foreground mt-1">
              Drive this 27-mile scenic road that connects the park's lakes, mountains, forests, and rocky coastline, with numerous pullouts for photos and short hikes.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Cadillac Mountain</h4>
            <p className="text-muted-foreground mt-1">
              Hike or drive to the summit of Cadillac Mountain, the highest point on the eastern seaboard and the first place to see sunrise in the United States from October to March.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Jordan Pond Path</h4>
            <p className="text-muted-foreground mt-1">
              Walk the 3.3-mile loop around this crystal-clear pond with views of the Bubbles mountains. Don't miss popovers at the historic Jordan Pond House.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Carriage Roads</h4>
            <p className="text-muted-foreground mt-1">
              Explore the 45 miles of rustic carriage roads, built by John D. Rockefeller Jr., by foot, bicycle, or horse-drawn carriage.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Thunder Hole</h4>
            <p className="text-muted-foreground mt-1">
              Visit this natural inlet where waves crash into a small cave, creating a thunderous sound and spectacular splash, especially at mid-tide.
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
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Portland</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Eventide Oyster Co.</h4>
              <p className="text-sm text-muted-foreground">86 Middle St, Portland</p>
              <p className="text-sm text-muted-foreground">$$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Award-winning seafood restaurant known for their brown butter lobster roll and extensive raw bar. A must-visit for seafood lovers.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Duckfat</h4>
              <p className="text-sm text-muted-foreground">43 Middle St, Portland</p>
              <p className="text-sm text-muted-foreground">$$ • Sandwiches</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Casual eatery famous for their Belgian-style fries cooked in duck fat, panini sandwiches, and creamy milkshakes.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Holy Donut</h4>
              <p className="text-sm text-muted-foreground">7 Exchange St, Portland</p>
              <p className="text-sm text-muted-foreground">$ • Bakery</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Local favorite serving unique potato-based donuts in creative flavors like maple bacon and dark chocolate sea salt.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Camden</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Long Grain</h4>
              <p className="text-sm text-muted-foreground">31 Elm St, Camden</p>
              <p className="text-sm text-muted-foreground">$$ • Asian</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Acclaimed restaurant serving authentic Thai and Vietnamese cuisine using locally-sourced ingredients. Their noodle dishes are exceptional.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Waterfront Restaurant</h4>
              <p className="text-sm text-muted-foreground">48 Bay View St, Camden</p>
              <p className="text-sm text-muted-foreground">$$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Classic Maine seafood restaurant with stunning harbor views. Enjoy fresh lobster, clams, and other local catches on their deck overlooking the water.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Camden Deli</h4>
              <p className="text-sm text-muted-foreground">37 Main St, Camden</p>
              <p className="text-sm text-muted-foreground">$ • Deli</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Casual spot for sandwiches, soups, and baked goods with a rooftop deck offering harbor views. Perfect for a quick lunch.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Acadia National Park/Bar Harbor</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Jordan Pond House</h4>
              <p className="text-sm text-muted-foreground">2928 Park Loop Rd, Seal Harbor</p>
              <p className="text-sm text-muted-foreground">$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Historic restaurant in Acadia National Park famous for their popovers and tea since the 1890s. Enjoy lunch on the lawn with views of Jordan Pond and the Bubbles.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Thurston's Lobster Pound</h4>
              <p className="text-sm text-muted-foreground">9 Thurston Rd, Bernard</p>
              <p className="text-sm text-muted-foreground">$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Authentic Maine lobster pound on a working harbor where you can select your own lobster from the tank. Enjoy your meal on the deck overlooking the water.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Side Street Cafe</h4>
              <p className="text-sm text-muted-foreground">49 Rodick St, Bar Harbor</p>
              <p className="text-sm text-muted-foreground">$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Local favorite serving comfort food, craft beers, and their famous mac & cheese in a casual, family-friendly atmosphere.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Maine Coastal Journey"
      description="Experience the rugged beauty of Maine's coastline with its picturesque lighthouses, charming fishing villages, and pristine beaches."
      heroImage="https://images.unsplash.com/photo-1529504090624-2c16f5f74aca?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
      restaurants={restaurants}
    />
  );
} 