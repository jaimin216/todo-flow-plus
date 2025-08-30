import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, MapPin, Thermometer, Loader2, CloudSnow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

const fetchWeatherByLocation = async (location: string): Promise<WeatherData> => {
  const API_KEY = '819c33cb4d965df4c80f030e974ca335';
  
  // Geocoding to get coordinates
  const geocodeResponse = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
  );
  const geocodeData = await geocodeResponse.json();
  
  if (geocodeData.length === 0) {
    throw new Error('Location not found');
  }
  
  const { lat, lon, name, country } = geocodeData[0];
  
  // Current weather
  const currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );
  const currentData = await currentResponse.json();
  
  // 5-day forecast
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );
  const forecastData = await forecastResponse.json();
  
  // Process forecast
  const dailyForecasts = forecastData.list.reduce((acc: any[], item: any) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!acc.find(f => f.dayKey === dayKey)) {
      const dayItems = forecastData.list.filter((i: any) => 
        new Date(i.dt * 1000).toDateString() === dayKey
      );
      
      const high = Math.max(...dayItems.map((i: any) => i.main.temp_max));
      const low = Math.min(...dayItems.map((i: any) => i.main.temp_min));
      
      const dayNames = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];
      const dayIndex = acc.length;
      
      acc.push({
        dayKey,
        day: dayIndex < 5 ? dayNames[dayIndex] : date.toLocaleDateString('en', { weekday: 'short' }),
        high: Math.round(high),
        low: Math.round(low),
        condition: dayItems[0].weather[0].main,
        icon: dayItems[0].weather[0].icon
      });
    }
    
    return acc;
  }, []).slice(0, 5);
  
  return {
    location: `${name}, ${country}`,
    current: {
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed)
    },
    forecast: dailyForecasts
  };
};

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return Sun;
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return CloudRain;
    case 'snow':
      return CloudSnow;
    case 'clouds':
    case 'mist':
    case 'fog':
    case 'haze':
    default:
      return Cloud;
  }
};

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  const IconComponent = getWeatherIcon(condition);
  
  return (
    <motion.div
      animate={{ 
        rotate: condition.toLowerCase() === 'clear' ? [0, 360] : [0, 5, -5, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: condition.toLowerCase() === 'clear' ? 20 : 3,
        repeat: Infinity,
        repeatDelay: condition.toLowerCase() === 'clear' ? 0 : 2,
        ease: condition.toLowerCase() === 'clear' ? "linear" : "easeInOut"
      }}
    >
      <IconComponent className={className} />
    </motion.div>
  );
};

export const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather for user's current location on mount
  useEffect(() => {
    const loadCurrentLocationWeather = async () => {
      try {
        setIsLoading(true);
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get city name, then fetch weather
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=819c33cb4d965df4c80f030e974ca335`
        );
        const locationData = await response.json();
        
        if (locationData.length > 0) {
          const weatherData = await fetchWeatherByLocation(locationData[0].name);
          setWeather(weatherData);
        }
      } catch (err) {
        console.log('Could not get current location, using default');
        // Fallback to a default location
        try {
          const weatherData = await fetchWeatherByLocation('New York');
          setWeather(weatherData);
        } catch (fallbackErr) {
          setError('Unable to load weather data');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCurrentLocationWeather();
  }, []);

  const handleLocationChange = async () => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByLocation(location);
      setWeather(weatherData);
      setLocation("");
    } catch (err) {
      setError('Location not found. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

        {/* Loading State */}
        {isLoading && (
          <Card className="shadow-elegant">
            <CardContent className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="flex flex-col items-center space-y-4"
              >
                <Loader2 className="h-8 w-8 text-primary" />
                <p className="text-muted-foreground">Loading weather...</p>
              </motion.div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="shadow-elegant border-destructive/50">
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Current Weather */}
        {weather && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Current Weather
                  </span>
                  <motion.div 
                    className="flex items-center text-sm text-muted-foreground"
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <MapPin className="mr-1 h-4 w-4" />
                    {weather.location}
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <WeatherIcon 
                        condition={weather.current.condition}
                        className="h-12 w-12 text-primary" 
                      />
                    </div>
                    <div>
                      <motion.div 
                        className="text-4xl font-bold text-foreground"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      >
                        {weather.current.temperature}°F
                      </motion.div>
                      <div className="text-muted-foreground">
                        {weather.current.condition}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant="outline" className="block">
                      <Thermometer className="mr-1 h-3 w-3" />
                      Feels like {weather.current.temperature + 2}°F
                    </Badge>
                    <Badge variant="secondary" className="block">
                      💧 {weather.current.humidity}% humidity
                    </Badge>
                    <Badge variant="secondary" className="block">
                      💨 {weather.current.windSpeed} mph
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 5-Day Forecast */}
        {weather && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weather.forecast.map((day, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "hsl(var(--muted))",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="font-medium text-foreground mb-2"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 + index }}
                      >
                        {day.day}
                      </motion.div>
                      <div className="flex justify-center mb-2">
                        <WeatherIcon 
                          condition={day.condition}
                          className="h-8 w-8 text-primary" 
                        />
                      </div>
                      <div className="space-y-1">
                        <motion.div 
                          className="text-sm font-medium"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 8 + index }}
                        >
                          {day.high}°
                        </motion.div>
                        <div className="text-sm text-muted-foreground">
                          {day.low}°
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {day.condition}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};