-- Forward Migration (Paket 10C):
--   B1: Ensure storage.objects policies only restrict 'restaurant-images' (forward repair for any DB where 10B ran)
--   B2: Close direct anonymous / client REST INSERT paths on analytics_events and hotel_clicks
--       while keeping server-side service_role writes and MFA admin reads intact.
--   B6: Transactional RPCs for atomic admin writes (restaurants + notes, groups + group_hotels).
--
-- IMPORTANT: Prepare forward migration cleanly; NEVER run against live production/staging DB without explicit operator approval.

BEGIN;

-- =============================================================================
-- 1. (B1) Idempotent Storage Scope Repair — never block non-restaurant buckets
-- =============================================================================
DO $$
BEGIN
  IF to_regclass('storage.objects') IS NOT NULL THEN
    DROP POLICY IF EXISTS ya_mfa_admin_storage_perm_insert ON storage.objects;
    DROP POLICY IF EXISTS ya_mfa_admin_storage_perm_update ON storage.objects;
    DROP POLICY IF EXISTS ya_mfa_admin_storage_perm_delete ON storage.objects;
    DROP POLICY IF EXISTS ya_mfa_admin_storage_guard_insert ON storage.objects;
    DROP POLICY IF EXISTS ya_mfa_admin_storage_guard_update ON storage.objects;
    DROP POLICY IF EXISTS ya_mfa_admin_storage_guard_delete ON storage.objects;

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
      WITH CHECK (bucket_id <> 'restaurant-images' OR public.is_admin_user());
    CREATE POLICY ya_mfa_admin_storage_guard_update
      ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
      USING (bucket_id <> 'restaurant-images' OR public.is_admin_user())
      WITH CHECK (bucket_id <> 'restaurant-images' OR public.is_admin_user());
    CREATE POLICY ya_mfa_admin_storage_guard_delete
      ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
      USING (bucket_id <> 'restaurant-images' OR public.is_admin_user());
  END IF;
END
$$;

-- =============================================================================
-- 2. (B2) Close Direct Anonymous / Client REST INSERT on Telemetry Tables
-- =============================================================================
DO $$
DECLARE
  pol record;
  has_service_role boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') INTO has_service_role;

  IF to_regclass('public.analytics_events') IS NOT NULL THEN
    ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'analytics_events'
        AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.analytics_events', pol.policyname);
    END LOOP;

    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.analytics_events FROM PUBLIC, anon, authenticated;
    REVOKE SELECT ON TABLE public.analytics_events FROM PUBLIC, anon;
    GRANT SELECT ON TABLE public.analytics_events TO authenticated;
    IF has_service_role THEN
      GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.analytics_events TO service_role;
    END IF;

    DROP POLICY IF EXISTS ya_mfa_admin_analytics_block_client_insert ON public.analytics_events;
    CREATE POLICY ya_mfa_admin_analytics_block_client_insert
      ON public.analytics_events AS RESTRICTIVE FOR INSERT TO anon, authenticated
      WITH CHECK (false);

    DROP POLICY IF EXISTS ya_mfa_admin_analytics_update_guard ON public.analytics_events;
    CREATE POLICY ya_mfa_admin_analytics_update_guard
      ON public.analytics_events AS RESTRICTIVE FOR UPDATE TO anon, authenticated
      USING (false) WITH CHECK (false);

    DROP POLICY IF EXISTS ya_mfa_admin_analytics_delete_guard ON public.analytics_events;
    CREATE POLICY ya_mfa_admin_analytics_delete_guard
      ON public.analytics_events AS RESTRICTIVE FOR DELETE TO anon, authenticated
      USING (false);
  END IF;

  IF to_regclass('public.hotel_clicks') IS NOT NULL THEN
    ALTER TABLE public.hotel_clicks ENABLE ROW LEVEL SECURITY;

    FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'hotel_clicks'
        AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.hotel_clicks', pol.policyname);
    END LOOP;

    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.hotel_clicks FROM PUBLIC, anon, authenticated;
    REVOKE SELECT ON TABLE public.hotel_clicks FROM PUBLIC, anon;
    GRANT SELECT ON TABLE public.hotel_clicks TO authenticated;
    IF has_service_role THEN
      GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.hotel_clicks TO service_role;
    END IF;

    DROP POLICY IF EXISTS ya_mfa_admin_clicks_block_client_insert ON public.hotel_clicks;
    CREATE POLICY ya_mfa_admin_clicks_block_client_insert
      ON public.hotel_clicks AS RESTRICTIVE FOR INSERT TO anon, authenticated
      WITH CHECK (false);

    DROP POLICY IF EXISTS ya_mfa_admin_clicks_update_guard ON public.hotel_clicks;
    CREATE POLICY ya_mfa_admin_clicks_update_guard
      ON public.hotel_clicks AS RESTRICTIVE FOR UPDATE TO anon, authenticated
      USING (false) WITH CHECK (false);

    DROP POLICY IF EXISTS ya_mfa_admin_clicks_delete_guard ON public.hotel_clicks;
    CREATE POLICY ya_mfa_admin_clicks_delete_guard
      ON public.hotel_clicks AS RESTRICTIVE FOR DELETE TO anon, authenticated
      USING (false);
  END IF;
