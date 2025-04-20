import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map as MapIcon,
  Calendar,
  Utensils,
  Tent,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Mountain,
  Bike,
  Ship,
  Castle,
  PackageOpen,
  CookingPot,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Moon,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Book
} from 'lucide-react';
import { SavedTrip } from '../../types';
import { Map } from '../Map';
import { RestaurantCard } from './RestaurantCard';
import { ActivityCard } from './ActivityCard';
import { TrailCard } from './TrailCard';
import { format, addDays } from 'date-fns';

interface TripGuidePagesProps {
  trip: SavedTrip;
}

type Page = 'overview' | 'recommendations' | 'packing' | 'recipes';

interface NavItem {
  id: Page;
  label: string;
  icon: React.FC<{ className?: string }>;
}

interface ConsolidatedStay {
  campground: {
    id: string;
    name: string;
    imageUrl: string;
    location: string;
  };
  nights: {
    start: number;
    end: number;
    dates?: {
      start: Date;
      end: Date;
    };
  };
  totalNights: number;
}

const navigation: NavItem[] = [
  { id: 'overview', label: 'Trip Overview', icon: MapIcon },
  { id: 'recommendations', label: 'Recommendations', icon: Book },
  { id: 'packing', label: 'Packing List', icon: PackageOpen },
  { id: 'recipes', label: 'Camp Recipes', icon: CookingPot }
];

const calculateClothingQuantities = (nights: number) => {
  return {
    tshirts: Math.min(nights + 1, 7), // One extra shirt, max 7
    longSleeves: Math.ceil(nights / 3), // 1 for every 3 nights
    shorts: Math.min(Math.ceil(nights / 2) + 1, 4), // 1 for every 2 nights plus 1, max 4
    pants: Math.min(Math.ceil(nights / 3) + 1, 3), // 1 for every 3 nights plus 1, max 3
    sweatshirts: Math.min(Math.ceil(nights / 3) + 1, 2), // 1 for every 3 nights plus 1, max 2
    sweatpants: 1, // Always 1
    underwearSocks: nights + 1 // One extra pair
  };
};

