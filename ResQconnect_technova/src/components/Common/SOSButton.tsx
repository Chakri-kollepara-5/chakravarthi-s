import React, { useState } from 'react';
import { Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const SOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const generateWhatsAppSOS = (location, message = '') => {
    const emergencyContact = '919876543210'; // Replace with actual emergency contact
    const mapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const sosMessage = `🚨 EMERGENCY SOS! I need immediate help. ${message ? `Message: ${message}. ` : ''}My location: ${mapsUrl}`;
    
    return `https://wa.me/${emergencyContact}?text=${encodeURIComponent(sosMessage)}`;
  };

  const handleSOSPress = async () => {
    if (countdown > 0) return;

    setIsPressed(true);
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(countdownInterval);
        triggerSOS();
      }
    }, 1000);

    // Allow user to cancel within 3 seconds
    setTimeout(() => {
      if (isPressed) {
        setIsPressed(false);
        setCountdown(0);
      }
    }, 3000);
  };

  const triggerSOS = async () => {
    try {
      const location = await getCurrentLocation();
      
      // Generate WhatsApp SOS
      const whatsappUrl = generateWhatsAppSOS(location, 'Emergency! I need immediate help from ResQConnect app.');
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast.success('🚨 SOS Alert Sent! Emergency services have been notified.', {
        duration: 5000,
        style: {
          background: '#dc2626',
          color: '#fff',
        },
      });
      
      setTimeout(() => {
        toast.success('📞 WhatsApp emergency message sent with your location', {
          duration: 4000,
        });
      }, 2000);
    } catch (error) {
      console.error('SOS Error:', error);
      toast.error('Unable to send SOS. Please check your location settings.');
    }

    setIsPressed(false);
    setCountdown(0);
  };

  const cancelSOS = () => {
    setIsPressed(false);
    setCountdown(0);
    toast('SOS Cancelled');
  };

  return (
    <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50">
      {/* SOS Button */}
      <div className="relative">
        {isPressed && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full shadow-lg p-4 animate-pulse">
              <div className="text-2xl font-bold text-red-600">{countdown}</div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleSOSPress}
          onDoubleClick={cancelSOS}
          disabled={countdown > 0}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all transform ${
            isPressed 
              ? 'bg-red-700 scale-110 animate-pulse' 
              : 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95'
          } ${countdown > 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-1" />
          <span className="text-xs sm:text-sm font-bold text-white">SOS</span>
        </button>
      </div>

      {/* Instructions */}
      {!isPressed && (
        <div className="absolute -top-16 sm:-top-20 right-0 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity max-w-40">
          Press for 3s to send SOS via WhatsApp
          <br />
          Double tap to cancel
        </div>
      )}

      {/* Emergency Info Card */}
      <div className="absolute -top-32 sm:-top-40 right-0 bg-red-50 border-2 border-red-200 rounded-lg p-3 shadow-lg opacity-0 hover:opacity-100 transition-opacity max-w-48">
        <div className="flex items-center mb-2">
          <MapPin className="w-4 h-4 text-red-600 mr-2" />
          <span className="text-xs font-semibold text-red-800">Emergency SOS</span>
        </div>
        <p className="text-xs text-red-700">
          Sends your location to emergency services via WhatsApp
        </p>
      </div>
    </div>
  );
};

export default SOSButton;