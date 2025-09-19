import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, MapPin, BarChart3, Settings, LogOut } from 'lucide-react';
import { signOutUser, getUserData } from '../../services/authService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData(user.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
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

  // Mock data for admin dashboard
  const alertsData = [
    { name: 'Critical', value: 12, color: '#EF4444' },
    { name: 'High', value: 25, color: '#F97316' },
    { name: 'Medium', value: 18, color: '#EAB308' },
    { name: 'Low', value: 8, color: '#22C55E' }
  ];

  const regionData = [
    { region: 'North', alerts: 45, resources: 32, users: 128 },
    { region: 'South', alerts: 38, resources: 28, users: 95 },
    { region: 'East', alerts: 42, resources: 35, users: 110 },
    { region: 'West', alerts: 35, resources: 25, users: 87 }
  ];

  const stats = [
    { title: 'Total Users', value: '1,247', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Alerts', value: '63', change: '+8%', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Resources', value: '120', change: '+15%', icon: MapPin, color: 'bg-green-500' },
    { title: 'SOS Requests', value: '28', change: '-5%', icon: BarChart3, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">ResQConnect Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{userData?.role || 'Administrator'}</p>
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
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'alerts', name: 'Alert Management', icon: AlertTriangle },
              { id: 'resources', name: 'Resource Management', icon: MapPin },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center mt-2`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Alerts Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={alertsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {alertsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Data */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="alerts" fill="#EF4444" />
                    <Bar dataKey="resources" fill="#10B981" />
                    <Bar dataKey="users" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'alert', message: 'High severity cyclone alert issued for Visakhapatnam', time: '2 min ago', color: 'bg-red-500' },
                  { type: 'user', message: 'New NGO member registered: Chennai Relief Foundation', time: '15 min ago', color: 'bg-blue-500' },
                  { type: 'resource', message: 'New shelter resource added in Mumbai', time: '1 hour ago', color: 'bg-green-500' },
                  { type: 'sos', message: 'SOS request resolved in Kolkata area', time: '2 hours ago', color: 'bg-orange-500' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${activity.color}`}></div>
                      <span className="text-gray-900">{activity.message}</span>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">This section is under development and will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;