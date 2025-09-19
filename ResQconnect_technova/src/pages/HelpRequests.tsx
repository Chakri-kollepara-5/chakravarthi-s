import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, HandHeart } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import HelpRequestCard from '../components/HelpRequests/HelpRequestCard';
import CreateRequestModal from '../components/HelpRequests/CreateRequestModal';
import toast from 'react-hot-toast';

interface HelpRequestsProps {
  currentUser: any;
}

const HelpRequests: React.FC<HelpRequestsProps> = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'helpRequests'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRequest = async (requestData) => {
    try {
      await addDoc(collection(db, 'helpRequests'), requestData);
      toast.success('Help request created successfully!');
    } catch (error) {
      console.error('Error creating help request:', error);
      toast.error('Failed to create help request');
    }
  };

  const handleRespond = (request) => {
    // In a real app, this would open a response modal or redirect to a chat
    toast.success('Response feature coming soon!');
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    
    return matchesSearch && matchesUrgency;
  });

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
        <div className="bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Help Requests</h1>
              <p className="text-green-100 text-sm sm:text-lg">Connect with people who need help</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading help requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center">
            <HandHeart className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Help Requests</h1>
            <p className="text-green-100 text-sm sm:text-lg">Connect with people who need help in your community</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search help requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filters and Create Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
              >
                {urgencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm sm:text-base font-medium"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Request Help
              </button>
            </div>
          </div>
        </div>

        {/* Help Requests List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredRequests.length > 0 ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {filteredRequests.length} Help Request{filteredRequests.length !== 1 ? 's' : ''} Found
              </h2>
              {filteredRequests.map((request) => (
                <HelpRequestCard
                  key={request.id}
                  request={request}
                  onRespond={handleRespond}
                  currentUser={currentUser}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <HandHeart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No help requests found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                {searchTerm || selectedUrgency !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Be the first to create a help request in your community'
                }
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm sm:text-base"
              >
                Create First Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRequest}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default HelpRequests;