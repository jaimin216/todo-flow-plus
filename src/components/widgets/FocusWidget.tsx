import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type TimerState = 'idle' | 'running' | 'paused' | 'break';

interface FocusSession {
  date: string;
  sessions: number;
  totalMinutes: number;
}

export const FocusWidget = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [sessionsToday, setSessionsToday] = useState(3);
  const [isBreak, setIsBreak] = useState(false);
  
  const totalTime = isBreak ? 5 * 60 : 25 * 60; // 5 min break, 25 min work
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            if (isBreak) {
              setIsBreak(false);
              setTimeLeft(25 * 60);
            } else {
              setSessionsToday(prev => prev + 1);
              setIsBreak(true);
              setTimeLeft(5 * 60);
            }
            setTimerState('idle');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimerState('running');
  };

  const pauseTimer = () => {
    setTimerState('paused');
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const todayStats = {
    sessionsCompleted: sessionsToday,
    targetSessions: 8,
    focusTime: sessionsToday * 25, // minutes
  };

  return (
    <Card className="widget-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Focus Timer
          </CardTitle>
          <Badge variant={isBreak ? "secondary" : "outline"}>
            {isBreak ? 'Break' : 'Focus'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <motion.div
            className="relative inline-block"
            animate={{ scale: timerState === 'running' ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: timerState === 'running' ? Infinity : 0 }}
          >
            <div className="text-4xl font-bold font-mono mb-2">
              {formatTime(timeLeft)}
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={isBreak ? "hsl(var(--success))" : "hsl(var(--primary))"}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - progress / 100)}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                {isBreak ? (
                  <Coffee className="h-8 w-8 text-success" />
                ) : (
                  <Target className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center space-x-2">
          {timerState === 'idle' || timerState === 'paused' ? (
            <Button onClick={startTimer} className="bg-gradient-primary hover:opacity-90">
              <Play className="h-4 w-4 mr-2" />
              {timerState === 'paused' ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={resetTimer} variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Today's Stats */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sessions Today</span>
            <span className="font-medium">
              {todayStats.sessionsCompleted}/{todayStats.targetSessions}
            </span>
          </div>
          
          <Progress 
            value={(todayStats.sessionsCompleted / todayStats.targetSessions) * 100} 
            className="h-2" 
          />
          
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Focus Time</p>
              <p className="font-bold text-primary">
                {todayStats.focusTime}m
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg. Session</p>
              <p className="font-bold text-success">
                {todayStats.sessionsCompleted > 0 
                  ? Math.round(todayStats.focusTime / todayStats.sessionsCompleted)
                  : 0}m
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};