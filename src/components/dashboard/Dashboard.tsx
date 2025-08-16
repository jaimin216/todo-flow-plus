import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Grid3x3, 
  Calendar, 
  TrendingUp,
  Target,
  Plus,
  Settings,
  Award,
  Flame,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskView } from "@/components/tasks/TaskView";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { FinanceWidget } from "@/components/widgets/FinanceWidget";
import { HabitWidget } from "@/components/widgets/HabitWidget";
import { FocusWidget } from "@/components/widgets/FocusWidget";
import { AchievementsWidget } from "@/components/widgets/AchievementsWidget";

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  const [streak, setStreak] = useState(7);
  const [completionRate, setCompletionRate] = useState(85);

  const stats = [
    {
      title: "Today's Progress",
      value: "4/6",
      subtitle: "Tasks completed",
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Weekly Streak",
      value: `${streak}`,
      subtitle: "Days in a row",
      icon: Flame,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: "This week",
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
    }
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Good morning! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You have 6 tasks for today. Let's make it productive!
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="hover-glow">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={itemVariants}
      >
        {stats.map((stat, index) => (
          <Card key={index} className="widget-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline space-x-1">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <Card className="widget-card h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Today's Tasks
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewChange('today')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <TaskView view="today" compact />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Widgets Column */}
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          {/* Weather Widget */}
          <WeatherWidget />
          
          {/* Achievements Widget */}
          <AchievementsWidget />
          
          {/* Focus Timer Widget */}
          <FocusWidget />
        </motion.div>
      </div>

      {/* Secondary Widgets Row */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Habit Tracker */}
        <HabitWidget />
        
        {/* Finance Overview */}
        <FinanceWidget />
      </motion.div>
    </motion.div>
  );
};