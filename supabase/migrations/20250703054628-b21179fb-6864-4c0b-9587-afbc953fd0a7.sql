
-- Update products table to match your specification
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0;

-- Rename 'name' column to 'title' if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='name') THEN
        ALTER TABLE products RENAME COLUMN name TO title;
    END IF;
END $$;

-- Update cart table to match your specification
ALTER TABLE cart 
ADD COLUMN IF NOT EXISTS inserted_at timestamp DEFAULT now();

-- Rename 'created_at' to 'inserted_at' if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart' AND column_name='created_at') THEN
        ALTER TABLE cart RENAME COLUMN created_at TO inserted_at;
    END IF;
END $$;

-- Add unique constraint to prevent duplicate cart entries
ALTER TABLE cart 
ADD CONSTRAINT IF NOT EXISTS unique_user_product UNIQUE (user_id, product_id);

-- Add some sample products for testing
INSERT INTO products (title, description, image_url, price, stock) VALUES
('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 199.99, 50),
('Smartphone', 'Latest flagship smartphone with advanced camera', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 699.99, 30),
('Laptop', 'Powerful laptop for work and gaming', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 1299.99, 20),
('Coffee Maker', 'Premium coffee maker for your morning brew', 'https://images.unsplash.com/photo-1544787365-4a6ce9e2c999?w=500', 149.99, 40),
('Running Shoes', 'Comfortable running shoes for all terrains', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 89.99, 100)
ON CONFLICT (id) DO NOTHING;
