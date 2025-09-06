import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ViewType } from "./AppLayout";

interface HeaderProps {
  currentView: ViewType;
}

const viewTitles: Record<ViewType, string> = {
  dashboard: 'Dashboard',
  inbox: 'Inbox',
  today: 'Today',
  upcoming: 'Upcoming',
  calculator: 'Calculator',
  weather: 'Weather',
  habits: 'Habits',
  finance: 'Finance',
  focus: 'Focus',
  achievements: 'Achievements',
  notes: 'Notes',
  project: 'Project'
};

export const Header = ({ currentView }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {viewTitles[currentView]}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {['inbox', 'today', 'upcoming', 'project'].includes(currentView) && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 w-64 transition-smooth focus:shadow-glow"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};