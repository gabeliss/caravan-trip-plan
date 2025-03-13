import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  // Featured trips to display on the homepage
  const featuredTrips = [
    {
      id: "northern-michigan",
      title: "Northern Michigan Adventure",
      description: "Explore the pristine lakes, dense forests, and charming towns of Northern Michigan.",
      image: "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: "washington",
      title: "Washington Wilderness",
      description: "Journey through Washington's diverse landscapes, from rainforests to mountain peaks.",
      image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: "southern-california",
      title: "Southern California Adventure",
      description: "Experience the diverse landscapes of SoCal, from Joshua Tree to San Diego beaches.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Camping under stars"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Camping Road Trip</h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover personally vetted campgrounds and detailed itineraries for unforgettable outdoor adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/trips">
                Explore All Trips
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Trips Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Featured Road Trips</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular camping road trips, complete with vetted campgrounds and local recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTrips.map((trip) => (
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
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <Link href={`/trips/${trip.id}`}>
                      View Trip Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/trips">
                View All Road Trips
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Planning your perfect camping road trip has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Choose Your Trip</h3>
              <p className="text-muted-foreground">
                Browse our curated collection of camping road trips across the United States and find the perfect adventure for you.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Explore Details</h3>
              <p className="text-muted-foreground">
                Dive into detailed itineraries, campground options, local activities, and restaurant recommendations for each location.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Hit the Road</h3>
              <p className="text-muted-foreground">
                Pack your gear, follow our recommended routes, and enjoy a stress-free camping adventure with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Discover personally vetted campgrounds, detailed routes, and local recommendations for an unforgettable outdoor experience.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-primary">
            <Link href="/trips">
              Explore All Road Trips
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
