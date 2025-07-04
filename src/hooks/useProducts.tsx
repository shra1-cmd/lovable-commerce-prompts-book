
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  seller_id?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to ensure it has the correct structure
      const productsWithStock = (data || []).map(product => ({
        ...product,
        stock: product.quantity || 0 // Map quantity to stock for consistency
      }));

      setProducts(productsWithStock);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity: newStock }) // Update quantity column in database
        .eq('id', productId);

      if (error) throw error;

      // Update local state
      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    updateProductStock,
  };
};
