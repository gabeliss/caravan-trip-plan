import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

// TikTok icon as an SVG component since it's not included in lucide-react
const TikTokIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    <path d="M16 8v8a5 5 0 0 1-5 5h0a5 5 0 0 1-5-5v0a5 5 0 0 1 5-5h3" />
    <path d="M22 2v7a1 1 0 0 1-1 1h0a1 1 0 0 1-1-1V5h-6" />
    <path d="M15 8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3z" />
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#194027] text-beige/90 pt-12 pb-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <img 
                src="https://res.cloudinary.com/dmyrs1fbl/image/upload/v1742417228/CaravanTripPlan_d6vaqk.png" 
                alt="Caravan Trip Plan Logo" 
                className="h-16 w-auto brightness-[1.15] contrast-[1.05]" 
              />
            </div>
            <p className="text-sm text-beige/70 mb-4">
              Your ultimate road trip companion for hassle-free outdoor experiences.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-beige/70 hover:text-beige transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-beige/70 hover:text-beige transition-colors" aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-beige/70 hover:text-beige transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-beige/70 hover:text-beige transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div className="col-span-1">
            <h3 className="font-display text-beige text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/destinations/northern-michigan" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Northern Michigan
                </Link>
              </li>
              <li>
                <Link to="/destinations/arizona" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Arizona
                </Link>
              </li>
              <li>
                <Link to="/destinations/washington" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Washington
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Resources */}
          <div className="col-span-1">
            <h3 className="font-display text-beige text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Travel Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Camping Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Gear Reviews
                </a>
              </li>
              <li>
                <a href="#" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Trip Planning Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div className="col-span-1">
            <h3 className="font-display text-beige text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-beige/70 mt-0.5" />
                <span className="text-beige/70 text-sm">caravantripplan@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-beige/70 mt-0.5" />
                <span className="text-beige/70 text-sm">(555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-beige/70 mt-0.5" />
                <span className="text-beige/70 text-sm">
                  Traverse City, MI<br />
                  United States
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="pt-6 border-t border-beige/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-beige/60 mb-4 md:mb-0">
              &copy; {currentYear} Caravan Trip Plan. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-xs text-beige/60 hover:text-beige transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-beige/60 hover:text-beige transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-xs text-beige/60 hover:text-beige transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 