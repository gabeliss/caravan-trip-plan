import TripLayout from "@/components/TripLayout";
import { mockCampgroundData } from "@/lib/campgrounds";

export const metadata = {
  title: "Southern California Camping Trip | Caravan Trip Plan",
  description: "Explore the best campgrounds in Southern California with our personally vetted recommendations for Joshua Tree, San Diego, and Palm Springs.",
};

export default function SouthernCaliforniaPage() {
  // Get mock campground data for Southern California
  const socal = mockCampgroundData["southern-california"];

  const locations = [
    {
      name: "Joshua Tree",
      tent: [socal.tent[0]],
      lodging: [],
    },
    {
      name: "San Diego",
      tent: [socal.tent[1]],
      lodging: [],
    },
    {
      name: "Palm Springs",
      tent: [],
      lodging: [socal.lodging[0]],
    },
  ];

  // Route information content
  const routeInfo = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Route</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Overview</h3>
        <p className="mb-4">
          This Southern California road trip takes you through the diverse landscapes of SoCal, from the otherworldly desert of Joshua Tree National Park to the beautiful beaches of San Diego to the mid-century modern oasis of Palm Springs.
        </p>
        <p className="mb-4">
          The total driving distance is approximately 300 miles, which we recommend spreading over 7-10 days to fully enjoy each location.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Itinerary</h3>
        
        <div className="border-l-2 border-primary-light pl-6 space-y-8">
          <div>
            <h4 className="text-lg font-medium text-primary">Days 1-3: Joshua Tree National Park</h4>
            <p className="mt-2">
              Begin your journey in Joshua Tree National Park, exploring the unique desert landscape with its iconic Joshua trees, massive boulder formations, and dark night skies perfect for stargazing. Spend 2-3 days hiking, rock climbing, and photographing the surreal scenery.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 4-6: San Diego</h4>
            <p className="mt-2">
              Drive approximately 150 miles southwest to San Diego (about 3 hours). Spend 2-3 days enjoying the beautiful beaches, visiting attractions like the San Diego Zoo and Balboa Park, and exploring the historic Gaslamp Quarter and Old Town.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-primary">Days 7-10: Palm Springs</h4>
            <p className="mt-2">
              Continue your journey about 140 miles northeast to Palm Springs (approximately 2.5 hours). Spend 3-4 days relaxing in this desert oasis, enjoying the mid-century modern architecture, taking the Palm Springs Aerial Tramway up to Mt. San Jacinto, and perhaps visiting nearby attractions like the Coachella Valley Preserve or taking a day trip to the Salton Sea.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Travel Tips</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The best time to visit Southern California is from October to May when temperatures are more moderate. Summer months can be extremely hot in Joshua Tree and Palm Springs.</li>
          <li>Make campground reservations well in advance, especially for Joshua Tree which can book up months ahead during peak season.</li>
          <li>Carry plenty of water and sun protection, even in cooler months, as the desert climate is very dry.</li>
          <li>San Diego has a mild climate year-round, but the water can be cold for swimming outside of summer months.</li>
          <li>Consider visiting Joshua Tree during a new moon for the best stargazing experience.</li>
          <li>Palm Springs is known for its festivals and events, including Modernism Week in February and the Coachella Music Festival in April, which can affect accommodation availability and prices.</li>
        </ul>
      </div>
    </div>
  );

  // Activities content
  const activities = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Top Activities</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Joshua Tree National Park</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Hiking & Rock Climbing</h4>
            <p className="text-muted-foreground mb-4">
              Explore the park's unique landscape through its many hiking trails ranging from easy nature walks to challenging rock scrambles. Popular trails include Hidden Valley (1 mile loop), Barker Dam (1.3 miles), and Ryan Mountain (3 miles) for panoramic views.
            </p>
            <p className="text-muted-foreground">
              For rock climbing enthusiasts, Joshua Tree is a world-class destination with thousands of climbing routes for all skill levels. Beginners can book guided climbing experiences through local outfitters.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Stargazing</h4>
            <p className="text-muted-foreground mb-4">
              Joshua Tree is designated as an International Dark Sky Park, making it one of the best places in Southern California for stargazing. Join a ranger-led night sky program or simply find a spot away from campground lights to experience the spectacular night sky.
            </p>
            <p className="text-muted-foreground">
              Best spots include Pinto Basin Road and Keys View, which offers a 5,000-foot vantage point.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Cholla Cactus Garden</h4>
            <p className="text-muted-foreground">
              Visit this dense concentration of cholla cacti, especially during sunrise or sunset when the light creates a magical glow through the spines. A short 0.25-mile nature trail winds through the garden, offering close-up views of these unique "teddy bear" cacti (but don't touch—they're also called "jumping cacti" for a reason!).
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Keys Ranch Tour</h4>
            <p className="text-muted-foreground">
              Take a guided tour of this historic homestead to learn about the challenges of desert living in the early 20th century. The 90-minute ranger-led tour offers a fascinating glimpse into pioneer life and the ingenuity required to survive in this harsh environment.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">San Diego</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Beach Activities</h4>
            <p className="text-muted-foreground mb-4">
              San Diego boasts some of California's best beaches. La Jolla Cove offers protected swimming and snorkeling with abundant marine life. Coronado Beach features pristine white sand and the iconic Hotel Del Coronado. Mission Beach has a classic boardwalk atmosphere with shops and restaurants.
            </p>
            <p className="text-muted-foreground">
              Try surfing lessons at Pacific Beach or Oceanside, where gentle waves are perfect for beginners.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Balboa Park</h4>
            <p className="text-muted-foreground">
              Explore this 1,200-acre urban cultural park, home to 17 museums, beautiful gardens, and the world-famous San Diego Zoo. Don't miss the botanical building with its lily pond, the Spanish Village Art Center, and the ornate architecture of the California Building. Many museums offer free admission on rotating Tuesdays for San Diego residents.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Torrey Pines State Natural Reserve</h4>
            <p className="text-muted-foreground">
              Hike through this coastal state park featuring the rare Torrey pine tree, dramatic cliffs, and stunning ocean views. The Beach Trail (1.5 miles) leads down to the shore, while the Razor Point Trail (1.3 miles) offers spectacular views of the eroded sandstone formations. Visit in spring to see wildflowers in bloom.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Old Town San Diego</h4>
            <p className="text-muted-foreground">
              Visit California's birthplace and experience the state's early days through preserved historic buildings, museums, and cultural demonstrations. Enjoy authentic Mexican cuisine at one of the many restaurants, shop for handcrafted items, and perhaps catch a live performance. Don't miss the haunted Whaley House if you're interested in the paranormal.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Palm Springs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Palm Springs Aerial Tramway</h4>
            <p className="text-muted-foreground">
              Take the world's largest rotating tramcar up the sheer cliffs of Chino Canyon to Mt. San Jacinto State Park. In just 10 minutes, you'll ascend from the desert floor to an alpine forest at 8,516 feet, where temperatures are typically 30-40 degrees cooler. Enjoy hiking trails, restaurant dining, and spectacular views of the Coachella Valley.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Mid-Century Modern Architecture Tours</h4>
            <p className="text-muted-foreground">
              Palm Springs is renowned for its mid-century modern architecture. Take a self-guided tour of iconic homes and buildings designed by architects like Richard Neutra, Albert Frey, and Donald Wexler. The Palm Springs Visitors Center (itself a former gas station designed by Albert Frey) offers maps and information. For a deeper dive, book a guided tour with knowledgeable local experts.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Indian Canyons</h4>
            <p className="text-muted-foreground">
              Explore these ancestral homes of the Agua Caliente Band of Cahuilla Indians, featuring stunning palm oases, rock art, ancient irrigation systems, and native plants. Palm Canyon offers a 15-mile network of hiking trails, while Andreas Canyon and Murray Canyon provide shorter options with abundant wildlife viewing opportunities. The visitor center provides cultural and historical context.
            </p>
          </div>
          
          <div className="bg-background rounded-lg shadow-md p-6 border border-border">
            <h4 className="font-medium text-lg text-primary mb-2">Joshua Tree Day Trip</h4>
            <p className="text-muted-foreground">
              If you're not camping in Joshua Tree as part of your itinerary, consider a day trip from Palm Springs (about an hour's drive). Focus on the park's southern entrance for a different perspective than the northern sections. Visit the Cottonwood Spring Oasis, hike to Lost Palms Oasis (7.2 miles round trip), or take the short Mastodon Peak loop (3 miles) for panoramic desert views.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Restaurants content
  const restaurants = (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Where to Eat</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Joshua Tree Area</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Pappy & Harriet's</h4>
              <p className="text-sm text-muted-foreground">53688 Pioneertown Rd, Pioneertown</p>
              <p className="text-sm text-muted-foreground">$$ • BBQ, Live Music</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A legendary desert institution in nearby Pioneertown offering BBQ, burgers, and live music in a rustic setting. Often features notable musicians.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Joshua Tree Coffee Company</h4>
              <p className="text-sm text-muted-foreground">61738 Twentynine Palms Hwy, Joshua Tree</p>
              <p className="text-sm text-muted-foreground">$ • Coffee, Light Fare</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Excellent organic, small-batch coffee roasted on-site. Perfect for a morning pick-me-up before heading into the park.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">La Copine</h4>
              <p className="text-sm text-muted-foreground">848 Old Woman Springs Rd, Yucca Valley</p>
              <p className="text-sm text-muted-foreground">$$$ • New American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A culinary oasis in the desert offering sophisticated, seasonal cuisine. Worth the drive for a special meal.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">San Diego</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Oscar's Mexican Seafood</h4>
              <p className="text-sm text-muted-foreground">Multiple locations</p>
              <p className="text-sm text-muted-foreground">$ • Mexican Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                A local favorite for fish tacos, ceviche, and other Mexican seafood specialties. Casual and affordable.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">The Cottage</h4>
              <p className="text-sm text-muted-foreground">7702 Fay Ave, La Jolla</p>
              <p className="text-sm text-muted-foreground">$$ • Breakfast, Brunch</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Charming breakfast spot in La Jolla known for its lemon ricotta pancakes and outdoor patio. Perfect for a leisurely morning meal.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Ironside Fish & Oyster</h4>
              <p className="text-sm text-muted-foreground">1654 India St, Little Italy</p>
              <p className="text-sm text-muted-foreground">$$$ • Seafood</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Stylish seafood restaurant in Little Italy offering fresh oysters, creative cocktails, and an impressive raw bar in a beautiful space.
              </p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Palm Springs</h3>
        <ul className="space-y-6">
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Cheeky's</h4>
              <p className="text-sm text-muted-foreground">622 N Palm Canyon Dr, Palm Springs</p>
              <p className="text-sm text-muted-foreground">$$ • Breakfast, Brunch</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Popular breakfast spot known for its rotating menu of creative dishes and famous bacon flight. Expect a wait on weekends.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Workshop Kitchen + Bar</h4>
              <p className="text-sm text-muted-foreground">800 N Palm Canyon Dr, Palm Springs</p>
              <p className="text-sm text-muted-foreground">$$$ • New American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                James Beard Award-winning restaurant housed in a historic building, offering farm-to-table cuisine and craft cocktails in a striking concrete interior.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <h4 className="font-medium text-primary">Rooster And The Pig</h4>
              <p className="text-sm text-muted-foreground">356 S Indian Canyon Dr, Palm Springs</p>
              <p className="text-sm text-muted-foreground">$$ • Vietnamese-American</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">
                Local favorite serving creative Vietnamese-American cuisine in a casual, modern setting. Known for flavorful dishes and craft beers.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <TripLayout
      title="Southern California Adventure"
      description="Experience the diverse landscapes of Southern California, from the otherworldly Joshua Tree National Park to the beautiful beaches of San Diego to the desert oasis of Palm Springs."
      heroImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      locations={locations}
      routeInfo={routeInfo}
      activities={activities}
      restaurants={restaurants}
    />
  );
} 