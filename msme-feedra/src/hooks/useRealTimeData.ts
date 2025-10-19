import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  QueryConstraint,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Donation } from '../types/donation';

export const useRealTimeDonations = (filters?: {
  status?: string;
  userType?: string;
  userId?: string;
  limit?: number;
}) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupRealTimeListener = () => {
      try {
        // Start with basic collection reference
        let q = query(collection(db, 'donations'));
        
        // Add filters one by one to avoid complex index requirements
        const constraints: QueryConstraint[] = [];
        
        // Add status filter if specified
        if (filters?.status && filters.status !== 'all') {
          constraints.push(where('status', '==', filters.status));
        }
        
        // Add user filter if specified
        if (filters?.userId) {
          constraints.push(where('donorId', '==', filters.userId));
        }
        
        // Always add ordering by createdAt (descending for newest first)
        constraints.push(orderBy('createdAt', 'desc'));
        
        // Add limit if specified
        if (filters?.limit) {
          constraints.push(limit(filters.limit));
        }
        
        // Apply all constraints
        if (constraints.length > 0) {
          q = query(collection(db, 'donations'), ...constraints);
        }

        console.log('🔄 Setting up real-time listener with filters:', filters);

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            console.log('📊 Received real-time update:', snapshot.size, 'donations');
            
            const donationsData = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                // Handle Firestore Timestamp conversion safely
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
                expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : new Date(data.expiryDate || Date.now()),
                claimedAt: data.claimedAt?.toDate ? data.claimedAt.toDate() : null,
                completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : null,
              };
            }) as Donation[];
            
            setDonations(donationsData);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('❌ Real-time listener error:', err);
            
            // Handle specific Firebase errors
            if (err.code === 'failed-precondition') {
              setError('Database indexes are being created. Please wait a moment and refresh.');
            } else if (err.code === 'permission-denied') {
              setError('Permission denied. Please check Firebase security rules.');
            } else {
              setError('Failed to load donations in real-time');
            }
            
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('❌ Error setting up listener:', err);
        setError('Failed to setup real-time updates');
        setLoading(false);
      }
    };

    setupRealTimeListener();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        console.log('🧹 Cleaning up real-time listener');
        unsubscribe();
      }
    };
  }, [filters?.status, filters?.userId, filters?.limit]);

  return { donations, loading, error };
};

export const useRealTimeStats = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalFoodSaved: 0,
    activeDonors: 0,
    co2Saved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📈 Setting up real-time stats listener');
    
    // Simple query without complex filters for stats
    const unsubscribe = onSnapshot(
      query(collection(db, 'donations'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        console.log('📊 Stats update received:', snapshot.size, 'total donations');
        
        const donations = snapshot.docs.map(doc => doc.data());
        const totalFoodSaved = donations.reduce((sum, d) => sum + (d.quantity || 0), 0);
        const uniqueDonors = new Set(donations.map(d => d.donorId)).size;
        
        setStats({
          totalDonations: donations.length,
          totalFoodSaved: Math.round(totalFoodSaved),
          activeDonors: uniqueDonors,
          co2Saved: Math.round(totalFoodSaved * 2.3),
        });
        setLoading(false);
      },
      (error) => {
        console.error('❌ Stats error:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up stats listener');
      unsubscribe();
    };
  }, []);

  return { stats, loading };
};