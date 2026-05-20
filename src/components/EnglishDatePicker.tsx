import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface EnglishDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_SHORT_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const EnglishDatePicker: React.FC<EnglishDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select Date",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse the current value, default to current/landmark 2026-05-20 or today
  const parsedDate = value ? new Date(value) : null;
  const initialYear = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getFullYear() : 2026;
  const initialMonth = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getMonth() : 4; // May (0-indexed)

  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  // Sync state if value changes externally while closed
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  // Handle click outside to close the calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format the displayed value in US English (e.g., "May 20, 2026")
  const getFormattedDisplay = () => {
    if (!value) return placeholder;
    const d = new Date(value);
    if (isNaN(d.getTime())) return placeholder;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, etc.
  };

  const handleDaySelect = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  // Build days grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const daysGrid = [];
  // Empty slots for previous month pad
  for (let i = 0; i < firstDay; i++) {
    daysGrid.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }

  // Active days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const currentDayStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    const isSelected = value === currentDayStr;
    const isToday = new Date().toISOString().split('T')[0] === currentDayStr;

    daysGrid.push(
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => handleDaySelect(day)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative
          ${isSelected ? 'bg-emerald text-sand' : 'text-emerald-dark hover:bg-emerald/15'}
          ${isToday && !isSelected ? 'border border-emerald text-emerald font-extrabold' : ''}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white hover:bg-sand/30 border border-emerald/10 text-emerald-dark font-sans text-xs font-semibold px-3 py-2 rounded-2xl flex items-center justify-between gap-2 shadow-sm focus:outline-none transition-all ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <CalendarIcon size={14} className="text-emerald" />
          <span>{getFormattedDisplay()}</span>
        </div>
        {value && (
          <span 
            onClick={handleClear}
            className="text-emerald/40 hover:text-red-500 rounded p-0.5 hover:bg-emerald/5 transition-colors"
          >
            <X size={12} />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 bg-[#fbf9f4] border border-emerald/15 rounded-3xl shadow-xl p-4 w-[280px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-emerald/5 rounded-full text-emerald transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm font-serif font-bold text-emerald-dark">
              {MONTHS_EN[currentMonth]} {currentYear}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-emerald/5 rounded-full text-emerald transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_SHORT_EN.map(day => (
              <div key={day} className="text-[10px] font-bold text-emerald/40 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysGrid}
          </div>
        </div>
      )}
    </div>
  );
};
