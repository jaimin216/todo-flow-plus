import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, MapPin, Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    icon: "sun" | "cloud" | "rain";
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: "sun" | "cloud" | "rain";
  }>;
}

const mockWeatherData: WeatherData = {
  location: "San Francisco, CA",
  current: {
    temperature: 72,
    condition: "Partly Cloudy",
    icon: "cloud",
  },
  forecast: [
    { day: "Today", high: 75, low: 58, condition: "Sunny", icon: "sun" },
    { day: "Tomorrow", high: 73, low: 55, condition: "Partly Cloudy", icon: "cloud" },
    { day: "Wed", high: 68, low: 52, condition: "Light Rain", icon: "rain" },
    { day: "Thu", high: 71, low: 54, condition: "Sunny", icon: "sun" },
    { day: "Fri", high: 74, low: 57, condition: "Partly Cloudy", icon: "cloud" },
  ],
};

const WeatherIcon = ({ icon, className }: { icon: string; className?: string }) => {
  const icons = {
    sun: Sun,
    cloud: Cloud,
    rain: CloudRain,
  };
  
  const IconComponent = icons[icon as keyof typeof icons] || Cloud;
  return <IconComponent className={className} />;
};

export const Weather = () => {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = async () => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeather({
        ...weather,
        location: location,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Location Input */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter city name..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleLocationChange()}
              />
              <Button 
                onClick={handleLocationChange}
                disabled={isLoading}
                className="bg-gradient-primary"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Weather */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Current Weather
              </span>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {weather.location}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <WeatherIcon 
                    icon={weather.current.icon} 
                    className="h-12 w-12 text-primary" 
                  />
                </div>
                <div>
                  <div className="text-4xl font-bold text-foreground">
                    {weather.current.temperature}°F
                  </div>
                  <div className="text-muted-foreground">
                    {weather.current.condition}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  <Thermometer className="mr-1 h-3 w-3" />
                  Feels like {weather.current.temperature + 2}°F
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5-Day Forecast */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                >
                  <div className="font-medium text-foreground mb-2">
                    {day.day}
                  </div>
                  <div className="flex justify-center mb-2">
                    <WeatherIcon 
                      icon={day.icon} 
                      className="h-8 w-8 text-primary" 
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {day.high}°
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {day.low}°
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {day.condition}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};