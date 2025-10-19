import React from 'react';
import { MapPin, Clock, Package, User, AlertTriangle, Zap } from 'lucide-react';
import { Donation } from '../types/donation';

interface DonationCardProps {
  donation: Donation;
  onClaim: (donationId: string) => void;
  canClaim: boolean;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, onClaim, canClaim }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'claimed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get food emoji based on food type
  const getFoodEmoji = (foodType: string) => {
    const type = foodType.toLowerCase();
    if (type.includes('vegetable')) return '🥬';
    if (type.includes('fruit')) return '🍎';
    if (type.includes('grain') || type.includes('rice') || type.includes('wheat')) return '🌾';
    if (type.includes('dairy') || type.includes('milk') || type.includes('cheese')) return '🥛';
    if (type.includes('prepared') || type.includes('meal')) return '🍽️';
    if (type.includes('baked') || type.includes('bread')) return '🍞';
    if (type.includes('canned')) return '🥫';
    if (type.includes('beverage') || type.includes('drink')) return '🥤';
    if (type.includes('snack')) return '🍿';
    return '🍽️'; // default
  };

  // Safely parse Firestore Timestamp or Date
  const parseDate = (dateInput: any): Date => {
    if (!dateInput) return new Date();
    
    // Handle Firestore Timestamp
    if (typeof dateInput.toDate === 'function') {
      return dateInput.toDate();
    }
    
    // Handle string or number
    const parsedDate = new Date(dateInput);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
    
    return new Date();
  };

  const formatDate = (dateInput: any) => {
    const date = parseDate(dateInput);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getExpiryStatus = () => {
    try {
      const now = new Date();
      const expiry = parseDate(donation.expiryDate);
      
      if (isNaN(expiry.getTime())) {
        return { text: 'Invalid date', color: 'text-red-600', urgent: true };
      }

      const timeDiff = expiry.getTime() - now.getTime();
      
      if (timeDiff < 0) {
        return { text: 'Expired', color: 'text-red-600', urgent: true };
      }
      
      const hoursUntilExpiry = timeDiff / (1000 * 60 * 60);
      
      if (hoursUntilExpiry < 6) {
        return { text: `${Math.round(hoursUntilExpiry)}h left`, color: 'text-red-600', urgent: true };
      } else if (hoursUntilExpiry < 24) {
        return { text: `${Math.round(hoursUntilExpiry)}h left`, color: 'text-orange-600', urgent: true };
      } else {
        const daysLeft = Math.round(hoursUntilExpiry / 24);
        return { text: `${daysLeft}d left`, color: 'text-green-600', urgent: false };
      }
    } catch (error) {
      console.error('Error calculating expiry:', error);
      return { text: 'Date error', color: 'text-red-600', urgent: true };
    }
  };

  const expiryStatus = getExpiryStatus();
  const createdAtDate = parseDate(donation.createdAt);
  const isNew = (new Date().getTime() - createdAtDate.getTime()) < 3600000;
  const foodEmoji = getFoodEmoji(donation.foodType);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{foodEmoji}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {donation.foodType}
              </h3>
              {isNew && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mt-1">
                  <Zap className="h-3 w-3" />
                  <span>NEW</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(donation.status)}`}>
              {donation.status}
            </span>
            {donation.urgency && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(donation.urgency)}`}>
                {donation.urgency} priority
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {donation.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Package className="h-4 w-4 mr-2 text-green-600" />
            <span className="font-medium">{donation.quantity} kg available</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            <span className="truncate">{donation.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-orange-600" />
            <span>Expires: </span>
            <span className={`ml-1 font-medium ${expiryStatus.color}`}>
              {expiryStatus.text}
            </span>
            {expiryStatus.urgent && <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2 text-purple-600" />
            <span>By {donation.donorName}</span>
          </div>
        </div>

        {donation.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {donation.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
            {donation.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{donation.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              Posted {formatDate(createdAtDate)}
            </span>
            {isNew && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </div>
          
          {canClaim && donation.status === 'available' && (
            <button
              onClick={() => onClaim(donation.id)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md group-hover:shadow-lg flex items-center space-x-1"
            >
              <span>Claim Food</span>
              <span>🤝</span>
            </button>
          )}
          
          {donation.status === 'claimed' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-600 font-medium">
                Claimed for pickup 📦
              </span>
            </div>
          )}
          
          {donation.status === 'completed' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-600 font-medium">
                Successfully donated ✅
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;