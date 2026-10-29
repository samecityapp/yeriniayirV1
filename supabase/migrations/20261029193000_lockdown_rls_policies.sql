/*
  # Security Hardening Phase 2 — Lockdown Permissive RLS Policies

  ## Tespit Edilen Kritik Açıklar (Düzeltilen)
  1. `20260207210000_create_restaurant_tables.sql`:
     - `restaurant_categories`, `restaurants`, `restaurant_notes` tablolarında
       `CREATE POLICY "Enable all access for all users" ... FOR ALL USING (true) WITH CHECK (true)`
       bulunuyordu. Anon key ile herkes veri silebilir/ekleyebilirdi.
  2. `20260207180500_fix_group_hotels_rls.sql`:
     - `group_hotels` tablosunda `FOR ALL TO public USING (true) WITH CHECK (true)` açıktı.
  3. `20260208_fix_offers_rls.sql`:
     - `offers` tablosunda `Allow public insert/update/delete access` politikaları açıktı.

  ## Çözüm
  - Tüm tablolarda `SELECT` (okuma) işlemi `anon` ve `authenticated` için açık tutulur (canlı siteyi bozmaz).
  - Tüm `INSERT`, `UPDATE`, `DELETE` işlemleri `anon` rolüne kapatılır; yalnızca `service_role` (sunucu tarafı güvenli admin istemcisi) veya `profiles.role = 'admin'` olan doğrulanmış yöneticilere izin verilir.
*/

-- Yardımcı admin doğrulama fonksiyonu
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    (auth.jwt() ->> 'role') = 'service_role'
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    );
$$;

-- =========================================================
-- 1. RESTAURANT_CATEGORIES, RESTAURANTS, RESTAURANT_NOTES
-- =========================================================
ALTER TABLE IF EXISTS public.restaurant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restaurant_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for all users" ON public.restaurant_categories;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.restaurants;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.restaurant_notes;
DROP POLICY IF EXISTS "Public can insert restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Public can update restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Public can delete restaurants" ON public.restaurants;

-- Public Read
DROP POLICY IF EXISTS "Anyone can read restaurant_categories" ON public.restaurant_categories;
CREATE POLICY "Anyone can read restaurant_categories"
  ON public.restaurant_categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read restaurants" ON public.restaurants;
CREATE POLICY "Anyone can read restaurants"
  ON public.restaurants FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read restaurant_notes" ON public.restaurant_notes;
CREATE POLICY "Anyone can read restaurant_notes"
  ON public.restaurant_notes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin-Only Write
DROP POLICY IF EXISTS "Admins can manage restaurant_categories" ON public.restaurant_categories;
CREATE POLICY "Admins can manage restaurant_categories"
  ON public.restaurant_categories FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can manage restaurants" ON public.restaurants;
CREATE POLICY "Admins can manage restaurants"
  ON public.restaurants FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can manage restaurant_notes" ON public.restaurant_notes;
CREATE POLICY "Admins can manage restaurant_notes"
  ON public.restaurant_notes FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- =========================================================
-- 2. GROUP_HOTELS TABLE
-- =========================================================
ALTER TABLE IF EXISTS public.group_hotels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable write access for group_hotels" ON public.group_hotels;
DROP POLICY IF EXISTS "Public can insert group_hotels" ON public.group_hotels;
DROP POLICY IF EXISTS "Public can update group_hotels" ON public.group_hotels;
DROP POLICY IF EXISTS "Public can delete group_hotels" ON public.group_hotels;

DROP POLICY IF EXISTS "Anyone can read group_hotels" ON public.group_hotels;
CREATE POLICY "Anyone can read group_hotels"
  ON public.group_hotels FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage group_hotels" ON public.group_hotels;
CREATE POLICY "Admins can manage group_hotels"
  ON public.group_hotels FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- =========================================================
-- 3. OFFERS TABLE
-- =========================================================
ALTER TABLE IF EXISTS public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert access" ON public.offers;
DROP POLICY IF EXISTS "Allow public update access" ON public.offers;
DROP POLICY IF EXISTS "Allow public delete access" ON public.offers;

DROP POLICY IF EXISTS "Allow public read access" ON public.offers;
CREATE POLICY "Allow public read access"
  ON public.offers FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage offers" ON public.offers;
CREATE POLICY "Admins can manage offers"
  ON public.offers FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
