import React, { useState } from 'react';
import { format, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
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
  const [selected, setSelected] = React.useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [guestCount, setGuestCount] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const today = startOfToday();

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

  const disabledDays = { before: today };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-[#FFF6ED] backdrop-blur-sm rounded-xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Number of Guests */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#22342B] mb-3">
              Number of Guests
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#22342B]/60" />
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-[#22342B]/20 rounded-lg appearance-none bg-transparent text-[#22342B] hover:border-[#22342B]/40 transition-colors focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20"
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Trip Duration */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#22342B] mb-3">
              How many nights?
            </label>
            <div className="relative">
              <select
                value={duration.nights}
                onChange={(e) => setDuration(prev => ({ ...prev, nights: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-[#22342B]/20 rounded-lg appearance-none bg-transparent text-[#22342B] hover:border-[#22342B]/40 transition-colors focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20"
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map(nights => (
                  <option key={nights} value={nights}>
                    {nights} {nights === 1 ? 'night' : 'nights'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#22342B] mb-3">
              Start Date
            </label>
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center gap-2 px-4 py-3 border border-[#22342B]/20 rounded-lg hover:border-[#22342B]/40 transition-colors text-[#22342B] focus:outline-none focus:border-[#22342B] focus:ring-2 focus:ring-[#22342B]/20"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="flex-1 text-left">
                  {selected ? format(selected, 'MMMM d, yyyy') : 'Select a date'}
                </span>
              </button>

              {error && (
                <p className="absolute left-0 -bottom-6 text-sm text-red-600">
                  {error}
                </p>
              )}

              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-[#22342B]/10 z-50"
                  >
                    <DayPicker
                      mode="single"
                      selected={selected}
                      onSelect={handleSelect}
                      disabled={disabledDays}
                      showOutsideDays
                      className="p-3"
                      classNames={{
                        months: "flex flex-col space-y-4",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium text-[#22342B]",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-[#22342B]/60 rounded-md w-8 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#22342B]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
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