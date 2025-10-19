import React, { useState } from 'react';
import { Package, Users, TrendingUp, Leaf, Plus, Clock, MapPin, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRealTimeDonations } from '../hooks/useRealTimeData';
import { claimDonation } from '../services/donationService';
import DonationCard from '../components/DonationCard';
import LiveStats from '../components/LiveStats';
import CreateDonationModal from '../components/CreateDonationModal';
import HostelBiteSection from '../components/HostelBiteSection';
import DonationPaymentSection from '../components/DonationPaymentSection';
import HostelMealBooking from '../components/HostelMealBooking';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Real-time data hooks with better error handling
  const { donations: allDonations, loading: allLoading, error: allError } = useRealTimeDonations({
    limit: 6 // Limit for dashboard view
  });
  
  const { donations: userDonations, loading: userLoading, error: userError } = useRealTimeDonations({
    userId: user?.uid,
    limit: 3 // Limit for user's recent donations
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

  // Error handling component
  const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome back, {user?.displayName || 'Food Saver'}! 
                </h1>
                <div className="flex items-center space-x-1">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                  <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    LIVE
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                {user?.userType === 'donor' 
                  ? 'Ready to share some food and reduce waste? Your impact is being tracked in real-time!'
                  : 'Let\'s find some food donations in your area! New donations appear instantly.'
                }
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Live Community Impact</h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <LiveStats />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200 group"
            >
              <div className="bg-green-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 text-sm sm:text-base">Create Donation</div>
                <div className="text-xs sm:text-sm text-gray-600">Share surplus food instantly</div>
              </div>
            </button>
            
            <button className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 border border-blue-200 group">
              <div className="bg-blue-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 text-sm sm:text-base">Find Donations</div>
                <div className="text-xs sm:text-sm text-gray-600">Browse nearby food</div>
              </div>
            </button>
            
            <button className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200 group sm:col-span-2 lg:col-span-1">
              <div className="bg-purple-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 text-sm sm:text-base">Join Community</div>
                <div className="text-xs sm:text-sm text-gray-600">Connect with others</div>
              </div>
            </button>
          </div>
        </div>

        {/* HostelBite Integration */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">HostelBite Integration</h2>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              NEW 🎉
            </div>
          </div>
          <HostelBiteSection />
        </div>

        {/* Hostel Meal Booking */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Book Hostel Meals</h2>
            <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
              HOT 🔥
            </div>
          </div>
          <HostelMealBooking />
        </div>

        {/* Donation Payment Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Support Our Mission</h2>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              DONATE 💝
            </div>
          </div>
          <DonationPaymentSection />
        </div>

        {/* My Recent Donations (for donors) */}
        {user?.userType === 'donor' && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Recent Donations</h2>
                {userLoading && <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>}
              </div>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base">
                View All
              </button>
            </div>
            
            {userError ? (
              <ErrorDisplay error={userError} onRetry={handleRefresh} />
            ) : userLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => <LoadingCard key={i} />)}
              </div>
            ) : userDonations.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-100">
                <div className="text-6xl sm:text-8xl mb-4">🥗</div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Create your first donation and start making an impact!</p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg text-sm sm:text-base"
                >
                  Create First Donation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {userDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                    onClaim={() => {}}
                    canClaim={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live Donations Feed */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Live Donations Feed</h2>
              {allLoading && <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>}
              <div className="flex items-center space-x-1 text-xs sm:text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time updates</span>
              </div>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base">
              View All
            </button>
          </div>
          
          {allError ? (
            <ErrorDisplay error={allError} onRetry={handleRefresh} />
          ) : allLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <LoadingCard key={i} />)}
            </div>
          ) : allDonations.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-100">
              <div className="text-6xl sm:text-8xl mb-4">🍽️</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No donations available</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Be the first to create a food donation!</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                Create First Donation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {allDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onClaim={handleClaim}
                  canClaim={user?.userType !== 'donor' && donation.donorId !== user?.uid}
                />
              ))}
            </div>
          )}
        </div>

        {/* Impact Summary */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Your Real-time Impact</h2>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          
          {/* Government Verification Badge */}
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🏛️</span>
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">Verified by Government of India</div>
                  <div className="text-xs text-green-100">Udyam Registration: UDYAM-AP-10-0116772</div>
                </div>
                <span className="text-xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {userDonations.reduce((sum, d) => sum + d.quantity, 0)} kg
              </div>
              <div className="text-green-100 text-sm sm:text-base">Food Donated</div>
              <div className="text-xs text-green-200 mt-1">This month</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {Math.round(userDonations.reduce((sum, d) => sum + d.quantity, 0) * 3)}
              </div>
              <div className="text-green-100 text-sm sm:text-base">Meals Provided</div>
              <div className="text-xs text-green-200 mt-1">Estimated impact</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {Math.round(userDonations.reduce((sum, d) => sum + d.quantity, 0) * 2.3)} kg
              </div>
              <div className="text-green-100 text-sm sm:text-base">CO₂ Saved</div>
              <div className="text-xs text-green-200 mt-1">Environmental impact</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Donation Modal */}
      {showCreateModal && (
        <CreateDonationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default DashboardPage;