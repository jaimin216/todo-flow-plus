import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TaskView } from "@/components/tasks/TaskView";
import { Calculator } from "@/components/widgets/Calculator";
import { Weather } from "@/components/widgets/Weather";
import { HabitWidget } from "@/components/widgets/HabitWidget";
import { FinanceWidget } from "@/components/widgets/FinanceWidget";
import { FocusWidget } from "@/components/widgets/FocusWidget";
import { AchievementsWidget } from "@/components/widgets/AchievementsWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";

export type ViewType = 'dashboard' | 'inbox' | 'today' | 'upcoming' | 'calculator' | 'weather' | 'habits' | 'finance' | 'focus' | 'achievements' | 'notes' | 'project';

export const AppLayout = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'calculator':
        return <Calculator />;
      case 'weather':
        return <Weather />;
      case 'habits':
        return <HabitWidget />;
      case 'finance':
        return <FinanceWidget />;
      case 'focus':
        return <FocusWidget />;
      case 'achievements':
        return <AchievementsWidget />;
      case 'notes':
        return <NotesWidget />;
      case 'inbox':
      case 'today':  
      case 'upcoming':
      case 'project':
        return <TaskView view={currentView} projectId={selectedProject} />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {!isMobile && (
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onProjectSelect={setSelectedProject}
        />
      )}
      
      <div className="flex-1 flex flex-col">
        <Header currentView={currentView} />
        
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
        
        {isMobile && (
          <MobileNav 
            currentView={currentView} 
            onViewChange={setCurrentView}
          />
        )}
      </div>
    </div>
  );
};