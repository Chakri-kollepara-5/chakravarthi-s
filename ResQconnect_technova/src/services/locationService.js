import { ref, set, onValue, off } from 'firebase/database';
import { db } from '../config/firebase';

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyB1awjE3bZLjlVQ_PVR7Sh3CPEvfVtFcP8';

// Get current location with high accuracy
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          address: null
        };

        // Get address from coordinates
        getAddressFromCoords(location.lat, location.lng)
          .then(address => {
            location.address = address;
            resolve(location);
          })
          .catch(() => {
            resolve(location); // Return without address if geocoding fails
          });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  });
};

// Watch location changes
export const watchLocation = (callback) => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser.');
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      };
      
      // Get address and call callback
      getAddressFromCoords(location.lat, location.lng)
        .then(address => {
          location.address = address;
          callback(location);
        })
        .catch(() => {
          callback(location);
        });
    },
    (error) => {
      console.error('Error watching location:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000
    }
  );
};

// Get address from coordinates using Google Geocoding API
export const getAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Geocoding error:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

// Store user location in Firebase
export const storeUserLocation = async (userId, location) => {
  try {
    const locationRef = ref(db, `locations/${userId}`);
    await set(locationRef, {
      ...location,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error storing location:', error);
    throw error;
  }
};

// Listen to user location updates
export const listenToUserLocation = (userId, callback) => {
  const locationRef = ref(db, `locations/${userId}`);
  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  
  return () => off(locationRef);
};

// Generate Google Maps URL
export const generateMapsUrl = (lat, lng) => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

// Generate WhatsApp SOS URL
export const generateWhatsAppSOS = (location, message = '') => {
  const emergencyContact = '919876543210'; // Replace with actual emergency contact
  const mapsUrl = generateMapsUrl(location.lat, location.lng);
  const addressText = location.address ? `Address: ${location.address}. ` : '';
  const sosMessage = `🚨 EMERGENCY SOS! I need immediate help. ${message ? `Message: ${message}. ` : ''}${addressText}My live location: ${mapsUrl}`;
  
  return `https://wa.me/${emergencyContact}?text=${encodeURIComponent(sosMessage)}`;
};

// Check if location services are available
export const isLocationAvailable = () => {
  return 'geolocation' in navigator;
};

// Request location permission
export const requestLocationPermission = async () => {
  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state;
  } catch (error) {
    console.error('Error checking location permission:', error);
    return 'prompt';
  }
};