import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentLocation, storeUserLocation } from '../services/locationService';

interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'volunteer' | 'ngo' | 'admin';
  phone?: string;
  photoURL?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

interface Alert {
  id: string;
  type: 'cyclone' | 'flood' | 'earthquake' | 'wildfire' | 'storm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  affectedRadius: number;
}

interface Resource {
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
  timestamp: Date;
}

interface SOSRequest {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'rescued';
  emergencyType: string;
  message?: string;
}

interface AppContextType {
  user: User | null;
  alerts: Alert[];
  resources: Resource[];
  sosRequests: SOSRequest[];
  language: 'en' | 'hi';
  userLocation: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  setUser: (user: User | null) => void;
  addAlert: (alert: Alert) => void;
  addResource: (resource: Resource) => void;
  createSOSRequest: (request: Omit<SOSRequest, 'id' | 'timestamp'>) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  updateUserLocation: () => Promise<void>;
  getCurrentLocation: () => Promise<{lat: number; lng: number; address?: string} | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [sosRequests, setSOSRequests] = useState<SOSRequest[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number; address?: string} | null>(null);

  // Initialize mock data
  useEffect(() => {
    // Mock alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'cyclone',
        severity: 'high',
        title: 'Cyclone Warning - Visakhapatnam',
        description: 'Severe cyclone approaching coastal areas. Wind speed expected 120+ kmph.',
        location: 'Visakhapatnam, Andhra Pradesh',
        timestamp: new Date(),
        affectedRadius: 50
      },
      {
        id: '2',
        type: 'flood',
        severity: 'medium',
        title: 'Flood Alert - Chennai',
        description: 'Heavy rainfall causing waterlogging in low-lying areas.',
        location: 'Chennai, Tamil Nadu',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        affectedRadius: 25
      },
      {
        id: '3',
        type: 'earthquake',
        severity: 'critical',
        title: 'Earthquake Alert - Delhi NCR',
        description: 'Magnitude 6.2 earthquake detected. Aftershocks expected.',
        location: 'Delhi NCR',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        affectedRadius: 100
      }
    ];

    // Mock resources
    const mockResources: Resource[] = [
      {
        id: '1',
        type: 'shelter',
        name: 'Community Relief Center',
        description: 'Safe shelter with food and medical aid',
        location: {
          lat: 17.6868,
          lng: 83.2185,
          address: 'Beach Road, Visakhapatnam'
        },
        capacity: 500,
        available: true,
        contact: '+91-891-2548796',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'water',
        name: 'Water Distribution Point',
        description: 'Clean drinking water available 24/7',
        location: {
          lat: 17.7041,
          lng: 83.2977,
          address: 'MVP Colony, Visakhapatnam'
        },
        capacity: 1000,
        available: true,
        contact: '+91-891-2548797',
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'medical',
        name: 'Emergency Medical Camp',
        description: 'First aid and emergency medical services',
        location: {
          lat: 13.0827,
          lng: 80.2707,
          address: 'Marina Beach, Chennai'
        },
        capacity: 200,
        available: true,
        contact: '+91-44-28461234',
        timestamp: new Date()
      }
    ];

    setAlerts(mockAlerts);
    setResources(mockResources);
  }, []);

  // Update user location
  const updateUserLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
        
        // Store in Firebase if user is logged in
        if (user) {
          await storeUserLocation(user.uid, location);
        }
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // Get current location
  const getCurrentLocationWrapper = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
        return location;
      }
      return null;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const addResource = (resource: Resource) => {
    setResources(prev => [resource, ...prev]);
  };

  const createSOSRequest = (request: Omit<SOSRequest, 'id' | 'timestamp'>) => {
    const newSOS: SOSRequest = {
      ...request,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setSOSRequests(prev => [newSOS, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user,
      alerts,
      resources,
      sosRequests,
      language,
      userLocation,
      setUser,
      addAlert,
      addResource,
      createSOSRequest,
      setLanguage,
      updateUserLocation,
      getCurrentLocation: getCurrentLocationWrapper
    }}>
      {children}
    </AppContext.Provider>
  );
};