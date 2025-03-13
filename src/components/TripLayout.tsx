"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampgroundCard from "@/components/CampgroundCard";
import { Campground } from "@/lib/campgrounds";

interface TripLayoutProps {
  title: string;
  description: string;
  heroImage: string;
  locations: {
    name: string;
    tent: Campground[];
    lodging: Campground[];
  }[];
  routeInfo?: React.ReactNode;
  activities?: React.ReactNode;
  restaurants?: React.ReactNode;
}

const TripLayout = ({
  title,
  description,
  heroImage,
  locations,
  routeInfo,
  activities,
  restaurants,
}: TripLayoutProps) => {
  const [accommodationType, setAccommodationType] = useState<"tent" | "lodging" | "all">("all");

  const handleAccommodationChange = (value: string) => {
    setAccommodationType(value as "tent" | "lodging" | "all");
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl">
            {title}
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            {description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <Tabs defaultValue="campgrounds" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="campgrounds">Campgrounds</TabsTrigger>
              <TabsTrigger value="route">Route Info</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campgrounds" className="mt-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-primary">Find Your Perfect Campground</h2>
                <div className="flex justify-center mb-8">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => handleAccommodationChange("all")}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                        accommodationType === "all"
                          ? "bg-primary text-white"
                          : "bg-white text-primary hover:bg-gray-50"
                      }`}
                    >
                      All Options
                    </button>
                    <button
                      onClick={() => handleAccommodationChange("tent")}
                      className={`px-4 py-2 text-sm font-medium ${
                        accommodationType === "tent"
                          ? "bg-primary text-white"
                          : "bg-white text-primary hover:bg-gray-50"
                      }`}
                    >
                      Tent Camping
                    </button>
                    <button
                      onClick={() => handleAccommodationChange("lodging")}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                        accommodationType === "lodging"
                          ? "bg-primary text-white"
                          : "bg-white text-primary hover:bg-gray-50"
                      }`}
                    >
                      Lodging
                    </button>
                  </div>
                </div>
              </div>

              {locations.map((location, locationIndex) => (
                <div key={locationIndex} className="mb-16">
                  <h3 className="text-2xl font-semibold mb-6 text-primary border-b pb-2">{location.name}</h3>
                  
                  {/* Tent Campgrounds */}
                  {(accommodationType === "all" || accommodationType === "tent") && location.tent.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-medium mb-4 text-primary-dark">Tent Camping Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {location.tent.map((campground, index) => (
                          <CampgroundCard key={index} campground={campground} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Lodging Options */}
                  {(accommodationType === "all" || accommodationType === "lodging") && location.lodging.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium mb-4 text-primary-dark">Lodging Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {location.lodging.map((campground, index) => (
                          <CampgroundCard key={index} campground={campground} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No results message */}
                  {((accommodationType === "tent" && location.tent.length === 0) || 
                    (accommodationType === "lodging" && location.lodging.length === 0) ||
                    (accommodationType === "all" && location.tent.length === 0 && location.lodging.length === 0)) && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No campgrounds available for this selection.</p>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="route">
              <div className="prose prose-lg max-w-none">
                {routeInfo || (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-semibold mb-4">Route Information Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're working on detailed route information for this trip. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="activities">
              <div className="prose prose-lg max-w-none">
                {activities || (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-semibold mb-4">Activities Information Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're compiling a list of the best activities for this trip. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="restaurants">
              <div className="prose prose-lg max-w-none">
                {restaurants || (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-semibold mb-4">Restaurant Recommendations Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're putting together our favorite restaurant recommendations for this trip. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default TripLayout; 