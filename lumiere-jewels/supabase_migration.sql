-- ==========================================
-- LUMIÈRE JEWELS - DATABASE MIGRATION SCRIPT
-- ==========================================
-- Please copy and paste this entire script into your Supabase Dashboard SQL Editor
-- (https://supabase.com -> Project -> SQL Editor -> New Query) and click Run.

-- 1. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT null,
  customer_name TEXT NOT null,
  customer_phone TEXT NOT null,
  customer_address TEXT NOT null,
  customer_city TEXT NOT null,
  customer_zip TEXT,
  customer_country TEXT DEFAULT 'Maroc' NOT null,
  items JSONB NOT null, -- JSON array of ordered items: [{ id, title, price, quantity, image }]
  total_price NUMERIC NOT null,
  status TEXT DEFAULT 'pending' NOT null -- pending, confirmed, shipped, cancelled
);

-- Enable RLS for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public inserts" ON public.orders;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.orders;
DROP POLICY IF EXISTS "Allow all for service role" ON public.orders;

-- Create policies for public inserts and admin access
CREATE POLICY "Allow public inserts" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow all for service role" ON public.orders FOR ALL USING (true);


-- 2. CREATE PAGE VIEWS TABLE (FOR TRAFFIC STATISTICS)
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT null,
  session_id TEXT NOT null, -- Persistent unique session ID per visitor
  page_path TEXT NOT null,
  user_agent TEXT
);

-- Enable RLS for page_views table
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public inserts" ON public.page_views;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.page_views;

-- Create policies for page views
CREATE POLICY "Allow public inserts" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for everyone" ON public.page_views FOR SELECT USING (true);


-- 3. ADD FAVORITES COUNT TO PRODUCTS TABLE
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;


-- 4. CREATE FUNCTION TO ATOMICALLY INCREMENT FAVORITES
CREATE OR REPLACE FUNCTION public.increment_favorite(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET favorites_count = COALESCE(favorites_count, 0) + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. CREATE FUNCTION TO ATOMICALLY DECREMENT FAVORITES
CREATE OR REPLACE FUNCTION public.decrement_favorite(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET favorites_count = GREATEST(0, COALESCE(favorites_count, 0) - 1)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
