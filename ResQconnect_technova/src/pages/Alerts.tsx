import React, { useState } from 'react';
import { Filter, Search, MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import AlertCard from '../components/Common/AlertCard';

const Alerts: React.FC = () => {
  const { alerts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  const severityOptions = [
    { value: 'all', label: 'All Severity' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'cyclone', label: 'Cyclone' },
    { value: 'flood', label: 'Flood' },
    { value: 'earthquake', label: 'Earthquake' },
    { value: 'wildfire', label: 'Wildfire' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Disaster Alerts</h1>
            <p className="text-red-100 text-sm sm:text-lg">Stay informed about current threats in your area</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts by location or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
              >
                {severityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-red-600">{alerts.filter(a => a.severity === 'critical').length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Critical</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{alerts.filter(a => a.severity === 'high').length}</div>
              <div className="text-xs sm:text-sm text-gray-600">High</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">{alerts.filter(a => a.severity === 'medium').length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Medium</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{alerts.filter(a => a.severity === 'low').length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Low</div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredAlerts.length > 0 ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? 's' : ''} Found
              </h2>
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} {...alert} />
              ))}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No alerts found</h3>
              <p className="text-sm sm:text-base text-gray-500">
                {searchTerm || selectedSeverity !== 'all' || selectedType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No active alerts in your area right now'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;