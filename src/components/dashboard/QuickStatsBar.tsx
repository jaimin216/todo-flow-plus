import { motion } from "framer-motion";
import { CheckCircle, Target, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsBarProps {
  completedTasks: number;
  totalTasks: number;
  goalsCompleted: number;
  totalGoals: number;
  focusTime: number;
}

export const QuickStatsBar = ({ 
  completedTasks, 
  totalTasks, 
  goalsCompleted, 
  totalGoals,
  focusTime 
}: QuickStatsBarProps) => {
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const goalProgress = totalGoals > 0 ? (goalsCompleted / totalGoals) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-3 gap-4 mb-6"
    >
      <Card className="widget-card hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Today</p>
                <motion.p 
                  className="text-xl font-bold text-success"
                  key={completedTasks}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {completedTasks}/{totalTasks}
                </motion.p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-lg font-semibold text-success">{taskProgress.toFixed(0)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="widget-card hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals Done</p>
                <motion.p 
                  className="text-xl font-bold text-primary"
                  key={goalsCompleted}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {goalsCompleted}/{totalGoals}
                </motion.p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Achievement</p>
              <p className="text-lg font-semibold text-primary">{goalProgress.toFixed(0)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="widget-card hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Focus Time</p>
                <motion.p 
                  className="text-xl font-bold text-warning"
                  key={focusTime}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {Math.floor(focusTime / 60)}h {focusTime % 60}m
                </motion.p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Sessions</p>
              <p className="text-lg font-semibold text-warning">3</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};