
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import UpiPayment from '../components/UpiPayment';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, loading } = useCart();
  const { user } = useAuth();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentSubmitted = () => {
    // Redirect to orders page after successful payment submission
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔒</div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              Sign in required
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Please sign in to proceed with payment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛍️</div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Add some items to your cart before proceeding to payment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Payment</h1>
          <p className="text-xl text-gray-300 italic">Complete your purchase</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <UpiPayment
            totalAmount={total}
            cartItems={cartItems}
            onPaymentSubmitted={handlePaymentSubmitted}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
