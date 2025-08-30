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
  
  try {
    // Geocoding to get coordinates
    const geocodeResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
    );
    
    if (!geocodeResponse.ok) {
      if (geocodeResponse.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeather API key.');
      }
      throw new Error(`Geocoding error: ${geocodeResponse.status}`);
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (geocodeData.length === 0) {
      throw new Error('Location not found');
    }
    
    const { lat, lon, name, country } = geocodeData[0];
    
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    
    // 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }
    
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
  } catch (error) {
    console.error('Weather API error:', error);
    // Return fallback demo data
    return {
      location: `${location} (Demo)`,
      current: {
        temperature: 72,
        condition: "Clear",
        icon: "01d",
        humidity: 65,
        windSpeed: 8
      },
      forecast: [
        { day: "Today", high: 75, low: 62, condition: "Clear", icon: "01d" },
        { day: "Tomorrow", high: 78, low: 65, condition: "Clouds", icon: "02d" },
        { day: "Wed", high: 71, low: 58, condition: "Rain", icon: "10d" },
        { day: "Thu", high: 69, low: 55, condition: "Clouds", icon: "03d" },
        { day: "Fri", high: 74, low: 61, condition: "Clear", icon: "01d" }
      ]
    };
  }
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
          navigator.geolocation.getCurrentPosition(
            resolve,
            () => reject(new Error('Location access denied')),
            { timeout: 10000, maximumAge: 300000 }
          );
        });
        
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get city name, then fetch weather
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=819c33cb4d965df4c80f030e974ca335`
        );
        
        if (response.ok) {
          const locationData = await response.json();
          if (locationData.length > 0) {
            const weatherData = await fetchWeatherByLocation(locationData[0].name);
            setWeather(weatherData);
          }
        }
      } catch (err) {
        console.log('Could not get current location, using fallback');
        // Fallback to demo data
        try {
          const weatherData = await fetchWeatherByLocation('New York');
          setWeather(weatherData);
        } catch (fallbackErr) {
          setError('Unable to load weather data. Showing demo instead.');
          // Set demo data manually
          setWeather({
            location: "Demo City",
            current: {
              temperature: 72,
              condition: "Clear",
              icon: "01d",
              humidity: 65,
              windSpeed: 8
            },
            forecast: [
              { day: "Today", high: 75, low: 62, condition: "Clear", icon: "01d" },
              { day: "Tomorrow", high: 78, low: 65, condition: "Clouds", icon: "02d" },
              { day: "Wed", high: 71, low: 58, condition: "Rain", icon: "10d" },
              { day: "Thu", high: 69, low: 55, condition: "Clouds", icon: "03d" },
              { day: "Fri", high: 74, low: 61, condition: "Clear", icon: "01d" }
            ]
          });
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
                className="flex flex-col items-center space-y-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Cloud className="h-12 w-12 text-primary" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      x: [0, 10, -10, 0],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: 0.5
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sun className="h-6 w-6 text-warning" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      y: [0, 8, 0],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: 1
                    }}
                    className="absolute -bottom-1 left-2"
                  >
                    <CloudRain className="h-4 w-4 text-primary" />
                  </motion.div>
                </div>
                <motion.div
                  className="text-center space-y-2"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-muted-foreground">Fetching weather data...</p>
                  <p className="text-xs text-muted-foreground/70">Getting your location</p>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="shadow-elegant border-warning/50 bg-warning/5">
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 rounded-full bg-warning/20"
              >
                <Cloud className="h-8 w-8 text-warning" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-warning font-medium">Weather Service Notice</p>
                <p className="text-muted-foreground text-sm">{error}</p>
                <p className="text-xs text-muted-foreground">Displaying demo data for preview</p>
              </div>
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