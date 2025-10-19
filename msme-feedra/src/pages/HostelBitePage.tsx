import React, { useState } from 'react';
import { ArrowLeft, Utensils, Maximize2, Minimize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import HostelBiteSection from '../components/HostelBiteSection';
import HostelMealBooking from '../components/HostelMealBooking';
import DonationPaymentSection from '../components/DonationPaymentSection';

const HostelBitePage: React.FC = () => {
  const [showEmbedded, setShowEmbedded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openHostelBite = () => {
    setShowEmbedded(true);
  };

  const closeEmbedded = () => {
    setShowEmbedded(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200 hover:scale-110 transform duration-200"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  HostelBite Integration 🏠
                </h1>
                <p className="text-gray-600">Book fresh hostel meals through Feedra</p>
              </div>
            </div>
          </div>

          {/* Main Integration Section */}
          <div className="mb-8">
            <HostelBiteSection />
          </div>

          {/* Hostel Meal Booking */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">Book Your Meals</h2>
              <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                PAYMENT READY 💳
              </div>
            </div>
            <HostelMealBooking />
          </div>

          {/* Support Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">Support Our Platform</h2>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                HELP US GROW 🌱
              </div>
            </div>
            <DonationPaymentSection />
          </div>

          {/* Quick Launch Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transform transition-all duration-300">
                <span className="text-3xl">🍽️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Launch HostelBite Instantly
              </h2>
              <p className="text-gray-600 mb-6">
                Access the full HostelBite experience directly within Feedra
              </p>
              <button
                onClick={openHostelBite}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto transform hover:scale-105"
              >
                <Utensils className="h-6 w-6" />
                <span>Open HostelBite 🚀</span>
              </button>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-2">🔄</span>
              How HostelBite Works with Feedra
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  icon: '🔍',
                  title: 'Browse Meals',
                  description: 'Check available meals and timings from your hostel kitchen'
                },
                {
                  step: '2',
                  icon: '📱',
                  title: 'Book Instantly',
                  description: 'Select your meals and book with just a few taps'
                },
                {
                  step: '3',
                  icon: '🍽️',
                  title: 'Enjoy Fresh Food',
                  description: 'Pick up your pre-booked meals at the designated time'
                }
              ].map((item, index) => (
                <div key={index} className="text-center hover:scale-105 transform transition-all duration-300">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:from-green-200 hover:to-emerald-200 transition-all duration-300">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded HostelBite Modal */}
          {showEmbedded && (
            <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${isFullscreen ? 'p-0' : ''}`}>
              <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh] max-h-[800px]'}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">HostelBite - Book Your Meals</h3>
                      <p className="text-green-100 text-sm">Fresh meals delivered to your hostel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleFullscreen}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-5 w-5" />
                      ) : (
                        <Maximize2 className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={closeEmbedded}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
                      title="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Embedded Content */}
                <div className="relative w-full h-full bg-gray-50">
                  {/* Use Wikipedia or CodePen demo for now */}
                  <iframe
                    src="https://en.wikipedia.org/wiki/Main_Page"
                    className="w-full h-full border-0"
                    title="HostelBite Demo"
                    loading="lazy"
                    style={{ minHeight: isFullscreen ? '100vh' : '600px' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HostelBitePage;
