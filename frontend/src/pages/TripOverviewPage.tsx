import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Home, Mountain, Coffee, 
  Utensils, Camera, ArrowLeft, ArrowRight, Wine, 
  Bike, Ship, Tent, Sun, Trees as Tree, Palmtree, 
  Waves, CloudSun, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { destinations } from '../data/destinations';
import { MapView } from '../components/Map';
import { Navigation } from '../components/Navigation';

const locationContent = {
  'northern-michigan': {
    subtitle: 'Great Lakes Getaway',
    description: 'Experience the pristine beauty of Northern Michigan, from the crystal-clear waters of Lake Michigan to the charming coastal towns and dense forests that dot the landscape. This carefully crafted journey takes you through some of the most scenic parts of the Great Lakes State.',
    bestTimeToVisit: 'May-October',
    suggestedDuration: '6 Nights',
    activities: ['Hiking', 'Kayaking', 'Wine Tasting', 'Beach Activities'],
    accommodation: 'Tent & RV Camping',
    highlights: [
      {
        type: 'Restaurant',
        name: 'Farm Club',
        description: 'Farm Club seamlessly blends farming, dining, and community. Nestled just outside Traverse City, it offers a unique experience where visitors can enjoy fresh, seasonal meals sourced directly from its own farm, sip on house-brewed beer and cider, and shop a thoughtfully curated market.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
        icon: Utensils
      },
      {
        type: 'Activity',
        name: 'Pictured Rocks Kayaking',
        description: 'Experience the majestic Pictured Rocks National Lakeshore from a unique perspective as you paddle along towering cliffs, through natural stone arches, and past stunning mineral-stained rock formations.',
        image: 'https://images.unsplash.com/photo-1576012998140-969b99564c1a?auto=format&fit=crop&q=80',
        icon: Ship
      },
      {
        type: 'Trail',
        name: 'Chapel Rock Trail',
        description: 'This iconic 6.2-mile loop trail offers the perfect blend of forest hiking and Lake Superior shoreline views. The trail leads to Chapel Rock, a unique geological formation topped by a lone pine tree.',
        image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80',
        icon: Mountain
      }
    ]
  },
  'arizona': {
    subtitle: 'Desert Southwest Adventure',
    description: 'Discover the dramatic landscapes and rich cultural heritage of Arizona. From the majestic Grand Canyon to the red rocks of Sedona, this journey showcases the diverse beauty of the American Southwest.',
    bestTimeToVisit: 'October-April',
    suggestedDuration: '7 Nights',
    activities: ['Hiking', 'Photography', 'Rock Climbing', 'Cultural Tours'],
    accommodation: 'Desert Camping',
    highlights: [
      {
        type: 'Natural Wonder',
        name: 'Grand Canyon Sunrise',
        description: 'Experience the breathtaking transformation of the Grand Canyon as dawn breaks over the horizon, painting the ancient rock layers in brilliant hues of red, orange, and gold.',
        image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&q=80',
        icon: Sun
      },
      {
        type: 'Trail',
        name: 'Cathedral Rock',
        description: 'One of Sedona\'s most iconic formations, Cathedral Rock trail offers a challenging but rewarding climb with stunning panoramic views of the red rock landscape.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80',
        icon: Mountain
      },
      {
        type: 'Activity',
        name: 'Antelope Canyon Tour',
        description: 'Explore the mesmerizing slot canyons carved by wind and water, where sunbeams create spectacular light shows in the narrow, twisting passages.',
        image: 'https://images.unsplash.com/photo-1602785674419-a3295d0d9828?auto=format&fit=crop&q=80',
        icon: Camera
      }
    ]
  },
  'washington': {
    subtitle: 'Pacific Northwest Explorer',
    description: 'Journey through Washington\'s diverse landscapes, from rainforests to volcanic peaks. Experience the raw beauty of the Pacific Northwest with its ancient forests, rugged coastline, and alpine meadows.',
    bestTimeToVisit: 'July-September',
    suggestedDuration: '8 Nights',
    activities: ['Hiking', 'Wildlife Watching', 'Photography', 'Kayaking'],
    accommodation: 'Forest Camping',
    highlights: [
      {
        type: 'National Park',
        name: 'Olympic Rainforest',
        description: 'Immerse yourself in one of the largest temperate rainforests in the U.S., where ancient trees draped in moss create an otherworldly atmosphere.',
        image: 'https://images.unsplash.com/photo-1508693926297-1d61ee3df82a?auto=format&fit=crop&q=80',
        icon: Tree
      },
      {
        type: 'Activity',
        name: 'Whale Watching',
        description: 'Set sail from the San Juan Islands to spot orcas, humpback whales, and other marine wildlife in their natural habitat.',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80',
        icon: Waves
      },
      {
        type: 'Trail',
        name: 'Mount Rainier Skyline',
        description: 'Hike through subalpine meadows with stunning views of Mount Rainier, especially beautiful during wildflower season.',
        image: 'https://images.unsplash.com/photo-1467890947394-8171244e5410?auto=format&fit=crop&q=80',
        icon: Mountain
      }
    ]
  },
  'smoky-mountains': {
    subtitle: 'Appalachian Adventure',
    description: 'Explore America\'s most visited national park, where misty mountains, diverse wildlife, and rich cultural heritage create an unforgettable experience.',
    bestTimeToVisit: 'March-November',
    suggestedDuration: '5 Nights',
    activities: ['Hiking', 'Wildlife Viewing', 'Scenic Drives', 'Historical Sites'],
    accommodation: 'Mountain Camping',
    highlights: [
      {
        type: 'Trail',
        name: 'Alum Cave Trail',
        description: 'A dramatic trail featuring unique geological formations, mountain views, and historic sites, leading to Mount LeConte.',
        image: 'https://images.unsplash.com/photo-1508091073125-ced32109d0ee?auto=format&fit=crop&q=80',
        icon: Mountain
      },
      {
        type: 'Activity',
        name: 'Cades Cove Loop',
        description: 'Cycle or drive through this scenic valley, rich in wildlife and historic buildings from early European settlements.',
        image: 'https://images.unsplash.com/photo-1508018149381-4a6aa2c0e0c3?auto=format&fit=crop&q=80',
        icon: Bike
      },
      {
        type: 'Experience',
        name: 'Firefly Viewing',
        description: 'Witness the magical synchronous fireflies during their annual mating display, a rare natural phenomenon.',
        image: 'https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?auto=format&fit=crop&q=80',
        icon: CloudSun
      }
    ]
  },
  'southern-california': {
    subtitle: 'Pacific Coast Paradise',
    description: 'Experience the diverse landscapes of Southern California, from coastal highways to desert national parks, combining urban excitement with natural wonders.',
    bestTimeToVisit: 'Year-round',
    suggestedDuration: '7 Nights',
    activities: ['Beach Activities', 'Desert Hiking', 'Surfing', 'National Parks'],
    accommodation: 'Beach & Desert Camping',
    highlights: [
      {
        type: 'National Park',
        name: 'Joshua Tree',
        description: 'Explore the unique desert landscape where two distinct desert ecosystems meet, featuring the iconic Joshua trees and dramatic rock formations.',
        image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&q=80',
        icon: Palmtree
      },
      {
        type: 'Activity',
        name: 'Pacific Coast Highway',
        description: 'Drive along one of America\'s most scenic routes, stopping at pristine beaches and coastal viewpoints.',
        image: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80',
        icon: Waves
      },
      {
        type: 'Experience',
        name: 'Channel Islands',
        description: 'Kayak through sea caves and spot unique wildlife on these remote and pristine islands off the coast.',
        image: 'https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&q=80',
        icon: Ship
      }
    ]
  }
};

