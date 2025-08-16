import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TaskView } from "@/components/tasks/TaskView";
import { Calculator } from "@/components/widgets/Calculator";
import { Weather } from "@/components/widgets/Weather";
import { useIsMobile } from "@/hooks/use-mobile";

export type ViewType = 'inbox' | 'today' | 'upcoming' | 'calculator' | 'weather' | 'project';

export const AppLayout = () => {
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const renderView = () => {
    switch (currentView) {
      case 'calculator':
        return <Calculator />;
      case 'weather':
        return <Weather />;
      case 'inbox':
      case 'today':  
      case 'upcoming':
      case 'project':
        return <TaskView view={currentView} projectId={selectedProject} />;
      default:
        return <TaskView view="inbox" />;
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