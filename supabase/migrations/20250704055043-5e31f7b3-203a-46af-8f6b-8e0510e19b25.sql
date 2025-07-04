
-- Add mobile column to profiles table
ALTER TABLE public.profiles ADD COLUMN mobile TEXT;

-- Create a seller_profiles table for seller-specific information
CREATE TABLE public.seller_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT,
  business_address TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to seller_profiles
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for seller_profiles
CREATE POLICY "Users can view their own seller profile" 
  ON public.seller_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seller profile" 
  ON public.seller_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile" 
  ON public.seller_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Update products table to allow sellers to insert products
CREATE POLICY "Approved sellers can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seller_profiles 
      WHERE user_id = auth.uid() AND is_approved = true
    )
  );

CREATE POLICY "Sellers can update their own products" 
  ON public.products 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.seller_profiles 
      WHERE user_id = auth.uid() AND is_approved = true
    )
  );

-- Add seller_id column to products table to track who uploaded each product
ALTER TABLE public.products ADD COLUMN seller_id UUID REFERENCES auth.users;

-- Update the products insert policy to set seller_id
DROP POLICY IF EXISTS "Approved sellers can insert products" ON public.products;
CREATE POLICY "Approved sellers can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seller_profiles 
      WHERE user_id = auth.uid() AND is_approved = true
    ) AND seller_id = auth.uid()
  );
