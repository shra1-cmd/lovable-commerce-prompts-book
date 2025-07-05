import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { ChevronDown, ChevronRight, ShoppingCart, Eye, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';

const Orders = () => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { orders, loading } = useOrders();

  const toggleExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 text-green-600 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      case 'pending':
        return 'bg-orange-500/20 text-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.3)]';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateIndian = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleReorder = (orderId: string) => {
    console.log(`Reordering items from ${orderId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">My Orders</h1>
            <p className="text-xl text-gray-300 italic">Track your past purchases</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔒</div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              Sign in to view your orders
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Please sign in to access your order history
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
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
          <h1 className="text-5xl font-bold text-white mb-4">My Orders</h1>
          <p className="text-xl text-gray-300 italic">Track your past purchases</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpanded(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        {expandedOrders.has(order.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                        <div>
                          <span className="font-mono text-lg font-semibold text-gray-800">
                            #{order.id.slice(0, 8)}
                          </span>
                          <p className="text-sm text-gray-500">Order ID</p>
                        </div>
                      </div>
                      
                      <div className="text-gray-600">
                        <div className="font-medium">{formatDateIndian(order.created_at)}</div>
                        <p className="text-sm text-gray-500">Ordered On</p>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                        {formatPrice(Number(order.amount))}
                      </div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrders.has(order.id) && (
                  <div className="border-t border-gray-200 bg-gray-50/50">
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h4>
                      
                      {/* Order Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg border">
                        <div>
                          <p className="text-sm text-gray-500">Product ID</p>
                          <p className="font-semibold text-gray-800">#{order.id.slice(-6)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-semibold text-gray-800">{formatDateIndian(order.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="font-semibold text-gray-800">{formatPrice(Number(order.amount))}</p>
                        </div>
                      </div>

                      <h5 className="text-md font-semibold text-gray-800 mb-3">Products Ordered</h5>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-gray-500">Product Name</p>
                                  <h5 className="font-semibold text-gray-800">{item.name}</h5>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Product ID</p>
                                  <p className="font-mono text-sm text-gray-600">#{item.id.slice(-8)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Quantity</p>
                                  <p className="font-medium text-gray-800">{item.quantity} pcs</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Unit Price</p>
                                  <p className="font-medium text-gray-800">{formatPrice(item.price)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Subtotal</p>
                              <div className="font-bold text-lg text-gray-800">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleReorder(order.id)}
                          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105"
                        >
                          <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                          Reorder
                        </button>
                        
                        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="h-4 w-4" />
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              You haven't placed any orders yet.
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Start shopping to see your order history here
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart className="h-5 w-5" />
              Go Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
