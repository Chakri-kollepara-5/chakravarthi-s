import React from 'react';
import { AlertTriangle, MapPin, Clock, Wind, Droplets, Home, Flame } from 'lucide-react';

interface AlertCardProps {
  id: string;
  type: 'cyclone' | 'flood' | 'earthquake' | 'wildfire';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
}

const AlertCard: React.FC<AlertCardProps> = ({
  type,
  severity,
  title,
  description,
  location,
  timestamp
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'cyclone': return Wind;
      case 'flood': return Droplets;
      case 'earthquake': return Home;
      case 'wildfire': return Flame;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical': return 'border-red-600 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityTextColor = () => {
    switch (severity) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className={`border-l-4 ${getSeverityColor()} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className={`p-1.5 sm:p-2 rounded-full ${severity === 'critical' ? 'bg-red-100' : severity === 'high' ? 'bg-orange-100' : 'bg-blue-100'}`}>
          <TypeIcon className={`w-4 h-4 sm:w-6 sm:h-6 ${getSeverityTextColor()}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">{title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase whitespace-nowrap ${getSeverityTextColor()} ${getSeverityColor().split(' ')[1]}`}>
              {severity}
            </span>
          </div>
          
          <p className="text-gray-600 mb-3 text-sm leading-relaxed">{description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 space-y-1 sm:space-y-0">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>{getTimeAgo(timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;