
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface SellerProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  business_address: string | null;
  is_approved: boolean | null;
  created_at: string;
  updated_at: string;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
  category: string;
}

export const useSeller = () => {
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSellerProfile = async () => {
    if (!user) {
      setSellerProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setSellerProfile(data);
    } catch (error) {
      console.error('Error fetching seller profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSellerProfile = async (businessName: string, businessAddress: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('seller_profiles')
        .insert({
          user_id: user.id,
          business_name: businessName,
          business_address: businessAddress,
        })
        .select()
        .single();

      if (error) throw error;

      setSellerProfile(data);
      toast({
        title: "Success",
        description: "Seller profile created! Waiting for approval.",
      });
      return true;
    } catch (error) {
      console.error('Error creating seller profile:', error);
      toast({
        title: "Error",
        description: "Failed to create seller profile",
        variant: "destructive",
      });
      return false;
    }
  };

  const addProduct = async (productData: ProductData) => {
    if (!user || !sellerProfile?.is_approved) {
      toast({
        title: "Error",
        description: "You need to be an approved seller to add products",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          ...productData,
          seller_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSellerProfile();
  }, [user]);

  return {
    sellerProfile,
    loading,
    createSellerProfile,
    addProduct,
    fetchSellerProfile,
  };
};
