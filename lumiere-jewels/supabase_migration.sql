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
DROP POLICY IF EXISTS "Allow update for service role" ON public.orders;
DROP POLICY IF EXISTS "Allow public order submissions" ON public.orders;
DROP POLICY IF EXISTS "Admins can read orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Only a new pending order may be submitted publicly. The browser generates its
-- UUID before inserting, so no public SELECT policy is needed to obtain it.
CREATE POLICY "Allow public order submissions" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');


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
DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;
DROP POLICY IF EXISTS "Allow public analytics inserts" ON public.page_views;
CREATE POLICY "Allow public analytics inserts" ON public.page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);


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
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public category reads" ON public.categories;
CREATE POLICY "Allow public category reads" ON public.categories
  FOR SELECT TO anon, authenticated USING (is_active = true);

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


-- 4. ADMIN ALLOWLIST AND PRIVATE DATA POLICIES
-- Bootstrap only the oldest existing Supabase account as the initial admin.
-- New accounts never become admins automatically.
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_users FROM anon, authenticated;

INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE POLICY "Admins can read orders" ON public.orders
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY "Admins can read page views" ON public.page_views
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- A UUID in a private order link acts as a capability token. This function
-- returns only that one order and cannot be used to list the orders table.
CREATE OR REPLACE FUNCTION public.get_public_order(order_id UUID)
RETURNS SETOF public.orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT * FROM public.orders WHERE id = order_id LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_order(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_order(UUID) TO anon, authenticated;


-- 5. ADD FAVORITES COUNT TO PRODUCTS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;


-- 6. FAVORITES FUNCTIONS
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

-- Disable direct public counter manipulation until favorites are backed by a
-- per-visitor table with a uniqueness constraint.
REVOKE ALL ON FUNCTION public.increment_favorite(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.decrement_favorite(UUID) FROM PUBLIC, anon, authenticated;
