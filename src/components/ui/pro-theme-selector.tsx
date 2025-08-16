import { useState, useEffect } from "react";
import { Palette, Check, Sun, Moon, Sparkles, Heart, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

type Theme = 'light' | 'dark' | 'theme-funky' | 'theme-serene' | 'theme-business';

const themes = [
  { 
    id: 'light', 
    name: 'Light Minimalist', 
    icon: Sun,
    font: 'Roboto',
    description: 'Clean & Professional',
    preview: 'bg-white border-gray-200',
    accentPreview: 'bg-black'
  },
  { 
    id: 'dark', 
    name: 'Dark Elegance', 
    icon: Moon,
    font: 'Inter',
    description: 'Eye-Comfortable & Modern',
    preview: 'bg-gray-900 border-gray-700',
    accentPreview: 'bg-blue-500'
  },
  { 
    id: 'theme-funky', 
    name: 'Funky Creative', 
    icon: Sparkles,
    font: 'Poppins',
    description: 'Vibrant & Playful',
    preview: 'bg-gradient-to-r from-purple-400 to-pink-400',
    accentPreview: 'bg-green-400'
  },
  { 
    id: 'theme-serene', 
    name: 'Serene Pastel', 
    icon: Heart,
    font: 'Nunito',
    description: 'Calm & Friendly',
    preview: 'bg-gradient-to-r from-teal-100 to-blue-100',
    accentPreview: 'bg-orange-300'
  },
  { 
    id: 'theme-business', 
    name: 'Business Class', 
    icon: Briefcase,
    font: 'Helvetica Neue',
    description: 'Premium & Corporate',
    preview: 'bg-gradient-to-r from-slate-900 to-slate-800',
    accentPreview: 'bg-yellow-500'
  },
];

export const ProThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  useEffect(() => {
    // Initialize theme from localStorage or default
    const savedTheme = localStorage.getItem('taskflow-pro-theme') as Theme || 'light';
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: Theme) => {
    // Remove existing theme classes
    document.documentElement.classList.remove('dark', 'theme-funky', 'theme-serene', 'theme-business');
    
    // Apply new theme
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
    
    setCurrentTheme(theme);
    localStorage.setItem('taskflow-pro-theme', theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start hover-glow">
          <Palette className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2" align="start">
        <div className="mb-3">
          <h3 className="font-semibold text-sm mb-1">Professional Themes</h3>
          <p className="text-xs text-muted-foreground">Each theme includes unique fonts & colors</p>
        </div>
        
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          const isActive = currentTheme === theme.id;
          
          return (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => applyTheme(theme.id as Theme)}
              className="p-3 cursor-pointer hover:bg-accent/50 rounded-lg mb-1"
            >
              <motion.div 
                className="flex items-center justify-between w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-lg ${theme.preview} flex items-center justify-center border-2`}>
                      <div className={`w-2 h-2 rounded-full ${theme.accentPreview}`} />
                    </div>
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check className="h-2.5 w-2.5" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme.font} • {theme.description}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </DropdownMenuItem>
          );
        })}
        
        <div className="mt-3 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Themes auto-save and sync across devices
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};