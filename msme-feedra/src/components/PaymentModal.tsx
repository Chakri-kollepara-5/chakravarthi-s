import React, { useState } from 'react';
import { X, CreditCard, Shield, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: 'donation' | 'breakfast' | 'lunch' | 'dinner';
  amount: number;
  title: string;
  description?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentType,
  amount,
  title,
  description
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Razorpay payment links
  const getPaymentLink = () => {
    switch (paymentType) {
      case 'breakfast':
        return 'https://rzp.io/rzp/1oUmcRy3'; // ₹30
      case 'lunch':
        return 'https://rzp.io/rzp/bsVwLwNS'; // ₹80
      case 'dinner':
        return 'https://rzp.io/rzp/bsVwLwNS'; // ₹80
      default:
        return 'https://rzp.io/rzp/B0wLgUb'; // Default donation link
    }
  };

  const handlePayment = () => {
    setLoading(true);
    const paymentLink = getPaymentLink();
    window.open(paymentLink, '_blank');
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const getMealEmoji = () => {
    switch (paymentType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '💝';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <span className="text-2xl">{getMealEmoji()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-green-100 text-sm">Secure Payment via Razorpay</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {description && (
            <p className="text-gray-600 mb-6 text-center">{description}</p>
          )}

          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 text-center border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">₹{amount}</div>
            <div className="text-sm text-green-700">
              {paymentType === 'donation' ? 'Donation Amount' : 'Meal Price'}
            </div>
          </div>

          {/* Payment Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Secure payment powered by Razorpay</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>UPI, Cards, Net Banking supported</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span>Instant confirmation & receipt</span>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Pay ₹{amount} Now 💳</span>
              </>
            )}
          </button>

          {/* Security Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              🔒 Your payment is processed securely by Razorpay. We don't store your payment details.
            </p>
          </div>

          {/* Government Verification */}
          <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm">🏛️</span>
              <div className="text-center">
                <div className="text-xs font-semibold text-green-900">Government Verified Platform</div>
                <div className="text-xs text-green-700">Udyam No: UDYAM-AP-10-0116772</div>
              </div>
              <span className="text-sm">✅</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;