
-- Create payment_proofs table for storing payment confirmations
CREATE TABLE public.payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  payment_amount NUMERIC NOT NULL,
  uploaded_file TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment proofs
CREATE POLICY "Users can view their own payment proofs"
  ON public.payment_proofs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payment proofs
CREATE POLICY "Users can insert their own payment proofs"
  ON public.payment_proofs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-screenshots', 'payment-screenshots', true);

-- Allow authenticated users to upload payment screenshots
CREATE POLICY "Users can upload payment screenshots"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow users to view payment screenshots
CREATE POLICY "Users can view payment screenshots"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'payment-screenshots');
