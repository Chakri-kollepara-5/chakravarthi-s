const API_KEY = import.meta.env.VITE_API_KEY;
const WEATHER_URL = "https://api.tomorrow.io/v4/weather/realtime";
const ALERTS_URL = "https://api.tomorrow.io/v4/weather/alerts";

export const fetchWeatherData = async (lat = 17.6868, lng = 83.2185) => {
  try {
    const response = await fetch(
      `${WEATHER_URL}?location=${lat},${lng}&apikey=${API_KEY}`
    );
    if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather Service Error:", error);
    throw error;
  }
};

export const fetchWeatherAlerts = async (lat = 17.6868, lng = 83.2185) => {
  try {
    const response = await fetch(
      `${ALERTS_URL}?location=${lat},${lng}&apikey=${API_KEY}`
    );
    if (!response.ok) throw new Error(`Alerts fetch failed: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather Alerts Service Error:", error);
    throw error;
  }
};

export const getWeatherIcon = (condition, weatherCode) => {
  const iconMap = {
    'Clear': '☀️',
    'Mostly Clear': '🌤️',
    'Partly Cloudy': '⛅',
    'Mostly Cloudy': '☁️',
    'Cloudy': '☁️',
    'Fog': '🌫️',
    'Light Fog': '🌫️',
    'Drizzle': '🌦️',
    'Rain': '🌧️',
    'Light Rain': '🌦️',
    'Heavy Rain': '⛈️',
    'Snow': '❄️',
    'Flurries': '🌨️',
    'Light Snow': '🌨️',
    'Heavy Snow': '❄️',
    'Freezing Drizzle': '🌨️',
    'Freezing Rain': '🌨️',
    'Light Freezing Rain': '🌨️',
    'Heavy Freezing Rain': '🌨️',
    'Ice Pellets': '🧊',
    'Heavy Ice Pellets': '🧊',
    'Light Ice Pellets': '🧊',
    'Thunderstorm': '⛈️'
  };
  
  return iconMap[condition] || '🌤️';
};