const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Tomorrow.io API configuration
const TOMORROW_IO_API_KEY = process.env.TOMORROW_IO_API_KEY;
const TOMORROW_IO_BASE_URL = 'https://api.tomorrow.io/v4';

// Weather API route
app.get('/api/weather', async (req, res) => {
  try {
    const { lat = 17.6868, lng = 83.2185 } = req.query; // Default to Visakhapatnam
    
    const response = await axios.get(`${TOMORROW_IO_BASE_URL}/weather/realtime`, {
      params: {
        location: `${lat},${lng}`,
        apikey: TOMORROW_IO_API_KEY,
        units: 'metric'
      }
    });

    const data = response.data.data;
    const values = data.values;

    const weatherData = {
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      temperature: Math.round(values.temperature),
      humidity: Math.round(values.humidity),
      windSpeed: Math.round(values.windSpeed * 3.6), // Convert m/s to km/h
      visibility: Math.round(values.visibility),
      uvIndex: Math.round(values.uvIndex),
      condition: getWeatherCondition(values.weatherCode),
      weatherCode: values.weatherCode,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch weather data',
      message: error.response?.data?.message || error.message
    });
  }
});

// Weather Alerts API route
app.get('/api/alerts', async (req, res) => {
  try {
    const { lat = 17.6868, lng = 83.2185 } = req.query; // Default to Visakhapatnam
    
    const response = await axios.get(`${TOMORROW_IO_BASE_URL}/weather/forecast`, {
      params: {
        location: `${lat},${lng}`,
        apikey: TOMORROW_IO_API_KEY,
        timesteps: '1h',
        units: 'metric'
      }
    });

    const data = response.data;
    const alerts = [];

    // Analyze weather data for potential alerts
    if (data.timelines && data.timelines.hourly) {
      const hourlyData = data.timelines.hourly.slice(0, 24); // Next 24 hours
      
      hourlyData.forEach((hour, index) => {
        const values = hour.values;
        const time = new Date(hour.time);
        
        // High wind alert
        if (values.windSpeed > 15) { // > 54 km/h
          alerts.push({
            id: `wind-${index}`,
            type: 'wind',
            severity: values.windSpeed > 25 ? 'high' : 'medium',
            title: 'High Wind Alert',
            description: `Strong winds expected: ${Math.round(values.windSpeed * 3.6)} km/h`,
            time: time.toISOString(),
            location: { lat: parseFloat(lat), lng: parseFloat(lng) }
          });
        }

        // Heavy rain alert
        if (values.precipitationIntensity > 5) {
          alerts.push({
            id: `rain-${index}`,
            type: 'rain',
            severity: values.precipitationIntensity > 15 ? 'high' : 'medium',
            title: 'Heavy Rain Alert',
            description: `Heavy rainfall expected: ${Math.round(values.precipitationIntensity)} mm/h`,
            time: time.toISOString(),
            location: { lat: parseFloat(lat), lng: parseFloat(lng) }
          });
        }

        // Temperature extreme alerts
        if (values.temperature > 40) {
          alerts.push({
            id: `heat-${index}`,
            type: 'heat',
            severity: 'high',
            title: 'Heat Wave Alert',
            description: `Extreme heat expected: ${Math.round(values.temperature)}°C`,
            time: time.toISOString(),
            location: { lat: parseFloat(lat), lng: parseFloat(lng) }
          });
        }

        if (values.temperature < 5) {
          alerts.push({
            id: `cold-${index}`,
            type: 'cold',
            severity: 'medium',
            title: 'Cold Wave Alert',
            description: `Very cold weather expected: ${Math.round(values.temperature)}°C`,
            time: time.toISOString(),
            location: { lat: parseFloat(lat), lng: parseFloat(lng) }
          });
        }
      });
    }

    // Remove duplicate alerts and limit to 5 most severe
    const uniqueAlerts = alerts
      .filter((alert, index, self) => 
        index === self.findIndex(a => a.type === alert.type)
      )
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 5);

    res.json({
      success: true,
      data: uniqueAlerts,
      count: uniqueAlerts.length
    });

  } catch (error) {
    console.error('Alerts API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch weather alerts',
      message: error.response?.data?.message || error.message
    });
  }
});

// Helper function to get weather condition from code
function getWeatherCondition(code) {
  const conditions = {
    0: 'Unknown',
    1000: 'Clear',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    1001: 'Cloudy',
    2000: 'Fog',
    2100: 'Light Fog',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6001: 'Freezing Rain',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm'
  };
  
  return conditions[code] || 'Unknown';
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ResQConnect API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ResQConnect API server running on port ${PORT}`);
});

module.exports = app;