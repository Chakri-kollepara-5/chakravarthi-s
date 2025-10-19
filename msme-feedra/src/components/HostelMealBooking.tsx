import React, { useState } from 'react';
import { Clock, Star, CreditCard, Users } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  price: number;
  image: string;
  description: string;
  rating: number;
  available: boolean;
  time: string;
}

const HostelMealBooking: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const meals: Meal[] = [
    {
      id: '1',
      name: 'Healthy Breakfast Combo',
      type: 'breakfast',
      price: 30,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Poha, Upma, Tea/Coffee, Fruits',
      rating: 4.5,
      available: true,
      time: '7:00 AM - 10:00 AM'
    },
    {
      id: '2',
      name: 'Complete Lunch Thali',
      type: 'lunch',
      price: 80,
      image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Rice, Dal, Sabzi, Roti, Salad, Pickle',
      rating: 4.7,
      available: true,
      time: '12:00 PM - 2:00 PM'
    },
    {
      id: '3',
      name: 'Delicious Dinner',
      type: 'dinner',
      price: 80,
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Rice, Dal, Curry, Roti, Dessert',
      rating: 4.6,
      available: true,
      time: '7:00 PM - 9:00 PM'
    }
  ];

  const handleBookMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowPaymentModal(true);
  };

  const getMealEmoji = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  const getMealGradient = (type: string) => {
    switch (type) {
      case 'breakfast': return 'from-orange-500 to-yellow-500';
      case 'lunch': return 'from-blue-500 to-cyan-500';
      case 'dinner': return 'from-purple-500 to-indigo-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Book Your Hostel Meals 🏠</h3>
                <p className="text-green-100 text-sm">Fresh, homely meals delivered to your hostel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meals Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group hover:scale-105 transform"
              >
                {/* Meal Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${getMealGradient(meal.type)}`}>
                      {getMealEmoji(meal.type)} {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {meal.available ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                        Available 🌟
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Meal Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{meal.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{meal.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{meal.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-green-600">₹{meal.price}</div>
                    <button
                      onClick={() => handleBookMeal(meal)}
                      disabled={!meal.available}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 ${
                        meal.available
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 transform shadow-md'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>{meal.available ? 'Book Now' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-sm text-green-700">Daily Bookings</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">4.6⭐</div>
              <div className="text-sm text-blue-700">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-purple-700">Partner Hostels</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-orange-700">Support</div>
            </div>
          </div>

          {/* Government Verification */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🏛️</span>
              <div className="text-center">
                <div className="text-sm font-bold text-green-900">Verified by Government of India</div>
                <div className="text-xs text-green-700 mt-1">Udyam Registration No: UDYAM-AP-10-0116772</div>
                <div className="text-xs text-green-600 mt-1">✅ Trusted & Secure Platform</div>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedMeal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedMeal(null);
          }}
          paymentType={selectedMeal.type}
          amount={selectedMeal.price}
          title={`Book ${selectedMeal.name}`}
          description={`${selectedMeal.description} - ${selectedMeal.time}`}
        />
      )}
    </>
  );
};

export default HostelMealBooking;