import React, { useState } from 'react';
import { Shield, Users, Heart, Settings } from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmailPassword, 
  signUpWithEmailPassword 
} from '../../services/authService';
import toast from 'react-hot-toast';

const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');

  // Role options
  const roles = [
    { 
      value: 'user', 
      label: 'User', 
      icon: Users, 
      description: 'Get help during disasters',
      color: 'bg-blue-500'
    },
    { 
      value: 'volunteer', 
      label: 'Volunteer', 
      icon: Heart, 
      description: 'Help others in need',
      color: 'bg-green-500'
    },
    { 
      value: 'ngo', 
      label: 'NGO Member', 
      icon: Shield, 
      description: 'Manage relief operations',
      color: 'bg-purple-500'
    },
    { 
      value: 'admin', 
      label: 'Administrator', 
      icon: Settings, 
      description: 'System administration',
      color: 'bg-red-500'
    }
  ];

  // Demo accounts
  const demoAccounts = [
    { email: 'user@resq.com', password: 'user123', role: 'user', name: 'Demo User' },
    { email: 'volunteer@resq.com', password: 'volunteer123', role: 'volunteer', name: 'Demo Volunteer' },
    { email: 'ngo@resq.com', password: 'ngo123', role: 'ngo', name: 'Demo NGO' },
    { email: 'admin@resq.com', password: 'admin123', role: 'admin', name: 'Demo Admin' }
  ];

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      toast.success('Login successful!');
      onLogin(user);
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Auth
  const handleEmailAuth = async (e) => {
    e.preventDefault();

    if (!email || !password || (isSignUp && !name)) {
      toast.error('Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      let user;
      if (isSignUp) {
        user = await signUpWithEmailPassword(email, password, name, selectedRole);
        toast.success('Account created successfully!');
      } else {
        user = await signInWithEmailPassword(email, password);
        toast.success('Login successful!');
      }
      onLogin(user);
    } catch (error) {
      console.error(isSignUp ? 'Sign-up error:' : 'Sign-in error:', error);
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login
  const handleDemoLogin = async (demoAccount) => {
    setLoading(true);
    try {
      const user = await signInWithEmailPassword(demoAccount.email, demoAccount.password);
      toast.success(`Logged in as ${demoAccount.role}!`);
      onLogin(user);
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ResQConnect</h1>
          <p className="text-red-100 text-lg">Disaster Relief & Emergency Response</p>
        </div>

        {/* Login / Sign Up Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {/* Role Selection for Sign Up */}
          {isSignUp && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedRole === role.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 ${role.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-gray-900">{role.label}</p>
                      <p className="text-xs text-gray-500">{role.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-red-400"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <hr className="flex-1 border-gray-300" />
            <span className="px-4 text-gray-500">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 disabled:bg-gray-100 disabled:border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl mb-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Demo Accounts */}
          {!isSignUp && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3 text-center">Quick Demo Access:</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => {
                  const role = roles.find(r => r.value === account.role);
                  const Icon = role?.icon || Users;
                  return (
                    <button
                      key={account.role}
                      onClick={() => handleDemoLogin(account)}
                      disabled={loading}
                      className={`p-2 rounded-lg border text-xs font-medium transition-colors ${role?.color} text-white hover:opacity-90 disabled:opacity-50`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      {role?.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toggle Login / Sign Up */}
          <p className="mt-6 text-center text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-red-600 font-semibold hover:underline"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;