import { useState } from "react";
import { Calendar, Trash2, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "./TaskView";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
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

export const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-elegant transition-smooth border-l-4",
        priorityStyles[task.priority],
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto hover:bg-transparent"
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-smooth" />
            )}
          </Button>
          
          <div className="flex-1 space-y-2">
            <h3 className={cn(
              "font-medium text-foreground",
              task.completed && "line-through text-muted-foreground"
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
    </div>
  );
};