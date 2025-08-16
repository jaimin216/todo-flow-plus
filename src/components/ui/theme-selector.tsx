import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Theme = 'light' | 'dark' | 'theme-minimalistic' | 'theme-funky';

const themes = [
  { id: 'light', name: 'Light', preview: 'bg-white border' },
  { id: 'dark', name: 'Dark', preview: 'bg-gray-900 border-gray-700' },
  { id: 'theme-minimalistic', name: 'Minimal', preview: 'bg-gray-50 border-gray-200' },
  { id: 'theme-funky', name: 'Funky', preview: 'bg-gradient-to-r from-purple-400 to-pink-400' },
];

export const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  const applyTheme = (theme: Theme) => {
    // Remove existing theme classes
    document.documentElement.classList.remove('dark', 'theme-minimalistic', 'theme-funky');
    
    // Apply new theme
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
    
    setCurrentTheme(theme);
    localStorage.setItem('taskflow-theme', theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Palette className="mr-2 h-4 w-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => applyTheme(theme.id as Theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${theme.preview}`} />
              {theme.name}
            </div>
            {currentTheme === theme.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};