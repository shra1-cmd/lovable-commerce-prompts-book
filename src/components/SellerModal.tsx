
import React, { useState } from 'react';
import { Store, Building, MapPin, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSeller } from '@/hooks/useSeller';

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellerModal = ({ isOpen, onClose }: SellerModalProps) => {
  const { sellerProfile, createSellerProfile, addProduct } = useSeller();
  const [view, setView] = useState<'register' | 'addProduct'>('register');
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
  });
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    quantity: '',
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createSellerProfile(formData.businessName, formData.businessAddress);
    if (success) {
      onClose();
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addProduct({
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      image_url: productData.image_url,
      quantity: parseInt(productData.quantity),
    });
    if (success) {
      setProductData({ name: '', description: '', price: '', image_url: '', quantity: '' });
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  // If user is not a seller yet, show registration form
  if (!sellerProfile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Become a Seller</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Business Name</span>
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Business Address</span>
              </Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleChange('businessAddress', e.target.value)}
                placeholder="Enter your business address"
                required
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-violet-500">
                Register as Seller
              </Button>
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // If seller is not approved, show waiting message
  if (!sellerProfile.is_approved) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Seller Status</span>
            </DialogTitle>
          </DialogHeader>

          <div className="text-center p-6">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600 mb-4">
              Your seller application is pending approval. You'll be able to add products once approved.
            </p>
            <Button onClick={onClose} className="bg-gradient-to-r from-blue-500 to-violet-500">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If seller is approved, show add product form
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Product</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productData.name}
              onChange={(e) => handleProductChange('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={(e) => handleProductChange('description', e.target.value)}
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={productData.price}
              onChange={(e) => handleProductChange('price', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={productData.image_url}
              onChange={(e) => handleProductChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={productData.quantity}
              onChange={(e) => handleProductChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-violet-500">
              Add Product
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SellerModal;
