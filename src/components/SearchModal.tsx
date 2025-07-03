
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const SearchModal = ({ isOpen, onClose, products }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();

  const popularProducts = products.slice(0, 3);

  // Debounced search effect
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowValidation(query.length > 0);
      return;
    }

    setShowValidation(false);
    const timeoutId = setTimeout(() => {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, products]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleProductClick(searchResults[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose]);

  const handleClose = () => {
    setQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
    setShowValidation(false);
    onClose();
  };

  const handleProductClick = (product: Product) => {
    handleClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by product name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {showValidation && (
            <p className="text-red-500 text-sm p-4">Please enter at least 2 letters.</p>
          )}

          {query.length >= 2 && searchResults.length === 0 && (
            <div className="p-4">
              <p className="text-gray-500 mb-4">No items matched your search 🙁</p>
              <div>
                <h3 className="font-semibold mb-2">Popular Products:</h3>
                <div className="space-y-2">
                  {popularProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-1">
              {searchResults.map((product, index) => (
                <div
                  key={product.id}
                  className={`flex items-center space-x-3 p-3 cursor-pointer rounded-lg ${
                    index === selectedIndex ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleProductClick(product)}
                >
                  <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
