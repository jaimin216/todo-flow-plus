import { useState } from "react";
import { Home, Inbox, Calendar, CalendarDays, Calculator, Cloud, Plus, Palette, Target, DollarSign, Brain, Trophy, StickyNote, ChevronLeft, ChevronRight, Briefcase, User, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "./AppLayout";
import { cn } from "@/lib/utils";
import { ProThemeSelector } from "@/components/ui/pro-theme-selector";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onProjectSelect: (projectId: string | null) => void;
}

const projectIcons = {
  work: Briefcase,
  personal: User,
  health: Heart,
  learning: BookOpen
};

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "bg-card border-r border-border flex flex-col shadow-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            TaskFlow
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 hover-lift"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Tasks
            </h3>
          )}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "transition-smooth hover-lift group",
                  isCollapsed ? "w-12 h-12 p-0 justify-center" : "w-full justify-start",
                  currentView === item.id && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => {
                  onViewChange(item.id);
                  onProjectSelect(null);
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={cn(
                  "sidebar-icon-hover",
                  isCollapsed ? "h-5 w-5" : "mr-3 h-4 w-4"
                )} />
                {!isCollapsed && item.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Projects
              </h3>
            )}
            {!isCollapsed && (
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover-lift">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {['work', 'personal', 'health', 'learning'].map((project) => {
              const IconComponent = projectIcons[project as keyof typeof projectIcons];
              return (
                <Button
                  key={project}
                  variant={currentView === 'project' ? "secondary" : "ghost"}
                  className={cn(
                    "transition-smooth capitalize hover-lift group",
                    isCollapsed ? "w-12 h-12 p-0 justify-center" : "w-full justify-start",
                    currentView === 'project' && "bg-primary/10 text-primary font-medium"
                  )}
                  onClick={() => {
                    onViewChange('project');
                    onProjectSelect(project);
                  }}
                  title={isCollapsed ? project : undefined}
                >
                  {isCollapsed ? (
                    <IconComponent className="h-5 w-5 sidebar-icon-hover" />
                  ) : (
                    <>
                      <div className={cn(
                        "w-3 h-3 rounded-full mr-3",
                        project === 'work' && "bg-priority-2",
                        project === 'personal' && "bg-priority-3", 
                        project === 'health' && "bg-success",
                        project === 'learning' && "bg-priority-1"
                      )} />
                      <IconComponent className="h-4 w-4 mr-2 sidebar-icon-hover" />
                      {project}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Widgets
            </h3>
          )}
          <div className="space-y-1">
            {widgetItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "transition-smooth hover-lift group",
                  isCollapsed ? "w-12 h-12 p-0 justify-center" : "w-full justify-start",
                  currentView === item.id && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => onViewChange(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={cn(
                  "sidebar-icon-hover",
                  isCollapsed ? "h-5 w-5" : "mr-3 h-4 w-4"
                )} />
                {!isCollapsed && item.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <ProThemeSelector />
        </div>
      )}
    </aside>
  );
};