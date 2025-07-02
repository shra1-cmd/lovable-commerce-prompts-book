
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">${price}</span>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors">
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
