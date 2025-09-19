import React from 'react';
import { MapPin, Phone, Users, CheckCircle, XCircle } from 'lucide-react';

interface ResourceCardProps {
  id: string;
  type: 'shelter' | 'food' | 'water' | 'medical';
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  capacity: number;
  available: boolean;
  contact: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  type,
  name,
  description,
  location,
  capacity,
  available,
  contact
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'shelter': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'food': return 'bg-green-100 text-green-700 border-green-200';
      case 'water': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'medical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'shelter': return '🏠';
      case 'food': return '🍽️';
      case 'water': return '💧';
      case 'medical': return '⚕️';
      default: return '📍';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center ${getTypeColor()}`}>
            <span className="text-lg sm:text-xl">{getTypeIcon()}</span>
          </div>
          <div className="ml-2 sm:ml-3 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 capitalize">{type}</p>
          </div>
        </div>
        
        <div className="flex items-center flex-shrink-0">
          {available ? (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          )}
        </div>
      </div>

      <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">{description}</p>

      <div className="space-y-2">
        <div className="flex items-start text-xs sm:text-sm text-gray-600">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="truncate">{location.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400" />
            <span>Capacity: {capacity}</span>
          </div>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-400" />
            <a href={`tel:${contact}`} className="text-blue-600 hover:text-blue-800 truncate">
              {contact}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
        <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors">
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;