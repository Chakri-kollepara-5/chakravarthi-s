import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChange, getUserRole } from './services/authService';
import { AppProvider } from './contexts/AppContext';
import LoginPage from './components/Auth/LoginPage';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import SOSButton from './components/Common/SOSButton';
import Home from './pages/Home';
import Alerts from './pages/Alerts';
import Resources from './pages/Resources';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import HelpRequests from './pages/HelpRequests';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const role = await getUserRole(authUser.uid);
          setUserRole(role);
        } catch (error) {
          console.error('Error getting user role:', error);
          setUserRole('user'); // Default role
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (authUser) => {
    setUser(authUser);
    try {
      const role = await getUserRole(authUser.uid);
      setUserRole(role);
    } catch (error) {
      console.error('Error getting user role:', error);
      setUserRole('user'); // Default role
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ResQConnect...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} language={language} />;
      case 'alerts':
        return <Alerts language={language} />;
      case 'resources':
        return <Resources language={language} />;
      case 'requests':
        return <HelpRequests currentUser={user} language={language} />;
      case 'chat':
        return <Chat language={language} />;
      case 'dashboard':
        return <Dashboard language={language} />;
      default:
        return <Home onNavigate={setActiveTab} language={language} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          language={language} 
          setLanguage={setLanguage} 
          onLogout={handleLogout}
          user={user}
          userRole={userRole}
        />
        
        <main className="relative">
          {renderActiveTab()}
        </main>

        <SOSButton />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} language={language} />
        
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AppProvider>
  );
}

export default App;