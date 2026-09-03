-- Fix RLS for West Flora Admin (password-based admin, not Supabase Auth)
-- Run this in Supabase SQL Editor

-- PRODUCTS: allow add / edit / delete from admin
DROP POLICY IF EXISTS "Admin manage products" ON products;

CREATE POLICY "Allow product insert"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow product update"
  ON products FOR UPDATE
  USING (true);

CREATE POLICY "Allow product delete"
  ON products FOR DELETE
  USING (true);

-- CATEGORIES
DROP POLICY IF EXISTS "Admin manage categories" ON categories;

CREATE POLICY "Allow category insert"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow category update"
  ON categories FOR UPDATE
  USING (true);

CREATE POLICY "Allow category delete"
  ON categories FOR DELETE
  USING (true);

-- ORDERS: allow admin to update status and manage orders
DROP POLICY IF EXISTS "Admin manage orders" ON orders;

CREATE POLICY "Allow order select"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Allow order update"
  ON orders FOR UPDATE
  USING (true);

CREATE POLICY "Allow order delete"
  ON orders FOR DELETE
  USING (true);

-- ORDER ITEMS
DROP POLICY IF EXISTS "Admin manage order_items" ON order_items;

CREATE POLICY "Allow order_items select"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Allow order_items update"
  ON order_items FOR UPDATE
  USING (true);

CREATE POLICY "Allow order_items delete"
  ON order_items FOR DELETE
  USING (true);

-- PROMOTIONS
DROP POLICY IF EXISTS "Admin manage promotions" ON promotions;
DROP POLICY IF EXISTS "Public read promotions" ON promotions;

CREATE POLICY "Allow promotion select"
  ON promotions FOR SELECT
  USING (true);

CREATE POLICY "Allow promotion insert"
  ON promotions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow promotion update"
  ON promotions FOR UPDATE
  USING (true);

CREATE POLICY "Allow promotion delete"
  ON promotions FOR DELETE
  USING (true);
