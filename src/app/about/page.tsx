import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Caravan Trip Plan | Our Story",
  description: "Learn about Caravan Trip Plan's mission to help travelers discover the best campgrounds and plan unforgettable road trips across the United States.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">About Caravan Trip Plan</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our mission is to help travelers discover the best campgrounds and plan unforgettable road trips across the United States.
          </p>
        </div>
        
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Team camping trip"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Caravan Trip Plan was born out of a passion for outdoor adventure and a frustration with the lack of reliable information about campgrounds and road trip routes.
              </p>
              <p>
                After spending countless hours researching campgrounds for our own trips, only to arrive and find conditions different than expected, we decided to create a resource that travelers could truly trust.
              </p>
              <p>
                What makes us different is our commitment to personally vetting every campground we recommend. Our team has traveled thousands of miles, stayed at hundreds of campgrounds, and documented our experiences to help you plan your perfect trip.
              </p>
              <p>
                We believe that camping road trips are one of the best ways to experience the natural beauty of America, connect with loved ones, and create lasting memories. Our mission is to make these experiences more accessible and enjoyable for everyone.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Camping by the lake"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="mb-20 bg-muted/30 py-16 px-6 rounded-xl">
        <h2 className="text-3xl font-bold text-primary mb-10 text-center">Our Vetting Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-8 rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-4">Research</h3>
            <p className="text-muted-foreground">
              We start by researching potential campgrounds in a region, looking at reviews, amenities, and location. We identify promising options that offer a range of experiences from rustic to full-service.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-4">Personal Visits</h3>
            <p className="text-muted-foreground">
              Our team personally visits each campground, staying at least one night to experience the facilities, assess the noise levels, check the condition of amenities, and evaluate the overall atmosphere.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-4">Documentation</h3>
            <p className="text-muted-foreground">
              We document our experience with photos, notes on amenities, and detailed observations about the campground and surrounding area, including nearby attractions and activities.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl font-bold text-primary">4</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-4">Route Planning</h3>
            <p className="text-muted-foreground">
              We create logical routes connecting our vetted campgrounds, considering driving distances, road conditions, and points of interest along the way to create a comprehensive road trip experience.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl font-bold text-primary">5</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-4">Local Recommendations</h3>
            <p className="text-muted-foreground">
              We research and often personally try local restaurants, activities, and attractions to provide well-rounded recommendations that enhance your camping experience.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl font-bold text-primary">6</span>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-4">Regular Updates</h3>
            <p className="text-muted-foreground">
              We revisit destinations periodically to ensure our information remains accurate and up-to-date, and we incorporate feedback from travelers who use our guides.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-primary mb-10 text-center">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt="Alex Thompson"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-primary">Alex Thompson</h3>
            <p className="text-muted-foreground mb-3">Founder & Lead Explorer</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              With over 15 years of camping experience across 40 states, Alex founded Caravan Trip Plan to share his passion for outdoor adventure.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
                alt="Maya Rodriguez"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-primary">Maya Rodriguez</h3>
            <p className="text-muted-foreground mb-3">Route Planner & Content Creator</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              A former travel blogger with a knack for finding hidden gems, Maya creates our detailed itineraries and writes much of our content.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="David Chen"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-primary">David Chen</h3>
            <p className="text-muted-foreground mb-3">Campground Specialist</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              An avid camper and former park ranger, David evaluates campgrounds with a keen eye for detail and safety considerations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary text-white py-16 px-6 rounded-xl">
        <h2 className="text-3xl font-bold mb-6">Start Your Adventure Today</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Explore our curated collection of camping road trips and discover the perfect outdoor adventure for you and your loved ones.
        </p>
        <Button asChild size="lg" variant="secondary" className="text-primary">
          <Link href="/trips">
            Browse Our Trips
          </Link>
        </Button>
      </section>
    </main>
  );
} 