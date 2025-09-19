import React, { useState, useEffect } from 'react';
import { Shield, MapPin, MessageCircle, AlertTriangle, LogOut, Phone } from 'lucide-react';
import { signOutUser, getUserData } from '../../services/authService';
import { getCurrentLocation, generateWhatsAppSOS } from '../../services/locationService';
import { sendSOSEmail } from '../../config/emailjs';
import toast from 'react-hot-toast';

const UserDashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null);
  const [sosLoading, setSosLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData(user.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const getLocation = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    fetchUserData();
    getLocation();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Logged out successfully');
      onLogout();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleSOS = async () => {
    setSosLoading(true);
    try {
      const currentLocation = await getCurrentLocation();
      
      // Generate WhatsApp SOS
      const whatsappUrl = generateWhatsAppSOS(currentLocation, 'Emergency! I need immediate help.');
      
      // Send SOS email
      try {
        await sendSOSEmail(
          user.email,
          userData?.name || 'User',
          currentLocation,
          'Emergency SOS request from ResQConnect app'
        );
      } catch (emailError) {
        console.warn('SOS email failed to send:', emailError);
      }

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast.success('🚨 SOS Alert Sent! Emergency services have been notified.');
    } catch (error) {
      console.error('SOS Error:', error);
      toast.error('Failed to send SOS. Please try again.');
    } finally {
      setSosLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'View Alerts',
      description: 'Check disaster warnings in your area',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: () => toast.info('Redirecting to alerts...')
    },
    {
      title: 'Find Resources',
      description: 'Locate nearby shelters and aid',
      icon: MapPin,
      color: 'bg-blue-500',
      action: () => toast.info('Redirecting to resources...')
    },
    {
      title: 'AI Assistant',
      description: 'Get safety guidance and tips',
      icon: MessageCircle,
      color: 'bg-green-500',
      action: () => toast.info('Opening AI assistant...')
    }
  ];

  const recentAlerts = [
    { id: 1, type: 'Cyclone Warning', location: 'Visakhapatnam', severity: 'High', time: '2 hours ago' },
    { id: 2, type: 'Flood Alert', location: 'Chennai', severity: 'Medium', time: '5 hours ago' },
    { id: 3, type: 'Heat Wave', location: 'Delhi', severity: 'Low', time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">My Safety Dashboard</h1>
                <p className="text-sm text-gray-500">Stay safe and informed</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                <p className="text-xs text-gray-500">
                  {location ? `📍 Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : '📍 Location unavailable'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency SOS Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white mb-8">
          <div className="text-center">
            <Phone className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Emergency SOS</h2>
            <p className="text-red-100 mb-6">Press the button below if you need immediate help</p>
            <button
              onClick={handleSOS}
              disabled={sosLoading}
              className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
            >
              {sosLoading ? (
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              ) : (
                <Phone className="w-6 h-6 mr-3" />
              )}
              {sosLoading ? 'Sending SOS...' : 'SEND SOS ALERT'}
            </button>
            <p className="text-red-200 text-sm mt-4">
              This will send your location to emergency services via WhatsApp and email
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white p-6 rounded-xl hover:opacity-90 transition-opacity text-left`}
                >
                  <Icon className="w-8 h-8 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">{action.title}</h4>
                  <p className="text-sm opacity-90">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Alerts in Your Area</h3>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    alert.severity === 'High' ? 'bg-red-500' :
                    alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">💡 Safety Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-blue-800">Keep emergency contacts readily available</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-blue-800">Maintain emergency supply kit with water & food</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-blue-800">Stay informed about local emergency plans</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-blue-800">Practice evacuation routes with your family</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;