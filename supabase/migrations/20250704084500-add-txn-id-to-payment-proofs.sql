
-- Add transaction ID field to payment_proofs table
ALTER TABLE public.payment_proofs 
ADD COLUMN txn_id TEXT;
