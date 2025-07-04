import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  product_id: string;
  stock: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            price,
            image_url,
            quantity
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems = data?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products?.name || '',
        price: Number(item.products?.price) || 0,
        image_url: item.products?.image_url || '',
        stock: item.products?.quantity || 0,
        quantity: item.quantity || 1,
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    setIsRefreshing(true);
    try {
      await fetchCart();
      toast({
        title: "Cart refreshed",
        description: "Your cart has been updated with the latest information",
      });
    } catch (error) {
      console.error('Error refreshing cart:', error);
      toast({
        title: "Error",
        description: "Failed to refresh cart",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Adding to cart...",
        description: "Please wait",
      });

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('quantity, name, price, image_url')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      if (product.quantity <= 0) {
        toast({
          title: "Out of stock",
          description: "This item is currently out of stock",
          variant: "destructive",
        });
        return false;
      }

      const { data: existingCartItem } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      const currentCartQuantity = existingCartItem?.quantity || 0;

      if (currentCartQuantity >= product.quantity) {
        toast({
          title: "Cannot add more",
          description: "Not enough stock available",
          variant: "destructive",
        });
        return false;
      }

      const newQuantity = currentCartQuantity + 1;

      if (existingCartItem) {
        setCartItems(prev =>
          prev.map(item =>
            item.id === existingCartItem.id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        const newItem = {
          id: `temp-${Date.now()}`,
          product_id: productId,
          name: product.name || '',
          price: Number(product.price) || 0,
          image_url: product.image_url || '',
          stock: product.quantity,
          quantity: 1,
        };
        setCartItems(prev => [...prev, newItem]);
      }

      const { data: cartData, error } = await supabase
        .from('cart')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity: newQuantity,
        }, {
          onConflict: 'user_id,product_id'
        })
        .select()
        .single();

      if (error) throw error;

      if (!existingCartItem) {
        setCartItems(prev =>
          prev.map(item =>
            item.id.startsWith('temp-') && item.product_id === productId
              ? { ...item, id: cartData.id }
              : item
          )
        );
      }

      toast({
        title: "Added to cart!",
        description: "Item has been added to your cart",
      });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      await fetchCart();
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateQuantity = async (cartId: string, newQuantity: number, productId: string) => {
    if (newQuantity < 1) {
      await removeFromCart(cartId);
      return;
    }

    const previousItems = [...cartItems];
    setCartItems(prev =>
      prev.map(item =>
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('quantity')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      if (newQuantity > product.quantity) {
        setCartItems(previousItems);
        toast({
          title: "Not enough stock",
          description: `Only ${product.quantity} items available`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', cartId);

      if (error) throw error;

    } catch (error) {
      console.error('Error updating quantity:', error);
      setCartItems(previousItems);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartId: string) => {
    const previousItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item.id !== cartId));

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) throw error;

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      setCartItems(previousItems);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const createOrder = async () => {
    if (!user || cartItems.length === 0) {
      return null;
    }

    try {
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const orderItems = cartItems.map(item => ({
        id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image_url,
        productId: item.product_id
      }));

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: orderItems,
          quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          amount: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      for (const item of cartItems) {
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.product_id)
          .single();

        if (fetchError) {
          console.error('Error fetching product stock for deduction:', fetchError);
          continue;
        }

        const newStock = Math.max(0, (product.quantity || 0) - item.quantity);
        
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            quantity: newStock
          })
          .eq('id', item.product_id);

        if (stockError) {
          console.error('Error updating stock for product:', item.product_id, stockError);
        } else {
          console.log(`Stock deducted for product ${item.product_id}: ${product.quantity} -> ${newStock}`);
        }
      }

      await clearCart();

      toast({
        title: "Order created successfully!",
        description: "Stock has been updated for all ordered items.",
      });

      return orderData;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();

    if (!user) return;

    const cartChannel = supabase
      .channel('cart-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cart',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Cart updated:', payload);
          fetchCart();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(cartChannel);
    };
  }, [user]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cartItems,
    loading,
    cartItemCount,
    cartTotal,
    isRefreshing,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    refreshCart,
    createOrder,
    clearCart,
  };
};
