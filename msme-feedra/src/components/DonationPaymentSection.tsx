import React, { useState } from 'react';
import { Heart, Users, Leaf, Gift, CreditCard } from 'lucide-react';
import PaymentModal from './PaymentModal';

const DonationPaymentSection: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const donationImpacts = [
    {
      amount: 50,
      impact: "Feed 5 families for a day",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      amount: 100,
      impact: "Support 10 meals distribution",
      icon: Heart,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100"
    },
    {
      amount: 200,
      impact: "Help reduce 50kg food waste",
      icon: Leaf,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Support Our Mission 💝</h3>
                <p className="text-green-100 text-sm">Help us reduce food waste across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Make a Difference Today! 🌟
            </h4>
            <p className="text-gray-600 text-sm">
              Your donation helps us connect surplus food with those in need, reducing waste and fighting hunger.
            </p>
          </div>

          {/* Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {donationImpacts.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl bg-gradient-to-br ${item.bgColor} border border-opacity-20 hover:scale-105 transform transition-all duration-300 cursor-pointer`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">₹{item.amount}</div>
                    <div className="text-xs text-gray-600">{item.impact}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donation Button */}
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group transform hover:scale-105"
          >
            <CreditCard className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Donate Now & Save Food 🍽️💚</span>
          </button>

          {/* Government Verification */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm">🏛️</span>
              <div className="text-center">
                <div className="text-xs font-semibold text-blue-900">Verified by Government of India</div>
                <div className="text-xs text-blue-700">Udyam Registration: UDYAM-AP-10-0116772</div>
              </div>
              <span className="text-sm">✅</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">2,450+</div>
              <div className="text-xs text-green-700">Meals Saved</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">1,200+</div>
              <div className="text-xs text-blue-700">Families Fed</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">850kg</div>
              <div className="text-xs text-purple-700">Waste Reduced</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentType="donation"
        amount={100}
        title="Support Feedra Mission"
        description="Your donation helps reduce food waste and feed families in need across India."
      />
    </>
  );
};

export default DonationPaymentSection;