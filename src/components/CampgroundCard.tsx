"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Campground {
  title: string;
  address: string;
  cityAndState: string;
  content: string;
  estimatedPrice: string;
  imageUrls: string[];
  offerings: string;
  distanceToTown: string;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  guidelines: string;
  cancellationPolicy: string;
}

interface CampgroundCardProps {
  campground: Campground;
}

const CampgroundCard = ({ campground }: CampgroundCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src={campground.imageUrls[0]}
              alt={campground.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{campground.title}</CardTitle>
            <CardDescription>{campground.cityAndState}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <p className="text-sm line-clamp-3">{campground.content}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {campground.estimatedPrice}
              </span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {campground.offerings}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">{campground.distanceToTown}</p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{campground.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Carousel className="w-full relative mb-8">
              <CarouselContent>
                {campground.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-56 w-full">
                      <Image
                        src={url}
                        alt={`${campground.title} - Image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-2">
                <CarouselPrevious className="pointer-events-auto relative left-0 h-8 w-8 bg-white/80 shadow-md rounded-full opacity-80 hover:opacity-100" />
                <CarouselNext className="pointer-events-auto relative right-0 h-8 w-8 bg-white/80 shadow-md rounded-full opacity-80 hover:opacity-100" />
              </div>
            </Carousel>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm">{campground.content}</p>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-sm">{campground.address}</p>
              <p className="text-sm text-muted-foreground mt-1">{campground.distanceToTown}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Price:</p>
                  <p>{campground.estimatedPrice}</p>
                </div>
                <div>
                  <p className="font-medium">Offerings:</p>
                  <p>{campground.offerings}</p>
                </div>
                <div>
                  <p className="font-medium">Check-in:</p>
                  <p>{campground.checkInTime}</p>
                </div>
                <div>
                  <p className="font-medium">Check-out:</p>
                  <p>{campground.checkOutTime}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {campground.amenities.map((amenity, index) => (
                  <span key={index} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Guidelines</h3>
              <p className="text-sm">{campground.guidelines}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Cancellation Policy</h3>
              <p className="text-sm">{campground.cancellationPolicy}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampgroundCard; 