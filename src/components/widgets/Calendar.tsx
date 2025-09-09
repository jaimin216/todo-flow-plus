import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  date: string;
  title: string;
  type: 'task' | 'meeting' | 'deadline';
  priority?: 1 | 2 | 3 | 4;
}

const mockEvents: CalendarEvent[] = [
  { date: '2024-01-15', title: 'Team Meeting', type: 'meeting' },
  { date: '2024-01-16', title: 'Project Deadline', type: 'deadline', priority: 1 },
  { date: '2024-01-18', title: 'Review Session', type: 'task', priority: 2 },
];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(event => event.date === dateStr);
  };

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const isSelected = (day: number) => {
    return selectedDate && 
           selectedDate.getDate() === day && 
           selectedDate.getMonth() === month && 
           selectedDate.getFullYear() === year;
  };

  return (
    <Card className="widget-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="widget-heading flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendar
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-lg font-semibold">
          {monthNames[month]} {year}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-8" />
          ))}
          
          {days.map(day => {
            const events = getEventsForDate(day);
            const hasEvents = events.length > 0;
            
            return (
              <motion.button
                key={day}
                className={cn(
                  "h-8 w-8 text-sm rounded-md flex items-center justify-center relative transition-colors hover:bg-accent",
                  isToday(day) && "bg-primary text-primary-foreground font-bold",
                  isSelected(day) && !isToday(day) && "bg-accent",
                  hasEvents && !isToday(day) && "text-primary font-medium"
                )}
                onClick={() => setSelectedDate(new Date(year, month, day))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {day}
                {hasEvents && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-2 pt-2 border-t border-border">
          <h4 className="text-sm font-medium text-muted-foreground">
            Upcoming Events
          </h4>
          <div className="space-y-1">
            {mockEvents.slice(0, 3).map((event, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-2 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    event.type === 'meeting' && "bg-primary",
                    event.type === 'deadline' && "bg-destructive",
                    event.type === 'task' && "bg-success"
                  )} />
                  <span className="text-sm font-medium">{event.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};