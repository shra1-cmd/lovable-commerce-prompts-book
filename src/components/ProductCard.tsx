
import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const ProductCard = ({ name, price, description, imageUrl }: ProductCardProps) => {
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
      </div>
      
      <div className="relative p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            ${price}
          </span>
          <div className="flex space-x-2">
            <button className="group/btn p-2 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <Eye className="h-4 w-4 text-gray-600 group-hover/btn:text-white transition-colors" />
            </button>
            <button className="group/btn p-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-110">
              <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