END
$$;

-- =============================================================================
-- 3. (B6) Atomic Admin Mutation RPCs (Single PostgreSQL Transaction)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.ya_admin_save_restaurant(
  p_id uuid,
  p_restaurant jsonb,
  p_notes jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_existing public.restaurants%ROWTYPE;
  v_row public.restaurants%ROWTYPE;
  v_note_row public.restaurant_notes%ROWTYPE;
  v_restaurant_id uuid;
  v_payload jsonb;
  v_note jsonb;
  v_idx integer;
  v_note_count integer;
  v_note_text text;
BEGIN
  IF current_user <> 'service_role' AND NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
  END IF;

  IF p_restaurant IS NULL OR jsonb_typeof(p_restaurant) <> 'object' THEN
    RAISE EXCEPTION 'invalid_restaurant_payload' USING ERRCODE = '22023';
  END IF;

  IF p_notes IS NOT NULL AND jsonb_typeof(p_notes) <> 'array' THEN
    RAISE EXCEPTION 'invalid_notes_payload' USING ERRCODE = '22023';
  END IF;

  IF p_id IS NOT NULL THEN
    SELECT * INTO v_existing
    FROM public.restaurants
    WHERE id = p_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'restaurant_not_found' USING ERRCODE = 'P0002';
    END IF;

    v_row := jsonb_populate_record(
      v_existing,
      p_restaurant || jsonb_build_object('id', p_id)
    );

    UPDATE public.restaurants
    SET
      category_id = v_row.category_id,
      location = v_row.location,
      name = v_row.name,
      image_url = v_row.image_url,
      description = v_row.description,
      google_rating = v_row.google_rating,
      review_count = v_row.review_count,
      order_suggestion = v_row.order_suggestion,
      display_order = v_row.display_order
    WHERE id = p_id;

    v_restaurant_id := p_id;
  ELSE
    v_restaurant_id := gen_random_uuid();
    v_payload := jsonb_build_object(
      'image_url', '',
      'description', '',
      'google_rating', 0,
      'review_count', '',
      'order_suggestion', '',
      'display_order', 0
    ) || p_restaurant || jsonb_build_object('id', v_restaurant_id);

    v_row := jsonb_populate_record(NULL::public.restaurants, v_payload);

    INSERT INTO public.restaurants (
      id,
      category_id,
      location,
      name,
      image_url,
      description,
      google_rating,
      review_count,
      order_suggestion,
      display_order
    ) VALUES (
      v_row.id,
      v_row.category_id,
      v_row.location,
      v_row.name,
      v_row.image_url,
      v_row.description,
      v_row.google_rating,
      v_row.review_count,
      v_row.order_suggestion,
      v_row.display_order
    );
  END IF;

  DELETE FROM public.restaurant_notes
  WHERE restaurant_id = v_restaurant_id;

  v_note_count := COALESCE(jsonb_array_length(p_notes), 0);
  IF v_note_count > 20 THEN
    RAISE EXCEPTION 'too_many_restaurant_notes' USING ERRCODE = '22023';
  END IF;

  IF v_note_count > 0 THEN
    FOR v_idx IN 0 .. (v_note_count - 1) LOOP
      v_note := p_notes -> v_idx;
      IF jsonb_typeof(v_note) <> 'object' THEN
        RAISE EXCEPTION 'invalid_restaurant_note' USING ERRCODE = '22023';
      END IF;

      v_note_text := COALESCE(btrim(v_note ->> 'text'), '');
      IF v_note_text = '' THEN
        RAISE EXCEPTION 'empty_restaurant_note_text' USING ERRCODE = '22023';
      END IF;

      v_note_row := jsonb_populate_record(
        NULL::public.restaurant_notes,
        jsonb_build_object(
          'restaurant_id', v_restaurant_id,
          'emoji', COALESCE(v_note ->> 'emoji', ''),
          'text', v_note -> 'text',
          'display_order', CASE
            WHEN (v_note ? 'display_order') AND jsonb_typeof(v_note -> 'display_order') = 'number'
            THEN (v_note ->> 'display_order')::integer
            ELSE v_idx
          END
        )
      );

      INSERT INTO public.restaurant_notes (
        restaurant_id,
        emoji,
        text,
        display_order
      ) VALUES (
        v_note_row.restaurant_id,
        v_note_row.emoji,
        v_note_row.text,
        v_note_row.display_order
      );
    END LOOP;
  END IF;

  RETURN v_restaurant_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.ya_admin_save_group(
  p_id uuid,
  p_title text,
  p_domains text[] DEFAULT '{}'::text[],
  p_hotel_ids uuid[] DEFAULT '{}'::uuid[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_group_id uuid;
  v_has_domains boolean;
  v_has_display_order boolean;
  v_order_col text;
  v_idx integer;
  v_hotel_id uuid;
  v_hotel_count integer;
BEGIN
  IF current_user <> 'service_role' AND NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
  END IF;

  IF p_title IS NULL OR btrim(p_title) = '' THEN
    RAISE EXCEPTION 'invalid_group_title' USING ERRCODE = '22023';
  END IF;

  v_hotel_count := COALESCE(array_length(p_hotel_ids, 1), 0);
  IF v_hotel_count < 1 OR v_hotel_count > 20 THEN
    RAISE EXCEPTION 'invalid_group_hotel_ids' USING ERRCODE = '22023';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'groups' AND column_name = 'domains'
  ) INTO v_has_domains;

  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_hotels' AND column_name = 'display_order'
  ) INTO v_has_display_order;

  v_order_col := CASE WHEN v_has_display_order THEN 'display_order' ELSE 'order_index' END;

  IF p_id IS NOT NULL THEN
    IF v_has_domains THEN
      UPDATE public.groups
      SET
        title = p_title,
        domains = COALESCE(p_domains, '{}'::text[]),
        updated_at = now()
      WHERE id = p_id
      RETURNING id INTO v_group_id;
    ELSE
      UPDATE public.groups
      SET
        title = p_title,
        updated_at = now()
      WHERE id = p_id
      RETURNING id INTO v_group_id;
    END IF;

    IF v_group_id IS NULL THEN
      RAISE EXCEPTION 'group_not_found' USING ERRCODE = 'P0002';
    END IF;
  ELSE
    IF v_has_domains THEN
      INSERT INTO public.groups (title, is_published, domains)
      VALUES (p_title, false, COALESCE(p_domains, '{}'::text[]))
      RETURNING id INTO v_group_id;
    ELSE
      INSERT INTO public.groups (title, is_published)
      VALUES (p_title, false)
      RETURNING id INTO v_group_id;
    END IF;
  END IF;

  DELETE FROM public.group_hotels
  WHERE group_id = v_group_id;

  FOR v_idx IN 1 .. v_hotel_count LOOP
    v_hotel_id := p_hotel_ids[v_idx];
    IF v_hotel_id IS NULL THEN
      RAISE EXCEPTION 'null_group_hotel_id' USING ERRCODE = '22023';
    END IF;

    EXECUTE format(
      'INSERT INTO public.group_hotels (group_id, hotel_id, %I) VALUES ($1, $2, $3)',
      v_order_col
    )
    USING v_group_id, v_hotel_id, (v_idx - 1);
  END LOOP;

  RETURN v_group_id;
END;
$$;

REVOKE ALL ON FUNCTION public.ya_admin_save_restaurant(uuid, jsonb, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ya_admin_save_restaurant(uuid, jsonb, jsonb) TO authenticated;

REVOKE ALL ON FUNCTION public.ya_admin_save_group(uuid, text, text[], uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ya_admin_save_group(uuid, text, text[], uuid[]) TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION public.ya_admin_save_restaurant(uuid, jsonb, jsonb) TO service_role;
    GRANT EXECUTE ON FUNCTION public.ya_admin_save_group(uuid, text, text[], uuid[]) TO service_role;
  END IF;
END
$$;

COMMIT;
