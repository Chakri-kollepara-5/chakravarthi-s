import React from 'react';
import { MapPin, Clock, User, Phone, MessageCircle } from 'lucide-react';

const HelpRequestCard = ({ request, onRespond, currentUser }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getUrgencyBadgeColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const requestTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - requestTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const isOwnRequest = currentUser && request.userId === currentUser.uid;

  return (
    <div className={`border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${getUrgencyColor(request.urgency)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{request.title}</h3>
            <p className="text-sm text-gray-600">by {request.userName}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${getUrgencyBadgeColor(request.urgency)}`}>
          {request.urgency}
        </span>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{request.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{request.location.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{getTimeAgo(request.timestamp)}</span>
        </div>
        {request.contactNumber && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <a href={`tel:${request.contactNumber}`} className="text-blue-600 hover:text-blue-800">
              {request.contactNumber}
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <MessageCircle className="w-4 h-4 mr-1" />
          <span>{request.responses?.length || 0} responses</span>
        </div>
        
        {!isOwnRequest && request.status === 'active' && (
          <button
            onClick={() => onRespond(request)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Offer Help
          </button>
        )}
        
        {isOwnRequest && (
          <span className="text-sm text-gray-500 italic">Your request</span>
        )}
      </div>
    </div>
  );
};

export default HelpRequestCard;