export interface Donation {
  id: string;
  foodType: string;
  description: string;
  quantity: number;
  location: string;
  expiryDate: Date;
  contactInfo: string;
  donorId: string;
  donorName: string;
  status: 'available' | 'claimed' | 'completed';
  createdAt: Date;
  claimedBy?: string;
  claimedAt?: Date;
  completedAt?: Date;
  images?: string[];
  tags?: string[];
  urgency?: 'low' | 'medium' | 'high';
  pickupInstructions?: string;
}