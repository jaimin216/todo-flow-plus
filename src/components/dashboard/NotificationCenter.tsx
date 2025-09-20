import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Clock, Calendar, Target, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Notification {
  id: string;
  type: 'reminder' | 'deadline' | 'achievement' | 'warning';
  title: string;
  message: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'Project Deadline',
    message: 'Complete quarterly report due in 2 hours',
    time: '2 hours',
    priority: 'high'
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Daily Standup',
    message: 'Team meeting starting in 15 minutes',
    time: '15 min',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Streak Milestone!',
    message: 'You\'ve completed 7 days of habits!',
    time: 'now',
    priority: 'low'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Budget Alert',
    message: 'You\'ve exceeded your food budget by $50',
    time: '1 hour',
    priority: 'high'
  }
];

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline': return Calendar;
      case 'reminder': return Clock;
      case 'achievement': return Target;
      case 'warning': return AlertTriangle;
      default: return Bell;
    }
  };

  const getColorClass = (type: string, priority: string) => {
    if (priority === 'high') return 'border-destructive/30 bg-destructive/5';
    if (priority === 'medium') return 'border-warning/30 bg-warning/5';
    switch (type) {
      case 'achievement': return 'border-success/30 bg-success/5';
      default: return 'border-border bg-card';
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.length;

  return (
    <Card className="widget-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Notifications
              </CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </motion.div>
              ) : (
                notifications.map((notification, index) => {
                  const Icon = getIcon(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getColorClass(notification.type, notification.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Icon className={`h-4 w-4 mt-0.5 ${
                            notification.priority === 'high' ? 'text-destructive' :
                            notification.priority === 'medium' ? 'text-warning' :
                            notification.type === 'achievement' ? 'text-success' :
                            'text-primary'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};