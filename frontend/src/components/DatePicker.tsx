import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  onSelect: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ onSelect }) => {
  const [selected, setSelected] = React.useState<Date>();

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelected(date);
      onSelect(date);
    }
  };

  return (
    <div className="grid gap-2">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        showOutsideDays
        className="border rounded-lg p-4"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white",
          day_today: "bg-gray-100",
          day_outside: "text-gray-400 opacity-50",
          day_disabled: "text-gray-400 opacity-50",
          day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: () => <CalendarIcon className="h-4 w-4" />,
          IconRight: () => <CalendarIcon className="h-4 w-4" />,
        }}
      />
      {selected && (
        <p className="text-sm text-gray-500">
          You selected {format(selected, 'PPP')}
        </p>
      )}
    </div>
  );
};