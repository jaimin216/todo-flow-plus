import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Target,
  Brain,
  Timer,
  CheckCircle,
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
  const [sessionDuration, setSessionDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [totalFocusTime, setTotalFocusTime] = useState(180); // in minutes
  const { toast } = useToast();
  
  const totalDuration = isBreak ? breakDuration * 60 : sessionDuration * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const targetSessions = 8;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        // Focus session completed
        setSessionsToday(prev => prev + 1);
        setTotalFocusTime(prev => prev + sessionDuration);
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        setTimerState('idle');
        
        toast({
          title: "Focus session completed! 🎯",
          description: `Great work! Time for a ${breakDuration} minute break.`,
        });
      } else {
        // Break completed
        setIsBreak(false);
        setTimeLeft(sessionDuration * 60);
        setTimerState('idle');
        
        toast({
          title: "Break over! 💪",
          description: "Ready for another focus session?",
        });
      }
    }
    
    return () => clearInterval(interval);
  }, [timeLeft, timerState, isBreak, sessionDuration, breakDuration, toast]);

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
    setTimeLeft(isBreak ? breakDuration * 60 : sessionDuration * 60);
  };

  const adjustSessionDuration = (minutes: number) => {
    if (timerState === 'idle' && !isBreak) {
      setSessionDuration(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  return (
    <Card className="widget-card group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Focus Timer
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isBreak ? "secondary" : "default"} className="animate-fade-in">
              {isBreak ? (
                <><Coffee className="h-3 w-3 mr-1" />Break</>
              ) : (
                <><Target className="h-3 w-3 mr-1" />Focus</>
              )}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => adjustSessionDuration(15)}>
                  15 min sessions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => adjustSessionDuration(25)}>
                  25 min sessions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => adjustSessionDuration(45)}>
                  45 min sessions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Circle */}
        <motion.div 
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-muted/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Progress circle */}
            <motion.svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isBreak ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
                className="drop-shadow-lg"
              />
            </motion.svg>
            
            {/* Timer display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.p 
                  className="text-3xl font-bold"
                  key={formatTime(timeLeft)}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {formatTime(timeLeft)}
                </motion.p>
                <motion.p 
                  className="text-xs text-muted-foreground mt-1"
                  animate={{ 
                    color: timerState === 'running' 
                      ? isBreak ? "hsl(var(--secondary))" : "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))"
                  }}
                >
                  {isBreak ? '☕ Break time' : '🎯 Focus time'}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={timerState === 'running' ? "secondary" : "default"}
                size="sm"
                onClick={timerState === 'running' ? pauseTimer : startTimer}
                className="flex items-center space-x-2 hover-lift"
              >
                <AnimatePresence mode="wait">
                  {timerState === 'running' ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="flex items-center space-x-2"
                    >
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={resetTimer}
                className="flex items-center space-x-2 hover-lift"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Daily Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-4 pt-4 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="text-center p-2 rounded-lg hover:bg-success/5 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center space-x-1 mb-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Sessions</span>
            </div>
            <motion.p 
              className="text-lg font-bold text-success"
              key={sessionsToday}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {sessionsToday}
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="text-center p-2 rounded-lg hover:bg-orange-500/5 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Target</span>
            </div>
            <p className="text-lg font-bold text-orange-500">
              {targetSessions}
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center p-2 rounded-lg hover:bg-blue-500/5 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <motion.p 
              className="text-lg font-bold text-blue-500"
              key={totalFocusTime}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
            </motion.p>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
};