import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, Clock, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRealTimeDonations } from '../hooks/useRealTimeData';
import { claimDonation } from '../services/donationService';
import DonationCard from '../components/DonationCard';
import CreateDonationModal from '../components/CreateDonationModal';
import toast from 'react-hot-toast';

const DonationsPage: React.FC = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'claimed' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { donations, loading, error } = useRealTimeDonations({
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchTerm === '' || 
      donation.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || 
      donation.foodType.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const handleClaim = async (donationId: string) => {
    if (!user) {
      toast.error('Please login to claim donations');
      return;
    }

    try {
      await claimDonation(donationId, user.uid);
      toast.success('Donation claimed successfully! 🎉');
    } catch (error) {
      console.error('Error claiming donation:', error);
      toast.error('Failed to claim donation');
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    toast.success('Donation created successfully! 🌟');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Loading component
  const LoadingCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4 h-10 bg-gray-200 rounded"></div>
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">Connection Issue</h3>
      <p className="text-red-700 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Food Donations</h1>
              <div className="flex items-center space-x-1">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  LIVE
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Discover available food donations in your area</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
            
            {user?.userType === 'donor' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Create Donation
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="claimed">Claimed</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors sm:col-span-2 lg:col-span-1"
            >
              <option value="all">All Types</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
              <option value="prepared meals">Prepared Meals</option>
              <option value="baked goods">Baked Goods</option>
            </select>
          </div>
          
          {/* Filter Summary */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Showing:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {filteredDonations.length} donations
            </span>
            {statusFilter !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Status: {statusFilter}
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Type: {typeFilter}
              </span>
            )}
            {searchTerm && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">
              {loading ? 'Updating...' : 'Live updates active'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Content */}
        {error ? (
          <ErrorDisplay error={error} onRetry={handleRefresh} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <LoadingCard key={i} />)}
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl sm:text-8xl mb-4">🥘</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No donations found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to create a donation!'}
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  Clear Filters
                </button>
              )}
              
              {user?.userType === 'donor' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Create Donation
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onClaim={handleClaim}
                canClaim={user?.userType !== 'donor' && donation.status === 'available' && donation.donorId !== user?.uid}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateDonationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default DonationsPage;