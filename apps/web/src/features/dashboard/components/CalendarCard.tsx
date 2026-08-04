import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@shared/components/ui/Card';
import { Skeleton } from '@shared/components/ui/Skeleton';
import type { CalendarEvent } from '../services/dashboard.service';

export interface CalendarCardProps {
  events?: CalendarEvent[];
  isLoading?: boolean;
}

const eventColors: Record<CalendarEvent['type'], string> = {
  interview: 'bg-primary-500 text-white dark:bg-primary-600',
  deadline: 'bg-error-500 text-white dark:bg-error-600',
  challenge: 'bg-accent-500 text-white dark:bg-accent-600',
  meeting: 'bg-info-500 text-white dark:bg-info-600',
};

const dotColors: Record<CalendarEvent['type'], string> = {
  interview: 'bg-primary-500',
  deadline: 'bg-error-500',
  challenge: 'bg-accent-500',
  meeting: 'bg-info-500',
};

const eventLabels: Record<CalendarEvent['type'], string> = {
  interview: 'Mock Interview',
  deadline: 'Job Deadline',
  challenge: 'Coding Challenge',
  meeting: 'Meeting',
};

export function CalendarCard({ events = [], isLoading = false }: CalendarCardProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate calendar days for current month (August 2026 as per user local time 2026-08-04)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Days in month calculation
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const daysGrid: (number | null)[] = [];
  // Add empty spaces for offset
  for (let i = 0; i < firstDay; i++) {
    daysGrid.push(null);
  }
  // Add days of the month
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  const formatDayString = (day: number) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${year}-${pad(month + 1)}-${pad(day)}`;
  };

  // Check events for a specific day
  const getEventsForDay = (day: number) => {
    const dateStr = formatDayString(day);
    return events.filter((e) => e.date === dateStr);
  };

  // Get active events filter
  const activeEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : events;

  if (isLoading) {
    return (
      <Card variant="glass" className="space-y-4">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-44 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="border border-[color:var(--glass-border)] flex flex-col h-full">
      <CardHeader className="mb-2">
        <CardTitle className="text-md font-bold tracking-tight font-heading">
          Schedule & Events
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
        {/* Calendar Grid View (5 cols on md) */}
        <div className="md:col-span-6 border-b md:border-b-0 md:border-r border-[color:var(--border-subtle)] pb-4 md:pb-0 md:pr-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-[color:var(--text-primary)]">
              {monthNames[month]} {year}
            </span>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-[10px] font-bold text-primary-500 hover:underline"
              >
                Show All
              </button>
            )}
          </div>

          {/* Weekdays Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] text-[color:var(--text-muted)] font-black">
            {daysOfWeek.map((day, i) => (
              <div key={i}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysGrid.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = formatDayString(day);
              const isToday = day === today.getDate() && month === today.getMonth();
              const isSelected = selectedDate === dateStr;
              const dayEvents = getEventsForDay(day);

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center relative text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary-500 text-white shadow-sm'
                      : isToday
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500/30'
                      : 'hover:bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)]'
                  }`}
                >
                  <span>{day}</span>
                  
                  {/* Event indicator dots */}
                  {dayEvents.length > 0 && !isSelected && (
                    <div className="flex gap-0.5 mt-0.5 absolute bottom-1">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`w-1 h-1 rounded-full ${dotColors[e.type]}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected / Upcoming Events List (6 cols on md) */}
        <div className="md:col-span-6 flex flex-col max-h-[220px] overflow-y-auto pr-1">
          <div className="text-[10px] font-bold tracking-wider text-[color:var(--text-muted)] uppercase mb-2">
            {selectedDate ? `Events for ${selectedDate}` : 'Upcoming events'}
          </div>

          {activeEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <span className="text-xl mb-1">📅</span>
              <p className="text-[11px] text-[color:var(--text-muted)] font-medium">
                No events scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-2 flex-1">
              <AnimatePresence mode="popLayout">
                {activeEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-2 border border-[color:var(--border-subtle)] rounded-xl bg-[color:var(--bg-surface)] hover:shadow-xs transition-shadow flex items-start gap-2.5 text-left group"
                  >
                    {/* Color Code Category */}
                    <span className={`w-1.5 h-10 rounded-full shrink-0 ${dotColors[event.type]}`} />
                    
                    {/* Event summary details */}
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-1.5">
                        <h4 className="text-[11px] font-bold text-[color:var(--text-primary)] leading-tight line-clamp-1 group-hover:text-primary-500 transition-colors">
                          {event.title}
                        </h4>
                        <span className="text-[9px] font-semibold text-[color:var(--text-muted)] shrink-0">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-[10px] text-[color:var(--text-muted)] leading-tight line-clamp-1 pr-1 font-medium">
                        {event.details}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-[9px] font-bold text-[color:var(--text-secondary)]">
                        <span className={`w-1 h-1 rounded-full ${dotColors[event.type]}`} />
                        <span>{eventLabels[event.type]}</span>
                        <span className="text-[color:var(--text-muted)] font-normal">• {event.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
