import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc,
  onSnapshot,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Donation } from '../types/donation';

export const createDonation = async (donationData: Omit<Donation, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  try {
    console.log('🚀 Creating donation:', donationData);
    
    const donation = {
      ...donationData,
      status: 'available' as const,
      createdAt: serverTimestamp(),
      urgency: donationData.urgency || 'medium',
      tags: donationData.tags || [],
    };
    
    const docRef = await addDoc(collection(db, 'donations'), donation);
    console.log('✅ Donation created with ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('❌ Error creating donation:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firebase security rules for donations collection.');
    }
    throw new Error('Failed to create donation');
  }
};

export const getDonations = async (options?: {
  limitCount?: number;
  status?: string;
  userId?: string;
}): Promise<Donation[]> => {
  try {
    console.log('📊 Fetching donations with options:', options);
    
    let q = query(collection(db, 'donations'));
    
    // Add filters
    if (options?.status && options.status !== 'all') {
      q = query(q, where('status', '==', options.status));
    }
    
    if (options?.userId) {
      q = query(q, where('donorId', '==', options.userId));
    }
    
    // Add ordering and limit
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    
    const donations = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
        expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : new Date(data.expiryDate || Date.now()),
        claimedAt: data.claimedAt?.toDate ? data.claimedAt.toDate() : null,
        completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : null,
      };
    }) as Donation[];
    
    console.log('✅ Fetched', donations.length, 'donations');
    return donations;
  } catch (error: any) {
    console.error('❌ Error fetching donations:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please configure Firebase security rules to allow reading donations.');
    }
    return [];
  }
};

export const getUserDonations = async (userId: string): Promise<Donation[]> => {
  return getDonations({ userId, limitCount: 10 });
};

export const updateDonationStatus = async (
  donationId: string, 
  status: Donation['status'], 
  claimedBy?: string
): Promise<void> => {
  try {
    console.log('🔄 Updating donation status:', donationId, 'to', status);
    
    const donationRef = doc(db, 'donations', donationId);
    const updateData: any = { 
      status,
      updatedAt: serverTimestamp()
    };
    
    if (claimedBy && status === 'claimed') {
      updateData.claimedBy = claimedBy;
      updateData.claimedAt = serverTimestamp();
    }
    
    if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }
    
    await updateDoc(donationRef, updateData);
    console.log('✅ Donation status updated successfully');
  } catch (error: any) {
    console.error('❌ Error updating donation status:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please configure Firebase security rules to allow updating donations.');
    }
    throw new Error('Failed to update donation status');
  }
};

export const deleteDonation = async (donationId: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting donation:', donationId);
    await deleteDoc(doc(db, 'donations', donationId));
    console.log('✅ Donation deleted successfully');
  } catch (error: any) {
    console.error('❌ Error deleting donation:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please configure Firebase security rules to allow deleting donations.');
    }
    throw new Error('Failed to delete donation');
  }
};

export const claimDonation = async (donationId: string, userId: string): Promise<void> => {
  try {
    console.log('🎯 Claiming donation:', donationId, 'by user:', userId);
    await updateDonationStatus(donationId, 'claimed', userId);
    console.log('✅ Donation claimed successfully');
  } catch (error: any) {
    console.error('❌ Error claiming donation:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please configure Firebase security rules to allow claiming donations.');
    }
    throw new Error('Failed to claim donation');
  }
};

export const completeDonation = async (donationId: string): Promise<void> => {
  try {
    console.log('✅ Completing donation:', donationId);
    await updateDonationStatus(donationId, 'completed');
    console.log('✅ Donation completed successfully');
  } catch (error: any) {
    console.error('❌ Error completing donation:', error);
    throw new Error('Failed to complete donation');
  }
};

export const getDonation = async (donationId: string): Promise<Donation | null> => {
  try {
    console.log('📄 Fetching single donation:', donationId);
    
    const docRef = doc(db, 'donations', donationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const donation = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
        expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : new Date(data.expiryDate || Date.now()),
        claimedAt: data.claimedAt?.toDate ? data.claimedAt.toDate() : null,
        completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : null,
      } as Donation;
      
      console.log('✅ Donation fetched successfully');
      return donation;
    }
    
    console.log('❌ Donation not found');
    return null;
  } catch (error: any) {
    console.error('❌ Error fetching donation:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please configure Firebase security rules to allow reading donations.');
    }
    return null;
  }
};

// Real-time subscription for donations with better error handling
export const subscribeToDonations = (
  callback: (donations: Donation[]) => void,
  errorCallback: (error: string) => void,
  filters?: {
    status?: string;
    userId?: string;
    limitCount?: number;
  }
) => {
  console.log('🔄 Setting up real-time subscription with filters:', filters);
  
  try {
    let q = query(collection(db, 'donations'));
    
    // Add filters
    if (filters?.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.userId) {
      q = query(q, where('donorId', '==', filters.userId));
    }
    
    // Add ordering and limit
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters?.limitCount) {
      q = query(q, limit(filters.limitCount));
    }
    
    return onSnapshot(
      q,
      (snapshot) => {
        console.log('📊 Real-time update received:', snapshot.size, 'donations');
        
        const donations = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
            expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : new Date(data.expiryDate || Date.now()),
            claimedAt: data.claimedAt?.toDate ? data.claimedAt.toDate() : null,
            completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : null,
          };
        }) as Donation[];
        
        callback(donations);
      },
      (error) => {
        console.error('❌ Real-time subscription error:', error);
        
        let errorMessage = 'Failed to load donations in real-time';
        
        if (error.code === 'failed-precondition') {
          errorMessage = 'Database indexes are being created. Please wait a moment and refresh.';
        } else if (error.code === 'permission-denied') {
          errorMessage = 'Permission denied. Please check Firebase security rules.';
        }
        
        errorCallback(errorMessage);
      }
    );
  } catch (error) {
    console.error('❌ Error setting up subscription:', error);
    errorCallback('Failed to setup real-time updates');
    return () => {}; // Return empty cleanup function
  }
};