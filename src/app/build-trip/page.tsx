"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getAllLocations, getCampgroundsByLocation } from "@/lib/clientCampgrounds";
import { Campground } from "@/lib/clientCampgrounds";

// Get all available locations to build from
const locations = [
  { id: "traverseCity", name: "Traverse City" },
  { id: "mackinacCity", name: "Mackinac City" },
  { id: "picturedRocks", name: "Pictured Rocks" },
  { id: "olympicNP", name: "Olympic National Park" },
  { id: "northCascades", name: "North Cascades" },
  { id: "mountRainier", name: "Mount Rainier" },
  { id: "grandCanyon", name: "Grand Canyon" },
  { id: "sedona", name: "Sedona" },
  { id: "caveCreek", name: "Cave Creek" },
  { id: "maggieValley", name: "Maggie Valley" },
  { id: "cadesCove", name: "Cades Cove" },
  { id: "pigeonForge", name: "Pigeon Forge" },
  { id: "joshuaTree", name: "Joshua Tree" },
  { id: "sanDiego", name: "San Diego" },
  { id: "palmSprings", name: "Palm Springs" }
];

// Group locations by region
const regions = [
  { 
    id: "northern-michigan", 
    name: "Northern Michigan",
    locations: ["traverseCity", "mackinacCity", "picturedRocks"],
    image: "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  { 
    id: "washington", 
    name: "Washington",
    locations: ["olympicNP", "northCascades", "mountRainier"],
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  { 
    id: "arizona", 
    name: "Arizona",
    locations: ["grandCanyon", "sedona", "caveCreek"],
    image: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  { 
    id: "smoky-mountains", 
    name: "Smoky Mountains",
    locations: ["maggieValley", "cadesCove", "pigeonForge"],
    image: "https://images.unsplash.com/photo-1565768502801-1901d20758ae?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  { 
    id: "southern-california", 
    name: "Southern California",
    locations: ["joshuaTree", "sanDiego", "palmSprings"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  }
];

export default function BuildTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [tripLength, setTripLength] = useState<number>(7);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [accommodationType, setAccommodationType] = useState<"tent" | "lodging" | "all">("all");
  const [selectedCampgrounds, setSelectedCampgrounds] = useState<{
    id: string;
    campground: Campground;
    location: string;
    type: "tent" | "lodging";
  }[]>([]);

  // Get available campgrounds for selected locations
  const availableCampgrounds = selectedLocations.flatMap(locationId => {
    const locationName = locations.find(loc => loc.id === locationId)?.name || "";
    const locationData = getCampgroundsByLocation(locationId);
    
    const tentCampgrounds = locationData.tent.map((campground, index) => ({
      id: `${locationId}-tent-${index}`,
      campground,
      location: locationName,
      type: "tent" as const
    }));
    
    const lodgingCampgrounds = locationData.lodging.map((campground, index) => ({
      id: `${locationId}-lodging-${index}`,
      campground,
      location: locationName,
      type: "lodging" as const
    }));
    
    if (accommodationType === "tent") return tentCampgrounds;
    if (accommodationType === "lodging") return lodgingCampgrounds;
    return [...tentCampgrounds, ...lodgingCampgrounds];
  });

  // Handle selecting a region
  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    // Pre-select all locations in this region
    const regionLocations = regions.find(r => r.id === regionId)?.locations || [];
    setSelectedLocations(regionLocations);
    setCurrentStep(2);
  };

  // Handle location selection
  const handleLocationToggle = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  // Handle campground selection
  const handleCampgroundToggle = (campgroundInfo: {
    id: string;
    campground: Campground;
    location: string;
    type: "tent" | "lodging";
  }) => {
    setSelectedCampgrounds(prev => {
      const exists = prev.some(c => c.id === campgroundInfo.id);
      
      if (exists) {
        return prev.filter(c => c.id !== campgroundInfo.id);
      } else {
        return [...prev, campgroundInfo];
      }
    });
  };

  // Handle form submission
  const handleCreateTrip = () => {
    // Create a unique ID for this custom trip
    const tripId = Date.now().toString();
    
    // Store the trip data in session or local storage
    const tripData = {
      id: tripId,
      region: selectedRegion,
      tripLength,
      locations: selectedLocations.map(locId => {
        const location = locations.find(l => l.id === locId);
        return {
          id: locId,
          name: location?.name || ""
        };
      }),
      campgrounds: selectedCampgrounds.map(c => ({
        id: c.id,
        title: c.campground.title,
        location: c.location,
        imageUrl: c.campground.imageUrls[0] || "",
        type: c.type
      }))
    };
    
    localStorage.setItem(`customTrip-${tripId}`, JSON.stringify(tripData));
    
    // Navigate to the custom trip result page
    router.push(`/build-trip/result/${tripId}`);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Build Your Custom Trip</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create your perfect camping road trip by selecting your ideal destinations, trip length, and campgrounds from our curated collection.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center max-w-3xl w-full">
          <div 
            className={`flex-1 h-2 ${currentStep >= 1 ? "bg-primary" : "bg-muted"}`}
          />
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div 
            className={`flex-1 h-2 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}
          />
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <div 
            className={`flex-1 h-2 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}
          />
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <div 
            className={`flex-1 h-2 ${currentStep >= 4 ? "bg-primary" : "bg-muted"}`}
          />
        </div>
      </div>

      {/* Step 1: Select Region */}
      {currentStep === 1 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Step 1: Select a Region</h2>
          <p className="text-muted-foreground mb-8">Choose a region to start building your custom trip. Each region has unique landscapes and experiences to offer.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regions.map((region) => (
              <Card 
                key={region.id} 
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedRegion === region.id ? "ring-2 ring-primary" : "hover:shadow-lg"
                }`}
                onClick={() => handleRegionSelect(region.id)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{region.name}</CardTitle>
                  <CardDescription>
                    {region.locations.length} available destinations
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Trip Details */}
      {currentStep === 2 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Step 2: Trip Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-4">Trip Length</h3>
                <p className="text-muted-foreground mb-6">How many days would you like your trip to be?</p>
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span>3 days</span>
                    <span>{tripLength} days</span>
                    <span>14 days</span>
                  </div>
                  <Slider
                    value={[tripLength]}
                    min={3}
                    max={14}
                    step={1}
                    onValueChange={(value) => setTripLength(value[0])}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-4">Accommodation Type</h3>
                <p className="text-muted-foreground mb-6">What type of camping experience are you looking for?</p>
                <Tabs defaultValue="all" onValueChange={(value: string) => setAccommodationType(value as "tent" | "lodging" | "all")}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Types</TabsTrigger>
                    <TabsTrigger value="tent">Tent Camping</TabsTrigger>
                    <TabsTrigger value="lodging">Lodging/Cabins</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Select Destinations</h3>
              <p className="text-muted-foreground mb-6">Choose the locations you'd like to visit during your trip.</p>
              
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                {regions.find(r => r.id === selectedRegion)?.locations.map(locationId => {
                  const location = locations.find(l => l.id === locationId);
                  return (
                    <div key={locationId} className="flex items-center space-x-2">
                      <Checkbox 
                        id={locationId} 
                        checked={selectedLocations.includes(locationId)}
                        onCheckedChange={() => handleLocationToggle(locationId)}
                      />
                      <Label htmlFor={locationId} className="text-base cursor-pointer">
                        {location?.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={selectedLocations.length === 0}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select Campgrounds */}
      {currentStep === 3 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Step 3: Select Campgrounds</h2>
          <p className="text-muted-foreground mb-8">
            Choose the campgrounds you'd like to stay at during your trip. We recommend selecting at least one campground per location.
          </p>
          
          {selectedLocations.map(locationId => {
            const location = locations.find(l => l.id === locationId);
            const campgrounds = availableCampgrounds.filter(c => c.location === location?.name);
            
            return (
              <div key={locationId} className="mb-12">
                <h3 className="text-xl font-medium mb-4">{location?.name}</h3>
                
                {campgrounds.length === 0 ? (
                  <p className="text-muted-foreground">No campgrounds available for the selected accommodation type.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campgrounds.map((campgroundInfo) => {
                      const isSelected = selectedCampgrounds.some(c => c.id === campgroundInfo.id);
                      
                      return (
                        <Card 
                          key={campgroundInfo.id}
                          className={`overflow-hidden cursor-pointer transition-all h-full ${
                            isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
                          }`}
                          onClick={() => handleCampgroundToggle(campgroundInfo)}
                        >
                          <div className="relative h-36 w-full">
                            <Image
                              src={campgroundInfo.campground.imageUrls[0] || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"}
                              alt={campgroundInfo.campground.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-background/90 px-3 py-1 rounded-full text-xs font-medium">
                              {campgroundInfo.type === "tent" ? "Tent Camping" : "Lodging/Cabin"}
                            </div>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{campgroundInfo.campground.title}</CardTitle>
                            <CardDescription className="text-xs">{campgroundInfo.campground.cityAndState}</CardDescription>
                          </CardHeader>
                          <CardContent className="text-sm pb-2">
                            <p className="line-clamp-2">{campgroundInfo.campground.offerings}</p>
                            <p className="text-primary mt-2">{campgroundInfo.campground.estimatedPrice}</p>
                          </CardContent>
                          <CardFooter>
                            {isSelected ? (
                              <div className="flex items-center text-primary text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Selected
                              </div>
                            ) : (
                              <div className="text-muted-foreground text-sm">Click to select</div>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              disabled={selectedCampgrounds.length === 0}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Create */}
      {currentStep === 4 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Step 4: Review & Create Your Trip</h2>
          
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">Trip Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Region</p>
                <p className="font-medium mb-4">{regions.find(r => r.id === selectedRegion)?.name}</p>
                
                <p className="text-sm text-muted-foreground mb-2">Trip Length</p>
                <p className="font-medium mb-4">{tripLength} days</p>
                
                <p className="text-sm text-muted-foreground mb-2">Destinations</p>
                <ul className="list-disc pl-5 mb-4">
                  {selectedLocations.map(locId => {
                    const location = locations.find(l => l.id === locId);
                    return (
                      <li key={locId}>{location?.name}</li>
                    );
                  })}
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Selected Campgrounds</p>
                <ul className="list-disc pl-5">
                  {selectedCampgrounds.map(campground => (
                    <li key={campground.id}>
                      {campground.campground.title} ({campground.location})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(3)}
            >
              Back
            </Button>
            <Button
              onClick={handleCreateTrip}
            >
              Create My Trip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 