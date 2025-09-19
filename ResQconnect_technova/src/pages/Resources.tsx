import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ResourceCard from '../components/Common/ResourceCard';
import AddResourceModal from '../components/Modals/AddResourceModal';

const Resources: React.FC = () => {
  const { resources } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredResources = resources.filter(resource => 
    selectedType === 'all' || resource.type === selectedType
  );

  const typeOptions = [
    { value: 'all', label: 'All Resources', emoji: '🏠' },
    { value: 'shelter', label: 'Shelters', emoji: '🏠' },
    { value: 'food', label: 'Food', emoji: '🍽️' },
    { value: 'water', label: 'Water', emoji: '💧' },
    { value: 'medical', label: 'Medical', emoji: '⚕️' }
  ];

  const getResourceStats = () => {
    return {
      total: resources.length,
      shelter: resources.filter(r => r.type === 'shelter').length,
      food: resources.filter(r => r.type === 'food').length,
      water: resources.filter(r => r.type === 'water').length,
      medical: resources.filter(r => r.type === 'medical').length,
      available: resources.filter(r => r.available).length
    };
  };

  const stats = getResourceStats();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Emergency Resources</h1>
            <p className="text-blue-100 text-sm sm:text-lg">Find shelters, food, water, and medical aid nearby</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Resource Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Resources</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-xs sm:text-sm text-gray-600">Available</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-base sm:text-xl">🏠 {stats.shelter}</div>
              <div className="text-xs sm:text-sm text-gray-600">Shelters</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-base sm:text-xl">🍽️ {stats.food}</div>
              <div className="text-xs sm:text-sm text-gray-600">Food</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 col-span-2 sm:col-span-1">
            <div className="text-center">
              <div className="text-base sm:text-xl">💧 {stats.water}</div>
              <div className="text-xs sm:text-sm text-gray-600">Water</div>
            </div>
          </div>
        </div>

        {/* Filter and Add Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {typeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedType(option.value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    selectedType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm sm:text-base font-medium"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Resource
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="space-y-4 sm:space-y-6">
          {filteredResources.length > 0 ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {filteredResources.length} Resource{filteredResources.length !== 1 ? 's' : ''} Available
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} {...resource} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                {selectedType !== 'all' 
                  ? `No ${selectedType} resources available right now`
                  : 'No resources available in your area'
                }
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm sm:text-base"
              >
                Add First Resource
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <AddResourceModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Resources;