import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'meeting' | 'deadline' | 'reminder';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Standup',
    time: '09:00',
    date: '2024-09-20',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Project Review',
    time: '14:30',
    date: '2024-09-20',
    type: 'meeting'
  },
  {
    id: '3',
    title: 'Report Deadline',
    time: '23:59',
    date: '2024-09-21',
    type: 'deadline'
  }
];

export const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<Event[]>(mockEvents);

  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTodayEvents = () => {
    const todayStr = today.toISOString().split('T')[0];
    return events.filter(event => event.date === todayStr);
  };

  const getUpcomingEvents = () => {
    const todayStr = today.toISOString().split('T')[0];
    return events.filter(event => event.date > todayStr).slice(0, 3);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-primary/10 text-primary border-primary/20';
      case 'deadline': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'reminder': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const todayEvents = getTodayEvents();
  const upcomingEvents = getUpcomingEvents();

  return (
    <Card className="widget-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Schedule
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Date */}
        <motion.div 
          className="text-center p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-lg font-bold text-primary">{formatDate(today)}</p>
        </motion.div>

        {/* Today's Events */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Today's Schedule
          </h4>
          
          {todayEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 text-muted-foreground"
            >
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No events today</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs opacity-70">{event.time}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {event.type}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground">Upcoming</h4>
            
            <div className="space-y-2">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} at {event.time}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    event.type === 'meeting' ? 'bg-primary' :
                    event.type === 'deadline' ? 'bg-destructive' :
                    'bg-warning'
                  }`} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <motion.div 
          className="pt-3 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="hover-lift">
              <Calendar className="h-4 w-4 mr-2" />
              Add Event
            </Button>
            <Button variant="outline" size="sm" className="hover-lift">
              <Clock className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};