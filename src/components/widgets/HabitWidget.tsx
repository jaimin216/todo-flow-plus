import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Check,
  Droplets,
  Dumbbell,
  Book,
  Moon,
  Coffee
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

export const HabitWidget = () => {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  
  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completed: !habit.completed,
            current: habit.completed ? 0 : habit.target
          }
        : habit
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionRate = (completedCount / totalHabits) * 100;

  return (
    <Card className="widget-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Daily Habits
          </CardTitle>
          <Badge variant="secondary">
            {completedCount}/{totalHabits}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Progress</span>
            <span className="font-medium">{completionRate.toFixed(0)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Habit List */}
        <div className="space-y-3">
          {habits.map((habit, index) => {
            const progress = Math.min((habit.current / habit.target) * 100, 100);
            
            return (
              <motion.div
                key={habit.id}
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 h-8 w-8 rounded-full ${
                        habit.completed 
                          ? 'bg-success text-success-foreground' 
                          : 'border border-border hover:bg-accent'
                      }`}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      {habit.completed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <habit.icon className={`h-4 w-4 ${habit.color}`} />
                      )}
                    </Button>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          habit.completed ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {habit.name}
                        </span>
                        {habit.streak > 0 && (
                          <Badge variant="outline" className="text-xs">
                            🔥 {habit.streak}
                          </Badge>
                        )}
                      </div>
                      
                      {habit.target > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {habit.current}/{habit.target} 
                          {habit.name === 'Drink Water' && ' glasses'}
                          {habit.name === 'Read' && ' minutes'}
                          {habit.name === 'Sleep 8h' && ' hours'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar for measurable habits */}
                {habit.target > 1 && (
                  <div className="ml-11">
                    <Progress 
                      value={progress} 
                      className={`h-1 ${habit.completed ? 'opacity-50' : ''}`}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm font-medium">Best Streak</p>
              <p className="text-lg font-bold text-primary">
                {Math.max(...habits.map(h => h.streak))} days
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">This Week</p>
              <p className="text-lg font-bold text-success">
                {Math.floor(Math.random() * 20) + 15}/28
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};