export const TripOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const destination = destinations.find(d => d.id === id);
  const content = locationContent[id || ''];
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [isHovering, setIsHovering] = useState<Record<string, boolean>>({});

  if (!destination || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary-dark hover:text-primary-dark/80"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const getHighlightImages = (highlight: typeof content.highlights[0]) => {
    switch (highlight.type) {
      case 'Restaurant':
        return [
          highlight.image,
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80'
        ];
      case 'Activity':
        return [
          highlight.image,
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1530870110042-98b2cb110834?auto=format&fit=crop&q=80'
        ];
      case 'Trail':
        return [
          highlight.image,
          'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80'
        ];
      default:
        return [highlight.image];
    }
  };

  const handlePrevImage = (highlightIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [highlightIndex]: prev[highlightIndex] > 0 ? prev[highlightIndex] - 1 : getHighlightImages(content.highlights[highlightIndex]).length - 1
    }));
  };

  const handleNextImage = (highlightIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [highlightIndex]: (prev[highlightIndex] + 1) % getHighlightImages(content.highlights[highlightIndex]).length
    }));
  };

  return (
    <div className="min-h-screen bg-beige-light">
      <Navigation />
      
      <div className="relative">
        <div className="bg-beige-light text-primary-dark">
          <div className="max-w-7xl mx-auto px-4 pt-8">
            <button
              onClick={() => navigate('/')}
              className="text-primary-dark/80 hover:text-primary-dark flex items-center gap-2 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>

            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl text-[#DC7644] mb-4">
                {content.subtitle}
              </h2>
              <h1 className="font-display text-4xl md:text-6xl">
                {destination.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-[#194027] text-beige">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h3 className="font-display text-2xl mb-8">A Typical Trip</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Calendar className="w-6 h-6" />
                <p className="text-beige/60">Best Time to Visit</p>
                <p className="font-display text-lg">{content.bestTimeToVisit}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Clock className="w-6 h-6" />
                <p className="text-beige/60">Suggested Duration</p>
                <p className="font-display text-lg">{content.suggestedDuration}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Mountain className="w-6 h-6" />
                <p className="text-beige/60">Activities</p>
                <p className="font-display text-lg">{content.activities.join(', ')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Tent className="w-6 h-6" />
                <p className="text-beige/60">Accommodation</p>
                <p className="font-display text-lg">{content.accommodation}</p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-beige-light py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h2 className="font-display text-4xl text-[#DC7644] mb-6">
                Want The Full Itinerary?
              </h2>
              <button
                onClick={() => navigate('/', { state: { selectedDestination: destination } })}
                className="inline-flex items-center gap-2 border border-[#194027] bg-beige-light text-[#194027] px-8 py-4 rounded-full hover:bg-[#194027] hover:text-beige transition-colors text-lg font-medium"
              >
                Book a Trip
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-beige-light">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="mb-20">
              <p className="text-xl text-gray-600 max-w-3xl">
                {content.description}
              </p>
            </div>

            <div className="space-y-32">
              {content.highlights.map((highlight, index) => (
                <div key={highlight.type} className="relative">
                  <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                      <div className="flex items-center gap-3 mb-4">
                        <highlight.icon className="w-6 h-6 text-[#DC7644]" />
                        <h3 className="font-display text-2xl">{highlight.type}</h3>
                      </div>
                      <h2 className="font-display text-5xl text-[#DC7644] mb-6">
                        {highlight.name}
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>

                    <div 
                      className={index % 2 === 0 ? 'order-2' : 'order-1'}
                      onMouseEnter={() => setIsHovering(prev => ({ ...prev, [index]: true }))}
                      onMouseLeave={() => setIsHovering(prev => ({ ...prev, [index]: false }))}
                    >
                      <div className="relative group">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden">
                          <div className="relative w-full h-full">
                            {getHighlightImages(highlight).map((image, imageIndex) => (
                              <motion.img
                                key={imageIndex}
                                src={image}
                                alt={`${highlight.name} - View ${imageIndex + 1}`}
                                className="absolute w-full h-full object-cover transition-opacity duration-300"
                                initial={{ opacity: 0 }}
                                animate={{ 
                                  opacity: currentImageIndex[index] === imageIndex ? 1 : 0,
                                  zIndex: currentImageIndex[index] === imageIndex ? 1 : 0
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {getHighlightImages(highlight).length > 1 && (
                          <>
                            <button
                              onClick={() => handlePrevImage(index)}
                              className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-all md:opacity-0 md:group-hover:opacity-100 ${
                                isHovering[index] ? 'opacity-100' : 'opacity-50'
                              }`}
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleNextImage(index)}
                              className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-all md:opacity-0 md:group-hover:opacity-100 ${
                                isHovering[index] ? 'opacity-100' : 'opacity-50'
                              }`}
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {getHighlightImages(highlight).map((_, imageIndex) => (
                            <button
                              key={imageIndex}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, [index]: imageIndex }))}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                currentImageIndex[index] === imageIndex 
                                  ? 'bg-white' 
                                  : 'bg-white/40 hover:bg-white/60'
                              }`}
                              aria-label={`Go to image ${imageIndex + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};