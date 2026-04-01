import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string | null;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  trialUsed: boolean;
  analysisCount: number;
  login: (user: User) => void;
  logout: () => void;
  incrementAnalysis: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('resumeiq_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [analysisCount, setAnalysisCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('resumeiq_analysis_count') || '0', 10);
  });

  const isLoggedIn = !!user;
  const trialUsed = analysisCount >= 1;

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('resumeiq_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resumeiq_user');
  };

  const incrementAnalysis = () => {
    const nextCount = analysisCount + 1;
    setAnalysisCount(nextCount);
    localStorage.setItem('resumeiq_analysis_count', nextCount.toString());
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, trialUsed, analysisCount, login, logout, incrementAnalysis }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
