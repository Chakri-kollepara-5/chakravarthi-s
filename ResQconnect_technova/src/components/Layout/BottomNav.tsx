import React from 'react';
import { Home, AlertTriangle, MapPin, MessageCircle, BarChart3, HandHeart } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange, language }) => {
  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: language === 'hi' ? 'होम' : 'Home' 
    },
    { 
      id: 'alerts', 
      icon: AlertTriangle, 
      label: language === 'hi' ? 'अलर्ट' : 'Alerts' 
    },
    { 
      id: 'requests', 
      icon: HandHeart, 
      label: language === 'hi' ? 'मदद' : 'Help' 
    },
    { 
      id: 'chat', 
      icon: MessageCircle, 
      label: language === 'hi' ? 'चैट' : 'Chat' 
    },
    { 
      id: 'dashboard', 
      icon: BarChart3, 
      label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-2 px-1 transition-all ${
                isActive 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;