import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Home, Mountain, Coffee, 
  Utensils, Camera, ArrowLeft, ArrowRight, Wine, 
  Bike, Ship, Tent, Sun, Trees as Tree, Palmtree, 
  Waves, CloudSun, ChevronLeft, ChevronRight,
  LucideIcon
} from 'lucide-react';
import { destinations } from '../data/destinations';
import tripOverviewsData from '../info/trip-overviews.json';

interface HighlightData {
  type: string;
  name: string;
  description: string;
  iconName: string;
  image?: string;
  images?: string[];
}

interface LocationContentData {
  subtitle: string;
  description: string;
  bestTimeToVisit: string;
  suggestedDuration: string;
  activities: string[];
  accommodation: string;
  highlights: HighlightData[];
}

interface Highlight {
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  images?: string[];
}

interface LocationContent {
  subtitle: string;
  description: string;
  bestTimeToVisit: string;
  suggestedDuration: string;
  activities: string[];
  accommodation: string;
  highlights: Highlight[];
}

const iconMap: Record<string, LucideIcon> = {
  Mountain,
  Utensils,
  Ship,
  Sun,
  Tree,
  Waves,
  Bike,
  Camera,
  Wine,
  Palmtree,
  CloudSun
};

export const TripOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const destination = destinations.find(d => d.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [isHovering, setIsHovering] = useState<Record<string, boolean>>({});
  
  const initialized = useRef(false);
  const loggedImages = useRef(false);

  const rawContent = id ? (tripOverviewsData as Record<string, LocationContentData>)[id] : undefined;
  
  const content: LocationContent | undefined = rawContent ? {
    ...rawContent,
    highlights: rawContent.highlights.map(highlight => ({
      ...highlight,
      icon: iconMap[highlight.iconName] || Mountain // Default to Mountain if icon not found
    }))
  } : undefined;

  const getHighlightImages = (highlight: Highlight): string[] => {
    // First check for images array (like in Farm Club case)
    if (highlight.images && highlight.images.length > 0) {
      return highlight.images;
    }
    
    // Then check for a single image property
    if (highlight.image) {
      return [highlight.image];
    }
    
    // Fallback to a default image
    return ['https://images.unsplash.com/photo-1496545672447-f699b503d270?auto=format&fit=crop&q=80'];
  };

  useEffect(() => {
    if (!content || !content.highlights.length) return;
  
    const initialIndices: Record<string, number> = {};
    content.highlights.forEach((_, index) => {
      initialIndices[index] = 0;
    });
    setCurrentImageIndex(initialIndices);
    initialized.current = true;
  
    return () => {
      initialized.current = false;
    };
  }, [id]);
  

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

  const handlePrevImage = (highlightIndex: number) => {
    const imageArray = getHighlightImages(content.highlights[highlightIndex]);
    setCurrentImageIndex(prev => ({
      ...prev,
      [highlightIndex]: prev[highlightIndex] > 0 ? prev[highlightIndex] - 1 : imageArray.length - 1
    }));
  };

  const handleNextImage = (highlightIndex: number) => {
    const imageArray = getHighlightImages(content.highlights[highlightIndex]);
    setCurrentImageIndex(prev => ({
      ...prev,
      [highlightIndex]: (prev[highlightIndex] + 1) % imageArray.length
    }));
  };

  const handleDotClick = (highlightIndex: number, imageIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [highlightIndex]: imageIndex
    }));
  };

  return (
    <div className="min-h-screen bg-beige-light">
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
              {content.highlights.map((highlight, index) => {
                const highlightImages = getHighlightImages(highlight);
                const currentIndex = currentImageIndex[index] !== undefined ? currentImageIndex[index] : 0;
                
                return (
                  <div key={highlight.type + index} className="relative">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                      <div className={`order-1 md:${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
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
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                            <div className="relative w-full h-full">
                              {highlightImages.map((image, imageIndex) => (
                                image.toLowerCase().endsWith('.mov') ? (
                                  <motion.video
                                    key={imageIndex}
                                    src={image}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="absolute w-full h-full object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ 
                                      opacity: currentIndex === imageIndex ? 1 : 0,
                                      zIndex: currentIndex === imageIndex ? 1 : 0
                                    }}
                                  />
                                ) : (
                                  <motion.img
                                    key={imageIndex}
                                    src={image}
                                    alt={`${highlight.name} - View ${imageIndex + 1}`}
                                    className="absolute w-full h-full object-cover transition-opacity duration-300"
                                    initial={{ opacity: 0 }}
                                    animate={{ 
                                      opacity: currentIndex === imageIndex ? 1 : 0,
                                      zIndex: currentIndex === imageIndex ? 1 : 0
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load image: ${image}`);
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80";
                                    }}
                                  />
                                )
                              ))}
                            </div>
                          </div>

                          {/* Navigation */}
                          {highlightImages.length > 1 && (
                            <>
                              {/* Image count indicator */}
                              <div className="absolute top-4 right-4 bg-[#194027] text-white px-3 py-2 rounded-md text-sm font-medium z-10">
                                {currentIndex + 1} / {highlightImages.length}
                              </div>
                            
                              {/* Navigation buttons */}
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                                <button
                                  type="button"
                                  onClick={() => handlePrevImage(index)}
                                  className="h-12 w-12 flex items-center justify-center bg-white border-2 border-[#194027] rounded-full shadow-lg hover:bg-[#f0f0f0] transition-colors"
                                >
                                  <ChevronLeft className="w-8 h-8 text-[#194027]" />
                                </button>
                              </div>
                              
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                                <button
                                  type="button"
                                  onClick={() => handleNextImage(index)}
                                  className="h-12 w-12 flex items-center justify-center bg-white border-2 border-[#194027] rounded-full shadow-lg hover:bg-[#f0f0f0] transition-colors"
                                >
                                  <ChevronRight className="w-8 h-8 text-[#194027]" />
                                </button>
                              </div>

                              {/* Pagination dots */}
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 px-3 py-2 rounded-full z-10">
                                {highlightImages.map((_, imageIndex) => (
                                  <button
                                    key={imageIndex}
                                    type="button"
                                    onClick={() => handleDotClick(index, imageIndex)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                      currentIndex === imageIndex 
                                        ? 'bg-white' 
                                        : 'bg-white/40 hover:bg-white/60'
                                    }`}
                                    aria-label={`Go to image ${imageIndex + 1}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
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
  );
};