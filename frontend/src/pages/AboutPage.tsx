import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Map, Heart, Compass, Calendar, Users, 
  ChevronLeft, ChevronRight, ArrowRight 
} from 'lucide-react';

const timelineEvents = [
  {
    year: '2021',
    title: 'The Great American Road Trip',
    description: "In the summer of 2021, a cross-country adventure set everything in motion. Cara set out on a 25-day road trip across the United States. From Arizona to Utah to Colorado, each stop brought unforgettable moments. But behind every perfect view was hours of research, multiple booking platforms, and the constant stress of wondering if the next destination would live up to expectations. It became clear that while the open road offered freedom, planning the journey felt anything but free.",
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80'
  },
  {
    year: '2023',
    title: 'From Frustration to Innovation',
    description: 'That road trip wasn&apos;t just a personal milestone—it uncovered a gap in the travel experience that Cara couldn&apos;t ignore. The process of piecing together campgrounds, cabins, and road trip routes from scattered sources was exhausting. There was no single place that offered a seamless way to plan, book, and trust an entire journey from start to finish. Out of this frustration, an idea began to take shape. What if there was a platform that did the heavy lifting? What if road trips could be exciting to plan, not overwhelming?',
    image: 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?auto=format&fit=crop&q=80'
  },
  {
    year: '2025',
    title: 'Caravan Trip Plan is Born',
    description: 'With that vision, Caravan Trip Plan was created—a trip planning platform built to make road trips easy and reliable. Designed for travelers who want to explore the outdoors without getting lost in the logistics, Caravan curates full itineraries that are ready to book and tailored to each traveler. It&apos;s a new way to experience the freedom of the road, with the confidence that every stop has been thoughtfully chosen.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80'
  }
];

const popularRoutes = [
  {
    name: 'Northern Michigan Explorer',
    duration: '6 nights',
    highlights: ['Traverse City', 'Mackinac Island', 'Pictured Rocks'],
    coordinates: [-85.6206, 44.7631]
  },
  {
    name: 'Pacific Northwest Adventure',
    duration: '8 nights',
    highlights: ['Olympic National Park', 'Mount Rainier', 'San Juan Islands'],
    coordinates: [-121.5708, 47.7511]
  },
  {
    name: 'Desert Southwest Journey',
    duration: '7 nights',
    highlights: ['Grand Canyon', 'Sedona', 'Monument Valley'],
    coordinates: [-111.0937, 34.0489]
  }
];

export const AboutPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <div className="min-h-screen bg-[#FFF6ED]">
      {/* Title Section */}
      <div className="bg-white pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-display text-[#22342B] mb-8">
              Our Story
            </h1>
            <p className="text-M text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Caravan Trip Plan was founded by Cara with a simple goal—to make road trip planning easier. After experiencing firsthand the challenges of booking a seamless journey, she set out to create a platform that takes the stress out of the process, so travelers can focus on the experience, not the logistics.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={containerRef} className="pt-12 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div style={{ opacity, y }} className="space-y-32">
            {timelineEvents.map((event, index) => (
              <div key={event.year} className="relative">
                <div className="grid md:grid-cols-2 gap-16 items-center will-change-transform backface-visible">
                  <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                    <span className="text-[#DC7644] font-display text-xl">{event.year}</span>
                    <h2 className="text-4xl font-display text-[#22342B] mt-2 mb-6">{event.title}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">{event.description}</p>
                  </div>
                  <div className={`${index % 2 === 0 ? 'order-2' : 'order-1'} aspect-[4/3] rounded-xl overflow-hidden`}>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transform-gpu"
                      style={{
                        imageRendering: 'high-quality',
                        backfaceVisibility: 'hidden'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-[#22342B] text-beige">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display mb-6">Our Mission</h2>
            <p className="text-xl text-beige/80 max-w-2xl mx-auto">
              To transform the way people experience the outdoors by making road trip planning seamless, inspiring, and accessible to all.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Stress-Free Planning',
                description: 'Curated routes and seamless booking across multiple destinations.'
              },
              {
                icon: Heart,
                title: 'Quality Experiences',
                description: 'Carefully vetted campgrounds and accommodations you can trust.'
              },
              {
                icon: Compass,
                title: 'Adventure for All',
                description: 'Making outdoor exploration accessible and enjoyable for everyone.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-block p-4 bg-beige/10 rounded-full mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display mb-4">{item.title}</h3>
                <p className="text-beige/80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display text-[#22342B] mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of happy travelers who have discovered their perfect outdoor getaway with Caravan.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#22342B] text-beige px-8 py-4 rounded-full hover:bg-[#22342B]/90 transition-colors text-lg">
            Plan Your Trip
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};