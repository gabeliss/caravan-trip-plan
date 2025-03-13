import TripLayout from "@/components/TripLayout";
import { getCampgroundsByLocation } from "@/lib/campgrounds";

export const metadata = {
  title: "Northern Michigan Camping Trip | Caravan Trip Plan",
  description: "Explore the best campgrounds in Northern Michigan with our personally vetted recommendations for Traverse City, Mackinac City, and Pictured Rocks.",
};

export default function NorthernMichiganPage() {
  // Get campground data for Northern Michigan
  const traverseCityData = getCampgroundsByLocation("traverseCity");
  const mackinacCityData = getCampgroundsByLocation("mackinacCity");
  const picturedRocksData = getCampgroundsByLocation("picturedRocks");

  const locations = [
    {
      name: "Traverse City",
      tent: traverseCityData.tent,
      lodging: traverseCityData.lodging,
    },
    {
      name: "Mackinac City",
      tent: mackinacCityData.tent,
      lodging: mackinacCityData.lodging,
    },
    {
      name: "Pictured Rocks",
      tent: picturedRocksData.tent,
      lodging: picturedRocksData.lodging,
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Northern Michigan road trip takes you through some of the most beautiful areas of the state, from the charming city of Traverse City to the historic Mackinac City, and finally to the stunning Pictured Rocks National Lakeshore.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 300 miles, which we recommend spreading over 7-10 days to fully enjoy each location.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-3: Traverse City</h4>
            <p className="mt-2">
              Begin your journey in Traverse City, known for its beautiful beaches, wineries, and cherry orchards. Spend 2-3 days exploring the area, visiting the Sleeping Bear Dunes National Lakeshore, and enjoying the local food scene.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 4-6: Mackinac City</h4>
            <p className="mt-2">
              Drive approximately 100 miles north to Mackinac City (about 2 hours). Spend 2-3 days exploring Mackinac Island, the Mackinac Bridge, and historic Fort Michilimackinac.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 7-10: Pictured Rocks</h4>
            <p className="mt-2">
              Continue your journey about 200 miles northwest to Munising (approximately 3 hours). Spend 3-4 days exploring Pictured Rocks National Lakeshore, taking boat tours, hiking the trails, and visiting the numerous waterfalls in the area.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best time to visit Northern Michigan is from June to September when the weather is warm and all attractions are open.</li>
          <li>Make reservations for campgrounds well in advance, especially for summer months.</li>
          <li>If visiting Mackinac Island, remember that no cars are allowed on the island - transportation is by foot, bicycle, or horse-drawn carriage.</li>
          <li>For Pictured Rocks, book boat tours in advance as they often sell out during peak season.</li>
          <li>Pack layers as weather can change quickly, especially near the Great Lakes.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Traverse City</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Sleeping Bear Dunes National Lakeshore</h4>
            <p className="text-muted-foreground mt-1">
              Explore the massive sand dunes, hike the scenic trails, and enjoy breathtaking views of Lake Michigan. Don't miss the Pierce Stocking Scenic Drive and the Dune Climb.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Wine Tasting on Old Mission Peninsula</h4>
            <p className="text-muted-foreground mt-1">
              Visit several award-winning wineries along this scenic peninsula that extends into Grand Traverse Bay.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Downtown Traverse City</h4>
            <p className="text-muted-foreground mt-1">
              Explore the charming downtown area with its boutique shops, restaurants, and the historic State Theatre.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Kayaking on the Boardman River</h4>
            <p className="text-muted-foreground mt-1">
              Rent kayaks and paddle through the heart of Traverse City on this scenic river.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Mackinac City</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Mackinac Island Day Trip</h4>
            <p className="text-muted-foreground mt-1">
              Take a ferry to this car-free island, rent bikes to circle the perimeter, visit historic Fort Mackinac, and sample the famous Mackinac Island fudge.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Mackinac Bridge</h4>
            <p className="text-muted-foreground mt-1">
              Visit Bridge View Park for great photos of the 5-mile suspension bridge connecting Michigan's upper and lower peninsulas.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Colonial Michilimackinac</h4>
            <p className="text-muted-foreground mt-1">
              Explore this reconstructed 18th-century fort and trading post with live demonstrations and exhibits.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Headlands International Dark Sky Park</h4>
            <p className="text-muted-foreground mt-1">
              Located just a few miles west of Mackinaw City, this park offers exceptional stargazing opportunities.
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Pictured Rocks</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Pictured Rocks Boat Tour</h4>
            <p className="text-muted-foreground mt-1">
              Take a boat tour to see the colorful sandstone cliffs, sea caves, and natural rock formations from the water.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Kayaking</h4>
            <p className="text-muted-foreground mt-1">
              For a more intimate experience, kayak along the cliffs with a guided tour.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Hiking Trails</h4>
            <p className="text-muted-foreground mt-1">
              Explore over 100 miles of trails, including the Chapel Loop trail that takes you to Chapel Rock and Chapel Beach.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Waterfall Tours</h4>
            <p className="text-muted-foreground mt-1">
              Visit the numerous waterfalls in the area, including Munising Falls, Miners Falls, and Sable Falls.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Shipwreck Tours</h4>
            <p className="text-muted-foreground mt-1">
              Take a glass-bottom boat tour to view shipwrecks in the clear waters of Lake Superior.
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
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Traverse City</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">The Cook's House</h4>
              <p className="text-sm text-muted-foreground">115 Wellington St, Traverse City</p>
              <p className="text-sm text-muted-foreground">$$$ • Farm-to-table</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A small, intimate restaurant focusing on locally-sourced ingredients with an ever-changing menu based on seasonal availability.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Slabtown Burgers</h4>
              <p className="text-sm text-muted-foreground">826 W Front St, Traverse City</p>
              <p className="text-sm text-muted-foreground">$ • Burgers</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A local favorite serving delicious, no-frills burgers in a casual setting. Great for a quick, satisfying meal.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Amical</h4>
              <p className="text-sm text-muted-foreground">229 E Front St, Traverse City</p>
              <p className="text-sm text-muted-foreground">$$ • European</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A downtown bistro offering European-inspired cuisine with a warm atmosphere and outdoor seating overlooking the bay.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Mackinac City</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Darrow's Family Restaurant</h4>
              <p className="text-sm text-muted-foreground">301 E Central Ave, Mackinaw City</p>
              <p className="text-sm text-muted-foreground">$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A family-friendly restaurant serving hearty breakfasts and classic American comfort food.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Nonna Lisa's Italian Restaurant</h4>
              <p className="text-sm text-muted-foreground">202 E Central Ave, Mackinaw City</p>
              <p className="text-sm text-muted-foreground">$$ • Italian</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Authentic Italian cuisine in a cozy setting, known for their homemade pasta and wood-fired pizzas.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Keyhole Bar & Grill</h4>
              <p className="text-sm text-muted-foreground">323 E Central Ave, Mackinaw City</p>
              <p className="text-sm text-muted-foreground">$$ • Bar & Grill</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A local favorite with a fun atmosphere, serving burgers, sandwiches, and local whitefish.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Pictured Rocks</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Eh! Burger</h4>
              <p className="text-sm text-muted-foreground">209 W Superior St, Munising</p>
              <p className="text-sm text-muted-foreground">$ • Burgers</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A casual spot serving creative, gourmet burgers with locally-sourced ingredients.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Dogpatch Restaurant</h4>
              <p className="text-sm text-muted-foreground">7096 M-28, Munising</p>
              <p className="text-sm text-muted-foreground">$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A local institution serving hearty breakfasts and classic American fare in a rustic setting.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Pictured Rocks Pizza</h4>
              <p className="text-sm text-muted-foreground">121 Elm Ave, Munising</p>
              <p className="text-sm text-muted-foreground">$ • Pizza</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A family-friendly pizzeria offering delicious pies, perfect for a casual dinner after a day of exploring.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Northern Michigan Camping Trip"
      description="Explore the pristine lakes, dense forests, and charming towns of Northern Michigan on this unforgettable camping adventure."
      heroImage="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
      restaurants={restaurants}
    />
  );
} 