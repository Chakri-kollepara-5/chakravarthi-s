import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, MapPin, Heart, LogOut, Plus } from 'lucide-react';
import { signOutUser, getUserData } from '../../services/authService';
import toast from 'react-hot-toast';

const NGODashboard = ({ user, onLogout }) => {
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

  const stats = [
    { title: 'People Helped', value: '342', change: '+18%', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Responses', value: '12', change: '+5%', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Resources Managed', value: '28', change: '+22%', icon: MapPin, color: 'bg-green-500' },
    { title: 'Relief Operations', value: '8', change: '+3%', icon: Heart, color: 'bg-purple-500' }
  ];

  const recentOperations = [
    { id: 1, type: 'Cyclone Relief', location: 'Visakhapatnam', status: 'Active', people: 150, date: '2024-01-15' },
    { id: 2, type: 'Flood Response', location: 'Chennai', status: 'Completed', people: 89, date: '2024-01-12' },
    { id: 3, type: 'Medical Aid', location: 'Mumbai', status: 'Active', people: 45, date: '2024-01-14' },
    { id: 4, type: 'Food Distribution', location: 'Delhi', status: 'Planning', people: 200, date: '2024-01-16' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">NGO Dashboard</h1>
                <p className="text-sm text-gray-500">Relief Operations Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData?.name || 'NGO Member'}</p>
                <p className="text-xs text-gray-500 capitalize">{userData?.role || 'NGO Member'}</p>
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
              { id: 'overview', name: 'Overview', icon: Heart },
              { id: 'operations', name: 'Relief Operations', icon: AlertTriangle },
              { id: 'resources', name: 'Resource Management', icon: MapPin },
              { id: 'volunteers', name: 'Volunteer Coordination', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
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

            {/* Recent Operations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Relief Operations</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  New Operation
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operation Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        People Helped
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOperations.map((operation) => (
                      <tr key={operation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {operation.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {operation.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            operation.status === 'Active' ? 'bg-green-100 text-green-800' :
                            operation.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {operation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {operation.people}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(operation.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                <AlertTriangle className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Emergency Response</h3>
                <p className="text-red-100 text-sm mb-4">Respond to critical disaster alerts</p>
                <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                  View Alerts
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <MapPin className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Resource Deployment</h3>
                <p className="text-green-100 text-sm mb-4">Manage and deploy relief resources</p>
                <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                  Manage Resources
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <Users className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Volunteer Coordination</h3>
                <p className="text-blue-100 text-sm mb-4">Coordinate volunteer activities</p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  Manage Volunteers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
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

export default NGODashboard;