import React from 'react';
import { TrendingUp, Package, Users, Leaf, RefreshCw } from 'lucide-react';
import { useRealTimeStats } from '../hooks/useRealTimeData';

const LiveStats: React.FC = () => {
  const { stats, loading } = useRealTimeStats();

  const statItems = [
    {
      title: 'Total Donations',
      value: stats.totalDonations,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Food Saved (kg)',
      value: stats.totalFoodSaved,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Active Donors',
      value: stats.activeDonors,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+15%',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'CO₂ Saved (kg)',
      value: stats.co2Saved,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+8%',
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-10 sm:w-12"></div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg ml-2 sm:ml-3"></div>
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-gray-300 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        const progressPercentage = Math.min(100, (stat.value / 1000) * 100);
        
        return (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{stat.title}</p>
                <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    {stat.value.toLocaleString()}
                  </p>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} ml-2 sm:ml-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 sm:mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs text-gray-500">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div 
                  className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="mt-2 sm:mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveStats;