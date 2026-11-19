-- ============================================================================
-- GÖREV 10B (F1) — Enforce Cloud Admin Membership + MFA (aal2) Across All Legacy Tables
-- Forward migration ONLY (does not rewrite applied historical migrations).
-- Replaces legacy public.is_admin_user() (which previously trusted profiles.role/is_admin
-- without aal2 or ya_private.admin_members), purges permissive legacy authenticated write
-- policies, locks analytics_events/hotel_clicks/audit_logs reads, and protects storage.objects.
-- ============================================================================

BEGIN;

-- 1. Idempotent cloud admin authority schema/table/functions
CREATE SCHEMA IF NOT EXISTS ya_private;
REVOKE ALL ON SCHEMA ya_private FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  IF to_regclass('ya_private.admin_members') IS NULL THEN
    IF to_regclass('auth.users') IS NOT NULL THEN
      CREATE TABLE ya_private.admin_members (
        user_id uuid PRIMARY KEY REFERENCES auth.users(id),
        active boolean NOT NULL DEFAULT true
      );
    ELSE
      CREATE TABLE ya_private.admin_members (
        user_id uuid PRIMARY KEY,
        active boolean NOT NULL DEFAULT true
      );
    END IF;
  END IF;
END
$$;

ALTER TABLE ya_private.admin_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE ya_private.admin_members FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.ya_has_membership()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT auth.uid() IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM ya_private.admin_members a
       WHERE a.user_id = auth.uid()
         AND a.active = true
     );
$$;

CREATE OR REPLACE FUNCTION public.ya_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.ya_has_membership()
     AND coalesce(auth.jwt() ->> 'aal', '') = 'aal2';
$$;

-- Single authoritative admin predicate used by legacy & V2 policies.
-- Legacy profiles.role / profiles.is_admin columns no longer grant any privilege.
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce(auth.jwt() ->> 'role', '') = 'service_role'
      OR public.ya_is_admin();
$$;

REVOKE ALL ON FUNCTION public.ya_has_membership(), public.ya_is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ya_has_membership(), public.ya_is_admin() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon, authenticated, service_role;

-- 2. Purge legacy permissive/unprotected write policies and enforce MFA+membership RLS
DO $$
DECLARE
  admin_tables text[] := ARRAY[
    'restaurants',
    'restaurant_categories',
    'restaurant_notes',
    'hotels',
    'groups',
    'group_hotels',
    'offers',
    'tags',
    'price_tags',
    'search_terms',
    'articles',
    'article_media',
    'gastronomy_regions',
    'gastronomy_categories',
    'gastronomy_venues',
    'gastronomy_sources',
    'gastronomy_venue_decisions',
    'gastronomy_benchmarks'
  ];
  tbl text;
  pol record;
BEGIN
  FOREACH tbl IN ARRAY admin_tables LOOP
    IF to_regclass('public.' || tbl) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);

      -- Drop all legacy INSERT/UPDATE/DELETE/ALL policies except ya_permanent_* emergency holds
      FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
          AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
          AND policyname NOT LIKE 'ya_permanent_%'
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
      END LOOP;

      EXECUTE format(
        'CREATE POLICY ya_mfa_admin_write_perm_insert ON public.%I AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin_user())',
        tbl
      );
      EXECUTE format(
        'CREATE POLICY ya_mfa_admin_write_perm_update ON public.%I AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user())',
        tbl
      );
      EXECUTE format(
        'CREATE POLICY ya_mfa_admin_write_perm_delete ON public.%I AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin_user())',
        tbl
      );

      -- Restrictive guard prevents any forgotten permissive policy from bypassing MFA/membership.
      EXECUTE format(
        'CREATE POLICY ya_mfa_admin_write_guard_insert ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (public.is_admin_user())',
        tbl
      );
      EXECUTE format(
        'CREATE POLICY ya_mfa_admin_write_guard_update ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user())',
        tbl
      );
      EXECUTE format(
        'CREATE POLICY ya_mfa_admin_write_guard_delete ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (public.is_admin_user())',
        tbl
      );

      -- Ensure MFA admins can still SELECT if a table previously relied only on a dropped FOR ALL policy
      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
          AND cmd IN ('SELECT', 'ALL')
          AND permissive = 'PERMISSIVE'
      ) THEN
        EXECUTE format(
          'CREATE POLICY ya_mfa_admin_read_fallback_select ON public.%I AS PERMISSIVE FOR SELECT TO authenticated USING (public.is_admin_user())',
          tbl
        );
      END IF;
    END IF;
  END LOOP;
END
$$;

-- 3. Protect internal V2 research sources & benchmarks from public SELECT while keeping catalog readable
DO $$
DECLARE
  public_v2_tables text[] := ARRAY[
    'gastronomy_regions',
    'gastronomy_categories',
    'gastronomy_venues',
    'gastronomy_venue_decisions'
  ];
  private_v2_tables text[] := ARRAY[
    'gastronomy_sources',
    'gastronomy_benchmarks'
  ];
  tbl text;
  pol record;
BEGIN
  FOREACH tbl IN ARRAY public_v2_tables LOOP
    IF to_regclass('public.' || tbl) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS ya_v2_public_select ON public.%I', tbl);
      EXECUTE format(
        'CREATE POLICY ya_v2_public_select ON public.%I FOR SELECT TO anon, authenticated USING (true)',
        tbl
      );
    END IF;
  END LOOP;

  FOREACH tbl IN ARRAY private_v2_tables LOOP
    IF to_regclass('public.' || tbl) IS NOT NULL THEN
      FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
          AND cmd = 'SELECT'
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
      END LOOP;
      EXECUTE format(
        'CREATE POLICY ya_v2_admin_select ON public.%I AS PERMISSIVE FOR SELECT TO authenticated USING (public.is_admin_user())',
        tbl
      );
      EXECUTE format(
        'CREATE POLICY ya_v2_admin_select_guard ON public.%I AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (public.is_admin_user())',
        tbl
      );
    END IF;
  END LOOP;
END
$$;

-- 4. Lock telemetry / click tracking / audit log reads and mutations strictly to active MFA admins
DO $$
DECLARE
  pol record;
BEGIN
  IF to_regclass('public.analytics_events') IS NOT NULL THEN
    ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'analytics_events'
        AND cmd IN ('SELECT', 'UPDATE', 'DELETE', 'ALL')
        AND policyname NOT LIKE 'ya_permanent_%'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.analytics_events', pol.policyname);
    END LOOP;
    CREATE POLICY ya_mfa_admin_analytics_select
      ON public.analytics_events AS PERMISSIVE FOR SELECT TO authenticated USING (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_analytics_select_guard
      ON public.analytics_events AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_analytics_update_guard
      ON public.analytics_events AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_analytics_delete_guard
      ON public.analytics_events AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (public.is_admin_user());
  END IF;

  IF to_regclass('public.hotel_clicks') IS NOT NULL THEN
    ALTER TABLE public.hotel_clicks ENABLE ROW LEVEL SECURITY;
    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'hotel_clicks'
        AND cmd IN ('SELECT', 'UPDATE', 'DELETE', 'ALL')
        AND policyname NOT LIKE 'ya_permanent_%'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.hotel_clicks', pol.policyname);
    END LOOP;
    CREATE POLICY ya_mfa_admin_clicks_select
      ON public.hotel_clicks AS PERMISSIVE FOR SELECT TO authenticated USING (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_clicks_select_guard
      ON public.hotel_clicks AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_clicks_update_guard
      ON public.hotel_clicks AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_clicks_delete_guard
      ON public.hotel_clicks AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (public.is_admin_user());
  END IF;

  IF to_regclass('public.audit_logs') IS NOT NULL THEN
    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'audit_logs'
        AND cmd IN ('SELECT', 'UPDATE', 'DELETE', 'ALL')
        AND policyname NOT LIKE 'ya_permanent_%'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.audit_logs', pol.policyname);
    END LOOP;
    CREATE POLICY ya_mfa_admin_audit_select
      ON public.audit_logs AS PERMISSIVE FOR SELECT TO authenticated USING (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_audit_select_guard
      ON public.audit_logs AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_audit_write_guard
      ON public.audit_logs AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
  END IF;
END
$$;

-- 5. Enforce MFA + active membership on restaurant-images storage bucket writes
DO $$
DECLARE
  pol record;
BEGIN
  IF to_regclass('storage.objects') IS NOT NULL THEN
    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
        AND policyname NOT LIKE 'ya_permanent_%'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;

    CREATE POLICY ya_mfa_admin_storage_perm_insert
      ON storage.objects AS PERMISSIVE FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'restaurant-images' AND public.is_admin_user());
    CREATE POLICY ya_mfa_admin_storage_perm_update
      ON storage.objects AS PERMISSIVE FOR UPDATE TO authenticated
      USING (bucket_id = 'restaurant-images' AND public.is_admin_user())
      WITH CHECK (bucket_id = 'restaurant-images' AND public.is_admin_user());
    CREATE POLICY ya_mfa_admin_storage_perm_delete
      ON storage.objects AS PERMISSIVE FOR DELETE TO authenticated
      USING (bucket_id = 'restaurant-images' AND public.is_admin_user());

    CREATE POLICY ya_mfa_admin_storage_guard_insert
      ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated
      WITH CHECK (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_storage_guard_update
      ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
      USING (public.is_admin_user())
      WITH CHECK (public.is_admin_user());
    CREATE POLICY ya_mfa_admin_storage_guard_delete
      ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
      USING (public.is_admin_user());
  END IF;
END
$$;

COMMIT;
