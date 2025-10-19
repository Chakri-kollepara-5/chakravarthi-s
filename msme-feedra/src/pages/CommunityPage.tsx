import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Calendar, Award, MapPin, Heart, Star, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface CommunityMember {
  id: string;
  name: string;
  userType: 'donor' | 'ngo' | 'volunteer';
  location: string;
  donationsCount: number;
  impactScore: number;
  joinedDate: Date;
  avatar?: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  type: 'pickup' | 'distribution' | 'awareness' | 'cleanup';
}

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'leaderboard'>('members');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real Firebase data
  const communityMembers: CommunityMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      userType: 'donor',
      location: 'Downtown Restaurant',
      donationsCount: 45,
      impactScore: 1250,
      joinedDate: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Green Valley NGO',
      userType: 'ngo',
      location: 'Community Center',
      donationsCount: 120,
      impactScore: 3200,
      joinedDate: new Date('2023-11-20'),
    },
    {
      id: '3',
      name: 'Mike Chen',
      userType: 'volunteer',
      location: 'City Center',
      donationsCount: 28,
      impactScore: 890,
      joinedDate: new Date('2024-02-10'),
    },
  ];

  const communityEvents: CommunityEvent[] = [
    {
      id: '1',
      title: 'Weekly Food Distribution',
      description: 'Help distribute collected food to families in need',
      date: new Date('2024-12-20'),
      location: 'Community Center, Main St',
      organizer: 'Green Valley NGO',
      attendees: 12,
      maxAttendees: 20,
      type: 'distribution',
    },
    {
      id: '2',
      title: 'Food Waste Awareness Workshop',
      description: 'Learn about reducing food waste at home and work',
      date: new Date('2024-12-22'),
      location: 'City Library, 2nd Floor',
      organizer: 'EcoWarriors',
      attendees: 8,
      maxAttendees: 15,
      type: 'awareness',
    },
    {
      id: '3',
      title: 'Restaurant Pickup Drive',
      description: 'Coordinate pickup from local restaurants',
      date: new Date('2024-12-25'),
      location: 'Various Locations',
      organizer: 'Food Rescue Team',
      attendees: 5,
      maxAttendees: 10,
      type: 'pickup',
    },
  ];

  const leaderboard = communityMembers
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 10);

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'donor':
        return <Heart className="h-4 w-4 text-blue-600" />;
      case 'ngo':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'volunteer':
        return <Star className="h-4 w-4 text-orange-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'bg-blue-100 text-blue-800';
      case 'distribution':
        return 'bg-green-100 text-green-800';
      case 'awareness':
        return 'bg-purple-100 text-purple-800';
      case 'cleanup':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinEvent = (eventId: string) => {
    toast.success('Successfully joined the event!');
  };

  const handleConnectMember = (memberId: string) => {
    toast.success('Connection request sent!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
          <p className="text-gray-600">Connect with fellow food savers and join local events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Active Members</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Upcoming Events</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{communityEvents.length}</p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Food Saved (kg)</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">15,420</p>
              </div>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Impact Score</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">98,750</p>
              </div>
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {[
              { id: 'members', label: 'Community Members', icon: Users },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'leaderboard', label: 'Leaderboard', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 sm:px-6 py-4 font-medium transition-colors whitespace-nowrap min-w-0 ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Community Members</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Invite Friends
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communityMembers.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {getUserTypeIcon(member.userType)}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{member.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{member.userType}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 sm:space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="truncate">{member.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Heart className="h-4 w-4 mr-2" />
                          {member.donationsCount} donations
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-2" />
                          {member.impactScore} impact points
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleConnectMember(member.id)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm sm:text-base"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Create Event
                  </button>
                </div>
                
                <div className="space-y-4">
                  {communityEvents.map((event) => (
                    <div key={event.id} className="bg-gray-50 rounded-lg p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900 mr-2 sm:mr-3 text-sm sm:text-base">{event.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3 text-sm sm:text-base">{event.description}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="truncate">{event.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {event.attendees}/{event.maxAttendees} attending
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          className="ml-2 sm:ml-4 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                        >
                          Join Event
                        </button>
                      </div>
                      
                      <div className="text-xs sm:text-sm text-gray-600">
                        Organized by <span className="font-medium">{event.organizer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
                
                <div className="space-y-4">
                  {leaderboard.map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{member.name}</h4>
                          <div className="flex items-center text-sm text-gray-600">
                            {getUserTypeIcon(member.userType)}
                            <span className="ml-1 capitalize">{member.userType}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm sm:text-base">{member.impactScore}</div>
                        <div className="text-xs sm:text-sm text-gray-600">impact points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🤝🍎</div>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-3">Community Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
            <div>
              <h4 className="font-medium mb-2">Be Respectful</h4>
              <p>Treat all community members with kindness and respect</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Share Responsibly</h4>
              <p>Only donate food that is safe and fresh for consumption</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Communicate Clearly</h4>
              <p>Provide accurate information about pickup times and locations</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Support Others</h4>
              <p>Help fellow members and participate in community events</p>
            </div>
          </div>

          {/* Government Verification */}
          <div className="mt-6 pt-4 border-t border-green-300">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🏛️</span>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-900">Verified by Government of India</div>
                <div className="text-xs text-green-700">Udyam Registration: UDYAM-AP-10-0116772</div>
              </div>
              <span className="text-lg">✅</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;