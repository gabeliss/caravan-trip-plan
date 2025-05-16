import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, Users, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css';
import { TRIP_ITINERARIES } from '../info/trip_itineraries';

interface TripDetailsEditorProps {
  startDate: Date;
  nights: number;
  adultCount: number;
  childCount: number;
  destinationId?: string;
  onUpdate?: (newDetails: {
    startDate: Date;
    nights: number;
    adults: number;
    children: number;
  }) => void;
}

const useDropdownPosition = (buttonRef: React.RefObject<HTMLElement>) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, placement: 'bottom' });
  
  const updatePosition = () => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    const width = rect.width;
    let placement = 'bottom';
    
    if (spaceBelow < 240 && spaceAbove > spaceBelow) {
      placement = 'top';
    }
    
    setPosition({
      top: rect.bottom,
      left: rect.left,
      width,
      placement
    });
  };
  
  useEffect(() => {
    updatePosition();
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [buttonRef]);
  
  return { position, updatePosition };
};

export const TripDetailsEditor: React.FC<TripDetailsEditorProps> = ({
  startDate,
  nights,
  adultCount,
  childCount,
  destinationId = 'northern-michigan',
  onUpdate
}) => {
  // State for edited values
  const [dateValue, setDateValue] = useState<Date>(startDate);
  const [nightsValue, setNightsValue] = useState<number>(nights);
  const [guestCount, setGuestCount] = useState<number>(adultCount + childCount);
  
  // State for collapsible functionality
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Update internal state when props change
  useEffect(() => {
    setGuestCount(adultCount + childCount);
    setNightsValue(nights);
    setDateValue(startDate);
  }, [adultCount, childCount, nights, startDate]);
  
  // Dropdown visibility states
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showNightsDropdown, setShowNightsDropdown] = useState(false);
  
  // Refs for dropdown handling
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const guestButtonRef = useRef<HTMLButtonElement>(null);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const nightsButtonRef = useRef<HTMLButtonElement>(null);
  const nightsDropdownRef = useRef<HTMLDivElement>(null);
  
  // Get position data for dropdowns
  const { position: guestPosition, updatePosition: updateGuestPosition } = useDropdownPosition(guestButtonRef);
  const { position: nightsPosition, updatePosition: updateNightsPosition } = useDropdownPosition(nightsButtonRef);
  const { position: calendarPosition, updatePosition: updateCalendarPosition } = useDropdownPosition(dateButtonRef);
  
  // State for tracking if any value has changed from initial
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  
  const today = startOfToday();
  
  // Get max nights from trip itineraries
  const getMaxNights = () => {
    if (destinationId && TRIP_ITINERARIES[destinationId]) {
      const itineraries = TRIP_ITINERARIES[destinationId];
      return Math.max(...Object.keys(itineraries).map(k => parseInt(k)));
    }
    return 14; // Default fallback
  };

  const maxNights = getMaxNights();
  
  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle calendar dropdown
      if (
        calendarRef.current && 
        !calendarRef.current.contains(event.target as Node) &&
        dateButtonRef.current && 
        !dateButtonRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
      
      // Handle guests dropdown
      if (
        guestDropdownRef.current && 
        !guestDropdownRef.current.contains(event.target as Node) &&
        guestButtonRef.current && 
        !guestButtonRef.current.contains(event.target as Node)
      ) {
        setShowGuestDropdown(false);
      }
      
      // Handle nights dropdown
      if (
        nightsDropdownRef.current && 
        !nightsDropdownRef.current.contains(event.target as Node) &&
        nightsButtonRef.current && 
        !nightsButtonRef.current.contains(event.target as Node)
      ) {
        setShowNightsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Check if any values have changed from initial props
  useEffect(() => {
    const startDateChanged = dateValue.getTime() !== startDate.getTime();
    const nightsChanged = nightsValue !== nights;
    const guestsChanged = guestCount !== (adultCount + childCount);
    
    setHasChanges(startDateChanged || nightsChanged || guestsChanged);
  }, [dateValue, nightsValue, guestCount, startDate, nights, adultCount, childCount]);
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateValue(date);
      setShowCalendar(false);
    }
  };
  
  // Handle guest count selection
  const handleGuestSelect = (count: number) => {
    setGuestCount(count);
    setShowGuestDropdown(false);
  };
  
  // Handle nights selection
  const handleNightsSelect = (count: number) => {
    setNightsValue(count);
    setShowNightsDropdown(false);
  };
  
  // Handle update
  const handleUpdateClick = () => {
    if (onUpdate && hasChanges) {
      onUpdate({
        startDate: dateValue,
        nights: nightsValue,
        adults: guestCount,
        children: 0
      });
      setIsExpanded(false);
    }
  };
  
  // Calculate end date
  const endDate = addDays(dateValue, nightsValue);
  const disabledDays = { before: today };

  // Toggle expansion state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    
    // Close any open dropdowns when collapsing
    if (isExpanded) {
      setShowCalendar(false);
      setShowGuestDropdown(false);
      setShowNightsDropdown(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3 className="text-lg font-semibold text-[#194027] flex items-center">
          <span>Trip Details</span>
          <span className="text-sm font-normal text-[#22342B]/80 ml-4">
            {format(dateValue, 'MMM d')} - {format(endDate, 'MMM d, yyyy')} · {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </span>
        </h3>
        <button 
          className="text-[#194027] hover:bg-[#FFF6ED] rounded-full p-1 transition-colors"
          aria-label={isExpanded ? "Collapse trip details" : "Expand trip details"}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[#FFF6ED] p-6">
              <div className="flex flex-col md:flex-row gap-5 md:gap-6 mb-6">
                {/* Number of Guests */}
                <div className="w-full md:flex-1">
                  <label className="block text-sm md:text-base font-medium text-[#22342B] mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <button
                      ref={guestButtonRef}
                      onClick={() => {
                        setShowGuestDropdown(!showGuestDropdown);
                        setShowNightsDropdown(false);
                        setShowCalendar(false);
                        updateGuestPosition();
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 border border-[#22342B]/20 bg-white rounded-lg hover:border-[#22342B]/40 transition-colors text-[#22342B] focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20`}
                    >
                      <Users className="w-5 h-5 text-[#22342B]/60" />
                      <span className="flex-1 text-left text-base" style={{ fontSize: '16px' }}>
                        {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                      </span>
                      <ChevronDown className="w-5 h-5 text-[#22342B]/60" />
                    </button>

                    {showGuestDropdown && (
                      <div className="fixed z-50" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' }}>
                        <motion.div
                          ref={guestDropdownRef}
                          initial={{ opacity: 0, y: guestPosition.placement === 'top' ? 10 : -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: guestPosition.placement === 'top' ? 10 : -10 }}
                          className="bg-white rounded-lg shadow-xl border border-[#22342B]/10"
                          style={{
                            position: 'fixed',
                            width: guestPosition.width,
                            maxHeight: '240px',
                            overflowY: 'auto',
                            pointerEvents: 'auto',
                            [guestPosition.placement === 'top' ? 'bottom' : 'top']: 
                              guestPosition.placement === 'top' 
                                ? `calc(100vh - ${guestPosition.top}px)`
                                : `${guestPosition.top}px`,
                            left: `${guestPosition.left}px`,
                          }}
                        >
                          <div className="py-1">
                            {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                              <button
                                key={num}
                                onClick={() => handleGuestSelect(num)}
                                className={`w-full text-left px-4 py-2 text-base hover:bg-[#FFF6ED] transition-colors ${
                                  num === guestCount ? 'bg-[#FFF6ED] font-medium' : ''
                                }`}
                              >
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Number of Nights */}
                <div className="w-full md:flex-1">
                  <label className="block text-sm md:text-base font-medium text-[#22342B] mb-2">
                    How many nights?
                  </label>
                  <div className="relative">
                    <button
                      ref={nightsButtonRef}
                      onClick={() => {
                        setShowNightsDropdown(!showNightsDropdown);
                        setShowGuestDropdown(false);
                        setShowCalendar(false);
                        updateNightsPosition();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 border border-[#22342B]/20 rounded-lg hover:border-[#22342B]/40 transition-colors text-[#22342B] focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20 bg-white"
                    >
                      <span className="flex-1 text-left text-base" style={{ fontSize: '16px' }}>
                        {nightsValue} {nightsValue === 1 ? 'night' : 'nights'}
                      </span>
                      <ChevronDown className="w-5 h-5 text-[#22342B]/60" />
                    </button>

                    {showNightsDropdown && (
                      <div className="fixed z-50" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' }}>
                        <motion.div
                          ref={nightsDropdownRef}
                          initial={{ opacity: 0, y: nightsPosition.placement === 'top' ? 10 : -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: nightsPosition.placement === 'top' ? 10 : -10 }}
                          className="bg-white rounded-lg shadow-xl border border-[#22342B]/10"
                          style={{
                            position: 'fixed',
                            width: nightsPosition.width,
                            maxHeight: '240px',
                            overflowY: 'auto',
                            pointerEvents: 'auto',
                            [nightsPosition.placement === 'top' ? 'bottom' : 'top']: 
                              nightsPosition.placement === 'top' 
                                ? `calc(100vh - ${nightsPosition.top}px)`
                                : `${nightsPosition.top}px`,
                            left: `${nightsPosition.left}px`,
                          }}
                        >
                          <div className="py-1">
                            {Array.from({ length: maxNights }, (_, i) => i + 1).map(num => (
                              <button
                                key={num}
                                onClick={() => handleNightsSelect(num)}
                                className={`w-full text-left px-4 py-2 text-base hover:bg-[#FFF6ED] transition-colors ${
                                  num === nightsValue ? 'bg-[#FFF6ED] font-medium' : ''
                                }`}
                              >
                                {num} {num === 1 ? 'night' : 'nights'}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Start Date */}
                <div className="w-full md:flex-1">
                  <label className="block text-sm md:text-base font-medium text-[#22342B] mb-2">
                    When do you start?
                  </label>
                  <div className="relative">
                    <button
                      ref={dateButtonRef}
                      onClick={() => {
                        setShowCalendar(!showCalendar);
                        setShowGuestDropdown(false);
                        setShowNightsDropdown(false);
                        updateCalendarPosition();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 border border-[#22342B]/20 rounded-lg hover:border-[#22342B]/40 transition-colors text-[#22342B] focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20 bg-white"
                    >
                      <CalendarIcon className="w-5 h-5 text-[#22342B]/60" />
                      <span className="flex-1 text-left text-base" style={{ fontSize: '16px' }}>
                        {format(dateValue, 'MMM d, yyyy')}
                      </span>
                      <ChevronDown className="w-5 h-5 text-[#22342B]/60" />
                    </button>

                    {showCalendar && (
                      <div className="fixed z-50" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' }}>
                        <motion.div
                          ref={calendarRef}
                          initial={{ opacity: 0, y: calendarPosition.placement === 'top' ? 10 : -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: calendarPosition.placement === 'top' ? 10 : -10 }}
                          className="bg-white rounded-lg shadow-xl border border-[#22342B]/10"
                          style={{
                            position: 'fixed',
                            width: Math.max(calendarPosition.width, 320),
                            pointerEvents: 'auto',
                            [calendarPosition.placement === 'top' ? 'bottom' : 'top']: 
                              calendarPosition.placement === 'top' 
                                ? `calc(100vh - ${calendarPosition.top}px)`
                                : `${calendarPosition.top}px`,
                            left: `${calendarPosition.left}px`,
                          }}
                        >
                          <DayPicker
                            mode="single"
                            selected={dateValue}
                            onSelect={handleDateSelect}
                            disabled={disabledDays}
                            showOutsideDays
                            className="p-2"
                            classNames={{
                              root: "w-full",
                              month: "w-full mx-auto",
                              caption: "flex justify-between pt-1 mb-2 relative items-center w-full px-2",
                              caption_label: "text-[#194027] font-medium text-base",
                              nav: "flex items-center",
                              nav_button: "bg-transparent p-1 opacity-70 hover:opacity-100",
                              table: "w-full border-collapse mx-auto",
                              head_row: "flex w-full justify-between mb-1",
                              head_cell: "text-[#22342B]/60 flex-1 text-center text-xs font-normal",
                              row: "flex w-full justify-between mt-1",
                              cell: "flex-1 text-center p-0 relative mx-auto",
                              day: "w-9 h-9 mx-auto flex items-center justify-center text-sm rounded-full hover:bg-[#FFF6ED] transition-colors",
                              day_selected: "bg-[#194027] text-white hover:bg-[#194027] hover:text-white",
                              day_today: "font-bold text-[#194027] border border-[#194027]/30",
                              day_outside: "text-gray-400 opacity-50",
                              day_disabled: "text-gray-400 opacity-50"
                            }}
                            styles={{
                              root: { width: '100%' },
                              caption: { width: '100%' }
                            }}
                          />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="text-sm text-[#22342B]/80">
                  <span className="font-medium">{format(dateValue, 'MMM d, yyyy')}</span> - <span className="font-medium">{format(endDate, 'MMM d, yyyy')}</span> · <span className="font-medium">{guestCount}</span> total guests
                </div>
                <button
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
                    hasChanges
                      ? 'bg-[#194027] hover:bg-[#194027]/90'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!hasChanges}
                  onClick={handleUpdateClick}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 