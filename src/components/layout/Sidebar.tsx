import { Inbox, Calendar, CalendarDays, Calculator, Cloud, Plus, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "./AppLayout";
import { cn } from "@/lib/utils";
import { ProThemeSelector } from "@/components/ui/pro-theme-selector";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onProjectSelect: (projectId: string | null) => void;
}

const navigationItems = [
  { id: 'inbox' as ViewType, label: 'Inbox', icon: Inbox },
  { id: 'today' as ViewType, label: 'Today', icon: Calendar },
  { id: 'upcoming' as ViewType, label: 'Upcoming', icon: CalendarDays },
];

const widgetItems = [
  { id: 'calculator' as ViewType, label: 'Calculator', icon: Calculator },
  { id: 'weather' as ViewType, label: 'Weather', icon: Cloud },
];

export const Sidebar = ({ currentView, onViewChange, onProjectSelect }: SidebarProps) => {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col shadow-card">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          TaskFlow
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Tasks</h3>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-smooth",
                  currentView === item.id && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => {
                  onViewChange(item.id);
                  onProjectSelect(null);
                }}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
            >
              <div className="w-3 h-3 rounded-full bg-priority-2 mr-3" />
              Work
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
            >
              <div className="w-3 h-3 rounded-full bg-priority-3 mr-3" />
              Personal
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Widgets</h3>
          <div className="space-y-1">
            {widgetItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-smooth",
                  currentView === item.id && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <ProThemeSelector />
      </div>
    </aside>
  );
};