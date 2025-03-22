"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampgroundCard from "@/components/CampgroundCard";
import { Campground } from "@/lib/clientCampgrounds";

interface CustomTripData {
  id: string;
  region: string;
  tripLength: number;
  locations: {
    id: string;
    name: string;
  }[];
  campgrounds: {
    id: string;
    title: string;
    location: string;
    imageUrl: string;
    type: "tent" | "lodging";
  }[];
}

export default function CustomTripResultPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [tripData, setTripData] = useState<CustomTripData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load trip data from local storage
    const loadTripData = () => {
      try {
        const data = localStorage.getItem(`customTrip-${tripId}`);
        if (data) {
          setTripData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error loading trip data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTripData();
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-primary/20 rounded mx-auto mb-4"></div>
          <div className="h-4 w-96 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Trip Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the custom trip you're looking for. It may have expired or been removed.
        </p>
        <Button asChild>
          <Link href="/build-trip">
            Create a New Trip
          </Link>
        </Button>
      </div>
    );
  }

  // Group campgrounds by location for better display
  const campgroundsByLocation: Record<string, typeof tripData.campgrounds> = {};
  
  tripData.campgrounds.forEach(campground => {
    if (!campgroundsByLocation[campground.location]) {
      campgroundsByLocation[campground.location] = [];
    }
    campgroundsByLocation[campground.location].push(campground);
  });

  // Calculate optimal route based on selected locations
  const generateOptimalRoute = () => {
    // This is a simplified example - in a real app, you'd use a more sophisticated algorithm
    // or a mapping API to calculate the optimal route between points
    return tripData.locations.map(loc => loc.name).join(" → ");
  };

  // Calculate suggested number of nights at each location
  const calculateNightsPerLocation = () => {
    const totalLocations = tripData.locations.length;
    const totalNights = tripData.tripLength - 1; // Account for travel days
    
    // Simple distribution of nights - could be more complex in real implementation
    const baseNightsPerLocation = Math.floor(totalNights / totalLocations);
    const extraNights = totalNights % totalLocations;
    
    return tripData.locations.map((location, index) => ({
      location: location.name,
      nights: baseNightsPerLocation + (index < extraNights ? 1 : 0)
    }));
  };

  const nightsPerLocation = calculateNightsPerLocation();

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden h-64 mb-12">
        <Image
          src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Custom Trip"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Custom Trip</h1>
          <p className="text-xl max-w-2xl">
            {tripData.tripLength} days exploring {tripData.locations.length} destinations 
            with {tripData.campgrounds.length} carefully selected campgrounds
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">Your Custom Itinerary</h2>
            <p className="text-muted-foreground">
              We've optimized your {tripData.tripLength}-day adventure based on your selections
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Save as PDF
            </Button>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Trip
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Overview */}
          <div className="lg:col-span-1">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Trip Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                  <p className="font-medium">{tripData.tripLength} days</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Destinations</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tripData.locations.map(location => (
                      <span 
                        key={location.id} 
                        className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                      >
                        {location.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Optimal Route</p>
                  <p className="font-medium">{generateOptimalRoute()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Accommodation Distribution</p>
                  <ul className="mt-1 space-y-1">
                    {nightsPerLocation.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.location}</span>
                        <span className="font-medium">{item.nights} nights</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Itinerary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-6">Suggested Itinerary</h3>
              
              <div className="border-l-2 border-primary-light pl-6 space-y-8">
                {tripData.locations.map((location, locationIndex) => {
                  const campgrounds = campgroundsByLocation[location.name] || [];
                  const nights = nightsPerLocation[locationIndex]?.nights || 0;
                  
                  return (
                    <div key={location.id} className="relative">
                      <div className="absolute -left-9 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center">
                        {locationIndex + 1}
                      </div>
                      
                      <h4 className="text-lg font-semibold">{location.name}</h4>
                      <p className="text-muted-foreground mb-3">Suggested stay: {nights} nights</p>
                      
                      <div className="space-y-3">
                        {campgrounds.map((campground, idx) => (
                          <div key={campground.id} className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={campground.imageUrl || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"}
                                alt={campground.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{campground.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {campground.type === "tent" ? "Tent Camping" : "Lodging/Cabin"}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium">Suggested activities:</p>
                          <p className="text-sm text-muted-foreground">
                            Explore local hiking trails, visit nearby attractions, and enjoy the natural beauty of {location.name}.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-12">
        <Button asChild className="mr-4" variant="outline">
          <Link href="/build-trip">
            Modify Trip
          </Link>
        </Button>
        <Button asChild>
          <Link href="/build-trip">
            Build Another Trip
          </Link>
        </Button>
      </div>
    </div>
  );
} 