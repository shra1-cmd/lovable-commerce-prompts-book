
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
    // Optimistic update
    setProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, stock: newStock } : product
      )
    );

    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity: newStock }) // Update quantity column in database
        .eq('id', productId);

      if (error) throw error;

    } catch (error) {
      console.error('Error updating product stock:', error);
      // Revert optimistic update
      await fetchProducts();
      throw error;
    }
  };

  // Set up real-time subscription for product quantity changes with improved performance
  useEffect(() => {
    fetchProducts();

    // Subscribe to real-time changes in products table
    const channel = supabase
      .channel('product-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'products' 
        }, 
        (payload) => {
          console.log('Product updated:', payload);
          // Optimistically update the specific product in local state
          setProducts(prev => 
            prev.map(product => 
              product.id === payload.new.id 
                ? { ...product, stock: payload.new.quantity || 0 }
                : product
            )
          );
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'products' 
        }, 
        (payload) => {
          console.log('New product added:', payload);
          // Add new product to the list
          const newProduct = {
            ...payload.new,
            stock: payload.new.quantity || 0
          } as Product;
          setProducts(prev => [newProduct, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    updateProductStock,
  };
};
