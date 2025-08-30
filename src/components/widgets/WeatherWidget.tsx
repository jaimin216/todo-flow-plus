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
  MapPin,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
    case 'sunny':
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

const getWeatherColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return 'text-warning';
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return 'text-primary';
    case 'snow':
      return 'text-muted-foreground';
    case 'clouds':
    case 'mist':
    case 'fog':
    case 'haze':
    default:
      return 'text-accent-foreground';
  }
};

const fetchWeatherData = async (): Promise<WeatherData> => {
  const API_KEY = '819c33cb4d965df4c80f030e974ca335';
  
  // Get user's location
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  
  const { latitude, longitude } = position.coords;
  
  // Fetch current weather
  const currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
  );
  const currentData: OpenWeatherResponse = await currentResponse.json();
  
  // Fetch 5-day forecast
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
  );
  const forecastData: ForecastResponse = await forecastResponse.json();
  
  // Process forecast data (get daily highs/lows)
  const dailyForecasts = forecastData.list.reduce((acc: any[], item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!acc.find(f => f.dayKey === dayKey)) {
      const dayItems = forecastData.list.filter(i => 
        new Date(i.dt * 1000).toDateString() === dayKey
      );
      
      const high = Math.max(...dayItems.map(i => i.main.temp_max));
      const low = Math.min(...dayItems.map(i => i.main.temp_min));
      
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
    location: currentData.name,
    temperature: Math.round(currentData.main.temp),
    condition: currentData.weather[0].main,
    humidity: currentData.main.humidity,
    windSpeed: Math.round(currentData.wind.speed),
    icon: currentData.weather[0].icon,
    forecast: dailyForecasts
  };
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        const weatherData = await fetchWeatherData();
        setWeather(weatherData);
        setError(null);
      } catch (err) {
        setError('Unable to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadWeather();
    
    // Refresh every 10 minutes
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <Card className="widget-card">
        <CardContent className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-primary" />
          </motion.div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !weather) {
    return (
      <Card className="widget-card">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">{error || 'No weather data'}</p>
        </CardContent>
      </Card>
    );
  }
  
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
            animate={{ 
              rotate: weather.condition.toLowerCase() === 'clear' ? [0, 360] : [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: weather.condition.toLowerCase() === 'clear' ? 20 : 2,
              repeat: Infinity,
              repeatDelay: weather.condition.toLowerCase() === 'clear' ? 0 : 3,
              ease: weather.condition.toLowerCase() === 'clear' ? "linear" : "easeInOut"
            }}
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
                  className="flex items-center justify-between py-1 hover:bg-accent/10 rounded-md px-2 -mx-2 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ 
                        y: day.condition.toLowerCase().includes('rain') ? [0, -2, 0] : 0,
                        rotate: day.condition.toLowerCase() === 'clear' ? [0, 10, -10, 0] : 0
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <DayIcon className={`h-4 w-4 ${dayColor}`} />
                    </motion.div>
                    <span className="text-sm font-medium min-w-[60px]">
                      {day.day}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <motion.span 
                      className="font-medium"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      {day.high}°
                    </motion.span>
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