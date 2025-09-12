import { useState } from "react";
import { motion } from "framer-motion";
import { TaskView } from "@/components/tasks/TaskView";
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
import { Calendar, Target, TrendingUp, Brain, Trophy, StickyNote, Cloud, BarChart3, TrendingDown } from "lucide-react";
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
  const { toast } = useToast();

  const handleAddTask = () => {
    setShowQuickAdd(true);
  };

  const handleAddHabit = () => {
    toast({
      title: "Add Habit",
      description: "Habit creation feature coming soon!",
    });
  };

  const handleAddNote = () => {
    toast({
      title: "Add Note",
      description: "Note creation feature coming soon!",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's your productivity overview.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-xl font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`kpi-card bg-gradient-to-br ${stat.gradient} border-l-4 border-l-current ${stat.color}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <motion.p 
                        className="text-2xl font-bold"
                        key={stat.value}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                      >
                        {stat.value}
                      </motion.p>
                      <div className="flex items-center mt-1">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 mr-1 text-success" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                        )}
                        <p className={`text-xs ${stat.color}`}>
                          {stat.change}
                        </p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg bg-card/50 backdrop-blur-sm`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  
                  {/* Mini Sparkline */}
                  <div className="flex items-end space-x-1 h-6">
                    {stat.sparklineData.map((value, i) => (
                      <motion.div
                        key={i}
                        className={`flex-1 rounded-sm ${stat.color.replace('text-', 'bg-')}/30`}
                        style={{ height: `${(value / Math.max(...stat.sparklineData)) * 100}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / Math.max(...stat.sparklineData)) * 100}%` }}
                        transition={{ delay: index * 0.1 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Optimized Unified Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Today's Tasks - Primary Focus */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TaskView view="today" compact={false} />
          </motion.div>

          {/* Essential Widgets Column */}
          <motion.div
            className="lg:col-span-3 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <WeatherWidget />
            <HabitWidget />
            <FocusWidget />
          </motion.div>

          {/* Analytics Column */}
          <motion.div
            className="lg:col-span-3 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TaskCompletionChart />
            <WeeklyProductivityChart />
            <FinanceWidget />
          </motion.div>
        </div>

        {/* Secondary Features Row */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FinanceMiniDashboard />
          <AchievementsWidget />
          <NotesWidget />
          <Calendar />
        </motion.div>

        {/* Quick Actions - Compact Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-base font-bold widget-heading">Quick Actions</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-3 hover-lift group"
                onClick={() => onViewChange?.('calculator')}
              >
                <Target className="h-5 w-5 mb-1 sidebar-icon-hover group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Calculator</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-3 hover-lift group"
                onClick={() => onViewChange?.('weather')}
              >
                <Cloud className="h-5 w-5 mb-1 sidebar-icon-hover group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Weather</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-3 hover-lift group"
                onClick={() => onViewChange?.('habits')}
              >
                <Trophy className="h-5 w-5 mb-1 sidebar-icon-hover group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Habits</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-3 hover-lift group"
                onClick={() => onViewChange?.('focus')}
              >
                <Brain className="h-5 w-5 mb-1 sidebar-icon-hover group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Focus Timer</span>
              </Button>
            </div>
          </Card>
        </motion.div>
        
        {/* Floating Action Menu */}
        <FloatingActionMenu
          onAddTask={handleAddTask}
          onAddHabit={handleAddHabit}
          onAddNote={handleAddNote}
        />
        
        {/* Quick Add Dialog */}
        {showQuickAdd && (
          <QuickAdd 
            onAddTask={(task) => {
              console.log('New task:', task);
              setShowQuickAdd(false);
            }}
          />
        )}
      </motion.div>
    </div>
  );
};