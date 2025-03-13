import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Utah's Mighty Five | Caravan Trip Plan",
  description: "Embark on an epic journey through Utah's five stunning national parks, featuring otherworldly rock formations and breathtaking vistas on this unforgettable camping adventure.",
};

export default function UtahNationalParksPage() {
  // Get mock campground data for Utah National Parks
  const utahData = mockCampgroundData["utah-national-parks"];

  const locations = [
    {
      name: "Zion",
      tent: [utahData.tent[0]],
      lodging: [],
    },
    {
      name: "Bryce Canyon",
      tent: [utahData.tent[1]],
      lodging: [],
    },
    {
      name: "Arches",
      tent: [],
      lodging: [utahData.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This epic road trip takes you through Utah's "Mighty Five" National Parks: Zion, Bryce Canyon, Capitol Reef, Canyonlands, and Arches. Each park offers its own unique landscapes, from towering sandstone cliffs to delicate stone arches.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 375 miles (not including side trips), which we recommend spreading over 10-14 days to fully enjoy each park and the scenic drives between them.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-3: Zion National Park</h4>
            <p className="mt-2">
              Begin your journey at Zion National Park. Spend 3 days exploring the park's dramatic canyons, emerald pools, and iconic hikes like Angels Landing and The Narrows. Stay in Springdale for easy park access.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 4-5: Bryce Canyon National Park</h4>
            <p className="mt-2">
              Drive approximately 75 miles northeast to Bryce Canyon (about 1.5 hours). Spend 2 days exploring the park's famous hoodoos, hiking the Navajo Loop and Queen's Garden trails, and experiencing the spectacular night skies.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 6-7: Capitol Reef National Park</h4>
            <p className="mt-2">
              Continue about 120 miles east to Capitol Reef National Park (approximately 2.5 hours). Spend 2 days exploring the Waterpocket Fold, hiking to Hickman Bridge, and driving the scenic Capitol Reef Scenic Drive.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 8-10: Canyonlands National Park</h4>
            <p className="mt-2">
              Drive approximately 140 miles southeast to Canyonlands National Park (about 3 hours). Spend 3 days exploring the park's three districts: Island in the Sky, The Needles, and The Maze. Don't miss Mesa Arch at sunrise and the Grand View Point Overlook.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 11-14: Arches National Park</h4>
            <p className="mt-2">
              Finish your journey at Arches National Park, just 30 minutes from Canyonlands. Spend your final 3-4 days exploring the park's 2,000+ natural stone arches, including Delicate Arch, Landscape Arch, and the Windows Section. Stay in Moab, which offers excellent dining and adventure options.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best times to visit Utah's national parks are spring (April-May) and fall (September-October) when temperatures are moderate.</li>
          <li>Summer (June-August) brings hot temperatures, especially in the lower elevations - carry plenty of water and avoid hiking during midday heat.</li>
          <li>Winter offers a unique experience with fewer crowds, but some roads and facilities may be closed due to snow.</li>
          <li>Book campgrounds and accommodations well in advance, especially during peak season.</li>
          <li>Consider purchasing an America the Beautiful Pass ($80) for entry to all national parks.</li>
          <li>Cell service is limited in many areas - download maps and information before your trip.</li>
          <li>Flash floods can occur in slot canyons - always check weather forecasts before hiking in narrow canyons.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Zion National Park</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">The Narrows</h4>
            <p className="text-muted-foreground mt-1">
              Wade through the Virgin River as it flows through a spectacular slot canyon with walls up to 1,000 feet tall. Rent water shoes and a walking stick for the best experience.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Angels Landing</h4>
            <p className="text-muted-foreground mt-1">
              Take on this challenging trail with chain-assisted sections that lead to breathtaking views of Zion Canyon. Note that this hike now requires a permit.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Emerald Pools</h4>
            <p className="text-muted-foreground mt-1">
              Hike to a series of pools and waterfalls on this family-friendly trail that offers beautiful views of the canyon.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Zion Canyon Scenic Drive</h4>
            <p className="text-muted-foreground mt-1">
              Take the park shuttle along this road that follows the canyon floor, with stops at major trailheads and viewpoints.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Bryce Canyon National Park</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Navajo Loop and Queen's Garden Trail</h4>
            <p className="text-muted-foreground mt-1">
              This popular combination trail takes you down among the hoodoos and through the heart of the amphitheater. The 3-mile loop offers some of the best views in the park.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Sunrise at Bryce Point</h4>
            <p className="text-muted-foreground mt-1">
              Watch the first light illuminate the hoodoos, creating a stunning display of color and shadow. This is one of the most magical experiences in the park.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Scenic Drive</h4>
            <p className="text-muted-foreground mt-1">
              Drive the 18-mile scenic road with 13 viewpoints overlooking the amphitheaters and hoodoos. Rainbow Point at the end offers views of the entire park.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Stargazing</h4>
            <p className="text-muted-foreground mt-1">
              Experience some of the darkest night skies in the country. The park offers ranger-led astronomy programs during summer months.
            </p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Arches National Park</h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Delicate Arch</h4>
            <p className="text-muted-foreground mt-1">
              Hike the 3-mile round trip trail to Utah's most famous arch, especially beautiful at sunset when the sandstone glows red and orange.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Windows Section</h4>
            <p className="text-muted-foreground mt-1">
              Explore a high concentration of large arches in this easily accessible area, including North and South Windows and Turret Arch.
            </p>
          </li>
          <li className="border-b pb-4">
            <h4 className="font-medium text-primary">Landscape Arch</h4>
            <p className="text-muted-foreground mt-1">
              See one of the longest natural stone arches in the world (306 feet) on this easy 1.6-mile round trip hike in the Devils Garden area.
            </p>
          </li>
          <li>
            <h4 className="font-medium text-primary">Fiery Furnace</h4>
            <p className="text-muted-foreground mt-1">
              Join a ranger-led tour through this labyrinth of narrow sandstone canyons and fins. Advance reservations required.
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
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Springdale (Zion)</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Bit & Spur Restaurant & Saloon</h4>
              <p className="text-sm text-muted-foreground">1212 Zion Park Blvd, Springdale</p>
              <p className="text-sm text-muted-foreground">$$ • Southwestern</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Local favorite serving Southwestern cuisine and craft beers in a rustic setting. Their fish tacos and margaritas are especially popular after a day of hiking.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">MeMe's Cafe</h4>
              <p className="text-sm text-muted-foreground">975 Zion Park Blvd, Springdale</p>
              <p className="text-sm text-muted-foreground">$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Charming cafe serving hearty breakfasts and lunches with homemade breads and pastries. Perfect for fueling up before a day in the park.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Zion Pizza & Noodle Co.</h4>
              <p className="text-sm text-muted-foreground">868 Zion Park Blvd, Springdale</p>
              <p className="text-sm text-muted-foreground">$$ • Pizza</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Casual spot for wood-fired pizzas and pasta dishes. Their outdoor patio offers beautiful views of the surrounding red rock cliffs.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Bryce Canyon Area</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Stone Hearth Grille</h4>
              <p className="text-sm text-muted-foreground">1380 S State St, Tropic</p>
              <p className="text-sm text-muted-foreground">$$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Upscale dining with a seasonal menu featuring locally-sourced ingredients. Enjoy dinner on their patio with panoramic views of the surrounding landscape.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">IDK Barbecue</h4>
              <p className="text-sm text-muted-foreground">10 N 100 E, Tropic</p>
              <p className="text-sm text-muted-foreground">$$ • Barbecue</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Casual spot serving smoked meats and classic barbecue sides. Their brisket and pulled pork are local favorites.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Bryce Canyon Pines Restaurant</h4>
              <p className="text-sm text-muted-foreground">Highway 12, Mile Marker 10, Bryce</p>
              <p className="text-sm text-muted-foreground">$$ • American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Classic roadside diner serving hearty American fare. Known for their homemade pies, especially the boysenberry.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Moab (Arches)</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Desert Bistro</h4>
              <p className="text-sm text-muted-foreground">36 S 100 W, Moab</p>
              <p className="text-sm text-muted-foreground">$$$$ • Fine Dining</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Upscale restaurant in a historic building serving creative Southwestern cuisine with global influences. Reservations recommended.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Moab Brewery</h4>
              <p className="text-sm text-muted-foreground">686 S Main St, Moab</p>
              <p className="text-sm text-muted-foreground">$$ • Brewpub</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Popular brewpub offering craft beers and pub fare in a casual atmosphere. Their Dead Horse Amber Ale and Porcupine Pilsner are local favorites.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Quesadilla Mobilla</h4>
              <p className="text-sm text-muted-foreground">95 N Main St, Moab</p>
              <p className="text-sm text-muted-foreground">$ • Mexican</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Popular food truck serving creative quesadillas with fresh ingredients. Perfect for a quick, affordable meal between adventures.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Utah's Mighty Five"
      description="Embark on an epic journey through Utah's five stunning national parks, featuring otherworldly rock formations and breathtaking vistas."
      heroImage="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
      restaurants={restaurants}
    />
  );
} 