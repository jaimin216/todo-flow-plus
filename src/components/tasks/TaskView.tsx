import { useState, useEffect } from "react";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { QuickAdd } from "./QuickAdd";
import { ViewType } from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Filter, SortAsc } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  dueDate?: string;
  project?: string;
  createdAt: string;
}

interface TaskViewProps {
  view: ViewType;
  projectId?: string | null;
  compact?: boolean;
}

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Review quarterly reports',
    completed: false,
    priority: 1,
    dueDate: new Date().toISOString().split('T')[0],
    project: 'work',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Buy groceries for dinner',
    completed: false,
    priority: 2,
    dueDate: new Date().toISOString().split('T')[0],
    project: 'personal',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Call dentist for appointment',
    completed: true,
    priority: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Plan weekend trip',
    completed: false,
    priority: 4,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    project: 'personal',
    createdAt: new Date().toISOString(),
  },
];

export const TaskView = ({ view, projectId, compact = false }: TaskViewProps) => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'created'>('priority');
  const { toast } = useToast();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filterTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (view) {
      case 'today':
        return tasks.filter(task => task.dueDate === today && !task.completed);
      case 'upcoming':
        return tasks.filter(task => task.dueDate && task.dueDate > today && !task.completed);
      case 'project':
        return tasks.filter(task => task.project === projectId);
      default:
        return tasks.filter(task => !task.completed);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Task has been successfully removed.",
    });
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
    toast({
      title: "Task added! 🎉",
      description: `"${task.title}" has been added to your list.`,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Auto-set priority based on position
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          priority: Math.min(4, Math.max(1, Math.ceil((index + 1) / (newItems.length / 4)))) as 1 | 2 | 3 | 4
        }));
        
        toast({
          title: "Tasks reordered! 📝",
          description: "Priorities have been automatically updated based on position.",
        });
        
        return updatedItems;
      });
    }
  };

  const filteredTasks = filterTasks().sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return a.priority - b.priority;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getViewTitle = () => {
    switch (view) {
      case 'inbox': return 'Inbox';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'project': return projectId ? `Project: ${projectId}` : 'Project';
      default: return 'Tasks';
    }
  };

  return (
    <div className={compact ? "p-3" : "p-6"}>
      <div className={`max-w-4xl mx-auto space-y-${compact ? "2" : "6"}`}>
        {!compact && (
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {getViewTitle()}
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === 'priority' ? 'dueDate' : sortBy === 'dueDate' ? 'created' : 'priority')}
                className="hover-lift"
              >
                <SortAsc className="h-4 w-4 mr-2" />
                Sort by {sortBy === 'priority' ? 'Priority' : sortBy === 'dueDate' ? 'Due Date' : 'Created'}
              </Button>
              <QuickAdd onAddTask={handleAddTask} />
            </div>
          </motion.div>
        )}

        {filteredTasks.length === 0 ? (
          !compact && <EmptyState view={view} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence>
                <div className={`space-y-${compact ? "2" : "3"}`}>
                  {filteredTasks.slice(0, compact ? 4 : undefined).map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TaskCard
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        compact={compact}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </SortableContext>
          </DndContext>
        )}
        
        {compact && filteredTasks.length > 4 && (
          <motion.div 
            className="text-center pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-sm text-muted-foreground">
              +{filteredTasks.length - 4} more tasks
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};