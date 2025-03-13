import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Colorado Rockies Expedition | Caravan Trip Plan",
  description: "Discover the majestic beauty of the Colorado Rockies with alpine lakes, towering peaks, and abundant wildlife on this unforgettable camping journey.",
};

export default function ColoradoRockiesPage() {
  // Get mock campground data for Colorado Rockies
  const coloradoData = mockCampgroundData["colorado-rockies"];

  const locations = [
    {
      name: "Rocky Mountain National Park",
      tent: [coloradoData.tent[0]],
      lodging: [],
    },
    {
      name: "Aspen",
      tent: [coloradoData.tent[1]],
      lodging: [],
    },
    {
      name: "Telluride",
      tent: [],
      lodging: [coloradoData.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Colorado Rockies expedition takes you through some of the most breathtaking mountain landscapes in North America, from the iconic Rocky Mountain National Park to the charming mountain towns of Aspen and Telluride.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 350 miles, which we recommend spreading over 10-14 days to fully enjoy each location and the scenic drives between them.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-4: Rocky Mountain National Park</h4>
            <p className="mt-2">
              Begin your journey in Estes Park, the eastern gateway to Rocky Mountain National Park. Spend 3-4 days exploring the park's alpine lakes, meadows, and mountain peaks. Drive the famous Trail Ridge Road, which reaches over 12,000 feet in elevation and offers spectacular views.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 5-8: Aspen</h4>
            <p className="mt-2">
              Drive approximately 150 miles southwest to Aspen (about 3.5 hours). Spend 3-4 days enjoying this world-famous mountain town, hiking the Maroon Bells, exploring Independence Pass, and experiencing the vibrant downtown area.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 9-14: Telluride</h4>
            <p className="mt-2">
              Continue about 200 miles southwest to Telluride (approximately 4 hours). Spend your final 4-5 days in this stunning box canyon town, hiking to Bridal Veil Falls, riding the free gondola, and exploring the surrounding San Juan Mountains.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best time to visit the Colorado Rockies is from late June to early September when mountain passes are clear of snow and wildflowers are in bloom.</li>
          <li>Be prepared for afternoon thunderstorms in summer months - plan to be below treeline by early afternoon.</li>
          <li>Altitude sickness can affect visitors - stay hydrated, avoid alcohol for the first day, and take it easy until you acclimate.</li>
          <li>Wildlife is abundant - keep a safe distance and never feed wild animals.</li>
          <li>Book accommodations well in advance, especially for summer months and fall foliage season.</li>
          <li>Weather can change rapidly in the mountains - pack layers and rain gear regardless of the forecast.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Rocky Mountain National Park</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Trail Ridge Road</h4>
            <p className="text-muted-foreground mt-1">
              Drive this spectacular 48-mile road that crosses the Continental Divide and reaches an elevation of 12,183 feet. Stop at overlooks for breathtaking views and wildlife spotting.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Bear Lake Loop</h4>
            <p className="text-muted-foreground mt-1">
              An easy 0.6-mile trail that circles a beautiful subalpine lake with views of Hallett Peak and Flattop Mountain. Perfect for families and those adjusting to the altitude.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Alberta Falls Hike</h4>
            <p className="text-muted-foreground mt-1">
              A moderate 1.6-mile round trip hike to a scenic 30-foot waterfall that cascades down Glacier Creek.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Wildlife Viewing</h4>
            <p className="text-muted-foreground mt-1">
              Look for elk, moose, bighorn sheep, and marmots throughout the park. Elk are especially common in Moraine Park and Horseshoe Park.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Aspen</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Maroon Bells</h4>
            <p className="text-muted-foreground mt-1">
              Visit the most photographed mountains in North America. Take the shuttle from Aspen Highlands to Maroon Lake for the iconic view, then hike the scenic trails around the area.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Independence Pass</h4>
            <p className="text-muted-foreground mt-1">
              Drive this scenic mountain pass that reaches 12,095 feet with numerous pullouts offering spectacular views. The pass is typically open from late May to early November.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Downtown Aspen</h4>
            <p className="text-muted-foreground mt-1">
              Explore the charming downtown area with its Victorian-era buildings, high-end shops, art galleries, and excellent restaurants.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Aspen Mountain Gondola</h4>
            <p className="text-muted-foreground mt-1">
              Ride the Silver Queen Gondola to the top of Aspen Mountain for panoramic views, hiking trails, and dining at the Sundeck Restaurant.
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Telluride</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Free Gondola Ride</h4>
            <p className="text-muted-foreground mt-1">
              Take the free gondola from Telluride to Mountain Village for spectacular views of the box canyon and surrounding mountains.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Bridal Veil Falls</h4>
            <p className="text-muted-foreground mt-1">
              Hike to Colorado's tallest free-falling waterfall at 365 feet. The trail is moderately difficult and offers stunning views of the Telluride Valley.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Bear Creek Falls Trail</h4>
            <p className="text-muted-foreground mt-1">
              A popular 5-mile round trip hike that starts in town and leads to a beautiful 80-foot waterfall cascading through a box canyon.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Historic Downtown</h4>
            <p className="text-muted-foreground mt-1">
              Explore Telluride's National Historic Landmark District with its colorful Victorian buildings, unique shops, and excellent dining options.
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
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Rocky Mountain National Park Area</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Bird & Jim</h4>
              <p className="text-sm text-muted-foreground">915 Moraine Ave, Estes Park</p>
              <p className="text-sm text-muted-foreground">$$$ • Farm-to-table</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Upscale restaurant featuring locally-sourced ingredients and stunning views of the mountains. Perfect for a special dinner after a day of hiking.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Nepal's Cafe</h4>
              <p className="text-sm text-muted-foreground">184 E Elkhorn Ave, Estes Park</p>
              <p className="text-sm text-muted-foreground">$$ • Nepalese/Indian</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Authentic Nepalese and Indian cuisine in downtown Estes Park. The perfect warming meal after a day in the mountains.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Rock Inn Mountain Tavern</h4>
              <p className="text-sm text-muted-foreground">1675 CO-66, Estes Park</p>
              <p className="text-sm text-muted-foreground">$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Historic tavern with rustic mountain ambiance, comfort food, and live music on weekends. A local favorite since 1937.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Aspen</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">White House Tavern</h4>
              <p className="text-sm text-muted-foreground">302 E Hopkins Ave, Aspen</p>
              <p className="text-sm text-muted-foreground">$$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Cozy tavern in a historic building serving upscale comfort food. Known for their famous chicken sandwich and intimate atmosphere.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Meat & Cheese</h4>
              <p className="text-sm text-muted-foreground">319 E Hopkins Ave, Aspen</p>
              <p className="text-sm text-muted-foreground">$$$ • Farm-to-table</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Part restaurant, part farm shop offering seasonal dishes made with locally-sourced ingredients. Their charcuterie boards are exceptional.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Big Wrap</h4>
              <p className="text-sm text-muted-foreground">520 E Durant Ave, Aspen</p>
              <p className="text-sm text-muted-foreground">$ • Wraps</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Local favorite for quick, affordable meals. Perfect for grabbing lunch to take on a hike or picnic.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Telluride</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Cosmopolitan</h4>
              <p className="text-sm text-muted-foreground">300 W San Juan Ave, Telluride</p>
              <p className="text-sm text-muted-foreground">$$$$ • Contemporary American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Upscale restaurant at the base of the gondola serving innovative dishes with global influences. Their seafood and steaks are outstanding.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Brown Dog Pizza</h4>
              <p className="text-sm text-muted-foreground">110 E Colorado Ave, Telluride</p>
              <p className="text-sm text-muted-foreground">$$ • Pizza</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Award-winning pizza in a casual, family-friendly atmosphere. Their Detroit-style pizza has won international competitions.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Butcher & Baker Cafe</h4>
              <p className="text-sm text-muted-foreground">217 E Colorado Ave, Telluride</p>
              <p className="text-sm text-muted-foreground">$$ • Cafe</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Charming cafe serving breakfast and lunch with house-made pastries, sandwiches, and salads using locally-sourced ingredients.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Colorado Rockies Expedition"
      description="Discover the majestic beauty of the Colorado Rockies with alpine lakes, towering peaks, and abundant wildlife."
      heroImage="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
      restaurants={restaurants}
    />
  );
} 