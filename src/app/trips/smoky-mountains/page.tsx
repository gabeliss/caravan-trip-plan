import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Smoky Mountains Camping Trip | Caravan Trip Plan",
  description: "Explore the best campgrounds in the Great Smoky Mountains with our personally vetted recommendations for Maggie Valley, Cades Cove, and Pigeon Forge.",
};

export default function SmokyMountainsPage() {
  // Get mock campground data for Smoky Mountains
  const smokyMountainsData = mockCampgroundData["smoky-mountains"];

  const locations = [
    {
      name: "Maggie Valley",
      tent: [smokyMountainsData.tent[0]],
      lodging: [],
    },
    {
      name: "Cades Cove",
      tent: [smokyMountainsData.tent[1]],
      lodging: [],
    },
    {
      name: "Pigeon Forge",
      tent: [],
      lodging: [smokyMountainsData.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Great Smoky Mountains road trip takes you through the most scenic areas of America's most visited national park and its charming gateway towns. Experience the misty mountains, lush forests, abundant wildlife, and rich Appalachian culture.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 150 miles, which we recommend spreading over 7-10 days to fully enjoy each location.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-3: Maggie Valley, NC</h4>
            <p className="mt-2">
              Begin your journey in Maggie Valley, a charming mountain town on the North Carolina side of the Smokies. Spend 2-3 days exploring the area, visiting the Blue Ridge Parkway, Waterrock Knob, and the nearby town of Cherokee with its rich Native American heritage.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 4-6: Cades Cove, TN</h4>
            <p className="mt-2">
              Drive approximately 50 miles to Cades Cove (about 1.5 hours through the mountains). Spend 2-3 days exploring this scenic valley with its historic buildings, abundant wildlife, and beautiful hiking trails. Don't miss the 11-mile Cades Cove Loop Road, which offers some of the best wildlife viewing in the park.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 7-10: Pigeon Forge/Gatlinburg, TN</h4>
            <p className="mt-2">
              Continue your journey about 25 miles to the Pigeon Forge/Gatlinburg area (approximately 1 hour). Spend 3-4 days exploring these popular gateway towns, visiting attractions like Dollywood, and accessing the Tennessee side of Great Smoky Mountains National Park, including Newfound Gap, Clingmans Dome, and the Roaring Fork Motor Nature Trail.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The Great Smoky Mountains can be visited year-round, but spring (wildflowers) and fall (foliage) are especially beautiful.</li>
          <li>Summer is the busiest season; expect crowds and make reservations well in advance.</li>
          <li>Morning and evening are the best times for wildlife viewing, especially in Cades Cove.</li>
          <li>Weather in the mountains can change quickly; bring layers even in summer.</li>
          <li>Cell service is limited within the national park; download maps and information before entering.</li>
          <li>The park is free to enter, unlike most national parks, but some attractions in gateway towns can be expensive.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Maggie Valley Area</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Blue Ridge Parkway</h4>
            <p className="text-muted-foreground mt-1">
              Drive a section of this scenic highway, often called "America's Favorite Drive," with numerous overlooks offering spectacular mountain views.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Waterrock Knob</h4>
            <p className="text-muted-foreground mt-1">
              Hike to this peak at 6,292 feet for panoramic views of the surrounding mountains. The visitor center also offers educational exhibits.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Museum of the Cherokee Indian</h4>
            <p className="text-muted-foreground mt-1">
              Visit this museum in nearby Cherokee to learn about the history and culture of the Eastern Band of Cherokee Indians, the original inhabitants of the Smokies.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Cataloochee Valley</h4>
            <p className="text-muted-foreground mt-1">
              Explore this secluded valley known for its historic buildings and elk herd, reintroduced to the area in 2001.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Cades Cove Area</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Cades Cove Loop Road</h4>
            <p className="text-muted-foreground mt-1">
              Drive or bike this 11-mile one-way loop road through a scenic valley with historic buildings and abundant wildlife, including deer, black bears, and wild turkeys.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Abrams Falls Trail</h4>
            <p className="text-muted-foreground mt-1">
              Hike this moderate 5-mile round-trip trail to a 20-foot waterfall with a deep pool at its base.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Historic Buildings Tour</h4>
            <p className="text-muted-foreground mt-1">
              Explore the preserved log cabins, barns, churches, and grist mill that offer a glimpse into the lives of early European settlers in the area.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Horseback Riding</h4>
            <p className="text-muted-foreground mt-1">
              Take a guided horseback ride through the cove for a unique perspective on this beautiful valley.
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Pigeon Forge/Gatlinburg Area</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Dollywood</h4>
            <p className="text-muted-foreground mt-1">
              Visit this popular theme park owned by Dolly Parton, featuring rides, shows, crafts, and music celebrating the culture of the Smokies.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Clingmans Dome</h4>
            <p className="text-muted-foreground mt-1">
              Drive to the highest point in the Great Smoky Mountains (6,643 feet) and walk the steep half-mile trail to the observation tower for spectacular 360-degree views.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Roaring Fork Motor Nature Trail</h4>
            <p className="text-muted-foreground mt-1">
              Drive this 5.5-mile one-way loop road near Gatlinburg, featuring rushing mountain streams, historic buildings, and lush forest.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Gatlinburg SkyBridge</h4>
            <p className="text-muted-foreground mt-1">
              Walk across North America's longest pedestrian suspension bridge for breathtaking views of the Smokies.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Newfound Gap</h4>
            <p className="text-muted-foreground mt-1">
              Visit this mountain pass at 5,046 feet, which straddles the Tennessee-North Carolina state line and offers spectacular views and access to the Appalachian Trail.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Great Smoky Mountains Adventure"
      description="Discover the misty mountains, lush forests, and rich Appalachian culture of the Great Smoky Mountains National Park and its gateway towns."
      heroImage="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
    />
  );
} 