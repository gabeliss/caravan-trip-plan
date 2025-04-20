import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, UtensilsCrossed, Wine, IceCream, Mountain, ChevronDown, ChevronUp, MapPin, Calendar, Bike, Castle, Router as Butterfly, Ship } from 'lucide-react';
import { SavedTrip } from '../../types';
import { RestaurantCard } from './RestaurantCard';
import { ActivityCard } from './ActivityCard';
import { TrailCard } from './TrailCard';
import { format, addDays } from 'date-fns';

interface VirtualTripGuideProps {
  trip: SavedTrip;
}

interface Section {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  content: React.ReactNode;
}

interface LocationGroup {
  location: string;
  nights: number[];
  startDate?: Date;
  endDate?: Date;
}

const VirtualTripGuide: React.FC<VirtualTripGuideProps> = ({ trip }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleLocation = (location: string) => {
    setExpandedLocation(expandedLocation === location ? null : location);
  };

  // Normalize location names to main regions
  const normalizeLocation = (location: string): string => {
    const locationMap: Record<string, string> = {
      'Traverse City': 'Traverse City',
      'Cedar': 'Traverse City',
      'Indian River': 'Mackinac Island',
      'Mackinaw City': 'Mackinac Island',
      'St. Ignace': 'Mackinac Island',
      'Mackinac Island': 'Mackinac Island',
      'Munising': 'Pictured Rocks',
      'Au Train': 'Pictured Rocks'
    };

    return locationMap[location] || location;
  };

  // Group nights by location
  const getLocationGroups = (): LocationGroup[] => {
    const groups: LocationGroup[] = [];
    let currentGroup: LocationGroup | null = null;

    trip.selectedCampgrounds.forEach((campground, index) => {
      const rawLocation = campground.distanceToTown.split(' to ')[1];
      const location = normalizeLocation(rawLocation);
      const date = trip.duration.startDate && addDays(trip.duration.startDate, index);

      if (!currentGroup || currentGroup.location !== location) {
        if (currentGroup) {
          currentGroup.endDate = date;
          groups.push(currentGroup);
        }
        currentGroup = {
          location,
          nights: [index + 1],
          startDate: date
        };
      } else {
        currentGroup.nights.push(index + 1);
      }
    });

    if (currentGroup) {
      currentGroup.endDate = trip.duration.startDate && 
        addDays(trip.duration.startDate, currentGroup.nights.length - 1);
      groups.push(currentGroup);
    }

    return groups;
  };

  // Get sections for each location
  const getSectionsForLocation = (location: string): Section[] => {
    // Mackinac Island sections
    if (location === 'Mackinac Island') {
      return [
        {
          id: `${location}-coffee`,
          title: 'Coffee & Breakfast',
          icon: Coffee,
          content: (
            <div className="space-y-4">
              <RestaurantCard
                name="Java Joe's Cafe ($)"
                description="A quirky and colorful diner known for its delicious breakfast and lively atmosphere. With menus printed on newspaper and a freshly repainted floor each year, you might even get a chance to meet the famous Java Joe himself!"
                price="$"
                isFavorite
              />
              <RestaurantCard
                name="Lucky Bean Coffeehouse ($)"
                description="Cafe serving handcrafted espresso drinks, fresh pastries, and light breakfast options."
                price="$"
              />
              <RestaurantCard
                name="Watercolor Café ($)"
                description="A light and airy cafe that also serves excellent coffee alongside sandwiches and fresh bites."
                price="$"
              />
            </div>
          )
        },
        {
          id: `${location}-brunch`,
          title: 'Brunch & Lunch',
          icon: UtensilsCrossed,
          content: (
            <div className="space-y-4">
              <RestaurantCard
                name="The Chuckwagon ($)"
                description="Cozy diner known for its hearty breakfast options like pancakes, omelets, and biscuits."
                price="$"
              />
              <RestaurantCard
                name="Mighty Mac Hamburgers ($)"
                description="A no-frills burger joint offering classic burgers, hot dogs, and fries. Great for a quick meal."
                price="$"
              />
              <RestaurantCard
                name="Doud's Market & Deli ($)"
                description="Historic market with a deli serving made-to-order sandwiches, perfect for a picnic or a quick bite on the go."
                price="$"
              />
            </div>
          )
        },
        {
          id: `${location}-dinner`,
          title: 'Dinner',
          icon: Wine,
          content: (
            <div className="space-y-4">
              <RestaurantCard
                name="Millie's on Main ($$)"
                description="Charming eatery offering classic American dishes, including burgers, sandwiches, and soups, in a cozy setting."
                price="$$"
              />
              <RestaurantCard
                name="Clyde's Drive-In ($)"
                description="Iconic roadside diner with made-to-order burgers, fries, and shakes served in a nostalgic drive-in setting."
                price="$"
              />
              <RestaurantCard
                name="Gateway City Garage ($)"
                description="A popular food truck serving gourmet street food, including tacos, burgers, and creative daily specials, in a casual outdoor setting."
                price="$"
              />
            </div>
          )
        },
        {
          id: `${location}-treats`,
          title: 'Sweet Treats',
          icon: IceCream,
          content: (
            <div className="space-y-4">
              <RestaurantCard
                name="Murdick's Candy Kitchen ($$)"
                description="Known as the first fudge shop on the island, Murdick's has been crafting its iconic fudge since 1887 with a classic recipe and tradition."
                price="$$"
              />
              <RestaurantCard
                name="Ryba's Fudge Shop ($$)"
                description="A local favorite offering a wide variety, Ryba's is famous for its creamy, melt-in-your-mouth fudge made fresh daily."
                price="$$"
              />
              <RestaurantCard
                name="Mickey's Ice Cream ($)"
                description="A popular stop for classic ice cream cones, sundaes, and milkshakes."
                price="$"
              />
            </div>
          )
        },
        {
          id: `${location}-hiking`,
          title: 'Hiking Trails',
          icon: Mountain,
          content: (
            <div className="space-y-4">
              <TrailCard
                name="Arch Rock Trail"
                distance="2.1 miles"
                duration="50 minutes"
                difficulty="Easy"
                description="A short out-and-back trail leading to the iconic Arch Rock, offering stunning views of the island and Lake Huron. One of the most iconic spots on Mackinac."
              />
              <TrailCard
                name="Mission Point to Anne's Tablet"
                distance="1 mile"
                duration="20-30 minutes"
                difficulty="Easy"
                description="Paved and well-maintained trail leading to a scenic overlook and a historical monument."
              />
              <TrailCard
                name="Fort Holmes Loop"
                distance="3.4 miles"
                duration="1.5 hours"
                difficulty="Moderate"
                description="A moderate, scenic hike offering historical landmarks, a fantastic workout, and breathtaking panoramic views from the island's highest point. This loop starts and ends at Fort Mackinac, with key stops at Skull Cave, Point Lookout, and Fort Holmes."
              />
            </div>
          )
        },
        {
          id: `${location}-activities`,
          title: 'Activities',
          icon: Bike,
          content: (
            <div className="space-y-4">
              <ActivityCard
                name="Biking Around the Island"
                duration="2-3 hours"
                description="Explore the 8.2-mile M-185 loop, offering scenic views of Lake Huron, Arch Rock, and historic landmarks."
                tips={[
                  "Bring your bike on the ferry or rent one at Mackinac Wheels",
                  "The full loop is 8.2 miles but you can do shorter sections",
                  "Best times are early morning or late afternoon to avoid crowds"
                ]}
              />
              <ActivityCard
                name="Horse-Drawn Carriage Tours"
                duration="1 hour 45 minutes"
                description="Discover the island's history with a carriage tour, featuring stops at Arch Rock and Fort Mackinac."
                tips={[
                  "No set departure times - board the next available carriage",
                  "Purchase tickets at the main ticket office",
                  "Tours run rain or shine"
                ]}
              />
              <ActivityCard
                name="Fort Mackinac"
                duration="2-3 hours"
                description="Tour this historic military outpost with interactive exhibits, live reenactments, and panoramic harbor views."
              />
              <ActivityCard
                name="Butterfly House"
                duration="1 hour"
                description="Walk through lush gardens filled with exotic butterflies at The Original Mackinac Island Butterfly House."
              />
              <ActivityCard
                name="Kayak and Paddleboard Tours"
                duration="2-3 hours"
                description="Explore the waters around Mackinac Island with kayak or paddleboard rentals. Guided tours available through Great Turtle Kayak Tours."
                tips={[
                  "Book in advance during peak season",
                  "Morning tours often have calmer waters",
                  "All skill levels welcome"
                ]}
              />
            </div>
          )
        }
      ];
    }

    // Pictured Rocks sections
    if (location === 'Pictured Rocks') {
      return [
        {
          id: `${location}-activities`,
          title: 'Activities',
          icon: Ship,
          content: (
            <div className="space-y-4">
              <ActivityCard
                name="Pictured Rocks Boat Tours"
                duration="2.5 hours"
                description="Cruise along the colorful cliffs and see waterfalls, caves, and natural rock formations from the water."
                tips={[
                  "Book in advance during peak season",
                  "Bring a light jacket - it's cooler on the water",
                  "Best lighting for photos is during afternoon tours"
                ]}
              />
              <ActivityCard
                name="Kayaking Tours"
                duration="3-4 hours"
                description="Paddle along the cliffs for an up-close view of Pictured Rocks' stunning features."
                tips={[
                  "No experience necessary - guides provide instruction",
                  "Morning tours typically have calmer waters",
                  "Waterproof cameras recommended"
                ]}
              />
            </div>
          )
        },
        {
          id: `${location}-hiking`,
          title: 'Hiking Trails',
          icon: Mountain,
          content: (
            <div className="space-y-4">
              <TrailCard
                name="Chapel Rock and Beach Trail"
                distance="6.2 miles"
                duration="3-4 hours"
                difficulty="Moderate"
                description="Popular loop trail featuring Chapel Rock, Chapel Falls, and a beautiful beach."
              />
              <TrailCard
                name="Miners Castle Point"
                distance="0.5 miles"
                duration="30 minutes"
                difficulty="Easy"
                description="Short walk to viewing platforms of the most photographed formation in the park."
              />
            </div>
          )
        },
        {
          id: `${location}-dining`,
          title: 'Dining',
          icon: UtensilsCrossed,
          content: (
            <div className="space-y-4">
              <RestaurantCard
                name="Falling Rock Café ($)"
                description="Cozy café serving coffee, sandwiches, and homemade pastries. Perfect for grabbing lunch before hiking."
                price="$"
              />
              <RestaurantCard
                name="Eh! Burger ($$)"
                description="Local favorite serving creative burgers and craft beers with a view of Grand Island."
                price="$$"
              />
            </div>
          )
        }
      ];
    }

    // Traverse City sections
    if (location === 'Traverse City') {
      return [
        {
          id: `${location}-coffee`,
          title: 'Coffee & Breakfast',
          icon: Coffee,
          content: (
            <div className="space-y-4">
              <RestaurantCard
                name="BLK MRKT ($)"
                description="Hip coffee shop known for expertly crafted espresso drinks and fresh pastries."
                price="$"
                isFavorite
              />
              <RestaurantCard
                name="Morsels ($)"
                description="Waterfront café serving bite-sized treats and specialty coffee drinks."
                price="$"
              />
            </div>
          )
        },
        {
          id: `${location}-dining`,
          title: 'Dining',
          icon: Wine,
          content: (
            <div className="space-y-4">
              <RestaurantCard
                name="The Cook's House ($$$)"
                description="Farm-to-table fine dining featuring local ingredients and an extensive wine list."
                price="$$$"
              />
              <RestaurantCard
                name="Little Fleet ($)"
                description="Food truck lot with diverse options and outdoor seating. Perfect for casual dining."
                price="$"
              />
            </div>
          )
        },
        {
          id: `${location}-activities`,
          title: 'Activities',
          icon: Castle,
          content: (
            <div className="space-y-4">
              <ActivityCard
                name="Wine Tasting"
                duration="Half day or full day"
                description="Tour the wineries of Old Mission Peninsula with stunning bay views."
                tips={[
                  "Many wineries require reservations",
                  "Consider a guided tour to avoid driving",
                  "Most wineries open at 11am"
                ]}
              />
              <ActivityCard
                name="Sleeping Bear Dunes"
                duration="2-6 hours"
                description="Climb massive sand dunes and enjoy spectacular Lake Michigan views."
                tips={[
                  "Arrive early to avoid peak crowds",
                  "Bring plenty of water",
                  "Wear proper footwear for sand"
                ]}
              />
            </div>
          )
        }
      ];
    }

    // Default sections for other locations
    return [
      {
        id: `${location}-dining`,
        title: 'Dining',
        icon: UtensilsCrossed,
        content: (
          <div className="space-y-4">
            <RestaurantCard
              name="Local Diner ($)"
              description="Classic American fare in a casual setting."
              price="$"
            />
          </div>
        )
      }
    ];
  };

  const locationGroups = getLocationGroups();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6">Virtual Trip Guide</h2>
      <div className="space-y-6">
        {locationGroups.map((group) => {
          const sections = getSectionsForLocation(group.location);
          const nightsText = group.nights.length === 1 
            ? `Night ${group.nights[0]}`
            : `Nights ${group.nights[0]}-${group.nights[group.nights.length - 1]}`;

          return (
            <div key={group.location} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleLocation(group.location)}
                className="w-full flex items-center justify-between p-4 hover:bg-beige/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-primary-dark" />
                  <div>
                    <span className="font-medium text-primary-dark">{nightsText}</span>
                    {group.startDate && group.endDate && (
                      <span className="text-sm text-gray-500 ml-2">
                        {format(group.startDate, 'MMM d')} - {format(group.endDate, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{group.location}</span>
                  </div>
                </div>
                {expandedLocation === group.location ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedLocation === group.location && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t p-4 space-y-4">
                      {sections.map((section) => (
                        <div key={section.id} className="border rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-beige/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <section.icon className="w-5 h-5 text-primary-dark" />
                              <span className="font-medium text-primary-dark">{section.title}</span>
                            </div>
                            {expandedSection === section.id ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <AnimatePresence>
                            {expandedSection === section.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="border-t p-4 bg-beige/5">
                                  {section.content}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { VirtualTripGuide };