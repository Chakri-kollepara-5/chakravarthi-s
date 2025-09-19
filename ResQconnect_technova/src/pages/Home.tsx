import React from 'react';
import { AlertTriangle, Shield, MapPin, MessageCircle, TrendingUp, Users } from 'lucide-react';
import WeatherNavigation from '../components/Weather/WeatherNavigation';
import LocationDisplay from '../components/Location/LocationDisplay';

const Home = ({ onNavigate, language }) => {
  const getText = (key) => {
    const translations = {
      title: {
        en: 'Stay Safe, Stay Connected',
        hi: 'सुरक्षित रहें, जुड़े रहें'
      },
      subtitle: {
        en: 'Your emergency companion for disaster management and relief',
        hi: 'आपदा प्रबंधन और राहत के लिए आपका आपातकालीन साथी'
      },
      viewAlerts: {
        en: 'View Active Alerts',
        hi: 'सक्रिय अलर्ट देखें'
      },
      findHelp: {
        en: 'Find Help Nearby',
        hi: 'पास में मदद खोजें'
      },
      quickActions: {
        en: 'Quick Actions',
        hi: 'त्वरित कार्य'
      },
      safetyTips: {
        en: 'Safety Tips',
        hi: 'सुरक्षा सुझाव'
      }
    };
    return translations[key]?.[language] || translations[key]?.en || '';
  };

  const stats = [
    {
      icon: AlertTriangle,
      label: language === 'hi' ? 'सक्रिय अलर्ट' : 'Active Alerts',
      value: '12',
      color: 'bg-red-100 text-red-700'
    },
    {
      icon: Shield,
      label: language === 'hi' ? 'संसाधन' : 'Resources',
      value: '45',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: Users,
      label: language === 'hi' ? 'लोगों की मदद की' : 'People Helped',
      value: '1,247',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: TrendingUp,
      label: language === 'hi' ? 'SOS अनुरोध' : 'SOS Requests',
      value: '28',
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  const quickActions = [
    {
      icon: AlertTriangle,
      title: language === 'hi' ? 'अलर्ट देखें' : 'View Alerts',
      description: language === 'hi' ? 'नवीनतम आपदा चेतावनी देखें' : 'Check latest disaster warnings',
      action: () => onNavigate('alerts'),
      color: 'bg-red-600 hover:bg-red-700 active:bg-red-800'
    },
    {
      icon: MapPin,
      title: language === 'hi' ? 'संसाधन खोजें' : 'Find Resources',
      description: language === 'hi' ? 'आश्रय, भोजन और पानी का पता लगाएं' : 'Locate shelters, food & water',
      action: () => onNavigate('resources'),
      color: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
    },
    {
      icon: MessageCircle,
      title: language === 'hi' ? 'AI सहायक' : 'AI Assistant',
      description: language === 'hi' ? 'सुरक्षा मार्गदर्शन प्राप्त करें' : 'Get safety guidance',
      action: () => onNavigate('chat'),
      color: 'bg-green-600 hover:bg-green-700 active:bg-green-800'
    },
    {
      icon: TrendingUp,
      title: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      description: language === 'hi' ? 'विश्लेषण और रिपोर्ट' : 'Analytics & reports',
      action: () => onNavigate('dashboard'),
      color: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
    }
  ];

  const safetyTips = [
    {
      en: 'Keep emergency contacts readily available',
      hi: 'आपातकालीन संपर्क तुरंत उपलब्ध रखें'
    },
    {
      en: 'Maintain emergency supply kit with water & food',
      hi: 'पानी और भोजन के साथ आपातकालीन आपूर्ति किट रखें'
    },
    {
      en: 'Stay informed about local emergency plans',
      hi: 'स्थानीय आपातकालीन योजनाओं के बारे में जानकारी रखें'
    },
    {
      en: 'Practice evacuation routes with your family',
      hi: 'अपने परिवार के साथ निकासी मार्गों का अभ्यास करें'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4">
              {getText('title')}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-red-100">
              {getText('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => onNavigate('alerts')}
                className="bg-white text-red-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                {getText('viewAlerts')}
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 active:bg-gray-100 transition-colors"
              >
                {getText('findHelp')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weather Navigation Section */}
        <div className="mb-6 sm:mb-8">
          <WeatherNavigation />
        </div>

        {/* Location Display Section */}
        <div className="mb-6 sm:mb-8">
          <LocationDisplay />
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{getText('quickActions')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white p-4 sm:p-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg`}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 mx-auto" />
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{action.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
          <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">💡 {getText('safetyTips')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-blue-800 text-sm sm:text-base">{tip[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;