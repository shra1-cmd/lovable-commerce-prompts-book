
import React, { useState } from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal';
import CartDrawer from './CartDrawer';
import ProfileDropdown from './ProfileDropdown';
import { products } from '../data/products';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Modal/Drawer states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  // Mock data - replace with actual state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      quantity: 2
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      quantity: 1
    }
  ]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    // Navigate to checkout or handle checkout logic
    console.log('Proceeding to checkout...');
  };

  const handleSignIn = () => {
    console.log('Opening sign in modal...');
    // Handle sign in
  };

  const handleSignUp = () => {
    console.log('Opening sign up modal...');
    // Handle sign up
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleProfile = () => {
    console.log('Navigate to profile...');
    // Navigate to profile page
  };

  const handleOrders = () => {
    navigate('/orders');
  };

  return (
    <>
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
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-500 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-500 relative transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              <ProfileDropdown
                isLoggedIn={isLoggedIn}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                onLogout={handleLogout}
                onProfile={handleProfile}
                onOrders={handleOrders}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Modals and Drawers */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        products={products}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default Navigation;
