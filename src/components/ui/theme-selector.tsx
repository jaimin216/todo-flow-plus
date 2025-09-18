import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Theme = 'light' | 'dark' | 'theme-funky' | 'theme-serene' | 'theme-business';

const themes = [
  { id: 'light', name: 'Professional', preview: 'bg-white border border-gray-200', desc: 'Clean & Executive' },
  { id: 'dark', name: 'Executive Dark', preview: 'bg-slate-900 border border-slate-700', desc: 'Premium & Sophisticated' },
  { id: 'theme-funky', name: 'Creative', preview: 'bg-gradient-to-r from-purple-400 to-pink-400', desc: 'Vibrant & Playful' },
  { id: 'theme-serene', name: 'Calm', preview: 'bg-gradient-to-r from-teal-100 to-blue-100', desc: 'Peaceful & Friendly' },
  { id: 'theme-business', name: 'Corporate', preview: 'bg-gradient-to-r from-yellow-600 to-yellow-400', desc: 'Premium & Luxurious' },
];

export const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  const applyTheme = (theme: Theme) => {
    // Remove existing theme classes
    document.documentElement.classList.remove('dark', 'theme-funky', 'theme-serene', 'theme-business');
    
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
      <DropdownMenuContent className="w-56" align="start">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => applyTheme(theme.id as Theme)}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full mr-3 ${theme.preview}`} />
              <div>
                <div className="font-medium">{theme.name}</div>
                <div className="text-xs text-muted-foreground">{theme.desc}</div>
              </div>
            </div>
            {currentTheme === theme.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};