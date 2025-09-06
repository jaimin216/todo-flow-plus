import { motion } from "framer-motion";
import { TaskView } from "@/components/tasks/TaskView";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { HabitWidget } from "@/components/widgets/HabitWidget";
import { FinanceWidget } from "@/components/widgets/FinanceWidget";
import { FocusWidget } from "@/components/widgets/FocusWidget";
import { AchievementsWidget } from "@/components/widgets/AchievementsWidget";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, TrendingUp, Brain, Trophy, StickyNote, Cloud } from "lucide-react";
import { ViewType } from "@/components/layout/AppLayout";

interface DashboardProps {
  onViewChange?: (view: ViewType) => void;
}

const statCards = [
  {
    title: "Today's Progress",
    value: "73%",
    change: "+12%",
    icon: Target,
    color: "text-success"
  },
  {
    title: "Completed Tasks",
    value: "8/12",
    change: "+3",
    icon: Calendar,
    color: "text-primary"
  },
  {
    title: "Focus Sessions",
    value: "3",
    change: "+1",
    icon: Brain,
    color: "text-warning"
  },
  {
    title: "Budget Health",
    value: "82%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-success"
  }
];

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover-lift cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.color}`}>
                        {stat.change} from yesterday
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-primary/10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks - Takes up 2 columns */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-fit">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Today's Tasks
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewChange?.('today')}
                  >
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-0">
                <TaskView view="today" compact={true} />
              </div>
            </Card>
          </motion.div>

          {/* Right Column Widgets */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <WeatherWidget />
            <div className="grid grid-cols-1 gap-4">
              <AchievementsWidget />
            </div>
          </motion.div>
        </div>

        {/* Secondary Widgets Row */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FocusWidget />
          <HabitWidget />
          <FinanceWidget />
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <NotesWidget />
          <Card className="p-6">
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4"
                  onClick={() => onViewChange?.('calculator')}
                >
                  <Target className="h-6 w-6 mb-2" />
                  Calculator
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4"
                  onClick={() => onViewChange?.('weather')}
                >
                  <Cloud className="h-6 w-6 mb-2" />
                  Weather
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4"
                  onClick={() => onViewChange?.('habits')}
                >
                  <Target className="h-6 w-6 mb-2" />
                  Habits
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-4"
                  onClick={() => onViewChange?.('focus')}
                >
                  <Brain className="h-6 w-6 mb-2" />
                  Focus Timer
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};