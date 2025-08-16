import { Inbox, Calendar, CalendarDays, Plus, Cloud, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "./AppLayout";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems = [
  { id: 'inbox' as ViewType, label: 'Inbox', icon: Inbox },
  { id: 'today' as ViewType, label: 'Today', icon: Calendar },
  { id: 'upcoming' as ViewType, label: 'Upcoming', icon: CalendarDays },
  { id: 'weather' as ViewType, label: 'Weather', icon: Cloud },
  { id: 'calculator' as ViewType, label: 'More', icon: Settings },
];

export const MobileNav = ({ currentView, onViewChange }: MobileNavProps) => {
  return (
    <nav className="bg-card border-t border-border px-4 py-2 shadow-card">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center space-y-1 h-auto py-2 px-3 transition-smooth",
              currentView === item.id && "text-primary"
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
        
        {/* Floating Add Button */}
        <Button
          size="lg"
          className="fixed bottom-20 right-6 rounded-full shadow-elegant hover:shadow-glow transition-spring bg-gradient-primary"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};