import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Thermometer,
  Wind,
  Droplets,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

const mockWeatherData: WeatherData = {
  location: "New York, NY",
  temperature: 72,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 8,
  forecast: [
    { day: "Today", high: 75, low: 62, condition: "Partly Cloudy" },
    { day: "Tomorrow", high: 78, low: 65, condition: "Sunny" },
    { day: "Wed", high: 71, low: 58, condition: "Rainy" },
    { day: "Thu", high: 69, low: 55, condition: "Cloudy" },
    { day: "Fri", high: 74, low: 61, condition: "Sunny" }
  ]
};

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return Sun;
    case 'rainy':
      return CloudRain;
    case 'snowy':
      return CloudSnow;
    case 'cloudy':
    case 'partly cloudy':
    default:
      return Cloud;
  }
};

const getWeatherColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return 'text-warning';
    case 'rainy':
      return 'text-primary';
    case 'snowy':
      return 'text-muted-foreground';
    case 'cloudy':
    case 'partly cloudy':
    default:
      return 'text-accent-foreground';
  }
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);
  
  const WeatherIcon = getWeatherIcon(weather.condition);
  const weatherColor = getWeatherColor(weather.condition);

  return (
    <Card className="widget-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Cloud className="h-5 w-5 mr-2" />
          Weather
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {weather.location}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold">
                {weather.temperature}°
              </span>
              <div>
                <Badge variant="secondary" className="text-xs">
                  {weather.condition}
                </Badge>
              </div>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className={`p-3 rounded-full bg-accent/20`}
          >
            <WeatherIcon className={`h-8 w-8 ${weatherColor}`} />
          </motion.div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-primary" />
            <span>{weather.humidity}% humidity</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span>{weather.windSpeed} mph</span>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            5-Day Forecast
          </h4>
          <div className="space-y-1">
            {weather.forecast.map((day, index) => {
              const DayIcon = getWeatherIcon(day.condition);
              const dayColor = getWeatherColor(day.condition);
              
              return (
                <motion.div
                  key={day.day}
                  className="flex items-center justify-between py-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <DayIcon className={`h-4 w-4 ${dayColor}`} />
                    <span className="text-sm font-medium min-w-[60px]">
                      {day.day}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-muted-foreground">{day.low}°</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};