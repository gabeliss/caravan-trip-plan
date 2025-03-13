import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Camping Road Trips | Caravan Trip Plan",
  description: "Discover our curated collection of camping road trips across the United States, featuring vetted campgrounds, detailed routes, and local recommendations.",
};

const trips = [
  {
    id: "northern-michigan",
    title: "Northern Michigan Adventure",
    description: "Explore the pristine lakes, dense forests, and charming towns of Northern Michigan on this unforgettable camping journey.",
    image: "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    locations: ["Traverse City", "Mackinac City", "Pictured Rocks"]
  },
  {
    id: "washington",
    title: "Washington Wilderness",
    description: "Journey through Washington's diverse landscapes, from rainforests to mountain peaks to coastal beaches.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    locations: ["Olympic National Park", "North Cascades", "Mount Rainier"]
  },
  {
    id: "arizona",
    title: "Arizona Desert Expedition",
    description: "Discover the stunning beauty of Arizona's desert landscapes, from the Grand Canyon to red rock formations.",
    image: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    locations: ["Grand Canyon", "Sedona", "Cave Creek"]
  },
  {
    id: "smoky-mountains",
    title: "Smoky Mountains Journey",
    description: "Experience the magic of the Great Smoky Mountains with misty valleys, diverse wildlife, and Appalachian culture.",
    image: "https://images.unsplash.com/photo-1565768502801-1901d20758ae?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    locations: ["Maggie Valley", "Cades Cove", "Pigeon Forge"]
  },
  {
    id: "southern-california",
    title: "Southern California Adventure",
    description: "Explore the diverse landscapes of Southern California, from desert to coast to mountain.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    locations: ["Joshua Tree", "San Diego", "Palm Springs"]
  },
  {
    id: "colorado-rockies",
    title: "Colorado Rockies Expedition",
    description: "Discover the majestic beauty of the Colorado Rockies with alpine lakes, towering peaks, and abundant wildlife.",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    locations: ["Rocky Mountain National Park", "Aspen", "Telluride"]
  },
  {
    id: "maine-coastline",
    title: "Maine Coastal Journey",
    description: "Experience the rugged beauty of Maine's coastline with its picturesque lighthouses, charming fishing villages, and pristine beaches.",
    image: "https://images.unsplash.com/photo-1582488719899-a2a54cb479fe?q=80&w=1572&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    locations: ["Acadia National Park", "Portland", "Camden"]
  },
  {
    id: "utah-national-parks",
    title: "Utah's Mighty Five",
    description: "Embark on an epic journey through Utah's five stunning national parks, featuring otherworldly rock formations and breathtaking vistas.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    locations: ["Zion", "Bryce Canyon", "Arches"]
  },
  {
    id: "florida-keys",
    title: "Florida Keys Adventure",
    description: "Journey through the tropical paradise of the Florida Keys, with crystal-clear waters, vibrant coral reefs, and laid-back island vibes.",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    locations: ["Key Largo", "Marathon", "Key West"]
  }
];

export default function TripsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Curated Camping Road Trips</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover our collection of carefully planned camping road trips featuring vetted campgrounds, 
          detailed routes, and local recommendations for an unforgettable outdoor adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <Card key={trip.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image
                src={trip.image}
                alt={trip.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-primary">{trip.title}</CardTitle>
              <CardDescription>{trip.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-4">
                {trip.locations.map((location) => (
                  <span 
                    key={location} 
                    className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/trips/${trip.id}`}>
                  View Trip Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 