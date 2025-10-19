import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { sendWelcomeEmail } from '../services/emailService';
import toast from 'react-hot-toast';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: 'donor' | 'ngo' | 'volunteer';
  createdAt: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, userType: 'donor' | 'ngo' | 'volunteer') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: userData.displayName || '',
              userType: userData.userType || 'volunteer',
              createdAt: userData.createdAt?.toDate() || new Date(),
            };
            setUser(userProfile);
            
            // Send welcome email for new users (check if user was just created)
            const isNewUser = !userData.welcomeEmailSent && userData.createdAt && 
              (new Date().getTime() - userData.createdAt.toDate().getTime()) < 60000; // Within 1 minute
            
            if (isNewUser) {
              try {
                console.log('🚀 Sending welcome email for new user login...');
                const emailSent = await sendWelcomeEmail({
                  name: userData.displayName || 'User',
                  email: firebaseUser.email || '',
                  userType: userData.userType || 'volunteer'
                });
                
                if (emailSent) {
                  // Mark welcome email as sent
                  await setDoc(doc(db, 'users', firebaseUser.uid), {
                    ...userData,
                    welcomeEmailSent: true,
                    welcomeEmailSentAt: new Date()
                  }, { merge: true });
                  
                  toast.success('Welcome email sent! 📧');
                } else {
                  console.error('Welcome email failed to send');
                }
              } catch (emailError) {
                console.error('Welcome email failed:', emailError);
              }
            }
          } else {
            // Create basic user profile if doesn't exist
            const basicProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              userType: 'volunteer' as const,
              createdAt: new Date(),
              welcomeEmailSent: false,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), basicProfile);
            setUser(basicProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback user object
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            userType: 'volunteer',
            createdAt: new Date(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string, userType: 'donor' | 'ngo' | 'volunteer') => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Validate inputs before creating profile
    if (!firebaseUser.email || !displayName.trim()) {
      throw new Error('Invalid user data - email or name is missing');
    }
    
    const userProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName,
      userType,
      createdAt: new Date(),
      welcomeEmailSent: false,
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
    
    // Send welcome email immediately after registration
    try {
      console.log('🚀 Sending welcome email after registration...');
      console.log('User data for email:', {
        name: displayName,
        email: firebaseUser.email,
        userType
      });
      
      const emailSent = await sendWelcomeEmail({
        name: displayName,
        email: firebaseUser.email || '',
        userType
      });
      
      if (emailSent) {
        // Mark welcome email as sent
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...userProfile,
          welcomeEmailSent: true,
          welcomeEmailSentAt: new Date()
        }, { merge: true });
        console.log('✅ Welcome email sent and marked as sent');
      } else {
        console.error('Welcome email failed to send during registration');
      }
    } catch (emailError) {
      console.error('Welcome email failed during registration:', emailError);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};