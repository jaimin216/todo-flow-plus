import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskView, Task } from "@/components/tasks/TaskView";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { HabitWidget } from "@/components/widgets/HabitWidget";
import { FinanceWidget } from "@/components/widgets/FinanceWidget";
import { FocusWidget } from "@/components/widgets/FocusWidget";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { QuickAdd } from "@/components/tasks/QuickAdd";
import { QuickStatsBar } from "./QuickStatsBar";
import { NotificationCenter } from "./NotificationCenter";
import { SmartInsights } from "./SmartInsights";
import { MiniCalendar } from "./MiniCalendar";
import { CollapsibleWidget } from "./CollapsibleWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Brain, 
  Trophy, 
  StickyNote, 
  Cloud, 
  Settings,
  Plus,
  BarChart3,
  Calculator,
  Bell,
  Lightbulb,
  Clock,
  GripVertical
} from "lucide-react";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { ViewType } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DashboardProps {
  onViewChange?: (view: ViewType) => void;
}

// Widget configuration for drag and drop
interface WidgetConfig {
  id: string;
  type: 'tasks' | 'weather' | 'habits' | 'finance' | 'focus' | 'calendar' | 'insights' | 'notifications' | 'quicktools';
  title: string;
  icon: any;
  size: 'small' | 'medium' | 'large';
  defaultPosition: number;
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'tasks', type: 'tasks', title: "Today's Focus", icon: Target, size: 'large', defaultPosition: 0 },
  { id: 'weather', type: 'weather', title: 'Weather', icon: Cloud, size: 'small', defaultPosition: 1 },
  { id: 'habits', type: 'habits', title: 'Daily Habits', icon: Trophy, size: 'medium', defaultPosition: 2 },
  { id: 'finance', type: 'finance', title: 'Finance', icon: TrendingUp, size: 'medium', defaultPosition: 3 },
  { id: 'focus', type: 'focus', title: 'Focus Timer', icon: Brain, size: 'medium', defaultPosition: 4 },
  { id: 'calendar', type: 'calendar', title: 'Calendar', icon: Calendar, size: 'medium', defaultPosition: 5 },
  { id: 'insights', type: 'insights', title: 'Smart Insights', icon: Lightbulb, size: 'medium', defaultPosition: 6 },
  { id: 'notifications', type: 'notifications', title: 'Notifications', icon: Bell, size: 'medium', defaultPosition: 7 },
  { id: 'quicktools', type: 'quicktools', title: 'Quick Tools', icon: Settings, size: 'small', defaultPosition: 8 }
];

// Sortable Widget Wrapper
const SortableWidget = ({ widget, children }: { widget: WidgetConfig; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="group relative">
      <div
        {...listeners}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="p-1 rounded bg-background/80 backdrop-blur-sm border border-border/50">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      {children}
    </div>
  );
};

export const Dashboard = ({ onViewChange }: DashboardProps) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete project proposal', completed: false, priority: 1, createdAt: new Date().toISOString() },
    { id: '2', title: 'Review team feedback', completed: true, priority: 2, createdAt: new Date().toISOString() },
    { id: '3', title: 'Schedule client meeting', completed: false, priority: 2, createdAt: new Date().toISOString() },
    { id: '4', title: 'Update documentation', completed: true, priority: 3, createdAt: new Date().toISOString() },
    { id: '5', title: 'Code review session', completed: false, priority: 1, createdAt: new Date().toISOString() },
  ]);
  const { toast } = useToast();
  
  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Gamification stats
  const goalsCompleted = 5; // Mock data
  const totalGoals = 7;
  const focusTime = 180; // in minutes
  const streakDays = 12;
  const xpPoints = 1250;

  const handleAddTask = useCallback((newTask: { title: string; priority: 1 | 2 | 3 | 4 }) => {
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
  }, [toast]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      
      toast({
        title: "Layout updated! ✨",
        description: "Your dashboard has been rearranged.",
      });
    }
  }, [toast]);

  const renderWidget = (widget: WidgetConfig) => {
    const getSizeClass = (size: string) => {
      switch (size) {
        case 'small': return 'col-span-1';
        case 'large': return 'col-span-2 row-span-2';
        default: return 'col-span-1';
      }
    };

    const widgetContent = () => {
      switch (widget.type) {
        case 'tasks':
          return <TaskView view="today" compact={true} />;
        case 'weather':
          return <WeatherWidget />;
        case 'habits':
          return <HabitWidget />;
        case 'finance':
          return <FinanceWidget />;
        case 'focus':
          return <FocusWidget />;
        case 'calendar':
          return <MiniCalendar />;
        case 'insights':
          return <SmartInsights />;
        case 'notifications':
          return <NotificationCenter />;
        case 'quicktools':
          return (
            <Card className="widget-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Quick Tools
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col py-6 hover-lift interactive-card"
                    onClick={() => onViewChange?.('focus')}
                  >
                    <Brain className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-xs">Focus Mode</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col py-6 hover-lift interactive-card"
                    onClick={() => onViewChange?.('calculator')}
                  >
                    <Calculator className="h-6 w-6 mb-2 text-warning" />
                    <span className="text-xs">Calculator</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col py-6 hover-lift interactive-card"
                    onClick={() => setShowQuickAdd(true)}
                  >
                    <Plus className="h-6 w-6 mb-2 text-success" />
                    <span className="text-xs">Add Task</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col py-6 hover-lift interactive-card"
                  >
                    <BarChart3 className="h-6 w-6 mb-2 text-destructive" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        default:
          return null;
      }
    };

    return (
      <SortableWidget key={widget.id} widget={widget}>
        <motion.div
          className={getSizeClass(widget.size)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: widget.defaultPosition * 0.1 }}
          layout
        >
          {widgetContent()}
        </motion.div>
      </SortableWidget>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Professional Header with Gamification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-gradient-primary"
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
            
            {/* Gamification Badges */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge variant="secondary" className="hover-lift">
                <Trophy className="h-3 w-3 mr-1" />
                {streakDays} day streak
              </Badge>
              <Badge variant="secondary" className="hover-lift">
                <Target className="h-3 w-3 mr-1" />
                {xpPoints} XP
              </Badge>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ThemeSelector />
            <Button 
              onClick={() => setShowQuickAdd(true)}
              className="bg-gradient-primary hover:shadow-glow text-primary-foreground shadow-elegant hover-lift"
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats Bar */}
        <QuickStatsBar 
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          goalsCompleted={goalsCompleted}
          totalGoals={totalGoals}
          focusTime={focusTime}
        />

        {/* Professional 3-Column Grid Layout */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            <motion.div
              className="dashboard-grid-3col auto-rows-fr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {widgets.map(widget => renderWidget(widget))}
            </motion.div>
          </SortableContext>
        </DndContext>
        
        {/* Enhanced Quick Add Dialog */}
        <AnimatePresence>
          {showQuickAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              onClick={() => setShowQuickAdd(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <QuickAdd 
                  onAddTask={handleAddTask}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};