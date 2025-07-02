
import React from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              ShopHub
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'text-blue-500 border-b-2 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' 
                    : 'text-gray-700 hover:text-blue-500 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/products') 
                    ? 'text-blue-500 border-b-2 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' 
                    : 'text-gray-700 hover:text-blue-500 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                }`}
              >
                Products
              </Link>
              <Link 
                to="/orders" 
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/orders') 
                    ? 'text-blue-500 border-b-2 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' 
                    : 'text-gray-700 hover:text-blue-500 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                }`}
              >
                Orders
              </Link>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-blue-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-blue-500 relative transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                3
              </span>
            </button>
            <button className="p-2 text-gray-700 hover:text-blue-500 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
