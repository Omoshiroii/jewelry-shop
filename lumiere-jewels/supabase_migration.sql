-- ==========================================
-- LILOOK — DATABASE MIGRATION SCRIPT
-- ==========================================
-- Paste this entire script in:
-- Supabase Dashboard → SQL Editor → New Query → Run

-- 1. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_company TEXT,
  customer_apartment TEXT,
  customer_city TEXT NOT NULL,
  customer_zip TEXT,
  customer_country TEXT DEFAULT 'Maroc' NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public inserts" ON public.orders;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.orders;
DROP POLICY IF EXISTS "Allow all for service role" ON public.orders;
CREATE POLICY "Allow public inserts" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow update for service role" ON public.orders FOR UPDATE USING (true);


-- 2. CREATE PAGE VIEWS TABLE
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  user_agent TEXT
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public inserts" ON public.page_views;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.page_views;
CREATE POLICY "Allow public inserts" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for everyone" ON public.page_views FOR SELECT USING (true);


-- 3. CREATE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.categories;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.categories;
CREATE POLICY "Allow select for everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow all for authenticated" ON public.categories FOR ALL USING (true);

-- Seed default categories without emojis
INSERT INTO public.categories (name, slug, display_order) VALUES
  ('Bagues', 'bagues', 1),
  ('Colliers', 'colliers', 2),
  ('Bracelets', 'bracelets', 3),
  ('Boucles d''oreilles', 'boucles', 4),
  ('Traditionnel', 'traditionnel', 5),
  ('Pendentifs', 'pendentifs', 6),
  ('Ensembles', 'ensembles', 7)
ON CONFLICT (slug) DO NOTHING;


-- 4. ADD FAVORITES COUNT TO PRODUCTS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;


-- 5. FAVORITES FUNCTIONS
CREATE OR REPLACE FUNCTION public.increment_favorite(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET favorites_count = COALESCE(favorites_count, 0) + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrement_favorite(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET favorites_count = GREATEST(0, COALESCE(favorites_count, 0) - 1)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
