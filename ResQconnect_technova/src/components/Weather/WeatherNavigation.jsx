import React from 'react';
import { ExternalLink, Cloud, MapPin, TrendingUp } from 'lucide-react';

const WeatherNavigation = () => {
  const handleWeatherClick = () => {
    window.open('https://weatherxresq.vercel.app/', '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <Cloud className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Weather Intelligence</h2>
        <p className="text-blue-100 mb-6 text-sm sm:text-base leading-relaxed">
          Get real-time weather updates, forecasts, and disaster alerts with our advanced weather monitoring system
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <Cloud className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">Real-time Weather</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <MapPin className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">Interactive Maps</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-medium">5-Day Forecast</p>
          </div>
        </div>

        <button
          onClick={handleWeatherClick}
          className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Open Weather Dashboard
        </button>

        <p className="text-blue-200 text-xs sm:text-sm mt-4">
          Powered by Tomorrow.io & Google Maps
        </p>
      </div>
    </div>
  );
};

export default WeatherNavigation;