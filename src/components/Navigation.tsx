
import React from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">ShopHub</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-primary hover:text-primary/80 px-3 py-2 text-sm font-medium border-b-2 border-primary">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                Orders
              </a>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-primary">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-primary relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 text-gray-700 hover:text-primary">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
