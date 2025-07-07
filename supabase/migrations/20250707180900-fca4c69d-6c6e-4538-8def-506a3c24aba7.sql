
-- Add category column to products table
ALTER TABLE public.products ADD COLUMN category TEXT;

-- Create order_tracking table for detailed tracking information
CREATE TABLE public.order_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  status TEXT NOT NULL,
  location TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to order_tracking table
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view tracking for their own orders
CREATE POLICY "Users can view tracking for their own orders" 
  ON public.order_tracking 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_tracking.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Create policy that allows inserting tracking data (for system/admin use)
CREATE POLICY "System can insert order tracking" 
  ON public.order_tracking 
  FOR INSERT 
  WITH CHECK (true);

-- Update existing products with default categories (optional)
UPDATE public.products 
SET category = CASE 
  WHEN name ILIKE '%headphone%' OR name ILIKE '%earphone%' OR name ILIKE '%audio%' THEN 'headphones'
  WHEN name ILIKE '%smart%' OR name ILIKE '%home%' OR name ILIKE '%iot%' THEN 'smart-home'
  WHEN name ILIKE '%watch%' OR name ILIKE '%band%' OR name ILIKE '%accessory%' THEN 'accessories'
  WHEN name ILIKE '%phone%' OR name ILIKE '%mobile%' OR name ILIKE '%smartphone%' THEN 'mobile'
  WHEN name ILIKE '%laptop%' OR name ILIKE '%computer%' OR name ILIKE '%pc%' THEN 'computers'
  ELSE 'electronics'
END
WHERE category IS NULL;
