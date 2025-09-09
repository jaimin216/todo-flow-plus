import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  Trophy,
  Star,
  Zap,
  Target,
  Calendar,
  TrendingUp,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedDate?: string;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Complete 5 tasks before 9 AM',
    icon: Star,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    earned: true,
    earnedDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Productivity Ninja',
    description: 'Complete 20 tasks in a day',
    icon: Zap,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    earned: true,
    earnedDate: '2024-01-10'
  },
  {
    id: '3',
    title: 'Consistency King',
    description: 'Complete tasks 30 days in a row',
    icon: Crown,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    earned: false,
    progress: 12,
    maxProgress: 30
  },
  {
    id: '4',
    title: 'Focus Master',
    description: 'Complete 100 focus sessions',
    icon: Target,
    color: 'text-success',
    bgColor: 'bg-success/10',
    earned: false,
    progress: 67,
    maxProgress: 100
  },
  {
    id: '5',
    title: 'Habit Builder',
    description: 'Maintain 5 habits for 2 weeks',
    icon: TrendingUp,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    earned: false,
    progress: 8,
    maxProgress: 14
  }
];

export const AchievementsWidget = () => {
  const [achievements] = useState<Achievement[]>(mockAchievements);
  
  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const completionRate = (earnedCount / totalCount) * 100;
  
  const recentAchievements = achievements
    .filter(a => a.earned)
    .sort((a, b) => new Date(b.earnedDate!).getTime() - new Date(a.earnedDate!).getTime())
    .slice(0, 2);

  return (
    <Card className="widget-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Achievements
          </CardTitle>
          <Badge variant="secondary">
            {earnedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Circular Progress Overview */}
        <div className="flex items-center justify-center space-x-4 py-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{completionRate.toFixed(0)}%</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Achievement</p>
            <p className="text-sm text-muted-foreground">Progress</p>
          </div>
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Recently Earned
            </h4>
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.bgColor} border border-border/50`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                  >
                    <div className="w-3 h-3 bg-success rounded-full" />
                  </motion.div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
                  </p>
                </div>
                
                <Trophy className="h-4 w-4 text-warning" />
              </motion.div>
            ))}
          </div>
        )}

        {/* In Progress Achievements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            In Progress
          </h4>
          
          {achievements
            .filter(a => !a.earned && a.progress !== undefined)
            .slice(0, 3)
            .map((achievement, index) => {
              const progress = ((achievement.progress! / achievement.maxProgress!) * 100);
              
              return (
                <motion.div
                  key={achievement.id}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
                      <span className="text-sm font-medium">
                        {achievement.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  
                  <Progress value={progress} className="h-1.5" />
                  
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </motion.div>
              );
            })}
        </div>

        {/* Quick Stats */}
        <div className="pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Total Points</p>
              <p className="text-lg font-bold text-primary">
                {earnedCount * 100}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Rank</p>
              <p className="text-lg font-bold text-warning">
                #{Math.max(1, 100 - earnedCount * 15)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};