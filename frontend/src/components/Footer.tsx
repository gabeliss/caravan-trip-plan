import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTripPlan } from '../context/TripPlanContext';
import { FaTiktok, FaInstagram } from 'react-icons/fa';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className }) => {
  const { clearSelectedCampgrounds } = useTripPlan();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearSelectedCampgrounds();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

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
              <a href="https://instagram.com/caravantripplan" target="_blank" rel="noopener noreferrer" className="text-beige/70 hover:text-beige transition-colors" aria-label="Instagram">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@caravan.trip.plan" target="_blank" rel="noopener noreferrer" className="text-beige/70 hover:text-beige transition-colors" aria-label="TikTok">
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div className="col-span-1">
            <h3 className="font-display text-beige text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/destinations/northern-michigan" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Northern Michigan
                </NavLink>
              </li>
              <li>
                <NavLink to="/destinations/arizona" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Arizona
                </NavLink>
              </li>
              <li>
                <NavLink to="/destinations/washington" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Washington
                </NavLink>
              </li>
              <li>
                <NavLink to="/destinations/smoky-mountains" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Smoky Mountains
                </NavLink>
              </li>
              <li>
                <NavLink to="/destinations/southern-california" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  Southern California
                </NavLink>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Resources */}
          <div className="col-span-1">
            <h3 className="font-display text-beige text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/about" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className="text-beige/70 hover:text-beige transition-colors text-sm">
                  My Trips
                </NavLink>
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
                <span className="text-beige/70 text-sm">(248) 904-7411</span>
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
              <NavLink to="/privacy" className="text-xs text-beige/60 hover:text-beige transition-colors">
                Privacy Policy
              </NavLink>
              <NavLink to="/terms" className="text-xs text-beige/60 hover:text-beige transition-colors">
                Terms of Service
              </NavLink>
              <NavLink to="/sitemap" className="text-xs text-beige/60 hover:text-beige transition-colors">
                Sitemap
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 