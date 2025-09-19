import React from 'react';
import { Bell, Globe, User, LogOut } from 'lucide-react';
import { signOutUser } from '../../services/authService';
import toast from 'react-hot-toast';

const Header = ({ language, setLanguage, onLogout, user, userRole }) => {
  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'hi' : 'en';
    setLanguage(newLanguage);
    toast.success(`Language changed to ${newLanguage === 'en' ? 'English' : 'हिंदी'}`);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Logged out successfully');
      onLogout();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const getGreeting = () => {
    return language === 'hi' ? 'ResQConnect' : 'ResQConnect';
  };

  const getSubtitle = () => {
    return language === 'hi' ? 'आपदा राहत केंद्र' : 'Disaster Relief Hub';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-lg" />
                  ) : (
                    <span className="text-white font-bold text-sm sm:text-lg">R</span>
                  )}
                </div>
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{getGreeting()}</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {user?.displayName || user?.email} • {userRole || 'User'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full transition-colors"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
              <span className="sm:hidden">{language === 'en' ? 'हि' : 'En'}</span>
            </button>

            {/* Notifications */}
            <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-red-600 transition-colors">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium">
                3
              </span>
            </button>

            {/* User Profile */}
            <button className="flex items-center p-1.5 sm:p-2 text-gray-600 hover:text-red-600 transition-colors">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 active:bg-red-100 rounded-full transition-colors"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
              <span className="sm:hidden">Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;