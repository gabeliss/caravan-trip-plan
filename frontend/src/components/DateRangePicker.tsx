import React, { useState, useEffect, useRef } from 'react';
import { format, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, Users, ChevronDown } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css';
import { TripDuration } from '../types';

interface DateRangePickerProps {
  onSelect: (date: Date) => void;
  duration: TripDuration;
  setDuration: React.Dispatch<React.SetStateAction<TripDuration>>;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  onSelect, 
  duration, 
  setDuration 
}) => {
  const [selected, setSelected] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showNightsDropdown, setShowNightsDropdown] = useState(false);
  const [guestCount, setGuestCount] = useState(2);
  const [error, setError] = useState<string | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const guestButtonRef = useRef<HTMLButtonElement>(null);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const nightsButtonRef = useRef<HTMLButtonElement>(null);
  const nightsDropdownRef = useRef<HTMLDivElement>(null);

  const today = startOfToday();

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

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      if (isBefore(date, today)) {
        setError('Please select a future date');
        return;
      }
      setError(null);
      setSelected(date);
      onSelect(date);
      setShowCalendar(false);
    }
  };

  const handleGuestSelect = (count: number) => {
    setGuestCount(count);
    setShowGuestDropdown(false);
  };

  const handleNightsSelect = (nights: number) => {
    setDuration(prev => ({ ...prev, nights }));
    setShowNightsDropdown(false);
  };

  const disabledDays = { before: today };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6"
    >
      <div className="bg-[#FFF6ED] backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-5 md:gap-6 lg:gap-8">
          {/* Number of Guests */}
          <div className="w-full md:flex-1">
            <label className="block text-sm md:text-base font-medium text-[#22342B] mb-2 md:mb-3">
              Number of Guests
            </label>
            <div className="relative">
              <button
                ref={guestButtonRef}
                onClick={() => {
                  setShowGuestDropdown(!showGuestDropdown);
                  setShowNightsDropdown(false);
                  setShowCalendar(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 md:py-4 border border-[#22342B]/20 rounded-lg hover:border-[#22342B]/40 transition-colors text-[#22342B] focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20 bg-white"
              >
                <Users className="w-5 h-5 md:w-6 md:h-6 text-[#22342B]/60" />
                <span className="flex-1 text-left text-base md:text-lg" style={{ fontSize: '16px' }}>
                  {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                </span>
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-[#22342B]/60" />
              </button>

              <AnimatePresence>
                {showGuestDropdown && (
                  <motion.div
                    ref={guestDropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-[#22342B]/10 z-50 w-full"
                  >
                    <div className="py-1">
                      {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                        <button
                          key={num}
                          onClick={() => handleGuestSelect(num)}
                          className={`w-full text-left px-4 py-2 md:py-3 text-base md:text-lg hover:bg-[#FFF6ED] transition-colors ${
                            num === guestCount ? 'bg-[#FFF6ED] font-medium' : ''
                          }`}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Trip Duration */}
          <div className="w-full md:flex-1">
            <label className="block text-sm md:text-base font-medium text-[#22342B] mb-2 md:mb-3">
              How many nights?
            </label>
            <div className="relative">
              <button
                ref={nightsButtonRef}
                onClick={() => {
                  setShowNightsDropdown(!showNightsDropdown);
                  setShowGuestDropdown(false);
                  setShowCalendar(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 md:py-4 border border-[#22342B]/20 rounded-lg hover:border-[#22342B]/40 transition-colors text-[#22342B] focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20 bg-white"
              >
                <span className="flex-1 text-left text-base md:text-lg" style={{ fontSize: '16px' }}>
                  {duration.nights} {duration.nights === 1 ? 'night' : 'nights'}
                </span>
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-[#22342B]/60" />
              </button>

              <AnimatePresence>
                {showNightsDropdown && (
                  <motion.div
                    ref={nightsDropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-[#22342B]/10 z-50 w-full"
                  >
                    <div className="py-1">
                      {Array.from({ length: 8 }, (_, i) => i + 1).map(nights => (
                        <button
                          key={nights}
                          onClick={() => handleNightsSelect(nights)}
                          className={`w-full text-left px-4 py-2 md:py-3 text-base md:text-lg hover:bg-[#FFF6ED] transition-colors ${
                            nights === duration.nights ? 'bg-[#FFF6ED] font-medium' : ''
                          }`}
                        >
                          {nights} {nights === 1 ? 'night' : 'nights'}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Date Selection */}
          <div className="w-full md:flex-1">
            <label className="block text-sm md:text-base font-medium text-[#22342B] mb-2 md:mb-3">
              Start Date
            </label>
            <div className="relative">
              <button
                ref={dateButtonRef}
                onClick={() => {
                  setShowCalendar(!showCalendar);
                  setShowGuestDropdown(false);
                  setShowNightsDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 md:py-4 border border-[#22342B]/20 rounded-lg hover:border-[#22342B]/40 transition-colors text-[#22342B] focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20 bg-white"
              >
                <CalendarIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="flex-1 text-left text-base md:text-lg" style={{ fontSize: '16px' }}>
                  {selected ? format(selected, 'MMMM d, yyyy') : 'Select a date'}
                </span>
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-[#22342B]/60" />
              </button>

              {error && (
                <p className="absolute left-0 -bottom-6 text-sm text-red-600">
                  {error}
                </p>
              )}

              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    ref={calendarRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-[#22342B]/10 z-50 origin-top"
                  >
                    <DayPicker
                      mode="single"
                      selected={selected}
                      onSelect={handleSelect}
                      disabled={disabledDays}
                      showOutsideDays
                      className="p-2 md:p-3 mx-auto w-full"
                      style={{ 
                        /* Ensure calendar has a good minimum width but can grow */
                        minWidth: "200px",
                        maxWidth: "100%"
                      }}
                      classNames={{
                        root: "flex justify-center w-full",
                        months: "flex flex-col space-y-4 w-full",
                        month: "space-y-2 w-full",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm md:text-base font-medium text-[#22342B]",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 md:h-8 md:w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse",
                        head_row: "flex w-full justify-between",
                        head_cell: "text-[#22342B]/60 flex-1 text-center font-normal text-[0.8rem] md:text-sm",
                        row: "flex w-full justify-between mt-1",
                        cell: "flex-1 aspect-square flex items-center justify-center relative text-center text-sm md:text-base p-0 [&:has([aria-selected])]:bg-[#22342B]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "flex items-center justify-center w-full h-full p-0 font-normal aria-selected:opacity-100 text-sm md:text-base",
                        day_selected: "bg-[#22342B] text-beige hover:bg-[#22342B] hover:text-beige focus:bg-[#22342B] focus:text-beige",
                        day_today: "bg-[#22342B]/5",
                        day_outside: "text-[#22342B]/40 opacity-50",
                        day_disabled: "text-[#22342B]/40 opacity-50 cursor-not-allowed",
                        day_range_middle: "aria-selected:bg-[#22342B]/10 aria-selected:text-[#22342B]",
                        day_hidden: "invisible",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};