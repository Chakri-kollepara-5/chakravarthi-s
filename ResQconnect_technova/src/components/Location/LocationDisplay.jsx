import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

const LocationDisplay = () => {
  const { userLocation, updateUserLocation } = useApp();
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  useEffect(() => {
    checkLocationPermission();
    // Auto-update location on component mount
    handleLocationUpdate();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(permission.state);
      
      permission.addEventListener('change', () => {
        setPermissionStatus(permission.state);
      });
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const handleLocationUpdate = async () => {
    setLoading(true);
    try {
      await updateUserLocation();
      toast.success('Location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to get location. Please enable GPS and try again.');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
      window.open(url, '_blank');
    }
  };

  if (permissionStatus === 'denied') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <h3 className="font-semibold text-red-800">Location Access Denied</h3>
            <p className="text-sm text-red-600">Please enable location access in your browser settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Your Location</h3>
        </div>
        <button
          onClick={handleLocationUpdate}
          disabled={loading}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
          title="Update location"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {userLocation ? (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  📍 {userLocation.address || 'Address not available'}
                </p>
                <p className="text-xs text-gray-600">
                  Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </p>
              </div>
              <button
                onClick={openInMaps}
                className="ml-2 p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                title="Open in Google Maps"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              GPS Active
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm text-gray-600">Getting your location...</span>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">Location not available</p>
              <button
                onClick={handleLocationUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get My Location
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationDisplay;