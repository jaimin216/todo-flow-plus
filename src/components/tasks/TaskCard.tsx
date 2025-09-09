import { useState } from "react";
import { Calendar, Trash2, CheckCircle, Circle, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "./TaskView";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  compact?: boolean;
}

const priorityStyles = {
  1: "border-l-priority-1 bg-priority-1/5",
  2: "border-l-priority-2 bg-priority-2/5", 
  3: "border-l-priority-3 bg-priority-3/5",
  4: "border-l-priority-4 bg-priority-4/5",
};

const priorityLabels = {
  1: "P1",
  2: "P2", 
  3: "P3",
  4: "P4",
};

const priorityColors = {
  1: "bg-priority-1",
  2: "bg-priority-2",
  3: "bg-priority-3", 
  4: "bg-priority-4",
};

export const TaskCard = ({ task, onToggleComplete, onDelete, compact = false }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString();
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-elegant transition-smooth border-l-4 sortable-item group",
        priorityStyles[task.priority],
        task.completed && "opacity-60 bg-success/5",
        isDragging && "dragging shadow-glow z-50 rotate-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {!compact && (
            <div 
              {...attributes} 
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="h-5 w-5 data-[state=checked]:bg-success data-[state=checked]:border-success"
          />
          
          <div className="flex-1 space-y-2">
            <h3 className={cn(
              "task-text text-foreground",
              task.completed && "line-through text-muted-foreground/80"
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs px-2 py-1", priorityColors[task.priority], "text-white border-0")}
              >
                {priorityLabels[task.priority]}
              </Badge>
              
              {task.dueDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(task.dueDate)}
                </div>
              )}
              
              {task.project && (
                <Badge variant="secondary" className="text-xs">
                  {task.project}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {isHovered && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};