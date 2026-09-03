-- West Flora E-commerce Database Schema
-- Run this in your Supabase SQL Editor

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_sale BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_method TEXT DEFAULT 'cod',
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT DEFAULT '',
  quantity INTEGER NOT NULL,
  size TEXT DEFAULT '',
  color TEXT DEFAULT '',
  price NUMERIC NOT NULL
);

-- Promotions
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT UNIQUE,
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage','fixed')),
  discount_value NUMERIC NOT NULL,
  min_order NUMERIC,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Public read for products and categories
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read promotions" ON promotions FOR SELECT USING (true);

-- Allow writes for password-based admin (uses anon key, not Supabase Auth)
CREATE POLICY "Allow product insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow product update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow product delete" ON products FOR DELETE USING (true);

CREATE POLICY "Allow category insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow category update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow category delete" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow order select" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow order update" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow order delete" ON orders FOR DELETE USING (true);

CREATE POLICY "Allow order_items select" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow order_items update" ON order_items FOR UPDATE USING (true);
CREATE POLICY "Allow order_items delete" ON order_items FOR DELETE USING (true);

CREATE POLICY "Allow promotion insert" ON promotions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow promotion update" ON promotions FOR UPDATE USING (true);
CREATE POLICY "Allow promotion delete" ON promotions FOR DELETE USING (true);

-- Public can insert orders (checkout)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Seed categories
INSERT INTO categories (name, slug) VALUES
  ('Abayas', 'abayas'),
  ('Hijabs', 'hijabs'),
  ('Modest Dresses', 'modest-dresses'),
  ('Kurtis', 'kurtis'),
  ('Co-ord Sets', 'co-ord-sets'),
  ('Accessories', 'accessories');