export const TripGuidePages: React.FC<TripGuidePagesProps> = ({ trip }) => {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  const getConsolidatedStays = (): ConsolidatedStay[] => {
    const stays: ConsolidatedStay[] = [];
    let currentStay: ConsolidatedStay | null = null;

    trip.selectedCampgrounds.forEach((campground, index) => {
      const location = campground.distanceToTown.split(' to ')[1];
      const date = trip.duration.startDate && addDays(trip.duration.startDate, index);
      
      if (!currentStay || currentStay.campground.id !== campground.id) {
        if (currentStay) {
          stays.push(currentStay);
        }
        currentStay = {
          campground: {
            id: campground.id,
            name: campground.name,
            imageUrl: campground.imageUrl,
            location: location
          },
          nights: {
            start: index + 1,
            end: index + 1,
            dates: trip.duration.startDate ? {
              start: date!,
              end: date!
            } : undefined
          },
          totalNights: 1
        };
      } else {
        currentStay.nights.end = index + 1;
        currentStay.totalNights++;
        if (currentStay.nights.dates) {
          currentStay.nights.dates.end = date!;
        }
      }
    });

    if (currentStay) {
      stays.push(currentStay);
    }

    return stays;
  };

  const renderStayCard = (stay: ConsolidatedStay) => {
    const nightsText = stay.totalNights === 1 
      ? `Night ${stay.nights.start}`
      : `Nights ${stay.nights.start}-${stay.nights.end}`;

    return (
      <div className="bg-white rounded-lg border p-3">
        <div className="flex items-start gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={stay.campground.imageUrl}
              alt={stay.campground.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg text-primary-dark">{nightsText}</h3>
                <p className="text-sm text-gray-600">{stay.campground.location}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Moon className="w-4 h-4 text-primary-dark" />
                <span className="font-medium">{stay.totalNights}</span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">{stay.campground.name}</p>
              {stay.nights.dates && (
                <p className="text-sm text-gray-500 mt-1">
                  {format(stay.nights.dates.start, 'MMM d')} - {format(stay.nights.dates.end, 'MMM d, yyyy')}
                </p>
              )}
            </div>

            <div className="mt-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-dark hover:text-primary-dark/80 flex items-center gap-1"
              >
                Book Now
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Column - Recommendations */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-lg border">
          <div className="p-3 border-b">
            <h2 className="text-xl font-semibold">Your Stays</h2>
          </div>
          <div className="divide-y">
            {getConsolidatedStays().map((stay, index) => (
              <div key={`${stay.campground.id}-${stay.nights.start}`} className="p-3">
                {renderStayCard(stay)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Map */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-3">Trip Route</h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <Map destination={trip.destination} selectedCampgrounds={trip.selectedCampgrounds} />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>Your journey through {trip.destination.name} includes {getConsolidatedStays().length} unique campgrounds.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendationsPage = () => (
    <div className="space-y-4">
      {getConsolidatedStays().map((stay, index) => (
        <div key={`${stay.campground.id}-${stay.nights.start}`} className="bg-white rounded-lg border">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-dark">
                  {stay.nights.start === stay.nights.end 
                    ? `Night ${stay.nights.start}` 
                    : `Nights ${stay.nights.start}-${stay.nights.end}`}
                </h3>
                <p className="text-sm text-gray-600">{stay.campground.location}</p>
              </div>
              <button
                onClick={() => setExpandedLocation(expandedLocation === stay.campground.location ? null : stay.campground.location)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {expandedLocation === stay.campground.location ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expandedLocation === stay.campground.location && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 space-y-4">
                  {/* Coffee & Breakfast */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Coffee className="w-5 h-5 text-primary-dark" />
                      <h4 className="font-medium">Coffee & Breakfast</h4>
                    </div>
                    <div className="space-y-3">
                      <RestaurantCard
                        name="Java Joe's Cafe ($)"
                        description="A quirky and colorful diner known for its delicious breakfast and lively atmosphere."
                        price="$"
                        isFavorite
                      />
                      <RestaurantCard
                        name="Lucky Bean Coffeehouse ($)"
                        description="Cafe serving handcrafted espresso drinks, fresh pastries, and light breakfast options."
                        price="$"
                      />
                    </div>
                  </div>

                  {/* Lunch & Dinner */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Utensils className="w-5 h-5 text-primary-dark" />
                      <h4 className="font-medium">Restaurants</h4>
                    </div>
                    <div className="space-y-3">
                      <RestaurantCard
                        name="Millie's on Main ($$)"
                        description="Charming eatery offering classic American dishes in a cozy setting."
                        price="$$"
                      />
                      <RestaurantCard
                        name="Gateway City Garage ($)"
                        description="Popular food truck serving gourmet street food and creative daily specials."
                        price="$"
                      />
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Mountain className="w-5 h-5 text-primary-dark" />
                      <h4 className="font-medium">Activities</h4>
                    </div>
                    <div className="space-y-3">
                      <ActivityCard
                        name="Biking Around the Island"
                        duration="2-3 hours"
                        description="Explore the 8.2-mile M-185 loop, offering scenic views of Lake Huron."
                        tips={[
                          "Best times are early morning or late afternoon",
                          "Rent bikes at Mackinac Wheels",
                          "Pack water and snacks"
                        ]}
                      />
                      <ActivityCard
                        name="Kayak Tours"
                        duration="3-4 hours"
                        description="Paddle along the shoreline with guided tours available."
                        tips={[
                          "Morning tours have calmer waters",
                          "All skill levels welcome",
                          "Waterproof cameras recommended"
                        ]}
                      />
                    </div>
                  </div>

                  {/* Hiking Trails */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Mountain className="w-5 h-5 text-primary-dark" />
                      <h4 className="font-medium">Hiking Trails</h4>
                    </div>
                    <div className="space-y-3">
                      <TrailCard
                        name="Arch Rock Trail"
                        distance="2.1 miles"
                        duration="50 minutes"
                        difficulty="Easy"
                        description="A short out-and-back trail leading to the iconic Arch Rock."
                      />
                      <TrailCard
                        name="Fort Holmes Loop"
                        distance="3.4 miles"
                        duration="1.5 hours"
                        difficulty="Moderate"
                        description="Scenic hike offering historical landmarks and panoramic views."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  const renderPackingPage = () => {
    const clothingQuantities = calculateClothingQuantities(trip.duration.nights);

    return (
      <div className="space-y-6">
        {/* Gear Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Gear</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Tent</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sleeping Mat</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sleeping Bag</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Day Hike Bag</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Towel</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Bug Spray</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sunscreen</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Duct Tape</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>First Aid Kit</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Garbage Bags</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Paper Towel</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Zip Lock Bags (Packing Lunches)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cooking Necessities Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Cooking Necessities</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Camping Stove / Gas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Lighter</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Pot</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Pan</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Camping Bowl</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Utensils</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sharp Knife</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Cutting Board</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Spatula</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Spork (Spoon, Fork, Knife)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Cooking Spray or Olive Oil</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Salt and Pepper</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clothing Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Clothing</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.tshirts}) T-Shirts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.longSleeves}) Long Sleeve</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.shorts}) Shorts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.pants}) Pants</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.sweatshirts}) Sweatshirts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.sweatpants}) Sweatpant</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Nicer Outfit (Depending on Dinner Plans)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Rain Jacket</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Light Jacket</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>(1) Bathing Suit</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>({clothingQuantities.underwearSocks}) Underwear / Socks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Shoes Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Shoes</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Hiking Boots</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Gym Shoes</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Water Shoes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Accessories Section */}
        <div>
          <h2 className="text-2xl font-display text-[#194027] mb-4">Accessories</h2>
          <div className="bg-beige/10 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Baseball Hat</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Sunglasses</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Hat and Light Gloves (Depending on Weather)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Portable Charger</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark"></div>
                <span>Camera</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderRecipesPage = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-3">Breakfast Recipes</h2>
        <div className="grid gap-4">
          <div className="bg-beige/10 rounded-lg p-3">
            <h3 className="font-medium mb-2">Campfire Breakfast Burritos</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Eggs</li>
                  <li>• Tortillas</li>
                  <li>• Cheese</li>
                  <li>• Bell peppers</li>
                  <li>• Onions</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Instructions:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Scramble eggs in a pan</li>
                  <li>Sauté vegetables</li>
                  <li>Warm tortillas</li>
                  <li>Assemble burritos</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Dinner Recipes</h2>
        <div className="grid gap-4">
          <div className="bg-beige/10 rounded-lg p-3">
            <h3 className="font-medium mb-2">Foil Packet Fajitas</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Chicken or beef strips</li>
                  <li>• Bell peppers</li>
                  <li>• Onions</li>
                  <li>• Fajita seasoning</li>
                  <li>• Tortillas</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Instructions:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Slice vegetables and meat</li>
                  <li>Season ingredients</li>
                  <li>Create foil packets</li>
                  <li>Cook over campfire for 20-25 minutes</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FFF6ED] rounded-lg">
      {/* Navigation */}
      <div className="bg-[#194027]">
        <nav className="flex overflow-x-auto hide-scrollbar">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                currentPage === item.id
                  ? 'border-beige text-beige'
                  : 'border-transparent text-beige/60 hover:text-beige/80'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentPage === 'overview' && renderOverviewPage()}
        {currentPage === 'recommendations' && renderRecommendationsPage()}
        {currentPage === 'packing' && renderPackingPage()}
        {currentPage === 'recipes' && renderRecipesPage()}
      </div>
    </div>
  );
};