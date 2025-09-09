import { useState } from "react";
import { Plus, Calendar, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "./TaskView";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickAddProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const QuickAdd = ({ onAddTask }: QuickAddProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<string>("4");
  const [dueDate, setDueDate] = useState("");
  const [project, setProject] = useState("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    onAddTask({
      title: task,
      completed: false,
      priority: parseInt(priority) as 1 | 2 | 3 | 4,
      dueDate: dueDate || undefined,
      project: project === "none" ? undefined : project,
    });
    
    // Reset form
    setTask("");
    setPriority("4");
    setDueDate("");
    setProject("none");
    setIsOpen(false);
  };

  const parseNaturalLanguage = (input: string) => {
    // Basic NLP parsing - in a real app this would be more sophisticated
    const text = input.toLowerCase();
    let parsedTask = input;
    let parsedPriority = "4";
    let parsedDate = "";

    // Extract priority
    if (text.includes(" p1")) {
      parsedPriority = "1";
      parsedTask = input.replace(/ p1/i, "");
    } else if (text.includes(" p2")) {
      parsedPriority = "2"; 
      parsedTask = input.replace(/ p2/i, "");
    } else if (text.includes(" p3")) {
      parsedPriority = "3";
      parsedTask = input.replace(/ p3/i, "");
    }

    // Extract dates
    const today = new Date();
    if (text.includes("today")) {
      parsedDate = today.toISOString().split('T')[0];
      parsedTask = parsedTask.replace(/today/i, "").trim();
    } else if (text.includes("tomorrow")) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      parsedDate = tomorrow.toISOString().split('T')[0];
      parsedTask = parsedTask.replace(/tomorrow/i, "").trim();
    }

    return { task: parsedTask, priority: parsedPriority, date: parsedDate };
  };

  const handleQuickAdd = (input: string) => {
    const parsed = parseNaturalLanguage(input);
    setTask(parsed.task);
    setPriority(parsed.priority);
    setDueDate(parsed.date);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="floating-action-btn"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-primary hover:shadow-glow transition-spring">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="e.g., 'Buy groceries tomorrow P2'"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
                handleQuickAdd(e.target.value);
              }}
              className="focus:shadow-glow transition-smooth"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Try: "Call mom tomorrow P1" or "Review docs today P2"
            </p>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center">
                      <Flag className="mr-2 h-3 w-3 text-priority-1" />
                      P1 - Urgent
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center">
                      <Flag className="mr-2 h-3 w-3 text-priority-2" />
                      P2 - High
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center">
                      <Flag className="mr-2 h-3 w-3 text-priority-3" />
                      P3 - Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center">
                      <Flag className="mr-2 h-3 w-3 text-priority-4" />
                      P4 - Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Project (optional)</label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};