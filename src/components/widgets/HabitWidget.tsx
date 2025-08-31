import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Check,
  Droplets,
  Dumbbell,
  Book,
  Moon,
  Coffee,
  Plus,
  Minus,
  Flame,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  icon: any;
  color: string;
  completed: boolean;
  streak: number;
  target: number;
  current: number;
}

const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink Water',
    icon: Droplets,
    color: 'text-primary',
    completed: true,
    streak: 12,
    target: 8,
    current: 8
  },
  {
    id: '2',
    name: 'Exercise',
    icon: Dumbbell,
    color: 'text-success',
    completed: false,
    streak: 5,
    target: 1,
    current: 0
  },
  {
    id: '3',
    name: 'Read',
    icon: Book,
    color: 'text-warning',
    completed: true,
    streak: 8,
    target: 30,
    current: 45
  },
  {
    id: '4',
    name: 'Sleep 8h',
    icon: Moon,
    color: 'text-muted-foreground',
    completed: false,
    streak: 3,
    target: 8,
    current: 6
  }
];

const motivationalQuotes = [
  "Small steps daily lead to big changes yearly.",
  "You are what you repeatedly do.",
  "Progress, not perfection.",
  "Consistency beats intensity.",
  "Your future self will thank you.",
  "Habits are the compound interest of self-improvement."
];

export const HabitWidget = () => {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setMotivationalQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);
  
  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completed;
        const newCompleted = !wasCompleted;
        const newStreak = newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        
        if (newCompleted) {
          toast({
            title: "Habit completed! 🎉",
            description: `Great job on ${habit.name}! Streak: ${newStreak} days`,
          });
        }
        
        return { 
          ...habit, 
          completed: newCompleted,
          current: newCompleted ? habit.target : 0,
          streak: newStreak
        };
      }
      return habit;
    }));
  };

  const updateProgress = (habitId: string, increment: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCurrent = Math.max(0, Math.min(habit.target, habit.current + increment));
        const isNowCompleted = newCurrent >= habit.target;
        const wasCompleted = habit.completed;
        
        if (isNowCompleted && !wasCompleted) {
          toast({
            title: "Habit completed! 🎉",
            description: `Awesome! You've completed ${habit.name}`,
          });
        }
        
        return {
          ...habit,
          current: newCurrent,
          completed: isNowCompleted
        };
      }
      return habit;
    }));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionRate = (completedCount / totalHabits) * 100;
  const bestStreak = Math.max(...habits.map(h => h.streak));

  return (
    <Card className="widget-card group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Daily Habits
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={completionRate === 100 ? "default" : "secondary"} className="animate-fade-in">
              {completedCount}/{totalHabits}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Habit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Motivational Quote */}
        <motion.div 
          className="mt-2 p-3 bg-muted/50 rounded-lg border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-muted-foreground italic">"{motivationalQuote}"</p>
        </motion.div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Today's Progress</span>
            <motion.span 
              className="text-sm text-muted-foreground"
              key={completionRate}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {completionRate.toFixed(0)}%
            </motion.span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </motion.div>

        {/* Habit List */}
        <div className="space-y-3">
          <AnimatePresence>
            {habits.map((habit, index) => {
              const progress = Math.min((habit.current / habit.target) * 100, 100);
              
              return (
                <motion.div
                  key={habit.id}
                  className={`group/item flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                    habit.completed 
                      ? 'bg-success/10 border-success/20' 
                      : 'bg-card border-border hover:border-border/80'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <Button
                    variant={habit.completed ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 relative overflow-hidden"
                    onClick={() => toggleHabit(habit.id)}
                  >
                    <AnimatePresence mode="wait">
                      {habit.completed ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Check className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <habit.icon className={`h-4 w-4 ${habit.color}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium transition-all duration-200 ${
                          habit.completed ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {habit.name}
                        </span>
                        {habit.streak > 0 && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-1"
                          >
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="text-xs font-bold text-orange-500">
                              {habit.streak}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      
                      {habit.target > 1 && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            onClick={() => updateProgress(habit.id, -1)}
                            disabled={habit.current <= 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-muted-foreground min-w-[30px] text-center">
                            {habit.current}/{habit.target}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            onClick={() => updateProgress(habit.id, 1)}
                            disabled={habit.current >= habit.target}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {habit.target > 1 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <Progress 
                          value={progress} 
                          className={`h-1.5 ${habit.completed ? 'opacity-70' : ''}`}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="pt-4 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 rounded-lg hover:bg-success/5 transition-colors"
            >
              <div className="flex items-center justify-center mb-1">
                <Check className="h-4 w-4 text-success mr-1" />
                <p className="text-muted-foreground">Completed</p>
              </div>
              <p className="text-lg font-bold text-success">
                {completedCount}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 rounded-lg hover:bg-orange-500/5 transition-colors"
            >
              <div className="flex items-center justify-center mb-1">
                <Flame className="h-4 w-4 text-orange-500 mr-1" />
                <p className="text-muted-foreground">Best Streak</p>
              </div>
              <p className="text-lg font-bold text-orange-500">
                {bestStreak}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-primary mr-1" />
                <p className="text-muted-foreground">Rate</p>
              </div>
              <p className="text-lg font-bold text-primary">
                {completionRate.toFixed(0)}%
              </p>
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};