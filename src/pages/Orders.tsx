
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { ChevronDown, ChevronRight, ShoppingCart, Eye, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Shipped';
  items: OrderItem[];
}

const mockOrders: Order[] = [
  {
    id: '#A1B2C3',
    date: 'June 28, 2025',
    total: 159.98,
    status: 'Delivered',
    items: [
      {
        id: '1',
        name: 'Wireless Headphones',
        price: 79.99,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop'
      }
    ]
  },
  {
    id: '#D4E5F6',
    date: 'June 25, 2025',
    total: 299.99,
    status: 'Processing',
    items: [
      {
        id: '2',
        name: 'Smart Watch',
        price: 299.99,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'
      }
    ]
  }
];

const Orders = () => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

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
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/20 text-green-600 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]';
      case 'Shipped':
        return 'bg-blue-500/20 text-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  const handleReorder = (orderId: string) => {
    // Toast notification would be implemented here
    console.log(`Reordering items from ${orderId}`);
  };

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
        {mockOrders.length > 0 ? (
          <div className="space-y-6">
            {mockOrders.map((order) => (
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
                        <span className="font-mono text-lg font-semibold text-gray-800">
                          {order.id}
                        </span>
                      </div>
                      
                      <div className="text-gray-600">
                        {order.date}
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrders.has(order.id) && (
                  <div className="border-t border-gray-200 bg-gray-50/50">
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800">{item.name}</h5>
                              <p className="text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-800">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
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
                          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Add all items to cart
                          </span>
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
