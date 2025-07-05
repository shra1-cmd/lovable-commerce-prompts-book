
import React, { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  onAddToCart: (productId: string) => void;
  isAuthenticated: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  description, 
  imageUrl, 
  stock,
  onAddToCart,
  isAuthenticated 
}: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }
    
    setIsAdding(true);
    try {
      await onAddToCart(id);
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">OUT OF STOCK</span>
          </div>
        )}
      </div>
      
      <div className="relative p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            {formatPrice(price)}
          </span>
          <span className={`text-sm font-medium ${
            stock > 10 ? 'text-green-600' : 
            stock > 0 ? 'text-orange-600' : 
            'text-red-600'
          }`}>
            {stock > 0 ? `In Stock: ${stock}` : 'Out of Stock'}
          </span>
        </div>
        <div className="flex space-x-2">
          <button className="group/btn flex-1 p-2 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <Eye className="h-4 w-4 text-gray-600 group-hover/btn:text-white transition-colors mx-auto" />
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={stock === 0 || isAdding}
            className={`group/btn flex-1 p-2 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2 ${
              stock === 0 || isAdding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105'
            }`}
          >
            <ShoppingCart className={`h-4 w-4 transition-transform ${isAdding ? 'animate-pulse' : 'group-hover/btn:scale-110'}`} />
            <span className="text-sm font-medium">
              {isAdding ? 'Adding...' : 
               stock === 0 ? 'Out of Stock' : 
               (isAuthenticated ? 'Add to Cart' : 'Sign In')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
