import { Home, Inbox, Calendar, CalendarDays, Calculator, Cloud, Plus, Palette, Target, DollarSign, Brain, Trophy, StickyNote } from "lucide-react";
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
  { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Home },
  { id: 'inbox' as ViewType, label: 'Inbox', icon: Inbox },
  { id: 'today' as ViewType, label: 'Today', icon: Calendar },
  { id: 'upcoming' as ViewType, label: 'Upcoming', icon: CalendarDays },
];

const widgetItems = [
  { id: 'calculator' as ViewType, label: 'Calculator', icon: Calculator },
  { id: 'weather' as ViewType, label: 'Weather', icon: Cloud },
  { id: 'habits' as ViewType, label: 'Habits', icon: Target },
  { id: 'finance' as ViewType, label: 'Finance', icon: DollarSign },
  { id: 'focus' as ViewType, label: 'Focus', icon: Brain },
  { id: 'achievements' as ViewType, label: 'Achievements', icon: Trophy },
  { id: 'notes' as ViewType, label: 'Notes', icon: StickyNote },
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
            {['work', 'personal', 'health', 'learning'].map((project) => (
              <Button
                key={project}
                variant={currentView === 'project' ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-smooth capitalize",
                  currentView === 'project' && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => {
                  onViewChange('project');
                  onProjectSelect(project);
                }}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full mr-3",
                  project === 'work' && "bg-priority-2",
                  project === 'personal' && "bg-priority-3", 
                  project === 'health' && "bg-success",
                  project === 'learning' && "bg-priority-1"
                )} />
                {project}
              </Button>
            ))}
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