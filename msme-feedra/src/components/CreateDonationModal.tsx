import React, { useState } from 'react';
import { X, MapPin, Package, Clock, FileText, Tag, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createDonation } from '../services/donationService';
import { sendDonationNotification } from '../services/emailService';
import toast from 'react-hot-toast';

interface CreateDonationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateDonationModal: React.FC<CreateDonationModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    foodType: '',
    description: '',
    quantity: '',
    location: '',
    expiryDate: '',
    contactInfo: user?.email || '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    tags: [] as string[],
    pickupInstructions: '',
  });

  const foodTypes = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Prepared Meals',
    'Baked Goods',
    'Canned Foods',
    'Beverages',
    'Snacks',
    'Other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600', description: 'Good for several days' },
    { value: 'medium', label: 'Medium Priority', color: 'text-orange-600', description: 'Should be picked up soon' },
    { value: 'high', label: 'High Priority', color: 'text-red-600', description: 'Urgent - expires very soon' },
  ];

  const commonTags = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Organic', 'Fresh', 'Frozen', 
    'Cooked', 'Raw', 'Halal', 'Kosher', 'Dairy-Free', 'Nut-Free'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to create donations');
      return;
    }

    // Validation
    if (!formData.foodType || !formData.description || !formData.quantity || !formData.location || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.quantity) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    // Fix: Properly handle expiry date validation
    const expiryDate = new Date(formData.expiryDate);
    const now = new Date();
    
    // Add buffer of 1 hour to ensure expiry is in the future
    if (expiryDate <= new Date(now.getTime() + 3600000)) {
      toast.error('Expiry date must be at least 1 hour in the future');
      return;
    }

    setLoading(true);

    try {
      await createDonation({
        foodType: formData.foodType.toLowerCase(),
        description: formData.description,
        quantity: parseFloat(formData.quantity),
        location: formData.location,
        expiryDate: expiryDate.toISOString(), // Ensure ISO string format
        contactInfo: formData.contactInfo,
        donorId: user.uid,
        donorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        urgency: formData.urgency,
        tags: formData.tags,
        pickupInstructions: formData.pickupInstructions,
      });

      // Send donation notification email
      try {
        await sendDonationNotification({
          donorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          donorEmail: user.email || '',
          foodType: formData.foodType,
          quantity: parseFloat(formData.quantity),
          location: formData.location
        });
        toast.success('Donation created and notification sent! 🌟📧');
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        toast.success('Donation created successfully! 🌟');
        toast('Email notification failed to send', { icon: '⚠️' });
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error('Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  // Fix: Calculate minimum datetime for input (current time + 1 hour)
  const getMinDatetime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900">Create Food Donation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Food Type & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-1" />
                Food Type *
              </label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select food type</option>
                {foodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Priority Level *
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="Describe the food items, condition, and any special instructions..."
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>

          {/* Quantity & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (kg) *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="0.1"
                step="0.1"
                placeholder="e.g., 5.5"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Pickup Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., 123 Main St, Sydney, NSW"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Expiry Date & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Expiry Date *
              </label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                min={getMinDatetime()} // Use the calculated minimum datetime
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <input
                type="email"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Email for pickup coordination"
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Tag className="h-4 w-4 inline mr-1" />
              Food Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Instructions (Optional)
            </label>
            <textarea
              name="pickupInstructions"
              value={formData.pickupInstructions}
              onChange={handleInputChange}
              rows={2}
              placeholder="Special instructions for pickup (e.g., ring doorbell, back entrance, available hours...)"
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {loading ? 'Creating...' : 'Create Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationModal;