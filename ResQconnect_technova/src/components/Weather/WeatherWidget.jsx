import React, { useState, useEffect } from "react";
import {
  Cloud,
  Droplets,
  Wind,
  Eye,
  Sun,
  RefreshCw,
} from "lucide-react";
import { getWeatherIcon } from "../../services/weatherService";

// Put your Tomorrow.io API key here
const API_KEY = "YOUR_TOMORROW_IO_API_KEY";

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const lat = location?.lat || 17.6868;
      const lng = location?.lng || 83.2185;

      const url = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lng}&apikey=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const result = await response.json();

      if (!result?.data?.values) {
        throw new Error("Invalid response from weather API");
      }

      const values = result.data.values;

      setWeather({
        temperature: values.temperature,
        humidity: values.humidity,
        windSpeed: values.windSpeed,
        visibility: values.visibility,
        uvIndex: values.uvIndex,
        weatherCode: values.weatherCode,
        condition: getWeatherCondition(values.weatherCode),
      });

      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error("Weather loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Map Tomorrow.io weather codes to human-readable condition
  const getWeatherCondition = (code) => {
    const mapping = {
      1000: "Clear",
      1001: "Cloudy",
      1100: "Mostly Clear",
      1101: "Partly Cloudy",
      1102: "Mostly Cloudy",
      2000: "Fog",
      2100: "Light Fog",
      3000: "Light Wind",
      3001: "Wind",
      3002: "Strong Wind",
      4000: "Drizzle",
      4001: "Rain",
      4200: "Light Rain",
      4201: "Heavy Rain",
      5000: "Snow",
      5001: "Flurries",
      5100: "Light Snow",
      5101: "Heavy Snow",
      6000: "Freezing Drizzle",
      6001: "Freezing Rain",
      6200: "Light Freezing Rain",
      6201: "Heavy Freezing Rain",
      7000: "Ice Pellets",
      7101: "Heavy Ice Pellets",
      7102: "Light Ice Pellets",
      8000: "Thunderstorm",
    };
    return mapping[code] || "Unknown";
  };

  useEffect(() => {
    loadWeatherData();

    // Auto-refresh every 10 minutes
    const interval = setInterval(loadWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-sm sm:text-base">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="text-center">
          <Cloud className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm sm:text-base mb-3">
            ⚠️ Unable to fetch weather data
          </p>
          <button
            onClick={loadWeatherData}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Cloud className="w-6 h-6 mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold">Current Weather</h3>
        </div>
        <button
          onClick={loadWeatherData}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title="Refresh weather data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {weather && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Main Weather Info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <span className="text-4xl sm:text-5xl mr-3">
                {getWeatherIcon(weather.condition, weather.weatherCode)}
              </span>
              <div>
                <div className="text-3xl sm:text-4xl font-bold">
                  {weather.temperature}°C
                </div>
                <div className="text-blue-100 text-sm sm:text-base">
                  {weather.condition}
                </div>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <Droplets className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs sm:text-sm text-blue-100">Humidity</div>
              <div className="font-semibold text-sm sm:text-base">
                {weather.humidity}%
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <Wind className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs sm:text-sm text-blue-100">Wind</div>
              <div className="font-semibold text-sm sm:text-base">
                {weather.windSpeed} km/h
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs sm:text-sm text-blue-100">Visibility</div>
              <div className="font-semibold text-sm sm:text-base">
                {weather.visibility} km
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <Sun className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs sm:text-sm text-blue-100">UV Index</div>
              <div className="font-semibold text-sm sm:text-base">
                {weather.uvIndex}
              </div>
            </div>
          </div>
        </div>
      )}

      {lastUpdated && (
        <div className="mt-4 pt-3 border-t border-blue-400 border-opacity-30">
          <p className="text-xs sm:text-sm text-blue-100 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
