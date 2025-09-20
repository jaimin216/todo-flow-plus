import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, TrendingUp, Trophy, Target, Brain, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Insight {
  id: string;
  type: 'productivity' | 'habit' | 'finance' | 'motivation';
  title: string;
  description: string;
  metric?: string;
  progress?: number;
  trend: 'up' | 'down' | 'neutral';
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'productivity',
    title: 'Peak Performance Time',
    description: 'You\'re most productive between 9-11 AM. Schedule important tasks during this window.',
    trend: 'up'
  },
  {
    id: '2',
    type: 'habit',
    title: 'Consistency Streak',
    description: 'You\'ve maintained your morning routine for 12 days straight!',
    metric: '12 days',
    progress: 85,
    trend: 'up'
  },
  {
    id: '3',
    type: 'finance',
    title: 'Budget Optimization',
    description: 'Consider reducing dining expenses by $150/month to reach your savings goal faster.',
    metric: '$150',
    trend: 'neutral'
  },
  {
    id: '4',
    type: 'motivation',
    title: 'Weekly Achievement',
    description: 'You completed 95% of your weekly goals. Outstanding work!',
    metric: '95%',
    progress: 95,
    trend: 'up'
  }
];

const motivationalQuotes = [
  "Progress is impossible without change.",
  "Small steps in the right direction can turn out to be the biggest step of your life.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The only impossible journey is the one you never begin."
];

export const SmartInsights = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    
    const interval = setInterval(() => {
      setCurrentInsight(prev => (prev + 1) % insights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'productivity': return Brain;
      case 'habit': return Target;
      case 'finance': return TrendingUp;
      case 'motivation': return Trophy;
      default: return Lightbulb;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'productivity': return 'text-primary bg-primary/10';
      case 'habit': return 'text-success bg-success/10';
      case 'finance': return 'text-warning bg-warning/10';
      case 'motivation': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-success" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-destructive rotate-180" />;
      default: return <Flame className="h-3 w-3 text-warning" />;
    }
  };

  return (
    <Card className="widget-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" />
          Smart Insights
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Rotating Insights */}
        <div className="relative h-24 overflow-hidden rounded-lg border border-border/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentInsight}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 p-3"
            >
              {(() => {
                const insight = insights[currentInsight];
                const Icon = getIcon(insight.type);
                return (
                  <div className="flex items-start space-x-3 h-full">
                    <div className={`p-2 rounded-lg ${getColorClass(insight.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{insight.title}</p>
                        <div className="flex items-center space-x-1">
                          {insight.metric && (
                            <Badge variant="secondary" className="text-xs">
                              {insight.metric}
                            </Badge>
                          )}
                          {getTrendIcon(insight.trend)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                      {insight.progress && (
                        <motion.div
                          className="mt-2"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.3 }}
                        >
                          <Progress value={insight.progress} className="h-1" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Insight Navigation */}
        <div className="flex justify-center space-x-1">
          {insights.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentInsight ? 'bg-primary' : 'bg-muted'
              }`}
              onClick={() => setCurrentInsight(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>

        {/* Motivational Quote */}
        <motion.div 
          className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start space-x-2">
            <Trophy className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-primary mb-1">Daily Motivation</p>
              <p className="text-sm text-muted-foreground italic">"{quote}"</p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Stats Summary */}
        <motion.div 
          className="grid grid-cols-3 gap-3 pt-3 border-t border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <p className="text-lg font-bold text-success">94%</p>
            <p className="text-xs text-muted-foreground">Task Rate</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">18</p>
            <p className="text-xs text-muted-foreground">Focus Hours</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-warning">7/7</p>
            <p className="text-xs text-muted-foreground">Habit Days</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};