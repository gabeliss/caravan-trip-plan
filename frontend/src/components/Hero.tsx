import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DateRangePicker } from './DateRangePicker';
import { TripDuration } from '../types';
import { Map, Calendar, Clock, CheckCircle, ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { destinations } from '../data/destinations';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  duration: TripDuration;
  setDuration: React.Dispatch<React.SetStateAction<TripDuration>>;
  onDateSelect: (date: Date, guestCount: number) => void;
}

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

const Hero: React.FC<HeroProps> = ({ duration, setDuration, onDateSelect }) => {
  const navigate = useNavigate();
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const handleLearnMore = (destinationId: string) => {
    navigate(`/destinations/${destinationId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps: Step[] = [
    {
      title: "Curate Your Trip",
      description: "Browse a list of camping sites with live pricing, availability, amenities, and cancellation policies. No need to hunt for these details on multiple sites.\n\nChoose the camping spots you like best\n\nReview your entire road trip",
      icon: Calendar,
      image: "https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742762133/images-caravan/directions_page/gfmxj6anwdcs54avocli.jpg"
    },
    {
      title: "Book with Confidence",
      description: "Secure your reservations through official booking platforms. We'll provide direct links to each campground's booking system.\n\nGet instant confirmation\n\nAccess your comprehensive trip guide",
      icon: Map,
      image: "https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742762132/images-caravan/directions_page/j4fxoucknyt38uqpkabc.jpg"
    },
    {
      title: "Prepare for Adventure",
      description: "Access your detailed trip guide with everything you need to know. From driving directions to local attractions.\n\nPack with our curated checklist\n\nFollow our pre-trip preparation guide",
      icon: Clock,
      image: "https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742762133/images-caravan/directions_page/xerokq8b6un1gel6qbun.jpg"
    },
    {
      title: "Hit the Road",
      description: "Start your journey with confidence. Your trip guide includes offline access to all essential information.\n\nFollow your custom itinerary\n\nEnjoy worry-free camping",
      icon: CheckCircle,
      image: "https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742762133/images-caravan/directions_page/zznq6qpnndetdkuknjlm.jpg"
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (!stepsContainerRef.current) return;
    
    const container = stepsContainerRef.current;
    const scrollAmount = container.clientWidth;
    const newScrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!stepsContainerRef.current) return;
    
    const container = stepsContainerRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
    
    // Update current step index based on scroll position
    // Calculate more accurately for responsive layouts
    const stepWidth = container.clientWidth;
    const newIndex = Math.round(container.scrollLeft / stepWidth);
    // Ensure we don't go out of bounds
    const safeIndex = Math.min(newIndex, steps.length - 1);
    setCurrentStepIndex(safeIndex);
  };

  // Ensure scroll event is handled on component mount and screen size changes
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (container) {
      // Initial scroll position check
      handleScroll();
      
      // Add resize listener to update arrows when window size changes
      const handleResize = () => {
        handleScroll();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-screen">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742416690/background_k034v8.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12 md:mb-16 px-4"
          >
            <h1 className="text-[1.75rem] leading-tight sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-[#194027] max-w-[24ch] mx-auto">
              The ultimate road trip companion for hassle-free outdoor experiences
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#194027]/80 max-w-[30ch] mx-auto">
              Plan your perfect adventure with our step-by-step guide
            </p>
          </motion.div>

          <DateRangePicker
            onSelect={onDateSelect}
            duration={duration}
            setDuration={setDuration}
          />
        </div>
      </div>

      {/* About Section */}
      <section className="bg-[#FFF6ED] py-24">
        <div className="max-w-[2000px] mx-auto px-0">
          <div className="grid md:grid-cols-2 gap-12 items-center px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-[#194027] leading-tight">
                About<br />Caravan Trip Plan
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-5lg text-[#194027] leading-relaxed">
                Caravan Trip Plan is your premier destination for effortless road trip adventures. We understand that planning a road trip can be overwhelming, from mapping out routes to securing the perfect campsites. That's why we've designed Caravan Trip Plan, a revolutionary travel guide that simplifies your journey like never before.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[2000px] mx-auto px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 px-4"
          >
            <h2 className="text-4xl font-bold text-[#194027] mb-4">How It Works</h2>
            <p className="text-lg text-[#194027]/80">
              Your journey to the perfect road trip in four simple steps
            </p>
          </motion.div>

          <div className="relative">
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 shadow-md transition-colors duration-200"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 shadow-md transition-colors duration-200"
                aria-label="Next step"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div
              ref={stepsContainerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-8 pb-8 px-4 group"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-none w-full md:w-[800px] snap-center"
                >
                  <div className="flex flex-col md:grid md:grid-cols-2 h-[500px] bg-[#FFF6ED] rounded-2xl overflow-hidden">
                    <div className="relative h-[250px] md:h-full order-1 md:order-2">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center flex-grow order-2 md:order-1">
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-[#194027] mb-6 md:mb-8">
                        {step.title}
                      </h3>
                      <div className="space-y-4 text-[#194027]/80 whitespace-pre-line text-sm md:text-base">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dots indicator for navigation - only show on mobile */}
            <div className="md:hidden flex justify-center gap-2 mt-6">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentStepIndex ? 'bg-primary w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => {
                    if (stepsContainerRef.current) {
                      const position = index * stepsContainerRef.current.clientWidth;
                      stepsContainerRef.current.scrollTo({
                        left: position,
                        behavior: 'smooth'
                      });
                      setCurrentStepIndex(index);
                    }
                  }}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-24 bg-[#FFF6ED]">
        <div className="max-w-[2000px] mx-auto px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 px-4"
          >
            <h2 className="text-4xl font-display text-[#194027] mb-4">Our Trips</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 px-4">
            {/* Northern Michigan */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative w-full pt-8 overflow-hidden">
                  <div 
                    className="relative text-center mb-2"
                  >
                    <div 
                      className="text-[#194027] font-display text-[0.7em] md:text-[0.8em] tracking-wider"
                      style={{
                        transform: 'perspective(100px) rotateX(10deg)',
                        transformOrigin: 'bottom',
                        letterSpacing: '0.1em'
                      }}
                    >
                      Northern Michigan
                    </div>
                  </div>

                  <div 
                    onClick={() => handleLearnMore(destinations[0].id)}
                    className="relative w-full aspect-square cursor-pointer group"
                  >
                    <img
                      src={destinations[0].imageUrl}
                      alt={destinations[0].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-[#194027]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-beige font-display text-lg">Learn More</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Arizona */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative w-full pt-8 overflow-hidden">
                  <div 
                    className="relative text-center mb-2"
                  >
                    <div 
                      className="text-[#194027] font-display text-[0.7em] md:text-[0.8em] tracking-wider"
                      style={{
                        transform: 'perspective(100px) rotateX(10deg)',
                        transformOrigin: 'bottom',
                        letterSpacing: '0.1em'
                      }}
                    >
                      Arizona
                    </div>
                  </div>

                  <div 
                    onClick={() => handleLearnMore(destinations[1].id)}
                    className="relative w-full aspect-square cursor-pointer group"
                  >
                    <img
                      src={destinations[1].imageUrl}
                      alt={destinations[1].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-[#194027]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-beige font-display text-lg">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Washington */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative w-full pt-8 overflow-hidden">
                  <div 
                    className="relative text-center mb-2"
                  >
                    <div 
                      className="text-[#194027] font-display text-[0.7em] md:text-[0.8em] tracking-wider"
                      style={{
                        transform: 'perspective(100px) rotateX(10deg)',
                        transformOrigin: 'bottom',
                        letterSpacing: '0.1em'
                      }}
                    >
                      Washington
                    </div>
                  </div>

                  <div 
                    onClick={() => handleLearnMore(destinations[2].id)}
                    className="relative w-full aspect-square cursor-pointer group"
                  >
                    <img
                      src={destinations[2].imageUrl}
                      alt={destinations[2].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-[#194027]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-beige font-display text-lg">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Smoky Mountains */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative w-full pt-8 overflow-hidden">
                  <div 
                    className="relative text-center mb-2"
                  >
                    <div 
                      className="text-[#194027] font-display text-[0.7em] md:text-[0.8em] tracking-wider"
                      style={{
                        transform: 'perspective(100px) rotateX(10deg)',
                        transformOrigin: 'bottom',
                        letterSpacing: '0.1em'
                      }}
                    >
                      Smoky Mountains
                    </div>
                  </div>

                  <div 
                    onClick={() => handleLearnMore(destinations[3].id)}
                    className="relative w-full aspect-square cursor-pointer group"
                  >
                    <img
                      src={destinations[3].imageUrl}
                      alt={destinations[3].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-[#194027]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-beige font-display text-lg">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Southern California */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative w-full pt-8 overflow-hidden">
                  <div 
                    className="relative text-center mb-2"
                  >
                    <div 
                      className="text-[#194027] font-display text-[0.7em] md:text-[0.8em] tracking-wider"
                      style={{
                        transform: 'perspective(100px) rotateX(10deg)',
                        transformOrigin: 'bottom',
                        letterSpacing: '0.1em'
                      }}
                    >
                      Southern California
                    </div>
                  </div>

                  <div 
                    onClick={() => handleLearnMore(destinations[4].id)}
                    className="relative w-full aspect-square cursor-pointer group"
                  >
                    <img
                      src={destinations[4].imageUrl}
                      alt={destinations[4].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 bg-[#194027]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-beige font-display text-lg">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;

export { Hero }