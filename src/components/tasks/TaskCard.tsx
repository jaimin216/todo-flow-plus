import React, { useState } from "react";
import { Calendar, Trash2, CheckCircle, Circle, GripVertical, ChevronDown, ChevronRight, FileText, Briefcase, User, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "./TaskView";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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

const projectIcons = {
  work: Briefcase,
  personal: User,
  health: Heart,
  learning: BookOpen
};

export const TaskCard = ({ task, onToggleComplete, onDelete, compact = false }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
                <Badge variant="secondary" className="text-xs flex items-center">
                  {projectIcons[task.project as keyof typeof projectIcons] && (
                    <>
                      {React.createElement(projectIcons[task.project as keyof typeof projectIcons], {
                        className: "h-3 w-3 mr-1"
                      })}
                    </>
                  )}
                  {task.project}
                </Badge>
              )}
              
              {(task.subtasks?.length || task.notes) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronRight className="h-3 w-3 mr-1" />
                  )}
                  Details
                </Button>
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
      
      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/50 pt-3 mt-3 space-y-3"
          >
            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
                </h4>
                <div className="space-y-1.5">
                  {task.subtasks.map((subtask, index) => (
                    <motion.div
                      key={subtask.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-2 p-2 rounded bg-muted/30"
                    >
                      <Checkbox
                        checked={subtask.completed}
                        className="h-4 w-4"
                        disabled
                      />
                      <span className={cn(
                        "text-sm flex-1",
                        subtask.completed && "line-through text-muted-foreground/80"
                      )}>
                        {subtask.title}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Notes */}
            {task.notes && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Notes
                </h4>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {task.notes}
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};