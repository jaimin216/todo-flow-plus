import { useState } from "react";
import { motion } from "framer-motion";
import { TaskView, Task } from "@/components/tasks/TaskView";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { HabitWidget } from "@/components/widgets/HabitWidget";
import { FinanceWidget } from "@/components/widgets/FinanceWidget";
import { FocusWidget } from "@/components/widgets/FocusWidget";
import { AchievementsWidget } from "@/components/widgets/AchievementsWidget";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { TaskCompletionChart } from "@/components/analytics/TaskCompletionChart";
import { WeeklyProductivityChart } from "@/components/analytics/WeeklyProductivityChart";
import { FinanceMiniDashboard } from "@/components/analytics/FinanceMiniDashboard";
import { FloatingActionMenu } from "@/components/ui/floating-action-menu";
import { QuickAdd } from "@/components/tasks/QuickAdd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, TrendingUp, Brain, Trophy, StickyNote, Cloud, BarChart3, TrendingDown, Settings } from "lucide-react";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { ViewType } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onViewChange?: (view: ViewType) => void;
}

const statCards = [
  {
    title: "Today's Progress",
    value: "73%",
    change: "+12%",
    icon: Target,
    color: "text-success",
    gradient: "from-success/20 to-success/5",
    sparklineData: [65, 68, 70, 73],
    trend: "up"
  },
  {
    title: "Completed Tasks",
    value: "8/12",
    change: "+3",
    icon: Calendar,
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
    sparklineData: [5, 6, 7, 8],
    trend: "up"
  },
  {
    title: "Focus Sessions",
    value: "3",
    change: "+1",
    icon: Brain,
    color: "text-warning",
    gradient: "from-warning/20 to-warning/5",
    sparklineData: [2, 2, 3, 3],
    trend: "up"
  },
  {
    title: "Budget Health",
    value: "82%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-success",
    gradient: "from-success/20 to-success/5",
    sparklineData: [77, 79, 80, 82],
    trend: "up"
  }
];

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete project proposal', completed: false, priority: 1, createdAt: new Date().toISOString() },
    { id: '2', title: 'Review team feedback', completed: true, priority: 2, createdAt: new Date().toISOString() },
    { id: '3', title: 'Schedule client meeting', completed: false, priority: 2, createdAt: new Date().toISOString() },
    { id: '4', title: 'Update documentation', completed: true, priority: 3, createdAt: new Date().toISOString() },
    { id: '5', title: 'Code review session', completed: false, priority: 1, createdAt: new Date().toISOString() },
  ]);
  const { toast } = useToast();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleAddTask = (newTask: { title: string; priority: 1 | 2 | 3 | 4 }) => {
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      completed: false,
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
    setShowQuickAdd(false);
    toast({
      title: "Task added! 🎉",
      description: `"${task.title}" has been added to your list.`,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Enhanced Header with Theme Selector */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Dashboard
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-sm mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </motion.p>
          </div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-40">
              <ThemeSelector />
            </div>
            <Button 
              onClick={() => setShowQuickAdd(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </motion.div>
        </div>

        {/* Modern Grid Layout - Matching Reference */}
        <motion.div
          className="grid grid-cols-12 gap-6 min-h-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Hero Card - Large Featured Tasks */}
          <motion.div
            className="col-span-12 lg:col-span-8 row-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden">
              <CardContent className="p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Today's Focus</h2>
                    <p className="text-muted-foreground text-sm">Your priority tasks</p>
                  </div>
                    <div className="text-3xl font-bold text-primary">{completedTasks}/{totalTasks}</div>
                    <p className="text-muted-foreground text-sm">Tasks completed today</p>
                  </div>
                <div className="h-[calc(100%-4rem)]">
                  <TaskView view="today" compact={true} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weather Widget - Top Right */}
          <motion.div
            className="col-span-12 lg:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <WeatherWidget />
          </motion.div>

          {/* Progress Card */}
          <motion.div
            className="col-span-6 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="h-full bg-gradient-to-br from-success/20 to-success/5 border-success/20">
              <CardContent className="p-4 text-center">
                <div className="mb-2">
                  <Target className="h-6 w-6 mx-auto text-success mb-2" />
                  <div className="text-2xl font-bold text-success">{completionPercentage}%</div>
                  <p className="text-xs text-muted-foreground">Daily Progress</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Habits Card */}
          <motion.div
            className="col-span-6 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="h-full bg-gradient-to-br from-warning/20 to-warning/5 border-warning/20">
              <CardContent className="p-4 text-center">
                <div className="mb-2">
                  <Trophy className="h-6 w-6 mx-auto text-warning mb-2" />
                  <div className="text-2xl font-bold text-warning">5/7</div>
                  <p className="text-xs text-muted-foreground">Habits Done</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Finance Overview */}
          <motion.div
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="h-full bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Budget Overview</h3>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Spent</span>
                    <span className="font-medium">$1,247.80</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className="font-medium text-success">$752.20</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Tools - Compact */}
          <motion.div
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="h-full bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <StickyNote className="h-5 w-5 mr-2 text-purple-500" />
                  <h3 className="font-semibold text-foreground">Quick Tools</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col py-3 hover:bg-accent/50"
                    onClick={() => onViewChange?.('focus')}
                  >
                    <Brain className="h-4 w-4 mb-1" />
                    <span className="text-xs">Focus</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col py-3 hover:bg-accent/50"
                    onClick={() => onViewChange?.('calculator')}
                  >
                    <Target className="h-4 w-4 mb-1" />
                    <span className="text-xs">Calculator</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Quick Add Dialog */}
        {showQuickAdd && (
          <QuickAdd 
            onAddTask={handleAddTask}
          />
        )}
      </motion.div>
    </div>
  );
};