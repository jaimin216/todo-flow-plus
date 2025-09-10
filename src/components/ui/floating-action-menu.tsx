import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Target, Coffee, StickyNote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionMenuProps {
  onAddTask: () => void;
  onAddHabit: () => void;
  onAddNote: () => void;
}

export const FloatingActionMenu = ({ onAddTask, onAddHabit, onAddNote }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: Target,
      label: "Add Task",
      color: "bg-primary text-primary-foreground",
      onClick: () => {
        onAddTask();
        setIsOpen(false);
      }
    },
    {
      icon: Coffee,
      label: "Add Habit",
      color: "bg-success text-success-foreground",
      onClick: () => {
        onAddHabit();
        setIsOpen(false);
      }
    },
    {
      icon: StickyNote,
      label: "Add Note",
      color: "bg-warning text-warning-foreground",
      onClick: () => {
        onAddNote();
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <span className="text-sm font-medium text-foreground bg-card px-3 py-2 rounded-lg shadow-elegant border border-border whitespace-nowrap">
                  {item.label}
                </span>
                <Button
                  size="sm"
                  className={cn(
                    "rounded-full w-12 h-12 p-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-110",
                    item.color
                  )}
                  onClick={item.onClick}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="floating-action-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};