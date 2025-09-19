import React from 'react';
import { BarChart3, TrendingUp, Users, MapPin, AlertTriangle, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { alerts, resources, sosRequests } = useApp();

  // Mock data for charts
  const alertsByType = [
    { name: 'Cyclone', value: 35, color: '#EF4444' },
    { name: 'Flood', value: 28, color: '#3B82F6' },
    { name: 'Earthquake', value: 20, color: '#F97316' },
    { name: 'Wildfire', value: 17, color: '#10B981' },
  ];

  const monthlyTrends = [
    { month: 'Jan', alerts: 12, sos: 8, resources: 45 },
    { month: 'Feb', alerts: 19, sos: 15, resources: 52 },
    { month: 'Mar', alerts: 25, sos: 22, resources: 48 },
    { month: 'Apr', alerts: 18, sos: 12, resources: 63 },
    { month: 'May', alerts: 32, sos: 28, resources: 71 },
    { month: 'Jun', alerts: 28, sos: 21, resources: 58 },
  ];

  const regionData = [
    { region: 'Visakhapatnam', alerts: 45, sos: 32, resources: 28 },
    { region: 'Chennai', alerts: 38, sos: 25, resources: 35 },
    { region: 'Mumbai', alerts: 42, sos: 30, resources: 22 },
    { region: 'Kolkata', alerts: 35, sos: 18, resources: 31 },
    { region: 'Hyderabad', alerts: 28, sos: 15, resources: 25 },
  ];

  const stats = [
    {
      title: 'Total Alerts',
      value: alerts.length.toString(),
      change: '+12%',
      changeType: 'increase',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-700'
    },
    {
      title: 'SOS Requests',
      value: sosRequests.length.toString(),
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      title: 'Resources',
      value: resources.length.toString(),
      change: '+15%',
      changeType: 'increase',
      icon: MapPin,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Response Rate',
      value: '94%',
      change: '+5%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <div className="bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-purple-100 text-sm sm:text-lg">Real-time insights and disaster management analytics</p>
            </div>
            <div className="hidden md:block">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Key Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs sm:text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'} flex items-center mt-2`}>
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Alerts by Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Alerts by Disaster Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={alertsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {alertsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="alerts" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="sos" stroke="#F97316" strokeWidth={2} />
                <Line type="monotone" dataKey="resources" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Regional Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="alerts" fill="#EF4444" />
              <Bar dataKey="sos" fill="#F97316" />
              <Bar dataKey="resources" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Power BI Integration */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">🔗 Power BI Advanced Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Access comprehensive disaster management dashboards with real-time data visualization, 
                predictive analytics, and detailed reports for authorities and decision makers.
              </p>
            </div>
            <ExternalLink className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-600 flex-shrink-0" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">🌍 Geographic Heatmaps</h4>
              <p className="text-xs sm:text-sm text-gray-600">Visualize disaster hotspots and affected areas across regions</p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">📊 Predictive Models</h4>
              <p className="text-xs sm:text-sm text-gray-600">AI-powered forecasting for disaster patterns and resource needs</p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">📈 Resource Optimization</h4>
              <p className="text-xs sm:text-sm text-gray-600">Optimize rescue operations and resource allocation efficiency</p>
            </div>
          </div>
          
          <button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors flex items-center justify-center sm:justify-start text-sm sm:text-base">
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Open Power BI Dashboard
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-900 text-sm sm:text-base">High severity cyclone alert issued for Visakhapatnam</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-900 text-sm sm:text-base">New SOS request received from Chennai area</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">15 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-900 text-sm sm:text-base">New shelter resource added in Mumbai</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between py-2 sm:py-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-900 text-sm sm:text-base">Weekly disaster preparedness report generated</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;