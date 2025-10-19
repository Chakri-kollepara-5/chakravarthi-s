import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Package, Leaf, Award, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDonations } from '../services/donationService';
import { Donation } from '../types/donation';

const COLORS = ['#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0'];

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const donationsData = await getDonations();
        setDonations(donationsData);
      } catch (error) {
        console.error('Error loading donations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  // Calculate analytics data
  const totalDonations = donations.length;
  const totalFoodSaved = donations.reduce((sum, donation) => sum + donation.quantity, 0);
  const co2Saved = Math.round(totalFoodSaved * 2.3); // kg CO2 per kg food
  const waterSaved = Math.round(totalFoodSaved * 150); // liters per kg food

  // Monthly donation trends
  const monthlyData = [
    { month: 'Jan', donations: 45, foodSaved: 320 },
    { month: 'Feb', donations: 52, foodSaved: 380 },
    { month: 'Mar', donations: 61, foodSaved: 450 },
    { month: 'Apr', donations: 58, foodSaved: 420 },
    { month: 'May', donations: 67, foodSaved: 510 },
    { month: 'Jun', donations: 74, foodSaved: 580 },
  ];

  // Food type distribution
  const foodTypeData = [
    { name: 'Vegetables', value: 35, color: '#10B981' },
    { name: 'Fruits', value: 25, color: '#059669' },
    { name: 'Grains', value: 20, color: '#34D399' },
    { name: 'Dairy', value: 15, color: '#6EE7B7' },
    { name: 'Others', value: 5, color: '#A7F3D0' },
  ];

  // Impact metrics
  const impactData = [
    { metric: 'Meals Provided', value: Math.round(totalFoodSaved * 3), icon: Package, color: 'text-blue-600' },
    { metric: 'Families Helped', value: Math.round(totalFoodSaved / 5), icon: Users, color: 'text-purple-600' },
    { metric: 'CO₂ Saved (kg)', value: co2Saved, icon: Leaf, color: 'text-green-600' },
    { metric: 'Water Saved (L)', value: waterSaved, icon: Target, color: 'text-cyan-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your environmental impact and community contribution</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{item.metric}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${item.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donation Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Food Type Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={foodTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {foodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {foodTypeData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Donation Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="foodSaved" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-3">🌱</div>
            <h3 className="text-2xl font-bold">Environmental Impact</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{co2Saved} kg</div>
              <div className="text-green-100">CO₂ Emissions Saved</div>
              <div className="text-sm text-green-200 mt-1">Equivalent to planting {Math.round(co2Saved / 21)} trees</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{waterSaved} L</div>
              <div className="text-green-100">Water Conserved</div>
              <div className="text-sm text-green-200 mt-1">Enough for {Math.round(waterSaved / 150)} people daily</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{Math.round(totalFoodSaved * 3)}</div>
              <div className="text-green-100">Meals Provided</div>
              <div className="text-sm text-green-200 mt-1">Fed {Math.round(totalFoodSaved / 5)} families</div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'First Donation', description: 'Made your first food donation', earned: true },
              { title: 'Food Saver', description: 'Saved 100kg of food', earned: true },
              { title: 'Community Hero', description: 'Helped 50 families', earned: true },
              { title: 'Eco Warrior', description: 'Saved 500kg CO₂', earned: false },
            ].map((achievement, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <Award className={`h-8 w-8 mb-2 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                <h4 className={`font-semibold ${achievement.earned ? 'text-green-900' : 'text-gray-500'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;